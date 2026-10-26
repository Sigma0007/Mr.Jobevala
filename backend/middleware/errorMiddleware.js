import { logSystemIssue } from "../utils/systemIssueLogger.js";

export const errorHandler = (
    err,
    req,
    res,
    next
) => {
    console.error("API Error caught:", err);

    const statusCode = err.statusCode || 500;

    // Log severe/unhandled errors to SystemIssue dashboard
    if (statusCode >= 500 || err.name === "TypeError" || err.name === "ReferenceError" || err.name === "MongoError" || err.name === "MongooseError") {
        const isCodeError = err.name === "TypeError" || err.name === "ReferenceError" || err.name === "SyntaxError";
        const isDbError = err.name?.includes("Mongo") || err.name?.includes("Mongoose");

        logSystemIssue({
            title: `${err.name || "Error"}: ${err.message || "Internal Server Error"}`,
            type: isDbError ? "database_issue" : isCodeError ? "code_error" : "api_error",
            severity: statusCode >= 500 ? "high" : "medium",
            message: err.message || "Internal Server Error",
            stackTrace: err.stack || "",
            source: req.originalUrl || "API Handler",
            endpoint: req.originalUrl || req.url || "",
            method: req.method || "GET",
            statusCode,
            clientIp: req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "",
            userAgent: req.headers["user-agent"] || "",
            user: req.user?._id || null,
        }).catch((logErr) => {
            console.error("Error logging system issue:", logErr.message);
        });
    }

    res.status(statusCode).json({
        success: false,
        message:
            err.message ||
            "Something went wrong.",
        ...(err.quotaExhausted && {
            quotaExhausted: true,
            actionType: err.actionType,
            limit: err.limit,
            used: err.used,
            extraPrice: err.extraPrice,
        }),
    });
};