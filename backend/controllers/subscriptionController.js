import Subscription from "../models/Subscription.js";
import PricingPlan from "../models/PricingPlan.js";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

/**
 * @desc Get Current Active Subscription of Logged-in User/Provider
 * @route GET /api/subscription/current
 * @access Private
 */
export const getCurrentSubscription = catchAsync(async (req, res, next) => {
    const userId = req.user._id;

    // Find any active subscriptions
    let activeSub = await Subscription.findOne({
        user: userId,
        status: "active",
    })
        .populate("user", "name email phone role")
        .populate("plan")
        .populate("payment")
        .sort({ createdAt: -1 });

    // Check if expired
    if (activeSub) {
        if (activeSub.endDate && new Date() > activeSub.endDate) {
            activeSub.status = "expired";
            await activeSub.save();
            activeSub = null;
        }
    }

    // If no active, get the most recent one (expired / cancelled) for display
    let latestSub = activeSub;
    if (!latestSub) {
        latestSub = await Subscription.findOne({ user: userId })
            .populate("user", "name email phone role")
            .populate("plan")
            .populate("payment")
            .sort({ createdAt: -1 });

        if (latestSub && latestSub.status === "active" && latestSub.endDate && new Date() > latestSub.endDate) {
            latestSub.status = "expired";
            await latestSub.save();
        }
    }

    res.status(200).json({
        success: true,
        hasActiveSubscription: Boolean(activeSub),
        data: activeSub || latestSub || null,
        activeSubscription: activeSub || null,
    });
});

/**
 * @desc Get All Subscriptions of Logged-in User
 * @route GET /api/subscription/my-history
 * @access Private
 */
export const getMySubscriptionHistory = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Auto-update any expired subscriptions for this user
    await Subscription.updateMany(
        {
            user: userId,
            status: "active",
            endDate: { $lt: new Date() },
        },
        { $set: { status: "expired" } }
    );

    const subscriptions = await Subscription.find({ user: userId })
        .populate("user")
        .populate("plan")
        .populate("payment")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Subscription.countDocuments({ user: userId });

    res.status(200).json({
        success: true,
        count: subscriptions.length,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        data: subscriptions,
    });
});

/**
 * @desc Get All Subscriptions (Admin Only)
 * @route GET /api/subscription/all
 * @access Private/Admin
 */
export const getAllSubscriptionsAdmin = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const { status, search } = req.query;
    const skip = (page - 1) * limit;

    // Auto-expire outdated active subscriptions
    await Subscription.updateMany(
        {
            status: "active",
            endDate: { $lt: new Date() },
        },
        { $set: { status: "expired" } }
    );

    const query = {};
    if (status && status !== "all") {
        query.status = status;
    }

    if (search && search.trim()) {
        const searchRegex = new RegExp(search.trim(), "i");
        // Find matching users first
        const matchedUsers = await User.find({
            $or: [
                { name: searchRegex },
                { email: searchRegex },
                { phone: searchRegex },
            ],
        }).select("_id");
        const userIds = matchedUsers.map((u) => u._id);

        query.$or = [
            { user: { $in: userIds } },
            { "planDetails.name": searchRegex },
            { planId: searchRegex },
            { paymentId: searchRegex },
            { orderId: searchRegex },
        ];
    }

    let subscriptionsQuery = Subscription.find(query)
        .populate("user", "name email phone role")
        .populate("plan")
        .populate("payment")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const [subscriptions, total] = await Promise.all([
        subscriptionsQuery,
        Subscription.countDocuments(query),
    ]);

    // Aggregate statistics across all subscriptions
    const stats = await Subscription.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
                totalRevenue: { $sum: "$planDetails.price" },
            },
        },
    ]);

    const totalAll = await Subscription.countDocuments({});

    res.status(200).json({
        success: true,
        count: subscriptions.length,
        total,
        totalAll,
        page,
        totalPages: Math.ceil(total / limit),
        stats,
        data: subscriptions,
    });
});

/**
 * @desc Get Single Subscription Details by ID
 * @route GET /api/subscription/:id
 * @access Private
 */
export const getSubscriptionById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const subscription = await Subscription.findById(id)
        .populate("user", "name email phone role")
        .populate("plan")
        .populate("payment");

    if (!subscription) {
        return next(new AppError("Subscription record not found", 404));
    }

    // Check ownership if not admin
    if (
        req.user.role !== "admin" &&
        subscription.user &&
        subscription.user._id.toString() !== req.user._id.toString()
    ) {
        return next(new AppError("Not authorized to view this subscription", 403));
    }

    // Auto sync expiry
    await subscription.checkAndUpdateExpiry();

    res.status(200).json({
        success: true,
        data: subscription,
    });
});

/**
 * @desc Cancel Subscription
 * @route POST /api/subscription/cancel/:id
 * @access Private
 */
export const cancelSubscription = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const subscription = await Subscription.findById(id);
    if (!subscription) {
        return next(new AppError("Subscription not found", 404));
    }

    if (
        req.user.role !== "admin" &&
        subscription.user.toString() !== req.user._id.toString()
    ) {
        return next(new AppError("Not authorized to cancel this subscription", 403));
    }

    if (subscription.status !== "active") {
        return next(new AppError(`Subscription is already ${subscription.status}`, 400));
    }

    subscription.status = "cancelled";
    subscription.cancelledAt = new Date();
    await subscription.save();

    res.status(200).json({
        success: true,
        message: "Subscription cancelled successfully",
        data: subscription,
    });
});

