import StateName from "../models/StateNames.js";
import DistrictName from "../models/DistrictNames.js";
import SubDivisionName from "../models/SubDivisonName.js";
import catchAsync from "../utils/catchAsync.js";

// @desc    Get all states, districts, and sub-divisions (or filtered by query params)
// @route   GET /api/locations
// @access  Public
export const getAllLocations = catchAsync(async (req, res, next) => {
    const { state_code, district_code } = req.query;

    const stateFilter = {};
    const districtFilter = {};
    const subDivisionFilter = {};

    if (state_code) {
        stateFilter.state_code = Number(state_code);
        districtFilter.state_code = Number(state_code);
    }

    if (district_code) {
        districtFilter.district_code = Number(district_code);
        subDivisionFilter.district_code = Number(district_code);
    }

    const [states, districts, subDivisions] = await Promise.all([
        StateName.find(stateFilter).sort({ state_name: 1 }),
        DistrictName.find(districtFilter).sort({ district_name: 1 }),
        SubDivisionName.find(subDivisionFilter).sort({ sub_division_name: 1 }),
    ]);

    res.status(200).json({
        success: true,
        count: {
            states: states.length,
            districts: districts.length,
            subDivisions: subDivisions.length,
        },
        data: {
            states,
            districts,
            subDivisions,
        },
    });
});


// @desc    Get complete hierarchical locations (States -> Districts -> SubDivisions)
// @route   GET /api/locations/hierarchy
// @access  Public
export const getLocationsHierarchy = catchAsync(async (req, res, next) => {
    const [states, districts, subDivisions] = await Promise.all([
        StateName.find().sort({ state_name: 1 }).lean(),
        DistrictName.find().sort({ district_name: 1 }).lean(),
        SubDivisionName.find().sort({ sub_division_name: 1 }).lean(),
    ]);

    // Map sub-divisions to districts
    const subDivisionsByDistrict = subDivisions.reduce((acc, sub) => {
        if (!acc[sub.district_code]) {
            acc[sub.district_code] = [];
        }
        acc[sub.district_code].push(sub);
        return acc;
    }, {});

    // Map districts to states (and attach sub-divisions)
    const districtsByState = districts.reduce((acc, dist) => {
        if (!acc[dist.state_code]) {
            acc[dist.state_code] = [];
        }
        acc[dist.state_code].push({
            ...dist,
            subDivisions: subDivisionsByDistrict[dist.district_code] || [],
        });
        return acc;
    }, {});

    // Build final state hierarchy
    const hierarchy = states.map((state) => ({
        ...state,
        districts: districtsByState[state.state_code] || [],
    }));

    res.status(200).json({
        success: true,
        count: hierarchy.length,
        data: hierarchy,
    });
});
