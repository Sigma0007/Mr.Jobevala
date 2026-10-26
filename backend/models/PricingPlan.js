import mongoose from "mongoose";

const pricingPlanSchema = new mongoose.Schema(
    {
        planId: {
            type: String,
            required: [true, "Plan ID/slug is required"],
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },
        categoryId: {
            type: String,
            required: [true, "Category ID is required"],
            enum: ["seekers", "employers", "custom"],
            default: "seekers",
            index: true,
        },
        category: {
            type: String,
            required: [true, "Category label is required"],
            default: "For Job Seekers",
            trim: true,
        },
        name: {
            type: String,
            required: [true, "Plan name is required"],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "Plan price is required"],
            min: [0, "Price cannot be negative"],
        },
        originalPrice: {
            type: Number,
            required: [true, "Original price is required"],
            min: [0, "Original price cannot be negative"],
        },
        badge: {
            type: String,
            default: "",
            trim: true,
        },
        highlighted: {
            type: Boolean,
            default: false,
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
        features: {
            type: [String],
            default: [],
        },
        directMessagesLimit: {
            type: Number,
            default: 0,
            min: [0, "Direct messages limit cannot be negative"],
        },
        jobPostsLimit: {
            type: Number,
            default: 0,
            min: [0, "Job posts limit cannot be negative"],
        },
        companyPostsLimit: {
            type: Number,
            default: 0,
            min: [0, "Company posts limit cannot be negative"],
        },
        unlockContactsLimit: {
            type: Number,
            default: 0,
            min: [0, "Unlock contacts limit cannot be negative"],
        },
        extraJobPostPrice: {
            type: Number,
            default: 99,
            min: [0, "Extra job post price cannot be negative"],
        },
        extraCompanyPostPrice: {
            type: Number,
            default: 49,
            min: [0, "Extra company post price cannot be negative"],
        },
        resumeAccess: {
            type: Boolean,
            default: false,
            index: true,
        },
        validityDays: {
            type: Number,
            default: 30,
        },
        sortOrder: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
        targetProviders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const PricingPlan = mongoose.model("PricingPlan", pricingPlanSchema);

export default PricingPlan;
