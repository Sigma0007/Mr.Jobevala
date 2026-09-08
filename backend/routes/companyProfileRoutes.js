import express from "express";
import {
    getCompanyProfile,
    updateCompanyProfile,
    getProviderOverview,
    uploadCompanyLogo,
    deleteCompanyLogo,
} from "../controllers/companyProfileController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { uploadImage, uploadProfileFiles } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Apply protect middleware to all routes in this router
router.use(protect);

router.get(
    "/overview",
    authorize("provider"),
    getProviderOverview
);

router.get(
    "/",
    authorize("provider", "admin"),
    getCompanyProfile
);

// Upload company logo directly to Cloudflare R2
router.post(
    "/upload-logo",
    authorize("provider"),
    uploadImage.single("logo"),
    uploadCompanyLogo
);

// Delete company logo from Cloudflare R2
router.delete(
    "/logo",
    authorize("provider"),
    deleteCompanyLogo
);

// Update company profile (supports JSON and multipart/form-data)
router.put(
    "/",
    authorize("provider"),
    uploadProfileFiles.fields([{ name: "logo", maxCount: 1 }, { name: "image", maxCount: 1 }]),
    updateCompanyProfile
);

export default router;
