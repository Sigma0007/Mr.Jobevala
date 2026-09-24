import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
    createJobReport,
    checkJobReported,
    getMyReports,
    getAllReportsAdmin,
    getReportByIdAdmin,
    updateReportStatusAdmin,
    deleteReportAdmin,
    deleteReportedJobAdmin,
} from "../controllers/reportController.js";

const router = express.Router();

// User routes (Logged-in users: User, Provider, Admin)
router.post("/job", protect, createJobReport);
router.get("/check/:jobId", protect, checkJobReported);
router.get("/my-reports", protect, getMyReports);

// Admin moderation routes
router.get("/admin", protect, authorize("admin"), getAllReportsAdmin);
router.get("/admin/:id", protect, authorize("admin"), getReportByIdAdmin);
router.put("/admin/:id", protect, authorize("admin"), updateReportStatusAdmin);
router.delete("/admin/:id", protect, authorize("admin"), deleteReportAdmin);
router.delete("/admin/:id/delete-job", protect, authorize("admin"), deleteReportedJobAdmin);

export default router;
