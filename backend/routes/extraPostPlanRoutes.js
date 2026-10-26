import express from "express";
import {
    getAllExtraPostPlans,
    getExtraPostPlanById,
    createExtraPostPlan,
    updateExtraPostPlan,
    deleteExtraPostPlan,
    seedExtraPostPlans,
} from "../controllers/extraPostPlanController.js";
import { protect, optionalAuth } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public / Authenticated read routes
router.get("/", optionalAuth, getAllExtraPostPlans);
router.get("/:id", optionalAuth, getExtraPostPlanById);

// Admin-only management routes
router.post("/seed", protect, authorize("admin"), seedExtraPostPlans);
router.post("/", protect, authorize("admin"), createExtraPostPlan);
router.put("/:id", protect, authorize("admin"), updateExtraPostPlan);
router.delete("/:id", protect, authorize("admin"), deleteExtraPostPlan);

export default router;
