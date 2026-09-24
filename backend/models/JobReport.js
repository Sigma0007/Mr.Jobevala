import mongoose from "mongoose";

const jobReportSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: [true, "Job reference is required"],
            index: true,
        },
        reporter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Reporter user reference is required"],
            index: true,
        },
        reason: {
            type: String,
            required: [true, "Report reason is required"],
            enum: [
                "fraud",
                "fake_company",
                "money_demand",
                "spam",
                "misleading",
                "inappropriate",
                "expired_or_unavailable",
                "other",
            ],
            default: "spam",
        },
        subject: {
            type: String,
            trim: true,
            default: "",
        },
        description: {
            type: String,
            required: [true, "Detailed report description is required"],
            trim: true,
            minlength: [5, "Description must be at least 5 characters long"],
        },
        contactEmail: {
            type: String,
            trim: true,
            default: "",
        },
        contactPhone: {
            type: String,
            trim: true,
            default: "",
        },
        evidence: {
            type: String,
            trim: true,
            default: "",
        },
        status: {
            type: String,
            enum: ["pending", "investigating", "resolved", "dismissed"],
            default: "pending",
            index: true,
        },
        actionTaken: {
            type: String,
            enum: [
                "none",
                "job_removed",
                "employer_warned",
                "employer_deactivated",
                "dismissed_valid_job",
                "other",
            ],
            default: "none",
        },
        adminNotes: {
            type: String,
            trim: true,
            default: "",
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        reviewedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

jobReportSchema.index({ job: 1, reporter: 1 });

const JobReport = mongoose.model("JobReport", jobReportSchema);

export default JobReport;
