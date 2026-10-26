import ExtraPostPlan from "../models/ExtraPostPlan.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

// Default starter plans for Extra Posts (Jobs and Company)
export const DEFAULT_EXTRA_POST_PLANS = [
    // Job Post Plans
    {
        planId: "extra_job_1",
        name: "1 Extra Job Post",
        postType: "job_post",
        quantity: 1,
        price: 99,
        originalPrice: 149,
        tag: "Instant Post",
        description: "Unlock 1 extra job post credit to hire immediately",
        features: [
            "1 Extra Job Post credit",
            "Instant activation into your subscription",
            "Valid for entire active subscription period",
            "Full applicant tracking & notifications",
        ],
        sortOrder: 1,
        isActive: true,
    },
    {
        planId: "extra_job_3",
        name: "3 Extra Job Posts",
        postType: "job_post",
        quantity: 3,
        price: 249,
        originalPrice: 299,
        tag: "Hiring Sprint",
        description: "Save time with 3 extra job post credits for active hiring",
        features: [
            "3 Extra Job Post credits",
            "Save ₹48 compared to single purchases",
            "Valid for entire active subscription period",
            "Priority applicant indexing & alerts",
        ],
        sortOrder: 2,
        isActive: true,
    },
    {
        planId: "extra_job_5",
        name: "5 Extra Job Posts",
        postType: "job_post",
        quantity: 5,
        price: 399,
        originalPrice: 499,
        tag: "Best Value",
        description: "Top up 5 job posts for ongoing recruitment campaigns",
        features: [
            "5 Extra Job Post credits",
            "Best per-post rate (Save ₹96)",
            "Valid for entire active subscription period",
            "Dedicated recruiter dashboard support",
        ],
        sortOrder: 3,
        isActive: true,
    },
    // Company Post Plans
    {
        planId: "extra_company_1",
        name: "1 Extra Company Post",
        postType: "company_post",
        quantity: 1,
        price: 49,
        originalPrice: 99,
        tag: "Instant Post",
        description: "Unlock 1 extra company post to publish in the community feed",
        features: [
            "1 Extra Community Post credit",
            "Instant publication without changing monthly plan",
            "Rich media: Photos, job announcements & updates",
            "Engagement & applicant reach",
        ],
        sortOrder: 1,
        isActive: true,
    },
    {
        planId: "extra_company_3",
        name: "3 Extra Company Posts",
        postType: "company_post",
        quantity: 3,
        price: 119,
        originalPrice: 149,
        tag: "Growth Sprint",
        description: "Engage candidates with 3 extra company feed post credits",
        features: [
            "3 Extra Community Post credits",
            "Save ₹28 compared to single purchases",
            "Valid for entire active subscription period",
            "Showcase company milestones & culture",
        ],
        sortOrder: 2,
        isActive: true,
    },
    {
        planId: "extra_company_5",
        name: "5 Extra Company Posts",
        postType: "company_post",
        quantity: 5,
        price: 189,
        originalPrice: 249,
        tag: "Best Value",
        description: "Share employer branding with 5 extra post credits",
        features: [
            "5 Extra Community Post credits",
            "Maximum savings on community reach",
            "Valid for entire active subscription period",
            "High employer brand visibility",
        ],
        sortOrder: 3,
        isActive: true,
    },
];

/**
 * Helper to generate a URL-friendly plan slug
 */
const generateSlug = (name, postType, quantity) => {
    const base = `extra_${postType === "company_post" ? "company" : "job"}_${quantity || 1}_${(name || "plan")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/(^_|_$)/g, "")}`;
    return base.slice(0, 50);
};

/**
 * @desc Get all Extra Post Plans
 * @route GET /api/extra-post-plans
 * @access Public / Authenticated
 */
export const getAllExtraPostPlans = catchAsync(async (req, res, next) => {
    const { postType, all } = req.query;
    const filter = {};

    // Filter by postType if specified ('job_post' or 'company_post')
    if (postType && ["job_post", "company_post"].includes(postType)) {
        filter.postType = postType;
    }

    // Only admins with ?all=true can view inactive plans
    const isAdmin = req.user?.role === "admin";
    if (!isAdmin || all !== "true") {
        filter.isActive = true;
    }

    let plans = await ExtraPostPlan.find(filter)
        .sort({ sortOrder: 1, quantity: 1, price: 1 })
        .populate("createdBy", "name email");

    // Auto-seed defaults if collection is completely empty
    if (plans.length === 0 && (!postType || postType === "job_post" || postType === "company_post")) {
        const totalCount = await ExtraPostPlan.countDocuments();
        if (totalCount === 0) {
            await ExtraPostPlan.insertMany(DEFAULT_EXTRA_POST_PLANS);
            plans = await ExtraPostPlan.find(filter)
                .sort({ sortOrder: 1, quantity: 1, price: 1 })
                .populate("createdBy", "name email");
        }
    }

    res.status(200).json({
        success: true,
        count: plans.length,
        data: plans,
    });
});

/**
 * @desc Get single Extra Post Plan by ID or planId
 * @route GET /api/extra-post-plans/:id
 * @access Public / Authenticated
 */
