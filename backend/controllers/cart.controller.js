// import Customer from "../models/customer.model.js";
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

