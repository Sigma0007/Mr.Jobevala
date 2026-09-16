import Notification from "../models/Notification.js";
import { emitToUser } from "./socket.js";

/**
 * Creates a notification in the database and broadcasts it via WebSocket to the recipient
 * @param {Object} options
 * @param {string|ObjectId} options.recipient - Target User ID
 * @param {string|ObjectId} [options.sender] - Optional Sender User ID
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification body
 * @param {string} [options.type='system'] - Type: 'profile'|'application'|'status_update'|'job'|'subscription'|'system'
 * @param {string} [options.link=''] - Frontend navigation link
 * @param {Object} [options.data={}] - Additional payload data
 * @returns {Promise<Notification|null>}
 */
export const createAndSendNotification = async ({
    recipient,
    sender = null,
    title,
    message,
    type = "system",
    link = "",
    data = {},
}) => {
    try {
        if (!recipient) return null;
        const notification = await Notification.create({
            recipient,
            sender,
            title,
            message,
            type,
            link,
            data,
            isRead: false,
        });

        // Emit real-time notification to the user's active socket room
        emitToUser(recipient, "new_notification", notification);

        return notification;
    } catch (error) {
        console.error("Error creating and sending notification:", error);
        return null;
    }
};
