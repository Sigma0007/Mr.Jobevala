import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark,
  BookmarkCheck,
  MapPin,
  DollarSign,
  Loader2,
  Search,
  Briefcase,
  Clock,
  ArrowUpRight,
  Share2,
  Trash2,
  LayoutGrid,
  List,
  ShieldCheck,
  Globe,
  Compass,
  X,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import customerservice from "../../customer/customerservice";
import ApplyJobModal from "../Modals/ApplyJobModal";
import { formatCTC } from "../../Utility/utilites";

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

const formatExperience = (exp) => {
  if (!exp) return null;
  if (typeof exp === "object") {
    if (exp.min !== undefined && exp.max !== undefined) {
      return `${exp.min}-${exp.max} yrs`;
    }
    if (exp.min !== undefined) return `${exp.min}+ yrs`;
    if (exp.max !== undefined) return `Up to ${exp.max} yrs`;
  }
  if (typeof exp === "string" || typeof exp === "number") {
    return `${exp} yrs`;
  }
  return null;
};

const formatCategory = (cat) => {
  if (!cat) return "";
  return cat.replace(/_/g, " ");
};

const getWorkMode = (job) => {
  return job?.location?.workMode || job?.workMode || "On-site";
};

export default function UserSaved() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    remoteCount: 0,
    hybridCount: 0,
    fulltimeCount: 0,
    parttimeCount: 0,
    internshipCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("all");
  const [selectedWorkMode, setSelectedWorkMode] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'

  const navigate = useNavigate();

  const fetchSavedJobs = async (
    search = searchTerm,
    jobType = selectedJobType,
    workMode = selectedWorkMode,
    sort = sortBy,
  ) => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search && search.trim()) queryParams.set("search", search.trim());
      if (jobType && jobType !== "all") queryParams.set("jobType", jobType);
      if (workMode && workMode !== "all") queryParams.set("workMode", workMode);
      if (sort) queryParams.set("sortBy", sort);

      const query = queryParams.toString() ? `?${queryParams.toString()}` : "";
      const response = await customerservice.getSavedJobs(query);
      if (response.success) {
        setSavedJobs(response.data || []);
        if (response.stats) {
          setStats(response.stats);
        }
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

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchSavedJobs(searchTerm, selectedJobType, selectedWorkMode, sortBy);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchTerm, selectedJobType, selectedWorkMode, sortBy]);

  const handleRemoveSavedJob = async (jobId, e) => {
    if (e) e.stopPropagation();
    setRemovingId(jobId);
    try {
      const response = await customerservice.removeSavedJob(jobId);
      if (response.success) {
        toast.success("Job removed from bookmarks");
        setSavedJobs((prev) => prev.filter((item) => item.job?._id !== jobId));
        setStats((prev) => ({
          ...prev,
          total: Math.max(0, (prev.total || 0) - 1),
        }));
      } else {
        toast.error("Failed to remove job");
      }
    } catch (error) {
      console.error("Error removing saved job:", error);
      toast.error("An error occurred while removing saved job");
    } finally {
      setRemovingId(null);
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
        toast.error(response?.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      toast.error("An error occurred while applying for job");
    }
  };

  const handleShareJob = (job, e) => {
    if (e) e.stopPropagation();
    const url = `${window.location.origin}/jobs/${job._id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success("Job link copied to clipboard! 📋");
    } else {
      toast.success("Link: " + url);
    }
  };

  const handleViewJobDetails = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  // Stats calculation
  const totalSaved = stats.total ?? savedJobs.length;
  const remoteCount = (stats.remoteCount || 0) + (stats.hybridCount || 0);
  const fulltimeCount = stats.fulltimeCount || 0;

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedJobType("all");
    setSelectedWorkMode("all");
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedJobType !== "all" ||
    selectedWorkMode !== "all" ||
    sortBy !== "newest";

  const renderSalary = (job) => {
    if (!job?.salary) return "Competitive Salary";
    const { min, max, currency, period } = job.salary;
    const currSymbol = currency === "USD" || currency === "$" ? "$" : "₹";
    const periodText = period ? ` / ${period}` : "";

    if (min !== undefined && max !== undefined && min > 0 && max > 0) {
      if (currency === "INR" || !currency) {
        const minFormatted = formatCTC(min);
        const maxFormatted = formatCTC(max);
        if (minFormatted && maxFormatted) {
          return `${minFormatted} - ${maxFormatted}${periodText}`;
        }
      }
      return `${currSymbol}${min.toLocaleString()} - ${currSymbol}${max.toLocaleString()}${periodText}`;
    } else if (max && max > 0) {
      const maxFormatted = formatCTC(max);
      return `Up to ${maxFormatted || `${currSymbol}${max.toLocaleString()}`}${periodText}`;
    } else if (min && min > 0) {
      const minFormatted = formatCTC(min);
      return `From ${minFormatted || `${currSymbol}${min.toLocaleString()}`}${periodText}`;
    }
    return "Competitive Salary";
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-6"
      >
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-brand-50/70 via-blue-50/40 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 border border-brand-100/80 rounded-full text-brand-700 text-xs font-semibold mb-3">
                <BookmarkCheck className="w-3.5 h-3.5 text-brand-600" />
                <span>Saved Opportunities</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                My Bookmarked Jobs
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-xl">
                Track, compare, and apply to your saved roles. Click on any job
                to view complete details in Job Details.
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-start md:self-center">
              <button
                onClick={fetchSavedJobs}
                title="Refresh saved jobs"
                className="p-2.5 text-slate-500 hover:text-brand-600 bg-slate-50 hover:bg-brand-50 border border-slate-200/80 rounded-2xl transition-all cursor-pointer"
              >
                <RefreshCw
                  className={`w-4 h-4 ${
                    isLoading ? "animate-spin text-brand-600" : ""
                  }`}
                />
              </button>

              <button
                onClick={() => navigate("/jobs")}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl text-sm font-semibold shadow-[0_4px_14px_0_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_0_rgba(37,99,235,0.4)] transition-all cursor-pointer group"
              >
                <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                <span>Explore More Jobs</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-slate-100">
            <div className="bg-slate-50/80 hover:bg-slate-50 border border-slate-100 rounded-2xl p-3.5 transition-colors">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                <Bookmark className="w-3.5 h-3.5 text-brand-600" />
                <span>Total Bookmarks</span>
              </div>
              <p className="text-xl font-bold text-slate-900">{totalSaved}</p>
            </div>

            <div className="bg-slate-50/80 hover:bg-slate-50 border border-slate-100 rounded-2xl p-3.5 transition-colors">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                <span>Remote / Hybrid</span>
              </div>
              <p className="text-xl font-bold text-slate-900">{remoteCount}</p>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-slate-50/80 hover:bg-slate-50 border border-slate-100 rounded-2xl p-3.5 transition-colors">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                <span>Full-Time Roles</span>
              </div>
              <p className="text-xl font-bold text-slate-900">
                {fulltimeCount}
              </p>
            </div>
          </div>
        </div>

        {/* Filter, Search & View Controls */}
        <div className="bg-white rounded-3xl p-4 md:p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col md:flex-row gap-3 md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, company, location, or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns & View Toggle */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Job Type Dropdown */}
            <select
              value={selectedJobType}
              onChange={(e) => setSelectedJobType(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer transition-all"
            >
              <option value="all">All Job Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="freelance">Freelance</option>
            </select>

            {/* Work Mode Dropdown */}
            <select
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer transition-all"
            >
              <option value="all">All Work Modes</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="on-site">On-site</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer transition-all"
            >
              <option value="newest">Recently Saved</option>
              <option value="oldest">Oldest Saved</option>
              <option value="salaryHigh">Highest Salary</option>
              <option value="titleAsc">Job Title (A-Z)</option>
              <option value="companyAsc">Company (A-Z)</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200/70">
              <button
                onClick={() => setViewMode("grid")}
                title="Grid View"
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-brand-600 shadow-xs font-semibold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                title="List View"
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white text-brand-600 shadow-xs font-semibold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          /* Loading Skeleton State */
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                : "space-y-4"
            }
          >
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] animate-pulse"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-slate-200 rounded-2xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-slate-200 rounded-md w-3/4" />
                    <div className="h-4 bg-slate-100 rounded-md w-1/2" />
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="h-4 bg-slate-100 rounded-md w-full" />
                  <div className="h-4 bg-slate-100 rounded-md w-2/3" />
                </div>
                <div className="h-10 bg-slate-100 rounded-2xl w-full" />
              </div>
            ))}
          </div>
        ) : savedJobs.length === 0 ? (
          hasActiveFilters ? (
            /* Filtered Empty State */
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                No matching jobs found
              </h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto mb-5">
                We couldn't find any saved jobs matching your search criteria or
                filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            /* Completely Empty State */
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="w-20 h-20 bg-brand-50 border border-brand-100/80 rounded-3xl flex items-center justify-center mx-auto mb-5 text-brand-600 shadow-inner">
                <Bookmark className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No saved jobs yet
              </h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                When you find a job you love on the job board, click the bookmark
                icon to save it here for quick review and one-click application.
              </p>
              <button
                onClick={() => navigate("/jobs")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl text-sm font-semibold shadow-[0_4px_14px_0_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_0_rgba(37,99,235,0.4)] transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Browse Job Listings</span>
              </button>
            </div>
          )
        ) : (
          /* Jobs List/Grid View */
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 gap-4.5"
                : "space-y-4"
            }
          >
            <AnimatePresence>
              {savedJobs.map((item) => {
                const job = item.job;
                if (!job) return null;

                const companyLogo =
                  job.companyProfile?.logo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    job.companyProfile?.companyName || job.title || "Company",
                  )}&background=2563eb&color=ffffff&bold=true`;

                const isRemoving = removingId === job._id;
                const workMode = getWorkMode(job);
                const expDisplay = formatExperience(job.experience);

                if (viewMode === "list") {
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={item._id}
                      onClick={() => handleViewJobDetails(job._id)}
                      className="group bg-white rounded-3xl p-5 md:p-6 border border-slate-100 hover:border-brand-200/90 hover:shadow-[0_10px_30px_rgba(37,99,235,0.08)] transition-all cursor-pointer relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                    >
                      {/* Left Company & Title */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <img
                          src={companyLogo}
                          alt={job.companyProfile?.companyName || "Company"}
                          className="w-13 h-13 md:w-14 md:h-14 rounded-2xl object-contain border border-slate-100 bg-white p-1.5 shadow-xs shrink-0 group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              job.companyProfile?.companyName || "C",
                            )}&background=2563eb&color=ffffff&bold=true`;
                          }}
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-100/70 capitalize">
                              {job.jobType || "Full-time"}
                            </span>
                            {workMode && (
                              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
                                {workMode}
                              </span>
                            )}
                            {job.category && (
                              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 capitalize hidden sm:inline-block">
                                {formatCategory(job.category)}
                              </span>
                            )}
                          </div>

                          <h3 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                            {job.title}
                          </h3>

                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 font-medium flex-wrap">
                            <span className="capitalize text-slate-700 font-semibold">
                              {job.companyProfile?.companyName ||
                                "Confidential"}
                            </span>
                            {job.companyProfile?.isVerified && (
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            )}
                            <span className="text-slate-300">•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {job.location?.city || "Remote"}
                              {job.location?.state
                                ? `, ${job.location.state}`
                                : ""}
                            </span>
                            {expDisplay && (
                              <>
                                <span className="text-slate-300">•</span>
                                <span className="flex items-center gap-1">
                                  <Briefcase className="w-3 h-3 text-slate-400" />
                                  {expDisplay}
                                </span>
                              </>
                            )}
                          </div>

                          {/* Skills Pills */}
                          {Array.isArray(job.skills) &&
                            job.skills.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                                {job.skills.slice(0, 3).map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[11px] font-medium px-2 py-0.5 bg-slate-50 text-slate-600 rounded-lg border border-slate-100"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {job.skills.length > 3 && (
                                  <span className="text-[11px] text-slate-400 font-medium">
                                    +{job.skills.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                        </div>
                      </div>

                      {/* Right Meta & Actions */}
                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 gap-3">
                        <div className="text-left md:text-right">
                          <div className="text-sm md:text-base font-bold text-slate-900">
                            {renderSalary(job)}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center md:justify-end gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>Saved {timeAgo(item.createdAt)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleShareJob(job, e)}
                            title="Share Job"
                            className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all cursor-pointer"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => handleRemoveSavedJob(job._id, e)}
                            disabled={isRemoving}
                            title="Remove from saved"
                            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                          >
                            {isRemoving ? (
                              <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedJob(job);
                              setIsApplyModalOpen(true);
                            }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                          >
                            Apply
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewJobDetails(job._id);
                            }}
                            className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span>View Job</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                }

                // Grid View Card
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={item._id}
                    onClick={() => handleViewJobDetails(job._id)}
                    className="group bg-white rounded-3xl p-6 border border-slate-100 hover:border-brand-200/90 hover:shadow-[0_12px_32px_rgba(37,99,235,0.09)] transition-all cursor-pointer relative flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Row: Logo & Unsave Button */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="relative">
                          <img
                            src={companyLogo}
                            alt={job.companyProfile?.companyName || "Company"}
                            className="w-14 h-14 rounded-2xl object-contain border border-slate-100 bg-white p-1.5 shadow-xs group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                job.companyProfile?.companyName || "C",
                              )}&background=2563eb&color=ffffff&bold=true`;
                            }}
                          />
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => handleShareJob(job, e)}
                            title="Share Job"
                            className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => handleRemoveSavedJob(job._id, e)}
                            disabled={isRemoving}
                            title="Remove from saved"
                            className="p-2 text-brand-600 bg-brand-50 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all cursor-pointer"
                          >
                            {isRemoving ? (
                              <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
                            ) : (
                              <BookmarkCheck className="w-4 h-4 fill-current" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-100/70 capitalize">
                          {job.jobType || "Full-time"}
                        </span>
                        {workMode && (
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
                            {workMode}
                          </span>
                        )}
                        {expDisplay && (
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-50 text-slate-500">
                            {expDisplay}
                          </span>
                        )}
                      </div>

                      {/* Title & Company */}
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1 mb-1">
                        {job.title}
                      </h3>

                      <p className="text-xs text-slate-500 font-medium mb-4 flex items-center gap-1.5">
                        <span className="text-slate-700 font-semibold capitalize">
                          {job.companyProfile?.companyName || "Confidential"}
                        </span>
                        {job.companyProfile?.isVerified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                        )}
                      </p>

                      {/* Meta Tags Row */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate capitalize">
                            {job.location?.city || "Remote"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate font-semibold text-slate-900">
                            {renderSalary(job)}
                          </span>
                        </div>
                      </div>

                      {/* Skills Tags */}
                      {Array.isArray(job.skills) && job.skills.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 mb-5">
                          {job.skills.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] font-medium px-2.5 py-0.5 bg-slate-50 text-slate-600 rounded-lg border border-slate-100"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 3 && (
                            <span className="text-[11px] text-slate-400 font-medium px-1">
                              +{job.skills.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2.5 mt-auto">
                      <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {timeAgo(item.createdAt)}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedJob(job);
                            setIsApplyModalOpen(true);
                          }}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                        >
                          Quick Apply
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewJobDetails(job._id);
                          }}
                          className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-1 cursor-pointer group/btn"
                        >
                          <span>View Job</span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Quick Apply Modal */}
      <ApplyJobModal
        isOpen={isApplyModalOpen}
        onClose={() => {
          setIsApplyModalOpen(false);
          setSelectedJob(null);
        }}
        job={selectedJob}
        onSubmit={handleApplySubmit}
      />
    </>
  );
}
