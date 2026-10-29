import express from "express";
import {
    createPost,
    getAllPosts,
    getMyPosts,
    getPostById,
    toggleLikePost,
    sharePost,
    deletePost,
    updatePost,
} from "../controllers/postController.js";
import { protect, optionalAuth } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { uploadImage } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public / viewer routes (all users/visitors can view, share, and like)
router.get("/", optionalAuth, getAllPosts);
router.get("/my-posts", protect, authorize("provider", "admin"), getMyPosts);
router.get("/:id", optionalAuth, getPostById);
router.post("/:id/share", sharePost);
router.post("/:id/like", protect, toggleLikePost);

// Provider & Admin only routes for creating, updating, and deleting company posts
router.post(
    "/",
    protect,
    authorize("provider", "admin"),
    uploadImage.single("image"),
    createPost
);
router.put(
    "/:id",
    protect,
    authorize("provider", "admin"),
    uploadImage.single("image"),
    updatePost
);
router.delete("/:id", protect, authorize("provider", "admin"), deletePost);

export default router;
