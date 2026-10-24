import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

export const protect = catchAsync(
    async (req, res, next) => {
        let token;

        const authHeader =
            req.headers.authorization;

        if (
            authHeader &&
            authHeader.startsWith("Bearer ")
        ) {
            token = authHeader.split(" ")[1];
        }

        if (!token) {
            return next(
                new AppError(
                    "You are not logged in. Please login.",
                    401
                )
            );
        }

        let decoded;

        try {
            decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );
        } catch (error) {
            return next(
                new AppError(
                    "Invalid or expired token.",
                    401
                )
            );
        }

        if (!decoded?.id || !mongoose.Types.ObjectId.isValid(decoded.id)) {
            return next(
                new AppError(
                    "Invalid token payload.",
                    401
                )
            );
        }

        const user = await User.findById(decoded.id);

        if (!user) {
            return next(
                new AppError(
                    "User no longer exists.",
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

        req.user = user;

        next();
    }
);

export const optionalAuth = catchAsync(async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded?.id && mongoose.Types.ObjectId.isValid(decoded.id)) {
            const user = await User.findById(decoded.id);
            if (user && user.isActive) {
                req.user = user;
            }
        }
    } catch (err) {
        // Silently continue as unauthenticated
    }

    next();
});