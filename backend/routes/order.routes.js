import express from "express";
import isAuthenticated from "../middlewares/auth.middleware.js";
import { createOrder, verifyPayment, getOrderById, getMyOrders } from "../controllers/order.controller.js";

const orderRoutes = express.Router();

orderRoutes.post("/create-payment-order", isAuthenticated, createOrder);
orderRoutes.post("/verify-payment", isAuthenticated, verifyPayment);
orderRoutes.get("/", isAuthenticated, getMyOrders);
orderRoutes.get("/:id", isAuthenticated, getOrderById);

export default orderRoutes;