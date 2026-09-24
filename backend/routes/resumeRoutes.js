import express from "express";
import { generateResumePdf } from "../controllers/resumeController.js";

const router = express.Router();

// POST /api/resume/pdf
router.post("/pdf", generateResumePdf);

export default router;
