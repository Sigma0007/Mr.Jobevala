import express from "express";

import {
    sendOtp,
    verifyOtp,
    verifywidget,
} from "../controllers/msgController.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/msg91-widget/verify", verifywidget);

export default router;