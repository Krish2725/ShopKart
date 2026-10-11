import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from 'cors'
import customerRoutes from "./routes/customer.routes.js";
import productRoutes from "./routes/product.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
dotenv.config()
const app = express()

const port = process.env.PORT || 8081;

const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.trim().replace(/\/+$/, '') : null;
const allowedOrigins = [
    "http://localhost:5173",
    clientUrl
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const normalizedOrigin = origin.replace(/\/+$/, '');
        if (allowedOrigins.includes(normalizedOrigin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));

app.get('/health', (req, res) => {
    res.status(200).json({ status: "ok", message: "ShopKart backend is running" });
});

app.get('/ready', (req, res) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    if (isDbConnected) {
        return res.status(200).json({ status: "ready", database: "connected" });
    }
    return res.status(503).json({ status: "unavailable", database: "disconnected" });
});

app.use(express.json());
app.use(cookieParser());

// Database readiness middleware: reject API calls if DB is unavailable
app.use((req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            success: false,
            message: "Database service unavailable. Please check backend database connection."
        });
    }
    next();
});

app.use('/customers', customerRoutes);
app.use('/products', productRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

const startServer = async () => {
    try {
        if (!process.env.dbURL) {
            console.error("FATAL: dbURL environment variable is not defined in process.env.");
            process.exit(1);
        }

        await mongoose.connect(process.env.dbURL);
        console.log('DB Connected');

        app.listen(port, "0.0.0.0", () => {
            console.log(`Server Started at ${port}`);
        });
    } catch (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
};

startServer();
