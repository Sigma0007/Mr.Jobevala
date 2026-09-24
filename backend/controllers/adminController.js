import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import CompanyProfile from "../models/CompanyProfile.js";
import JobReport from "../models/JobReport.js";
import AppError from "../utils/AppError.js";

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getPlatformStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalJobs = await Job.countDocuments();
        const totalApplications = await Application.countDocuments();
        const totalCompanies = await CompanyProfile.countDocuments();
        const totalReports = await JobReport.countDocuments();
        const pendingReports = await JobReport.countDocuments({ status: "pending" });

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalJobs,
                totalApplications,
                totalCompanies,
                totalReports,
                pendingReports,
            },
        });
    } catch (error) {
        next(new AppError("Error fetching stats", 500));
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            users,
        });
    } catch (error) {
        next(new AppError("Error fetching users", 500));
    }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(new AppError("User not found", 404));
        }

        if (user._id.toString() === req.user._id.toString()) {
            return next(new AppError("You cannot delete yourself", 400));
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        next(new AppError("Error deleting user", 500));
    }
};

// @desc    Get all jobs
// @route   GET /api/admin/jobs
// @access  Private (Admin)
export const getAllJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find()
            .populate({
                path: 'companyProfile',
                select: 'companyName logo'
            })
            .populate({
                path: 'provider',
                select: 'name email'
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs,
        });
    } catch (error) {
        next(new AppError("Error fetching jobs", 500));
    }
};

// @desc    Delete a job
// @route   DELETE /api/admin/jobs/:id
// @access  Private (Admin)
export const deleteJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return next(new AppError("Job not found", 404));
        }

        const deletionReason =
            req.body?.reason ||
            req.query?.reason ||
            "Job post removed by administrator due to platform compliance or content guidelines.";

        // Send notification to the provider
        if (job.provider) {
            await createAndSendNotification({
                recipient: job.provider,
                sender: req.user._id,
                title: "Job Post Removed by Admin",
                message: `Your job posting "${job.title}" has been deleted by platform administrators. Reason: ${deletionReason}`,
                type: "job",
                link: "/provider/dashboard",
                data: {
                    jobId: job._id,
                    jobTitle: job.title,
                    reason: deletionReason,
                    deletedAt: new Date(),
                },
            });
        }

        await Job.findByIdAndDelete(req.params.id);
        
        await Application.deleteMany({ job: req.params.id });

        // Also update any pending reports for this job as resolved
        await JobReport.updateMany(
            { job: req.params.id, status: { $in: ["pending", "investigating"] } },
            {
                status: "resolved",
                actionTaken: "job_removed",
                adminNotes: `Job deleted by Admin: ${deletionReason}`,
                reviewedBy: req.user._id,
                reviewedAt: new Date(),
            }
        );

        res.status(200).json({
            success: true,
            message: "Job deleted successfully and employer has been notified with the reason",
        });
    } catch (error) {
        next(new AppError("Error deleting job", 500));
    }
};
