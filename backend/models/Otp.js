import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            lowercase: true,
            trim: true,
            index: true,
        },
        phone: {
            type: String,
            trim: true,
            index: true,
        },
        countryCode: {
            type: String,
            trim: true,
            default: "+91",
        },
        type: {
            type: String,
            enum: ["email", "phone"],
            default: "email",
        },
        otp: {
            type: String,
            required: [true, "OTP is required"],
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 }, // Automatically deleted when expiresAt passes
        },
        verified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model("Otp", otpSchema);
