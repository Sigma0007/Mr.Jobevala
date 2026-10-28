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
    (req, res, next) => {
        uploadImage.single("image")(req, res, (err) => {
            if (err) {
                // If multipart failed but a base64/JSON payload exists, proceed to controller
                if (req.body && (req.body.image || req.body.base64 || req.body.profileImage)) {
                    return next();
                }
                return next(err);
            }
            next();
        });
    },
    uploadProfileImage
);

// Upload resume document directly to Cloudflare R2
router.post(
    "/upload-resume",
    protect,
    authorize("user"),
    (req, res, next) => {
        uploadResumeFile.single("resume")(req, res, (err) => {
            if (err) {
                if (req.body && (req.body.resume || req.body.base64)) {
                    return next();
                }
                return next(err);
            }
            next();
        });
    },
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

