import React, { useState } from "react";
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
  DollarSign,
  User,
  Sparkles,
  Copy,
  Check,
  Tag,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { statusConfig } from "../../Utility/utilites";
import toast from "react-hot-toast";

// Helper to format CTC cleanly
const formatCTC = (val) => {
  if (val === undefined || val === null || val === "") return "Not specified";
  if (
    typeof val === "string" &&
    (val.toLowerCase().includes("lpa") ||
      val.includes("₹") ||
      val.includes("$"))
  ) {
    return val;
  }
  const num = Number(val);
  if (!isNaN(num) && num > 0) {
    if (num >= 100000) {
      const lpa = (num / 100000).toFixed(num % 100000 === 0 ? 0 : 2);
      return `₹${lpa} LPA (₹${num.toLocaleString("en-IN")})`;
    }
    return `₹${num.toLocaleString("en-IN")}`;
  }
  return String(val);
};

export default function CandidateDetailsModal({
  applicant,
  onClose,
  onStatusChange,
  updatingStatus = null,
  onViewAll,
}) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!applicant) return null;

  const user = applicant.user || {};
  const userProfile = applicant.userProfile || {};
  const job = applicant.job || {};

  const candidateName = userProfile.name || user.name || "Candidate";
  const candidateEmail = user.email || "No email available";
  const candidatePhone = userProfile.phone || user.phone || "No phone available";
  const candidateTitle =
    userProfile.title || applicant.currentRole || "Candidate";
  const totalExp =
    applicant.totalExperience ?? userProfile.experience ?? "Not specified";
  const notice = applicant.noticePeriod || "Not specified";
  const candidateLocation =
    applicant.location ||
    [userProfile.location?.city, userProfile.location?.state]
      .filter(Boolean)
      .join(", ") ||
    "Not specified";

  const statusKey = (applicant.status || "pending").toLowerCase();
  const StatusIcon = statusConfig[statusKey]?.icon || statusConfig.pending.icon;
  const StatusText = statusConfig[statusKey]?.name || applicant.status;

  const statusActions = [
    {
      key: "reviewed",
      label: "Mark Reviewed",
      icon: Eye,
      color: "hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200",
    },
    {
      key: "shortlisted",
      label: "Shortlist",
      icon: Bookmark,
      color: "hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200",
    },
    {
      key: "interview",
      label: "Invite to Interview",
      icon: Calendar,
      color: "hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200",
    },
    {
      key: "hired",
      label: "Hire Candidate 🎉",
      icon: CheckCircle2,
      color:
        "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200",
    },
    {
      key: "rejected",
      label: "Reject",
      icon: XCircle,
      color: "hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200",
    },
  ];

  const handleCopy = (text, type) => {
    if (!text || text.includes("No ")) return;
    navigator.clipboard.writeText(text);
    if (type === "email") {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
      toast.success("Email copied to clipboard");
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
      toast.success("Phone number copied to clipboard");
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 26, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden bg-white rounded-3xl shadow-2xl flex flex-col border border-slate-100 z-10 my-auto"
        >
          {/* Modal Header */}
          <div className="shrink-0 border-b border-slate-100 bg-slate-50/80 px-6 sm:px-8 py-5 flex items-start justify-between relative">
            <div className="flex items-start sm:items-center gap-4 sm:gap-5 flex-1 pr-4">
              {userProfile.profileImage ? (
                <img
                  src={userProfile.profileImage}
                  alt={candidateName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-md shadow-slate-200/60 shrink-0"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-xl sm:text-2xl shadow-md shadow-brand-500/20 shrink-0 uppercase tracking-wider">
                  {getInitials(candidateName)}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
                    {candidateName}
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                      statusConfig[statusKey]?.color || statusConfig.pending.color
                    }`}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    {StatusText}
                  </span>
                </div>

                <p className="text-sm font-semibold text-brand-600 mt-0.5 flex items-center gap-2 flex-wrap">
                  <span>{candidateTitle}</span>
                  {applicant.currentCompany && (
                    <span className="text-slate-500 font-normal text-xs bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      Currently at {applicant.currentCompany}
                    </span>
                  )}
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {candidateLocation}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Applied on{" "}
                    {new Date(applicant.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  {job.title && (
                    <>
                      <span>•</span>
                      <span className="text-slate-700 font-medium">
                        Position: <strong className="text-brand-700">{job.title}</strong>
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-full transition shrink-0"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
            {/* 1. Key Application Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                  <Briefcase className="w-3.5 h-3.5 text-brand-500" />
                  Total Experience
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-900">
                  {typeof totalExp === "number"
                    ? `${totalExp} Years`
                    : totalExp}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  Notice Period
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-900">
                  {notice}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                  <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                  Current CTC
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {formatCTC(applicant.currentCTC)}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  Expected CTC
                </div>
                <div className="text-xs sm:text-sm font-bold text-emerald-700 truncate">
                  {formatCTC(applicant.expectedCTC)}
                </div>
              </div>
            </div>

            {/* 2. Contact & Personal Profile Row */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Candidate Contact & Profile Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                {/* Email */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Mail className="w-4 h-4 text-brand-600 shrink-0" />
                    <div className="overflow-hidden">
                      <p className="text-[10px] text-slate-400 uppercase font-bold">
                        Email
                      </p>
                      <a
                        href={`mailto:${candidateEmail}`}
                        className="font-semibold text-slate-800 hover:text-brand-600 truncate block text-xs"
                      >
                        {candidateEmail}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(candidateEmail, "email")}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
                    title="Copy Email"
                  >
                    {copiedEmail ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Phone */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Phone className="w-4 h-4 text-brand-600 shrink-0" />
                    <div className="overflow-hidden">
                      <p className="text-[10px] text-slate-400 uppercase font-bold">
                        Phone
                      </p>
                      <a
                        href={`tel:${candidatePhone}`}
                        className="font-semibold text-slate-800 hover:text-brand-600 truncate block text-xs"
                      >
                        {candidatePhone}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(candidatePhone, "phone")}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
                    title="Copy Phone"
                  >
                    {copiedPhone ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Education */}
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <GraduationCap className="w-4 h-4 text-brand-600 shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                      Education
                    </p>
                    <p className="font-semibold text-slate-800 truncate text-xs">
                      {userProfile.education || "Not specified"}
                    </p>
                  </div>
                </div>

                {/* Current Role & Company */}
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <Building2 className="w-4 h-4 text-brand-600 shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                      Current Organization
                    </p>
                    <p className="font-semibold text-slate-800 truncate text-xs">
                      {applicant.currentCompany || "Not specified"}
                    </p>
                  </div>
                </div>

                {/* Gender / DOB */}
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <User className="w-4 h-4 text-brand-600 shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                      Gender / DOB
                    </p>
                    <p className="font-semibold text-slate-800 truncate text-xs capitalize">
                      {userProfile.gender || "Not specified"}{" "}
                      {userProfile.dob ? `(${userProfile.dob})` : ""}
                    </p>
                  </div>
                </div>

                {/* Location & Preferred Mode */}
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                      Location / Mode
                    </p>
                    <p className="font-semibold text-slate-800 truncate text-xs capitalize">
                      {candidateLocation}
                      {userProfile.location?.workMode
                        ? ` • ${userProfile.location.workMode}`
                        : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bio summary if exists */}
              {userProfile.bio && (
                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 text-xs text-slate-600">
                  <strong className="text-slate-800 font-semibold block mb-0.5">
                    Candidate Bio:
                  </strong>
                  <p className="italic">{userProfile.bio}</p>
                </div>
              )}
            </div>

            {/* 3. Resume / Curriculum Vitae Link */}
            {userProfile.resume ? (
              <div className="p-4 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border border-blue-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 bg-white text-brand-600 rounded-xl shadow-sm border border-blue-100 shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Candidate Resume / Curriculum Vitae
                    </h4>
                    <p className="text-xs text-slate-500">
                      Official CV document uploaded by candidate.
                    </p>
                  </div>
                </div>
                <a
                  href={userProfile.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-sm transition shrink-0"
                >
                  View / Download Resume <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-3 text-xs text-slate-500">
                <FileText className="w-5 h-5 text-slate-400 shrink-0" />
                <span>No direct resume file link attached to this profile.</span>
              </div>
            )}

            {/* 4. Cover Letter */}
            {applicant.coverLetter && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    Cover Letter / Candidate Note
                  </h3>
                  <span className="text-[10px] text-brand-600 font-semibold bg-brand-50 px-2 py-0.5 rounded-full">
                    Applicant Statement
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-slate-700 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70 whitespace-pre-wrap leading-relaxed shadow-sm font-normal">
                  {applicant.coverLetter}
                </div>
              </div>
            )}

            {/* 5. Candidate Skills & Expertise */}
            {userProfile.skills && userProfile.skills.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-brand-600" />
                  Skills & Technical Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200/80 transition shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Applied Job Summary Context */}
            {job.title && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Position Applied For
                  </h3>
                  <span className="text-xs font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    Job ID: #{job._id?.substring(job._id.length - 6) || "N/A"}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Job Title</span>
                    <span className="font-bold text-slate-900 text-sm">{job.title}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Job Type & Shift</span>
                    <span className="font-semibold text-slate-800 capitalize">
                      {job.jobType || "Full-time"} • {job.jobShift || "Day"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Job Location</span>
                    <span className="font-semibold text-slate-800">
                      {job.location?.city || "Remote"}, {job.location?.state || ""}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 7. Status Change Action Pipeline */}
            {onStatusChange && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Update Application Status
                  </h3>
                  <span className="text-xs text-slate-400">
                    Current: <strong className="text-slate-700 capitalize">{StatusText}</strong>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {statusActions.map(({ key, label, color, icon: Icon }) => {
                    const isActive = statusKey === key;
                    const isBusy = updatingStatus === key;
                    return (
                      <button
                        key={key}
                        disabled={updatingStatus !== null}
                        onClick={() => onStatusChange(applicant._id, key)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-sm ${
                          isActive
                            ? "bg-slate-900 text-white border-slate-900 ring-2 ring-slate-900/20"
                            : `bg-slate-50 border-slate-200 text-slate-700 ${color}`
                        } ${updatingStatus !== null ? "opacity-60 cursor-not-allowed" : ""}`}
                      >
                        {isBusy ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Icon className="w-3.5 h-3.5" />
                        )}
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
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                Open in Full Applicant Management &rarr;
              </button>
            ) : (
              <div className="text-xs text-slate-400">
                Application ID: #{applicant._id}
              </div>
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
