import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";

import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();


app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());


app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Job Portal API is running",
    });
});


app.use("/api/auth", authRoutes);

app.use("/api/jobs", jobRoutes);

app.use(errorHandler);


export default app;