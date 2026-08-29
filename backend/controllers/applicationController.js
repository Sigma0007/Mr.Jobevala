import Application from "../models/Application.js";
import Job from "../models/Job.js";
import UserProfile from "../models/UserProfile.js";

// @desc    Create a new application
// @route   POST /api/applications
// @access  Private (User)
export const createApplication = async (req, res, next) => {
    try {
        const { jobId, coverLetter, location, totalExperience, noticePeriod, currentCTC, expectedCTC, currentCompany, currentRole } = req.body;

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(200).json({ success: false, message: "Job not found" });
        }

        // Check if user has a profile
        const userProfile = await UserProfile.findOne({ user: req.user._id });
        if (!userProfile) {
            return res.status(200).json({ success: false, message: "Please create a user profile first" });
        }

        // Check if user has already applied
        const existingApplication = await Application.findOne({ user: req.user._id, job: jobId });
        if (existingApplication) {
            return res.status(200).json({ success: false, message: "You have already applied for this job" });
        }

        // Create application
        const application = await Application.create({
            user: req.user._id,
            job: jobId,
            provider: job.provider,
            userProfile: userProfile._id,
            coverLetter,
            location,
            totalExperience,
            noticePeriod,
            currentCTC,
            expectedCTC,
            currentCompany,
            currentRole
        });

        res.status(201).json({
            success: true,
            data: application,
            message: "Application submitted successfully"
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all applications of a user
// @route   GET /api/applications/my-applications
// @access  Private (User)
export const getUserApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({ user: req.user._id })
            .populate("job", "title location companyProfileId")
            .populate({
                path: "job",
                populate: {
                    path: "companyProfileId",
                    select: "companyName logo"
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all applications for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (Provider)
export const getJobApplications = async (req, res, next) => {
    try {
        const { jobId } = req.params;

        // Check if job exists and belongs to the provider
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        if (job.provider.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to view applications for this job" });
        }

        const applications = await Application.find({ job: jobId })
            .populate("userProfile", "name phone title profileImage resume experience skills")
            .populate("user", "email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update application status
// @route   PATCH /api/applications/:id/status
// @access  Private (Provider)
export const updateApplicationStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const application = await Application.findById(id).populate("job");

        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        // Check if provider owns the job
        if (application.job.provider.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to update this application" });
        }

        const validStatuses = ["pending", "reviewed", "shortlisted", "rejected", "accepted"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }

        application.status = status;
        await application.save();

        res.status(200).json({
            success: true,
            data: application,
            message: "Application status updated successfully"
        });
    } catch (error) {
        next(error);
    }
};
