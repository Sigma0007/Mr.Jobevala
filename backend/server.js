import http from "http";
import dotenv from "dotenv";

import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./utils/socket.js";
import { logSystemIssue, runSystemHealthCheck } from "./utils/systemIssueLogger.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Catch catastrophic process crashes & unhandled exceptions
process.on("uncaughtException", async (err) => {
    console.error("CRITICAL: Uncaught Exception:", err);
    try {
        await logSystemIssue({
            title: `Server Crash (Uncaught Exception): ${err.name || "Error"}`,
            type: "server_crash",
            severity: "critical",
            message: err.message || "Uncaught process exception",
            stackTrace: err.stack || "",
            source: "Node.js Process (uncaughtException)",
        });
    } catch (_) {}
});

// Catch unhandled async promise rejections
process.on("unhandledRejection", async (reason) => {
    console.error("CRITICAL: Unhandled Promise Rejection:", reason);
    try {
        const message = reason instanceof Error ? reason.message : String(reason);
        const stack = reason instanceof Error ? reason.stack : "";
        await logSystemIssue({
            title: `Unhandled Promise Rejection: ${message.substring(0, 80)}`,
            type: "server_crash",
            severity: "critical",
            message: message || "Unhandled promise rejection in asynchronous code",
            stackTrace: stack || "",
            source: "Node.js Process (unhandledRejection)",
        });
    } catch (_) {}
});

const start = async () => {
    try {
        await connectDB();

        const server = http.createServer(app);
        initSocket(server);

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT} with WebSockets enabled`);
        });

        // Periodic system and DB health check every 5 minutes
        setInterval(() => {
            runSystemHealthCheck().catch(() => {});
        }, 5 * 60 * 1000);
    } catch (error) {
        console.error("Database connection error: ", error);
        logSystemIssue({
            title: "Database Connection Failure on Startup",
            type: "database_issue",
            severity: "critical",
            message: error.message || "Failed to establish initial MongoDB connection",
            stackTrace: error.stack || "",
            source: "server.js / connectDB",
        }).catch(() => {});
    }
};

start();