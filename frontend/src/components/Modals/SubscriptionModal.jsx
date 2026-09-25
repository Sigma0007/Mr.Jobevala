import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Crown,
  CheckCircle2,
  Calendar,
  Clock,
  CreditCard,
  User,
  ShieldCheck,
  Zap,
  Sparkles,
  Layers,
  Copy,
  Check,
  AlertCircle,
  Briefcase,
  MessageSquare,
  UserCheck,
  TrendingUp,
  XCircle,
  Flame,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import customerservice from "../../customer/customerservice";

export default function SubscriptionModal({
  isOpen,
  onClose,
  subscription,
  onSubscriptionCancelled,
}) {
  const navigate = useNavigate();
  const [copiedField, setCopiedField] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  if (!isOpen || !subscription) return null;

  const plan = subscription.planDetails || {};
  const user = subscription.user || {};
  const status = subscription.status || "active";

  const startDate = subscription.startDate
    ? new Date(subscription.startDate)
    : new Date(subscription.createdAt || Date.now());
  const endDate = subscription.endDate
    ? new Date(subscription.endDate)
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const now = new Date();

  const totalDurationMs = endDate.getTime() - startDate.getTime();
  const elapsedMs = Math.max(0, now.getTime() - startDate.getTime());
  const progressPercent =
    totalDurationMs > 0
      ? Math.min(
          100,
          Math.max(0, Math.round((elapsedMs / totalDurationMs) * 100)),
        )
      : 100;

  const remainingDays = Math.max(
    0,
    Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
  );

  const isExpired = status === "expired" || now > endDate;

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Copied ${fieldName} to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCancelSub = async () => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this active subscription?",
      )
    ) {
      return;
    }
    setCancelling(true);
    try {
      const res = await customerservice.cancelSubscription(subscription._id);
      if (res?.success) {
        toast.success("Subscription cancelled successfully.");
        if (onSubscriptionCancelled) onSubscriptionCancelled(res.data);
        onClose();
      } else {
        toast.error(res?.message || "Failed to cancel subscription.");
      }
    } catch (err) {
      console.error("Cancel subscription error:", err);
      toast.error(
        err?.response?.data?.message || "Error cancelling subscription.",
      );
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = () => {
    if (status === "active" && !isExpired) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Active Subscription
        </span>
      );
    }
    if (status === "cancelled") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-600 border border-red-500/30">
          <XCircle className="w-3.5 h-3.5" />
          Cancelled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 border border-amber-500/30">
        <Clock className="w-3.5 h-3.5" />
        Expired
      </span>
    );
  };

  console.log("user", user);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        >
          {/* Header Radiant Banner */}
          <div className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 overflow-hidden">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute right-20 -bottom-10 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all backdrop-blur-sm cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/15 backdrop-blur-md text-indigo-100 border border-white/10">
                {plan.category ||
                  (plan.categoryId === "employers"
                    ? "For Employers"
                    : "For Job Seekers")}
              </span>
              {plan.badge && (
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm flex items-center gap-1">
                  <Flame className="w-3 h-3 text-yellow-200" />
                  {plan.badge}
                </span>
              )}
              {getStatusBadge()}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mt-2">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  <Crown className="w-7 h-7 text-amber-400" />
                  {plan.name || "Subscription Plan"}
                </h2>
                <p className="text-xs sm:text-sm text-indigo-200/90 mt-1 max-w-md">
                  {plan.description ||
                    "Active subscription package with verified tier privileges."}
                </p>
              </div>

              <div className="sm:text-right mt-2 sm:mt-0">
                <div className="text-3xl font-extrabold text-white tracking-tight">
                  ₹{plan.price || subscription.payment?.amount || 0}
                </div>
                {plan.originalPrice && plan.originalPrice > plan.price && (
                  <div className="text-xs text-indigo-300 line-through">
                    ₹{plan.originalPrice}
                  </div>
                )}
                <div className="text-[11px] text-indigo-200">
                  {plan.validityDays
                    ? `${plan.validityDays} Days Validity`
                    : "Monthly Plan"}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6 max-h-[calc(85vh-180px)] overflow-y-auto">
            {/* Validity Timeline & Progress Bar */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span>Subscription Validity & Timeline</span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                  {isExpired ? "Expired" : `${remainingDays} Days Left`}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    isExpired
                      ? "bg-slate-400"
                      : progressPercent > 80
                        ? "bg-amber-500"
                        : "bg-gradient-to-r from-indigo-500 to-blue-500"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <span className="text-slate-400 block font-medium">
                    Activated On (Start)
                  </span>
                  <span className="font-semibold text-slate-800">
                    {startDate.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block font-medium">
                    Expires On (End)
                  </span>
                  <span className="font-semibold text-slate-800">
                    {endDate.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Quota & Feature Usage Meters (if limits exist) */}
            {(Number(subscription.directMessagesLimit) > 0 ||
              Number(subscription.jobPostsLimit) > 0 ||
              Number(subscription.companyPostsLimit) > 0 ||
              Number(subscription.unlockContactsLimit) > 0) && (
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  Usage Quotas & Limits
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {Number(subscription.directMessagesLimit) > 0 && (
                    <div className="bg-indigo-50/60 rounded-xl p-3 border border-indigo-100">
                      <div className="flex items-center gap-2 text-indigo-700 text-xs font-semibold mb-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Direct Messages</span>
                      </div>
                      <div className="text-base font-extrabold text-slate-900">
                        {subscription.directMessagesUsed || 0} /{" "}
                        {subscription.directMessagesLimit >= 1000
                          ? "Unlimited"
                          : subscription.directMessagesLimit}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Remaining:{" "}
                        {subscription.directMessagesLimit >= 1000
                          ? "Unlimited"
                          : Math.max(
                              0,
                              subscription.directMessagesLimit -
                                (subscription.directMessagesUsed || 0),
                            )}
                      </div>
                    </div>
                  )}

                  {Number(subscription.jobPostsLimit) > 0 && (
                    <div className="bg-blue-50/60 rounded-xl p-3 border border-blue-100">
                      <div className="flex items-center gap-2 text-blue-700 text-xs font-semibold mb-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Job Posts</span>
                      </div>
                      <div className="text-base font-extrabold text-slate-900">
                        {subscription.jobPostsUsed || 0} /{" "}
                        {subscription.jobPostsLimit}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Remaining:{" "}
                        {Math.max(
                          0,
                          subscription.jobPostsLimit -
                            (subscription.jobPostsUsed || 0),
                        )}
                      </div>
                    </div>
                  )}

                  {Number(subscription.companyPostsLimit) > 0 && (
                    <div className="bg-purple-50/60 rounded-xl p-3 border border-purple-100">
                      <div className="flex items-center gap-2 text-purple-700 text-xs font-semibold mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Company Posts</span>
                      </div>
                      <div className="text-base font-extrabold text-slate-900">
                        {subscription.companyPostsUsed || 0} /{" "}
                        {subscription.companyPostsLimit}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Remaining:{" "}
                        {Math.max(
                          0,
                          subscription.companyPostsLimit -
                            (subscription.companyPostsUsed || 0),
                        )}
                      </div>
                    </div>
                  )}

                  {Number(subscription.unlockContactsLimit) > 0 && (
                    <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-100">
                      <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold mb-1">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Candidate Unlocks</span>
                      </div>
                      <div className="text-base font-extrabold text-slate-900">
                        {subscription.unlockContactsUsed || 0} /{" "}
                        {subscription.unlockContactsLimit}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Remaining:{" "}
                        {Math.max(
                          0,
                          subscription.unlockContactsLimit -
                            (subscription.unlockContactsUsed || 0),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* User & Subscriber Details */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-600" />
                Subscriber & User Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">
                    User ID
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800">
                      {user._id || subscription.user || "N/A"}
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(user._id || subscription.user, "User ID")
                      }
                      className="text-slate-400 hover:text-indigo-600"
                      title="Copy User ID"
                    >
                      {copiedField === "User ID" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">
                    Subscriber Name
                  </span>
                  <span className="font-semibold text-slate-800">
                    {user.name || "Subscriber"}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">
                    Email Address
                  </span>
                  <span className="font-semibold text-slate-800">
                    {user.email || "N/A"}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">
                    Role / Account Type
                  </span>
                  <span className="font-semibold text-indigo-600 capitalize">
                    {user.role === "provider"
                      ? "Provider (Employer)"
                      : user.role === "admin"
                        ? "Administrator"
                        : "Job Seeker (Candidate)"}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment & Transaction Verification Details */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                Payment & Verification Record
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">
                    Payment ID
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800 truncate max-w-[180px]">
                      {subscription.paymentId || "N/A"}
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(subscription.paymentId, "Payment ID")
                      }
                      className="text-slate-400 hover:text-indigo-600"
                      title="Copy Payment ID"
                    >
                      {copiedField === "Payment ID" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">
                    Order ID
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800 truncate max-w-[180px]">
                      {subscription.orderId || "N/A"}
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(subscription.orderId, "Order ID")
                      }
                      className="text-slate-400 hover:text-indigo-600"
                      title="Copy Order ID"
                    >
                      {copiedField === "Order ID" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">
                    Plan ID / Slug
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800">
                      {subscription.planId || "N/A"}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">
                    Payment Verification
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified & Recorded
                  </span>
                </div>
              </div>
            </div>

            {/* Plan Included Features */}
            {Array.isArray(plan.features) && plan.features.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                  Plan Entitlements & Features:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="mt-0.5 rounded-full p-0.5 bg-emerald-100 text-emerald-700 flex-shrink-0">
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="bg-slate-50 p-4 sm:p-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {status === "active" && !isExpired && (
                <button
                  onClick={handleCancelSub}
                  disabled={cancelling}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {cancelling ? "Cancelling..." : "Cancel Subscription"}
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  navigate("/pricing");
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-all cursor-pointer"
              >
                <span>Upgrade / Change Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
