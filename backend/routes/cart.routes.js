import express from 'express'
import isAuthenticated from "../middlewares/auth.middleware.js";
import { addToCart , getCartItems} from '../controllers/cart.controller.js';

const cartRoutes = express.Router()

cartRoutes.post("/:productId",isAuthenticated,addToCart);
cartRoutes.get("/",isAuthenticated,getCartItems)
export default cartRoutes;