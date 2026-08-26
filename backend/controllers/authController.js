import User from "../models/User.js";
import UserProfile from "../models/UserProfile.js";

import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

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

        const existingUser =
            await User.findOne({ email });

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
            name,
            email,
            password,
            phone,
            role: userRole,
        };

        const user =
            await User.create(userData);

        if (userRole === "user") {
            await UserProfile.create({
                user: user._id,
                phone: phone || "",
                name: name || "",
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
            phone,
            avatar,
        } = req.body;

        const user =
            await User.findByIdAndUpdate(
                req.user._id,
                {
                    name,
                    phone,
                    avatar,
                },
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