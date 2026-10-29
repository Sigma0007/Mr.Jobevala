import Post from "../models/Post.js";
import CompanyProfile from "../models/CompanyProfile.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { uploadToR2, deleteFromR2 } from "../utils/r2Storage.js";
import { validateSubscriptionQuota } from "../utils/subscriptionValidator.js";

// @desc    Create a new company / provider community post
// @route   POST /api/posts
// @access  Private (Provider, Admin)
export const createPost = catchAsync(async (req, res, next) => {
    const role = req.user.role || "user";
    const providerId = req.user.id || req.user._id;

    // Role Validation: Strictly only providers and admins can create company posts
    if (role !== "provider" && role !== "admin") {
        return next(
            new AppError("Job seekers / candidates cannot create company posts. Only employers and recruiters are authorized.", 403)
        );
    }

    // Subscription & Quota Validation for Company Post
    await validateSubscriptionQuota(req.user, "company_post", true);

    const description = (req.body.description || "").trim();
    let imageUrl = (req.body.image || "").trim();

    // Validation: Description length limit
    if (description.length > 3000) {
        return next(
            new AppError("Post description cannot exceed 3000 characters.", 400)
        );
    }

    // Handle image file upload if multipart form-data is sent
    if (req.file) {
        // Validate MIME type
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedMimeTypes.includes(req.file.mimetype)) {
            return next(
                new AppError("Please upload a valid image file (JPG, PNG, WEBP, or GIF).", 400)
            );
        }

        // Validate File Size (max 10MB)
        if (req.file.size > 10 * 1024 * 1024) {
            return next(
                new AppError("Image size cannot exceed 10MB.", 400)
            );
        }

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
        (companyProfile?.location
            ? `Company in ${companyProfile.location}`
            : "Employer & Recruiter");

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

    // Populate references for return
    const populatedPost = await Post.findById(post._id)
        .populate("provider", "name email role")
        .populate("companyProfile", "companyName logo industry location website")
        .lean();

    res.status(201).json({
        success: true,
        message: "Company post published successfully!",
        data: populatedPost,
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
// @access  Private (All authenticated users can like)
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

    // Only provider owner or admin can delete
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


// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (Provider owner or Admin)
export const updatePost = catchAsync(async (req, res, next) => {
    const userId = (req.user.id || req.user._id).toString();
    const post = await Post.findById(req.params.id);

    if (!post) {
        return next(new AppError("Post not found", 404));
    }

    // Only provider owner or admin can update
    if (post.provider.toString() !== userId && req.user.role !== "admin") {
        return next(new AppError("You are not authorized to update this post", 403));
    }

    if (req.body.description !== undefined) {
        post.description = (req.body.description || "").trim();
    }

    if (req.body.image !== undefined) {
        post.image = (req.body.image || "").trim();
    }

    // Delete image from R2 if present
    if (post.image) {
        await deleteFromR2(post.image);
    }

    if (req.file) {
        const ext = req.file.originalname.split(".").pop() || "jpg";
        const key = `posts/${userId}-${Date.now()}.${ext}`;
        const { url } = await uploadToR2({
            buffer: req.file.buffer,
            key,
            contentType: req.file.mimetype || "image/jpeg",
        });
        post.image = url;
    }

    await post.save();

    const updatedPost = await Post.findById(post._id)
        .populate("provider", "name email role")
        .populate("companyProfile", "companyName logo industry location website")
        .lean();

    res.status(200).json({
        success: true,
        message: "Post updated successfully",
        data: updatedPost,
    });
});
