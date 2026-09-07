import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from 'cors'
import customerRoutes from "./routes/customer.routes.js";
dotenv.config()
const app = express()

const port = 8081
app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true
}))

mongoose.connect(process.env.dbURL).then(() => {
    console.log('DB Connected')
}).catch((err) => {
    console.log(err)
})
app.use(express.json())
app.use(cookieParser())
app.use('/customers', customerRoutes)

app.listen(port, () => {
    console.log(`Server Started at ${port}`)
})
