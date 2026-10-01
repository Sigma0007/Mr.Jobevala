import express from "express";
import {
  getAllMarqueeCompanies,
  getAdminMarqueeCompanies,
  getMarqueeCompanyById,
  createMarqueeCompany,
  updateMarqueeCompany,
  deleteMarqueeCompany,
  toggleMarqueeCompanyStatus,
  seedMarqueeCompanies,
} from "../controllers/marqueeCompanyController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { uploadImage } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllMarqueeCompanies);
router.get("/detail/:id", getMarqueeCompanyById);

// Admin-only routes
router.get("/admin", protect, authorize("admin"), getAdminMarqueeCompanies);
router.post(
  "/",
  protect,
  authorize("admin"),
  uploadImage.single("logoImage"),
  createMarqueeCompany
);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  uploadImage.single("logoImage"),
  updateMarqueeCompany
);
router.delete("/:id", protect, authorize("admin"), deleteMarqueeCompany);
router.patch(
  "/:id/status",
  protect,
  authorize("admin"),
  toggleMarqueeCompanyStatus
);
router.post("/seed", protect, authorize("admin"), seedMarqueeCompanies);

export default router;