/**
 * @desc Validate and Consume Action Quota (e.g. job post, contact unlock, direct message)
 * @route POST /api/subscription/validate-action
 * @access Private
 */
export const validateSubscriptionAction = catchAsync(async (req, res, next) => {
    const { actionType, consume = false } = req.body;
    const userId = req.user._id;

    if (!["job_post", "unlock_contact", "direct_message"].includes(actionType)) {
        return next(new AppError("Invalid action type provided.", 400));
    }

    // Admin bypasses all checks
    if (req.user.role === "admin") {
        return res.status(200).json({
            success: true,
            allowed: true,
            message: "Admin unlimited access granted.",
            remaining: 9999,
        });
    }

    // Find active subscription
    const sub = await Subscription.findOne({
        user: userId,
        status: "active",
    });

    if (!sub || (sub.endDate && new Date() > sub.endDate)) {
        if (sub) {
            sub.status = "expired";
            await sub.save();
        }

        return res.status(200).json({
            success: false,
            allowed: false,
            message: "No active subscription found. Please choose a plan to continue.",
            subscriptionRequired: true,
        });
    }

    let limit = 0;
    let used = 0;
    let fieldUsed = "";

    if (actionType === "job_post") {
        limit = sub.jobPostsLimit || 0;
        used = sub.jobPostsUsed || 0;
        fieldUsed = "jobPostsUsed";
    } else if (actionType === "unlock_contact") {
        limit = sub.unlockContactsLimit || 0;
        used = sub.unlockContactsUsed || 0;
        fieldUsed = "unlockContactsUsed";
    } else if (actionType === "direct_message") {
        limit = sub.directMessagesLimit || 0;
        used = sub.directMessagesUsed || 0;
        fieldUsed = "directMessagesUsed";
    }

    const remaining = Math.max(0, limit - used);

    if (limit > 0 && used >= limit) {
        return res.status(200).json({
            success: false,
            allowed: false,
            message: `You have exhausted your ${actionType.replace("_", " ")} limit (${limit}/${limit}). Please upgrade your plan.`,
            quotaExhausted: true,
            limit,
            used,
            remaining: 0,
        });
    }

    if (consume && fieldUsed) {
        sub[fieldUsed] = (sub[fieldUsed] || 0) + 1;
        await sub.save();
    }

    res.status(200).json({
        success: true,
        allowed: true,
        message: "Action authorized under active subscription.",
        limit,
        used: consume ? used + 1 : used,
        remaining: limit > 0 ? (consume ? remaining - 1 : remaining) : "unlimited",
    });
});

/**
 * @desc Unlock Candidate Contact and Consume Quota
 * @route POST /api/subscription/unlock-candidate
 * @access Private
 */
export const unlockCandidateContact = catchAsync(async (req, res, next) => {
    const { candidateId } = req.body;
    const userId = req.user._id;

    if (!candidateId) {
        return next(new AppError("Candidate ID is required to unlock contact details.", 400));
    }

    // Admin bypasses all checks
    if (req.user.role === "admin") {
        return res.status(200).json({
            success: true,
            allowed: true,
            candidateId,
            message: "Candidate contact unlocked (Admin Access).",
            remaining: "unlimited",
        });
    }

    // Find active subscription
    const sub = await Subscription.findOne({
        user: userId,
        status: "active",
    });

    if (!sub || (sub.endDate && new Date() > sub.endDate)) {
        if (sub) {
            sub.status = "expired";
            await sub.save();
        }

        return res.status(403).json({
            success: false,
            allowed: false,
            message: "No active subscription found. Please choose an employer plan to unlock candidate contacts.",
            subscriptionRequired: true,
        });
    }

    // Check if candidate already unlocked under this subscription
    const alreadyUnlocked = sub.unlockedCandidates && sub.unlockedCandidates.some(
        (id) => id.toString() === candidateId.toString()
    );

    const limit = sub.unlockContactsLimit || 0;
    const used = sub.unlockContactsUsed || 0;
    const remaining = Math.max(0, limit - used);

    if (alreadyUnlocked) {
        return res.status(200).json({
            success: true,
            allowed: true,
            alreadyUnlocked: true,
            candidateId,
            message: "Candidate contact was previously unlocked.",
            limit,
            used,
            remaining: limit > 0 ? remaining : "unlimited",
        });
    }

    // If limit reached
    if (limit > 0 && used >= limit) {
        return res.status(403).json({
            success: false,
            allowed: false,
            message: `You have reached your candidate unlock limit (${used}/${limit}). Please upgrade your plan.`,
            quotaExhausted: true,
            limit,
            used,
            remaining: 0,
        });
    }

    // Consume 1 candidate unlock and record candidate ID
    sub.unlockContactsUsed = used + 1;
    if (!sub.unlockedCandidates) {
        sub.unlockedCandidates = [];
    }
    sub.unlockedCandidates.push(candidateId);
    await sub.save();

    res.status(200).json({
        success: true,
        allowed: true,
        candidateId,
        message: "Candidate contact unlocked successfully.",
        limit,
        used: used + 1,
        remaining: limit > 0 ? Math.max(0, remaining - 1) : "unlimited",
    });
});

