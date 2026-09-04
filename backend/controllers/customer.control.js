import Customer from "../models/customer.model.js"
import bcrypt from 'bcrypt'
import genToken from "../utils/generateToken.js"

const cookieOptions= {
    httpOnly: true
}
export const registerCustomer = async(req,res)=>{

    const {fullName, email, password, phone} = req.body

    try {
        // validations
        if(!fullName || !email || !password || !phone){
            return res.status(400).json({message: 'All fields Required'})
        }

        const customerEmailExists = await Customer.findOne({email})

        if(customerEmailExists){
            return res.status(409).json({message: 'Email already exists'})
        }

        if(password.length < 6){
            return res.status(400).json({message: 'Password too short'})
        }

        const hashedPassword = bcrypt.hashSync(password, 10)

        const newCustomer = await Customer.create({
            fullName,
            email,
            password: hashedPassword, 
            phone
        })

        const token = genToken(newCustomer._id)
        
        res.cookie("token", token, cookieOptions)

        res.status(200).json({
            success: true,
            customer: newCustomer
        })
    }
    catch(error){
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const loginCustomer = async(req,res)=>{
    const {email,password} = req.body

    // validations

    try{
        if(!email || !password){
            return res.status(400).json({message: 'All fields required'})
        }

        const customerExists = await Customer.findOne({email})

        if(!customerExists){
            return res.status(401)
        }

        const correctPassword = bcrypt.compareSync(password, customerExists.password)

        if(!correctPassword){
            return res.status(401)
        }

        const token = genToken(customerExists._id)
        res.cookie("token", token , cookieOptions)

        res.status(200).json({
            "success": true,
            "message": "Login successful"

        })
    }
    catch(error){
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const getCustomer = (req , res)=>{
    res.status(200).json(req.customer)
}

export const logoutCustomer = async (req, res) => {
    try {
        res.clearCookie("token", cookieOptions);

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        console.log("Logout Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}