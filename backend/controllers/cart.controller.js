// import Customer from "../models/customer.model.js";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";

export const addToCart = async(req,res)=>{
    const productId = req.params.productId;
    if(!mongoose.Types.ObjectId.isValid(productId)){
        return res.status(400).json({
            message: "Invalid Product ID"
        });
    }

    const product = await Product.findById(productId);
    if(!product){
        return res.status(404).json({
            message:"Product not found"
        });
    }

    const cartItem  = req.customer.cart.find(
        item=> item.product.toString() === productId
    )

    if(!cartItem){
        if(product.stock<1){
            return res.status(400).json({
                "message": "Product not in stock"
            });
        }
        req.customer.cart.push({
            product: productId,
            quantity: 1
        });
       await req.customer.save();

        return res.status(200).json({
            "success":true, 
            "message": "Successfully added to cart",
            "cart": req.customer.cart
        })
    }
    else{
        if(cartItem.quantity >= product.stock){
            return res.status(400).json({
                "message": "Additional Stock Unavaialable"
            });
        }
        cartItem.quantity += 1;
        await req.customer.save();
        return res.status(200).json({
            "success":true,
            "message" : "Successfully Added to Cart",
            "cart" : req.customer.cart
        });
    }
}

export const getCartItems = async(req,res)=>{
    try{
        return res.status(200).json({
            "success": true,
            "cart" : req.customer.cart
        });
    }
    catch(error){
        return res.status(500).json({
            message: "Failed to fetch cart items"
        })
    }
}


export const updateProdQuantity= async (req,res)=>{
    const productId = req.params.productId;
    if(!mongoose.Types.ObjectId.isValid(productId)){
        return res.status(400).json({
            message:"Invalid Product ID"
        });
    }

    const quantity = req.body.quantity;

    if(typeof(quantity) !== "number"){
        return res.status(400).json({
            message:"Quantity must be a number"
        })
    }

    if(quantity < 1){
        return res.status(400).json({
            message:"Quantity must be atleast 1"
        });
    }

    const product = await Product.findById(productId);
    if(!product){
        return res.status(404).json({
            message:"Product not found"
        });
    }

    const cartItem = req.customer.cart.find(
        item => item.product.toString() === productId
    )

    if(!cartItem){
        return res.status(404).json({
            message: "Product not in cart"
        });
    }

    if(quantity > product.stock){
        return res.status(400).json({
            message:"Quantity cannot be greater than the product stock"
        });
    }

    cartItem.quantity = quantity;

    await req.customer.save()

    return res.status(200).json({
        "success":true,
        "message": "Cart quantity updated",
        "cart": req.customer.cart
    });
}
