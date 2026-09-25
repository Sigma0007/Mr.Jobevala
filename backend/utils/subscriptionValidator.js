import Subscription from "../models/Subscription.js";
import AppError from "./AppError.js";

/**
 * Action type mappings to limit and usage fields on the Subscription model
 */
const ACTION_FIELDS = {
    job_post: {
        limitField: "jobPostsLimit",
        usedField: "jobPostsUsed",
        label: "Job Posts",
        requiredRole: "provider",
    },
    company_post: {
        limitField: "companyPostsLimit",
        usedField: "companyPostsUsed",
        label: "Company Posts",
        requiredRole: "provider",
    },
    unlock_contact: {
        limitField: "unlockContactsLimit",
        usedField: "unlockContactsUsed",
        label: "Candidate Unlocks",
        requiredRole: "provider",
    },
    direct_message: {
        limitField: "directMessagesLimit",
        usedField: "directMessagesUsed",
        label: "Direct Messages",
    },
};

/**
 * Check if user has an active subscription with available quota for the given action.
 * Throws AppError or returns validation status.
 *
 * @param {Object} user - Logged in user object (req.user)
 * @param {String} actionType - One of 'job_post', 'unlock_contact', 'direct_message'
 * @param {Boolean} autoConsume - If true, increments used quota on success
 * @returns {Promise<Object>} { allowed: boolean, subscription: Object, remaining: number|string }
 */
export const validateSubscriptionQuota = async (user, actionType, autoConsume = false) => {
    // 1. Admin always has unlimited access
    if (user.role === "admin") {
        return {
            allowed: true,
            isAdmin: true,
            remaining: "unlimited",
            subscription: null,
        };
    }

    const config = ACTION_FIELDS[actionType];
    if (!config) {
        throw new AppError(`Invalid subscription action type: ${actionType}`, 400);
    }

    // Role check if action requires a specific role (e.g. provider)
    if (config.requiredRole && user.role !== config.requiredRole && user.role !== "admin") {
        throw new AppError(
            `This action (${config.label}) is restricted to ${config.requiredRole === "provider" ? "employers/recruiters" : config.requiredRole}.`,
            403
        );
    }

    // 2. Fetch active subscription
    const sub = await Subscription.findOne({
        user: user._id,
        status: "active",
    });

    if (!sub || (sub.endDate && new Date() > sub.endDate)) {
        if (sub) {
            sub.status = "expired";
            await sub.save();
        }
        throw new AppError(
            `Active subscription required to perform this action (${config.label}). Please subscribe to a plan to continue.`,
            403
        );
    }

    const limit = sub[config.limitField] || 0;
    const used = sub[config.usedField] || 0;

    // 3. If limit > 0 and used >= limit, reject with quota error
    if (limit > 0 && used >= limit) {
        throw new AppError(
            `You have reached your ${config.label} quota (${used}/${limit}). Please upgrade your subscription plan to continue.`,
            403
        );
    }

    // 4. Consume quota if requested
    if (autoConsume) {
        sub[config.usedField] = used + 1;
        await sub.save();
    }

    const remaining = limit > 0 ? Math.max(0, limit - (autoConsume ? used + 1 : used)) : "unlimited";

    return {
        allowed: true,
        limit,
        used: autoConsume ? used + 1 : used,
        remaining,
        subscription: sub,
    };
};

export default {
    validateSubscriptionQuota,
    ACTION_FIELDS,
};
