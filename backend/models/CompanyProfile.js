import mongoose from "mongoose";

const companyProfileSchema = new mongoose.Schema(
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
        companyName: {
            type: String,
            trim: true,
            default: "",
        },
        location: {
            type: String,
            default: "",
        },
        phone: {
            type: String,
            default: "",
        },
        logo: {
            type: String,
            default: "",
        },
        website: {
            type: String,
            default: "",
        },
        industry: {
            type: String,
            default: "",
        },
        companySize: {
            type: String,
            default: "",
        },
        aboutCompany: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("CompanyProfile", companyProfileSchema);
