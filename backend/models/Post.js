import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Provider reference is required"],
        },
        companyProfile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CompanyProfile",
        },
        authorHeadline: {
            type: String,
            trim: true,
            default: "Employer & Recruiter",
        },
        description: {
            type: String,
            trim: true,
            default: "",
            maxLength: [3000, "Post description cannot exceed 3000 characters"],
        },
        image: {
            type: String,
            default: "",
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        likesCount: {
            type: Number,
            default: 0,
        },
        sharesCount: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["published", "archived"],
            default: "published",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Pre-validate hook: Ensure at least description or image is provided
postSchema.pre("validate", function () {
    const hasDescription = this.description && this.description.trim().length > 0;
    const hasImage = this.image && this.image.trim().length > 0;
    if (!hasDescription && !hasImage) {
        throw new Error("Post must have at least an image or a description.");
    }
});

export default mongoose.model("Post", postSchema);


