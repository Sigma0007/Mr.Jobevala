import UserProfile from "../models/UserProfile.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

// @desc    Get current user profile
// @route   GET /api/userprofile
// @access  Private
export const getUserProfile = catchAsync(async (req, res, next) => {
    let profile = await UserProfile.findOne({ user: req.user.id });

    if (!profile) {
        // If profile doesn't exist yet, create an empty one
        profile = await UserProfile.create({ user: req.user.id });
    }

    res.status(200).json({
        success: true,
        data: profile,
    });
});

// @desc    Get all user profiles
// @route   GET /api/userprofiles
// @access  Public
export const getAllUserProfile = catchAsync(async (req, res, next) => {
    const {
        search,
        categories,
        experience,
        workModes,
        jobTypes,
        salaryRanges
    } = req.query;

    const query = {};
    const andConditions = [];

    if (search) {
        andConditions.push({
            $or: [
                { name: { $regex: search, $options: "i" } },
                { title: { $regex: search, $options: "i" } }
            ]
        });
    }

    if (categories) {
        query.category = { $in: categories.split(",") };
    }

    if (workModes) {
        query['location.workMode'] = { $in: workModes.split(",") };
    }

    if (jobTypes) {
        query.jobType = { $in: jobTypes.split(",") };
    }

    if (experience) {
        const expRanges = experience.split(",");
        const expConditions = expRanges.map(range => {
            if (range.includes("+")) {
                const min = Number(range.replace("+", ""));
                return { experience: { $gte: min } };
            }
            const [min, max] = range.split("-").map(Number);
            return { experience: { $gte: min, $lte: max } };
        });
        andConditions.push({ $or: expConditions });
    }

    if (salaryRanges) {
        const salaryArr = salaryRanges.split(",");
        if (!salaryArr.includes("Any Salary")) {
            const salaryConditions = salaryArr.map(range => {
                if (range.includes("+")) {
                    const min = Number(range.replace("+", ""));
                    return { $or: [{ 'salary.min': { $gte: min } }, { 'salary.max': { $gte: min } }] };
                }
                const [min, max] = range.split("-").map(Number);
                return {
                    $or: [
                        { 'salary.min': { $gte: min, $lte: max } },
                        { 'salary.max': { $gte: min, $lte: max } },
                        { $and: [{ 'salary.min': { $lte: min } }, { 'salary.max': { $gte: max } }] }
                    ]
                };
            });
            andConditions.push({ $or: salaryConditions });
        }
    }

    if (andConditions.length > 0) {
        query.$and = andConditions;
    }

    const profiles = await UserProfile.find(query);

    res.status(200).json({
        success: true,
        data: profiles,
    });
});


// @desc    Update current user profile
// @route   PUT /api/userprofile
// @access  Private
export const updateUserProfile = catchAsync(async (req, res, next) => {
    // Prevent updating the user reference itself
    const { user, ...updateData } = req.body;

    let profile = await UserProfile.findOne({ user: req.user.id });

    if (!profile) {
        // Create if it doesn't exist
        profile = await UserProfile.create({ user: req.user.id, ...updateData });
    } else {
        // Update existing
        profile = await UserProfile.findOneAndUpdate(
            { user: req.user.id },
            updateData,
            { new: true, runValidators: true }
        );
    }

    res.status(200).json({
        success: true,
        data: profile,
    });
});
