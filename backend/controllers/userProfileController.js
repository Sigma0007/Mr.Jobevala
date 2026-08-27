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
    const profiles = await UserProfile.find();

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
