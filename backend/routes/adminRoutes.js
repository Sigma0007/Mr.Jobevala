import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
    getPlatformStats,
    getAllUsers,
    deleteUser,
    getAllJobs,
    deleteJob
} from "../controllers/adminController.js";

const router = express.Router();

// Apply auth and admin role check to all routes in this file
router.use(protect);
router.use(authorize("admin"));

router.get("/stats", getPlatformStats);

router.route("/users")
    .get(getAllUsers);

router.route("/users/:id")
    .delete(deleteUser);

router.route("/jobs")
    .get(getAllJobs);

router.route("/jobs/:id")
    .delete(deleteJob);

export default router;
