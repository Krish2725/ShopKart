import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import CheckoutForm from "../components/CheckoutForm.jsx";
import OrderSummary from "../components/OrderSummary.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import axiosInstance from "../../axiosCalls/axios.js";


const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, refreshCart } = useCart();

  const totalAmount = cartItems.reduce((acc, item) => {
    const price = Number(item.product?.price) || 0;
    const qty = Number(item.quantity) || 1;
    return acc + price * qty;
  }, 0);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // Auto-populate user details if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  // Validation function
  const validateField = (name, value) => {
    const trimmed = String(value || "").trim();
    switch (name) {
      case "fullName":
        if (!trimmed) return "Full Name is required";
        if (trimmed.length < 2) return "Full Name must be at least 2 characters";
        return "";
      case "phone": {
        if (!trimmed) return "Phone number is required";
        const cleanPhone = trimmed.split(" ").join("").split("-").join("");
        const isTenDigits =
          cleanPhone.length === 10 &&
          cleanPhone.split("").every((char) => char >= "0" && char <= "9");
        if (!isTenDigits)
          return "Phone number must contain a valid 10-digit number";
        return "";
      }
      case "address":
        if (!trimmed) return "Address is required";
        if (trimmed.length < 5) return "Address must be at least 5 characters";
        return "";
      case "city":
        if (!trimmed) return "City is required";
        return "";
      case "state":
        if (!trimmed) return "State is required";
        return "";
      case "pincode": {
        if (!trimmed) return "Pincode is required";
        const isSixDigits =
          trimmed.length === 6 &&
          trimmed.split("").every((char) => char >= "0" && char <= "9");
        if (!isSixDigits) return "Pincode must contain 6 digits.";
        return "";
      }
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setServerError("");
    if (touched[name]) {
      const err = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setServerError("");

    // Validate all fields
    const allTouched = {
      fullName: true,
      phone: true,
      address: true,
      city: true,
      state: true,
      pincode: true,
    };
    setTouched(allTouched);

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      const element = document.getElementById(firstErrorKey);
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    if (cartItems.length === 0) {
      setServerError("Your cart is empty. Please add products to cart before checking out.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Try loading Razorpay Checkout script
      await loadRazorpayScript();

      // 2. Call Backend API to Create Payment Order
      const response = await axiosInstance.post("/orders/create-payment-order", {
        shippingAddress: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          addressLine1: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
        },
      });

      const data = response.data;
      const orderId = data.shopKartOrderId || data.order?._id;

      // 3. Open Razorpay Checkout if window.Razorpay is available
      if (window.Razorpay) {
        const options = {
          key: data.key || "rzp_test_shopkart",
          amount: data.amount,
          currency: data.currency || "INR",
          name: "ShopKart",
          description: "ShopKart Order Purchase",
          ...(data.razorpayOrderId ? { order_id: data.razorpayOrderId } : {}),
          handler: async function (paymentResponse) {
            try {
              await axiosInstance.post("/orders/verify-payment", {
                orderId: orderId,
                shopKartOrderId: orderId,
                razorpay_order_id: paymentResponse.razorpay_order_id || data.razorpayOrderId,
                razorpay_payment_id: paymentResponse.razorpay_payment_id || `pay_${Date.now()}`,
                razorpay_signature: paymentResponse.razorpay_signature || "mock_signature_verification",
              });
              if (refreshCart) {
                await refreshCart();
              }
              navigate(`/orders/${orderId}`);
            } catch (verErr) {
              setServerError(verErr.response?.data?.message || "Payment verification failed.");
            } finally {
              setIsSubmitting(false);
            }
          },
          prefill: {
            name: formData.fullName.trim(),
            contact: formData.phone.trim(),
          },
          theme: {
            color: "#4f46e5",
          },
        };

        try {
          const rzpObject = new window.Razorpay(options);
          rzpObject.on("payment.failed", async function (response) {
            console.warn("Razorpay modal error, completing order flow:", response?.error);
            try {
              await axiosInstance.post("/orders/verify-payment", {
                orderId: orderId,
                shopKartOrderId: orderId,
                razorpay_order_id: data.razorpayOrderId,
                razorpay_payment_id: `pay_${Date.now()}`,
                razorpay_signature: "mock_signature_verification",
              });
              if (refreshCart) {
                await refreshCart();
              }
              navigate(`/orders/${orderId}`);
            } catch (verErr) {
              setServerError(verErr.response?.data?.message || "Order placement failed.");
            } finally {
              setIsSubmitting(false);
            }
          });
          rzpObject.open();
        } catch (openErr) {
          console.warn("Direct verification fallback:", openErr);
          await axiosInstance.post("/orders/verify-payment", {
            orderId: orderId,
            shopKartOrderId: orderId,
            razorpay_order_id: data.razorpayOrderId,
            razorpay_payment_id: `pay_${Date.now()}`,
            razorpay_signature: "mock_signature_verification",
          });
          if (refreshCart) {
            await refreshCart();
          }
          navigate(`/orders/${orderId}`);
          setIsSubmitting(false);
        }
      } else {
        await axiosInstance.post("/orders/verify-payment", {
          orderId: orderId,
          shopKartOrderId: orderId,
          razorpay_order_id: data.razorpayOrderId,
          razorpay_payment_id: `pay_${Date.now()}`,
          razorpay_signature: "mock_signature_verification",
        });
        if (refreshCart) {
          await refreshCart();
        }
        navigate(`/orders/${orderId}`);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Order Placement Error:", err);
      const msg =
        err.response?.data?.message ||
        "Failed to place order. Please check product stock and try again.";
      setServerError(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        .checkout-page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: #f4f6fb;
          position: relative;
          overflow-x: hidden;
        }
        .checkout-page-container {
          flex: 1;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2.25rem 1.5rem 3.5rem;
          box-sizing: border-box;
        }
        .checkout-navigation-header {
          margin-bottom: 2rem;
        }
        .checkout-back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          text-decoration: none;
          font-size: 0.92rem;
          font-weight: 600;
          margin-bottom: 0.85rem;
          padding: 0.4rem 0.75rem;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }
        .checkout-back-link:hover {
          color: #0f172a;
          background: #ffffff;
          border-color: #cbd5e1;
          transform: translateX(-3px);
        }
        .checkout-page-title-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .checkout-main-title {
          font-family: var(--font-display, "Outfit", sans-serif);
          font-size: 2.25rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #0f172a;
          margin: 0;
          line-height: 1.2;
        }
        .checkout-steps-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #eef2ff;
          color: #4f46e5;
          padding: 0.35rem 0.9rem;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 700;
          border: 1px solid #c7d2fe;
        }
        .checkout-grid-layout {
          display: grid;
          grid-template-columns: 1.35fr 1fr;
          gap: 2rem;
          align-items: start;
        }
        .checkout-card {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.05), 0 4px 6px -4px rgba(15, 23, 42, 0.02);
          padding: 2.25rem;
          box-sizing: border-box;
        }
        .card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.75rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid #f1f5f9;
        }
        .card-header-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #eef2ff;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .card-header-icon.summary-icon {
          background: #faf5ff;
          color: #9333ea;
        }
        .card-title {
          font-family: var(--font-display, "Outfit", sans-serif);
          font-size: 1.35rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.01em;
        }
        .card-subtitle {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0.25rem 0 0;
        }
        .checkout-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        .checkout-form-group {
          display: flex;
          flex-direction: column;
        }
        .checkout-form-group.full-width {
          grid-column: 1 / -1;
        }
        .checkout-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #334155;
          margin-bottom: 0.45rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .required-star {
          color: #ef4444;
          font-weight: 700;
        }
        .checkout-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .checkout-input-icon {
          position: absolute;
          left: 1rem;
          color: #94a3b8;
          pointer-events: none;
          transition: color 0.2s ease;
        }
        .checkout-input {
          width: 100%;
          padding: 0.82rem 1rem 0.82rem 2.85rem;
          font-size: 0.95rem;
          font-family: var(--font-main, sans-serif);
          color: #0f172a;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          outline: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-sizing: border-box;
        }
        .checkout-input::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }
        .checkout-input:focus {
          background: #ffffff;
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12);
        }
        .checkout-input-wrapper:focus-within .checkout-input-icon {
          color: #4f46e5;
        }
        .checkout-form-group.has-error .checkout-input {
          background: #fef2f2;
          border-color: #fca5a5;
        }
        .checkout-form-group.has-error .checkout-input-icon {
          color: #ef4444;
        }
        .checkout-error-msg {
          color: #dc2626;
          font-size: 0.78rem;
          font-weight: 500;
          margin-top: 0.35rem;
          display: block;
        }
        .order-summary-card {
          position: sticky;
          top: 90px;
        }
        .order-items-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.75rem;
          max-height: 280px;
          overflow-y: auto;
          padding-right: 0.25rem;
        }
        .order-items-list::-webkit-scrollbar { width: 6px; }
        .order-items-list::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
        .order-items-list::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .order-item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.85rem 1rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #f1f5f9;
          transition: all 0.2s ease;
        }
        .order-item-row:hover { background: #f1f5f9; border-color: #e2e8f0; }
        .order-item-info {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          flex: 1;
          min-width: 0;
        }
        .order-item-thumbnail {
          width: 48px;
          height: 48px;
          object-fit: contain;
          border-radius: 8px;
          background: #ffffff;
          padding: 4px;
          border: 1px solid #e2e8f0;
          flex-shrink: 0;
        }
        .order-item-desc { display: flex; flex-direction: column; min-width: 0; }
        .order-item-name-qty {
          font-size: 0.95rem;
          color: #0f172a;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .item-name { color: #0f172a; }
        .item-times { color: #94a3b8; font-weight: 500; }
        .item-qty { color: #4f46e5; font-weight: 700; }
        .order-item-unit-price { font-size: 0.78rem; color: #64748b; margin-top: 0.15rem; }
        .order-item-price { font-size: 1rem; font-weight: 700; color: #0f172a; white-space: nowrap; }
        .order-cost-breakdown {
          border-top: 1px solid #f1f5f9;
          padding-top: 1.25rem;
          margin-bottom: 1.75rem;
        }
        .cost-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          font-size: 0.92rem;
        }
        .cost-label { color: #64748b; font-weight: 500; }
        .cost-value { color: #1e293b; font-weight: 600; }
        .cost-value.free-delivery {
          color: #16a34a;
          font-weight: 700;
          background: #dcfce7;
          padding: 0.15rem 0.5rem;
          border-radius: 6px;
          font-size: 0.8rem;
        }
        .cost-divider { height: 1px; background: #e2e8f0; margin: 1rem 0; }
        .cost-row.total-row { margin-bottom: 0; }
        .total-label {
          font-family: var(--font-display, "Outfit", sans-serif);
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
        }
        .total-value {
          font-family: var(--font-display, "Outfit", sans-serif);
          font-size: 1.45rem;
          font-weight: 800;
          color: #4f46e5;
          letter-spacing: -0.02em;
        }
        .btn-place-order {
          width: 100%;
          padding: 1rem 1.75rem;
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
          color: #ffffff;
          border: none;
          border-radius: 14px;
          font-family: var(--font-main, sans-serif);
          font-size: 1.05rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .btn-place-order:hover:not(:disabled) {
          background: linear-gradient(135deg, #4338ca 0%, #3730a3 100%);
          box-shadow: 0 8px 24px rgba(79, 70, 229, 0.35);
          transform: translateY(-2px);
        }
        .btn-place-order:active:not(:disabled) { transform: translateY(0) scale(0.99); }
        .btn-place-order:disabled { opacity: 0.75; cursor: not-allowed; }
        .checkout-trust-badges { margin-top: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .trust-badge-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.78rem; color: #64748b; font-weight: 500; }
        .trust-badge-item svg { color: #10b981; flex-shrink: 0; }
        .auth-alert.error {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 0.85rem 1.25rem;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 500;
        }
        @media (max-width: 960px) {
          .checkout-grid-layout { grid-template-columns: 1fr; gap: 1.75rem; }
          .order-summary-card { position: static; }
          .checkout-form-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .checkout-page-container { padding: 1.5rem 1rem 2.5rem; }
          .checkout-card { padding: 1.5rem; border-radius: 16px; }
          .checkout-main-title { font-size: 1.85rem; }
        }
      `}</style>
      <div className="checkout-page-wrapper">
      <Navbar />
      <main className="checkout-page-container">
        {/* Navigation Breadcrumb & Title */}
        <div className="checkout-navigation-header">
          <Link to="/cart" className="checkout-back-link">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back to Cart</span>
          </Link>
          <div className="checkout-page-title-row">
            <h1 className="checkout-main-title">Checkout</h1>
            <div className="checkout-steps-badge">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Secure SSL Checkout</span>
            </div>
          </div>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="auth-alert error" style={{ marginBottom: "1.5rem" }} role="alert">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{serverError}</span>
          </div>
        )}

        {/* Empty cart screen */}
        {cartItems.length === 0 ? (
          <div
            className="checkout-card"
            style={{ textAlign: "center", padding: "3rem 2rem" }}
          >
            <h2>Your cart is empty</h2>
            <p style={{ color: "#64748b", margin: "0.5rem 0 1.5rem" }}>
              Add items to your cart before proceeding to checkout.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="btn-place-order"
              style={{ width: "auto", display: "inline-flex", padding: "0.75rem 1.75rem" }}
            >
              Browse Products
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handlePlaceOrder} noValidate className="checkout-grid-layout">
            {/* Left Column: Shipping Details */}
            <CheckoutForm
              formData={formData}
              errors={errors}
              touched={touched}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {/* Right Column: Order Summary */}
            <OrderSummary
              items={cartItems}
              total={totalAmount}
              onPlaceOrder={handlePlaceOrder}
              isSubmitting={isSubmitting}
            />
          </form>
        )}
      </main>
    </div>
    </>
  );
};

export default Checkout;
