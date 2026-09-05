import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
    {
        label: {
            type: String,
            required: [true, "Role label is required"],
            trim: true,
        },
        value: {
            type: String,
            required: [true, "Role value is required"],
            trim: true,
            lowercase: true,
        },
    },
    { _id: false }
);

const categorySchema = new mongoose.Schema(
    {
        label: {
            type: String,
            trim: true,
        },
        value: {
            type: String,
            required: [true, "Category value is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        roles: {
            type: [roleSchema],
            default: [],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model("Category", categorySchema);
