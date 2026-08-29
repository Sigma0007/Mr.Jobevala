import express from "express";

import {
    createJob,
    getMyJobs,
    getMyJobById,
    updateJob,
    deleteJob,
    updateJobStatus,
    getAllJobs,
    saveJob,
    getSavedJobs,
    removeSavedJob,
} from "../controllers/jobController.js";

import {
    protect,
} from "../middleware/authMiddleware.js";

import {
    authorize,
} from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
    "/getAllJobs",
    getAllJobs
);

router.get(
    "/saved",
    protect,
    authorize("user"),
    getSavedJobs
);

router.post(
    "/:id/save",
    protect,
    authorize("user"),
    saveJob
);

router.delete(
    "/saved/:id",
    protect,
    authorize("user"),
    removeSavedJob
);

router.post(
    "/",
    protect,
    authorize("provider"),
    createJob
);

router.get(
    "/my-jobs",
    protect,
    authorize("provider"),
    getMyJobs
);

router.get(
    "/my-jobs/:id",
    protect,
    authorize("provider"),
    getMyJobById
);

router.put(
    "/:id",
    protect,
    authorize("provider"),
    updateJob
);

router.delete(
    "/:id",
    protect,
    authorize("provider"),
    deleteJob
);

router.patch(
    "/:id/status",
    protect,
    authorize("provider"),
    updateJobStatus
);


export default router;