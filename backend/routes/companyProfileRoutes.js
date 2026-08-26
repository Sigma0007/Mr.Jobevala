import express from "express";
import { getCompanyProfile, updateCompanyProfile } from "../controllers/companyProfileController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Apply protect middleware to all routes in this router
router.use(protect);

router.get(
    "/",
    authorize("provider", "admin"),
    getCompanyProfile
);

router.put(
    "/",
    authorize("provider"),
    updateCompanyProfile
);


export default router;
