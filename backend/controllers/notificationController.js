import Notification from "../models/Notification.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

/**
 * @desc Get notifications for logged-in user
 * @route GET /api/notifications
 * @access Private
 */
export const getNotifications = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const { page = 1, limit = 20, filter = "all" } = req.query;

    const query = { recipient: userId };
    if (filter === "unread") {
        query.isRead = false;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [notifications, total, unreadCount] = await Promise.all([
        Notification.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .populate("sender", "name email avatar"),
        Notification.countDocuments(query),
        Notification.countDocuments({ recipient: userId, isRead: false }),
    ]);

    res.status(200).json({
        success: true,
        data: notifications,
        unreadCount,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum) || 1,
    });
});

/**
 * @desc Get unread notifications count
 * @route GET /api/notifications/unread-count
 * @access Private
 */
export const getUnreadCount = catchAsync(async (req, res, next) => {
    const unreadCount = await Notification.countDocuments({
        recipient: req.user._id,
        isRead: false,
    });

    res.status(200).json({
        success: true,
        unreadCount,
    });
});

/**
 * @desc Mark single notification as read
 * @route PATCH /api/notifications/:id/read
 * @access Private
 */
export const markAsRead = catchAsync(async (req, res, next) => {
    const notification = await Notification.findOneAndUpdate(
        {
            _id: req.params.id,
            recipient: req.user._id,
        },
        {
            isRead: true,
            readAt: new Date(),
        },
        { new: true }
    );

    if (!notification) {
        return next(new AppError("Notification not found", 404));
    }

    const unreadCount = await Notification.countDocuments({
        recipient: req.user._id,
        isRead: false,
    });

    res.status(200).json({
        success: true,
        data: notification,
        unreadCount,
        message: "Notification marked as read",
    });
});

/**
 * @desc Mark all notifications as read for current user
 * @route PATCH /api/notifications/read-all
 * @access Private
 */
export const markAllAsRead = catchAsync(async (req, res, next) => {
    await Notification.updateMany(
        {
            recipient: req.user._id,
            isRead: false,
        },
        {
            isRead: true,
            readAt: new Date(),
        }
    );

    res.status(200).json({
        success: true,
        unreadCount: 0,
        message: "All notifications marked as read",
    });
});

/**
 * @desc Delete a notification
 * @route DELETE /api/notifications/:id
 * @access Private
 */
export const deleteNotification = catchAsync(async (req, res, next) => {
    const notification = await Notification.findOneAndDelete({
        _id: req.params.id,
        recipient: req.user._id,
    });

    if (!notification) {
        return next(new AppError("Notification not found", 404));
    }

    const unreadCount = await Notification.countDocuments({
        recipient: req.user._id,
        isRead: false,
    });

    res.status(200).json({
        success: true,
        unreadCount,
        message: "Notification removed",
    });
});

/**
 * @desc Clear all notifications for user
 * @route DELETE /api/notifications
 * @access Private
 */
export const clearAllNotifications = catchAsync(async (req, res, next) => {
    await Notification.deleteMany({
        recipient: req.user._id,
    });

    res.status(200).json({
        success: true,
        unreadCount: 0,
        message: "All notifications cleared",
    });
});