export const getExtraPostPlanById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    let plan = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        plan = await ExtraPostPlan.findById(id).populate("createdBy", "name email");
    }
    if (!plan) {
        plan = await ExtraPostPlan.findOne({ planId: id.toLowerCase() }).populate(
            "createdBy",
            "name email"
        );
    }

    if (!plan) {
        return next(new AppError(`Extra post plan not found with identifier: ${id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: plan,
    });
});

/**
 * @desc Create a new Extra Post Plan
 * @route POST /api/extra-post-plans
 * @access Private (Admin only)
 */
export const createExtraPostPlan = catchAsync(async (req, res, next) => {
    const {
        name,
        postType = "job_post",
        quantity = 1,
        price,
        originalPrice,
        tag,
        description,
        features,
        sortOrder = 0,
        isActive = true,
        planId: customPlanId,
    } = req.body;

    if (!name || name.trim() === "") {
        return next(new AppError("Plan title/name is required.", 400));
    }

    if (!["job_post", "company_post"].includes(postType)) {
        return next(new AppError("Post type must be either 'job_post' or 'company_post'.", 400));
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
        return next(new AppError("Valid price (₹) is required.", 400));
    }

    const numericQty = Math.max(1, Number(quantity) || 1);

    let planId = customPlanId
        ? customPlanId.toLowerCase().trim().replace(/[^a-z0-9_-]/g, "")
        : generateSlug(name, postType, numericQty);

    // Ensure uniqueness
    const existing = await ExtraPostPlan.findOne({ planId });
    if (existing) {
        planId = `${planId}_${Date.now()}`;
    }

    const newPlan = await ExtraPostPlan.create({
        planId,
        name: name.trim(),
        postType,
        quantity: numericQty,
        price: numericPrice,
        originalPrice: Number(originalPrice) || 0,
        tag: tag ? tag.trim() : "",
        description: description ? description.trim() : "",
        features: Array.isArray(features) ? features.filter(Boolean) : [],
        sortOrder: Number(sortOrder) || 0,
        isActive: Boolean(isActive),
        createdBy: req.user?._id || null,
    });

    res.status(201).json({
        success: true,
        message: "Extra post plan created successfully!",
        data: newPlan,
    });
});

/**
 * @desc Update an existing Extra Post Plan
 * @route PUT /api/extra-post-plans/:id
 * @access Private (Admin only)
 */
export const updateExtraPostPlan = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    let plan = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        plan = await ExtraPostPlan.findById(id);
    }
    if (!plan) {
        plan = await ExtraPostPlan.findOne({ planId: id.toLowerCase() });
    }

    if (!plan) {
        return next(new AppError(`Extra post plan not found with identifier: ${id}`, 404));
    }

    const {
        name,
        postType,
        quantity,
        price,
        originalPrice,
        tag,
        description,
        features,
        sortOrder,
        isActive,
        planId: newPlanId,
    } = req.body;

    if (name !== undefined) plan.name = name.trim();
    if (postType !== undefined) {
        if (!["job_post", "company_post"].includes(postType)) {
            return next(new AppError("Post type must be 'job_post' or 'company_post'.", 400));
        }
        plan.postType = postType;
    }
    if (quantity !== undefined) {
        plan.quantity = Math.max(1, Number(quantity) || 1);
    }
    if (price !== undefined) {
        const numPrice = Number(price);
        if (isNaN(numPrice) || numPrice < 0) {
            return next(new AppError("Price must be a non-negative number.", 400));
        }
        plan.price = numPrice;
    }
    if (originalPrice !== undefined) plan.originalPrice = Math.max(0, Number(originalPrice) || 0);
    if (tag !== undefined) plan.tag = tag.trim();
    if (description !== undefined) plan.description = description.trim();
    if (features !== undefined && Array.isArray(features)) plan.features = features.filter(Boolean);
    if (sortOrder !== undefined) plan.sortOrder = Number(sortOrder) || 0;
    if (isActive !== undefined) plan.isActive = Boolean(isActive);

    if (newPlanId && newPlanId !== plan.planId) {
        const cleanedSlug = newPlanId.toLowerCase().trim().replace(/[^a-z0-9_-]/g, "");
        const conflict = await ExtraPostPlan.findOne({ planId: cleanedSlug, _id: { $ne: plan._id } });
        if (conflict) {
            return next(new AppError(`A plan with slug "${cleanedSlug}" already exists.`, 400));
        }
        plan.planId = cleanedSlug;
    }

    await plan.save();

    res.status(200).json({
        success: true,
        message: "Extra post plan updated successfully!",
        data: plan,
    });
});

/**
 * @desc Delete an Extra Post Plan
 * @route DELETE /api/extra-post-plans/:id
 * @access Private (Admin only)
 */
export const deleteExtraPostPlan = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    let plan = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        plan = await ExtraPostPlan.findById(id);
    }
    if (!plan) {
        plan = await ExtraPostPlan.findOne({ planId: id.toLowerCase() });
    }

    if (!plan) {
        return next(new AppError(`Extra post plan not found with identifier: ${id}`, 404));
    }

    await ExtraPostPlan.findByIdAndDelete(plan._id);

    res.status(200).json({
        success: true,
        message: `Extra post plan "${plan.name}" deleted successfully.`,
        deletedId: plan._id,
    });
});

/**
 * @desc Seed / Restore default Extra Post Plans
 * @route POST /api/extra-post-plans/seed
 * @access Private (Admin only)
 */
export const seedExtraPostPlans = catchAsync(async (req, res, next) => {
    const { overwrite = false } = req.body;

    if (overwrite) {
        await ExtraPostPlan.deleteMany({});
    }

    for (const seedItem of DEFAULT_EXTRA_POST_PLANS) {
        const existing = await ExtraPostPlan.findOne({ planId: seedItem.planId });
        if (!existing) {
            await ExtraPostPlan.create({
                ...seedItem,
                createdBy: req.user?._id || null,
            });
        }
    }

    const allPlans = await ExtraPostPlan.find().sort({ sortOrder: 1, quantity: 1, price: 1 });

    res.status(200).json({
        success: true,
        message: "Default extra post plans synced successfully!",
        count: allPlans.length,
        data: allPlans,
    });
});
