import mongoose from "mongoose";

const systemIssueSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Issue title is required"],
            trim: true,
            index: true,
        },
        type: {
            type: String,
            enum: [
                "code_error",
                "server_crash",
                "server_load",
                "database_issue",
                "api_error",
                "security_issue",
                "other",
            ],
            default: "code_error",
            index: true,
        },
        severity: {
            type: String,
            enum: ["critical", "high", "medium", "low"],
            default: "medium",
            index: true,
        },
        message: {
            type: String,
            required: [true, "Issue message is required"],
            trim: true,
        },
        stackTrace: {
            type: String,
            default: "",
        },
        source: {
            type: String,
            default: "unknown",
            trim: true,
        },
        // API context if originated from HTTP request
        endpoint: {
            type: String,
            default: "",
            trim: true,
            index: true,
        },
        method: {
            type: String,
            default: "",
            trim: true,
        },
        statusCode: {
            type: Number,
            default: 500,
        },
        clientIp: {
            type: String,
            default: "",
        },
        userAgent: {
            type: String,
            default: "",
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        // Snapshot of server & DB state at time of issue
        systemMetrics: {
            cpuUsagePercent: { type: Number, default: 0 },
            memoryUsedMB: { type: Number, default: 0 },
            memoryTotalMB: { type: Number, default: 0 },
            memoryUsagePercent: { type: Number, default: 0 },
            freeMemMB: { type: Number, default: 0 },
            processUptime: { type: Number, default: 0 },
            nodeVersion: { type: String, default: "" },
            platform: { type: String, default: "" },
        },
        databaseMetrics: {
            dbState: { type: String, default: "unknown" },
            dbHost: { type: String, default: "" },
            dbName: { type: String, default: "" },
            dataSizeMB: { type: Number, default: 0 },
            storageSizeMB: { type: Number, default: 0 },
            collectionsCount: { type: Number, default: 0 },
            pingMs: { type: Number, default: 0 },
        },
        status: {
            type: String,
            enum: ["open", "investigating", "resolved", "ignored"],
            default: "open",
            index: true,
        },
        occurrenceCount: {
            type: Number,
            default: 1,
        },
        firstOccurredAt: {
            type: Date,
            default: Date.now,
        },
        lastOccurredAt: {
            type: Date,
            default: Date.now,
            index: true,
        },
        resolutionNotes: {
            type: String,
            default: "",
            trim: true,
        },
        resolvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        resolvedAt: {
            type: Date,
            default: null,
        },
        history: [
            {
                action: { type: String, required: true },
                note: { type: String, default: "" },
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
                timestamp: { type: Date, default: Date.now },
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

systemIssueSchema.index({ status: 1, severity: 1, lastOccurredAt: -1 });
systemIssueSchema.index({ type: 1, lastOccurredAt: -1 });

const SystemIssue = mongoose.model("SystemIssue", systemIssueSchema);

export default SystemIssue;
