import express from "express";

import {
    createJob,
    getMyJobs,
    getMyJobById,
    updateJob,
    deleteJob,
    updateJobStatus,
} from "../controllers/jobController.js";

import {
    protect,
} from "../middleware/authMiddleware.js";

import {
    authorize,
} from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);

router.post(
    "/",
    authorize("provider"),
    createJob
);

router.get(
    "/my-jobs",
    authorize("provider"),
    getMyJobs
);

router.get(
    "/my-jobs/:id",
    authorize("provider"),
    getMyJobById
);

router.put(
    "/:id",
    authorize("provider"),
    updateJob
);

router.delete(
    "/:id",
    authorize("provider"),
    deleteJob
);

router.patch(
    "/:id/status",
    authorize("provider"),
    updateJobStatus
);


export default router;