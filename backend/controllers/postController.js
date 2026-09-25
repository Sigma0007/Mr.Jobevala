import Post from "../models/Post.js";
import CompanyProfile from "../models/CompanyProfile.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { uploadToR2, deleteFromR2 } from "../utils/r2Storage.js";

// @desc    Create a new community post
// @route   POST /api/posts
// @access  Private (Provider, Admin)
export const createPost = catchAsync(async (req, res, next) => {
    const providerId = req.user.id || req.user._id;
    const description = (req.body.description || "").trim();
    let imageUrl = (req.body.image || "").trim();

    // Handle image file upload if multipart form-data is sent
    if (req.file) {
        const ext = req.file.originalname.split(".").pop() || "jpg";
        const key = `posts/${providerId}-${Date.now()}.${ext}`;
        const { url } = await uploadToR2({
            buffer: req.file.buffer,
            key,
            contentType: req.file.mimetype || "image/jpeg",
        });
        imageUrl = url;
    }

    // Validation: Post must contain at least an image or a description
    if (!description && !imageUrl) {
        return next(
            new AppError("Post must contain at least a description or an image.", 400)
        );
    }

    // Fetch provider company profile details if available
    const companyProfile = await CompanyProfile.findOne({ user: providerId });

    const authorHeadline =
        companyProfile?.industry ||
        (companyProfile?.location ? `Company in ${companyProfile.location}` : "Employer & Recruiter");

    const post = await Post.create({
        provider: providerId,
        companyProfile: companyProfile?._id || null,
        authorHeadline,
        description,
        image: imageUrl,
        likes: [],
        likesCount: 0,
        sharesCount: 0,
    });

    res.status(201).json({
        success: true,
        message: "Post published successfully!",
        data: post,
    });
});

// @desc    Get all community feed posts (with optional auth for like status)
// @route   GET /api/posts
// @access  Public
export const getAllPosts = catchAsync(async (req, res, next) => {
    const { search, page = 1, limit = 20 } = req.query;
    const query = { status: "published" };

    if (search && search.trim()) {
        const regex = new RegExp(search.trim(), "i");
        query.$or = [
            { description: regex },
            { authorHeadline: regex },
        ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const totalPosts = await Post.countDocuments(query);
    const posts = await Post.find(query)
        .populate("provider", "name email role")
        .populate("companyProfile", "companyName logo industry location website")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean();

    const currentUserId = req.user ? (req.user.id || req.user._id)?.toString() : null;

    // Attach isLiked flag for the current viewer
    const formattedPosts = posts.map((post) => {
        const isLiked = currentUserId
            ? post.likes?.some((id) => id.toString() === currentUserId)
            : false;
        return {
            ...post,
            isLiked,
            likesCount: post.likes ? post.likes.length : (post.likesCount || 0),
        };
    });

    res.status(200).json({
        success: true,
        count: formattedPosts.length,
        totalPosts,
        totalPages: Math.ceil(totalPosts / limitNum),
        currentPage: pageNum,
        data: formattedPosts,
    });
});

// @desc    Get current provider's own posts
// @route   GET /api/posts/my-posts
// @access  Private (Provider, Admin)
export const getMyPosts = catchAsync(async (req, res, next) => {
    const providerId = req.user.id || req.user._id;

    const posts = await Post.find({ provider: providerId })
        .populate("companyProfile", "companyName logo industry location website")
        .sort({ createdAt: -1 })
        .lean();

    const currentUserId = providerId.toString();

    const formattedPosts = posts.map((post) => ({
        ...post,
        isLiked: post.likes?.some((id) => id.toString() === currentUserId),
        likesCount: post.likes ? post.likes.length : (post.likesCount || 0),
    }));

    res.status(200).json({
        success: true,
        count: formattedPosts.length,
        data: formattedPosts,
    });
});

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id)
        .populate("provider", "name email role")
        .populate("companyProfile", "companyName logo industry location website")
        .lean();

    if (!post) {
        return next(new AppError("Post not found", 404));
    }

    const currentUserId = req.user ? (req.user.id || req.user._id)?.toString() : null;
    const isLiked = currentUserId
        ? post.likes?.some((id) => id.toString() === currentUserId)
        : false;

    res.status(200).json({
        success: true,
        data: {
            ...post,
            isLiked,
            likesCount: post.likes ? post.likes.length : (post.likesCount || 0),
        },
    });
});

// @desc    Toggle like / unlike on a post
// @route   POST /api/posts/:id/like
// @access  Private
export const toggleLikePost = catchAsync(async (req, res, next) => {
    const userId = req.user.id || req.user._id;
    const post = await Post.findById(req.params.id);

    if (!post) {
        return next(new AppError("Post not found", 404));
    }

    const userIndex = post.likes.findIndex(
        (id) => id.toString() === userId.toString()
    );

    let liked = false;
    if (userIndex > -1) {
        // User already liked -> Unlike
        post.likes.splice(userIndex, 1);
        liked = false;
    } else {
        // User hasn't liked -> Like
        post.likes.push(userId);
        liked = true;
    }

    post.likesCount = post.likes.length;
    await post.save();

    res.status(200).json({
        success: true,
        liked,
        likesCount: post.likesCount,
        message: liked ? "Post liked" : "Post unliked",
    });
});

// @desc    Share / Increment share count for a post
// @route   POST /api/posts/:id/share
// @access  Public
export const sharePost = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return next(new AppError("Post not found", 404));
    }

    post.sharesCount = (post.sharesCount || 0) + 1;
    await post.save();

    res.status(200).json({
        success: true,
        sharesCount: post.sharesCount,
        message: "Share count incremented",
    });
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (Provider owner or Admin)
export const deletePost = catchAsync(async (req, res, next) => {
    const userId = (req.user.id || req.user._id).toString();
    const post = await Post.findById(req.params.id);

    if (!post) {
        return next(new AppError("Post not found", 404));
    }

    // Only owner or admin can delete
    if (post.provider.toString() !== userId && req.user.role !== "admin") {
        return next(new AppError("You are not authorized to delete this post", 403));
    }

    // Delete image from R2 if present
    if (post.image) {
        await deleteFromR2(post.image);
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "Post deleted successfully",
    });
});
