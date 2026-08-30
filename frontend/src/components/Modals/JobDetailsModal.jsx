import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Building2,
  MapPin,
  DollarSign,
  Briefcase,
  CheckCircle,
  Loader2,
  Bookmark,
} from "lucide-react";
import toast from "react-hot-toast";

const RequirementItem = ({ text }) => (
  <motion.li
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-start gap-3 text-slate-600"
  >
    <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
    <span className="leading-relaxed text-[15px]">{text}</span>
  </motion.li>
);

export default function JobDetailsModal({
  selectedJob,
  setSelectedJob,
  onSaveJob,
  isSavingJob,
  onUnsaveJob,
  onApplyClick,
  isSavedJobMode,
}) {
  return (
    <AnimatePresence>
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedJob(null)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl sm:rounded-[2rem] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-white/20 z-10"
          >
            {/* Modal Header - Fixed shrink issue on mobile */}
            <div className="shrink-0 p-5 sm:p-8 border-b border-slate-100 bg-slate-50/50 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

              <button
                onClick={() => setSelectedJob(null)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-white border border-slate-200 text-slate-500 rounded-full hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 relative z-10 pr-8 sm:pr-12">
                <img
                  src={
                    selectedJob.companyProfileId?.logo ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedJob.companyProfileId?.companyName || "C")}&background=random`
                  }
                  alt="logo"
                  className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-[1.25rem] object-contain p-2 sm:p-3 border-2 border-white shadow-md bg-white shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-1 sm:mb-2 capitalize">
                    {selectedJob.title}
                  </h2>
                  <p className="text-sm sm:text-lg font-medium text-slate-500 flex items-center gap-2 capitalize">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
                    {selectedJob.companyProfileId?.companyName}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 sm:mt-4 text-xs sm:text-[14px] font-medium text-slate-600">
                    <span className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 bg-white border border-slate-200 rounded-md shadow-sm capitalize">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 shrink-0" />{" "}
                      {selectedJob.location?.city}
                      {selectedJob.location?.state
                        ? `, ${selectedJob.location.state}`
                        : ""}
                    </span>
                    <span className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 bg-white border border-slate-200 rounded-md shadow-sm">
                      <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" />{" "}
                      {selectedJob.salary?.currency === "INR" ? "₹" : "$"}
                      {selectedJob.salary?.min?.toLocaleString()} -{" "}
                      {selectedJob.salary?.max?.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 bg-white border border-slate-200 rounded-md shadow-sm">
                      {selectedJob.location?.isRemote ? "Remote" : "On-site"}
                    </span>
                    <span className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 bg-white border border-slate-200 rounded-md shadow-sm capitalize">
                      <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 shrink-0" />{" "}
                      {selectedJob.jobType}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-8 overflow-y-auto custom-scrollbar flex-1">
              <div className="mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 sm:mb-3 flex items-center gap-2">
                  About the Role
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-[15px]">
                  {selectedJob.description}
                </p>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
                  Requirements & Skills
                </h3>
                <ul className="space-y-3 sm:space-y-4">
                  {selectedJob.skills?.map((skill, i) => (
                    <RequirementItem key={i} text={skill} />
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="shrink-0 p-4 sm:p-6 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              {isSavedJobMode ? (
                <button
                  onClick={async () => {
                    if (onUnsaveJob) {
                      await onUnsaveJob(selectedJob._id);
                      setSelectedJob(null);
                    }
                  }}
                  className="w-full sm:w-auto px-6 py-3 sm:py-3.5 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:border-slate-300 hover:bg-slate-50 transition-all text-center text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  <Bookmark className="w-4 h-4 fill-current text-slate-400" />
                  Unsave
                </button>
              ) : (
                <button
                  onClick={() => onSaveJob && onSaveJob(selectedJob._id)}
                  disabled={isSavingJob}
                  className="w-full sm:w-auto px-6 py-3 sm:py-3.5 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:border-slate-300 hover:bg-slate-50 transition-all text-center text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSavingJob ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save for later"
                  )}
                </button>
              )}

              <button
                onClick={() => {
                  if (onApplyClick) {
                    onApplyClick();
                  } else {
                    toast.success("Application Submitted Successfully! 🎉");
                    setSelectedJob(null);
                  }
                }}
                className="w-full sm:w-auto flex-1 bg-blue-600 text-white py-3 sm:py-3.5 rounded-xl font-bold shadow-[0_4px_20px_0_rgb(37,99,235,0.3)] hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all text-center text-sm sm:text-[15px]"
              >
                Apply Now
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
