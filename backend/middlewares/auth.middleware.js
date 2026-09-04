import jwt from 'jsonwebtoken'
import Customer from '../models/customer.model.js'

const isAuthenticated = async(req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({message: "No token found"}); 
        }

        const decoded = jwt.verify(token, process.env.jwt_secret);

        const customer = await Customer.findById(decoded.customerId);

        if(!customer){
            return res.status(404).json({message: "User not found"}); 
        }
        
        req.customer = customer; 
        next();
    } catch(error) {
        console.log("Auth Middleware Error:", error);
        return res.status(500).json({ message: "Invalid or expired token" }); 
    }
}

export default isAuthenticated;