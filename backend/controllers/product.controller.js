import Product from "../models/product.model.js";
import mongoose from "mongoose";

export const insertProduct = async (req, res) => {
    const { name, description, price, category, image, stock } = req.body;

    try {
        if (!name || !description || price === undefined || !category || !image || stock === undefined) {
            return res.status(400).json({ message: 'All fields required' });
        }

        if (price < 0) {
            return res.status(400).json({ message: 'Invalid price' });
        }

        if (stock < 0) {
            return res.status(400).json({ message: 'Invalid stock' });
        }

        const newProduct = await Product.create({
            name,
            description,
            price,
            category,
            image,
            stock
        });

        return res.status(201).json({
            success: true,
            message: "Product added successfully",
            product: newProduct
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getProducts = async (req, res) => {
    try {
        const { search, category } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }

        let products = await Product.find(query).select('_id name price category image stock');

        if (search) {
            const searchLower = search.toLowerCase();
            products = products.filter(product =>
                product.name.toLowerCase().includes(searchLower)
            );
        }

        return res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(id).select('-__v');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid product ID"
        });
    }
};
