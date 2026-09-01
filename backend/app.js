import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import userProfileRoutes from "./routes/userProfileRoutes.js";
import companyProfileRoutes from "./routes/companyProfileRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();


app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://job-portal-v5l9.vercel.app",
        ],
        credentials: true,
    })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Job Portal API is running",
    });
});


app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/userprofile", userProfileRoutes);
app.use("/api/companyprofile", companyProfileRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);

app.use(errorHandler);


export default app;