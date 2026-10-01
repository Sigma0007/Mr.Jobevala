import PricingPlan from "../models/PricingPlan.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

// Initial default seed plans (clean, without accentColor or buttonClass)
export const DEFAULT_PLANS = [
    // Job Seekers Free Plan
    {
        planId: "seeker_free_0",
        categoryId: "seekers",
        category: "For Job Seekers",
        name: "Basic Free Starter",
        price: 0,
        originalPrice: 0,
        badge: "Free Forever",
        highlighted: false,
        description: "Everything you need to create your profile, build your CV, and apply for jobs.",
        features: [
            "Apply to all public job postings with verified resume",
            "Build & download simple resume templates (Minimal & Compact)",
            "Company & community feed access & networking",
            "1 Direct recruiter outreach message per month",
            "Standard job alerts & notifications",
            "100% Free Forever",
        ],
        resumeAccess: false,
        directMessagesLimit: 1,
        jobPostsLimit: 0,
        companyPostsLimit: 0,
        unlockContactsLimit: 0,
        validityDays: 365,
        sortOrder: 0,
        isActive: true,
    },
    // Job Seekers Paid Plans
    {
        planId: "seeker_basic_99",
        categoryId: "seekers",
        category: "For Job Seekers",
        name: "Resume Boost & Starter",
        price: 99,
        originalPrice: 199,
        badge: "Starter",
        highlighted: false,
        description: "Essential boost to polish your profile and begin direct recruiter outreach.",
        features: [
            "Unlock all 16 premium resume builder templates & studio colors",
            "AI Resume score & keyword suggestions",
            "Direct messaging to 3 verified recruiters",
            "Profile highlight tag for 14 days",
            "Real-time application view notifications",
            "Valid for 14 days",
        ],
        resumeAccess: true,
        directMessagesLimit: 3,
        jobPostsLimit: 0,
        companyPostsLimit: 0,
        unlockContactsLimit: 0,
        validityDays: 30,
        sortOrder: 1,
        isActive: true,
    },
    {
        planId: "seeker_pro_199",
        categoryId: "seekers",
        category: "For Job Seekers",
        name: "Candidate Spotlight Pro",
        price: 199,
        originalPrice: 499,
        badge: "Most Popular",
        highlighted: true,
        description: "Supercharge your career search with top-tier visibility and recruiter access.",
        features: [
            "Full access to all 16 premium resume templates & A4 PDF exports",
            "Featured Candidate Badge for 30 days",
            "Direct messaging to 15 top recruiters",
            "AI Resume tailoring & ATS score boost",
            "Priority top ranking in recruiter search results",
            "Direct application highlight to hiring managers",
            "Valid for 30 days",
        ],
        resumeAccess: true,
        directMessagesLimit: 15,
        jobPostsLimit: 0,
        companyPostsLimit: 0,
        unlockContactsLimit: 0,
        validityDays: 30,
        sortOrder: 2,
        isActive: true,
    },
    {
        planId: "seeker_vip_299",
        categoryId: "seekers",
        category: "For Job Seekers",
        name: "Career Fast-Track VIP",
        price: 299,
        originalPrice: 699,
        badge: "Ultimate Value",
        highlighted: false,
        description: "All-inclusive VIP career suite with AI mock interview prep & unlimited recruiter access.",
        features: [
            "VIP all-access: All 16 premium resume templates, custom styling & unlimited exports",
            "Top-Tier Spotlight Badge for 60 days",
            "Unlimited direct recruiter messaging",
            "AI Mock interview simulator & score report",
            "Verified Candidate blue checkmark on profile",
            "Dedicated candidate career advisor assistance",
            "Valid for 60 days",
        ],
        resumeAccess: true,
        directMessagesLimit: 100,
        jobPostsLimit: 0,
        companyPostsLimit: 0,
        unlockContactsLimit: 0,
        validityDays: 30,
        sortOrder: 3,
        isActive: true,
    },

    // Employers Plans
    {
        planId: "employer_starter_399",
        categoryId: "employers",
        category: "For Employers",
        name: "Quick Hire Starter",
        price: 399,
        originalPrice: 799,
        badge: "Quick Launch",
        highlighted: false,
        description: "Ideal for startups and small businesses hiring for single or urgent positions.",
        features: [
            "Post 2 Featured Jobs (Active for 30 days)",
            "Publish 5 Company Posts on Community Feed",
            "Unlock 25 verified candidate profiles",
            "Standard applicant filtering & shortlisting",
            "Direct WhatsApp & Email candidate connect",
            "Basic hiring dashboard & resume downloads",
            "Standard email support",
        ],
        resumeAccess: false,
        directMessagesLimit: 25,
        jobPostsLimit: 2,
        companyPostsLimit: 5,
        unlockContactsLimit: 25,
        validityDays: 30,
        sortOrder: 4,
        isActive: true,
    },
    {
        planId: "employer_pro_499",
        categoryId: "employers",
        category: "For Employers",
        name: "Employer Pro Boost",
        price: 499,
        originalPrice: 999,
        badge: "Most Recommended",
        highlighted: true,
        description: "Accelerate your hiring pipeline with premium candidate match & visibility.",
        features: [
            "Post 5 Featured Jobs with high visibility (60 days)",
            "Publish 15 Company Posts on Community Feed",
            "Unlock 100 verified candidate contacts",
            "Highlight tag on job search & homepage feed",
            "Advanced applicant tracking (ATS) dashboard",
            "AI candidate match scoring & smart ranking",
            "24/7 Priority recruiter support",
        ],
        directMessagesLimit: 100,
        jobPostsLimit: 5,
        companyPostsLimit: 15,
        unlockContactsLimit: 100,
        validityDays: 30,
        sortOrder: 5,
        isActive: true,
    },
    {
        planId: "employer_growth_599",
        categoryId: "employers",
        category: "For Employers",
        name: "Growth Scale Hiring",
        price: 599,
        originalPrice: 1299,
        badge: "Maximum Reach",
        highlighted: false,
        description: "Complete recruitment package for rapidly growing companies with multiple openings.",
        features: [
            "Post 10 Featured Jobs (Active for 90 days)",
            "Publish 50 Company Posts on Community Feed",
            "Unlock 250 verified candidate profiles",
            "Top-priority placement across search feeds",
            "Custom company branding banner on job posts",
            "Automated candidate assessment & skill tests",
            "Dedicated hiring success specialist",
        ],
        directMessagesLimit: 250,
        jobPostsLimit: 10,
        companyPostsLimit: 50,
        unlockContactsLimit: 250,
        validityDays: 30,
        sortOrder: 6,
        isActive: true,
    },
];


