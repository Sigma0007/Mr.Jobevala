import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: [true, "Job title is required"],
            trim: true,
        },
        companyProfileId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CompanyProfile",
            required: true,
        },
        description: {
            type: String,
            required: [true, "Job description is required"],
        },
        skills: [
            {
                type: String,
                trim: true,
            },
        ],
        jobType: {
            type: String,
            enum: ["full-time", "part-time", "contract", "internship", "freelance"],
            default: "full-time",
        },
        experience: {
            min: {
                type: Number,
                default: 0,
            },
            max: {
                type: Number,
                default: 0,
            },
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
                required: true,
            },
            state: {
                type: String,
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
        vacancies: {
            type: Number,
            default: 1,
            min: 1,
        },
        status: {
            type: String,
            enum: ["active", "closed", "draft"],
            default: "active",
        },
        applicationDeadline: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model("Job", jobSchema);
