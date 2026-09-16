import express from "express";
import {
    getCurrentSubscription,
    getMySubscriptionHistory,
    getAllSubscriptionsAdmin,
    getSubscriptionById,
    cancelSubscription,
    validateSubscriptionAction,
    unlockCandidateContact,
} from "../controllers/subscriptionController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Protect all routes
router.use(protect);

router.get("/current", getCurrentSubscription);
router.get("/my-history", getMySubscriptionHistory);
router.get("/all", authorize("admin"), getAllSubscriptionsAdmin);
router.post("/validate-action", validateSubscriptionAction);
router.post("/unlock-candidate", unlockCandidateContact);
router.get("/:id", getSubscriptionById);
router.post("/cancel/:id", cancelSubscription);

export default router;