/**
 * @desc Get all pricing plans
 * @route GET /api/plans
 * @access Public (all active plans) / Admin (can view all including inactive with ?all=true)
 */
export const getAllPlans = catchAsync(async (req, res, next) => {
    const { categoryId, all } = req.query;

    // Check if database currently has any plans, if not auto-seed defaults
    const count = await PricingPlan.countDocuments();
    if (count === 0) {
        try {
            await PricingPlan.insertMany(DEFAULT_PLANS);
        } catch (seedErr) {
            console.warn("Auto-seed pricing plans notice:", seedErr.message);
        }
    }

    const filter = {};
    if (categoryId) {
        filter.categoryId = categoryId;
    }
    // Only return active plans for regular users unless explicitly requested by admin
    if (all !== "true") {
        filter.isActive = true;
    }

    const plans = await PricingPlan.find(filter).sort({ sortOrder: 1, createdAt: 1 });

    res.status(200).json({
        success: true,
        count: plans.length,
        data: plans,
    });
});

/**
 * @desc Get single plan by ID or planId slug
 * @route GET /api/plans/:id
 * @access Public
 */
export const getPlanById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    let plan = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        plan = await PricingPlan.findById(id);
    }
    if (!plan) {
        plan = await PricingPlan.findOne({ planId: id });
    }

    if (!plan) {
        return next(new AppError("Pricing plan not found", 404));
    }

    res.status(200).json({
        success: true,
        data: plan,
    });
});

/**
 * @desc Create new pricing plan
 * @route POST /api/plans
 * @access Admin only
 */
export const createPlan = catchAsync(async (req, res, next) => {
    const {
        planId,
        categoryId,
        category,
        name,
        price,
        originalPrice,
        badge,
        highlighted,
        description,
        features,
        resumeAccess,
        directMessagesLimit,
        jobPostsLimit,
        companyPostsLimit,
        unlockContactsLimit,
        validityDays,
        sortOrder,
        isActive,
    } = req.body;

    if (!name || price === undefined || originalPrice === undefined) {
        return next(new AppError("Plan name, price, and original price are required", 400));
    }

    // Generate slug/planId if not provided
    let finalPlanId = planId
        ? planId.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_")
        : `${categoryId || "plan"}_${name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_${price}`;

    // Check unique planId
    const existing = await PricingPlan.findOne({ planId: finalPlanId });
    if (existing) {
        finalPlanId = `${finalPlanId}_${Date.now().toString().slice(-4)}`;
    }

    // Set category label default if missing
    let finalCategory = category;
    if (!finalCategory) {
        if (categoryId === "seekers") finalCategory = "For Job Seekers";
        else if (categoryId === "employers") finalCategory = "For Employers";
        else finalCategory = "Custom Plan";
    }

    const newPlan = await PricingPlan.create({
        planId: finalPlanId,
        categoryId: categoryId || "seekers",
        category: finalCategory,
        name,
        price: Number(price),
        originalPrice: Number(originalPrice),
        badge: badge || "",
        highlighted: Boolean(highlighted),
        description: description || "",
        features: Array.isArray(features) ? features.filter(Boolean) : [],
        resumeAccess: Boolean(resumeAccess),
        directMessagesLimit: Number(directMessagesLimit) || 0,
        jobPostsLimit: Number(jobPostsLimit) || 0,
        companyPostsLimit: Number(companyPostsLimit) || 0,
        unlockContactsLimit: Number(unlockContactsLimit) || 0,
        validityDays: Number(validityDays) || 30,
        sortOrder: Number(sortOrder) || 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        createdBy: req.user?._id || null,
    });

    res.status(201).json({
        success: true,
        message: "Pricing plan created successfully",
        data: newPlan,
    });
});

