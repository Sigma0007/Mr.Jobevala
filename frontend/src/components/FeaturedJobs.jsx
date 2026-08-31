import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  ArrowRight,
  Building2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import customerservice from "../customer/customerservice";
import JobDetailsModal from "./Modals/JobDetailsModal";
import ApplyJobModal from "./Modals/ApplyJobModal";

const timeAgo = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function FeaturedJobs() {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [isSavingJob, setIsSavingJob] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [jobs, setJobs] = useState([]);

  const fetchLastSixJobs = async () => {
    try {
      const response = await customerservice.getLastsixJobs();
      if (response?.success && response?.data?.length > 0) {
        setJobs(response.data);
      }
    } catch (error) {
      console.error("Error fetching last six jobs:", error);
    }
  };
  ``;

  useEffect(() => {
    fetchLastSixJobs();
  }, []);

  const handleApplySubmit = async (formData) => {
    try {
      const response = await customerservice.createApplication(formData);
      if (response?.success) {
        toast.success("Application Submitted Successfully! 🎉");
        setIsApplyModalOpen(false);
        setSelectedJob(null);
      } else {
        toast.error(response?.message || "Failed to apply");
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      toast.error("An error occurred while applying for job");
    }
  };

  const handleSaveJob = async (jobId) => {
    if (!jobId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to save jobs");
      navigate("/login");
      return;
    }

    setIsSavingJob(true);
    try {
      const response = await customerservice.saveJob(jobId);
      if (response?.success) {
        toast.success("Saved to your shortlist!", { icon: "🔖" });
      } else {
        toast.error(response?.message || "Failed to save job");
      }
    } catch (error) {
      toast.error("Failed to save job");
      console.error("Error saving job:", error);
    } finally {
      setIsSavingJob(false);
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-[#F8FAFC] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-brand-600 font-bold text-xs md:text-sm tracking-[0.2em] uppercase mb-3 block">
            Hiring Now
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Featured Premium Roles
          </h2>
          <p className="text-base md:text-lg text-slate-500 font-medium">
            Hand-picked opportunities from the world's most innovative tech
            companies.
          </p>
        </div>

        {/* Jobs Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {jobs.map((job) => {
            const companyName =
              job.companyProfile?.companyName ||
              job.companyProfile?.name ||
              job.company ||
              "Company";
            const companyLogo =
              job.companyProfile?.logo ||
              job.logo ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                companyName,
              )}&background=random`;
            const locationText = job.location?.city
              ? `${job.location.city}${
                  job.location.state ? `, ${job.location.state}` : ""
                }`
              : typeof job.location === "string"
                ? job.location
                : "Remote";
            const salaryText =
              typeof job.salary === "object" && job.salary !== null
                ? `${
                    job.salary?.currency === "INR" ? "₹" : "$"
                  }${job.salary?.min?.toLocaleString()} - ${job.salary?.max?.toLocaleString()}`
                : job.salary || "Competitive";
            const typeText = job.jobType || job.type || "Full-Time";
            const postedText = job.createdAt
              ? timeAgo(job.createdAt)
              : job.posted || "Recently";

            return (
              <motion.div
                key={job._id || job.id}
                variants={cardVariants}
                onClick={() => setSelectedJob(job)}
                className="group relative bg-white p-6 rounded-[1.5rem] border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-blue-200 transition-all cursor-pointer flex flex-col"
              >
                <div className="absolute left-0 top-6 bottom-6 w-1.5 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-r-full" />

                <div className="flex items-start gap-4 mb-5">
                  <img
                    src={companyLogo}
                    alt={companyName}
                    className="w-14 h-14 rounded-2xl object-contain p-2.5 border border-slate-100 shadow-sm shrink-0 bg-white group-hover:scale-105 transition-transform duration-300"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                    <p className="text-[15px] font-medium text-slate-500 mt-0.5">
                      {companyName}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-medium text-slate-600 capitalize">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {locationText}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/50 border border-blue-100/50 rounded-lg text-xs font-medium text-blue-700">
                    <DollarSign className="w-3.5 h-3.5 text-blue-500" />
                    {salaryText}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-medium text-slate-600 capitalize">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    {typeText}
                  </span>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {postedText}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-bold text-blue-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    View Job <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Centered Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <Link
            to="/jobs"
            className="group flex items-center gap-2 px-8 py-4 bg-brand-600 text-white rounded-full text-base font-bold shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:bg-brand-700 hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] transition-all hover:-translate-y-1"
          >
            Find More Jobs
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* --- Responsive Job Details Modal --- */}
      <JobDetailsModal
        selectedJob={selectedJob}
        setSelectedJob={setSelectedJob}
        onSaveJob={handleSaveJob}
        isSavingJob={isSavingJob}
        onApplyClick={() => setIsApplyModalOpen(true)}
        isSavedJobMode={false}
      />

      <ApplyJobModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        job={selectedJob}
        onSubmit={handleApplySubmit}
      />

      {/* Reused custom scrollbar style from FindJobs.jsx */}
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
    </section>
  );
}
