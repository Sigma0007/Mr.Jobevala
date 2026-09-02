import CompanyProfile from "../models/CompanyProfile.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import UserProfile from "../models/UserProfile.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

// @desc    Get provider dashboard overview statistics, company completeness, recent applicants and recent jobs
// @route   GET /api/companyprofile/overview
// @access  Private (Provider)
export const getProviderOverview = catchAsync(async (req, res, next) => {
    const providerId = req.user.id || req.user._id;

    // 1. Fetch or create company profile
    let profile = await CompanyProfile.findOne({ user: providerId });
    if (!profile) {
        profile = await CompanyProfile.create({
            user: providerId,
            name: req.user.name || "Company Name",
            companyName: req.user.name || "Company Name"
        });
    }

    // 2. Calculate company profile completeness score
    let completenessScore = 0;
    const completenessCriteria = [
        { field: "companyName", label: "Company Name", weight: 15, valid: !!(profile.companyName && profile.companyName.trim()) },
        { field: "logo", label: "Company Logo", weight: 15, valid: !!(profile.logo && profile.logo.trim()) },
        { field: "industry", label: "Industry", weight: 10, valid: !!(profile.industry && profile.industry.trim()) },
        { field: "location", label: "Location", weight: 10, valid: !!(profile.location && profile.location.trim()) },
        { field: "aboutCompany", label: "About Company", weight: 15, valid: !!(profile.aboutCompany && profile.aboutCompany.trim()) },
        { field: "website", label: "Website", weight: 10, valid: !!(profile.website && profile.website.trim()) },
        { field: "phone", label: "Contact Phone", weight: 10, valid: !!(profile.phone && profile.phone.trim()) },
        { field: "companySize", label: "Company Size", weight: 5, valid: !!(profile.companySize && profile.companySize.trim()) },
        { field: "benefits", label: "Perks & Benefits", weight: 10, valid: Array.isArray(profile.benefits) && profile.benefits.length > 0 },
    ];
    completenessCriteria.forEach((c) => {
        if (c.valid) completenessScore += c.weight;
    });

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // 3. Job metrics
    const [
        totalJobs,
        activeJobs,
        closedJobs,
        draftJobs,
        jobsPostedThisWeek,
    ] = await Promise.all([
        Job.countDocuments({ provider: providerId }),
        Job.countDocuments({ provider: providerId, status: "active" }),
        Job.countDocuments({ provider: providerId, status: "closed" }),
        Job.countDocuments({ provider: providerId, status: "draft" }),
        Job.countDocuments({ provider: providerId, createdAt: { $gte: oneWeekAgo } }),
    ]);

    // 4. Application metrics
    const [
        totalApplications,
        applicationsThisWeek,
        pendingCount,
        reviewedCount,
        shortlistedCount,
        interviewCount,
        hiredCount,
        rejectedCount,
    ] = await Promise.all([
        Application.countDocuments({ provider: providerId }),
        Application.countDocuments({ provider: providerId, createdAt: { $gte: oneWeekAgo } }),
        Application.countDocuments({ provider: providerId, status: "pending" }),
        Application.countDocuments({ provider: providerId, status: "reviewed" }),
        Application.countDocuments({ provider: providerId, status: "shortlisted" }),
        Application.countDocuments({ provider: providerId, status: "interview" }),
        Application.countDocuments({ provider: providerId, status: "hired" }),
        Application.countDocuments({ provider: providerId, status: "rejected" }),
    ]);

    // 5. Recent applications (top 6)
    const recentApplications = await Application.find({ provider: providerId })
        .populate("job", "title location jobType category salary status")
        .populate("userProfile", "name phone title profileImage resume experience skills education")
        .populate("user", "email")
        .sort({ createdAt: -1 })
        .limit(6);

    // 6. Recent posted jobs (top 5) with application counts
    const recentJobs = await Job.find({ provider: providerId })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    const recentJobsWithCount = await Promise.all(
        recentJobs.map(async (job) => {
            const applicantCount = await Application.countDocuments({ job: job._id });
            return {
                ...job,
                applicantCount,
            };
        })
    );

    res.status(200).json({
        success: true,
        data: {
            profile,
            completeness: {
                score: completenessScore,
                criteria: completenessCriteria,
            },
            stats: {
                totalJobs,
                activeJobs,
                closedJobs,
                draftJobs,
                jobsPostedThisWeek,
                totalApplications,
                applicationsThisWeek,
                pendingCount,
                reviewedCount,
                shortlistedCount,
                interviewCount,
                hiredCount,
                rejectedCount,
                inReview: pendingCount + reviewedCount,
                shortlistedOrInterview: shortlistedCount + interviewCount,
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
            recentJobs: recentJobsWithCount,
        },
    });
});

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
