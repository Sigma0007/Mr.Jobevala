import { motion } from "framer-motion";
import { Bookmark, MapPin, DollarSign, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import React, { useState, useEffect } from "react";
import customerservice from "../../customer/customerservice";
import { useNavigate } from "react-router-dom";
import ApplyJobModal from "../Modals/ApplyJobModal";
import JobDetailsModal from "../Modals/JobDetailsModal";

export default function UserSaved() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
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

  const handleApplySubmit = async (formData) => {
    try {
      const response = await customerservice.createApplication(formData);
      if (response.success) {
        toast.success("Application Submitted Successfully! 🎉");
        setIsApplyModalOpen(false);
        setSelectedJob(null);
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      toast.error("An error occurred while applying for job");
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
                      job.companyProfile?.logo ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        job.companyProfile?.companyName || "C",
                      )}&background=random`
                    }
                    alt={job.companyProfile?.companyName || "Company"}
                    className="w-12 h-12 rounded-xl object-contain border border-slate-100 mb-4 bg-white p-1"
                  />
                  <h3 className="text-base font-bold text-slate-900 capitalize line-clamp-1">
                    {job.title}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium mb-4 capitalize line-clamp-1">
                    {job.companyProfile?.companyName}
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
      <JobDetailsModal
        selectedJob={selectedJob}
        setSelectedJob={setSelectedJob}
        onUnsaveJob={handleRemoveSavedJob}
        onApplyClick={() => setIsApplyModalOpen(true)}
        isSavedJobMode={true}
      />

      <ApplyJobModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        job={selectedJob}
        onSubmit={handleApplySubmit}
      />

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
