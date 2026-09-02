import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Briefcase,
  FileText,
  ExternalLink,
  Loader2,
  Building2,
  GraduationCap,
  Award,
  CheckCircle2,
  Clock,
  Eye,
  Bookmark,
  XCircle,
} from "lucide-react";
import { statusConfig } from "../../Utility/utilites";

export default function CandidateDetailsModal({
  applicant,
  onClose,
  onStatusChange,
  updatingStatus = null,
  onViewAll,
}) {
  if (!applicant) return null;

  const userProfile = applicant.userProfile || {};
  const job = applicant.job || {};
  const statusKey = (applicant.status || "pending").toLowerCase();
  const StatusIcon = statusConfig[statusKey]?.icon || statusConfig.pending.icon;
  const StatusText = statusConfig[statusKey]?.name || applicant.status;

  const statusActions = [
    { key: "reviewed", label: "Mark Reviewed", icon: Eye, color: "hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200" },
    { key: "shortlisted", label: "Shortlist", icon: Bookmark, color: "hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200" },
    { key: "interview", label: "Invite to Interview", icon: Calendar, color: "hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200" },
    { key: "hired", label: "Hire Candidate 🎉", icon: CheckCircle2, color: "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200" },
    { key: "rejected", label: "Reject", icon: XCircle, color: "hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200" },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 26, stiffness: 300 }}
          className="relative w-full max-w-3xl max-h-[92vh] overflow-hidden bg-white rounded-3xl shadow-2xl flex flex-col border border-slate-100 z-10"
        >
          {/* Modal Header */}
          <div className="shrink-0 border-b border-slate-100 bg-slate-50/60 px-6 sm:px-8 py-5 flex items-start justify-between relative">
            <div className="flex items-center gap-4 sm:gap-5">
              <img
                src={
                  userProfile.profileImage ||
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80"
                }
                alt={userProfile.name || "Candidate"}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-md shadow-slate-200/50"
              />
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {userProfile.name || "Candidate Profile"}
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold border ${
                      statusConfig[statusKey]?.color || statusConfig.pending.color
                    }`}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    {StatusText}
                  </span>
                </div>
                <p className="text-sm font-semibold text-brand-600 mt-0.5">
                  {job.title || "Applied Role"}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {applicant.location || userProfile.location?.city || "Location not specified"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Applied {new Date(applicant.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
            {/* Quick Details Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <div className="flex items-center gap-2.5 text-slate-700">
                <div className="p-2 rounded-xl bg-white text-slate-500 shadow-sm border border-slate-100">
                  <Mail className="w-4 h-4 text-brand-600" />
                </div>
                <div className="truncate">
                  <p className="text-[10px] text-slate-400 font-medium">Email</p>
                  <p className="font-semibold truncate">{applicant.user?.email || "No email"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-slate-700">
                <div className="p-2 rounded-xl bg-white text-slate-500 shadow-sm border border-slate-100">
                  <Phone className="w-4 h-4 text-brand-600" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Phone</p>
                  <p className="font-semibold">{userProfile.phone || "No phone"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-slate-700">
                <div className="p-2 rounded-xl bg-white text-slate-500 shadow-sm border border-slate-100">
                  <Briefcase className="w-4 h-4 text-brand-600" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Experience</p>
                  <p className="font-semibold">{applicant.totalExperience || 0} yrs experience</p>
                </div>
              </div>
            </div>

            {/* Candidate Resume Link */}
            {userProfile.resume && (
              <div className="p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-100/90 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 bg-white text-brand-600 rounded-xl shadow-sm border border-blue-100">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Candidate Resume / Curriculum Vitae
                    </h4>
                    <p className="text-xs text-slate-500">
                      Click to review the applicant's official CV document
                    </p>
                  </div>
                </div>
                <a
                  href={userProfile.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
                >
                  View Resume <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Cover Letter */}
            {applicant.coverLetter && (
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Cover Letter / Note
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 whitespace-pre-wrap leading-relaxed">
                  {applicant.coverLetter}
                </p>
              </div>
            )}

            {/* Skills & Expertise */}
            {userProfile.skills && userProfile.skills.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Skills & Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200/60 transition"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Status Change Action Section */}
            {onStatusChange && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Update Application Status
                </h3>
                <div className="flex flex-wrap gap-2">
                  {statusActions.map(({ key, label, color }) => {
                    const isActive = statusKey === key;
                    return (
                      <button
                        key={key}
                        disabled={updatingStatus !== null}
                        onClick={() => onStatusChange(applicant._id, key)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                          isActive
                            ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                            : `bg-slate-50 border-slate-200 text-slate-700 ${color}`
                        }`}
                      >
                        {updatingStatus === key ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : null}
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="shrink-0 border-t border-slate-100 px-6 sm:px-8 py-4 bg-slate-50 flex items-center justify-between">
            {onViewAll ? (
              <button
                onClick={() => {
                  onClose();
                  onViewAll();
                }}
                className="text-xs font-bold text-brand-600 hover:text-brand-700"
              >
                Open in Full Applicant Management &rarr;
              </button>
            ) : (
              <div></div>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
