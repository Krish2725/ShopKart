import express from 'express'
import isAuthenticated from "../middlewares/auth.middleware.js";
import { addToCart , getCartItems, updateProdQuantity, deleteFromCart} from '../controllers/cart.controller.js';

const cartRoutes = express.Router()

cartRoutes.post("/:productId",isAuthenticated,addToCart);
cartRoutes.get("/",isAuthenticated,getCartItems);
cartRoutes.patch("/:productId", isAuthenticated, updateProdQuantity);
cartRoutes.delete("/:productId",isAuthenticated,deleteFromCart);
export default cartRoutes;