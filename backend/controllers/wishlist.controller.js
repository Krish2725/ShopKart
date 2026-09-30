import Customer from "../models/customer.model.js";
import mongoose from "mongoose";
import Product from "../models/product.model.js";
export const addToWishlist = async (req, res) => {
    const productId = req.params.productId;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
            message: "Invalid Product ID"
        });
    }

    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    const alreadyWishlisted = req.customer.wishlist.some(
        id => id.toString() === productId
    );

    if (alreadyWishlisted) {
        return res.status(409).json({
            message: "Product already in the wishlist"
        });
    }

    req.customer.wishlist.push(product._id)

    await req.customer.save();

    return res.status(200).json({
        message: "Product added to Wishlist successfully"
    });
}

export const getWishlist = async (req, res) => {
    // already authenticated
    try {
        const customer = await Customer.findById(req.customer._id).populate("wishlist");
        return res.status(200).json({
            success: true,
            count: customer.wishlist.length,
            wishlist: customer.wishlist
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to fetch wishlist"
        });
    }
}

export const removeFromWishlist = async (req, res) => {
    const productId = req.params.productId;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
            message: "Invalid product ID"
        });
    }

    const exists = req.customer.wishlist.some(
        id => id.toString() === productId
    );

    if (exists) {
        req.customer.wishlist = req.customer.wishlist.filter(
            id => id.toString() !== productId
        );
    }
    else {
        return res.status(404).json({
            message: "Product not in the wishlist"
        });
    }

    await req.customer.save()

    return res.status(200).json({
        success: true,
        message: "Product removed from wishlist"
    });
}