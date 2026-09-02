import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Users,
  UserCheck,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ChevronRight,
  Award,
  Sparkles,
  X,
  Loader2,
  RefreshCw,
  Eye,
  Calendar,
} from "lucide-react";
import customerservice from "../../customer/customerservice";
import toast from "react-hot-toast";
import { statusConfig } from "../../Utility/utilites";
import CandidateDetailsModal from "../Modals/CandidateDetailsModal";

export default function EmployerOverview({ setActiveTab = () => {} }) {
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await customerservice.getProviderOverview();
      if (res.success) {
        setOverviewData(res.data);
      } else {
        setError(res.message || "Failed to load employer dashboard overview");
      }
    } catch (err) {
      console.error("Error fetching provider overview:", err);
      setError("An error occurred while loading dashboard overview");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdatingStatus(newStatus);
    try {
      const response = await customerservice.updateApplicationStatus(
        applicationId,
        { status: newStatus },
      );
      if (response.success) {
        toast.success(`Application marked as ${newStatus} 🎉`);
        if (selectedApplicant && selectedApplicant._id === applicationId) {
          setSelectedApplicant({ ...selectedApplicant, status: newStatus });
        }
        // Refresh overview data
        fetchOverview();
      } else {
        toast.error(response?.message || "Failed to update application status");
      }
    } catch (err) {
      console.error("Error updating application status:", err);
      toast.error("Error updating status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 space-y-4">
        <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">
          Loading employer dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-8 rounded-3xl text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
        <h3 className="text-lg font-bold text-red-900">
          Failed to load dashboard
        </h3>
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={fetchOverview}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-xs font-semibold rounded-xl hover:bg-red-700 transition shadow-sm"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  const {
    profile = {},
    completeness = { score: 0, criteria: [] },
    stats = {},
    recentApplications = [],
    recentJobs = [],
  } = overviewData || {};

  const totalApplications = stats.totalApplications || 0;
  const statusBreakdown = stats.statusBreakdown || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      {/* 1. Header Banner & Quick Actions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_4px_25px_rgb(0,0,0,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="relative">
            {profile.logo ? (
              <img
                src={profile.logo}
                alt={profile.companyName || "Company"}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-100 shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-md shadow-brand-500/20">
                {(profile.companyName || "C").charAt(0).toUpperCase()}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full border border-brand-100/80">
                Employer Hub
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
                • Active Hiring
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              {getTimeGreeting()},{" "}
              <span className="text-brand-600">
                {profile.companyName || profile.name || "Employer"}
              </span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your job listings, track candidates, and streamline your
              hiring pipeline.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab("post-job")}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-2xl shadow-lg shadow-brand-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            Post New Job
          </button>
          <button
            onClick={() => setActiveTab("applicants")}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-semibold rounded-2xl border border-slate-200 transition-all"
          >
            <Users className="w-4 h-4 text-slate-500" />
            Applicants ({stats.totalApplications || 0})
          </button>
        </div>
      </div>

      {/* 2. Company Profile Completeness Bar (if < 100%) */}
      {completeness.score < 100 && (
        <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-purple-50/90 border border-blue-100/80 p-6 rounded-3xl shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Complete Your Company Profile
                </h3>
                <span className="text-xs font-bold text-brand-700 bg-brand-100/80 px-2.5 py-0.5 rounded-full">
                  {completeness.score}% Completed
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                A verified, complete company profile attracts up to 3x more
                top-tier candidates.
              </p>
              {/* Progress Bar */}
              <div className="w-full bg-slate-200/80 rounded-full h-2.5 mt-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-brand-600 to-indigo-600 h-2.5 rounded-full transition-all duration-700"
                  style={{ width: `${completeness.score}%` }}
                ></div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("profile")}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-brand-600 hover:bg-brand-50 border border-brand-200 text-xs font-bold rounded-xl shadow-sm transition whitespace-nowrap"
            >
              Update Profile <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Active Jobs */}
        <div
          onClick={() => setActiveTab("jobs")}
          className="group cursor-pointer bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:border-brand-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +
              {stats.jobsPostedThisWeek || 0} this week
            </span>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {stats.activeJobs || 0}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm font-medium text-slate-500">
              Active Job Postings
            </p>
            <span className="text-xs text-slate-400">
              {stats.totalJobs || 0} total
            </span>
          </div>
        </div>

        {/* Total Applications */}
        <div
          onClick={() => setActiveTab("applicants")}
          className="group cursor-pointer bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:border-indigo-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +
              {stats.applicationsThisWeek || 0} this week
            </span>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {stats.totalApplications || 0}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm font-medium text-slate-500">
              Total Applications
            </p>
            <span className="text-xs text-indigo-600 font-medium">
              View all &rarr;
            </span>
          </div>
        </div>

        {/* Candidates in Pipeline */}
        <div
          onClick={() => setActiveTab("applicants")}
          className="group cursor-pointer bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:border-purple-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3.5 rounded-2xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
              {stats.shortlistedCount || 0} Shortlisted
            </span>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {stats.shortlistedOrInterview || 0}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm font-medium text-slate-500">In Pipeline</p>
            <span className="text-xs text-slate-400">
              {stats.interviewCount || 0} interviews
            </span>
          </div>
        </div>

        {/* Candidates Hired */}
        <div
          onClick={() => setActiveTab("applicants")}
          className="group cursor-pointer bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:border-emerald-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Success 🎯
            </span>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {stats.hiredCount || 0}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm font-medium text-slate-500">
              Candidates Hired
            </p>
            <span className="text-xs text-emerald-600 font-medium">
              Confirmed
            </span>
          </div>
        </div>
      </div>

      {/* 4. Recruitment Funnel Stage Distribution */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Hiring Pipeline Funnel
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Real-time progression of candidate applications across stages.
            </p>
          </div>
          <button
            onClick={() => setActiveTab("applicants")}
            className="text-xs font-bold text-brand-600 hover:text-brand-700"
          >
            Manage Pipeline &rarr;
          </button>
        </div>

        {/* Funnel Progress Segments */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
            <div className="text-xs font-semibold text-slate-500 mb-1 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-500" /> Pending
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {statusBreakdown.pending || 0}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {totalApplications > 0
                ? `${Math.round(((statusBreakdown.pending || 0) / totalApplications) * 100)}%`
                : "0%"}
            </div>
          </div>

          <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100/60 text-center">
            <div className="text-xs font-semibold text-purple-700 mb-1 flex items-center justify-center gap-1">
              <Eye className="w-3.5 h-3.5" /> Reviewed
            </div>
            <div className="text-2xl font-bold text-purple-900">
              {statusBreakdown.reviewed || 0}
            </div>
            <div className="text-[11px] text-purple-500 mt-1">
              {totalApplications > 0
                ? `${Math.round(((statusBreakdown.reviewed || 0) / totalApplications) * 100)}%`
                : "0%"}
            </div>
          </div>

          <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100/60 text-center">
            <div className="text-xs font-semibold text-amber-700 mb-1 flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5" /> Shortlisted
            </div>
            <div className="text-2xl font-bold text-amber-900">
              {statusBreakdown.shortlisted || 0}
            </div>
            <div className="text-[11px] text-amber-500 mt-1">
              {totalApplications > 0
                ? `${Math.round(((statusBreakdown.shortlisted || 0) / totalApplications) * 100)}%`
                : "0%"}
            </div>
          </div>

          <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/60 text-center">
            <div className="text-xs font-semibold text-blue-700 mb-1 flex items-center justify-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Interview
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {statusBreakdown.interview || 0}
            </div>
            <div className="text-[11px] text-blue-500 mt-1">
              {totalApplications > 0
                ? `${Math.round(((statusBreakdown.interview || 0) / totalApplications) * 100)}%`
                : "0%"}
            </div>
          </div>

          <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/60 text-center">
            <div className="text-xs font-semibold text-emerald-700 mb-1 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Hired
            </div>
            <div className="text-2xl font-bold text-emerald-900">
              {statusBreakdown.hired || 0}
            </div>
            <div className="text-[11px] text-emerald-500 mt-1">
              {totalApplications > 0
                ? `${Math.round(((statusBreakdown.hired || 0) / totalApplications) * 100)}%`
                : "0%"}
            </div>
          </div>

          <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100/60 text-center">
            <div className="text-xs font-semibold text-rose-700 mb-1 flex items-center justify-center gap-1">
              <X className="w-3.5 h-3.5" /> Rejected
            </div>
            <div className="text-2xl font-bold text-rose-900">
              {statusBreakdown.rejected || 0}
            </div>
            <div className="text-[11px] text-rose-500 mt-1">
              {totalApplications > 0
                ? `${Math.round(((statusBreakdown.rejected || 0) / totalApplications) * 100)}%`
                : "0%"}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Two Columns: Recent Applications & Recent Posted Jobs */}
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
                  Latest candidates who applied to your active positions.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("applicants")}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100/80 px-3 py-1.5 rounded-xl transition"
              >
                View all ({stats.totalApplications || 0})
              </button>
            </div>

            <div className="space-y-3.5">
              {recentApplications.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    No applications received yet
                  </p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    When candidates apply to your job postings, their details
                    will appear right here.
                  </p>
                  <button
                    onClick={() => setActiveTab("post-job")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-xl hover:bg-brand-700 transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Post a Job
                  </button>
                </div>
              ) : (
                recentApplications.map((app) => {
                  const statusKey = (app.status || "pending").toLowerCase();
                  const StatusIcon =
                    statusConfig[statusKey]?.icon || statusConfig.pending.icon;
                  const StatusText =
                    statusConfig[statusKey]?.name || app.status;

                  return (
                    <motion.div
                      key={app._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setSelectedApplicant(app)}
                      className="group p-4 rounded-2xl border border-slate-100 hover:border-brand-200 hover:bg-brand-50/30 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={
                            app.userProfile?.profileImage ||
                            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80"
                          }
                          alt={app.userProfile?.name || "Applicant"}
                          className="w-12 h-12 rounded-full object-cover border border-slate-100 shadow-sm"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                            {app.userProfile?.name || "Candidate"}
                          </h4>
                          <p className="text-xs font-medium text-slate-500">
                            Applied for:{" "}
                            <span className="text-slate-700">
                              {app.job?.title || "Job Position"}
                            </span>
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                            <span>
                              {new Date(app.createdAt).toLocaleDateString()}
                            </span>
                            {app.totalExperience !== undefined && (
                              <>
                                <span>•</span>
                                <span>{app.totalExperience} yrs exp</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                            statusConfig[statusKey]?.color ||
                            statusConfig.pending.color
                          }`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {StatusText}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {recentApplications.length > 0 && (
            <div className="pt-4 border-t border-slate-100 mt-4 text-center">
              <button
                onClick={() => setActiveTab("applicants")}
                className="text-xs font-bold text-brand-600 hover:text-brand-700"
              >
                Go to Applicant Management &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Recent Job Postings (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Your Job Postings
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Recent listings posted by your company.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("jobs")}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100/80 px-3 py-1.5 rounded-xl transition"
              >
                Manage ({stats.totalJobs || 0})
              </button>
            </div>

            <div className="space-y-3.5">
              {recentJobs.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    No jobs posted yet
                  </p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Create your first job listing to start receiving qualified
                    applications.
                  </p>
                  <button
                    onClick={() => setActiveTab("post-job")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-xl hover:bg-brand-700 transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Create Job
                  </button>
                </div>
              ) : (
                recentJobs.map((job) => (
                  <div
                    key={job._id}
                    onClick={() => setActiveTab("jobs")}
                    className="group p-4 rounded-2xl border border-slate-100 hover:border-brand-200 hover:bg-slate-50/50 transition-all cursor-pointer space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                          {job.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                          <span className="capitalize">{job.jobType}</span>
                          <span>•</span>
                          {/* <span>{job.location || "On-site"}</span> */}
                        </div>
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                          job.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : job.status === "closed"
                              ? "bg-slate-100 text-slate-600"
                              : "bg-amber-50 text-amber-700 border border-amber-200/60"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100/80 text-xs">
                      <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-brand-600" />
                        {job.applicantCount || 0} applicants
                      </span>
                      <span className="text-slate-400">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {recentJobs.length > 0 && (
            <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
              <button
                onClick={() => setActiveTab("post-job")}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Post Another Job
              </button>
              <button
                onClick={() => setActiveTab("jobs")}
                className="text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                View All Jobs &rarr;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 6. Interactive Candidate Preview Modal */}
      <CandidateDetailsModal
        applicant={selectedApplicant}
        onClose={() => setSelectedApplicant(null)}
        onStatusChange={handleStatusChange}
        updatingStatus={updatingStatus}
        onViewAll={() => setActiveTab("applicants")}
      />
    </motion.div>
  );
}
