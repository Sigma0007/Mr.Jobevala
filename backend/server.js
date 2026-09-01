import dotenv from "dotenv";

import app from "./app.js";
import connectDB from "./config/db.js";
import mongoose from "mongoose";

dotenv.config();

// connectDB();


const PORT =
    process.env.PORT || 5000;


// app.listen(PORT, () => {
//     console.log(
//         `Server running on port ${PORT}`
//     );
// });

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        app.listen(PORT, () => console.log(`Server running on port ${port}`));
        // Cron jobs are handled by Vercel Cron (see vercel.json + api/cron/khatu-shyam.js)
    } catch (error) {
        console.error("Database connection error: ", error);
    }
};

start();