import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        orderId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        paymentId: {
            type: String,
            default: null,
            index: true,
        },
        signature: {
            type: String,
            default: null,
        },
        amount: {
            type: Number,
            required: true, // Amount in INR (e.g. 499)
        },
        currency: {
            type: String,
            default: "INR",
        },
        status: {
            type: String,
            enum: ["created", "attempted", "paid", "failed", "refunded"],
            default: "created",
            index: true,
        },
        purpose: {
            type: String,
            default: "Job Portal Service",
        },
        planId: {
            type: String,
            default: "standard",
        },
        receipt: {
            type: String,
            required: true,
        },
        notes: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        customerDetails: {
            name: { type: String, default: "" },
            email: { type: String, default: "" },
            phone: { type: String, default: "" },
        },
        errorDetails: {
            type: mongoose.Schema.Types.Mixed,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
