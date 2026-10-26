import crypto from "crypto";
import { getRazorpayInstance } from "../config/razorpay.js";
import Payment from "../models/Payment.js";
import PricingPlan from "../models/PricingPlan.js";
import Subscription from "../models/Subscription.js";
import ExtraPostPlan from "../models/ExtraPostPlan.js";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { createAndSendNotification } from "../utils/notificationService.js";

/**
 * Helper to create/activate subscription record upon successful payment
 */
const createOrActivateSubscription = async (payment, userId) => {
    if (!payment || !userId) return null;

    // Find matching pricing plan
    let planDoc = null;
    if (payment.planId) {
        if (payment.planId.match(/^[0-9a-fA-F]{24}$/)) {
            planDoc = await PricingPlan.findById(payment.planId);
        }
        if (!planDoc) {
            planDoc = await PricingPlan.findOne({ planId: payment.planId });
        }
    }

    const validityDays = planDoc?.validityDays || 30;
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + validityDays * 24 * 60 * 60 * 1000);

    // Deactivate previous active subscriptions for this user
    await Subscription.updateMany(
        { user: userId, status: "active" },
        { $set: { status: "inactive" } }
    );

    // Create new active subscription
    const newSubscription = await Subscription.create({
        user: userId,
        plan: planDoc?._id || null,
        planId: payment.planId || planDoc?.planId || "custom_plan",
        planDetails: {
            name: planDoc?.name || payment.purpose || "Custom Plan",
            category: planDoc?.category || (planDoc?.categoryId === "employers" ? "For Employers" : "For Job Seekers"),
            categoryId: planDoc?.categoryId || "seekers",
            price: payment.amount,
            originalPrice: planDoc?.originalPrice || payment.amount,
            badge: planDoc?.badge || "",
            description: planDoc?.description || "",
            features: planDoc?.features || [],
            resumeAccess: Boolean(planDoc?.resumeAccess),
            validityDays,
            extraJobPostPrice: planDoc?.extraJobPostPrice ?? 99,
            extraCompanyPostPrice: planDoc?.extraCompanyPostPrice ?? 49,
        },
        payment: payment._id,
        paymentId: payment.paymentId || "pay_verified",
        orderId: payment.orderId,
        startDate,
        endDate,
        status: "active",
        resumeAccess: Boolean(planDoc?.resumeAccess),
        directMessagesLimit: planDoc?.directMessagesLimit || 0,
        directMessagesUsed: 0,
        jobPostsLimit: planDoc?.jobPostsLimit || 0,
        jobPostsUsed: 0,
        companyPostsLimit: planDoc?.companyPostsLimit || 0,
        companyPostsUsed: 0,
        extraJobPostsPurchased: 0,
        extraCompanyPostsPurchased: 0,
        unlockContactsLimit: planDoc?.unlockContactsLimit || 0,
        unlockContactsUsed: 0,
    });

    const populatedSub = await Subscription.findById(newSubscription._id)
        .populate("user", "name email phone role")
        .populate("plan")
        .populate("payment");

    const role = populatedSub?.user?.role || "user";
    createAndSendNotification({
        recipient: userId,
        title: "Subscription Activated! 🌟",
        message: `Your "${newSubscription.planDetails?.name || "Premium"}" plan is now active for ${validityDays} days.`,
        type: "subscription",
        link: role === "provider" ? "/provider/dashboard" : "/user/dashboard",
        data: { tab: role === "provider" ? "billing" : "payments" },
    });

    return populatedSub;
};

/**
 * Helper to process extra job post or company post add-on payment
 */
