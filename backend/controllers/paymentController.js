import crypto from "crypto";
import { getRazorpayInstance } from "../config/razorpay.js";
import Payment from "../models/Payment.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

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

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
        return next(new AppError("Please provide a valid amount greater than 0.", 400));
    }

    const razorpay = getRazorpayInstance();

    // Razorpay requires amount in the smallest currency sub-unit (e.g., paise for INR)
    const amountInPaise = Math.round(Number(amount) * 100);
    const receipt = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const options = {
        amount: amountInPaise,
        currency: currency.toUpperCase(),
        receipt,
        notes: {
            purpose,
            planId,
            userId: req.user?._id ? req.user._id.toString() : "guest",
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
        amount: Number(amount),
        currency: order.currency,
        status: "created",
        purpose,
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

    res.status(200).json({
        success: true,
        message: "Payment verified and recorded successfully!",
        payment,
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
            await Payment.findOneAndUpdate(
                { orderId },
                {
                    paymentId,
                    status: "paid",
                }
            );
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
    const status = req.query.status;
    const skip = (page - 1) * limit;

    const query = {};
    if (status) {
        query.status = status;
    }

    const payments = await Payment.find(query)
        .populate("user", "name email phone role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Payment.countDocuments(query);

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
        page,
        totalPages: Math.ceil(total / limit),
        stats,
        data: payments,
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
