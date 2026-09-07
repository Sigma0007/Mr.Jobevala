import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  Award,
  Sparkles,
  ExternalLink,
  Mail,
  Phone,
  Globe,
  GraduationCap,
  FileText,
  Copy,
  Check,
  Share2,
  Printer,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import customerservice from "../customer/customerservice";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { BENEFITS, formatCTC, IndustryType } from "../Utility/utilites";

export default function UserAppliedJobDetail() {
  const { categoriesType } = useSelector((state) => state.dashboard);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Try to use passed location state first for instant display, then refresh from API
  const [application, setApplication] = useState(
    location.state?.application || null,
  );
  const [loading, setLoading] = useState(!location.state?.application);
  const [error, setError] = useState("");
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  useEffect(() => {
    fetchApplicationDetails();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      if (!application) setLoading(true);
      setError("");
      const response = await customerservice.getApplicationById(id);
      if (response.success && response.data) {
        setApplication(response.data);
      } else {
        // Fallback: If not found by direct ID, try checking my-applications
        const myApps = await customerservice.getMyApplications();
        if (myApps.success && myApps.data) {
          const found = myApps.data.find((a) => a._id === id);
          if (found) {
            setApplication(found);
          } else {
            setError(response?.message || "Application not found");
          }
        } else {
          setError(response?.message || "Failed to load application details");
        }
      }
    } catch (err) {
      console.error("Error fetching application:", err);
      setError("An error occurred while loading application details");
    } finally {
      setLoading(false);
    }
  };

  const copyCoverLetter = () => {
    if (!application?.coverLetter) return;
    navigator.clipboard.writeText(application.coverLetter);
    setCopiedCoverLetter(true);
    toast.success("Cover letter copied to clipboard!");
    setTimeout(() => setCopiedCoverLetter(false), 2500);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShareLink(true);
    toast.success("Page link copied to clipboard!");
    setTimeout(() => setCopiedShareLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-16 bg-slate-50 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
          <div className="text-center">
            <h3 className="text-base font-bold text-slate-800">
              Loading Application Details
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Fetching full job and submission information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen pt-28 pb-16 bg-slate-50 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-rose-100 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Application Not Found
          </h2>
          <p className="text-sm text-slate-500">
            {error ||
              "We could not find the application details you requested."}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate("/user/dashboard")}
              className="w-full sm:w-auto px-5 py-2.5 bg-brand-600 text-white text-xs font-semibold rounded-xl hover:bg-brand-700 transition"
            >
              Go to Applications
            </button>
            <button
              onClick={fetchApplicationDetails}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const job = application.job || {};
  const company = job.companyProfile || {};
  const status = (application.status || "pending").toLowerCase();

  // Status configuration details
  const getStatusInfo = (st) => {
    switch (st) {
      case "pending":
        return {
          title: "Application Pending",
          badge: "bg-amber-50 text-amber-700 border-amber-200",
          dotColor: "bg-amber-500",
          icon: Clock,
          color: "amber",
          message:
            "Your application has been received and is waiting to be reviewed by the employer.",
        };
      case "reviewed":
        return {
          title: "Under Review",
          badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
          dotColor: "bg-indigo-500",
          icon: CheckCircle2,
          color: "indigo",
          message:
            "The hiring team has opened and reviewed your application details.",
        };
      case "shortlisted":
        return {
          title: "Shortlisted 🎉",
          badge: "bg-purple-50 text-purple-700 border-purple-200",
          dotColor: "bg-purple-500",
          icon: Award,
          color: "purple",
          message:
            "Congratulations! Your profile has been shortlisted for this position.",
        };
      case "interview":
        return {
          title: "Interview Scheduled 🚀",
          badge: "bg-blue-50 text-blue-700 border-blue-200",
          dotColor: "bg-blue-500",
          icon: Users,
          color: "blue",
          message:
            "The employer has moved your application to the Interview stage. Keep an eye on your email / phone for interview coordination.",
        };
      case "hired":
        return {
          title: "Hired / Selected 🏆",
          badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
          dotColor: "bg-emerald-500",
          icon: Sparkles,
          color: "emerald",
          message:
            "Congratulations! You have been selected and hired for this role.",
        };
      case "rejected":
        return {
          title: "Not Selected",
          badge: "bg-rose-50 text-rose-700 border-rose-200",
          dotColor: "bg-rose-500",
          icon: XCircle,
          color: "rose",
          message:
            "Thank you for applying. The employer has decided to proceed with other candidates at this time.",
        };
      default:
        return {
          title: "Application Submitted",
          badge: "bg-slate-100 text-slate-700 border-slate-200",
          dotColor: "bg-slate-500",
          icon: CheckCircle2,
          color: "slate",
          message: "Application is in progress.",
        };
    }
  };

  const statusInfo = getStatusInfo(status);
  const StatusIcon = statusInfo.icon;

  // Stepper timeline milestones
  const steps = [
    {
      id: "applied",
      label: "Application Submitted",
      description: new Date(application.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      completed: true,
      current: false,
    },
    {
      id: "reviewed",
      label: "Profile Reviewed",
      description: ["reviewed", "shortlisted", "interview", "hired"].includes(
        status,
      )
        ? "Employer reviewed your profile"
        : status === "rejected"
          ? "Application evaluated"
          : "Awaiting review",
      completed: ["reviewed", "shortlisted", "interview", "hired"].includes(
        status,
      ),
      current: status === "reviewed",
    },
    {
      id: "interview",
      label: "Shortlist / Interview",
      description: ["shortlisted", "interview", "hired"].includes(status)
        ? status === "interview"
          ? "Interview in progress"
          : "Profile shortlisted"
        : "Awaiting next round",
      completed: ["shortlisted", "interview", "hired"].includes(status),
      current: status === "shortlisted" || status === "interview",
    },
    {
      id: "decision",
      label:
        status === "rejected"
          ? "Decision: Not Selected"
          : "Final Offer / Hired",
      description:
        status === "hired"
          ? "Offer Accepted & Hired 🎉"
          : status === "rejected"
            ? "Process concluded"
            : "Final outcome pending",
      completed: status === "hired" || status === "rejected",
      current: status === "hired" || status === "rejected",
      isRejected: status === "rejected",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Breadcrumb & Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 flex-wrap">
            <Link to="/" className="hover:text-brand-600 transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link
              to="/user/dashboard"
              className="hover:text-brand-600 transition"
            >
              Candidate Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <button
              onClick={() => navigate("/user/dashboard")}
              className="hover:text-brand-600 transition"
            >
              Applied Jobs
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-semibold truncate max-w-[200px]">
              {job.title || "Job Application"}
            </span>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              onClick={copyShareLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition shadow-sm"
              title="Copy link to this page"
            >
              {copiedShareLink ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
              Share
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition shadow-sm"
              title="Print Application Summary"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
          </div>
        </div>

        {/* --- 1. HERO HEADER CARD --- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-[0_4px_25px_rgb(0,0,0,0.03)] relative overflow-hidden"
        >
          {/* Subtle Decorative Gradient Accent */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-brand-50 via-indigo-50/40 to-transparent rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4 sm:gap-5 flex-1 min-w-0">
              <img
                src={
                  company.logo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    company.companyName || job.title || "Job",
                  )}&background=2563eb&color=fff&size=128`
                }
                alt={company.companyName || "Company"}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-contain border border-slate-100 p-1.5 bg-white shadow-sm shrink-0"
              />

              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-2.5 py-0.5 bg-brand-50 text-brand-700 text-xs font-bold rounded-lg border border-brand-100">
                    Application Details
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Ref ID: #{application._id?.slice(-8).toUpperCase()}
                  </span>
                </div>

                <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5 truncate capitalize">
                  {job.title || "Job Position"}
                </h1>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 mt-1.5 text-xs text-slate-600">
                  <span className="font-semibold text-slate-800 flex items-center gap-1 capitalize">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {company.companyName || "Company Name"}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1 capitalize">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location?.city || "Location N/A"}
                    {job.location?.state ? `, ${job.location.state}` : ""}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Applied:{" "}
                    {new Date(application.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Status & Action */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0 w-full lg:w-auto">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold border shadow-sm ${statusInfo.badge}`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${statusInfo.dotColor} animate-pulse`}
                />
                <StatusIcon className="w-4 h-4" />
                <span>{statusInfo.title}</span>
              </div>

              {job._id && (
                <Link
                  to={`/jobs/${job._id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50/80 hover:bg-brand-100 px-3.5 py-2 rounded-xl border border-brand-100 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Original Job Post
                </Link>
              )}
            </div>
          </div>

          {/* Quick Badges Row */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            {job.jobType && (
              <span className="px-3 py-1 bg-slate-100 text-slate-700 font-semibold rounded-xl capitalize">
                💼 {job.jobType}
              </span>
            )}
            {job.location?.workMode && (
              <span className="px-3 py-1 bg-blue-50 text-blue-700 font-semibold rounded-xl capitalize">
                🏢 {job.location.workMode}
              </span>
            )}
            {job.category && (
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-semibold rounded-xl">
                🏷️{" "}
                {categoriesType.find((f) => f.value == job.category)?.label ||
                  job.category.toUpperCase()}
              </span>
            )}
            {job.vacancies && (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-xl">
                👥 {job.vacancies} Openings
              </span>
            )}
            {job.salary && (
              <span className="px-3 py-1 bg-amber-50 text-amber-800 font-semibold rounded-xl">
                💰 {job.salary.currency === "INR" ? "₹" : "$"}
                {job.salary.min?.toLocaleString()} -{" "}
                {job.salary.max?.toLocaleString()}
              </span>
            )}
          </div>
        </motion.div>

        {/* --- 2. APPLICATION STATUS PROGRESS TRACKER --- */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-600" />
                Application Pipeline & Status
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time tracking of your job application stage
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
              Updated:{" "}
              {new Date(application.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {steps.map((step, idx) => {
              const isCompleted = step.completed;
              const isCurrent = step.current;
              const isRejected = step.isRejected;

              return (
                <div
                  key={step.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isRejected
                      ? "bg-rose-50/50 border-rose-200"
                      : isCompleted
                        ? "bg-emerald-50/40 border-emerald-200"
                        : isCurrent
                          ? "bg-brand-50/50 border-brand-300 ring-2 ring-brand-500/20"
                          : "bg-slate-50/60 border-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                        isRejected
                          ? "bg-rose-600 text-white"
                          : isCompleted
                            ? "bg-emerald-600 text-white"
                            : isCurrent
                              ? "bg-brand-600 text-white"
                              : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {isRejected ? (
                        <XCircle className="w-4 h-4" />
                      ) : isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <span
                      className={`text-xs font-bold ${
                        isRejected
                          ? "text-rose-800"
                          : isCompleted
                            ? "text-emerald-900"
                            : isCurrent
                              ? "text-brand-900"
                              : "text-slate-600"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium pl-10">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Current Status Explanatory Banner */}
          <div
            className={`mt-5 p-4 rounded-2xl border flex items-start gap-3 text-xs ${
              status === "rejected"
                ? "bg-rose-50 border-rose-200 text-rose-800"
                : status === "hired"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : status === "interview"
                    ? "bg-blue-50 border-blue-200 text-blue-800"
                    : "bg-amber-50/70 border-amber-200 text-amber-900"
            }`}
          >
            <StatusIcon className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">{statusInfo.title}</p>
              <p className="mt-0.5 opacity-90">{statusInfo.message}</p>
            </div>
          </div>
        </div>

        {/* --- 3. MAIN CONTENT GRID (2 COLUMNS) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left / Main Column: Application Submission & Job Info (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* --- Section A: What You Submitted --- */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-brand-600" />
                    Your Application Submission
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Information and metrics you provided when submitting this
                    application
                  </p>
                </div>
                <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
                  Candidate Data
                </span>
              </div>

              {/* Submitted Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Total Experience */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Total Experience
                  </span>
                  <p className="text-base font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-brand-600" />
                    {application.totalExperience !== undefined
                      ? `${application.totalExperience} Years`
                      : "Not Provided"}
                  </p>
                </div>

                {/* Notice Period */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Notice Period
                  </span>
                  <p className="text-base font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600" />
                    {application.noticePeriod || "Immediate"}
                  </p>
                </div>

                {/* Applied Location */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Applied Location
                  </span>
                  <p className="text-base font-bold text-slate-900 mt-1 flex items-center gap-1.5 truncate">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">
                      {application.location || "Not Provided"}
                    </span>
                  </p>
                </div>

                {/* Current Role */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Current / Recent Role
                  </span>
                  <p className="text-base font-bold text-slate-900 mt-1 truncate">
                    {application.currentRole || "Fresher / Independent"}
                  </p>
                </div>

                {/* Current Company */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Current Company
                  </span>
                  <p className="text-base font-bold text-slate-900 mt-1 truncate">
                    {application.currentCompany || "N/A"}
                  </p>
                </div>

                {/* Expected CTC */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
                    Expected CTC
                  </span>
                  <p className="text-base font-extrabold text-emerald-800 mt-1 flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                    {formatCTC(application.expectedCTC)}
                  </p>
                </div>
              </div>

              {/* Current CTC comparison pill */}
              {application.currentCTC && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    Current Compensation (CTC):
                  </span>
                  <span className="font-bold text-slate-800">
                    {formatCTC(application.currentCTC)}
                  </span>
                </div>
              )}

              {/* Cover Letter Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-slate-400" />
                    Submitted Cover Letter
                  </label>
                  {application.coverLetter && (
                    <button
                      onClick={copyCoverLetter}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-lg transition"
                    >
                      {copiedCoverLetter ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      Copy
                    </button>
                  )}
                </div>

                {application.coverLetter ? (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 relative">
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
                      {application.coverLetter}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-50 text-slate-400 text-xs italic">
                    No cover letter was submitted for this application.
                  </div>
                )}
              </div>
            </div>

            {/* --- Section B: Job Description & Requirements --- */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-brand-600" />
                  Job Overview & Requirements
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Detailed job specifications and eligibility criteria
                </p>
              </div>

              {/* Job Description */}
              {job.description && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Job Description
                  </h3>
                  <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </div>
                </div>
              )}

              {/* Required Skills */}
              {job.skills && job.skills.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    Required Skills & Technologies
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {job.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-brand-50 text-brand-700 font-semibold text-xs rounded-xl border border-brand-100/80 shadow-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Job Specifications Grid */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Key Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {job.education && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                      <GraduationCap className="w-4 h-4 text-brand-600 shrink-0" />
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          Education / Degree
                        </span>
                        <span className="font-semibold text-slate-800">
                          {job.education}
                        </span>
                      </div>
                    </div>
                  )}

                  {job.qualification && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                      <Award className="w-4 h-4 text-purple-600 shrink-0" />
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          Qualification Level
                        </span>
                        <span className="font-semibold text-slate-800 capitalize">
                          {job.qualification}
                        </span>
                      </div>
                    </div>
                  )}

                  {job.experience && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                      <Briefcase className="w-4 h-4 text-amber-600 shrink-0" />
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          Experience Requirement
                        </span>
                        <span className="font-semibold text-slate-800">
                          {job.experience.min} - {job.experience.max} Years
                        </span>
                      </div>
                    </div>
                  )}

                  {job.jobShift && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                      <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          Shift & Timings
                        </span>
                        <span className="font-semibold text-slate-800 capitalize">
                          {job.jobShift} Shift ({job.jobTimings || "Standard"})
                        </span>
                      </div>
                    </div>
                  )}

                  {job.genderPreference && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                      <Users className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          Gender Preference
                        </span>
                        <span className="font-semibold text-slate-800 capitalize">
                          {job.genderPreference}
                        </span>
                      </div>
                    </div>
                  )}

                  {job.applicationDeadline && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-rose-600 shrink-0" />
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          Application Deadline
                        </span>
                        <span className="font-semibold text-slate-800">
                          {new Date(job.applicationDeadline).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column / Sidebar: Company Profile, Compensation & Help (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* --- Company Profile Card --- */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-5">
              <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
                <img
                  src={
                    company.logo ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      company.companyName || "C",
                    )}&background=random`
                  }
                  alt={company.companyName || "Company"}
                  className="w-12 h-12 rounded-xl object-contain border border-slate-100 p-1 bg-white shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-slate-900 truncate capitalize">
                    {company.companyName || "Company Profile"}
                  </h3>
                  <p className="text-xs text-slate-500 truncate capitalize">
                    {IndustryType.find((i) => i.value === company.industry)
                      ?.label || "Industry Partner"}
                  </p>
                </div>
              </div>

              {/* About Company */}
              {company.aboutCompany && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    About Company
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {company.aboutCompany}
                  </p>
                </div>
              )}

              {/* Key Company Details */}
              <div className="space-y-2.5 text-xs text-slate-600">
                {company.location && (
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{company.location}</span>
                  </div>
                )}

                {company.companySize && (
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{company.companySize} Employees</span>
                  </div>
                )}

                {company.establishYear && (
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Established in {company.establishYear}</span>
                  </div>
                )}

                {company.website && (
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                    <a
                      href={
                        company.website.startsWith("http")
                          ? company.website
                          : `https://${company.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:underline flex items-center gap-1 font-medium truncate"
                    >
                      {company.website.replace(/^https?:\/\//, "")}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Company Perks & Benefits */}
              {company.benefits && company.benefits.length > 0 && (
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                    Perks & Benefits
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {company.benefits.map((benefit, idx) => {
                      const benefitConfig = BENEFITS.find(
                        (b) => b.value === benefit,
                      );
                      const BenefitIcon = benefitConfig?.icon;
                      const BenefitLabel = benefitConfig?.label;
                      return (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200/60 rounded-xl text-[11px] font-medium text-slate-700"
                        >
                          {BenefitIcon && (
                            <BenefitIcon className="w-3 h-3 text-brand-600" />
                          )}
                          {BenefitLabel}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* HR / Contact Person */}
              {(company.contactPersonName ||
                company.contactPersonEmail ||
                company.contactPersonPhone) && (
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Recruiter / Contact
                  </span>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <p className="text-xs font-bold text-slate-800 capitalize">
                      {company.contactPersonName || "HR Department"}{" "}
                      {company.contactPersonRole && (
                        <span className="text-slate-400 font-normal">
                          ({company.contactPersonRole})
                        </span>
                      )}
                    </p>

                    {company.contactPersonEmail && (
                      <a
                        href={`mailto:${company.contactPersonEmail}`}
                        className="flex items-center gap-2 text-xs text-brand-600 hover:underline"
                      >
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">
                          {company.contactPersonEmail}
                        </span>
                      </a>
                    )}

                    {company.contactPersonPhone && (
                      <a
                        href={`tel:${company.contactPersonPhone}`}
                        className="flex items-center gap-2 text-xs text-slate-600 hover:text-brand-600"
                      >
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        <span>{company.contactPersonPhone}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* --- Summary / Next Steps Card --- */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Next Steps Tip</span>
              </div>
              <h4 className="text-base font-bold">Keep Your Profile Updated</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Employers review your full candidate profile, skills, and
                portfolio links during evaluation. Make sure your profile
                details and contact info are always current.
              </p>
              <button
                onClick={() => navigate("/user/dashboard")}
                className="w-full py-2.5 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-100 transition shadow-md"
              >
                Go to Candidate Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