export const handleExtraPostPayment = async (payment, userId) => {
    if (!payment || !userId) return null;

    // Find active subscription
    const activeSub = await Subscription.findOne({
        user: userId,
        status: "active",
    });

    if (!activeSub) {
        throw new AppError(
            "No active subscription found to apply extra post quota. Please subscribe to an employer plan first.",
            400
        );
    }

    let actionType =
        payment.notes?.actionType ||
        (payment.planId === "extra_company_post" ? "company_post" : "job_post");
    let quantity = Math.max(1, Number(payment.notes?.quantity) || 1);

    // If linked to an ExtraPostPlan, resolve details directly from DB
    if (payment.notes?.extraPlanId) {
        try {
            const extraPlanDoc = await ExtraPostPlan.findById(payment.notes.extraPlanId);
            if (extraPlanDoc) {
                actionType = extraPlanDoc.postType || actionType;
                quantity = extraPlanDoc.quantity || quantity;
            }
        } catch (_) {}
    } else if (payment.planId && payment.planId !== "extra_job_post" && payment.planId !== "extra_company_post") {
        try {
            const extraPlanDoc = await ExtraPostPlan.findOne({ planId: payment.planId });
            if (extraPlanDoc) {
                actionType = extraPlanDoc.postType || actionType;
                quantity = extraPlanDoc.quantity || quantity;
            }
        } catch (_) {}
    }

    if (actionType === "job_post") {
        activeSub.jobPostsLimit = (activeSub.jobPostsLimit || 0) + quantity;
        activeSub.extraJobPostsPurchased = (activeSub.extraJobPostsPurchased || 0) + quantity;
    } else if (actionType === "company_post") {
        activeSub.companyPostsLimit = (activeSub.companyPostsLimit || 0) + quantity;
        activeSub.extraCompanyPostsPurchased = (activeSub.extraCompanyPostsPurchased || 0) + quantity;
    }

    await activeSub.save();

    const populatedSub = await Subscription.findById(activeSub._id)
        .populate("user", "name email phone role")
        .populate("plan")
        .populate("payment");

    const label = actionType === "job_post" ? "Job Post" : "Company Post";
    createAndSendNotification({
        recipient: userId,
        title: `Extra ${label} Added! 🚀`,
        message: `Your payment of ₹${payment.amount} was verified. +${quantity} extra ${label}${
            quantity > 1 ? "s" : ""
        } added to your subscription.`,
        type: "subscription",
        link: actionType === "job_post" ? "/provider/dashboard" : "/community",
        data: { tab: actionType === "job_post" ? "jobs" : "posts" },
    });

    return populatedSub;
};

/**
 * @desc Get Razorpay Public Key
 * @route GET /api/payment/key
 * @access Public
 */
export const getRazorpayKey = catchAsync(async (req, res, next) => {
    const keyId = process.env.RAZORPAY_KEY_ID;

    if (!keyId) {
        return next(new AppError("Razorpay Key ID is not configured.", 500));
    }

    res.status(200).json({
        success: true,
        key: keyId,
    });
});

/**
 * @desc Create a Razorpay Order
 * @route POST /api/payment/create-order
 * @access Optional Auth / Public
 */
