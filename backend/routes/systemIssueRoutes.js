import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
    getSystemIssues,
    getSystemIssueStats,
    getLiveHealth,
    getSystemIssueById,
    updateSystemIssueStatus,
    deleteSystemIssue,
    clearResolvedIssues,
    simulateTestIssue,
} from "../controllers/systemIssueController.js";

const router = express.Router();

// Require authenticated admin for all endpoints
router.use(protect);
router.use(authorize("admin"));

router.get("/", getSystemIssues);
router.get("/stats", getSystemIssueStats);
router.get("/health", getLiveHealth);
router.post("/clear-resolved", clearResolvedIssues);
router.post("/simulate", simulateTestIssue);

router.get("/:id", getSystemIssueById);
router.patch("/:id/status", updateSystemIssueStatus);
router.delete("/:id", deleteSystemIssue);

export default router;
