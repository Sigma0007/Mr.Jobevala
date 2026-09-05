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
            trim: true,
            default: "",
        },
        ownerName: {
            type: String,
            trim: true,
            default: "",
        },
        ownerPhone: {
            type: String,
            trim: true,
            default: "",
        },
        ownerEmail: {
            type: String,
            trim: true,
            default: "",
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
        lat: {
            type: Number,
            default: null,
        },
        lng: {
            type: Number,
            default: null,
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
        establishYear: {
            type: String,
            default: "",
        },
        benefits: {
            type: [String],
            default: [],
        },
        contactPersonRole: {
            type: String,
            default: "",
        },
        contactPersonName: {
            type: String,
            default: "",
        },
        contactPersonPhone: {
            type: String,
            default: "",
        },
        contactPersonEmail: {
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
        versionKey: false,
    }
);

export default mongoose.model("CompanyProfile", companyProfileSchema);
