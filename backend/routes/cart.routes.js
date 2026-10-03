import express from 'express'
import isAuthenticated from "../middlewares/auth.middleware.js";
import { addToCart } from '../controllers/cart.controller.js';

const cartRoutes = express.Router()

cartRoutes.post("/:productId",isAuthenticated,addToCart);
export default cartRoutes;