/**
 * @desc Update pricing plan
 * @route PUT /api/plans/:id
 * @access Admin only
 */
export const updatePlan = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    let plan = await PricingPlan.findById(id);
    if (!plan) {
        plan = await PricingPlan.findOne({ planId: id });
    }

    if (!plan) {
        return next(new AppError("Pricing plan not found", 404));
    }

    const {
        planId,
        categoryId,
        category,
        name,
        price,
        originalPrice,
        badge,
        highlighted,
        description,
        features,
        resumeAccess,
        directMessagesLimit,
        jobPostsLimit,
        companyPostsLimit,
        unlockContactsLimit,
        validityDays,
        sortOrder,
        isActive,
    } = req.body;

    // Check if planId is being changed to another existing planId
    if (planId && planId !== plan.planId) {
        const conflict = await PricingPlan.findOne({ planId: planId.trim().toLowerCase(), _id: { $ne: plan._id } });
        if (conflict) {
            return next(new AppError("Another plan with this Plan ID / Slug already exists.", 400));
        }
        plan.planId = planId.trim().toLowerCase();
    }

    if (categoryId !== undefined) plan.categoryId = categoryId;
    if (category !== undefined) plan.category = category;
    if (name !== undefined) plan.name = name;
    if (price !== undefined) plan.price = Number(price);
    if (originalPrice !== undefined) plan.originalPrice = Number(originalPrice);
    if (badge !== undefined) plan.badge = badge;
    if (highlighted !== undefined) plan.highlighted = Boolean(highlighted);
    if (description !== undefined) plan.description = description;
    if (features !== undefined) plan.features = Array.isArray(features) ? features.filter(Boolean) : [];
    if (resumeAccess !== undefined) plan.resumeAccess = Boolean(resumeAccess);
    if (directMessagesLimit !== undefined) plan.directMessagesLimit = Number(directMessagesLimit) || 0;
    if (jobPostsLimit !== undefined) plan.jobPostsLimit = Number(jobPostsLimit) || 0;
    if (companyPostsLimit !== undefined) plan.companyPostsLimit = Number(companyPostsLimit) || 0;
    if (unlockContactsLimit !== undefined) plan.unlockContactsLimit = Number(unlockContactsLimit) || 0;
    if (validityDays !== undefined) plan.validityDays = Number(validityDays);
    if (sortOrder !== undefined) plan.sortOrder = Number(sortOrder);
    if (isActive !== undefined) plan.isActive = Boolean(isActive);

    await plan.save();

    res.status(200).json({
        success: true,
        message: "Pricing plan updated successfully",
        data: plan,
    });
});

/**
 * @desc Delete pricing plan
 * @route DELETE /api/plans/:id
 * @access Admin only
 */
export const deletePlan = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    let plan = await PricingPlan.findById(id);
    if (!plan) {
        plan = await PricingPlan.findOne({ planId: id });
    }

    if (!plan) {
        return next(new AppError("Pricing plan not found", 404));
    }

    await plan.deleteOne();

    res.status(200).json({
        success: true,
        message: "Pricing plan deleted successfully",
    });
});

/**
 * @desc Reset / Seed default pricing plans
 * @route POST /api/plans/seed
 * @access Admin only
 */
export const seedPlans = catchAsync(async (req, res, next) => {
    const { overwrite = false } = req.body;

    if (overwrite) {
        await PricingPlan.deleteMany({});
        await PricingPlan.insertMany(DEFAULT_PLANS);
    } else {
        // Upsert default plans without wiping custom plans
        for (const defaultPlan of DEFAULT_PLANS) {
            await PricingPlan.findOneAndUpdate(
                { planId: defaultPlan.planId },
                { $set: defaultPlan },
                { upsert: true }
            );
        }
    }

    const plans = await PricingPlan.find({}).sort({ sortOrder: 1 });

    res.status(200).json({
        success: true,
        message: overwrite ? "All plans reset to defaults successfully" : "Default plans seeded successfully",
        data: plans,
    });
});
