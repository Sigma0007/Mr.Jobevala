import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  X,
  AlertTriangle,
  Building2,
  Mail,
  Send,
  Loader2,
  ShieldAlert,
  DollarSign,
  Flame,
  FileWarning,
  EyeOff,
  Bell,
} from "lucide-react";

const QUICK_REASONS = [
  {
    id: "spam",
    label: "Spam / Duplicate Posting",
    text: "Your job post has been flagged and removed as spam or repetitive promotional content.",
    icon: Flame,
  },
  {
    id: "money_demand",
    label: "Demanding Money / Fees",
    text: "Your job post was removed because requesting security deposit, registration, or processing fees from candidates is strictly prohibited.",
    icon: DollarSign,
  },
  {
    id: "fraud",
    label: "Fake Job / Fraudulent Listing",
    text: "Your job post was removed due to unverified company information or suspected fraudulent listing activity.",
    icon: ShieldAlert,
  },
  {
    id: "misleading",
    label: "Misleading Salary or Details",
    text: "Your job post was removed because the advertised compensation, responsibilities, or eligibility terms are inaccurate or misleading.",
    icon: FileWarning,
  },
  {
    id: "inappropriate",
    label: "Inappropriate Content / Violation",
    text: "Your job post was removed because it contains discriminatory, offensive, or prohibited content.",
    icon: EyeOff,
  },
];

export default function DeleteJobConfirmModal({
  isOpen,
  onClose,
  jobTitle,
  companyName,
  providerEmail,
  onConfirm,
  isDeleting,
}) {
  const [selectedReasonId, setSelectedReasonId] = useState("spam");
  const [customReason, setCustomReason] = useState(
    QUICK_REASONS[0].text
  );

  if (!isOpen) return null;

  const handleReasonSelect = (reason) => {
    setSelectedReasonId(reason.id);
    setCustomReason(reason.text);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onConfirm) {
      onConfirm(customReason.trim() || "Violation of platform job posting guidelines.");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!isDeleting ? onClose : undefined}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 26, stiffness: 300 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[92vh] flex flex-col z-10 my-auto"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 bg-rose-50/80 border-b border-rose-100 flex items-start justify-between">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-600/20">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Delete Job Post & Notify Employer
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  The employer will receive an immediate notification with this reason.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={isDeleting}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/80 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {/* Target Job Pill */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm truncate">
                  {jobTitle || "Job Title"}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 px-2 py-0.5 rounded">
                  Will Be Deleted
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 text-[11px] pt-0.5">
                {companyName && (
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    {companyName}
                  </span>
                )}
                {providerEmail && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" />
                    {providerEmail}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Reason Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Reason for Deletion
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUICK_REASONS.map((r) => {
                  const Icon = r.icon;
                  const isSelected = selectedReasonId === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleReasonSelect(r)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? "bg-rose-50 border-rose-400 text-rose-900 font-bold ring-2 ring-rose-500/20"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0 text-rose-600" />
                      <span className="truncate">{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reason Message Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Reason Message Sent to Employer</span>
                <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                  <Bell className="w-3 h-3" /> Real-time Notification
                </span>
              </label>
              <textarea
                rows={3}
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Explain why this job post is being removed..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition resize-none"
                required
              />
            </div>

            {/* Warning Box */}
            <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-amber-900 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                This action is permanent. The job post and all candidate applications
                associated with this job will be removed. The employer will be notified immediately.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isDeleting || !customReason.trim()}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition flex items-center gap-1.5 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting & Notifying...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm & Delete Job</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
