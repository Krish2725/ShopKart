import Product from "../models/product.model.js";
import Customer from "../models/customer.model.js";
import Order from "../models/order.model.js";
import razorpay from "../config/razorpay.js";
import crypto from "crypto";

export const createOrder = async (req, res) => {
  try {
    const shippingAddress = req.body?.shippingAddress;

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required.",
      });
    }

    const {
      fullName,
      phone,
      addressLine1,
      city,
      state,
      pincode,
    } = shippingAddress;

    if (
      !fullName?.trim() ||
      !phone?.trim() ||
      !addressLine1?.trim() ||
      !city?.trim() ||
      !state?.trim() ||
      !pincode?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "All shipping address fields are required.",
      });
    }

    const customer = await Customer.findById(req.customer._id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!customer.cart || customer.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty.",
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Load the latest product data and validate stock
    for (const item of customer.cart) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: "One or more products in your cart no longer exist.",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}.`,
        });
      }

      totalAmount += product.price * item.quantity;

      // Snapshot product information at purchase time
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      });
    }

    // Create ShopKart order in pending state
    const order = await Order.create({
      user: req.customer._id,
      items: orderItems,
      shippingAddress: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        addressLine1: addressLine1.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
      },
      totalAmount,
      status: "PENDING_PAYMENT",
      paymentStatus: "PENDING",
    });

    // Razorpay expects amount in paise
    const amountInPaise = Math.round(totalAmount * 100);

    try {
      // Create Razorpay order on the backend
      const razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: order._id.toString(),
      });

      if (!razorpayOrder || !razorpayOrder.id) {
        throw new Error("Failed to create Razorpay order.");
      }

      order.razorpayOrderId = razorpayOrder.id;
      await order.save();

      return res.status(201).json({
        success: true,
        shopKartOrderId: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: amountInPaise,
        currency: "INR",
        key: process.env.RAZORPAY_KEY_ID,
      });
    } catch (razorpayError) {
      // Razorpay order creation failed.
      // Do not continue with a fake Razorpay order ID.
      console.error(
        "Razorpay Order Creation Error:",
        razorpayError
      );

      // Remove the pending ShopKart order because payment setup failed
      await Order.findByIdAndDelete(order._id);

      return res.status(500).json({
        success: false,
        message: "Failed to create Razorpay payment order.",
      });
    }
  } catch (error) {
    console.error("Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to create order.",
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      shopKartOrderId,
    } = req.body;

    const targetOrderId = orderId || shopKartOrderId;

    if (!targetOrderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required.",
      });
    }

    if (!razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Razorpay order ID is required.",
      });
    }

    if (!razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        message: "Razorpay payment ID is required.",
      });
    }

    if (!razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Razorpay payment signature is required.",
      });
    }

    const order = await Order.findById(targetOrderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Make sure this order belongs to the logged-in user
    if (order.user.toString() !== req.customer._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    // Use the Razorpay order ID stored on our server
    if (!order.razorpayOrderId) {
      return res.status(400).json({
        success: false,
        message: "Razorpay order ID is missing for this order.",
      });
    }

    // Make sure the Razorpay order ID sent by the browser
    // matches the one stored on our server
    if (razorpay_order_id !== order.razorpayOrderId) {
      return res.status(400).json({
        success: false,
        message: "Razorpay order ID does not match.",
      });
    }

    // Create the signature body exactly as required by Razorpay
    const body =
      order.razorpayOrderId + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(body)
      .digest("hex");

    // Mandatory signature verification
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature. Payment verification failed.",
      });
    }

    // Payment is verified successfully
    order.paymentStatus = "PAID";
    order.status = "PLACED";
    order.razorpayPaymentId = razorpay_payment_id;

    await order.save();

    // Clear cart ONLY after successful payment verification
    const customer = await Customer.findById(req.customer._id);

    if (customer) {
      customer.cart = [];
      await customer.save();
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully and order placed.",
      order,
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment verification error.",
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // User can only access their own orders
    if (
      order.user.toString() !== req.customer._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order.",
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.customer._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders.",
    });
  }
};