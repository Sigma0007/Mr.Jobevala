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
            validityDays: { type: Number, default: 30 },
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
        unlockContactsLimit: {
            type: Number,
            default: 0,
        },
        unlockContactsUsed: {
            type: Number,
            default: 0,
        },
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
