import JobReport from "../models/JobReport.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import AppError from "../utils/AppError.js";

// @desc    Submit a report/complaint for a job post
// @route   POST /api/reports/job
// @access  Private (User/Provider)
export const createJobReport = async (req, res, next) => {
    try {
        const {
            jobId,
            reason,
            subject,
            description,
            contactEmail,
            contactPhone,
            evidence,
        } = req.body;

        if (!jobId) {
            return next(new AppError("Job ID is required to file a report", 400));
        }

        if (!reason) {
            return next(new AppError("Report reason is required", 400));
        }

        if (!description || description.trim().length < 5) {
            return next(new AppError("Please provide a detailed description (at least 5 characters)", 400));
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return next(new AppError("Reported job does not exist or has already been removed", 404));
        }

        // Prevent reporting own job
        if (job.provider && job.provider.toString() === req.user._id.toString()) {
            return next(new AppError("You cannot report your own job post", 400));
        }

        // Check if user already submitted a pending or investigating report for this job
        const existingReport = await JobReport.findOne({
            job: jobId,
            reporter: req.user._id,
            status: { $in: ["pending", "investigating"] },
        });

        if (existingReport) {
            return next(
                new AppError(
                    "You have already submitted a report for this job. It is currently under review by our admin team.",
                    400
                )
            );
        }

        const newReport = await JobReport.create({
            job: jobId,
            reporter: req.user._id,
            reason,
            subject: subject || `Report for job: ${job.title}`,
            description,
            contactEmail: contactEmail || req.user.email || "",
            contactPhone: contactPhone || "",
            evidence: evidence || "",
            status: "pending",
        });

        res.status(201).json({
            success: true,
            message: "Report submitted successfully! Our moderation team will investigate this job post.",
            data: newReport,
        });
    } catch (error) {
        next(new AppError(error.message || "Error submitting job report", 500));
    }
};

// @desc    Check if current user has already reported a job
// @route   GET /api/reports/check/:jobId
// @access  Private
export const checkJobReported = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const report = await JobReport.findOne({
            job: jobId,
            reporter: req.user._id,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            hasReported: !!report,
            report: report || null,
        });
    } catch (error) {
        next(new AppError("Error checking report status", 500));
    }
};

// @desc    Get reports submitted by logged-in user
// @route   GET /api/reports/my-reports
// @access  Private
export const getMyReports = async (req, res, next) => {
    try {
        const reports = await JobReport.find({ reporter: req.user._id })
            .populate({
                path: "job",
                select: "title category location salary status createdAt companyProfile",
                populate: {
                    path: "companyProfile",
                    select: "companyName logo",
                },
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reports.length,
            reports,
        });
    } catch (error) {
        next(new AppError("Error fetching user reports", 500));
    }
};

// @desc    Get all reports with filtering & statistics (Admin)
// @route   GET /api/reports/admin
// @access  Private (Admin)
export const getAllReportsAdmin = async (req, res, next) => {
    try {
        const { status, reason, search } = req.query;

        let query = {};

        if (status && status !== "all") {
            query.status = status;
        }

        if (reason && reason !== "all") {
            query.reason = reason;
        }

        // Fetch reports with deep population
        let reports = await JobReport.find(query)
            .populate({
                path: "job",
                populate: [
                    {
                        path: "companyProfile",
                        select: "companyName logo website industry companySize aboutCompany email phone location",
                    },
                    {
                        path: "provider",
                        select: "name email phone role createdAt",
                    },
                ],
            })
            .populate({
                path: "reporter",
                select: "name email role phone createdAt",
            })
            .populate({
                path: "reviewedBy",
                select: "name email",
            })
            .sort({ createdAt: -1 });

        // Filter by search query if provided (Job Title, Company Name, Reporter Name/Email, Description)
        if (search && search.trim()) {
            const searchLower = search.toLowerCase().trim();
            reports = reports.filter((rep) => {
                const jobTitle = rep.job?.title?.toLowerCase() || "";
                const companyName = rep.job?.companyProfile?.companyName?.toLowerCase() || "";
                const providerName = rep.job?.provider?.name?.toLowerCase() || "";
                const providerEmail = rep.job?.provider?.email?.toLowerCase() || "";
                const reporterName = rep.reporter?.name?.toLowerCase() || "";
                const reporterEmail = rep.reporter?.email?.toLowerCase() || "";
                const reasonText = rep.reason?.toLowerCase() || "";
                const descText = rep.description?.toLowerCase() || "";

                return (
                    jobTitle.includes(searchLower) ||
                    companyName.includes(searchLower) ||
                    providerName.includes(searchLower) ||
                    providerEmail.includes(searchLower) ||
                    reporterName.includes(searchLower) ||
                    reporterEmail.includes(searchLower) ||
                    reasonText.includes(searchLower) ||
                    descText.includes(searchLower)
                );
            });
        }

        // Calculate summary statistics
        const totalReports = await JobReport.countDocuments();
        const pendingReports = await JobReport.countDocuments({ status: "pending" });
        const investigatingReports = await JobReport.countDocuments({ status: "investigating" });
        const resolvedReports = await JobReport.countDocuments({ status: "resolved" });
        const dismissedReports = await JobReport.countDocuments({ status: "dismissed" });

        res.status(200).json({
            success: true,
            count: reports.length,
            stats: {
                totalReports,
                pendingReports,
                investigatingReports,
                resolvedReports,
                dismissedReports,
            },
            reports,
        });
    } catch (error) {
        next(new AppError(error.message || "Error fetching admin reports", 500));
    }
};

