import dotenv from "dotenv";

import connectDB from "../config/db.js";
import StateName from "../models/StateNames.js";
import DistrictName from "../models/DistrictNames.js";
import SubDivisionName from "../models/SubDivisonName.js";

// import josn file

import StateJson from "../Location Data/State.json" with { type: "json" };
import DistrictJson from "../Location Data/District.json" with { type: "json" };
import SubDivisionJson from "../Location Data/SubDivision.json" with { type: "json" };

dotenv.config();



const AddLocationCategories = async () => {
    try {
        await connectDB();
        // Add State Names

        const StateData = StateJson.map(item => ({
            state_code: item.state_code,
            state_name: item?.state_name_english || item.state_name
        }))

        await StateName.insertMany(StateData)

        // Add District Names

        const DistrictData = DistrictJson.map(item => ({
            district_code: item.district_code,
            district_name: item?.district_name_english || item.district_name,
            state_code: item.state_code
        }))

        await DistrictName.insertMany(DistrictData)

        // Add Sub Division Names

        const SubDivisionData = SubDivisionJson.map(item => ({
            sub_division_code: item.subdistrict_code || item.sub_division_code,
            sub_division_name: item.subdistrict_name_english || item.sub_division_name,
            district_code: item.district_code
        }))

        await SubDivisionName.insertMany(SubDivisionData)

        console.log("Location Categories added successfully");

        process.exit();
    } catch (error) {
        console.error(error);

        process.exit(1);
    }
};

AddLocationCategories();