export const createOrder = catchAsync(async (req, res, next) => {
    const { amount, currency = "INR", purpose = "Job Portal Service", planId = "custom", notes = {}, customerDetails = {} } = req.body;

    const isExtraPost =
        planId === "extra_job_post" ||
        planId === "extra_company_post" ||
        notes?.type === "extra_post";

    let finalAmount = Number(amount);
    let finalPurpose = purpose;
    let extraActionType = notes?.actionType || (planId === "extra_company_post" ? "company_post" : "job_post");
    let extraQuantity = Math.max(1, Number(notes?.quantity) || 1);

    if (isExtraPost) {
        if (!req.user?._id) {
            return next(new AppError("You must be logged in to purchase extra posts.", 401));
        }

        const activeSub = await Subscription.findOne({
            user: req.user._id,
            status: "active",
        });

        if (!activeSub || (activeSub.endDate && new Date() > activeSub.endDate)) {
            return next(
                new AppError(
                    "You must have an active subscription plan to purchase extra posts. Please subscribe to an employer plan first.",
                    400
                )
            );
        }

        let matchedExtraPlan = null;
        if (notes?.extraPlanId) {
            try {
                matchedExtraPlan = await ExtraPostPlan.findById(notes.extraPlanId);
            } catch (_) {}
        }
        if (!matchedExtraPlan && planId && planId !== "extra_job_post" && planId !== "extra_company_post") {
            try {
                matchedExtraPlan = await ExtraPostPlan.findOne({ planId });
            } catch (_) {}
        }

        if (matchedExtraPlan) {
            extraActionType = matchedExtraPlan.postType;
            extraQuantity = matchedExtraPlan.quantity;
            finalAmount = matchedExtraPlan.price;
            finalPurpose = `Extra ${extraActionType === "job_post" ? "Job" : "Company"} Post (+${extraQuantity}): ${matchedExtraPlan.name}`;
        } else {
            const unitPrice =
                extraActionType === "job_post"
                    ? (activeSub.planDetails?.extraJobPostPrice ?? 99)
                    : (activeSub.planDetails?.extraCompanyPostPrice ?? 49);

            finalAmount = unitPrice * extraQuantity;
            finalPurpose = `Extra ${extraActionType === "job_post" ? "Job Post" : "Company Post"} (${extraQuantity} post${extraQuantity > 1 ? "s" : ""})`;
        }
    }

    if (!finalAmount || isNaN(finalAmount) || Number(finalAmount) <= 0) {
        return next(new AppError("Please provide a valid amount greater than 0.", 400));
    }

    const razorpay = getRazorpayInstance();

    // Razorpay requires amount in the smallest currency sub-unit (e.g., paise for INR)
    const amountInPaise = Math.round(Number(finalAmount) * 100);
    const receipt = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const options = {
        amount: amountInPaise,
        currency: currency.toUpperCase(),
        receipt,
        notes: {
            purpose: finalPurpose,
            planId,
            userId: req.user?._id ? req.user._id.toString() : "guest",
            type: isExtraPost ? "extra_post" : (notes?.type || "plan_subscription"),
            actionType: isExtraPost ? extraActionType : undefined,
            quantity: isExtraPost ? extraQuantity : undefined,
            extraPlanId: matchedExtraPlan ? matchedExtraPlan._id.toString() : notes?.extraPlanId,
            ...notes,
        },
    };

    let order;
    try {
        order = await razorpay.orders.create(options);
    } catch (err) {
        console.error("Razorpay order creation error:", err);
        return next(new AppError(err?.error?.description || err.message || "Failed to create Razorpay order.", 500));
    }

    // Save initial transaction in database
    const paymentRecord = await Payment.create({
        user: req.user?._id || null,
        orderId: order.id,
        amount: Number(finalAmount),
        currency: order.currency,
        status: "created",
        purpose: finalPurpose,
        planId,
        receipt,
        notes: options.notes,
        customerDetails: {
            name: customerDetails.name || req.user?.name || "",
            email: customerDetails.email || req.user?.email || "",
            phone: customerDetails.phone || req.user?.phone || "",
        },
    });

    res.status(201).json({
        success: true,
        message: "Order created successfully",
        order: {
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
        },
        paymentRecordId: paymentRecord._id,
        key: process.env.RAZORPAY_KEY_ID,
    });
});

/**
 * @desc Verify Razorpay Payment Signature
 * @route POST /api/payment/verify
 * @access Optional Auth / Public
 */
export const verifyPayment = catchAsync(async (req, res, next) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return next(new AppError("Missing required Razorpay verification parameters.", 400));
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
        return next(new AppError("Razorpay Key Secret is missing in server configuration.", 500));
    }

    // Generate expected signature HMAC SHA-256
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
        // Mark payment as failed in DB if record exists
        await Payment.findOneAndUpdate(
            { orderId: razorpay_order_id },
            {
                paymentId: razorpay_payment_id,
                signature: razorpay_signature,
                status: "failed",
                errorDetails: { message: "Invalid cryptographic signature verification failed." },
            }
        );

        return next(new AppError("Payment verification failed. Invalid signature.", 400));
    }

    // Payment verified successfully -> update database record
    const payment = await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        {
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
            status: "paid",
            ...(req.user?._id && { user: req.user._id }),
        },
        { new: true }
    );

    const isExtraPost =
        payment?.planId === "extra_job_post" ||
        payment?.planId === "extra_company_post" ||
        payment?.notes?.type === "extra_post";

    // Process Subscription or Extra Post Add-on
    let subscription = null;
    const targetUserId = req.user?._id || payment?.user;
    if (targetUserId && payment) {
        try {
            if (isExtraPost) {
                subscription = await handleExtraPostPayment(payment, targetUserId);
            } else {
                subscription = await createOrActivateSubscription(payment, targetUserId);
            }
        } catch (subErr) {
            console.error("Auto subscription / extra post processing warning:", subErr);
        }
    }

    res.status(200).json({
        success: true,
        message: isExtraPost
            ? "Payment verified and extra post added to your subscription!"
            : "Payment verified and recorded successfully!",
        payment,
        subscription,
        isExtraPost,
    });
});

/**
 * @desc Handle Razorpay Webhooks
 * @route POST /api/payment/webhook
 * @access Public
 */
