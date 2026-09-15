import { sendOtpSms } from "../config/msg91.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const sendOtp = async (req, res) => {
    try {
        const { mobile } = req.body;

        if (!mobile) {
            return res.status(400).json({
                success: false,
                message: "Mobile number is required",
            });
        }

        // Basic Indian mobile validation
        if (!/^[6-9]\d{9}$/.test(mobile)) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid Indian mobile number",
            });
        }

        const result = await sendOtpSms(mobile);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const verifyOtp = async (req, res) => {
    try {
        const { mobile, otp } = req.body;

        if (!mobile || !otp) {
            return res.status(400).json({
                success: false,
                message: "Mobile and OTP are required",
            });
        }

        const phone = mobile.startsWith("91")
            ? mobile
            : `91${mobile}`;

        const response = await axios.post(
            "https://control.msg91.com/api/v5/otp/verify",
            {
                mobile: phone,
                otp,
            },
            {
                headers: {
                    authkey: process.env.MSG91_AUTH_KEY,
                    accept: "application/json",
                    "content-type": "application/json",
                },
            }
        );

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            data: response.data,
        });
    } catch (error) {
        console.error(
            "Verify OTP error:",
            error.response?.data || error.message
        );

        return res.status(400).json({
            success: false,
            message:
                error.response?.data?.message ||
                "Invalid or expired OTP",
        });
    }
};

export const verifywidget = async (req, res) => {
    try {
        const { accessToken, mobile } = req.body;

        if (!accessToken) {
            return res.status(400).json({
                success: false,
                message: "Access token is required",
            });
        }

        const response = await fetch(
            "https://control.msg91.com/api/v5/widget/verifyAccessToken",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    authkey: process.env.MSG91_AUTH_KEY,
                    "access-token": accessToken,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(401).json({
                success: false,
                message: "MSG91 token verification failed",
                data,
            });
        }

        // Token is valid.
        // Now find/create your user in MongoDB.

        return res.json({
            success: true,
            message: "OTP verified successfully",
            data,
        });
    } catch (error) {
        console.error("MSG91 error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};