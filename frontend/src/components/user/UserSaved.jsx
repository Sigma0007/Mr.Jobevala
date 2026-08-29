import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, MapPin, DollarSign, Loader2, X, Building2, Briefcase, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import React, { useState, useEffect } from "react";
import customerservice from "../../customer/customerservice";
import { useNavigate } from "react-router-dom";

const RequirementItem = ({ text }) => (
  <motion.li
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-start gap-3 text-slate-600"
  >
    <CheckCircle className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
    <span className="leading-relaxed text-[15px]">{text}</span>
  </motion.li>
);

export default function UserSaved() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    setIsLoading(true);
    try {
      const response = await customerservice.getSavedJobs();
      if (response.success) {
        setSavedJobs(response.data);
      } else {
        toast.error("Failed to load saved jobs");
      }
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      toast.error("An error occurred while fetching saved jobs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSavedJob = async (jobId) => {
    try {
      const response = await customerservice.removeSavedJob(jobId);
      if (response.success) {
        toast.success("Job removed from saved");
        setSavedJobs((prev) => prev.filter((item) => item.job?._id !== jobId));
      } else {
        toast.error("Failed to remove job");
      }
    } catch (error) {
      console.error("Error removing saved job:", error);
      toast.error("An error occurred");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] relative"
      >
        <div className="mb-8">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Saved Jobs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Jobs you've bookmarked for later.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="text-center py-20">
            <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              No saved jobs yet
            </h3>
            <p className="text-slate-500 text-sm">
              When you save a job, it will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedJobs.map((item) => {
              const job = item.job;
              if (!job) return null;

              return (
                <div
                  key={item._id}
                  className="p-6 border border-slate-100 rounded-2xl hover:shadow-md transition-shadow bg-slate-50/50 relative group flex flex-col"
                >
                  <button
                    onClick={() => handleRemoveSavedJob(job._id)}
                    className="absolute top-4 right-4 p-2 text-brand-600 bg-brand-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                  <img
                    src={
                      job.companyProfileId?.logo ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        job.companyProfileId?.companyName || "C"
                      )}&background=random`
                    }
                    alt={job.companyProfileId?.companyName || "Company"}
                    className="w-12 h-12 rounded-xl object-contain border border-slate-100 mb-4 bg-white p-1"
                  />
                  <h3 className="text-base font-bold text-slate-900 capitalize line-clamp-1">
                    {job.title}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium mb-4 capitalize line-clamp-1">
                    {job.companyProfileId?.companyName}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-6">
                    <span className="flex items-center gap-1 capitalize">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />{" "}
                      {job.location?.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />{" "}
                      {job.salary?.currency === "INR" ? "₹" : "$"}
                      {job.salary?.min?.toLocaleString()} -{" "}
                      {job.salary?.max?.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-auto">
                    <button 
                      onClick={() => setSelectedJob(job)}
                      className="w-full py-2.5 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 transition-colors"
                    >
                      View Job
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* --- Responsive Job Details Modal --- */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
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
              {/* Modal Header */}
              <div className="shrink-0 p-5 sm:p-8 border-b border-slate-100 bg-slate-50/50 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

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
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-500 shrink-0" />{" "}
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
                <button
                  onClick={async () => {
                    await handleRemoveSavedJob(selectedJob._id);
                    setSelectedJob(null);
                  }}
                  className="w-full sm:w-auto px-6 py-3 sm:py-3.5 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:border-slate-300 hover:bg-slate-50 transition-all text-center text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  <Bookmark className="w-4 h-4 fill-current text-slate-400" />
                  Unsave
                </button>
                <button
                  onClick={() => {
                    toast.success("Application Submitted Successfully! 🎉");
                    setSelectedJob(null);
                  }}
                  className="w-full sm:w-auto flex-1 bg-brand-600 text-white py-3 sm:py-3.5 rounded-xl font-bold shadow-[0_4px_20px_0_rgb(37,99,235,0.3)] hover:bg-brand-700 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all text-center text-sm sm:text-[15px]"
                >
                  Apply Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        @media (min-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
          border: 2px solid white;
        }
        @media (min-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar-thumb {
            border: 3px solid white;
          }
        }
      `,
        }}
      />
    </>
  );
}
