import express from "express";
import {
    getAllPlans,
    getPlanById,
    createPlan,
    updatePlan,
    deletePlan,
    seedPlans,
} from "../controllers/pricingPlanController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllPlans);
router.get("/:id", getPlanById);

// Admin-protected routes
router.post("/seed", protect, authorize("admin"), seedPlans);
router.post("/", protect, authorize("admin"), createPlan);
router.put("/:id", protect, authorize("admin"), updatePlan);
router.delete("/:id", protect, authorize("admin"), deletePlan);

export default router;
