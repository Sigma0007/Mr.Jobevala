import express from "express";
import {
    getAllLocations,
    getLocationsHierarchy,
    getNextLocationCode,
    createState,
    updateState,
    deleteState,
    createDistrict,
    updateDistrict,
    deleteDistrict,
    createSubDivision,
    updateSubDivision,
    deleteSubDivision,
} from "../controllers/locationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public routes
// GET all locations (supports ?state_code= & ?district_code= filters)
router.get("/", getAllLocations);

// GET hierarchical tree (States -> Districts -> SubDivisions)
router.get("/hierarchy", getLocationsHierarchy);

// Admin-only routes
// Helper: get next available code for a type
router.get("/next-code", protect, authorize("admin"), getNextLocationCode);

// State CRUD
router.post("/states", protect, authorize("admin"), createState);
router.put("/states/:id", protect, authorize("admin"), updateState);
router.delete("/states/:id", protect, authorize("admin"), deleteState);

// District CRUD
router.post("/districts", protect, authorize("admin"), createDistrict);
router.put("/districts/:id", protect, authorize("admin"), updateDistrict);
router.delete("/districts/:id", protect, authorize("admin"), deleteDistrict);

// SubDivision CRUD
router.post("/subdivisions", protect, authorize("admin"), createSubDivision);
router.put("/subdivisions/:id", protect, authorize("admin"), updateSubDivision);
router.delete("/subdivisions/:id", protect, authorize("admin"), deleteSubDivision);

export default router;
