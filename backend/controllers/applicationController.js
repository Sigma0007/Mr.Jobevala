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
        const { status, search, sortBy } = req.query;

        // Fetch all applications of this user with populated job details
        const allApplications = await Application.find({ user: req.user._id })
            .populate({
                path: "job",
                populate: {
                    path: "companyProfile"
                }
            });

        // Compute overall status counts across all applications of the user
        const statusCounts = {
            all: allApplications.length,
            pending: 0,
            reviewed: 0,
            shortlisted: 0,
            interview: 0,
            hired: 0,
            rejected: 0,
        };

        allApplications.forEach((app) => {
            const st = (app.status || "pending").toLowerCase();
            if (statusCounts[st] !== undefined) {
                statusCounts[st] += 1;
            }
        });

        // Filter applications based on query parameters
        let filtered = allApplications.filter((app) => {
            // Status filter
            if (status && status !== "all") {
                if ((app.status || "pending").toLowerCase() !== status.toLowerCase()) {
                    return false;
                }
            }

            // Search filter
            if (search && search.trim()) {
                const term = search.trim().toLowerCase();
                const title = (app.job?.title || "").toLowerCase();
                const company = (app.job?.companyProfile?.companyName || "").toLowerCase();
                const location = (app.location || app.job?.location?.city || "").toLowerCase();
                const currentRole = (app.currentRole || "").toLowerCase();
                const currentCompany = (app.currentCompany || "").toLowerCase();
                const category = (app.job?.category || "").toLowerCase();
                const skills = (app.job?.skills || []).join(" ").toLowerCase();

                const matches =
                    title.includes(term) ||
                    company.includes(term) ||
                    location.includes(term) ||
                    currentRole.includes(term) ||
                    currentCompany.includes(term) ||
                    category.includes(term) ||
                    skills.includes(term);

                if (!matches) return false;
            }

            return true;
        });

        // Sort applications
        if (sortBy === "oldest") {
            filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else if (sortBy === "salary") {
            filtered.sort((a, b) => {
                const salA = a.job?.salary?.max || 0;
                const salB = b.job?.salary?.max || 0;
                return Number(salB) - Number(salA);
            });
        } else if (sortBy === "experience") {
            filtered.sort((a, b) => {
                const expA = a.totalExperience || 0;
                const expB = b.totalExperience || 0;
                return Number(expB) - Number(expA);
            });
        } else {
            // Default newest
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        res.status(200).json({
            success: true,
            count: filtered.length,
            statusCounts,
            data: filtered,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single application by ID
// @route   GET /api/applications/:id
// @access  Private
export const getApplicationById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const application = await Application.findById(id)
            .populate({
                path: "job",
                populate: {
                    path: "companyProfile"
                }
            })
            .populate("userProfile")
            .populate("user", "name email phone");

        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        // Check authorization (applicant, provider or admin)
        const isApplicant = application.user && application.user._id.toString() === req.user._id.toString();
        const isProvider = application.provider && application.provider.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";

        if (!isApplicant && !isProvider && !isAdmin) {
            return res.status(403).json({ success: false, message: "Not authorized to view this application" });
        }

        res.status(200).json({
            success: true,
            data: application,
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
            .populate("userProfile")
            .populate("user")
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

        const validStatuses = ["pending", "reviewed", "shortlisted", "rejected", "interview", "hired"];
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


export const getProviderApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({ provider: req.user._id })
            .populate("job", "title location companyProfile")
            .populate({
                path: "job",
                populate: {
                    path: "companyProfile",
                    select: "companyName logo"
                }
            })
            .populate("userProfile")
            .populate("user")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications,
        });
    } catch (error) {
        next(error);
    }

}
