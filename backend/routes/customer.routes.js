import express from 'express'
import {registerCustomer,loginCustomer,logoutCustomer,getCustomer} from '../controllers/customer.control.js'
import isAuthenticated from '../middlewares/auth.middleware.js';

const customerRoutes = express.Router()


// Registering a customer

customerRoutes.post('/register',registerCustomer)

// Log in customer

customerRoutes.post('/login',loginCustomer)

customerRoutes.get('/me', isAuthenticated, getCustomer)

customerRoutes.post('/logout', logoutCustomer);

export default customerRoutes
