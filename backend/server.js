import dotenv from "dotenv";

import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => console.log(`Server running on port ${port}`));
        // Cron jobs are handled by Vercel Cron (see vercel.json + api/cron/khatu-shyam.js)
    } catch (error) {
        console.error("Database connection error: ", error);
    }
};

start();