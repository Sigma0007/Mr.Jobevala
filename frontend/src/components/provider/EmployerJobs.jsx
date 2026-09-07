import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedJob, clearSelectedJob } from "../../Redux/Job/JobAction";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit3,
  Trash2,
  Plus,
  Eye,
  MapPin,
  Briefcase,
  CalendarDays,
  Banknote,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowUpDown,
  Filter,
  RefreshCw,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  SunMedium,
  Moon,
  Building2,
  Compass,
  AlertTriangle,
  X,
  SlidersHorizontal,
  Share2,
  Check,
} from "lucide-react";
import customerservice from "../../customer/customerservice";
import {
  workModeType,
  jobType as jobTypeOptions,
} from "../../Utility/utilites";

export default function EmployerJobs({ setActiveTab }) {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    closed: 0,
    totalApplicants: 0,
    totalVacancies: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, closed
  const [workModeFilter, setWorkModeFilter] = useState("all");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, applicants, salary_high, deadline

  // Modals state
  const [deleteModalJob, setDeleteModalJob] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [quickViewJob, setQuickViewJob] = useState(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchJobs = async (
    isManualRefresh = false,
    search = searchQuery,
    status = statusFilter,
    workMode = workModeFilter,
    jobType = jobTypeFilter,
    sort = sortBy,
  ) => {
    try {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const queryParams = new URLSearchParams();
      if (search?.trim()) queryParams.set("search", search.trim());
      if (status && status !== "all") queryParams.set("status", status);
      if (workMode && workMode !== "all") queryParams.set("workMode", workMode);
      if (jobType && jobType !== "all") queryParams.set("jobType", jobType);
      if (sort) queryParams.set("sortBy", sort);

      const queryStr = queryParams.toString()
        ? `?${queryParams.toString()}`
        : "";
      const res = await customerservice.getMyJobs(queryStr);

      if (res.success) {
        setJobs(res.data || []);
        if (res.stats) {
          setStats(res.stats);
        }
        if (isManualRefresh) {
          toast.success("Job listings refreshed");
        }
      } else {
        toast.error(res.message || "Failed to load jobs");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchJobs(
        false,
        searchQuery,
        statusFilter,
        workModeFilter,
        jobTypeFilter,
        sortBy,
      );
    }, 250);

    return () => clearTimeout(handler);
  }, [searchQuery, statusFilter, workModeFilter, jobTypeFilter, sortBy]);

  // Format Helper functions
  const formatCurrency = (amount, currency = "INR") => {
    if (amount === undefined || amount === null) return "0";
    if (amount >= 100000) {
      const inLakhs = amount / 100000;
      return `₹${inLakhs % 1 === 0 ? inLakhs : inLakhs.toFixed(1)}L`;
    }
    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  const formatText = (str) => {
    if (!str) return "";
    return str
      .replace(/_/g, " ")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const getRelativeTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return `${diffDays}d ago`;
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths}mo ago`;
  };

  const getDaysUntilDeadline = (dateStr) => {
    if (!dateStr) return null;
    const deadline = new Date(dateStr);
    const now = new Date();
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModalJob) return;

    try {
      setIsDeleting(true);
      const res = await customerservice.deleteJob(deleteModalJob._id);

      if (res.success) {
        toast.success("Job deleted successfully");
        setDeleteModalJob(null);
        fetchJobs(
          false,
          searchQuery,
          statusFilter,
          workModeFilter,
          jobTypeFilter,
          sortBy,
        );
      } else {
        toast.error(res.message || "Failed to delete job");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete job");
    } finally {
      setIsDeleting(false);
    }
  };

  const changeStatus = async (id, newStatus) => {
    try {
      setStatusUpdatingId(id);
      const res = await customerservice.updateJobStatus(id, {
        status: newStatus,
      });

      if (res.success) {
        toast.success(
          newStatus === "active"
            ? "Job reopened & accepting applicants 🎉"
            : "Job marked as closed",
        );

        if (quickViewJob && quickViewJob._id === id) {
          setQuickViewJob((prev) => ({ ...prev, status: newStatus }));
        }

        fetchJobs(
          false,
          searchQuery,
          statusFilter,
          workModeFilter,
          jobTypeFilter,
          sortBy,
        );
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleEdit = (job) => {
    dispatch(setSelectedJob(job));
    navigate(`/provider/jobs/${job._id}/edit`);
    if (setActiveTab) {
      setActiveTab("post-job");
    }
  };

  const handlePostNewJob = () => {
    dispatch(clearSelectedJob());
    if (setActiveTab) {
      setActiveTab("post-job");
    } else {
      navigate("/provider/jobs/create");
    }
  };

  const handleViewApplications = (job) => {
    dispatch(setSelectedJob(job));
    navigate(`/provider/jobs/${job._id}/applications`);
  };

  // Jobs are already filtered, sorted, and have metrics computed on the backend
  const filteredJobs = jobs;

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "all" ||
    workModeFilter !== "all" ||
    jobTypeFilter !== "all";

  const clearAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setWorkModeFilter("all");
    setJobTypeFilter("all");
    setSortBy("newest");
  };

  const getWorkModeBadge = (mode) => {
    switch (mode) {
      case "remote":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
          label: "Remote",
          dot: "bg-emerald-500",
        };
      case "hybrid":
        return {
          bg: "bg-purple-50 text-purple-700 border-purple-200/60",
          label: "Hybrid",
          dot: "bg-purple-500",
        };
      case "on-site":
      default:
        return {
          bg: "bg-blue-50 text-blue-700 border-blue-200/60",
          label: "On-site",
          dot: "bg-blue-500",
        };
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm animate-pulse">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-slate-200 rounded-lg"></div>
            <div className="h-4 w-64 bg-slate-100 rounded-lg"></div>
          </div>
          <div className="h-11 w-36 bg-slate-200 rounded-2xl"></div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm animate-pulse space-y-3"
            >
              <div className="h-4 w-20 bg-slate-100 rounded"></div>
              <div className="h-8 w-14 bg-slate-200 rounded-lg"></div>
            </div>
          ))}
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm animate-pulse space-y-4"
            >
              <div className="flex justify-between">
                <div className="h-6 w-48 bg-slate-200 rounded"></div>
                <div className="h-6 w-20 bg-slate-100 rounded-full"></div>
              </div>
              <div className="h-4 w-3/4 bg-slate-100 rounded"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="h-12 bg-slate-50 rounded-xl"></div>
                <div className="h-12 bg-slate-50 rounded-xl"></div>
                <div className="h-12 bg-slate-50 rounded-xl"></div>
                <div className="h-12 bg-slate-50 rounded-xl"></div>
              </div>
              <div className="h-10 bg-slate-100 rounded-xl pt-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 md:p-8 rounded-3xl text-white shadow-xl shadow-slate-900/10 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/2 -top-12 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-brand-200 text-xs font-medium mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-brand-300" />
              Recruitment Center
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Job Postings & Openings
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Manage your active listings, track candidate pipelines, and
              publish new job opportunities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchJobs(true)}
              disabled={refreshing}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-sm border border-white/10 transition-all active:scale-95 disabled:opacity-50"
              title="Refresh Listings"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>

            <button
              onClick={handlePostNewJob}
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-2xl shadow-lg shadow-brand-500/25 transition-all transform active:scale-95 group"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              <span>Post New Job</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Jobs */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-4 hover:border-slate-200 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Posts
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">
              {stats.total}
            </h3>
          </div>
        </div>

        {/* Active Jobs */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-4 hover:border-slate-200 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 relative">
            <CheckCircle2 className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Roles
            </p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-0.5">
              {stats.active}
            </h3>
          </div>
        </div>

        {/* Total Applicants */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-4 hover:border-slate-200 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Candidates
            </p>
            <h3 className="text-2xl font-bold text-indigo-600 mt-0.5">
              {stats.totalApplicants}
            </h3>
          </div>
        </div>

        {/* Vacancies */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-4 hover:border-slate-200 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Vacancies
            </p>
            <h3 className="text-2xl font-bold text-amber-600 mt-0.5">
              {stats.totalVacancies}
            </h3>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 md:p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, skill (React, Node), category, or city..."
              className="w-full pl-11 pr-10 py-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl shrink-0 self-start md:self-auto">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === "all"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === "active"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-emerald-700"
              }`}
            >
              Active ({stats.active})
            </button>
            <button
              onClick={() => setStatusFilter("closed")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === "closed"
                  ? "bg-slate-700 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Closed ({stats.closed})
            </button>
          </div>
        </div>

        {/* Secondary Filter Dropdowns & Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Work Mode Filter */}
            <select
              value={workModeFilter}
              onChange={(e) => setWorkModeFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
            >
              <option value="all">Work Mode: All</option>
              {workModeType.map((wm) => (
                <option key={wm.value} value={wm.value}>
                  {wm.label}
                </option>
              ))}
            </select>

            {/* Job Type Filter */}
            <select
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
            >
              <option value="all">Job Type: All</option>
              {jobTypeOptions.map((jt) => (
                <option key={jt.value} value={jt.value}>
                  {jt.label}
                </option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="applicants">Sort: Most Applicants</option>
              <option value="salary_high">Sort: Highest Salary</option>
              <option value="deadline">Sort: Deadline Approaching</option>
            </select>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-1.5 text-brand-600 hover:text-brand-700 hover:bg-brand-50 font-semibold rounded-xl transition-all flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Clear Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <span>
              Showing{" "}
              <strong className="text-slate-800">{filteredJobs.length}</strong>{" "}
              {filteredJobs.length === 1 ? "job" : "jobs"}
            </span>
          </div>
        </div>
      </div>

      {/* Job Cards */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 text-slate-400">
            <Briefcase className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            {hasActiveFilters ? "No matching jobs found" : "No jobs posted yet"}
          </h2>
          <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
            {hasActiveFilters
              ? "We couldn't find any job posts matching your search and filter criteria. Try adjusting your query or resetting filters."
              : "Start creating your first job post to reach top talent and manage incoming applicants easily."}
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            {hasActiveFilters ? (
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
              >
                Clear All Filters
              </button>
            ) : (
              <button
                onClick={handlePostNewJob}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Post Your First Job
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {filteredJobs.map((job) => {
            const workModeInfo = getWorkModeBadge(job.location?.workMode);
            const daysToDeadline = getDaysUntilDeadline(
              job.applicationDeadline,
            );
            const isDeadlineSoon =
              daysToDeadline !== null &&
              daysToDeadline <= 5 &&
              daysToDeadline >= 0;
            const isDeadlinePassed =
              daysToDeadline !== null && daysToDeadline < 0;

            return (
              <motion.div
                key={job._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white border border-slate-200/80 hover:border-brand-300 rounded-3xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgb(0,0,0,0.06)] transition-all group"
              >
                {/* Card Top Row: Title, Status, Category & Quick Actions */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    {/* Tags row */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                          job.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/70"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            job.status === "active"
                              ? "bg-emerald-500 animate-pulse"
                              : "bg-slate-400"
                          }`}
                        />
                        {job.status === "active" ? "Active" : "Closed"}
                      </span>

                      {/* Work Mode */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${workModeInfo.bg}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${workModeInfo.dot}`}
                        />
                        {workModeInfo.label}
                      </span>

                      {/* Category Badge */}
                      {job.category && (
                        <span className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-full border border-slate-200">
                          {formatText(job.category)}
                        </span>
                      )}

                      {/* SubCategory Badge */}
                      {job.subCategory && (
                        <span className="px-3 py-1 bg-brand-50/60 text-brand-700 text-xs font-medium rounded-full border border-brand-100">
                          {formatText(job.subCategory)}
                        </span>
                      )}
                    </div>

                    {/* Job Title */}
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                        {job.title}
                      </h2>
                    </div>

                    {/* Brief description snippet */}
                    {job.description && (
                      <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                        {job.description}
                      </p>
                    )}
                  </div>

                  {/* Header Action Buttons */}
                  <div className="flex items-center gap-2 self-end lg:self-start shrink-0">
                    <button
                      onClick={() => setQuickViewJob(job)}
                      className="p-2.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 border border-slate-200/80 hover:border-brand-200 rounded-2xl transition-all shadow-xs"
                      title="Quick Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleEdit(job)}
                      className="p-2.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 border border-slate-200/80 hover:border-brand-200 rounded-2xl transition-all shadow-xs"
                      title="Edit Job Details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteModalJob(job)}
                      className="p-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200/80 hover:border-red-200 rounded-2xl transition-all shadow-xs"
                      title="Delete Job"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Key Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-5 p-4 bg-slate-50/80 rounded-2xl border border-slate-100 text-xs">
                  {/* Location */}
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-500 border border-slate-200/60 shrink-0 shadow-2xs">
                      <MapPin className="w-4 h-4 text-brand-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase text-slate-400">
                        Location
                      </p>
                      <p
                        className="font-semibold text-slate-800 truncate"
                        title={job.location?.address || ""}
                      >
                        {job.location?.city || "Remote"}
                        {job.location?.state ? `, ${job.location.state}` : ""}
                      </p>
                    </div>
                  </div>

                  {/* Compensation */}
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-500 border border-slate-200/60 shrink-0 shadow-2xs">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase text-slate-400">
                        Salary Range
                      </p>
                      <p className="font-semibold text-slate-800 truncate">
                        {job.salary
                          ? `${formatCurrency(job.salary.min)} - ${formatCurrency(job.salary.max)}`
                          : "Not Disclosed"}
                      </p>
                    </div>
                  </div>

                  {/* Employment & Shift */}
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-500 border border-slate-200/60 shrink-0 shadow-2xs">
                      <Briefcase className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase text-slate-400">
                        Job Type & Shift
                      </p>
                      <p className="font-semibold text-slate-800 truncate capitalize">
                        {formatText(job.jobType)}
                        {job.jobShift ? ` • ${formatText(job.jobShift)}` : ""}
                      </p>
                    </div>
                  </div>

                  {/* Experience & Vacancies */}
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-500 border border-slate-200/60 shrink-0 shadow-2xs">
                      <GraduationCap className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase text-slate-400">
                        Experience & Openings
                      </p>
                      <p className="font-semibold text-slate-800 truncate">
                        {job.experience
                          ? `${job.experience.min}-${job.experience.max} yrs`
                          : "Any Exp"}{" "}
                        • {job.vacancies || 1}{" "}
                        {job.vacancies === 1 ? "Opening" : "Openings"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skills tags row */}
                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mb-5">
                    <span className="text-[11px] font-semibold text-slate-400 mr-1">
                      Required Skills:
                    </span>
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-200/60 hover:bg-slate-200/70 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer Action Bar */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Dates & Timeline info */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Posted {getRelativeTime(job.createdAt)}
                    </span>

                    {job.applicationDeadline && (
                      <>
                        <span>•</span>
                        <span
                          className={`flex items-center gap-1 font-medium ${
                            isDeadlinePassed
                              ? "text-red-500"
                              : isDeadlineSoon
                                ? "text-amber-600"
                                : "text-slate-500"
                          }`}
                        >
                          <CalendarDays className="w-3.5 h-3.5" />
                          Deadline:{" "}
                          {new Date(job.applicationDeadline).toLocaleDateString(
                            "en-IN",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                          {isDeadlineSoon && " (Closing Soon)"}
                          {isDeadlinePassed && " (Expired)"}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Interactive Action Buttons */}
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    {/* Close / Reopen Toggle */}
                    {job.status === "active" ? (
                      <button
                        onClick={() => changeStatus(job._id, "closed")}
                        disabled={statusUpdatingId === job._id}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all disabled:opacity-50"
                      >
                        {statusUpdatingId === job._id
                          ? "Updating..."
                          : "Close Job"}
                      </button>
                    ) : (
                      <button
                        onClick={() => changeStatus(job._id, "active")}
                        disabled={statusUpdatingId === job._id}
                        className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl border border-emerald-200 transition-all disabled:opacity-50"
                      >
                        {statusUpdatingId === job._id
                          ? "Updating..."
                          : "Reopen Job"}
                      </button>
                    )}

                    {/* View Applications Primary CTA */}
                    <button
                      onClick={() => handleViewApplications(job)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-md shadow-brand-500/20 transition-all"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>View Applications</span>
                      <span className="ml-1 px-1.5 py-0.5 bg-white/20 text-white rounded-full text-[10px] font-bold">
                        {job.applicantCount || 0}
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Delete Job Listing?
                </h3>
                <p className="text-sm text-slate-500">
                  Are you sure you want to permanently delete{" "}
                  <strong className="text-slate-800">
                    "{deleteModalJob.title}"
                  </strong>
                  ? This action will remove the listing and cannot be undone.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteModalJob(null)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-red-500/20 transition-all disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick View Job Modal */}
      <AnimatePresence>
        {quickViewJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 md:p-8 space-y-6"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        quickViewJob.status === "active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {quickViewJob.status === "active" ? "Active" : "Closed"}
                    </span>
                    <span className="text-xs text-slate-400">
                      ID: {quickViewJob._id}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {quickViewJob.title}
                  </h2>
                </div>

                <button
                  onClick={() => setQuickViewJob(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-2xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Overview Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Location & Mode
                  </span>
                  <span className="text-xs font-semibold text-slate-800 mt-1 block">
                    {quickViewJob.location?.city || "Remote"} (
                    {formatText(quickViewJob.location?.workMode)})
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Salary Range
                  </span>
                  <span className="text-xs font-semibold text-slate-800 mt-1 block">
                    {quickViewJob.salary
                      ? `${formatCurrency(quickViewJob.salary.min)} - ${formatCurrency(quickViewJob.salary.max)}`
                      : "Not specified"}
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Experience
                  </span>
                  <span className="text-xs font-semibold text-slate-800 mt-1 block">
                    {quickViewJob.experience
                      ? `${quickViewJob.experience.min} - ${quickViewJob.experience.max} Years`
                      : "Not specified"}
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Education & Qualification
                  </span>
                  <span className="text-xs font-semibold text-slate-800 mt-1 block">
                    {quickViewJob.education || "Any Degree"} (
                    {formatText(quickViewJob.qualification)})
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Job Timings & Shift
                  </span>
                  <span className="text-xs font-semibold text-slate-800 mt-1 block">
                    {quickViewJob.jobTimings || "Flexible"}{" "}
                    {quickViewJob.jobShift
                      ? `(${formatText(quickViewJob.jobShift)})`
                      : ""}
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Vacancies & Applicants
                  </span>
                  <span className="text-xs font-semibold text-slate-800 mt-1 block">
                    {quickViewJob.vacancies || 1} Openings •{" "}
                    {quickViewJob.applicantCount || 0} Applicants
                  </span>
                </div>
              </div>

              {/* Full Address if available */}
              {quickViewJob.location?.address && (
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/60 text-xs">
                  <span className="font-semibold text-blue-900 block mb-1">
                    Office / Work Address:
                  </span>
                  <p className="text-blue-700 leading-relaxed">
                    {quickViewJob.location.address}
                  </p>
                </div>
              )}

              {/* Skills */}
              {quickViewJob.skills && quickViewJob.skills.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                    Key Technical Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {quickViewJob.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Description */}
              {quickViewJob.description && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                    Job Description
                  </h4>
                  <div className="p-4 bg-slate-50 rounded-2xl text-slate-700 text-sm whitespace-pre-line leading-relaxed border border-slate-100">
                    {quickViewJob.description}
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setQuickViewJob(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all"
                >
                  Close Preview
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const j = quickViewJob;
                      setQuickViewJob(null);
                      handleEdit(j);
                    }}
                    className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold rounded-xl transition-all"
                  >
                    Edit Listing
                  </button>

                  <button
                    onClick={() => {
                      const j = quickViewJob;
                      setQuickViewJob(null);
                      handleViewApplications(j);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-brand-500/20"
                  >
                    <Users className="w-4 h-4" />
                    <span>
                      View Candidates ({quickViewJob.applicantCount || 0})
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
