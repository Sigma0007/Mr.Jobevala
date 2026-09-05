import StateName from "../models/StateNames.js";
import DistrictName from "../models/DistrictNames.js";
import SubDivisionName from "../models/SubDivisonName.js";
import AppError from "../utils/AppError.js";
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

// @desc    Get next sequential code for state, district, or sub-division
// @route   GET /api/locations/next-code?type=state|district|subdivision
// @access  Private/Admin
export const getNextLocationCode = catchAsync(async (req, res, next) => {
    const { type } = req.query;

    let nextCode = 1;

    if (type === "state") {
        const lastState = await StateName.findOne().sort({ state_code: -1 }).select("state_code").lean();
        nextCode = lastState && !isNaN(lastState.state_code) ? Number(lastState.state_code) + 1 : 1;
    } else if (type === "district") {
        const lastDistrict = await DistrictName.findOne().sort({ district_code: -1 }).select("district_code").lean();
        nextCode = lastDistrict && !isNaN(lastDistrict.district_code) ? Number(lastDistrict.district_code) + 1 : 100;
    } else if (type === "subdivision") {
        const lastSubDiv = await SubDivisionName.findOne().sort({ sub_division_code: -1 }).select("sub_division_code").lean();
        nextCode = lastSubDiv && !isNaN(lastSubDiv.sub_division_code) ? Number(lastSubDiv.sub_division_code) + 1 : 1000;
    } else {
        return next(new AppError("Invalid location type specified. Must be state, district, or subdivision.", 400));
    }

    res.status(200).json({
        success: true,
        data: {
            type,
            next_code: nextCode,
        },
    });
});

// ==========================================
// STATE CRUD CONTROLLERS
// ==========================================

// @desc    Create new state
// @route   POST /api/locations/states
// @access  Private/Admin
export const createState = catchAsync(async (req, res, next) => {
    let { state_name, state_code } = req.body;

    if (!state_name || !state_name.trim()) {
        return next(new AppError("State name is required.", 400));
    }

    state_name = state_name.trim();

    // Auto-generate code if missing
    if (state_code === undefined || state_code === null || state_code === "") {
        const lastState = await StateName.findOne().sort({ state_code: -1 }).select("state_code").lean();
        state_code = lastState && !isNaN(lastState.state_code) ? Number(lastState.state_code) + 1 : 1;
    } else {
        state_code = Number(state_code);
        if (isNaN(state_code)) {
            return next(new AppError("State code must be a valid number.", 400));
        }
    }

    // Check duplicate code
    const existingCode = await StateName.findOne({ state_code });
    if (existingCode) {
        return next(new AppError(`State with code ${state_code} already exists (${existingCode.state_name}).`, 409));
    }

    // Check duplicate name
    const existingName = await StateName.findOne({
        state_name: { $regex: new RegExp(`^${state_name}$`, "i") }
    });
    if (existingName) {
        return next(new AppError(`State with name "${state_name}" already exists.`, 409));
    }

    const newState = await StateName.create({
        state_name,
        state_code
    });

    res.status(201).json({
        success: true,
        message: "State created successfully.",
        data: newState,
    });
});

// @desc    Update state
// @route   PUT /api/locations/states/:id
// @access  Private/Admin
export const updateState = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let { state_name, state_code } = req.body;

    const state = await StateName.findById(id);
    if (!state) {
        return next(new AppError("State not found.", 404));
    }

    if (state_name && state_name.trim()) {
        state_name = state_name.trim();
        const existingName = await StateName.findOne({
            _id: { $ne: id },
            state_name: { $regex: new RegExp(`^${state_name}$`, "i") }
        });
        if (existingName) {
            return next(new AppError(`State with name "${state_name}" already exists.`, 409));
        }
        state.state_name = state_name;
    }

    if (state_code !== undefined && state_code !== null && state_code !== "") {
        state_code = Number(state_code);
        if (isNaN(state_code)) {
            return next(new AppError("State code must be a valid number.", 400));
        }

        if (state_code !== state.state_code) {
            const existingCode = await StateName.findOne({ _id: { $ne: id }, state_code });
            if (existingCode) {
                return next(new AppError(`State with code ${state_code} already exists (${existingCode.state_name}).`, 409));
            }

            // Update associated districts with new state_code
            const oldStateCode = state.state_code;
            state.state_code = state_code;
            await DistrictName.updateMany({ state_code: oldStateCode }, { state_code });
        }
    }

    await state.save();

    res.status(200).json({
        success: true,
        message: "State updated successfully.",
        data: state,
    });
});

// @desc    Delete state
// @route   DELETE /api/locations/states/:id
// @access  Private/Admin
export const deleteState = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const state = await StateName.findById(id);
    if (!state) {
        return next(new AppError("State not found.", 404));
    }

    // Check hierarchy: districts under this state
    const childDistrictsCount = await DistrictName.countDocuments({ state_code: state.state_code });
    if (childDistrictsCount > 0) {
        return next(new AppError(
            `Cannot delete state "${state.state_name}" because it contains ${childDistrictsCount} district(s). Please delete or reassign child districts first.`,
            400
        ));
    }

    await StateName.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: `State "${state.state_name}" deleted successfully.`,
    });
});

