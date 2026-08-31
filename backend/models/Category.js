import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Category title is required"],
            trim: true,
        },
        value: {
            type: String,
            required: [true, "Category value is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Category", categorySchema);
