import mongoose from "mongoose";

const stateNamesSchema = new mongoose.Schema({
    state_code: {
        type: Number,
        required: true,
        unique: true,
        trim: true,
    },
    state_name: {
        type: String,
        required: true,
        trim: true,
    }
},
    {
        timestamps: true,
        versionKey: false,
    }
);

const StateName = mongoose.model("StateName", stateNamesSchema);

export default StateName;