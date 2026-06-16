import express from "express";
import{placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, verifyStripe} from "../controller/orderController.js";
import  adminAuth from "../middleware/admin_auth.js";
import authUser from "../middleware/auth.js";
import { verifyRazorpay } from "../controller/orderController.js";

const orderRoutes = express.Router();

//admin features
orderRoutes.post("/list", adminAuth, allOrders);
orderRoutes.post("/status", adminAuth, updateStatus);

// payment Features 
orderRoutes.post("/place", authUser, placeOrder);
orderRoutes.post("/stripe",authUser,placeOrderStripe);
orderRoutes.post("/razorpay", authUser, placeOrderRazorpay);


// user feature
orderRoutes.post("/userOrder", authUser, userOrders);

// Verify payment
orderRoutes.post("/verify",authUser,verifyStripe)
orderRoutes.post("/verifyRazorpay", authUser, verifyRazorpay);

export default orderRoutes;