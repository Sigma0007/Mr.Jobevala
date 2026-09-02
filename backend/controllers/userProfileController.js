import UserProfile from "../models/UserProfile.js";
import Application from "../models/Application.js";
import SavedJob from "../models/SavedJob.js";
import Job from "../models/Job.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

// @desc    Get user dashboard overview stats, profile completeness, recent applications & saved jobs
// @route   GET /api/userprofile/overview
// @access  Private (User)
export const getUserOverview = catchAsync(async (req, res, next) => {
    const userId = req.user.id || req.user._id;

    // 1. Get or create user profile
    let profile = await UserProfile.findOne({ user: userId });
    if (!profile) {
        profile = await UserProfile.create({ user: userId });
    }

    // 2. Profile completeness calculation
    let completenessScore = 0;
    const completenessCriteria = [
        { field: "name", label: "Full Name", weight: 15, valid: !!(profile.name && profile.name.trim()) },
        { field: "title", label: "Professional Title", weight: 15, valid: !!(profile.title && profile.title.trim()) },
        { field: "phone", label: "Phone Number", weight: 10, valid: !!(profile.phone && profile.phone.trim()) },
        { field: "bio", label: "About / Bio", weight: 10, valid: !!(profile.bio && profile.bio.trim()) },
        { field: "category", label: "Industry Category", weight: 10, valid: !!(profile.category && profile.category.trim()) },
        { field: "skills", label: "Skills", weight: 15, valid: Array.isArray(profile.skills) && profile.skills.length > 0 },
        { field: "resume", label: "Resume CV", weight: 15, valid: !!(profile.resume && profile.resume.trim()) },
        { field: "location", label: "Location City", weight: 10, valid: !!(profile.location?.city && profile.location.city.trim()) },
    ];
    completenessCriteria.forEach((c) => {
        if (c.valid) completenessScore += c.weight;
    });

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // 3. Applications statistics
    const [
        totalApplications,
        appliedThisWeek,
        pendingCount,
        reviewedCount,
        shortlistedCount,
        interviewCount,
        hiredCount,
        rejectedCount,
    ] = await Promise.all([
        Application.countDocuments({ user: userId }),
        Application.countDocuments({ user: userId, createdAt: { $gte: oneWeekAgo } }),
        Application.countDocuments({ user: userId, status: "pending" }),
        Application.countDocuments({ user: userId, status: "reviewed" }),
        Application.countDocuments({ user: userId, status: "shortlisted" }),
        Application.countDocuments({ user: userId, status: "interview" }),
        Application.countDocuments({ user: userId, status: "hired" }),
        Application.countDocuments({ user: userId, status: "rejected" }),
    ]);

    // 4. Saved Jobs statistics
    const [totalSaved, savedThisWeek] = await Promise.all([
        SavedJob.countDocuments({ user: userId }),
        SavedJob.countDocuments({ user: userId, createdAt: { $gte: oneWeekAgo } }),
    ]);

    // 5. Recent Applications (top 5)
    const recentApplications = await Application.find({ user: userId })
        .populate({
            path: "job",
            select: "title location salary jobType companyProfile status",
            populate: {
                path: "companyProfile",
                select: "companyName logo",
            },
        })
        .sort({ createdAt: -1 })
        .limit(5);

    // 6. Recent Saved Jobs (top 4)
    const recentSavedJobs = await SavedJob.find({ user: userId })
        .populate({
            path: "job",
            populate: {
                path: "companyProfile",
            },
        })
        .sort({ createdAt: -1 })
        .limit(4);

    // 7. Recommended / Latest Active Jobs (top 4)
    const jobFilter = { status: "active" };
    if (profile.category) {
        jobFilter.category = profile.category;
    }
    let recommendedJobs = await Job.find(jobFilter)
        .populate("companyProfile")
        .sort({ createdAt: -1 })
        .limit(4);

    // If no jobs in user's category, fetch general latest active jobs
    if (recommendedJobs.length === 0) {
        recommendedJobs = await Job.find({ status: "active" })
            .populate("companyProfile")
            .sort({ createdAt: -1 })
            .limit(4);
    }

    res.status(200).json({
        success: true,
        data: {
            profile,
            completeness: {
                score: completenessScore,
                criteria: completenessCriteria,
            },
            stats: {
                totalApplied: totalApplications,
                appliedThisWeek,
                inReview: pendingCount + reviewedCount,
                interviewAndShortlisted: shortlistedCount + interviewCount,
                totalSaved,
                savedThisWeek,
                hired: hiredCount,
                rejected: rejectedCount,
                statusBreakdown: {
                    pending: pendingCount,
                    reviewed: reviewedCount,
                    shortlisted: shortlistedCount,
                    interview: interviewCount,
                    hired: hiredCount,
                    rejected: rejectedCount,
                },
            },
            recentApplications,
            recentSavedJobs,
            recommendedJobs,
        },
    });
});


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
