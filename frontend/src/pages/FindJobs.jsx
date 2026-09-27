import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  MapPin,
  Briefcase,
  Filter,
  DollarSign,
  Clock,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Share2,
  Calendar,
  LayoutGrid,
  List,
  ShieldCheck,
  X,
  Flame,
  Sun,
  Moon,
  Layers,
  SlidersHorizontal,
  RotateCcw,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import customerservice from "../customer/customerservice";
import CommonFilters from "../components/CommonFilters";
import ApplyJobModal from "../components/Modals/ApplyJobModal";
import { JOB_ROLES_CATEGORY_TYPE } from "../Utility/utilites";
import { useSelector } from "react-redux";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.02 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 24 },
  },
};

// Formatting Helpers
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
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const formatDeadline = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Expired";
  if (diffDays === 0) return "Closes today";
  if (diffDays === 1) return "Closes tomorrow";
  if (diffDays <= 7) return `Closes in ${diffDays} days`;
  return `Ends ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
};

const formatSalaryRange = (salary) => {
  if (!salary) return "Salary Negotiable";
  const { min, max, currency = "INR" } = salary;
  const symbol =
    currency === "INR" || !currency ? "₹" : currency === "USD" ? "$" : currency;

  const formatVal = (val) => {
    const num = Number(val);
    if (isNaN(num) || num <= 0) return null;
    if (num >= 100000) {
      const lpa = (num / 100000).toFixed(num % 100000 === 0 ? 0 : 1);
      return `${symbol}${lpa} LPA`;
    }
    if (num >= 1000) {
      return `${symbol}${(num / 1000).toFixed(0)}k/mo`;
    }
    return `${symbol}${num.toLocaleString("en-IN")}`;
  };

  const formattedMin = formatVal(min);
  const formattedMax = formatVal(max);

  if (formattedMin && formattedMax) {
    if (min === max) return formattedMin;
    return `${formattedMin} - ${formattedMax}`;
  }
  if (formattedMax) return `Up to ${formattedMax}`;
  if (formattedMin) return `From ${formattedMin}`;
  return "Salary Negotiable";
};

const formatExperience = (exp) => {
  if (!exp) return null;
  if (typeof exp === "object") {
    if (
      exp.min !== undefined &&
      exp.max !== undefined &&
      exp.min !== null &&
      exp.max !== null
    ) {
      if (exp.min === 0 && exp.max === 0) return "Fresher / 0 yrs";
      return `${exp.min} - ${exp.max} yrs exp`;
    }
    if (exp.min !== undefined && exp.min !== null) return `${exp.min}+ yrs exp`;
    if (exp.max !== undefined && exp.max !== null)
      return `Up to ${exp.max} yrs exp`;
  }
  if (typeof exp === "number" || typeof exp === "string") {
    return `${exp} yrs exp`;
  }
  return null;
};

const formatCategoryName = (catValue, categoriesType = []) => {
  if (!catValue) return "";
  const found = categoriesType.find((c) => c.value === catValue);
  if (found) return found.label || found.title;
  const foundUtil = JOB_ROLES_CATEGORY_TYPE.find((c) => c.value === catValue);
  if (foundUtil) return foundUtil.label;
  return catValue
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const formatRoleName = (roleValue, categoriesType = []) => {
  if (!roleValue) return "";
  for (const cat of categoriesType) {
    const foundRole = (cat.roles || []).find((r) => r.value === roleValue);
    if (foundRole) return foundRole.label;
  }
  return roleValue
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const getWorkModeConfig = (mode) => {
  switch (mode?.toLowerCase()) {
    case "remote":
      return {
        label: "Remote",
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
        dot: "bg-emerald-500",
      };
    case "hybrid":
      return {
        label: "Hybrid",
        badge: "bg-amber-50 text-amber-700 border-amber-200/70",
        dot: "bg-amber-500",
      };
    case "on-site":
    case "onsite":
    default:
      return {
        label: "On-site",
        badge: "bg-blue-50 text-blue-700 border-blue-200/70",
        dot: "bg-blue-500",
      };
  }
};

const getInitials = (name) => {
  if (!name) return "CO";
  return name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

export default function FindJobs() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { categoriesType = [] } = useSelector((state) => state.dashboard);
  const { user } = useSelector((state) => state.auth);

  // Extract popular roles from categoriesType
  const popularRoles = React.useMemo(() => {
    if (!Array.isArray(categoriesType)) return [];
    const popular = [];
    categoriesType.forEach((cat) => {
      if (Array.isArray(cat?.roles)) {
        cat.roles.forEach((role) => {
          if (role?.is_popular) {
            popular.push({
              label: role.label,
              value: role.value,
              categoryValue: cat.value,
              categoryLabel: cat.label || cat.title,
            });
          }
        });
      }
    });
    return popular;
  }, [categoriesType]);

  // State Management
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || searchParams.get("searchQuery") || ""
  );
  const [locationQuery, setLocationQuery] = useState(
    searchParams.get("location") || searchParams.get("locationQuery") || ""
  );
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get("category") ? [searchParams.get("category")] : []
  );
  const [selectedSubCategories, setSelectedSubCategories] = useState(
    searchParams.get("subCategory") ? [searchParams.get("subCategory")] : []
  );
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState(
    searchParams.get("jobType") ? [searchParams.get("jobType")] : []
  );
  const [selectedModes, setSelectedModes] = useState(
    searchParams.get("workMode") ? [searchParams.get("workMode")] : []
  );
  const [selectedSalaryRanges, setSelectedSalaryRanges] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"

  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [savingJobId, setSavingJobId] = useState(null);

  // Modal States
  const [applyModalJob, setApplyModalJob] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Fetch initial saved jobs to reflect bookmark states
  useEffect(() => {
    const fetchSavedJobsList = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await customerservice.getSavedJobs();
        if (res?.success && Array.isArray(res.data)) {
          const ids = new Set(
            res.data.map((item) => (item.job?._id ? item.job._id : item._id)),
          );
          setSavedJobIds(ids);
        }
      } catch (err) {
        console.error("Error fetching saved job IDs:", err);
      }
    };
    if (user?.role === "user") {
      fetchSavedJobsList();
    }
  }, []);

  // Fetch Jobs with dynamic query debounce
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchQuery.trim())
          queryParams.append("searchQuery", searchQuery.trim());
        if (locationQuery.trim())
          queryParams.append("locationQuery", locationQuery.trim());
        if (selectedCategories.length > 0)
          queryParams.append("category", selectedCategories.join(","));
        if (selectedSubCategories.length > 0)
          queryParams.append("subCategory", selectedSubCategories.join(","));
        if (selectedExperience.length > 0)
          queryParams.append("experience", selectedExperience.join(","));
        if (selectedTypes.length > 0)
          queryParams.append("jobType", selectedTypes.join(","));
        if (selectedModes.length > 0)
          queryParams.append("workMode", selectedModes.join(","));
        if (selectedSalaryRanges.length > 0)
          queryParams.append("salaryRange", selectedSalaryRanges.join(","));

        const qs = queryParams.toString();
        const response = await customerservice.getAllJobs(qs ? `?${qs}` : "");
        if (response?.success && Array.isArray(response.data)) {
          setJobsData(response.data);
        } else {
          setJobsData([]);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchJobs();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    searchQuery,
    locationQuery,
    selectedCategories,
    selectedSubCategories,
    selectedExperience,
    selectedTypes,
    selectedModes,
    selectedSalaryRanges,
  ]);

  // Filter Handlers
  const handleFilterChange = (setter, value) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setLocationQuery("");
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setSelectedExperience([]);
    setSelectedTypes([]);
    setSelectedModes([]);
    setSelectedSalaryRanges([]);
  };

  // Toggle Save Job
  const handleToggleSaveJob = async (jobId, e) => {
    if (e) e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to save jobs");
      navigate("/login");
      return;
    }

    setSavingJobId(jobId);
    const isAlreadySaved = savedJobIds.has(jobId);

    try {
      if (isAlreadySaved) {
        const res = await customerservice.removeSavedJob(jobId);
        if (res?.success) {
          setSavedJobIds((prev) => {
            const next = new Set(prev);
            next.delete(jobId);
            return next;
          });
          toast.success("Job removed from saved list");
        } else {
          toast.error(res?.message || "Failed to remove saved job");
        }
      } else {
        const res = await customerservice.saveJob(jobId);
        if (res?.success) {
          setSavedJobIds((prev) => new Set(prev).add(jobId));
          toast.success("Job bookmarked successfully! 📌");
        } else {
          toast.error(res?.message || "Failed to save job");
        }
      }
    } catch (err) {
      console.error("Error toggling saved job:", err);
      toast.error("An error occurred while bookmarking job");
    } finally {
      setSavingJobId(null);
    }
  };

  // Share Job Handler
  const handleShareJob = (job, e) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}/jobs/${job._id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Job link copied to clipboard! 📋");
    } else {
      toast.success(`Share URL: ${shareUrl}`);
    }
  };

  // Quick Apply Handler
  const handleOpenApplyModal = (job, e) => {
    if (e) e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to apply for this job");
      navigate("/login");
      return;
    }
    setApplyModalJob(job);
    setIsApplyModalOpen(true);
  };

  const handleApplySubmit = async (formData) => {
    try {
      const response = await customerservice.createApplication(formData);
      if (response?.success) {
        toast.success("Application Submitted Successfully! 🎉");
        setIsApplyModalOpen(false);
      } else {
        toast.error(response?.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting job application:", error);
      toast.error("An error occurred while applying for job");
    }
  };

  const totalActiveFiltersCount =
    (searchQuery.trim() ? 1 : 0) +
    (locationQuery.trim() ? 1 : 0) +
    selectedCategories.length +
    selectedSubCategories.length +
    selectedExperience.length +
    selectedModes.length +
    selectedTypes.length +
    selectedSalaryRanges.length;

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#FAF8F5] font-sans text-navy-950 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-brand-200/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-navy-200/25 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Page Hero Header */}
        <div className="mb-8 md:mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-pulse" />
            <span>Discover Verified Career Opportunities</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy-950 tracking-tight leading-[1.15]">
            Find Your Next{" "}
            <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-navy-800 bg-clip-text text-transparent">
              Dream Job
            </span>
          </h1>
          <p className="mt-2 text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl font-medium">
            Browse through verified high-growth roles, competitive salaries, and direct recruiter openings.
          </p>
        </div>

        {/* Search & Location Bar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/80 shadow-[0_10px_35px_rgb(0,0,0,0.04)] mb-6 transition-all">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Title / Keywords Search */}
            <div className="flex-1 flex items-center gap-3 px-4 sm:px-5 py-3.5 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-200/60 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
              <Search className="w-5 h-5 text-blue-600 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Job title, role, skills (e.g. React, Node.js)..."
                className="w-full bg-transparent border-none focus:outline-none text-sm sm:text-base text-slate-900 placeholder-slate-400 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Location Query */}
            <div className="flex-1 flex items-center gap-3 px-4 sm:px-5 py-3.5 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-200/60 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
              <MapPin className="w-5 h-5 text-rose-500 shrink-0" />
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="City, state, or 'Remote'..."
                className="w-full bg-transparent border-none focus:outline-none text-sm sm:text-base text-slate-900 placeholder-slate-400 font-medium"
              />
              {locationQuery && (
                <button
                  onClick={() => setLocationQuery("")}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Popular Subcategories / Roles Chips */}
          {popularRoles.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 text-xs custom-scrollbar">
              <span className="text-slate-400 font-bold shrink-0 flex items-center gap-1 pl-1">
                <Layers className="w-3.5 h-3.5" /> Popular:
              </span>
              {popularRoles.map((role) => {
                const isSelected = selectedSubCategories.includes(role.value);
                return (
                  <button
                    key={role.value}
                    onClick={() =>
                      handleFilterChange(setSelectedSubCategories, role.value)
                    }
                    className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 flex items-center gap-1.5 border ${
                      isSelected
                        ? "bg-blue-50 text-blue-700 border-blue-200 font-bold"
                        : "bg-slate-50 text-slate-600 border-slate-200/70 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <span>{role.label}</span>
                    {isSelected && <Check className="w-3 h-3 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="w-full flex items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-slate-200/80 shadow-xs font-semibold text-slate-700 active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <span>Filter Job Postings</span>
              {totalActiveFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">
                  {totalActiveFiltersCount}
                </span>
              )}
            </div>
            <ChevronDown
              className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                isMobileFilterOpen ? "rotate-180 text-blue-600" : ""
              }`}
            />
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-8 items-start">
          {/* Left Sidebar - CommonFilters */}
          <div className="w-full lg:w-80 shrink-0">
            <CommonFilters
              searchTerm={searchQuery}
              setSearchTerm={setSearchQuery}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedExperience={selectedExperience}
              setSelectedExperience={setSelectedExperience}
              selectedWorkModes={selectedModes}
              setSelectedWorkModes={setSelectedModes}
              selectedJobTypes={selectedTypes}
              setSelectedJobTypes={setSelectedTypes}
              selectedSalaryRanges={selectedSalaryRanges}
              setSelectedSalaryRanges={setSelectedSalaryRanges}
              handleFilterChange={handleFilterChange}
              clearAllFilters={clearAllFilters}
              className={`${isMobileFilterOpen ? "block" : "hidden"} lg:block`}
            />
          </div>

          {/* Right Area - Job Listings */}
          <div className="flex-1 min-w-0 w-full">
            {/* Control Bar: Total count, active filters, view switch, sorting */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.02)] mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      {loading ? (
                        <span className="text-slate-400">
                          Loading Positions...
                        </span>
                      ) : (
                        <>
                          <span className="text-blue-600 font-extrabold text-lg">
                            {jobsData.length}
                          </span>{" "}
                          Jobs Available
                        </>
                      )}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Verified opportunities curated for qualified applicants
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
                  {/* Grid / List Switcher */}
                  <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/70">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-lg transition-all ${
                        viewMode === "grid"
                          ? "bg-white text-blue-600 shadow-xs font-bold"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                      title="Grid View"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded-lg transition-all ${
                        viewMode === "list"
                          ? "bg-white text-blue-600 shadow-xs font-bold"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                      title="List View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filter Pills Bar */}
              {totalActiveFiltersCount > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" /> Filters:
                  </span>

                  {searchQuery.trim() && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                      Query: "{searchQuery}"
                      <button
                        onClick={() => setSearchQuery("")}
                        className="hover:text-blue-900 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {locationQuery.trim() && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
                      Location: "{locationQuery}"
                      <button
                        onClick={() => setLocationQuery("")}
                        className="hover:text-rose-900 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedCategories.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200"
                    >
                      {formatCategoryName(cat, categoriesType) || cat}
                      <button
                        onClick={() =>
                          setSelectedCategories((prev) =>
                            prev.filter((c) => c !== cat),
                          )
                        }
                        className="hover:text-slate-900 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {selectedSubCategories.map((subCat) => (
                    <span
                      key={subCat}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200"
                    >
                      Role: {formatRoleName(subCat, categoriesType) || subCat}
                      <button
                        onClick={() =>
                          setSelectedSubCategories((prev) =>
                            prev.filter((s) => s !== subCat),
                          )
                        }
                        className="hover:text-blue-900 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {selectedModes.map((mode) => (
                    <span
                      key={mode}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 capitalize"
                    >
                      {mode}
                      <button
                        onClick={() =>
                          setSelectedModes((prev) =>
                            prev.filter((m) => m !== mode),
                          )
                        }
                        className="hover:text-slate-900 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {selectedTypes.map((type) => (
                    <span
                      key={type}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 capitalize"
                    >
                      {type}
                      <button
                        onClick={() =>
                          setSelectedTypes((prev) =>
                            prev.filter((t) => t !== type),
                          )
                        }
                        className="hover:text-slate-900 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {selectedExperience.map((exp) => (
                    <span
                      key={exp}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200"
                    >
                      Exp: {exp} yrs
                      <button
                        onClick={() =>
                          setSelectedExperience((prev) =>
                            prev.filter((e) => e !== exp),
                          )
                        }
                        className="hover:text-slate-900 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  <button
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-bold ml-auto pl-2"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset All
                  </button>
                </div>
              )}
            </div>

            {/* Job Grid / List Section */}
            {loading ? (
              /* Loading Skeletons */
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-5"
                    : "space-y-4"
                }
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-xs animate-pulse space-y-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-slate-200 rounded-2xl shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-slate-200 rounded-md w-3/4" />
                        <div className="h-4 bg-slate-100 rounded-md w-1/2" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-slate-100 rounded-lg w-20" />
                      <div className="h-6 bg-slate-100 rounded-lg w-24" />
                      <div className="h-6 bg-slate-100 rounded-lg w-16" />
                    </div>
                    <div className="h-10 bg-slate-50 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : jobsData.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-5"
                    : "space-y-4"
                }
              >
                {jobsData.map((job) => {
                  const isSaved = savedJobIds.has(job._id);
                  const isSaving = savingJobId === job._id;
                  const workModeConfig = getWorkModeConfig(
                    job.location?.workMode,
                  );
                  const companyName =
                    job.companyProfile?.companyName ||
                    job.companyProfile?.name ||
                    "Verified Employer";
                  const deadlineStatus = formatDeadline(
                    job.applicationDeadline,
                  );

                  // Extract benefits & match
                  const benefitsList = Array.isArray(
                    job.companyProfile?.benefits,
                  )
                    ? job.companyProfile.benefits
                    : [];

                  return (
                    <motion.div
                      variants={itemVariants}
                      key={job._id}
                      onClick={() => navigate(`/jobs/${job._id}`)}
                      className={`bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgb(37,99,235,0.08)] hover:border-blue-300/80 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col justify-between ${
                        viewMode === "list" ? "p-5 sm:p-6" : "p-5 sm:p-6"
                      }`}
                    >
                      {/* Top Accent Strip */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Main Card Content */}
                      <div>
                        {/* Header: Company Logo, Job Title, Bookmark & Share Buttons */}
                        <div className="flex items-start gap-4 mb-4">
                          {/* Company Avatar / Logo */}
                          <div className="relative shrink-0">
                            {job.companyProfile?.logo ? (
                              <img
                                src={
                                  import.meta.env.VITE_API_URL +
                                  job.companyProfile.logo
                                }
                                alt={companyName}
                                className="w-14 h-14 rounded-2xl object-contain p-1.5 border border-slate-100 shadow-xs bg-white group-hover:scale-105 transition-transform"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=3b82f6&color=fff&bold=true`;
                                }}
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-lg flex items-center justify-center shadow-xs border border-blue-500/30 group-hover:scale-105 transition-transform">
                                {getInitials(companyName)}
                              </div>
                            )}
                            <div
                              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-xs"
                              title="Verified Employer"
                            >
                              <ShieldCheck className="w-3 h-3 text-white" />
                            </div>
                          </div>

                          {/* Title & Company Info */}
                          <div className="flex-1 min-w-0 pr-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors capitalize leading-snug line-clamp-1">
                                {job.title}
                              </h3>
                              {job.vacancies && job.vacancies > 1 && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 text-[11px] font-bold shrink-0">
                                  <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                                  {job.vacancies} Openings
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mt-1 text-slate-500 flex-wrap">
                              <span className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors">
                                {companyName}
                              </span>
                              {job.companyProfile?.companySize && (
                                <>
                                  <span className="text-slate-300">•</span>
                                  <span className="text-xs text-slate-400 font-medium">
                                    {job.companyProfile.companySize}+ employees
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons: Save & Share */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={(e) => handleShareJob(job, e)}
                              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                              title="Share Job"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => handleToggleSaveJob(job._id, e)}
                              disabled={isSaving}
                              className={`p-2 rounded-xl transition-all ${
                                isSaved
                                  ? "text-blue-600 bg-blue-50 border border-blue-200"
                                  : "text-slate-400 hover:text-blue-600 hover:bg-blue-50/70"
                              }`}
                              title={isSaved ? "Saved Job" : "Bookmark Job"}
                            >
                              {isSaved ? (
                                <BookmarkCheck className="w-4 h-4 fill-blue-600 text-blue-600" />
                              ) : (
                                <Bookmark className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Metadata Pills Matrix */}
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3.5">
                          {/* Salary Badge */}
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50/80 text-emerald-700 border border-emerald-200/80 rounded-xl text-xs font-bold shadow-2xs">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            {formatSalaryRange(job.salary)}
                          </span>

                          {/* Work Mode Badge */}
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border shadow-2xs ${workModeConfig.badge}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${workModeConfig.dot}`}
                            />
                            {workModeConfig.label}
                          </span>

                          {/* Experience Badge */}
                          {job.experience && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-700 border border-slate-200/80 rounded-xl text-xs font-semibold">
                              <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              {formatExperience(job.experience)}
                            </span>
                          )}

                          {/* Location Badge */}
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-700 border border-slate-200/80 rounded-xl text-xs font-semibold capitalize">
                            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            {job.location?.city
                              ? `${job.location.city}${job.location?.state ? `, ${job.location.state}` : ""}`
                              : "India"}
                          </span>

                          {/* Job Shift / Timings Badge */}
                          {job.jobTimings && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50/60 text-indigo-700 border border-indigo-200/60 rounded-xl text-xs font-semibold">
                              {job.jobShift === "night" ? (
                                <Moon className="w-3 h-3 text-indigo-500" />
                              ) : (
                                <Sun className="w-3 h-3 text-amber-500" />
                              )}
                              {job.jobTimings}
                            </span>
                          )}
                        </div>

                        {/* Description Snippet */}
                        {job.description && (
                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-3.5 line-clamp-2">
                            {job.description}
                          </p>
                        )}

                        {/* Skills Badges */}
                        {Array.isArray(job.skills) && job.skills.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 mb-4">
                            {job.skills.slice(0, 4).map((skill, index) => (
                              <span
                                key={index}
                                className="px-2.5 py-0.5 bg-slate-100/90 text-slate-700 rounded-lg text-[11px] font-semibold border border-slate-200/60"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.skills.length > 4 && (
                              <span className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded-lg text-[11px] font-medium">
                                +{job.skills.length - 4} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Card Footer: Post info + Actions */}
                      <div className="pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3 text-slate-400 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {timeAgo(job.createdAt)}
                          </span>
                          {deadlineStatus && (
                            <>
                              <span>•</span>
                              <span className="text-amber-600 font-semibold flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {deadlineStatus}
                              </span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleOpenApplyModal(job, e)}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs hover:shadow-sm active:scale-[0.98] transition-all flex items-center gap-1.5"
                          >
                            <span>Apply</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              /* No Results State */
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 border border-blue-100">
                  <Search className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  No Matching Roles Found
                </h3>
                <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed mb-6">
                  We couldn't find any job opportunities matching your criteria.
                  Try adjusting your search keywords, broadening your location,
                  or clearing specific filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 shadow-sm active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Job Modal */}
      {isApplyModalOpen && applyModalJob && (
        <ApplyJobModal
          isOpen={isApplyModalOpen}
          onClose={() => {
            setIsApplyModalOpen(false);
            setApplyModalJob(null);
          }}
          job={applyModalJob}
          onSubmit={handleApplySubmit}
        />
      )}
    </div>
  );
}
