import { isValidPhoneNumber } from "libphonenumber-js";
import CompanyProfile from "../models/CompanyProfile.js";
import User from "../models/User.js";
import UserProfile from "../models/UserProfile.js";

import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { createAndSendNotification } from "../utils/notificationService.js";

import {
    generatetoken,
} from "../utils/generateToken.js";


const sendAuthResponse = (
    user,
    statusCode,
    res
) => {
    const token = generatetoken(
        user._id
    );

    const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        countryCode: user.countryCode || "+91",
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
    };

    res.status(statusCode).json({
        success: true,
        token,
        user: userData,
    });
};


export const register = catchAsync(
    async (req, res, next) => {
        const {
            name,
            email,
            password,
            countryCode,
            phone,
            role,
        } = req.body;

        if (!name || !email || !password) {
            return next(
                new AppError(
                    "Name, email and password are required.",
                    400
                )
            );
        }

        let formattedCountryCode = "+91";
        if (countryCode && typeof countryCode === "string") {
            const trimmed = countryCode.trim();
            formattedCountryCode = trimmed.startsWith("+") ? trimmed : `+${trimmed}`;
        }

        const cleanPhone = phone ? String(phone).trim().replace(/\D/g, "") : "";

        // Validate international phone number if phone is provided
        if (cleanPhone) {
            const fullPhone = `${formattedCountryCode}${cleanPhone}`;
            try {
                if (!isValidPhoneNumber(fullPhone)) {
                    return next(
                        new AppError(
                            `Invalid phone number for country code ${formattedCountryCode}.`,
                            400
                        )
                    );
                }
            } catch (err) {
                if (cleanPhone.length < 6 || cleanPhone.length > 15) {
                    return next(
                        new AppError(
                            "Please enter a valid phone number between 6 and 15 digits.",
                            400
                        )
                    );
                }
            }
        }

        const existingUser =
            await User.findOne({ email: email.toLowerCase().trim() });

        if (existingUser) {
            return next(
                new AppError(
                    "Email is already registered.",
                    409
                )
            );
        }

        /*
          Security:
          Public API can only create:
          user
          provider
    
          Never allow admin registration
        */

        const allowedRoles = [
            "user",
            "provider",
        ];

        const userRole =
            allowedRoles.includes(role)
                ? role
                : "user";

        const userData = {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
            countryCode: formattedCountryCode,
            phone: cleanPhone,
            role: userRole,
        };

        const user =
            await User.create(userData);

        if (userRole === "user") {
            await UserProfile.create({
                user: user._id,
                countryCode: formattedCountryCode,
                phone: cleanPhone,
                name: name.trim(),
            });

            // Send real-time notification to user to complete profile 100%
            createAndSendNotification({
                recipient: user._id,
                title: "Welcome to JobPortal! 🎯",
                message: "Complete your profile 100% to boost your visibility and get recommended to top employers.",
                type: "profile",
                link: "/user/dashboard",
                data: { tab: "profile" },
            });
        }

        if (userRole === "provider") {
            await CompanyProfile.create({
                user: user._id,
                ownerCountryCode: formattedCountryCode,
                countryCode: formattedCountryCode,
                ownerPhone: cleanPhone,
                phone: cleanPhone,
                ownerName: name.trim(),
                ownerEmail: email.toLowerCase().trim(),
            });

            // Send real-time notification to employer to complete company profile
            createAndSendNotification({
                recipient: user._id,
                title: "Welcome Employer! 🏢",
                message: "Complete your company profile and post your first job to start receiving applications from top talent.",
                type: "profile",
                link: "/provider/dashboard",
                data: { tab: "profile" },
            });
        }

        sendAuthResponse(
            user,
            201,
            res
        );
    }
);


export const login = catchAsync(
    async (req, res, next) => {
        const {
            email,
            password,
        } = req.body;

        if (!email || !password) {
            return next(
                new AppError(
                    "Email and password are required.",
                    400
                )
            );
        }

        const user = await User.findOne({
            email: email.toLowerCase(),
        }).select("+password");

        if (!user) {
            return next(
                new AppError(
                    "Invalid email or password.",
                    401
                )
            );
        }

        const isPasswordCorrect =
            await user.comparePassword(
                password
            );

        if (!isPasswordCorrect) {
            return next(
                new AppError(
                    "Invalid email or password.",
                    401
                )
            );
        }

        if (!user.isActive) {
            return next(
                new AppError(
                    "Your account has been deactivated.",
                    403
                )
            );
        }

        sendAuthResponse(
            user,
            200,
            res
        );
    }
);


export const getMe = catchAsync(
    async (req, res) => {
        res.status(200).json({
            success: true,
            user: req.user,
        });
    }
);


export const updateProfile = catchAsync(
    async (req, res, next) => {
        const {
            name,
            countryCode,
            phone,
            avatar,
        } = req.body;

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (avatar !== undefined) updateData.avatar = avatar;
        if (phone !== undefined) {
            updateData.phone = String(phone).trim().replace(/\D/g, "");
        }
        if (countryCode !== undefined) {
            const trimmed = String(countryCode).trim();
            updateData.countryCode = trimmed.startsWith("+") ? trimmed : `+${trimmed}`;
        }

        const user =
            await User.findByIdAndUpdate(
                req.user._id,
                updateData,
                {
                    new: true,
                    runValidators: true,
                }
            );

        res.status(200).json({
            success: true,
            message:
                "Profile updated successfully.",
            user,
        });
    }
);