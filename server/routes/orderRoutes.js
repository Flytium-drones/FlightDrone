import express from "express";
import { 
  createOrder, 
  verifyPayment,
  createCodOrder,
  getUserOrders, 
  getAllOrders, 
  updateOrderStatus,
  cancelOrder
} from "../controllers/orderController.js";
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';

const router = express.Router();

// Payment routes
router.post("/create-order", requireSignIn, createOrder);
router.post("/verify-payment", requireSignIn, verifyPayment);
router.post("/create-cod-order", requireSignIn, createCodOrder);

// Order management routes
router.get("/user-orders", requireSignIn, getUserOrders);
router.get("/all-orders", requireSignIn, isAdmin, getAllOrders);
router.put("/update-status/:orderId", requireSignIn, isAdmin, updateOrderStatus);
router.put("/cancel-order/:orderId", requireSignIn, cancelOrder);

// Legacy routes for backward compatibility
router.post("/order", requireSignIn, createOrder);
router.post("/verify", requireSignIn, verifyPayment);

export default router;
