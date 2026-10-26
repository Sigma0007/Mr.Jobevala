import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import customerservice from "../../customer/customerservice";
import { setJobApplications, setSelectedJob } from "../../Redux/Job/JobAction";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  statusConfig,
  workModeType,
  jobType,
  qualificationTypes,
  genderPreferenceTypes,
  jobShiftTypes,
  JOB_ROLES_CATEGORY_TYPE,
} from "../../Utility/utilites";
import {
  Briefcase,
  MapPin,
  Banknote,
  Users,
  CalendarDays,
  ArrowLeft,
  Mail,
  Phone,
  FileText,
  Loader2,
  GraduationCap,
  Clock,
  UserCheck,
  Tag,
  Building,
  Edit3,
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Bookmark,
  Calendar,
  DollarSign,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Download,
  Filter,
  RefreshCw,
  Building2,
  Compass,
  AlertCircle,
  Award,
  X,
} from "lucide-react";
import CandidateDetailsModal from "../Modals/CandidateDetailsModal";

export default function JobApplications() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedJob, jobApplications } = useSelector((state) => state.job);
  const { categoriesType } = useSelector((state) => state.dashboard);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingAppId, setUpdatingAppId] = useState(null);
  const [updatingStatusValue, setUpdatingStatusValue] = useState(null);

  // Search, Filter & Sort
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isJobDetailsExpanded, setIsJobDetailsExpanded] = useState(true);

  // Selected Candidate Modal
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  // Copied state tracking
  const [copiedId, setCopiedId] = useState(null);

  const fetchJobAndApplications = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const promises = [customerservice.getJobApplications(id)];
      if (!selectedJob || selectedJob._id !== id) {
        promises.push(customerservice.getMyJobById(id));
      }

      const [appsRes, jobRes] = await Promise.all(promises);

      if (appsRes?.success) {
        dispatch(setJobApplications(appsRes.data || []));
        if (isManualRefresh) {
          toast.success("Applications refreshed");
        }
      }
      if (jobRes?.success && jobRes.data) {
        dispatch(setSelectedJob(jobRes.data));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobAndApplications();
  }, [id, dispatch]);

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      setUpdatingAppId(appId);
      setUpdatingStatusValue(newStatus);
      const res = await customerservice.updateApplicationStatus(appId, {
        status: newStatus,
      });

      if (res.success) {
        toast.success(`Application marked as ${newStatus} 🎉`);
        const updatedApps = (jobApplications || []).map((app) =>
          app._id === appId ? { ...app, status: newStatus } : app,
        );
        dispatch(setJobApplications(updatedApps));

        if (selectedApplicant && selectedApplicant._id === appId) {
          setSelectedApplicant((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingAppId(null);
      setUpdatingStatusValue(null);
    }
  };

  const copyToClipboard = (text, type, appId) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(`${appId}-${type}`);
    toast.success(`Copied ${type} to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper formatting functions
  const formatCurrency = (amount, currency = "INR") => {
    if (amount === undefined || amount === null || amount === "") return null;
    const num = Number(amount);
    if (!isNaN(num) && num > 0) {
      if (num >= 100000) {
        const inLakhs = num / 100000;
        return `₹${inLakhs % 1 === 0 ? inLakhs : inLakhs.toFixed(1)} LPA`;
      }
      return `₹${num.toLocaleString("en-IN")}`;
    }
    return String(amount);
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
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  // Stats Calculations
  const stats = useMemo(() => {
    const list = jobApplications || [];
    const total = list.length;
    const pending = list.filter(
      (a) => (a.status || "pending").toLowerCase() === "pending",
    ).length;
    const shortlisted = list.filter((a) =>
      ["reviewed", "shortlisted", "interview"].includes(
        (a.status || "").toLowerCase(),
      ),
    ).length;
    const hired = list.filter(
      (a) => (a.status || "").toLowerCase() === "hired",
    ).length;
    const rejected = list.filter(
      (a) => (a.status || "").toLowerCase() === "rejected",
    ).length;

    return { total, pending, shortlisted, hired, rejected };
  }, [jobApplications]);

  // Filtering and Sorting Applicants
  const filteredApplicants = useMemo(() => {
    let list = jobApplications || [];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((app) => {
        const profile = app.userProfile || {};
        const user = app.user || {};
        const name = (profile.name || user.name || "").toLowerCase();
        const email = (user.email || "").toLowerCase();
        const phone = (profile.phone || user.phone || "").toLowerCase();
        const title = (profile.title || app.currentRole || "").toLowerCase();
        const company = (app.currentCompany || "").toLowerCase();
        const location = (
          app.location ||
          profile.location?.city ||
          ""
        ).toLowerCase();
        const skills = (profile.skills || []).map((s) => s.toLowerCase());
        const education = (profile.education || "").toLowerCase();

        return (
          name.includes(q) ||
          email.includes(q) ||
          phone.includes(q) ||
          title.includes(q) ||
          company.includes(q) ||
          location.includes(q) ||
          education.includes(q) ||
          skills.some((s) => s.includes(q))
        );
      });
    }

    if (statusFilter !== "all") {
      list = list.filter(
        (app) => (app.status || "pending").toLowerCase() === statusFilter,
      );
    }

    return [...list].sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      if (sortBy === "experience") {
        const expA = a.totalExperience ?? a.userProfile?.experience ?? 0;
        const expB = b.totalExperience ?? b.userProfile?.experience ?? 0;
        return expB - expA;
      }
      if (sortBy === "expected_ctc") {
        const ctcA = Number(a.expectedCTC) || 0;
        const ctcB = Number(b.expectedCTC) || 0;
        return ctcA - ctcB;
      }
      return 0;
    });
  }, [jobApplications, searchQuery, statusFilter, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center gap-4 bg-slate-50">
        <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
        <div className="text-slate-600 font-semibold text-sm">
          Loading job posting & applicants...
        </div>
      </div>
    );
  }

  if (!selectedJob) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center gap-4 bg-slate-50">
        <div className="p-8 bg-white border border-slate-200 rounded-3xl text-center max-w-md shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900 mb-1">
            Job Not Found
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            The requested job posting could not be found or has been removed.
          </p>
          <Link
            to="/provider/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const allCategories = categoriesType?.length
    ? categoriesType
    : JOB_ROLES_CATEGORY_TYPE;
  const currentCategory = allCategories.find(
    (c) => c.value === selectedJob.category,
  );
  const categoryLabel =
    currentCategory?.label || formatText(selectedJob.category);

  const currentSubCategory = currentCategory?.roles?.find(
    (r) => r.value === selectedJob.subCategory,
  );
  const subCategoryLabel =
    currentSubCategory?.label || formatText(selectedJob.subCategory);

  const qualificationLabel =
    qualificationTypes.find((q) => q.value === selectedJob.qualification)
      ?.label ||
    selectedJob.qualification ||
    "Not specified";

  const genderLabel =
    genderPreferenceTypes.find((g) => g.value === selectedJob.genderPreference)
      ?.label ||
    selectedJob.genderPreference ||
    "Any";

  const shiftLabel =
    jobShiftTypes.find((s) => s.value === selectedJob.jobShift)?.label ||
    selectedJob.jobShift ||
    "Day";

  const workModeLabel =
    workModeType.find((w) => w.value === selectedJob.location?.workMode)
      ?.label ||
    selectedJob.location?.workMode ||
    "On-site";

  const jobTypeLabel =
    jobType.find((j) => j.value === selectedJob.jobType)?.label ||
    formatText(selectedJob.jobType) ||
    "Full-time";

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation & Controls Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/provider/dashboard"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl text-xs font-semibold shadow-xs transition-all"
            >
              <ArrowLeft size={15} />
              Back to Dashboard
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-semibold text-slate-500 truncate max-w-xs sm:max-w-sm">
              {selectedJob.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchJobAndApplications(true)}
              disabled={refreshing}
              className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl transition-all shadow-xs disabled:opacity-50"
              title="Refresh Applications"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin text-brand-600" : ""}
              />
            </button>

            <Link
              to={`/provider/jobs/${selectedJob._id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-brand-600 rounded-2xl text-xs font-semibold shadow-xs transition-all"
            >
              <Edit3 size={15} />
              Edit Job Details
            </Link>
          </div>
        </div>

        {/* Complete Job Details Hero Section */}
        <div className="bg-white border border-slate-200/90 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden transition-all">
          {/* Main Title Row */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white relative">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                      selectedJob.status === "active"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : "bg-slate-500/20 text-slate-300 border-slate-500/30"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        selectedJob.status === "active"
                          ? "bg-emerald-400 animate-pulse"
                          : "bg-slate-400"
                      }`}
                    />
                    {selectedJob.status === "active"
                      ? "Active Listing"
                      : "Closed"}
                  </span>

                  {categoryLabel && (
                    <span className="px-3 py-1 bg-white/10 text-slate-200 border border-white/15 rounded-full text-xs font-medium backdrop-blur-xs">
                      {categoryLabel}
                    </span>
                  )}

                  {subCategoryLabel && (
                    <span className="px-3 py-1 bg-brand-500/20 text-brand-200 border border-brand-400/30 rounded-full text-xs font-medium backdrop-blur-xs">
                      {subCategoryLabel}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {selectedJob.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                  <span>
                    Posted:{" "}
                    <strong className="text-white">
                      {new Date(selectedJob.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </strong>
                  </span>
                  {selectedJob.applicationDeadline && (
                    <>
                      <span>•</span>
                      <span>
                        Deadline:{" "}
                        <strong className="text-white">
                          {new Date(
                            selectedJob.applicationDeadline,
                          ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </strong>
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Accordion toggle button */}
              <button
                onClick={() => setIsJobDetailsExpanded(!isJobDetailsExpanded)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-semibold border border-white/15 transition-all self-start lg:self-center"
              >
                {isJobDetailsExpanded ? (
                  <>
                    <ChevronUp size={16} /> Hide Job Info
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} /> View Full Job Info
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Collapsible Specs & Description */}
          <AnimatePresence>
            {isJobDetailsExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-6 sm:p-8 space-y-6"
              >
                {/* 4-col Specs Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                      <Briefcase size={14} className="text-brand-600" />
                      Experience
                    </div>
                    <p className="text-sm font-bold text-slate-800">
                      {selectedJob.experience
                        ? `${selectedJob.experience.min} - ${selectedJob.experience.max} Years`
                        : "Any Exp"}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                      <Banknote size={14} className="text-emerald-600" />
                      Salary Range
                    </div>
                    <p className="text-sm font-bold text-slate-800">
                      {selectedJob.salary
                        ? `${formatCurrency(selectedJob.salary.min)} - ${formatCurrency(selectedJob.salary.max)}`
                        : "Not Disclosed"}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                      <Building size={14} className="text-purple-600" />
                      Type & Mode
                    </div>
                    <p className="text-sm font-bold text-slate-800 capitalize truncate">
                      {jobTypeLabel} ({workModeLabel})
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                      <Users size={14} className="text-amber-600" />
                      Openings
                    </div>
                    <p className="text-sm font-bold text-slate-800">
                      {selectedJob.vacancies || 1}{" "}
                      {selectedJob.vacancies === 1 ? "Vacancy" : "Vacancies"}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                      <GraduationCap size={14} className="text-teal-600" />
                      Education
                    </div>
                    <p className="text-sm font-bold text-slate-800 capitalize truncate">
                      {selectedJob.education || qualificationLabel}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                      <Clock size={14} className="text-indigo-600" />
                      Shift & Timings
                    </div>
                    <p className="text-sm font-bold text-slate-800 capitalize truncate">
                      {shiftLabel} Shift{" "}
                      {selectedJob.jobTimings
                        ? `(${selectedJob.jobTimings})`
                        : ""}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 md:col-span-2">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                      <MapPin size={14} className="text-red-500" />
                      Workplace Location
                    </div>
                    <p
                      className="text-sm font-bold text-slate-800 truncate"
                      title={selectedJob.location?.address || ""}
                    >
                      {selectedJob.location?.city}
                      {selectedJob.location?.state
                        ? `, ${selectedJob.location.state}`
                        : ""}
                      {selectedJob.location?.address
                        ? ` • ${selectedJob.location.address}`
                        : ""}
                    </p>
                  </div>
                </div>

                {/* Description & Skills */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                  <div className="md:col-span-2 space-y-2">
                    <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                      Role Description
                    </h3>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                      {selectedJob.description || "No description provided."}
                    </p>
                  </div>

                  {selectedJob.skills && selectedJob.skills.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                        Required Tech Stack
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedJob.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Applications Header & Pipeline KPI Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Applicants
              </span>
              <Users className="w-5 h-5 text-brand-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">
              {stats.total}
            </h3>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Pending Review
              </span>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-amber-600 mt-2">
              {stats.pending}
            </h3>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                In Pipeline
              </span>
              <Bookmark className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-purple-600 mt-2">
              {stats.shortlisted}
            </h3>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Hired Candidates
              </span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-600 mt-2">
              {stats.hired}
            </h3>
          </div>
        </div>

        {/* Candidate Search & Filter Toolbar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidates by name, email, phone, skill, role, education..."
                className="w-full pl-11 pr-10 py-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="newest">Applied: Newest First</option>
                <option value="oldest">Applied: Oldest First</option>
                <option value="experience">Experience: High to Low</option>
                <option value="expected_ctc">Expected CTC: Low to High</option>
              </select>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100 text-xs">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                statusFilter === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              All Applicants ({stats.total})
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                statusFilter === "pending"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setStatusFilter("reviewed")}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                statusFilter === "reviewed"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-purple-50 text-purple-700 hover:bg-purple-100"
              }`}
            >
              Reviewed
            </button>
            <button
              onClick={() => setStatusFilter("shortlisted")}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                statusFilter === "shortlisted"
                  ? "bg-yellow-600 text-white shadow-xs"
                  : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
              }`}
            >
              Shortlisted
            </button>
            <button
              onClick={() => setStatusFilter("interview")}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                statusFilter === "interview"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-amber-50 text-amber-700 hover:bg-amber-100"
              }`}
            >
              Interview
            </button>
            <button
              onClick={() => setStatusFilter("hired")}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                statusFilter === "hired"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              Hired ({stats.hired})
            </button>
            <button
              onClick={() => setStatusFilter("rejected")}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                statusFilter === "rejected"
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-red-50 text-red-700 hover:bg-red-100"
              }`}
            >
              Rejected ({stats.rejected})
            </button>

            {/* Clear filter shortcut */}
            {(searchQuery || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="ml-auto px-3 py-1.5 text-brand-600 hover:bg-brand-50 font-semibold rounded-xl flex items-center gap-1 transition-all"
              >
                <X size={13} /> Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Candidate Applications List */}
        {filteredApplicants.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 text-slate-400">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              {searchQuery || statusFilter !== "all"
                ? "No matching candidates found"
                : "No applications received yet"}
            </h3>
            <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
              {searchQuery || statusFilter !== "all"
                ? "Try searching with another keyword or reset the status filters to view all applicants."
                : "When candidates apply for this job posting, their full profiles, contact details, resumes, and cover letters will appear here."}
            </p>
            {(searchQuery || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="mt-5 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
              >
                Clear Search & Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredApplicants.map((app) => {
              const profile = app.userProfile || {};
              const user = app.user || {};

              const candidateName = profile.name || user.name || "Candidate";
              const candidateEmail = user.email || profile.email;
              const candidatePhone = profile.phone || user.phone;
              const candidateTitle =
                profile.title || app.currentRole || "Candidate";
              const candidateImage = profile.profileImage
                ? import.meta.env.VITE_API_URL + profile.profileImage
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(candidateName)}&background=eff6ff&color=2563eb&bold=true`;

              const currentStatus = (app.status || "pending").toLowerCase();
              const config =
                statusConfig[currentStatus] || statusConfig.pending;
              const StatusIcon = config.icon;

              const totalExp = app.totalExperience ?? profile.experience ?? "0";

              return (
                <motion.div
                  key={app._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white border border-slate-200/80 hover:border-brand-200 rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgb(0,0,0,0.06)] transition-all space-y-6"
                >
                  {/* Top Candidate Header Row */}
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-100">
                    <div className="flex items-start gap-4 sm:gap-5">
                      <img
                        src={candidateImage}
                        alt={candidateName}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-100 shadow-md shrink-0"
                      />
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                            {candidateName}
                          </h3>
                          {candidateTitle && (
                            <span className="px-3 py-1 bg-brand-50 text-brand-700 border border-brand-100 text-xs font-semibold rounded-full">
                              {candidateTitle}
                            </span>
                          )}
                        </div>

                        {/* Demographics / Additional Info */}
                        <div className="flex flex-wrap items-center gap-x-3 text-xs text-slate-400 pt-1">
                          {profile.gender && (
                            <span className="capitalize">
                              Gender: {profile.gender}
                            </span>
                          )}
                          {profile.dob && (
                            <>
                              <span>•</span>
                              <span>
                                Born:{" "}
                                {new Date(profile.dob).toLocaleDateString(
                                  "en-IN",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Pill & Applied Date */}
                    <div className="flex flex-col sm:items-end gap-2 self-start sm:self-auto shrink-0">
                      <span
                        className={`px-4 py-1.5 text-xs font-bold rounded-full border flex items-center gap-1.5 shadow-2xs ${config.color}`}
                      >
                        {StatusIcon && <StatusIcon size={14} />}
                        {config.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        Applied {getRelativeTime(app.createdAt)} (
                        {new Date(app.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        )
                      </span>
                    </div>
                  </div>

                  {/* Candidate Professional Highlights Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-100 text-xs">
                    {/* Experience */}
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                        Experience
                      </span>
                      <span className="font-bold text-slate-800">
                        {totalExp} {Number(totalExp) === 1 ? "Year" : "Years"}
                      </span>
                    </div>

                    {/* Current Employment */}
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                        Current Company
                      </span>
                      <span
                        className="font-bold text-slate-800 truncate block"
                        title={app.currentCompany || "N/A"}
                      >
                        {app.currentCompany || "Not Employed"}
                      </span>
                    </div>

                    {/* Compensation */}
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                        Current CTC
                      </span>
                      <span className="font-bold text-slate-800">
                        {formatCurrency(app.currentCTC) || "Not Disclosed"}
                      </span>
                    </div>

                    {/* Expected CTC */}
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                        Expected CTC
                      </span>
                      <span className="font-bold text-emerald-600">
                        {formatCurrency(app.expectedCTC) || "Negotiable"}
                      </span>
                    </div>

                    {/* Notice Period */}
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                        Notice Period
                      </span>
                      <span className="font-bold text-slate-800">
                        {app.noticePeriod || "Immediate"}
                      </span>
                    </div>

                    {/* Candidate Location */}
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                        Candidate City
                      </span>
                      <span
                        className="font-bold text-slate-800 truncate block"
                        title={
                          app.location ||
                          profile.location?.address ||
                          profile.location?.city ||
                          "Not specified"
                        }
                      >
                        {app.location ||
                          profile.location?.city ||
                          "Remote / Unspecified"}
                      </span>
                    </div>
                  </div>

                  {/* Education & Bio snippet if present */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.education && (
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                        <GraduationCap className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">
                            Education
                          </span>
                          <span className="text-xs font-semibold text-slate-800">
                            {profile.education}
                          </span>
                        </div>
                      </div>
                    )}

                    {profile.location?.workMode && (
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                        <Building2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">
                            Preferred Work Mode
                          </span>
                          <span className="text-xs font-semibold text-slate-800 capitalize">
                            {profile.location.workMode}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Candidate Bio */}
                  {profile.bio && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                      <span className="font-bold text-slate-700 block mb-1">
                        Professional Summary:
                      </span>
                      <p className="text-slate-600 leading-relaxed">
                        {profile.bio}
                      </p>
                    </div>
                  )}

                  {/* Skills tags */}
                  {profile.skills && profile.skills.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold uppercase text-slate-400 tracking-wider block">
                        Applicant Skills:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200/70 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200/70 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cover Letter Section */}
                  {app.coverLetter && (
                    <div className="p-4 bg-brand-50/40 rounded-2xl border border-brand-100/60 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase text-brand-900 flex items-center gap-1.5 tracking-wider">
                          <FileText size={14} className="text-brand-600" />
                          Candidate Note & Cover Letter
                        </h4>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              app.coverLetter,
                              "Cover Letter",
                              app._id,
                            )
                          }
                          className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                        >
                          <Copy size={12} />
                          Copy Note
                        </button>
                      </div>
                      <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {app.coverLetter}
                      </p>
                    </div>
                  )}

                  {/* Action Pipeline: Status Updating Buttons + View Profile Modal */}
                  <div className="pt-5 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase text-slate-400 mr-1">
                        Move Candidate:
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 flex-1 lg:justify-end">
                      {Object.keys(statusConfig).map((actionStatus) => {
                        const btnConfig = statusConfig[actionStatus];
                        const isCurrentStatus = currentStatus === actionStatus;
                        const isUpdatingThis =
                          updatingAppId === app._id &&
                          updatingStatusValue === actionStatus;
                        const isDisabled = updatingAppId === app._id;

                        return (
                          <button
                            key={actionStatus}
                            onClick={() =>
                              handleUpdateStatus(app._id, actionStatus)
                            }
                            disabled={isDisabled}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                              isCurrentStatus
                                ? `${btnConfig.color} ring-2 ring-brand-500/30 font-bold shadow-xs`
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {isUpdatingThis ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              btnConfig.name
                            )}
                          </button>
                        );
                      })}

                      {/* Modal trigger */}
                      <button
                        onClick={() => setSelectedApplicant(app)}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-500/20 transition-all ml-1"
                      >
                        <Eye size={14} />
                        Full Profile
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Candidate Full Profile Modal */}
      {selectedApplicant && (
        <CandidateDetailsModal
          applicant={selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          onStatusChange={(appId, newStatus) =>
            handleUpdateStatus(appId, newStatus)
          }
          updatingStatus={updatingStatusValue}
        />
      )}
    </div>
  );
}
