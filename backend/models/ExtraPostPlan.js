import mongoose from "mongoose";

const extraPostPlanSchema = new mongoose.Schema(
    {
        planId: {
            type: String,
            required: [true, "Plan ID/slug is required"],
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },
        name: {
            type: String,
            required: [true, "Plan name is required"],
            trim: true,
        },
        postType: {
            type: String,
            required: [true, "Post type is required"],
            enum: ["job_post", "company_post"],
            default: "job_post",
            index: true,
        },
        quantity: {
            type: Number,
            required: [true, "Post quantity is required"],
            min: [1, "Quantity must be at least 1"],
            default: 1,
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"],
        },
        originalPrice: {
            type: Number,
            default: 0,
            min: [0, "Original price cannot be negative"],
        },
        tag: {
            type: String,
            default: "",
            trim: true,
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
        sortOrder: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
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

const ExtraPostPlan = mongoose.model("ExtraPostPlan", extraPostPlanSchema);

export default ExtraPostPlan;
