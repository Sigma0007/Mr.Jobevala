import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import userProfileRoutes from "./routes/userProfileRoutes.js";
import companyProfileRoutes from "./routes/companyProfileRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();


app.use(
    cors({
        origin: "http://localhost:5173",
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

app.use(errorHandler);


export default app;