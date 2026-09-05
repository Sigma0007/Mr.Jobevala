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
        companyProfile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CompanyProfile",
            required: true,
        },
        category: {
            type: String,
            trim: true,
            default: "",
        },
        subCategory: {
            type: String,
            trim: true,
            default: "",
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
        qualification: {
            type: String,
            default: "",
        },
        education: {
            type: String,
            trim: true,
            default: "",
        },
        genderPreference: {
            type: String,
            default: "any",
        },
        jobTimings: {
            type: String,
            default: "",
        },
        jobShift: {
            type: String,
            default: "day",
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
                default: '',
            },
            country: {
                type: String,
                default: "",
            },
            talukaOrVillage: {
                type: String,
                default: "",
            },
            address: {
                type: String,
                default: "",
            },
            workMode: {
                type: String,
                enum: ["remote", "on-site", "hybrid"],
                default: "on-site",
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
        versionKey: false,
    },
);

export default mongoose.model("Job", jobSchema);
