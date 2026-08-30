import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Briefcase,
  Filter,
  DollarSign,
  Clock,
  CheckCircle,
  Building2,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import customerservice from "../customer/customerservice";
import JobDetailsModal from "../components/Modals/JobDetailsModal";
import ApplyJobModal from "../components/Modals/ApplyJobModal";
import { jobType, SalaryRangeType, workModeType } from "../Utility/utilites";

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

export default function FindJobs() {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isSavingJob, setIsSavingJob] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedModes, setSelectedModes] = useState([]);
  const [salaryRange, setSalaryRange] = useState("Any");
  const [sortBy, setSortBy] = useState("newest");
  const [jobsData, setJobsData] = useState([]);

  const filteredJobs = jobsData;

  const toggleArrayItem = (array, setArray, item) => {
    if (array.includes(item)) {
      setArray(array.filter((i) => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 1, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const handleApplySubmit = async (formData) => {
    try {
      const response = await customerservice.createApplication(formData);
      if (response.success) {
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
      if (response.success) {
        toast.success("Saved to your shortlist!", { icon: "🔖" });
      } else {
        toast.error(response.message || "Failed to save job");
      }
    } catch (error) {
      toast.error("Failed to save job");
      console.error("Error saving job:", error);
    } finally {
      setIsSavingJob(false);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append("searchQuery", searchQuery);
      if (locationQuery) queryParams.append("locationQuery", locationQuery);
      if (selectedTypes.length > 0) queryParams.append("jobType", selectedTypes.join(","));
      if (selectedModes.length > 0) queryParams.append("workMode", selectedModes.join(","));
      if (salaryRange && salaryRange !== "Any") queryParams.append("salaryRange", salaryRange);
      if (sortBy) queryParams.append("sortBy", sortBy);

      const qs = queryParams.toString();
      const response = await customerservice.getAllJobs(qs ? `?${qs}` : "");
      if (response.success) {
        setJobsData(response.data);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchJobs();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, locationQuery, selectedTypes, selectedModes, salaryRange, sortBy]);

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-16 bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Find your next <span className="text-blue-600">premium role</span>
          </h1>
          <p className="mt-2 text-slate-500 text-base md:text-lg">
            Discover top-tier opportunities at the world's most innovative
            companies.
          </p>
        </div>

        {/* Search Header Container */}
        <div className="bg-white p-3 md:p-4 rounded-[2rem] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row gap-3 mb-8 lg:mb-12 transition-all">
          <div className="flex-1 flex items-center gap-3 px-5 py-3.5 bg-slate-50/50 rounded-2xl border border-transparent focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Job title, keywords, or company..."
              className="w-full bg-transparent border-none focus:outline-none text-base text-slate-900 placeholder-slate-400"
            />
          </div>
          <div className="flex-1 flex items-center gap-3 px-5 py-3.5 bg-slate-50/50 rounded-2xl border border-transparent focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
            <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="City, state, or 'Remote'"
              className="w-full bg-transparent border-none focus:outline-none text-base text-slate-900 placeholder-slate-400"
            />
          </div>
          <button className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl text-base font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2">
            Search Jobs
          </button>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="w-full flex items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-slate-200/60 shadow-sm font-medium text-slate-700"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              <span>Advanced Filters</span>
            </div>
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-300 ${
                isMobileFilterOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {(isMobileFilterOpen ||
              (typeof window !== "undefined" && window.innerWidth >= 1024)) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="w-full lg:w-72 flex-shrink-0 overflow-hidden lg:overflow-visible"
              >
                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-8">
                  <div className="hidden lg:flex items-center gap-2 mb-8 pb-5 border-b border-slate-100">
                    <Filter className="w-5 h-5 text-blue-600" />
                    <h2 className="font-bold text-slate-900 text-lg tracking-tight">
                      Filters
                    </h2>
                  </div>

                  <div className="space-y-8">
                    {/* Job Type Filter */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                        Job Type
                      </h3>
                      <div className="space-y-3">
                        {jobType.map((type) => (
                          <label
                            key={type.value}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <div className="relative flex items-center justify-center">
                              <input
                                type="checkbox"
                                checked={selectedTypes.includes(type.value)}
                                onChange={() =>
                                  toggleArrayItem(
                                    selectedTypes,
                                    setSelectedTypes,
                                    type.value,
                                  )
                                }
                                className="peer appearance-none w-5 h-5 rounded-md border-2 border-slate-300 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer focus:ring-4 focus:ring-blue-500/20 outline-none"
                              />
                              <CheckCircle className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                            </div>
                            <span className="text-[15px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                              {type.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Work Mode Filter */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                        Work Mode
                      </h3>
                      <div className="space-y-3">
                        {workModeType.map((mode) => (
                          <label
                            key={mode.value}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <div className="relative flex items-center justify-center">
                              <input
                                type="checkbox"
                                checked={selectedModes.includes(mode.value)}
                                onChange={() =>
                                  toggleArrayItem(
                                    selectedModes,
                                    setSelectedModes,
                                    mode.value,
                                  )
                                }
                                className="peer appearance-none w-5 h-5 rounded-md border-2 border-slate-300 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer focus:ring-4 focus:ring-blue-500/20 outline-none"
                              />
                              <CheckCircle className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                            </div>
                            <span className="text-[15px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                              {mode.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Salary Filter */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                        Salary Range
                      </h3>
                      <div className="relative">
                        <select
                          value={salaryRange}
                          onChange={(e) => setSalaryRange(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 hover:border-slate-200 rounded-xl text-[15px] font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer text-slate-700 appearance-none"
                        >
                          {SalaryRangeType.map((range) => (
                            <option key={range.value} value={range.value}>
                              {range.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Job Listings Area */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* List Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-slate-600 font-medium text-[15px]">
                Showing{" "}
                <span className="font-bold text-slate-900">
                  {filteredJobs.length}
                </span>{" "}
                premium jobs
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer appearance-none shadow-sm transition-all"
                  >
                    <option value="relevant">Most Relevant</option>
                    <option value="newest">Newest</option>
                    <option value="highest">Highest Paid</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Job Grid / List */}
            {filteredJobs.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-4 md:space-y-5"
              >
                {filteredJobs.map((job) => (
                  <motion.div
                    variants={itemVariants}
                    key={job._id}
                    onClick={() => setSelectedJob(job)}
                    className="bg-white p-5 md:p-6 rounded-[1.5rem] border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-blue-200 transition-all cursor-pointer group flex flex-col sm:flex-row gap-5 md:gap-6 relative overflow-hidden"
                  >
                    {/* Hover indicator strip */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 opacity-1 group-hover:opacity-100 transition-opacity" />

                    <img
                      src={
                        job.companyProfile?.logo ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(job.companyProfile?.companyName || "C")}&background=random`
                      }
                      alt={job.companyProfile?.companyName}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-contain p-2 md:p-3 border border-slate-100 shadow-sm shrink-0 bg-white"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-1">
                        <div>
                          <h3 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors capitalize">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-slate-500">
                            <Building2 className="w-4 h-4 shrink-0" />
                            <p className="text-sm md:text-[15px] font-medium capitalize">
                              {job.companyProfile?.companyName}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-4 text-xs md:text-[13px] font-medium text-slate-600">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg capitalize">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />{" "}
                          {job.location?.city}
                          {job.location?.state ? `, ${job.location.state}` : ""}
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/50 text-blue-700 border border-blue-100/50 rounded-lg">
                          <DollarSign className="w-3.5 h-3.5 text-blue-500 shrink-0" />{" "}
                          {job.salary?.currency === "INR" ? "₹" : "$"}
                          {job.salary?.min?.toLocaleString()} -{" "}
                          {job.salary?.max?.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg capitalize">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />{" "}
                          {job.jobType}
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg capitalize">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />{" "}
                          {workModeType.find(
                            (item) => item.value === job.location?.workMode,
                          )?.label || "-"}
                        </span>

                        <span className="flex items-center gap-1.5 text-slate-400 ml-auto pt-2 md:pt-0">
                          <Clock className="w-3.5 h-3.5 shrink-0" />{" "}
                          {timeAgo(job.createdAt)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-[2rem] border border-slate-200/60 border-dashed"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  No exact matches found
                </h3>
                <p className="text-slate-500 max-w-md mx-auto text-sm md:text-base">
                  We couldn't find any premium roles matching your exact
                  filters. Try broadening your search or adjusting the criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setLocationQuery("");
                    setSelectedTypes([]);
                    setSelectedModes([]);
                    setSalaryRange("Any");
                  }}
                  className="mt-6 text-blue-600 font-semibold hover:text-blue-700 hover:underline"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
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
    </div>
  );
}
