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
            address: { type: String, default: "" },
            city: { type: String, default: "" },
            state: { type: String, default: "" },
            country: { type: String, default: "India" },
            pincode: { type: String, default: "" },
            gstin: { type: String, default: "" },
        },
        invoiceNumber: {
            type: String,
            default: null,
            index: true,
        },
        invoiceUrl: {
            type: String,
            default: null,
        },
        invoiceKey: {
            type: String,
            default: null,
        },
        invoiceDate: {
            type: Date,
            default: null,
        },
        taxDetails: {
            subtotal: { type: Number, default: 0 },
            taxRate: { type: Number, default: 18 },
            cgst: { type: Number, default: 0 },
            sgst: { type: Number, default: 0 },
            igst: { type: Number, default: 0 },
            taxAmount: { type: Number, default: 0 },
            total: { type: Number, default: 0 },
            isInterState: { type: Boolean, default: false },
        },
        companyDetails: {
            name: { type: String, default: "" },
            gstin: { type: String, default: "" },
            address: { type: String, default: "" },
            email: { type: String, default: "" },
            logo: { type: String, default: "" },
        },
        pdfStatus: {
            type: String,
            enum: ["pending", "generated", "failed"],
            default: "pending",
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