// @desc    Get single report by ID (Admin)
// @route   GET /api/reports/admin/:id
// @access  Private (Admin)
export const getReportByIdAdmin = async (req, res, next) => {
    try {
        const report = await JobReport.findById(req.params.id)
            .populate({
                path: "job",
                populate: [
                    {
                        path: "companyProfile",
                    },
                    {
                        path: "provider",
                        select: "name email phone role createdAt",
                    },
                ],
            })
            .populate({
                path: "reporter",
                select: "name email role phone createdAt",
            })
            .populate({
                path: "reviewedBy",
                select: "name email",
            });

        if (!report) {
            return next(new AppError("Report not found", 404));
        }

        res.status(200).json({
            success: true,
            report,
        });
    } catch (error) {
        next(new AppError("Error fetching report details", 500));
    }
};

// @desc    Update report status and admin notes (Admin)
// @route   PUT /api/reports/admin/:id
// @access  Private (Admin)
export const updateReportStatusAdmin = async (req, res, next) => {
    try {
        const { status, adminNotes, actionTaken, closeOrDeleteJob } = req.body;

        const report = await JobReport.findById(req.params.id);
        if (!report) {
            return next(new AppError("Report not found", 404));
        }

        if (status) report.status = status;
        if (adminNotes !== undefined) report.adminNotes = adminNotes;
        if (actionTaken) report.actionTaken = actionTaken;

        report.reviewedBy = req.user._id;
        report.reviewedAt = new Date();

        // If admin chose action to remove job or close job
        if (actionTaken === "job_removed" || closeOrDeleteJob) {
            if (report.job) {
                const job = await Job.findById(report.job);
                if (job) {
                    if (closeOrDeleteJob === "delete") {
                        await Job.findByIdAndDelete(report.job);
                        await Application.deleteMany({ job: report.job });
                    } else {
                        job.status = "closed";
                        await job.save();
                    }
                }
            }
        }

        await report.save();

        const updatedReport = await JobReport.findById(report._id)
            .populate({
                path: "job",
                populate: [
                    {
                        path: "companyProfile",
                        select: "companyName logo website industry",
                    },
                    {
                        path: "provider",
                        select: "name email phone role",
                    },
                ],
            })
            .populate({
                path: "reporter",
                select: "name email role",
            })
            .populate({
                path: "reviewedBy",
                select: "name email",
            });

        res.status(200).json({
            success: true,
            message: "Report updated successfully",
            report: updatedReport,
        });
    } catch (error) {
        next(new AppError(error.message || "Error updating report", 500));
    }
};

// @desc    Delete a report record (Admin)
// @route   DELETE /api/reports/admin/:id
// @access  Private (Admin)
export const deleteReportAdmin = async (req, res, next) => {
    try {
        const report = await JobReport.findById(req.params.id);
        if (!report) {
            return next(new AppError("Report not found", 404));
        }

        await JobReport.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Report entry deleted successfully",
        });
    } catch (error) {
        next(new AppError("Error deleting report", 500));
    }
};

// @desc    Directly delete reported job and resolve the report (Admin)
// @route   DELETE /api/reports/admin/:id/delete-job
// @access  Private (Admin)
export const deleteReportedJobAdmin = async (req, res, next) => {
    try {
        const report = await JobReport.findById(req.params.id);
        if (!report) {
            return next(new AppError("Report not found", 404));
        }

        if (report.job) {
            await Job.findByIdAndDelete(report.job);
            await Application.deleteMany({ job: report.job });
        }

        report.status = "resolved";
        report.actionTaken = "job_removed";
        report.adminNotes = report.adminNotes
            ? `${report.adminNotes} | Job removed by Admin on ${new Date().toLocaleDateString()}`
            : `Job removed by Admin on ${new Date().toLocaleDateString()}`;
        report.reviewedBy = req.user._id;
        report.reviewedAt = new Date();
        await report.save();

        res.status(200).json({
            success: true,
            message: "Reported job deleted and report marked as resolved",
            report,
        });
    } catch (error) {
        next(new AppError("Error deleting reported job", 500));
    }
};
