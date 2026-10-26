import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
            index: true,
        },
        plan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PricingPlan",
            default: null,
        },
        planId: {
            type: String,
            required: [true, "Plan ID/slug is required"],
            trim: true,
            index: true,
        },
        planDetails: {
            name: { type: String, default: "" },
            category: { type: String, default: "" },
            categoryId: { type: String, default: "" },
            price: { type: Number, default: 0 },
            originalPrice: { type: Number, default: 0 },
            badge: { type: String, default: "" },
            description: { type: String, default: "" },
            features: { type: [String], default: [] },
            resumeAccess: { type: Boolean, default: false },
            validityDays: { type: Number, default: 30 },
            extraJobPostPrice: { type: Number, default: 99 },
            extraCompanyPostPrice: { type: Number, default: 49 },
        },
        payment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Payment",
            default: null,
        },
        paymentId: {
            type: String,
            required: [true, "Payment ID is required"],
            trim: true,
            index: true,
        },
        orderId: {
            type: String,
            required: [true, "Order ID is required"],
            trim: true,
            index: true,
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
        startDate: {
            type: Date,
            default: Date.now,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive", "expired", "cancelled"],
            default: "active",
            index: true,
        },
        resumeAccess: {
            type: Boolean,
            default: false,
        },
        directMessagesLimit: {
            type: Number,
            default: 0,
        },
        directMessagesUsed: {
            type: Number,
            default: 0,
        },
        jobPostsLimit: {
            type: Number,
            default: 0,
        },
        jobPostsUsed: {
            type: Number,
            default: 0,
        },
        companyPostsLimit: {
            type: Number,
            default: 0,
        },
        companyPostsUsed: {
            type: Number,
            default: 0,
        },
        extraJobPostsPurchased: {
            type: Number,
            default: 0,
        },
        extraCompanyPostsPurchased: {
            type: Number,
            default: 0,
        },
        unlockContactsLimit: {
            type: Number,
            default: 0,
        },
        unlockContactsUsed: {
            type: Number,
            default: 0,
        },
        unlockedCandidates: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        autoRenew: {
            type: Boolean,
            default: false,
        },
        cancelledAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Virtual property to check if currently expired
subscriptionSchema.virtual("isExpired").get(function () {
    return this.endDate ? new Date() > this.endDate : false;
});

// Helper method to sync status if past endDate
subscriptionSchema.methods.checkAndUpdateExpiry = async function () {
    if (this.status === "active" && this.endDate && new Date() > this.endDate) {
        this.status = "expired";
        await this.save();
    }
    return this;
};

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
