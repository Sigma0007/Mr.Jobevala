import CompanyProfile from "../models/CompanyProfile.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

// @desc    Get current company profile
// @route   GET /api/companyprofile
// @access  Private
export const getCompanyProfile = catchAsync(async (req, res, next) => {
    let profile = await CompanyProfile.findOne({ user: req.user.id });

    if (!profile) {
        // If profile doesn't exist yet, create an empty one with name from user if available
        profile = await CompanyProfile.create({ user: req.user.id, name: req.user.name || "Company Name" });
    }

    res.status(200).json({
        success: true,
        data: profile,
    });
});

// @desc    Update current company profile
// @route   PUT /api/companyprofile
// @access  Private
export const updateCompanyProfile = catchAsync(async (req, res, next) => {
    // Prevent updating the user reference itself
    const { user, ...updateData } = req.body;

    let profile = await CompanyProfile.findOne({ user: req.user.id });

    if (!profile) {
        // Create if it doesn't exist
        profile = await CompanyProfile.create({ user: req.user.id, ...updateData });
    } else {
        // Update existing
        profile = await CompanyProfile.findOneAndUpdate(
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
