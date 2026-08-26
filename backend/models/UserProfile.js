import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            default: "",
        },
        title: {
            type: String,
            default: "",
        },
        bio: {
            type: String,
            default: "",
        },
        location: {
            type: String,
            default: "",
        },
        skills: [
            {
                type: String,
                trim: true,
            },
        ],
        experience: {
            type: Number,
            default: 0,
        },
        education: {
            type: String,
            default: "",
        },
        resume: {
            type: String,
            default: "",
        },
        profileImage: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model("UserProfile", userProfileSchema);
