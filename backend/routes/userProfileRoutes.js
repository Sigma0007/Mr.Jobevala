import express from "express";
import {
    getAllUserProfile,
    getUserProfile,
    updateUserProfile,
    getUserOverview,
    uploadProfileImage,
    uploadResume,
    deleteResume,
} from "../controllers/userProfileController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
    uploadImage,
    uploadResumeFile,
    uploadProfileFiles,
} from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get(
    "/overview",
    protect,
    authorize("user"),
    getUserOverview
);

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

// Upload profile picture directly to Cloudflare R2
router.post(
    "/upload-image",
    protect,
    authorize("user"),
    uploadImage.single("image"),
    uploadProfileImage
);

// Upload resume document directly to Cloudflare R2
router.post(
    "/upload-resume",
    protect,
    authorize("user"),
    uploadResumeFile.single("resume"),
    uploadResume
);

// Delete resume document from Cloudflare R2
router.delete(
    "/resume",
    protect,
    authorize("user"),
    deleteResume
);

// Update user profile (supports both JSON body & multipart/form-data)
router.put(
    "/",
    protect,
    authorize("user"),
    uploadProfileFiles.fields([
        { name: "profileImage", maxCount: 1 },
        { name: "resume", maxCount: 1 },
    ]),
    updateUserProfile
);

export default router;

