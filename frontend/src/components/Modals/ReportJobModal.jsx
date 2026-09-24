import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  AlertTriangle,
  ShieldAlert,
  HelpCircle,
  DollarSign,
  Building2,
  FileWarning,
  EyeOff,
  Flame,
  Send,
  Loader2,
  CheckCircle2,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";
import customerservice from "../../customer/customerservice";
import { useSelector } from "react-redux";

const REPORT_REASONS = [
  {
    id: "fraud",
    label: "Fraud, Scam, or Phishing",
    description: "Suspicious job offer trying to steal sensitive data or impersonate companies.",
    icon: ShieldAlert,
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    id: "money_demand",
    label: "Demanding Money / Fees",
    description: "Employer asking for payment, security deposit, or registration fee.",
    icon: DollarSign,
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    id: "fake_company",
    label: "Fake Job or Fake Company",
    description: "The company or vacancy does not actually exist.",
    icon: Building2,
    badgeColor: "bg-orange-50 text-orange-700 border-orange-200",
  },
  {
    id: "spam",
    label: "Spam / Duplicate Posting",
    description: "Advertisements, repetitive postings, or unrelated promotional content.",
    icon: Flame,
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    id: "misleading",
    label: "Misleading Salary or Details",
    description: "Inaccurate compensation, fake job responsibilities, or hidden conditions.",
    icon: FileWarning,
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "inappropriate",
    label: "Inappropriate or Discriminatory",
    description: "Harassment, hate speech, offensive content, or unlawful discrimination.",
    icon: EyeOff,
    badgeColor: "bg-pink-50 text-pink-700 border-pink-200",
  },
  {
    id: "expired_or_unavailable",
    label: "Expired or Unavailable",
    description: "Position already closed or employer unreachable.",
    icon: HelpCircle,
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
  },
  {
    id: "other",
    label: "Other Policy Violation",
    description: "Any other grievance or violation not listed above.",
    icon: AlertTriangle,
    badgeColor: "bg-gray-100 text-gray-700 border-gray-200",
  },
];

export default function ReportJobModal({ isOpen, onClose, job, onReportSuccess }) {
  const { user } = useSelector((state) => state.auth || {});

  const [selectedReason, setSelectedReason] = useState("fraud");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState(user?.email || "");
  const [contactPhone, setContactPhone] = useState(user?.phone || "");
  const [evidence, setEvidence] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  if (!isOpen || !job) return null;

  const companyName = job.companyProfile?.companyName || "Employer";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedReason) {
      toast.error("Please select a reason for reporting");
      return;
    }

    if (!description.trim() || description.trim().length < 5) {
      toast.error("Please provide at least 5 characters describing the issue");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        jobId: job._id,
        reason: selectedReason,
        subject: `Report against ${job.title} at ${companyName}`,
        description: description.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
        evidence: evidence.trim(),
      };

      const res = await customerservice.reportJob(payload);
      if (res?.success) {
        setIsSubmittedSuccess(true);
        toast.success("Report submitted successfully! Admin will investigate.");
        if (onReportSuccess) onReportSuccess();
        setTimeout(() => {
          setIsSubmittedSuccess(false);
          setDescription("");
          setEvidence("");
          onClose();
        }, 2000);
      } else {
        toast.error(res?.message || "Failed to submit report");
      }
    } catch (err) {
      console.error("Error submitting job report:", err);
      toast.error(err?.message || "Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
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
          onClick={!isSubmitting ? onClose : undefined}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", damping: 26, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100 max-h-[90vh] z-10 my-auto"
        >
          {/* Header */}
          <div className="shrink-0 p-5 sm:p-6 bg-linear-to-r from-rose-50/80 via-white to-amber-50/50 border-b border-slate-100 flex items-start justify-between relative">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-xs">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">
                    Report Job Posting
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
                    Admin Review
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Reporting <strong className="text-slate-800 font-semibold">{job.title}</strong> at{" "}
                  <strong className="text-slate-800 font-semibold">{companyName}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body content */}
          {isSubmittedSuccess ? (
            <div className="p-8 sm:p-12 text-center flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Report Received
              </h3>
              <p className="text-sm text-slate-600 max-w-md">
                Thank you for helping keep our community safe. Our trust & moderation
                team has been alerted and will investigate this job post immediately.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {/* Reason Grid Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  Select Reason for Complaint <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {REPORT_REASONS.map((reason) => {
                    const Icon = reason.icon;
                    const isSelected = selectedReason === reason.id;
                    return (
                      <button
                        type="button"
                        key={reason.id}
                        onClick={() => setSelectedReason(reason.id)}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? "bg-rose-50/60 border-rose-500 ring-2 ring-rose-500/20 shadow-xs"
                            : "bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-rose-600 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-xs sm:text-sm font-bold truncate ${
                              isSelected ? "text-rose-900" : "text-slate-800"
                            }`}
                          >
                            {reason.label}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                            {reason.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description field (Required) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Describe the Issue in Detail <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe why you are reporting this job post. E.g. did the employer ask for money, provide false company info, or post inappropriate content?"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none"
                  required
                />
                <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                  <span>Minimum 5 characters required</span>
                  <span>{description.length} characters</span>
                </div>
              </div>

              {/* Contact info / Evidence */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Your Contact Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Your Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Evidence / Proof URL or Notes (Optional)
                </label>
                <input
                  type="text"
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                  placeholder="Link to screenshots, message link, or external references"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              {/* Safety notice */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start gap-2.5 text-amber-900 text-xs">
                <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  Your report will be sent securely to platform administrators. The
                  employer will NOT be notified of who filed this complaint.
                </p>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || description.trim().length < 5}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-600/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Report</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
