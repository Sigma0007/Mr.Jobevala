import os from "os";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import SystemIssue from "../models/SystemIssue.js";
import { getIO } from "./socket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EMERGENCY_LOG_DIR = path.join(__dirname, "../logs");

// Ensure emergency log directory exists
try {
    if (!fs.existsSync(EMERGENCY_LOG_DIR)) {
        fs.mkdirSync(EMERGENCY_LOG_DIR, { recursive: true });
    }
} catch (e) {
    console.error("Failed to create log directory:", e.message);
}

/**
 * Capture real-time system CPU, RAM, and process metrics
 */
export const captureSystemMetrics = () => {
    try {
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const memoryUsagePercent = Math.round((usedMem / totalMem) * 100);

        // CPU calculation (loadavg for unix or cpu times for windows)
        const cpus = os.cpus();
        let totalIdle = 0;
        let totalTick = 0;
        cpus.forEach((cpu) => {
            for (const type in cpu.times) {
                totalTick += cpu.times[type];
            }
            totalIdle += cpu.times.idle;
        });
        const idlePercent = totalTick > 0 ? (totalIdle / totalTick) : 0;
        const cpuUsagePercent = Math.min(100, Math.max(0, Math.round((1 - idlePercent) * 100)));

        return {
            cpuUsagePercent,
            memoryUsedMB: Math.round(usedMem / (1024 * 1024)),
            memoryTotalMB: Math.round(totalMem / (1024 * 1024)),
            freeMemMB: Math.round(freeMem / (1024 * 1024)),
            memoryUsagePercent,
            processUptime: Math.round(process.uptime()),
            nodeVersion: process.version,
            platform: `${os.platform()} (${os.arch()})`,
        };
    } catch (err) {
        return {
            cpuUsagePercent: 0,
            memoryUsedMB: 0,
            memoryTotalMB: 0,
            memoryUsagePercent: 0,
            freeMemMB: 0,
            processUptime: Math.round(process.uptime()),
            nodeVersion: process.version,
            platform: os.platform(),
        };
    }
};

/**
 * Capture real-time MongoDB status, ping latency, and database storage metrics
 */
export const captureDatabaseMetrics = async () => {
    const stateMap = {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting",
    };

    const readyState = mongoose.connection.readyState;
    const dbState = stateMap[readyState] || "unknown";

    const defaultMetrics = {
        dbState,
        dbHost: mongoose.connection.host || "Unknown Host",
        dbName: mongoose.connection.name || "Unknown DB",
        dataSizeMB: 0,
        storageSizeMB: 0,
        collectionsCount: 0,
        pingMs: 0,
    };

    if (readyState !== 1 || !mongoose.connection.db) {
        return defaultMetrics;
    }

    try {
        const pingStart = Date.now();
        await mongoose.connection.db.admin().ping();
        const pingMs = Date.now() - pingStart;

        let stats = {};
        try {
            stats = await mongoose.connection.db.stats();
        } catch (sErr) {
            // Some cloud providers restrict db.stats()
        }

        const collections = await mongoose.connection.db.listCollections().toArray();

        return {
            dbState: "connected",
            dbHost: mongoose.connection.host || "Connected",
            dbName: mongoose.connection.name || "Default",
            dataSizeMB: stats.dataSize ? Math.round(stats.dataSize / (1024 * 1024) * 100) / 100 : 0,
            storageSizeMB: stats.storageSize ? Math.round(stats.storageSize / (1024 * 1024) * 100) / 100 : 0,
            collectionsCount: collections.length,
            pingMs,
        };
    } catch (err) {
        return {
            ...defaultMetrics,
            dbState: "error",
            error: err.message,
        };
    }
};

/**
 * Log a system issue to MongoDB, or emergency file if DB is down.
 * Also emits a real-time WebSocket alert to admins.
 */
