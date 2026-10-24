import SystemIssue from "../models/SystemIssue.js";
import AppError from "../utils/AppError.js";
import { getLiveHealthOverview, logSystemIssue } from "../utils/systemIssueLogger.js";

// @desc    Get paginated system issues with filters
// @route   GET /api/admin/system-issues
// @access  Private (Admin)
export const getSystemIssues = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 20,
            status = "all",
            severity = "all",
            type = "all",
            search = "",
            sortBy = "lastOccurredAt",
            sortOrder = "desc",
        } = req.query;

        const query = {};

        // Status filter
        if (status && status !== "all") {
            query.status = status;
        }

        // Severity filter
        if (severity && severity !== "all") {
            query.severity = severity;
        }

        // Type filter
        if (type && type !== "all") {
            query.type = type;
        }

        // Search in title, message, endpoint
        if (search && search.trim() !== "") {
            const searchRegex = new RegExp(search.trim(), "i");
            query.$or = [
                { title: searchRegex },
                { message: searchRegex },
                { endpoint: searchRegex },
                { source: searchRegex },
            ];
        }

        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 20;
        const skip = (pageNum - 1) * limitNum;

        const sortDirection = sortOrder === "asc" ? 1 : -1;
        const sortOptions = { [sortBy]: sortDirection };

        const [issues, totalCount] = await Promise.all([
            SystemIssue.find(query)
                .populate("user", "name email role")
                .populate("resolvedBy", "name email")
                .sort(sortOptions)
                .skip(skip)
                .limit(limitNum)
                .lean(),
            SystemIssue.countDocuments(query),
        ]);

        res.status(200).json({
            success: true,
            count: issues.length,
            totalCount,
            totalPages: Math.ceil(totalCount / limitNum),
            currentPage: pageNum,
            issues,
        });
    } catch (error) {
        next(new AppError(`Error fetching system issues: ${error.message}`, 500));
    }
};

// @desc    Get summary statistics for system issues
// @route   GET /api/admin/system-issues/stats
// @access  Private (Admin)
export const getSystemIssueStats = async (req, res, next) => {
    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const [
            totalCount,
            openCount,
            investigatingCount,
            criticalCount,
            highCount,
            resolvedCount,
            todayCount,
        ] = await Promise.all([
            SystemIssue.countDocuments(),
            SystemIssue.countDocuments({ status: "open" }),
            SystemIssue.countDocuments({ status: "investigating" }),
            SystemIssue.countDocuments({ severity: "critical", status: { $in: ["open", "investigating"] } }),
            SystemIssue.countDocuments({ severity: "high", status: { $in: ["open", "investigating"] } }),
            SystemIssue.countDocuments({ status: "resolved" }),
            SystemIssue.countDocuments({ lastOccurredAt: { $gte: todayStart } }),
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalCount,
                openCount,
                investigatingCount,
                criticalCount,
                highCount,
                resolvedCount,
                todayCount,
            },
        });
    } catch (error) {
        next(new AppError("Error fetching issue statistics", 500));
    }
};

// @desc    Get real-time live server & database health snapshot
// @route   GET /api/admin/system-issues/health
// @access  Private (Admin)
export const getLiveHealth = async (req, res, next) => {
    try {
        const health = await getLiveHealthOverview();
        res.status(200).json({
            success: true,
            health,
        });
    } catch (error) {
        next(new AppError("Error getting live system health", 500));
    }
};

// @desc    Get single issue details by ID
// @route   GET /api/admin/system-issues/:id
// @access  Private (Admin)
export const getSystemIssueById = async (req, res, next) => {
    try {
        const issue = await SystemIssue.findById(req.params.id)
            .populate("user", "name email role avatar")
            .populate("resolvedBy", "name email")
            .populate("history.user", "name email");

        if (!issue) {
            return next(new AppError("System issue record not found", 404));
        }

        res.status(200).json({
            success: true,
            issue,
        });
    } catch (error) {
        next(new AppError("Error fetching issue details", 500));
    }
};

// @desc    Update system issue status and resolution notes
// @route   PATCH /api/admin/system-issues/:id
// @access  Private (Admin)
export const updateSystemIssueStatus = async (req, res, next) => {
    try {
        const { status, resolutionNotes } = req.body;

        const issue = await SystemIssue.findById(req.params.id);
        if (!issue) {
            return next(new AppError("System issue record not found", 404));
        }

        if (status) {
            issue.status = status;
        }

        if (typeof resolutionNotes === "string") {
            issue.resolutionNotes = resolutionNotes;
        }

        if (status === "resolved") {
            issue.resolvedAt = new Date();
            issue.resolvedBy = req.user._id;
        } else if (status === "open" || status === "investigating") {
            issue.resolvedAt = null;
            issue.resolvedBy = null;
        }

        // Add history entry
        issue.history.push({
            action: `Status changed to ${status || issue.status}`,
            note: resolutionNotes || "",
            user: req.user._id,
            timestamp: new Date(),
        });

        await issue.save();

        res.status(200).json({
            success: true,
            message: `Issue marked as ${issue.status}`,
            issue,
        });
    } catch (error) {
        next(new AppError(`Error updating issue: ${error.message}`, 500));
    }
};

// @desc    Delete single system issue record
// @route   DELETE /api/admin/system-issues/:id
// @access  Private (Admin)
export const deleteSystemIssue = async (req, res, next) => {
    try {
        const issue = await SystemIssue.findByIdAndDelete(req.params.id);
        if (!issue) {
            return next(new AppError("System issue record not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "System issue log deleted successfully",
        });
    } catch (error) {
        next(new AppError("Error deleting system issue", 500));
    }
};

// @desc    Bulk delete all resolved / ignored issues
// @route   POST /api/admin/system-issues/clear-resolved
// @access  Private (Admin)
export const clearResolvedIssues = async (req, res, next) => {
    try {
        const result = await SystemIssue.deleteMany({
            status: { $in: ["resolved", "ignored"] },
        });

        res.status(200).json({
            success: true,
            message: `Cleared ${result.deletedCount} resolved/ignored issue logs`,
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        next(new AppError("Error clearing resolved issues", 500));
    }
};

// @desc    Simulate a test issue to test the logging and alert flow
// @route   POST /api/admin/system-issues/simulate
// @access  Private (Admin)
export const simulateTestIssue = async (req, res, next) => {
    try {
        const {
            type = "code_error",
            severity = "high",
            title = "Test System Alert: Simulation Triggered",
            message = "This is a simulated system issue generated by the admin to test error logging, diagnostics, and resolution tracking.",
        } = req.body;

        const fakeStack = new Error("Simulated Error for Admin Testing").stack;

        const created = await logSystemIssue({
            title,
            type,
            severity,
            message,
            stackTrace: fakeStack,
            source: "Admin Console (Simulation)",
            endpoint: "/api/admin/system-issues/simulate",
            method: "POST",
            statusCode: 500,
            user: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: "Simulated issue successfully created and logged!",
            issue: created,
        });
    } catch (error) {
        next(new AppError(`Error simulating issue: ${error.message}`, 500));
    }
};
