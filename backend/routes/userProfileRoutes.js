import express from "express";
import { getAllUserProfile, getUserProfile, updateUserProfile } from "../controllers/userProfileController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
    "/get/all",
    getAllUserProfile
);

router.get(
    "/",
    protect,
    authorize("user", "admin"),
    getUserProfile
);

router.put(
    "/",
    protect,
    authorize("user"),
    updateUserProfile
);


export default router;
