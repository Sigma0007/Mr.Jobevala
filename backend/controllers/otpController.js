import axios from "axios";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { sendOtpSms } from "../config/msg91.js";
import { sendOtpEmail } from "../utils/emailService.js";

/**
 * Generate and send OTP based on selected country code:
 * - If country code is +91 (India) -> Send OTP to mobile via SMS (MSG91)
 * - If country code is NOT +91 (International) -> Send OTP to email via Nodemailer (Gmail)
 */
export const sendOtp = catchAsync(async (req, res, next) => {
    const { email, phone, countryCode, name, type } = req.body;

    const trimmedCountryCode = countryCode ? String(countryCode).trim() : "+91";
    const formattedCountryCode = trimmedCountryCode.startsWith("+")
        ? trimmedCountryCode
        : `+${trimmedCountryCode}`;

    const isIndia = formattedCountryCode === "+91";
    const isPhoneChannel = isIndia && type !== "email";

    // 1. Check if email is already registered before sending OTP
    if (email) {
        const cleanEmail = email.toLowerCase().trim();
        const existingUser = await User.findOne({ email: cleanEmail });
        if (existingUser) {
            return next(
                new AppError(
                    "An account with this email address already exists. Please login instead.",
                    409
                )
            );
        }
    }

    // 2. India (+91) -> Send SMS OTP to phone
    if (isPhoneChannel) {
        const cleanPhone = phone ? String(phone).trim().replace(/\D/g, "") : "";
        if (!cleanPhone) {
            return next(
                new AppError("Mobile phone number is required for Indian verification.", 400)
            );
        }

        if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
            return next(
                new AppError("Please enter a valid 10-digit Indian mobile number.", 400)
            );
        }

        try {
            const result = await sendOtpSms(cleanPhone);
            return res.status(200).json({
                success: true,
                channel: "phone",
                message: `OTP sent successfully to +91 ${cleanPhone}`,
                data: result,
            });
        } catch (error) {
            return next(new AppError(error.message || "Unable to send SMS OTP", 500));
        }
    }

    // 3. International (Country Code != +91) -> Send Email OTP via Nodemailer Gmail
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return next(
            new AppError("A valid email address is required to receive verification code.", 400)
        );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone ? String(phone).trim().replace(/\D/g, "") : "";

    // Generate secure 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validity

    // Remove any previous unverified OTP records for this email
    await Otp.deleteMany({ email: cleanEmail, type: "email" });

    // Store new OTP in database
    await Otp.create({
        email: cleanEmail,
        phone: cleanPhone,
        countryCode: formattedCountryCode,
        type: "email",
        otp: otpCode,
        expiresAt,
        verified: false,
    });

    // Send email using Nodemailer Gmail service
    await sendOtpEmail({
        to: cleanEmail,
        otp: otpCode,
        name: name ? name.trim() : "Valued Member",
    });

    return res.status(200).json({
        success: true,
        channel: "email",
        message: `A 6-digit verification code has been sent to ${cleanEmail}`,
    });
});

/**
 * Resend OTP (Email or Phone depending on country code)
 */
export const resendOtp = catchAsync(async (req, res, next) => {
    // Re-use sendOtp logic with fresh code & updated expiry
    return sendOtp(req, res, next);
});

/**
 * Verify OTP
 */
export const verifyOtp = catchAsync(async (req, res, next) => {
    const { email, phone, countryCode, otp, type } = req.body;

    if (!otp) {
        return next(new AppError("Verification code (OTP) is required.", 400));
    }

    const trimmedCountryCode = countryCode ? String(countryCode).trim() : "+91";
    const formattedCountryCode = trimmedCountryCode.startsWith("+")
        ? trimmedCountryCode
        : `+${trimmedCountryCode}`;

    const isIndia = formattedCountryCode === "+91";
    const isPhoneChannel = isIndia && type !== "email";

    // 1. Verify Phone OTP via MSG91
    if (isPhoneChannel) {
        const cleanPhone = phone ? String(phone).trim().replace(/\D/g, "") : "";
        if (!cleanPhone) {
            return next(new AppError("Mobile phone number is required.", 400));
        }

        const phoneWithCode = cleanPhone.startsWith("91")
            ? cleanPhone
            : `91${cleanPhone}`;

        try {
            const response = await axios.post(
                "https://control.msg91.com/api/v5/otp/verify",
                {
                    mobile: phoneWithCode,
                    otp: String(otp).trim(),
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
                channel: "phone",
                verified: true,
                message: "Mobile number verified successfully.",
                data: response.data,
            });
        } catch (error) {
            return next(
                new AppError(
                    error.response?.data?.message || "Invalid or expired OTP",
                    400
                )
            );
        }
    }

    // 2. Verify Email OTP from Database
    if (!email) {
        return next(new AppError("Email address is required for verification.", 400));
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = String(otp).trim();

    const record = await Otp.findOne({
        email: cleanEmail,
        type: "email",
    }).sort({ createdAt: -1 });

    if (!record) {
        return next(
            new AppError(
                "No verification code found for this email. Please request a new OTP.",
                400
            )
        );
    }

    if (new Date() > record.expiresAt) {
        return next(
            new AppError(
                "Verification code has expired. Please request a new code.",
                400
            )
        );
    }

    if (record.otp !== cleanOtp) {
        return next(
            new AppError("Invalid verification code. Please check your email and try again.", 400)
        );
    }

    // Mark as verified
    record.verified = true;
    await record.save();

    return res.status(200).json({
        success: true,
        channel: "email",
        verified: true,
        message: "Email address verified successfully.",
    });
});
