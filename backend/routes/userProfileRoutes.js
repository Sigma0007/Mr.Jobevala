import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/userProfileController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Apply protect middleware to all routes in this router
router.use(protect);

router.get(
    "/",
    authorize("user", "admin"),
    getUserProfile
);

router.put(
    "/",
    authorize("user"),
    updateUserProfile
);


export default router;
