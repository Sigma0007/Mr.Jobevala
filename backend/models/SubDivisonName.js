import mongoose from "mongoose";

const subDivisionSchema = new mongoose.Schema({
    sub_division_code: {
        type: Number,
        required: true,
        unique: true,
        trim: true,
    },
    sub_division_name: {
        type: String,
        required: true,
        trim: true,
    },
    district_code: {
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

const SubDivisionName = mongoose.model("SubDivisionName", subDivisionSchema);

export default SubDivisionName;