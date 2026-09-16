import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Bookmark,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  MapPin,
  DollarSign,
  Briefcase,
  ArrowRight,
  UserCheck,
  Building2,
  ChevronRight,
  Compass,
  AlertCircle,
  Award,
  Loader2,
  Crown,
  MessageSquare,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import customerservice from "../../customer/customerservice";
import SubscriptionModal from "../Modals/SubscriptionModal";

export default function UserOverview({ setActiveTab }) {
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchOverview();
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const res = await customerservice.getCurrentSubscription();
      if (res?.success && res?.data) {
        setCurrentSubscription(res.data);
      }
    } catch (err) {
      console.warn("Could not fetch user subscription:", err);
    }
  };

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await customerservice.getUserOverview();
      if (res.success) {
        setOverviewData(res.data);
      } else {
        setError(res.message || "Failed to load dashboard overview");
      }
    } catch (err) {
      console.error("Error fetching user overview:", err);
      setError("An error occurred while loading dashboard overview");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200/60 text-xs font-semibold rounded-full">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
      case "reviewed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200/60 text-xs font-semibold rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" /> Reviewed
          </span>
        );
      case "shortlisted":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200/60 text-xs font-semibold rounded-full">
            <Award className="w-3.5 h-3.5" /> Shortlisted
          </span>
        );
      case "interview":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200/60 text-xs font-semibold rounded-full">
            <TrendingUp className="w-3.5 h-3.5" /> Interview
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200/60 text-xs font-semibold rounded-full">
            <AlertCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      case "hired":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-semibold rounded-full">
            <UserCheck className="w-3.5 h-3.5" /> Hired 🎉
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full capitalize">
            {status || "Submitted"}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 space-y-4">
        <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">
          Loading your candidate dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-6 rounded-3xl text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
        <h3 className="text-base font-semibold text-red-900">
          Failed to load overview
        </h3>
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={fetchOverview}
          className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-xl hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const {
    profile = {},
    completeness = { score: 0, criteria: [] },
    stats = {},
    recentApplications = [],
    recentSavedJobs = [],
    recommendedJobs = [],
  } = overviewData || {};

  const statusBreakdown = stats.statusBreakdown || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* --- 1. HERO BANNER & PROFILE COMPLETION CARD --- */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <img
              src={
                `${import.meta.env.VITE_API_URL}${profile.profileImage}` ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  profile.name || "Candidate",
                )}&background=3b82f6&color=fff`
              }
              alt={profile.name || "Candidate"}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/20 shadow-md bg-slate-800"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Welcome back, {profile.name || "Candidate"}! 👋
                </h1>
              </div>
              <p className="text-sm text-slate-300 mt-1 flex items-center gap-2">
                <span>{profile.title || "Job Seeker"}</span>
                {profile.location?.city && (
                  <>
                    <span className="text-slate-500">•</span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {profile.location.city}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => navigate("/jobs")}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-all shadow-md active:scale-95"
            >
              <Compass className="w-4 h-4 text-brand-600" />
              Explore Jobs
            </button>
            <button
              onClick={() => setActiveTab && setActiveTab("profile")}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all backdrop-blur-sm active:scale-95"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Completeness Bar */}
        <div className="relative z-10 mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 max-w-xl">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> Profile Strength
              </span>
              <span className="text-brand-300">
                {completeness.score}% Completed
              </span>
            </div>
            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completeness.score}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  completeness.score >= 80
                    ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                    : completeness.score >= 50
                      ? "bg-gradient-to-r from-brand-400 to-indigo-500"
                      : "bg-gradient-to-r from-amber-400 to-orange-500"
                }`}
              />
            </div>
          </div>
          {completeness.score < 100 && (
            <button
              onClick={() => setActiveTab && setActiveTab("profile")}
              className="text-xs text-brand-300 hover:text-white font-semibold flex items-center gap-1 self-start sm:self-center transition"
            >
              Complete missing details <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Subscription Status Card */}
      {currentSubscription && currentSubscription.status === "active" ? (
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-indigo-500/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Candidate Boost Plan
                </span>
                <span className="text-xs text-indigo-300 font-medium">
                  {currentSubscription.planDetails?.category || "Job Seeker Plan"}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black flex items-center gap-2 text-white">
                <Crown className="w-5 h-5 text-amber-400" />
                {currentSubscription.planDetails?.name || currentSubscription.planId}
              </h3>
              <p className="text-xs text-slate-300">
                Active until{" "}
                <span className="font-semibold text-white">
                  {new Date(currentSubscription.endDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSubModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all border border-white/10 cursor-pointer"
              >
                <Crown className="w-4 h-4 text-amber-300" />
                <span>Plan Details</span>
              </button>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-indigo-500 hover:from-brand-600 hover:to-indigo-600 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
              >
                <span>Upgrade</span>
              </Link>
            </div>
          </div>

          {/* Quota Tracker */}
          <div className="pt-3 border-t border-indigo-800/40">
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs text-indigo-200 font-semibold block">Direct Recruiter Outreach Messages</span>
                <span className="text-sm font-black text-white">
                  {currentSubscription.directMessagesUsed || 0} / {currentSubscription.directMessagesLimit || "∞"} Used
                </span>
              </div>
              <div className="w-full sm:max-w-xs space-y-1">
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        currentSubscription.directMessagesLimit > 0
                          ? Math.min(
                              100,
                              Math.round(
                                ((currentSubscription.directMessagesUsed || 0) /
                                  currentSubscription.directMessagesLimit) *
                                  100
                              )
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <div className="flex justify-end">
                  <span className="text-[11px] text-emerald-400 font-semibold">
                    Remaining:{" "}
                    {currentSubscription.directMessagesLimit > 0
                      ? Math.max(
                          0,
                          currentSubscription.directMessagesLimit -
                            (currentSubscription.directMessagesUsed || 0)
                        )
                      : "Unlimited"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 rounded-3xl p-6 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">
                Fast-Track Your Job Applications
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              Get highlighted to verified recruiters, AI resume review, and direct messaging privileges.
            </p>
          </div>
          <Link
            to="/pricing"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
          >
            <Crown className="w-4 h-4 text-amber-300" />
            <span>Browse Seeker Plans</span>
          </Link>
        </div>
      )}

      {/* --- 2. STATS KPI METRICS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Applications */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-blue-50 text-brand-600">
              <FileText className="w-5 h-5" />
            </div>
            {stats.appliedThisWeek > 0 ? (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                +{stats.appliedThisWeek} this week
              </span>
            ) : (
              <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">
                All time
              </span>
            )}
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {stats.totalApplied || 0}
          </h3>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Applied Jobs
          </p>
        </div>

        {/* In Review / Pending */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
              In progress
            </span>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {stats.inReview || 0}
          </h3>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Under Review
          </p>
        </div>

        {/* Shortlisted & Interviews */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
              High priority
            </span>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {stats.interviewAndShortlisted || 0}
          </h3>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Interviews & Shortlists
          </p>
        </div>

        {/* Saved Jobs */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
              <Bookmark className="w-5 h-5" />
            </div>
            {stats.savedThisWeek > 0 ? (
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
                +{stats.savedThisWeek} new
              </span>
            ) : (
              <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">
                Saved
              </span>
            )}
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {stats.totalSaved || 0}
          </h3>
          <p className="text-sm font-medium text-slate-500 mt-1">Saved Jobs</p>
        </div>
      </div>

      {/* --- 3. APPLICATION PIPELINE STATUS BREAKDOWN --- */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Application Funnel
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Current progress across all active job applications
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-xs font-medium text-slate-500">Pending</span>
            <p className="text-xl font-bold text-amber-600 mt-1">
              {statusBreakdown.pending || 0}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-xs font-medium text-slate-500">Reviewed</span>
            <p className="text-xl font-bold text-indigo-600 mt-1">
              {statusBreakdown.reviewed || 0}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-xs font-medium text-slate-500">
              Shortlisted
            </span>
            <p className="text-xl font-bold text-purple-600 mt-1">
              {statusBreakdown.shortlisted || 0}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-xs font-medium text-slate-500">
              Interview
            </span>
            <p className="text-xl font-bold text-blue-600 mt-1">
              {statusBreakdown.interview || 0}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-xs font-medium text-slate-500">Hired</span>
            <p className="text-xl font-bold text-emerald-600 mt-1">
              {statusBreakdown.hired || 0}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-xs font-medium text-slate-500">Rejected</span>
            <p className="text-xl font-bold text-rose-500 mt-1">
              {statusBreakdown.rejected || 0}
            </p>
          </div>
        </div>
      </div>

      {/* --- 4. TWO COLUMN SECTION: RECENT APPLICATIONS & SAVED JOBS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Applications (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Recent Applications
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Latest status updates on your applications
                </p>
              </div>
              <button
                onClick={() => setActiveTab && setActiveTab("applied")}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition cursor-pointer"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {recentApplications.length === 0 ? (
                <div className="py-12 text-center">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700">
                    No applications yet
                  </p>
                  <p className="text-xs text-slate-400 mt-1 mb-4">
                    Start applying to relevant jobs to track your progress here.
                  </p>
                  <button
                    onClick={() => navigate("/jobs")}
                    className="px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-xl hover:bg-brand-700 transition cursor-pointer"
                  >
                    Find Jobs
                  </button>
                </div>
              ) : (
                recentApplications.map((app) => (
                  <div
                    key={app._id}
                    onClick={() =>
                      navigate(`/user/applied/${app._id}`, {
                        state: { application: app },
                      })
                    }
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 first:pt-0 last:pb-0 group cursor-pointer hover:bg-slate-50/80 px-2 -mx-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={
                          app.job?.companyProfile?.logo
                            ? import.meta.env.VITE_API_URL +
                              app.job.companyProfile.logo
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                app.job?.companyProfile?.companyName || "C",
                              )}&background=random`
                        }
                        alt={app.job?.companyProfile?.companyName || "Company"}
                        className="w-11 h-11 rounded-xl object-contain border border-slate-100 bg-white p-1 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors truncate capitalize">
                          {app.job?.title || "Job Position"}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span className="truncate capitalize">
                            {app.job?.companyProfile?.companyName || "Company"}
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(app.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 self-start sm:self-center">
                      {getStatusBadge(app.status)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {recentApplications.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <button
                onClick={() => setActiveTab && setActiveTab("applied")}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1.5 cursor-pointer"
              >
                Go to Application History <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Bookmarked Jobs (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Saved Jobs</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quick access to bookmarked jobs
                </p>
              </div>
              <button
                onClick={() => setActiveTab && setActiveTab("saved")}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition cursor-pointer"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {recentSavedJobs.length === 0 ? (
                <div className="py-12 text-center">
                  <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700">
                    No saved jobs
                  </p>
                  <p className="text-xs text-slate-400 mt-1 mb-4">
                    Save interesting job posts to review or apply later.
                  </p>
                  <button
                    onClick={() => navigate("/jobs")}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition cursor-pointer"
                  >
                    Browse Jobs
                  </button>
                </div>
              ) : (
                recentSavedJobs.map((item) => {
                  const job = item.job;
                  if (!job) return null;
                  return (
                    <div
                      key={item._id}
                      className="p-4 rounded-2xl bg-slate-50/60 border border-slate-100 hover:border-brand-100 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={
                            job.companyProfile?.logo
                              ? import.meta.env.VITE_API_URL +
                                job.companyProfile?.logo
                              : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  job.companyProfile?.companyName || "C",
                                )}&background=random`
                          }
                          alt={job.companyProfile?.companyName || "Company"}
                          className="w-10 h-10 rounded-xl object-contain border border-slate-100 bg-white p-1 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 truncate capitalize">
                            {job.title}
                          </h4>
                          <p className="text-xs text-slate-500 truncate capitalize">
                            {job.companyProfile?.companyName} •{" "}
                            {job.location?.city || "Remote"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/jobs/${job._id}`)}
                        className="px-3 py-1.5 bg-brand-50 text-brand-700 hover:bg-brand-600 hover:text-white rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer"
                      >
                        View
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {recentSavedJobs.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <button
                onClick={() => setActiveTab && setActiveTab("saved")}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1.5 cursor-pointer"
              >
                Manage All Saved Jobs <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- 5. RECOMMENDED / LATEST JOBS SECTION --- */}
      {recommendedJobs.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold text-slate-900">
                  Recommended For You
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                New job opportunities curated based on your profile &
                preferences
              </p>
            </div>
            <button
              onClick={() => navigate("/jobs")}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition cursor-pointer"
            >
              Explore all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedJobs.map((job) => (
              <div
                key={job._id}
                className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-brand-100 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <img
                      src={
                        import.meta.env.VITE_API_URL +
                          job.companyProfile?.logo ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          job.companyProfile?.companyName || "C",
                        )}&background=random`
                      }
                      alt={job.companyProfile?.companyName || "Company"}
                      className="w-10 h-10 rounded-xl object-contain border border-slate-100 bg-white p-1"
                    />
                    <span className="px-2.5 py-0.5 bg-brand-50 text-brand-700 text-[11px] font-semibold rounded-full capitalize">
                      {job.jobType || "Full-Time"}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1 capitalize">
                    {job.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mb-3 line-clamp-1 capitalize">
                    {job.companyProfile?.companyName}
                  </p>
                  <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate capitalize">
                        {job.location?.city || "Remote"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        {job.salary?.currency === "INR" ? "₹" : "$"}
                        {job.salary?.min?.toLocaleString()} -{" "}
                        {job.salary?.max?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/jobs/${job._id}`)}
                  className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold transition-colors mt-auto cursor-pointer"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscription Details Modal */}
      <SubscriptionModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        subscription={currentSubscription}
        onSubscriptionCancelled={() => {
          fetchSubscription();
        }}
      />
    </motion.div>
  );
}
