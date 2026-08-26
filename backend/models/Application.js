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

            coverLetter: {
                type: String,
                default: "",
            },

            resume: {
                type: String,
                default: "",
            },

            status: {
                type: String,

                enum: [
                    "pending",
                    "reviewed",
                    "shortlisted",
                    "rejected",
                    "accepted",
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