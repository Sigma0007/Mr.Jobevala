import mongoose from "mongoose";

const applicationSchema =
    new mongoose.Schema(
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },

            job: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Job",
                required: true,
            },

            userProfile: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "UserProfile",
                required: true,
            },

            provider: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },

            coverLetter: {
                type: String,
                default: "",
            },

            location: {
                type: String,
                default: "",
            },

            totalExperience: {
                type: Number,
                default: 0,
            },

            noticePeriod: {
                type: String,
                default: "",
            },

            currentCTC: {
                type: String,
                default: "",
            },

            expectedCTC: {
                type: Number,
                default: 0,
            },

            currentCompany: {
                type: String,
                default: "",
            },

            currentRole: {
                type: String,
                default: "",
            },

            status: {
                type: String,

                enum: [
                    "pending",
                    "reviewed",
                    "shortlisted",
                    "interview",
                    "rejected",
                    "hired",
                ],

                default: "pending",
            },
        },
        {
            timestamps: true,
        }
    );

// One user can apply only once
applicationSchema.index(
    {
        user: 1,
        job: 1,
    },
    {
        unique: true,
    }
);

export default mongoose.model(
    "Application",
    applicationSchema
);