// ==========================================
// DISTRICT CRUD CONTROLLERS
// ==========================================

// @desc    Create new district
// @route   POST /api/locations/districts
// @access  Private/Admin
export const createDistrict = catchAsync(async (req, res, next) => {
    let { district_name, district_code, state_code } = req.body;

    if (!district_name || !district_name.trim()) {
        return next(new AppError("District name is required.", 400));
    }
    district_name = district_name.trim();

    if (state_code === undefined || state_code === null || state_code === "") {
        return next(new AppError("Parent state (state_code) is required.", 400));
    }
    state_code = Number(state_code);
    if (isNaN(state_code)) {
        return next(new AppError("Invalid state code.", 400));
    }

    // Hierarchy validation: check if parent state exists
    const parentState = await StateName.findOne({ state_code });
    if (!parentState) {
        return next(new AppError(`Parent state with code ${state_code} does not exist.`, 404));
    }

    // Auto-generate district_code if missing
    if (district_code === undefined || district_code === null || district_code === "") {
        const lastDistrict = await DistrictName.findOne().sort({ district_code: -1 }).select("district_code").lean();
        district_code = lastDistrict && !isNaN(lastDistrict.district_code) ? Number(lastDistrict.district_code) + 1 : 100;
    } else {
        district_code = Number(district_code);
        if (isNaN(district_code)) {
            return next(new AppError("District code must be a valid number.", 400));
        }
    }

    // Check duplicate district code
    const existingCode = await DistrictName.findOne({ district_code });
    if (existingCode) {
        return next(new AppError(`District with code ${district_code} already exists (${existingCode.district_name}).`, 409));
    }

    // Check duplicate district name in the same state
    const existingNameInState = await DistrictName.findOne({
        state_code,
        district_name: { $regex: new RegExp(`^${district_name}$`, "i") }
    });
    if (existingNameInState) {
        return next(new AppError(`District "${district_name}" already exists in ${parentState.state_name}.`, 409));
    }

    const newDistrict = await DistrictName.create({
        district_name,
        district_code,
        state_code
    });

    res.status(201).json({
        success: true,
        message: "District created successfully.",
        data: newDistrict,
    });
});

// @desc    Update district
// @route   PUT /api/locations/districts/:id
// @access  Private/Admin
export const updateDistrict = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let { district_name, district_code, state_code } = req.body;

    const district = await DistrictName.findById(id);
    if (!district) {
        return next(new AppError("District not found.", 404));
    }

    if (state_code !== undefined && state_code !== null && state_code !== "") {
        state_code = Number(state_code);
        if (isNaN(state_code)) {
            return next(new AppError("Invalid state code.", 400));
        }

        // Validate parent state exists
        const parentState = await StateName.findOne({ state_code });
        if (!parentState) {
            return next(new AppError(`Parent state with code ${state_code} does not exist.`, 404));
        }
        district.state_code = state_code;
    }

    if (district_name && district_name.trim()) {
        district_name = district_name.trim();
        const existingName = await DistrictName.findOne({
            _id: { $ne: id },
            state_code: district.state_code,
            district_name: { $regex: new RegExp(`^${district_name}$`, "i") }
        });
        if (existingName) {
            return next(new AppError(`District "${district_name}" already exists in this state.`, 409));
        }
        district.district_name = district_name;
    }

    if (district_code !== undefined && district_code !== null && district_code !== "") {
        district_code = Number(district_code);
        if (isNaN(district_code)) {
            return next(new AppError("District code must be a valid number.", 400));
        }

        if (district_code !== district.district_code) {
            const existingCode = await DistrictName.findOne({ _id: { $ne: id }, district_code });
            if (existingCode) {
                return next(new AppError(`District with code ${district_code} already exists (${existingCode.district_name}).`, 409));
            }

            // Update associated sub-divisions
            const oldDistrictCode = district.district_code;
            district.district_code = district_code;
            await SubDivisionName.updateMany({ district_code: oldDistrictCode }, { district_code });
        }
    }

    await district.save();

    res.status(200).json({
        success: true,
        message: "District updated successfully.",
        data: district,
    });
});

// @desc    Delete district
// @route   DELETE /api/locations/districts/:id
// @access  Private/Admin
export const deleteDistrict = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const district = await DistrictName.findById(id);
    if (!district) {
        return next(new AppError("District not found.", 404));
    }

    // Check hierarchy: sub-divisions under this district
    const childSubDivsCount = await SubDivisionName.countDocuments({ district_code: district.district_code });
    if (childSubDivsCount > 0) {
        return next(new AppError(
            `Cannot delete district "${district.district_name}" because it contains ${childSubDivsCount} sub-division(s). Please delete child sub-divisions first.`,
            400
        ));
    }

    await DistrictName.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: `District "${district.district_name}" deleted successfully.`,
    });
});

