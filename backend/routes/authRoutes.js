import express from "express";

import {
    register,
    login,
    getMe,
    updateProfile,
} from "../controllers/authController.js";

import {
    sendOtp,
    resendOtp,
    verifyOtp,
} from "../controllers/otpController.js";

import {
    protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/resend-otp", resendOtp);
router.post("/verify-otp", verifyOtp);

router.post("/register", register);

router.post("/login", login);

router.get(
    "/me",
    protect,
    getMe
);

router.put(
    "/profile",
    protect,
    updateProfile
);


export default router;