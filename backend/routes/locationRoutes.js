import express from "express";
import {
    getAllLocations,
    getLocationsHierarchy,
} from "../controllers/locationController.js";

const router = express.Router();

// GET all locations (supports ?state_code= & ?district_code= filters)
router.get("/", getAllLocations);

// GET hierarchical tree (States -> Districts -> SubDivisions)
router.get("/hierarchy", getLocationsHierarchy);

export default router;
