import http from "http";
import dotenv from "dotenv";

import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./utils/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB();

        const server = http.createServer(app);
        initSocket(server);

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT} with WebSockets enabled`);
        });
        // Cron jobs are handled by Vercel Cron (see vercel.json + api/cron/khatu-shyam.js)
    } catch (error) {
        console.error("Database connection error: ", error);
    }
};

start();