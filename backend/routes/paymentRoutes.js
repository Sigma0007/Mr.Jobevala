import express from "express";
import {
    getRazorpayKey,
    createOrder,
    verifyPayment,
    handleWebhook,
    getMyPayments,
    getAllPaymentsAdmin,
    getPaymentById,
    recordPaymentFailure,
} from "../controllers/paymentController.js";
import { protect, optionalAuth } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public / Key route
router.get("/key", getRazorpayKey);

// Order creation & verification
router.post("/create-order", optionalAuth, createOrder);
router.post("/verify", optionalAuth, verifyPayment);
router.post("/record-failure", optionalAuth, recordPaymentFailure);

// Webhook endpoint (Razorpay calls this)
router.post("/webhook", handleWebhook);

// User payment history
router.get("/my-payments", protect, getMyPayments);

// Admin all payments & analytics
router.get("/all", protect, authorize("admin"), getAllPaymentsAdmin);

// Single payment details
router.get("/:id", protect, getPaymentById);

export default router;
