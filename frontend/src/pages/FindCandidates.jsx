import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Briefcase,
  Phone,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  DollarSign,
  User,
  ExternalLink,
  FileText,
  Check,
  Copy,
  LayoutGrid,
  List,
  Calendar,
  X,
  MessageCircle,
  Share2,
  Tag,
  Compass,
  SlidersHorizontal,
  Eye,
} from "lucide-react";
import customerservice from "../customer/customerservice";
import { JOB_ROLES_CATEGORY_TYPE } from "../Utility/utilites";
import CommonFilters from "../components/CommonFilters";
import toast from "react-hot-toast";

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 24 },
  },
};

// Helpers
const getInitials = (name) => {
  if (!name) return "U";
  return name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

const calculateAge = (dobString) => {
  if (!dobString) return null;
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return null;
  const diffMs = Date.now() - dob.getTime();
  const ageDt = new Date(diffMs);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
};

const formatSalary = (salary) => {
  if (!salary || (!salary.min && !salary.max)) {
    return "Negotiable / Open";
  }
  const curr =
    salary.currency === "INR" || !salary.currency ? "₹" : salary.currency;
  const min = Number(salary.min) || 0;
  const max = Number(salary.max) || 0;

  if (min === 0 && max === 0) return "Negotiable";

  const formatAmount = (num) => {
    if (num >= 100000) {
      const lpa = (num / 100000).toFixed(num % 100000 === 0 ? 0 : 1);
      return `${curr}${lpa}L`;
    }
    return `${curr}${num.toLocaleString("en-IN")}`;
  };

  if (min > 0 && max > 0) {
    return `${formatAmount(min)} - ${formatAmount(max)}`;
  }
  if (min > 0) return `From ${formatAmount(min)}`;
  return `Up to ${formatAmount(max)}`;
};

const formatCategoryName = (catValue) => {
  if (!catValue) return "";
  const found = JOB_ROLES_CATEGORY_TYPE.find((c) => c.value === catValue);
  if (found) return found.label;
  return catValue
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getWorkModeConfig = (mode) => {
  switch (mode?.toLowerCase()) {
    case "remote":
      return {
        label: "Remote",
        bg: "bg-purple-50 text-purple-700 border-purple-200/70",
        dot: "bg-purple-500",
      };
    case "hybrid":
      return {
        label: "Hybrid",
        bg: "bg-amber-50 text-amber-700 border-amber-200/70",
        dot: "bg-amber-500",
      };
    default:
      return {
        label: "On-site",
        bg: "bg-blue-50 text-blue-700 border-blue-200/70",
        dot: "bg-blue-500",
      };
  }
};

export default function FindCandidates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [candidatesData, setCandidatesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [selectedWorkModes, setSelectedWorkModes] = useState([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedSalaryRanges, setSelectedSalaryRanges] = useState([]);

  // UI States
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [copiedCandidateId, setCopiedCandidateId] = useState(null);

  const handleFilterChange = (setter, value) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedExperience([]);
    setSelectedWorkModes([]);
    setSelectedJobTypes([]);
    setSelectedSalaryRanges([]);
  };

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append("search", searchTerm);
      if (selectedCategories.length > 0)
        queryParams.append("categories", selectedCategories.join(","));
      if (selectedExperience.length > 0)
        queryParams.append("experience", selectedExperience.join(","));
      if (selectedWorkModes.length > 0)
        queryParams.append("workModes", selectedWorkModes.join(","));
      if (selectedJobTypes.length > 0)
        queryParams.append("jobTypes", selectedJobTypes.join(","));
      if (selectedSalaryRanges.length > 0)
        queryParams.append("salaryRanges", selectedSalaryRanges.join(","));

      const queryString = queryParams.toString()
        ? `?${queryParams.toString()}`
        : "";

      const response = await customerservice.getAllUserProfiles(queryString);
      if (response && response.success) {
        setCandidatesData(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCandidates();
    }, 300);
    return () => clearTimeout(timer);
  }, [
    searchTerm,
    selectedCategories,
    selectedExperience,
    selectedWorkModes,
    selectedJobTypes,
    selectedSalaryRanges,
  ]);

  const handleCopyPhone = (phone, candidateId) => {
    if (!phone) {
      toast.error("Phone number not provided");
      return;
    }
    navigator.clipboard.writeText(phone);
    setCopiedCandidateId(candidateId);
    toast.success(`Copied phone: ${phone}`);
    setTimeout(() => setCopiedCandidateId(null), 2000);
  };

  const handleShareProfile = (candidate) => {
    const text = `Candidate Profile: ${candidate.name} - ${candidate.title || "Professional"}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${text} | Contact: ${candidate.phone || "Available on platform"}`,
      );
      toast.success("Candidate details copied to clipboard!");
    }
  };

  const totalActiveFiltersCount =
    (searchTerm.trim() ? 1 : 0) +
    selectedCategories.length +
    selectedExperience.length +
    selectedWorkModes.length +
    selectedJobTypes.length +
    selectedSalaryRanges.length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Premium Hero Banner */}
      <div className="relative w-full pt-28 pb-48 overflow-hidden bg-slate-900">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2850&q=80")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-slate-950/85 z-0" />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/90 via-slate-900/80 to-blue-900/70 z-0" />
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Verified Talent Pool
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4"
          >
            Discover & Connect With{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              Top Candidates
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
            className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed mb-6"
          >
            Browse verified job seekers, filter by skills, experience, and
            budget, and hire the perfect candidate for your team.
          </motion.p>
        </div>
      </div>

      {/* Main Content Area - Overlaps Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-28 relative z-20 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar Filters */}
          <CommonFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedExperience={selectedExperience}
            setSelectedExperience={setSelectedExperience}
            selectedWorkModes={selectedWorkModes}
            setSelectedWorkModes={setSelectedWorkModes}
            selectedJobTypes={selectedJobTypes}
            setSelectedJobTypes={setSelectedJobTypes}
            selectedSalaryRanges={selectedSalaryRanges}
            setSelectedSalaryRanges={setSelectedSalaryRanges}
            handleFilterChange={handleFilterChange}
            clearAllFilters={clearAllFilters}
          />

          {/* Right Main Content Column */}
          <div className="flex-1 min-w-0">
            {/* Top Toolbar / Stats & Sort Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 tracking-tight">
                      {loading ? (
                        <span className="text-slate-400">
                          Loading Candidates...
                        </span>
                      ) : (
                        <>
                          <span className="text-blue-600 font-extrabold">
                            {candidatesData.length}
                          </span>{" "}
                          Candidates Available
                        </>
                      )}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Showing matching professional profiles ready to hire
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                  {/* View Mode Switcher */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-lg transition-all ${
                        viewMode === "grid"
                          ? "bg-white text-blue-600 shadow-sm"
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
                          ? "bg-white text-blue-600 shadow-sm"
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
                  <span className="text-xs font-semibold text-slate-400 mr-1">
                    Active Filters:
                  </span>

                  {searchTerm.trim() && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                      Search: "{searchTerm}"
                      <button
                        onClick={() => setSearchTerm("")}
                        className="hover:text-blue-900 ml-0.5"
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
                      {formatCategoryName(cat) || cat}
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

                  {selectedWorkModes.map((mode) => (
                    <span
                      key={mode}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 capitalize"
                    >
                      {mode}
                      <button
                        onClick={() =>
                          setSelectedWorkModes((prev) =>
                            prev.filter((m) => m !== mode),
                          )
                        }
                        className="hover:text-slate-900 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {selectedJobTypes.map((type) => (
                    <span
                      key={type}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 capitalize"
                    >
                      {type}
                      <button
                        onClick={() =>
                          setSelectedJobTypes((prev) =>
                            prev.filter((t) => t !== type),
                          )
                        }
                        className="hover:text-slate-900 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {selectedSalaryRanges.map((sal) => (
                    <span
                      key={sal}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200"
                    >
                      Salary: {sal}
                      <button
                        onClick={() =>
                          setSelectedSalaryRanges((prev) =>
                            prev.filter((s) => s !== sal),
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
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline ml-1"
                  >
                    Reset All
                  </button>
                </div>
              )}
            </div>

            {/* Content Area: Loading / Grid / List / Empty */}
            {loading ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-5"
                    : "space-y-4"
                }
              >
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm animate-pulse space-y-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-slate-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-slate-200 rounded-md w-1/2" />
                        <div className="h-4 bg-slate-100 rounded-md w-1/3" />
                      </div>
                    </div>
                    <div className="h-4 bg-slate-100 rounded w-full" />
                    <div className="h-4 bg-slate-100 rounded w-3/4" />
                    <div className="flex gap-2 pt-2">
                      <div className="h-8 bg-slate-100 rounded-xl flex-1" />
                      <div className="h-8 bg-slate-200 rounded-xl flex-1" />
                    </div>
                  </div>
                ))}
              </div>
            ) : candidatesData.length > 0 ? (
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
                <AnimatePresence>
                  {candidatesData.map((candidate) => {
                    const candidateName = candidate.name || "Candidate";
                    const candidateTitle =
                      candidate.title || "Open to Opportunities";
                    const workModeConfig = getWorkModeConfig(
                      candidate.location?.workMode,
                    );
                    const age = calculateAge(candidate.dob);
                    const locationText =
                      candidate.location?.city || candidate.location?.state
                        ? [candidate.location.city, candidate.location.state]
                            .filter(Boolean)
                            .join(", ")
                        : candidate.location?.country || "Location open";

                    if (viewMode === "grid") {
                      return (
                        <motion.div
                          key={candidate._id}
                          variants={itemVariants}
                          whileHover={{ y: -3 }}
                          className="group bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgb(0,0,0,0.08)] hover:border-blue-300/80 transition-all duration-300 flex flex-col justify-between"
                        >
                          <div>
                            {/* Top Card Header */}
                            <div className="flex items-start justify-between gap-3 mb-4">
                              <div className="flex items-center gap-3.5">
                                {/* Profile Avatar */}
                                <div className="relative flex-shrink-0">
                                  {candidate.profileImage ? (
                                    <img
                                      src={
                                        import.meta.env.VITE_API_URL +
                                        candidate?.profileImage
                                      }
                                      alt={candidateName}
                                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
                                    />
                                  ) : (
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                                      {getInitials(candidateName)}
                                    </div>
                                  )}
                                  <div
                                    className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm"
                                    title="Available to Hire"
                                  />
                                </div>

                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors truncate">
                                      {candidateName}
                                    </h3>
                                    <ShieldCheck
                                      className="w-4 h-4 text-blue-500 shrink-0"
                                      title="Verified Identity"
                                    />
                                  </div>
                                  <p className="text-xs font-semibold text-blue-600 truncate mt-0.5">
                                    {candidateTitle}
                                  </p>
                                </div>
                              </div>

                              {/* Work Mode Pill */}
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-xs ${workModeConfig.bg}`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${workModeConfig.dot}`}
                                />
                                {workModeConfig.label}
                              </span>
                            </div>

                            {/* Key Metadata Pills */}
                            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl text-slate-700 border border-slate-100">
                                <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                <span className="truncate font-semibold">
                                  {candidate.experience
                                    ? `${candidate.experience} Years Exp`
                                    : "Fresher"}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl text-slate-700 border border-slate-100">
                                <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="truncate font-semibold">
                                  {formatSalary(candidate.salary)}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl text-slate-700 border border-slate-100">
                                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                <span className="truncate font-medium">
                                  {locationText}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl text-slate-700 border border-slate-100">
                                <GraduationCap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                <span className="truncate font-medium">
                                  {candidate.education || "Graduate"}
                                </span>
                              </div>
                            </div>

                            {/* Bio Snippet */}
                            <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-4">
                              {candidate.bio ||
                                "Candidate looking for impactful opportunities and growth."}
                            </p>

                            {/* Skills Tag List */}
                            <div className="flex flex-wrap gap-1.5 mb-5">
                              {candidate.skills &&
                              candidate.skills.length > 0 ? (
                                <>
                                  {candidate.skills
                                    .slice(0, 4)
                                    .map((skill, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2.5 py-1 bg-blue-50/60 hover:bg-blue-100/70 text-blue-700 text-[11px] font-semibold rounded-lg border border-blue-100/60 transition-colors"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  {candidate.skills.length > 4 && (
                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[11px] font-semibold rounded-lg">
                                      +{candidate.skills.length - 4} more
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-[11px] text-slate-400 italic">
                                  No skills listed
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons Footer */}
                          <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                            <button
                              onClick={() => setSelectedCandidate(candidate)}
                              className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 flex items-center justify-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View Profile
                            </button>

                            {candidate.phone && (
                              <button
                                onClick={() =>
                                  handleCopyPhone(
                                    candidate.phone,
                                    candidate._id,
                                  )
                                }
                                className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-colors"
                                title="Copy Phone Number"
                              >
                                {copiedCandidateId === candidate._id ? (
                                  <Check className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Phone className="w-4 h-4" />
                                )}
                              </button>
                            )}

                            {candidate.phone && (
                              <a
                                href={`https://wa.me/91${candidate.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                  `Hi ${candidate.name}, we reviewed your profile on the job portal and would love to discuss an opportunity!`,
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-colors"
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </motion.div>
                      );
                    }

                    // List View Rendering
                    return (
                      <motion.div
                        key={candidate._id}
                        variants={itemVariants}
                        whileHover={{ y: -2 }}
                        className="group bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.07)] hover:border-blue-300/80 transition-all duration-300"
                      >
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Avatar & Rating Badge */}
                          <div className="flex-shrink-0 flex flex-col items-center gap-3">
                            <div className="relative">
                              {candidate.profileImage ? (
                                <img
                                  src={
                                    import.meta.env.VITE_API_URL +
                                    candidate?.profileImage
                                  }
                                  alt={candidateName}
                                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-md"
                                />
                              ) : (
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-blue-500/20">
                                  {getInitials(candidateName)}
                                </div>
                              )}
                              <div
                                className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white shadow-sm"
                                title="Available to Hire"
                              />
                            </div>

                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${workModeConfig.bg}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${workModeConfig.dot}`}
                              />
                              {workModeConfig.label}
                            </span>
                          </div>

                          {/* Candidate Information Body */}
                          <div className="flex-1 flex flex-col justify-between min-w-0">
                            <div>
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
                                <div>
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                                      {candidateName}
                                    </h3>
                                    <ShieldCheck
                                      className="w-5 h-5 text-blue-500"
                                      title="Identity Verified"
                                    />
                                    {candidate.jobType && (
                                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                                        {candidate.jobType}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-blue-600 font-semibold text-sm sm:text-base">
                                    {candidateTitle}
                                  </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {candidate.phone && (
                                    <button
                                      onClick={() =>
                                        handleCopyPhone(
                                          candidate.phone,
                                          candidate._id,
                                        )
                                      }
                                      className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                                      title="Copy Phone"
                                    >
                                      {copiedCandidateId === candidate._id ? (
                                        <Check className="w-4 h-4 text-emerald-600" />
                                      ) : (
                                        <Phone className="w-4 h-4" />
                                      )}
                                      <span className="hidden sm:inline">
                                        {candidate.phone}
                                      </span>
                                    </button>
                                  )}

                                  <button
                                    onClick={() =>
                                      setSelectedCandidate(candidate)
                                    }
                                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 flex items-center gap-1.5"
                                  >
                                    <Eye className="w-4 h-4" />
                                    View Profile
                                  </button>
                                </div>
                              </div>

                              {/* Highlight Badges Row */}
                              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 mb-4">
                                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                                  {locationText}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                                  <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                                  {candidate.experience
                                    ? `${candidate.experience} Years Experience`
                                    : "Fresher"}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                                  {formatSalary(candidate.salary)}
                                </span>
                                {candidate.education && (
                                  <>
                                    <span className="text-slate-300">•</span>
                                    <span className="flex items-center gap-1.5 font-medium text-slate-700">
                                      <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                                      {candidate.education}
                                    </span>
                                  </>
                                )}
                                {age && (
                                  <>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-slate-600 font-medium">
                                      {age} yrs{" "}
                                      {candidate.gender
                                        ? `• ${candidate.gender}`
                                        : ""}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Bio & Skills */}
                            <div>
                              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 max-w-3xl">
                                {candidate.bio ||
                                  "Qualified professional ready to contribute with hands-on expertise."}
                              </p>

                              <div className="flex flex-wrap gap-2">
                                {candidate.skills?.map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1 bg-blue-50/60 text-blue-700 border border-blue-100/60 rounded-lg text-xs font-semibold hover:bg-blue-100/80 transition-colors"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* Empty State */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center flex flex-col items-center shadow-sm"
              >
                <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  No candidates found
                </h3>
                <p className="text-slate-500 text-sm max-w-md mb-6 leading-relaxed">
                  We couldn't find any candidate profiles matching your selected
                  filters. Try broadening your criteria or search query.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 text-xs"
                >
                  Reset All Filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Candidate Profile Modal */}
      <AnimatePresence>
        {selectedCandidate && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCandidate(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden bg-white rounded-3xl shadow-2xl flex flex-col border border-slate-100 z-10 my-auto"
            >
              {/* Modal Top Header Banner */}
              <div className="relative bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-6 sm:px-8 pt-6 pb-8 text-white">
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  {/* Large Avatar */}
                  <div className="relative flex-shrink-0">
                    {selectedCandidate.profileImage ? (
                      <img
                        src={
                          import.meta.env.VITE_API_URL +
                          selectedCandidate.profileImage
                        }
                        alt={selectedCandidate.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white/20 shadow-xl"
                      />
                    ) : (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 text-white font-extrabold text-2xl sm:text-3xl flex items-center justify-center border-4 border-white/20 shadow-xl">
                        {getInitials(selectedCandidate.name)}
                      </div>
                    )}
                    <div
                      className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-slate-900 shadow-sm"
                      title="Available to Hire"
                    />
                  </div>

                  {/* Header Title Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        {selectedCandidate.name || "Candidate Profile"}
                      </h2>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified Profile
                      </span>
                    </div>

                    <p className="text-blue-300 font-semibold text-sm sm:text-base mb-3">
                      {selectedCandidate.title || "Professional Candidate"}
                      {selectedCandidate.category && (
                        <span className="text-slate-300 text-xs ml-2 font-normal">
                          • {formatCategoryName(selectedCandidate.category)}
                        </span>
                      )}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        {selectedCandidate.location?.city || "City"},{" "}
                        {selectedCandidate.location?.state || "India"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 capitalize">
                        <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                        {selectedCandidate.jobType || "Full-time"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        Active Profile
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Toolbar Bar */}
              <div className="bg-slate-50 border-b border-slate-200/80 px-6 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedCandidate.phone && (
                    <a
                      href={`tel:${selectedCandidate.phone}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call {selectedCandidate.phone}
                    </a>
                  )}

                  {selectedCandidate.phone && (
                    <a
                      href={`https://wa.me/91${selectedCandidate.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `Hi ${selectedCandidate.name}, we reviewed your profile on the job portal and would like to discuss an opportunity with you!`,
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp Chat
                    </a>
                  )}

                  {selectedCandidate.phone && (
                    <button
                      onClick={() =>
                        handleCopyPhone(
                          selectedCandidate.phone,
                          selectedCandidate._id,
                        )
                      }
                      className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
                    >
                      {copiedCandidateId === selectedCandidate._id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      Copy Phone
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleShareProfile(selectedCandidate)}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share Candidate
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
                {/* 1. Key Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                      <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                      Experience
                    </div>
                    <div className="text-sm sm:text-base font-bold text-slate-900">
                      {selectedCandidate.experience
                        ? `${selectedCandidate.experience} Years`
                        : "Fresher (0 yrs)"}
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      Expected Salary
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {formatSalary(selectedCandidate.salary)}
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                      <Compass className="w-3.5 h-3.5 text-purple-600" />
                      Work Mode
                    </div>
                    <div className="text-sm sm:text-base font-bold text-slate-900 capitalize">
                      {selectedCandidate.location?.workMode || "On-site"}
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                      Education
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {selectedCandidate.education || "Not specified"}
                    </div>
                  </div>
                </div>

                {/* 2. Personal & Contact Details */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Candidate Profile & Location Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">
                        Phone Number
                      </p>
                      <p className="font-semibold text-slate-800">
                        {selectedCandidate.phone || "Not provided"}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">
                        Gender & Age
                      </p>
                      <p className="font-semibold text-slate-800 capitalize">
                        {selectedCandidate.gender || "Not specified"}{" "}
                        {selectedCandidate.dob && (
                          <span className="text-slate-500 font-normal">
                            ({calculateAge(selectedCandidate.dob)} yrs • Born{" "}
                            {selectedCandidate.dob})
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">
                        Industry / Category
                      </p>
                      <p className="font-semibold text-slate-800">
                        {formatCategoryName(selectedCandidate.category) ||
                          "General"}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2 md:col-span-3">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">
                        Address & Location
                      </p>
                      <p className="font-semibold text-slate-800">
                        {selectedCandidate.location?.address ||
                          [
                            selectedCandidate.location?.talukaOrVillage,
                            selectedCandidate.location?.city,
                            selectedCandidate.location?.state,
                            selectedCandidate.location?.country,
                          ]
                            .filter(Boolean)
                            .join(", ") ||
                          "Location not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Bio / About Section */}
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    About Candidate / Professional Summary
                  </h3>
                  <div className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200/70 leading-relaxed">
                    {selectedCandidate.bio ||
                      "No detailed bio provided yet. Contact the candidate directly to discuss their career background and qualifications."}
                  </div>
                </div>

                {/* 4. Skills & Competencies */}
                <div className="space-y-2.5">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-blue-600" />
                    Skills & Technical Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills &&
                    selectedCandidate.skills.length > 0 ? (
                      selectedCandidate.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3.5 py-1.5 bg-blue-50 text-blue-800 text-xs font-semibold rounded-xl border border-blue-200/70"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        No specific skills tagged.
                      </span>
                    )}
                  </div>
                </div>

                {/* 5. Resume / CV Attachment */}
                {selectedCandidate.resume ? (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white text-blue-600 rounded-xl shadow-sm border border-blue-100">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          Candidate Resume Document
                        </h4>
                        <p className="text-xs text-slate-500">
                          Curriculum Vitae / Portfolio document uploaded by
                          candidate.
                        </p>
                      </div>
                    </div>
                    <a
                      href={`${import.meta.env.VITE_API_URL}${selectedCandidate.resume}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition shrink-0"
                    >
                      View / Download Resume
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-3 text-xs text-slate-500">
                    <FileText className="w-5 h-5 text-slate-400 shrink-0" />
                    <span>
                      Resume file not directly attached. Contact the candidate
                      via phone/WhatsApp for CV request.
                    </span>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="shrink-0 border-t border-slate-100 px-6 sm:px-8 py-4 bg-slate-50 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  Candidate ID: #{selectedCandidate._id?.substring(0, 10)}...
                </div>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