// ==========================================
// SUB-DIVISION CRUD CONTROLLERS
// ==========================================

// @desc    Create new sub-division
// @route   POST /api/locations/subdivisions
// @access  Private/Admin
export const createSubDivision = catchAsync(async (req, res, next) => {
    let { sub_division_name, sub_division_code, district_code } = req.body;

    if (!sub_division_name || !sub_division_name.trim()) {
        return next(new AppError("Sub-division name is required.", 400));
    }
    sub_division_name = sub_division_name.trim();

    if (district_code === undefined || district_code === null || district_code === "") {
        return next(new AppError("Parent district (district_code) is required.", 400));
    }
    district_code = Number(district_code);
    if (isNaN(district_code)) {
        return next(new AppError("Invalid district code.", 400));
    }

    // Hierarchy validation: check if parent district exists
    const parentDistrict = await DistrictName.findOne({ district_code });
    if (!parentDistrict) {
        return next(new AppError(`Parent district with code ${district_code} does not exist.`, 404));
    }

    // Auto-generate sub_division_code if missing
    if (sub_division_code === undefined || sub_division_code === null || sub_division_code === "") {
        const lastSubDiv = await SubDivisionName.findOne().sort({ sub_division_code: -1 }).select("sub_division_code").lean();
        sub_division_code = lastSubDiv && !isNaN(lastSubDiv.sub_division_code) ? Number(lastSubDiv.sub_division_code) + 1 : 1000;
    } else {
        sub_division_code = Number(sub_division_code);
        if (isNaN(sub_division_code)) {
            return next(new AppError("Sub-division code must be a valid number.", 400));
        }
    }

    // Check duplicate sub-division code
    const existingCode = await SubDivisionName.findOne({ sub_division_code });
    if (existingCode) {
        return next(new AppError(`Sub-division with code ${sub_division_code} already exists (${existingCode.sub_division_name}).`, 409));
    }

    // Check duplicate sub-division name in the same district
    const existingNameInDistrict = await SubDivisionName.findOne({
        district_code,
        sub_division_name: { $regex: new RegExp(`^${sub_division_name}$`, "i") }
    });
    if (existingNameInDistrict) {
        return next(new AppError(`Sub-division "${sub_division_name}" already exists in ${parentDistrict.district_name}.`, 409));
    }

    const newSubDivision = await SubDivisionName.create({
        sub_division_name,
        sub_division_code,
        district_code
    });

    res.status(201).json({
        success: true,
        message: "Sub-division created successfully.",
        data: newSubDivision,
    });
});

// @desc    Update sub-division
// @route   PUT /api/locations/subdivisions/:id
// @access  Private/Admin
export const updateSubDivision = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let { sub_division_name, sub_division_code, district_code } = req.body;

    const subDivision = await SubDivisionName.findById(id);
    if (!subDivision) {
        return next(new AppError("Sub-division not found.", 404));
    }

    if (district_code !== undefined && district_code !== null && district_code !== "") {
        district_code = Number(district_code);
        if (isNaN(district_code)) {
            return next(new AppError("Invalid district code.", 400));
        }

        // Validate parent district exists
        const parentDistrict = await DistrictName.findOne({ district_code });
        if (!parentDistrict) {
            return next(new AppError(`Parent district with code ${district_code} does not exist.`, 404));
        }
        subDivision.district_code = district_code;
    }

    if (sub_division_name && sub_division_name.trim()) {
        sub_division_name = sub_division_name.trim();
        const existingName = await SubDivisionName.findOne({
            _id: { $ne: id },
            district_code: subDivision.district_code,
            sub_division_name: { $regex: new RegExp(`^${sub_division_name}$`, "i") }
        });
        if (existingName) {
            return next(new AppError(`Sub-division "${sub_division_name}" already exists in this district.`, 409));
        }
        subDivision.sub_division_name = sub_division_name;
    }

    if (sub_division_code !== undefined && sub_division_code !== null && sub_division_code !== "") {
        sub_division_code = Number(sub_division_code);
        if (isNaN(sub_division_code)) {
            return next(new AppError("Sub-division code must be a valid number.", 400));
        }

        if (sub_division_code !== subDivision.sub_division_code) {
            const existingCode = await SubDivisionName.findOne({ _id: { $ne: id }, sub_division_code });
            if (existingCode) {
                return next(new AppError(`Sub-division with code ${sub_division_code} already exists (${existingCode.sub_division_name}).`, 409));
            }
            subDivision.sub_division_code = sub_division_code;
        }
    }

    await subDivision.save();

    res.status(200).json({
        success: true,
        message: "Sub-division updated successfully.",
        data: subDivision,
    });
});

// @desc    Delete sub-division
// @route   DELETE /api/locations/subdivisions/:id
// @access  Private/Admin
export const deleteSubDivision = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const subDivision = await SubDivisionName.findById(id);
    if (!subDivision) {
        return next(new AppError("Sub-division not found.", 404));
    }

    await SubDivisionName.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: `Sub-division "${subDivision.sub_division_name}" deleted successfully.`,
    });
});
