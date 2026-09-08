import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Calendar,
  Share2,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Users,
  GraduationCap,
  Globe,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  Send,
  Loader2,
  AlertCircle,
  HelpCircle,
  Award,
  Layers,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import customerservice from "../customer/customerservice";
import ApplyJobModal from "../components/Modals/ApplyJobModal";
import { IndustryType, workModeType } from "../Utility/utilites";
import { useSelector } from "react-redux";

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

export default function JobDetails() {
  const { categoriesType } = useSelector((state) => state.dashboard);
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await customerservice.getJobById(id);
      if (res?.success && res?.data) {
        setJob(res.data);
        fetchSimilarJobs(res.data);
      } else {
        setError(res?.message || "Job not found");
      }
    } catch (err) {
      console.error("Error fetching job details:", err);
      setError("Failed to load job details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarJobs = async (currentJob) => {
    try {
      const res = await customerservice.getLastsixJobs();
      if (res?.success && res?.data) {
        const filtered = res.data.filter((item) => item._id !== currentJob._id);
        setSimilarJobs(filtered.slice(0, 4));
      }
    } catch (err) {
      console.error("Error fetching similar jobs:", err);
    }
  };

  const handleSaveJob = async () => {
    if (!job?._id) return;
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to save jobs");
      navigate("/login");
      return;
    }

    setIsSaving(true);
    try {
      const response = await customerservice.saveJob(job._id);
      if (response?.success) {
        setIsSaved(true);
        toast.success("Saved to your shortlist! 🔖");
      } else {
        toast.error(response?.message || "Failed to save job");
      }
    } catch (error) {
      toast.error("Failed to save job");
      console.error("Error saving job:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to apply for this job");
      navigate("/login");
      return;
    }
    setIsApplyModalOpen(true);
  };

  const handleApplySubmit = async (formData) => {
    try {
      const response = await customerservice.createApplication(formData);
      if (response?.success) {
        toast.success("Application Submitted Successfully! 🎉");
        setIsApplyModalOpen(false);
      } else {
        toast.error(response?.message || "Failed to apply");
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      toast.error("An error occurred while applying for job");
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Job link copied to clipboard! 📋");
      setTimeout(() => setCopied(false), 2500);
    } else {
      toast.success("URL: " + url);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-slate-50 font-sans text-slate-900 flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full mx-auto px-4 space-y-6 animate-pulse">
          <div className="h-6 w-48 bg-slate-200 rounded-lg"></div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-6 items-start">
            <div className="w-20 h-20 bg-slate-200 rounded-2xl shrink-0"></div>
            <div className="flex-1 space-y-3 w-full">
              <div className="h-8 bg-slate-200 rounded-xl w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded-lg w-1/3"></div>
              <div className="flex gap-3 pt-2">
                <div className="h-8 bg-slate-100 rounded-lg w-24"></div>
                <div className="h-8 bg-slate-100 rounded-lg w-28"></div>
                <div className="h-8 bg-slate-100 rounded-lg w-20"></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200/80 space-y-4">
              <div className="h-6 bg-slate-200 rounded-lg w-1/4"></div>
              <div className="h-24 bg-slate-100 rounded-xl"></div>
              <div className="h-6 bg-slate-200 rounded-lg w-1/3 pt-4"></div>
              <div className="h-16 bg-slate-100 rounded-xl"></div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 space-y-4">
              <div className="h-6 bg-slate-200 rounded-lg w-1/2"></div>
              <div className="h-36 bg-slate-100 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-slate-50 flex items-center justify-center px-4 font-sans">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-5">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Job Not Found
            </h2>
            <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
              {error ||
                "The job posting you are looking for has expired or does not exist."}
            </p>
          </div>
          <button
            onClick={() => navigate("/jobs")}
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Jobs
          </button>
        </div>
      </div>
    );
  }

  const companyName =
    job.companyProfile?.companyName ||
    job.companyProfile?.name ||
    "Innovative Tech Corp";
  const companyLogo = job.companyProfile?.logo
    ? import.meta.env.VITE_API_URL + job.companyProfile.logo
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        companyName,
      )}&background=2563eb&color=fff&bold=true`;
  const workModeLabel =
    workModeType.find((mode) => mode.value === job.location?.workMode)?.label ||
    "On-Site";
  const isINR = job.salary?.currency === "INR";
  const currencySymbol = isINR ? "₹" : "$";
  const salaryDisplay =
    job.salary?.min || job.salary?.max
      ? `${currencySymbol}${job.salary?.min?.toLocaleString()} - ${currencySymbol}${job.salary?.max?.toLocaleString()}`
      : "Competitive Salary";

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-20 bg-[#F8FAFC] font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <button
            onClick={() => navigate("/jobs")}
            className="group inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200/80 shadow-xs hover:border-blue-200"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Jobs</span>
          </button>

          <nav className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-400">
            <Link to="/" className="hover:text-slate-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/jobs" className="hover:text-slate-600 transition-colors">
              Find Jobs
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-700 font-semibold truncate max-w-45 sm:max-w-xs">
              {job.title}
            </span>
          </nav>
        </div>

        {/* Hero Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden mb-8"
        >
          {/* Subtle decorative background gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            {/* Left Info with Company Logo & Titles */}
            <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6 flex-1 min-w-0">
              <div className="relative group shrink-0">
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-contain p-2.5 border-2 border-slate-100 shadow-md bg-white group-hover:scale-105 transition-transform"
                />
                <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Hiring Now
                  </span>
                  {job.category && (
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                      {
                        categoriesType.find((f) => f.value === job.category)
                          ?.label
                      }
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Posted{" "}
                    {timeAgo(job.createdAt)}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight capitalize">
                  {job.title}
                </h1>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm md:text-base font-semibold text-slate-600">
                  <div className="flex items-center gap-1.5 text-slate-800">
                    <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{companyName}</span>
                  </div>
                  <span className="hidden sm:inline text-slate-300">•</span>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="capitalize">
                      {job.location?.city}
                      {job.location?.state ? `, ${job.location.state}` : ""}
                    </span>
                  </div>
                  <span className="hidden sm:inline text-slate-300">•</span>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Briefcase className="w-4 h-4 text-purple-500 shrink-0" />
                    <span className="capitalize">{job.jobType}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Action CTAs */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
              <button
                onClick={handleShare}
                className="p-3.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all shadow-xs"
                title="Share Job"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Share2 className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={handleSaveJob}
                disabled={isSaving || isSaved}
                className={`flex-1 sm:flex-initial px-5 py-3.5 rounded-2xl border font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xs ${
                  isSaved
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isSaved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-amber-600 fill-current" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 text-slate-400" />
                    <span>Save Job</span>
                  </>
                )}
              </button>

              <button
                onClick={handleApplyClick}
                className="flex-1 sm:flex-initial px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-[0_4px_20px_0_rgb(37,99,235,0.35)] hover:shadow-[0_6px_25px_0_rgb(37,99,235,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm sm:text-base flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Apply Now</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Grid Strip */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Offered Salary
              </span>
              <span className="text-sm sm:text-base font-extrabold text-blue-600 mt-0.5 block truncate">
                {salaryDisplay}
              </span>
            </div>

            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Experience
              </span>
              <span className="text-sm sm:text-base font-extrabold text-slate-800 mt-0.5 block truncate">
                {job.experience?.min !== undefined &&
                job.experience?.max !== undefined
                  ? `${job.experience.min} - ${job.experience.max} Years`
                  : "Not Specified"}
              </span>
            </div>

            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Work Mode
              </span>
              <span className="text-sm sm:text-base font-extrabold text-slate-800 mt-0.5 block truncate">
                {workModeLabel}
              </span>
            </div>

            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Open Vacancies
              </span>
              <span className="text-sm sm:text-base font-extrabold text-slate-800 mt-0.5 block truncate">
                {job.vacancies || 1}{" "}
                {job.vacancies > 1 ? "Positions" : "Position"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Main Content Layout (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Detailed Job Description & Requirements */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Section */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/70 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-5"
            >
              <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <Briefcase className="w-5 h-5 text-blue-600" /> About The Role
              </h2>

              <div className="prose prose-slate max-w-none text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </motion.div>

            {/* Skills & Technologies Section */}
            {job.skills && job.skills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/70 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-5"
              >
                <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5 pb-4 border-b border-slate-100">
                  <Sparkles className="w-5 h-5 text-amber-500" /> Required
                  Skills & Competencies
                </h2>

                <div className="flex flex-wrap gap-2.5 pt-1">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-sm font-bold rounded-xl border border-slate-200/80 hover:border-blue-200 transition-all flex items-center gap-2 shadow-2xs cursor-default"
                    >
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Job Specifications & Requirements Grid */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/70 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-6"
            >
              <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <Layers className="w-5 h-5 text-purple-600" /> Job
                Specifications
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category & SubCategory */}
                <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Category
                  </span>
                  <p className="text-sm sm:text-base font-bold text-slate-800 mt-1 capitalize">
                    {
                      categoriesType.find((f) => f.value === job.category)
                        ?.label
                    }
                    {job.subCategory
                      ? ` / ${
                          categoriesType
                            ?.find((f) => f.value === job.category)
                            ?.roles.find((f) => f.value === job.subCategory)
                            ?.label
                        }`
                      : ""}
                  </p>
                </div>

                {/* Education / Qualification */}
                <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Education & Qualification
                  </span>
                  <p className="text-sm sm:text-base font-bold text-slate-800 mt-1">
                    {job.education ||
                      job.qualification ||
                      "Any Degree / Graduate"}
                  </p>
                </div>

                {/* Shift & Timings */}
                <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Shift & Timings
                  </span>
                  <p className="text-sm sm:text-base font-bold text-slate-800 mt-1 capitalize">
                    {job.jobShift || "Day"} Shift{" "}
                    {job.jobTimings ? `(${job.jobTimings})` : ""}
                  </p>
                </div>

                {/* Gender Preference */}
                <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Gender Preference
                  </span>
                  <p className="text-sm sm:text-base font-bold text-slate-800 mt-1 capitalize">
                    {job.genderPreference || "Any / No Preference"}
                  </p>
                </div>

                {/* Application Deadline */}
                {job.applicationDeadline && (
                  <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 sm:col-span-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Application Deadline
                    </span>
                    <p className="text-sm sm:text-base font-bold text-rose-600 mt-1 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(job.applicationDeadline).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* About Company Card */}
            {job.companyProfile && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/70 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-5"
              >
                <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5 pb-4 border-b border-slate-100">
                  <Building2 className="w-5 h-5 text-indigo-600" /> About{" "}
                  {companyName}
                </h2>

                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <img
                    src={companyLogo}
                    alt={companyName}
                    className="w-16 h-16 rounded-2xl object-contain p-2 border border-slate-100 shadow-sm bg-white shrink-0"
                  />
                  <div className="space-y-2 flex-1">
                    <h3 className="text-lg font-bold text-slate-900">
                      {companyName}
                    </h3>
                    {job.companyProfile.aboutCompany && (
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {job.companyProfile.aboutCompany}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4 pt-2 text-xs font-medium text-slate-500">
                      {job.companyProfile.industry && (
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                          Industry:{" "}
                          {
                            IndustryType.find(
                              (f) => f.value === job.companyProfile.industry,
                            )?.label
                          }
                        </span>
                      )}
                      {job.companyProfile.companySize && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          Size: {job.companyProfile.companySize} Employees
                        </span>
                      )}
                      {job.companyProfile.website && (
                        <a
                          href={
                            job.companyProfile.website.startsWith("http")
                              ? job.companyProfile.website
                              : `https://${job.companyProfile.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:underline font-semibold"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          Visit Website <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Candidate Safety Notice */}
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-3.5 text-amber-900">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm space-y-1">
                <span className="font-bold block">
                  Job Seeker Safety Advisory
                </span>
                <p className="text-amber-800 leading-relaxed">
                  Never pay any security deposit, registration fee, or interview
                  charge. Verified employers will never request money for
                  application processing.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Sidebar with Summary & Recommendations */}
          <div className="space-y-6">
            {/* Quick Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-5 sticky top-28"
            >
              <h3 className="text-lg font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100">
                Job Overview
              </h3>

              <div className="space-y-3.5 text-sm">
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" /> Posted Date
                  </span>
                  <span className="font-bold text-slate-800">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 font-medium flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-slate-400" /> Job Type
                  </span>
                  <span className="font-bold text-slate-800 capitalize">
                    {job.jobType}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" /> Work Location
                  </span>
                  <span className="font-bold text-slate-800 capitalize">
                    {job.location?.city || "Remote"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 font-medium flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-slate-400" /> Salary
                  </span>
                  <span className="font-bold text-blue-600">
                    {salaryDisplay}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 font-medium flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" /> Vacancies
                  </span>
                  <span className="font-bold text-slate-800">
                    {job.vacancies || 1}
                  </span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button
                  onClick={handleApplyClick}
                  className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-[0_4px_20px_0_rgb(37,99,235,0.3)] hover:shadow-[0_6px_25px_0_rgb(37,99,235,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Apply Now
                </button>

                <button
                  onClick={handleSaveJob}
                  disabled={isSaving || isSaved}
                  className="w-full py-3 px-6 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-2xl border border-slate-200 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Bookmark className="w-4 h-4 text-slate-400" />
                  {isSaved ? "Saved to Shortlist" : "Save For Later"}
                </button>
              </div>
            </motion.div>

            {/* Similar Roles Recommendations */}
            {similarJobs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-4"
              >
                <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center justify-between">
                  <span>Similar Openings</span>
                  <Link
                    to="/jobs"
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    View All
                  </Link>
                </h3>

                <div className="space-y-3 pt-1">
                  {similarJobs.map((simJob) => {
                    const simCompanyName =
                      simJob.companyProfile?.companyName || "Company";
                    const simLogo = simJob.companyProfile?.logo
                      ? import.meta.env.VITE_API_URL +
                        simJob.companyProfile.logo
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          simCompanyName,
                        )}&background=random`;

                    return (
                      <Link
                        key={simJob._id}
                        to={`/jobs/${simJob._id}`}
                        className="group block p-3.5 rounded-2xl bg-slate-50/60 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={simLogo}
                            alt={simCompanyName}
                            className="w-10 h-10 rounded-xl object-contain p-1.5 bg-white border border-slate-200 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate capitalize">
                              {simJob.title}
                            </h4>
                            <p className="text-xs text-slate-500 truncate mt-0.5">
                              {simCompanyName}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-[11px] font-medium text-slate-400">
                              <span>{simJob.location?.city || "Remote"}</span>
                              <span>•</span>
                              <span className="text-blue-600 font-semibold">
                                {simJob.salary?.currency === "INR" ? "₹" : "$"}
                                {simJob.salary?.min?.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyJobModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        job={job}
        onSubmit={handleApplySubmit}
      />
    </div>
  );
}
