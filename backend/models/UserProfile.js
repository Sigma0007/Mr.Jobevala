import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: 2,
            maxlength: 100,
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
        salary: {
            min: {
                type: Number,
                default: 0,
            },
            max: {
                type: Number,
                default: 0,
            },
            currency: {
                type: String,
                default: "INR",
            },
        },
        location: {
            city: {
                type: String,
                default: "",
            },
            state: {
                type: String,
                default: "",
            },
            country: {
                type: String,
                default: "India",
            },
            isRemote: {
                type: Boolean,
                default: false,
            },
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