export const handleWebhook = catchAsync(async (req, res, next) => {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    if (webhookSecret && signature) {
        const shasum = crypto.createHmac("sha256", webhookSecret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest("hex");

        if (digest !== signature) {
            return next(new AppError("Invalid webhook signature.", 400));
        }
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === "payment.captured" || event === "order.paid") {
        const paymentEntity = payload?.payment?.entity;
        const orderId = paymentEntity?.order_id;
        const paymentId = paymentEntity?.id;

        if (orderId) {
            const updatedPayment = await Payment.findOneAndUpdate(
                { orderId },
                {
                    paymentId,
                    status: "paid",
                },
                { new: true }
            );

            if (updatedPayment && updatedPayment.user) {
                try {
                    const isExtraPost =
                        updatedPayment.planId === "extra_job_post" ||
                        updatedPayment.planId === "extra_company_post" ||
                        updatedPayment.notes?.type === "extra_post";

                    if (isExtraPost) {
                        await handleExtraPostPayment(updatedPayment, updatedPayment.user);
                    } else {
                        await createOrActivateSubscription(updatedPayment, updatedPayment.user);
                    }
                } catch (subErr) {
                    console.error("Webhook subscription creation error:", subErr);
                }
            }
        }
    } else if (event === "payment.failed") {
        const paymentEntity = payload?.payment?.entity;
        const orderId = paymentEntity?.order_id;
        const paymentId = paymentEntity?.id;

        if (orderId) {
            await Payment.findOneAndUpdate(
                { orderId },
                {
                    paymentId,
                    status: "failed",
                    errorDetails: paymentEntity?.error_description || "Payment failed at gateway",
                }
            );
        }
    }

    res.status(200).json({ status: "ok" });
});

/**
 * @desc Get User Payment History
 * @route GET /api/payment/my-payments
 * @access Private
 */
export const getMyPayments = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const payments = await Payment.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Payment.countDocuments({ user: req.user._id });

    res.status(200).json({
        success: true,
        count: payments.length,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        data: payments,
    });
});

/**
 * @desc Get All Payments (Admin)
 * @route GET /api/payment/all
 * @access Private/Admin
 */
export const getAllPaymentsAdmin = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const { status, search } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (status && status !== "all") {
        query.status = status;
    }

    if (search && search.trim()) {
        const searchRegex = new RegExp(search.trim(), "i");
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
            { orderId: searchRegex },
            { paymentId: searchRegex },
            { purpose: searchRegex },
            { receipt: searchRegex },
            { "customerDetails.name": searchRegex },
            { "customerDetails.email": searchRegex },
        ];
    }

    const payments = await Payment.find(query)
        .populate("user", "name email phone role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Payment.countDocuments(query);
    const totalAll = await Payment.countDocuments({});

    // Summary statistics
    const stats = await Payment.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
                totalAmount: { $sum: "$amount" },
            },
        },
    ]);

    res.status(200).json({
        success: true,
        count: payments.length,
        total,
        totalAll,
        page,
        totalPages: Math.ceil(total / limit),
        stats,
        data: payments,
    });
});

/**
 * @desc Record Payment Failure from Gateway/Frontend
 * @route POST /api/payment/record-failure
 * @access Optional Auth / Public
 */
export const recordPaymentFailure = catchAsync(async (req, res, next) => {
    const { orderId, paymentId, error } = req.body;

    if (!orderId) {
        return next(new AppError("Order ID is required to record failure.", 400));
    }

    const errorMsg =
        typeof error === "object"
            ? error?.description || error?.message || JSON.stringify(error)
            : error || "Payment failed at gateway or was cancelled";

    const payment = await Payment.findOneAndUpdate(
        { orderId },
        {
            paymentId: paymentId || undefined,
            status: "failed",
            errorDetails: errorMsg,
        },
        { new: true }
    );

    res.status(200).json({
        success: true,
        message: "Payment failure recorded successfully.",
        data: payment,
    });
});

/**
 * @desc Get Payment by ID
 * @route GET /api/payment/:id
 * @access Private
 */
export const getPaymentById = catchAsync(async (req, res, next) => {
    const payment = await Payment.findById(req.params.id).populate("user", "name email phone");

    if (!payment) {
        return next(new AppError("Payment not found with this ID.", 404));
    }

    // Check ownership if not admin
    if (req.user.role !== "admin" && payment.user && payment.user._id.toString() !== req.user._id.toString()) {
        return next(new AppError("Not authorized to access this payment record.", 403));
    }

    res.status(200).json({
        success: true,
        data: payment,
    });
});
