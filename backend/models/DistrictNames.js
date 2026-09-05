import mongoose from "mongoose";

const districtNamesSchema = new mongoose.Schema(
    {
        district_code: {
            type: Number,
            required: true,
            unique: true,
            trim: true,
        },
        district_name: {
            type: String,
            required: true,
            trim: true,
        },
        state_code: {
            type: Number,
            trim: true,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

const DistrictName = mongoose.model("DistrictName", districtNamesSchema);

export default DistrictName;