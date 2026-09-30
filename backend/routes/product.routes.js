import express from 'express';
import { getProducts, getProductById, insertProduct } from '../controllers/product.controller.js';

const productRoutes = express.Router();

productRoutes.post('/', insertProduct);
productRoutes.get('/', getProducts);
productRoutes.get('/:id', getProductById);

export default productRoutes;
