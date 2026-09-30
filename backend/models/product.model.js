import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
   name: {
        type: String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
        min: [0, 'Price cannot be negative']
    },
    category:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        required:true,
        min: [0, 'Stock cannot be less than 0']
    },
    createdAt:{
        type:Date,
        required:true,
        default: Date.now
    }
})

const Product = mongoose.model('Product',productSchema)
export default Product