export const logSystemIssue = async ({
    title,
    type = "code_error",
    severity = "medium",
    message,
    stackTrace = "",
    source = "Server",
    endpoint = "",
    method = "",
    statusCode = 500,
    clientIp = "",
    userAgent = "",
    user = null,
}) => {
    try {
        const systemMetrics = captureSystemMetrics();
        let databaseMetrics = { dbState: "unknown" };

        try {
            databaseMetrics = await captureDatabaseMetrics();
        } catch (_) {}

        // Fallback title / message sanitation
        const safeTitle = (title || message || "System Error").substring(0, 200);
        const safeMessage = (message || "An unexpected error occurred").substring(0, 2000);
        const safeStack = typeof stackTrace === "string" ? stackTrace.substring(0, 8000) : "";

        // Check if DB is connected
        if (mongoose.connection.readyState === 1) {
            // Deduplication: Find recent open or investigating issue with same title & endpoint in last 30 mins
            const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
            const existingIssue = await SystemIssue.findOne({
                title: safeTitle,
                endpoint: endpoint || "",
                status: { $in: ["open", "investigating"] },
                lastOccurredAt: { $gte: thirtyMinsAgo },
            });

            let savedIssue = null;

            if (existingIssue) {
                existingIssue.occurrenceCount += 1;
                existingIssue.lastOccurredAt = new Date();
                existingIssue.message = safeMessage;
                if (safeStack) existingIssue.stackTrace = safeStack;
                existingIssue.systemMetrics = systemMetrics;
                existingIssue.databaseMetrics = databaseMetrics;
                if (severity === "critical") existingIssue.severity = "critical";
                await existingIssue.save();
                savedIssue = existingIssue;
            } else {
                savedIssue = await SystemIssue.create({
                    title: safeTitle,
                    type,
                    severity,
                    message: safeMessage,
                    stackTrace: safeStack,
                    source,
                    endpoint,
                    method,
                    statusCode,
                    clientIp,
                    userAgent,
                    user,
                    systemMetrics,
                    databaseMetrics,
                    status: "open",
                    occurrenceCount: 1,
                    firstOccurredAt: new Date(),
                    lastOccurredAt: new Date(),
                });
            }

            // Emit real-time alert via Socket.io
            try {
                const io = getIO();
                if (io) {
                    io.emit("system_issue_alert", {
                        issue: savedIssue,
                        isRepeat: !!existingIssue,
                    });
                }
            } catch (sockErr) {
                // Ignore socket errors
            }

            return savedIssue;
        } else {
            // Fallback emergency logging if MongoDB is down
            writeEmergencyFileLog({
                title: safeTitle,
                type,
                severity,
                message: safeMessage,
                stackTrace: safeStack,
                endpoint,
                systemMetrics,
                databaseMetrics,
                timestamp: new Date().toISOString(),
            });
            return null;
        }
    } catch (err) {
        console.error("Critical: Failed to log system issue:", err.message);
        writeEmergencyFileLog({
            title: title || "Logger Failure",
            error: err.message,
            originalMessage: message,
            timestamp: new Date().toISOString(),
        });
        return null;
    }
};

/**
 * Emergency local disk log when MongoDB is unavailable or full
 */
const writeEmergencyFileLog = (data) => {
    try {
        const filePath = path.join(EMERGENCY_LOG_DIR, "emergency-system-issues.log");
        const logLine = `[${new Date().toISOString()}] ${JSON.stringify(data)}\n`;
        fs.appendFileSync(filePath, logLine, "utf8");
    } catch (fsErr) {
        console.error("Emergency file logging failed:", fsErr.message);
    }
};

/**
 * Real-time overall system health assessment
 */
export const getLiveHealthOverview = async () => {
    const system = captureSystemMetrics();
    const database = await captureDatabaseMetrics();

    // Determine server status
    let status = "healthy"; // 'healthy' | 'warning' | 'critical'
    const warnings = [];

    if (database.dbState !== "connected") {
        status = "critical";
        warnings.push(`MongoDB is ${database.dbState}`);
    } else if (database.pingMs > 800) {
        status = "warning";
        warnings.push(`High database latency (${database.pingMs}ms)`);
    }

    if (system.memoryUsagePercent >= 90) {
        status = "critical";
        warnings.push(`Server RAM critically high: ${system.memoryUsagePercent}%`);
    } else if (system.memoryUsagePercent >= 80) {
        if (status !== "critical") status = "warning";
        warnings.push(`Server RAM elevated: ${system.memoryUsagePercent}%`);
    }

    if (system.cpuUsagePercent >= 90) {
        status = "critical";
        warnings.push(`CPU load critically high: ${system.cpuUsagePercent}%`);
    } else if (system.cpuUsagePercent >= 80) {
        if (status !== "critical") status = "warning";
        warnings.push(`CPU load elevated: ${system.cpuUsagePercent}%`);
    }

    return {
        status,
        warnings,
        timestamp: new Date(),
        system,
        database,
    };
};

/**
 * Background auto-monitor checking for server loads and database status
 */
export const runSystemHealthCheck = async () => {
    try {
        const health = await getLiveHealthOverview();

        if (health.status === "critical") {
            const isDbCritical = health.database.dbState !== "connected";
            await logSystemIssue({
                title: isDbCritical ? "Critical: MongoDB Database Connection Lost" : "Critical: Server Resource Depletion (High Load)",
                type: isDbCritical ? "database_issue" : "server_load",
                severity: "critical",
                message: health.warnings.join(", ") || "Critical system resource limit reached",
                source: isDbCritical ? "MongoDB Driver" : "Server Monitor",
            });
        } else if (health.status === "warning") {
            await logSystemIssue({
                title: "Warning: Elevated Server Load / Latency",
                type: health.database.pingMs > 800 ? "database_issue" : "server_load",
                severity: "medium",
                message: health.warnings.join(", ") || "Elevated resource consumption detected",
                source: "System Health Monitor",
            });
        }

        return health;
    } catch (err) {
        console.error("Health check error:", err.message);
    }
};
