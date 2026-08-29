import express from "express";

import {
    createApplication,
    getUserApplications,
    getJobApplications,
    updateApplicationStatus,
    getProviderApplications,
} from "../controllers/applicationController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// User routes
router.post(
    "/",
    protect,
    authorize("user"),
    createApplication
);

router.get(
    "/my-applications",
    protect,
    authorize("user"),
    getUserApplications
);

// Provider routes
router.get(
    "/job/:jobId",
    protect,
    authorize("provider"),
    getJobApplications
);

router.patch(
    "/:id/status",
    protect,
    authorize("provider"),
    updateApplicationStatus
);

router.get(
    "/provider-applications",
    protect,
    authorize("provider"),
    getProviderApplications)

export default router;
