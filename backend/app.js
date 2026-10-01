import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import userProfileRoutes from "./routes/userProfileRoutes.js";
import companyProfileRoutes from "./routes/companyProfileRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import storageRoutes from "./routes/storageRoutes.js";
import msgRoutes from "./routes/msgRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import pricingPlanRoutes from "./routes/pricingPlanRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import marqueeCompanyRoutes from "./routes/marqueeCompanyRoutes.js";

import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();


app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://job-portal-f-az3p.onrender.com",
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
app.use("/api/locations", locationRoutes);
app.use("/api/storage", storageRoutes);
app.use("/api/msg", msgRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/plans", pricingPlanRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/marquee-companies", marqueeCompanyRoutes);

app.use(errorHandler);


export default app;