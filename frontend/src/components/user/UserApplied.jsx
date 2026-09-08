import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  Award,
  Sparkles,
  Search,
  Briefcase,
  MapPin,
  DollarSign,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Loader2,
  FileText,
  SlidersHorizontal,
  Compass,
} from "lucide-react";
import customerservice from "../../customer/customerservice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatCTC } from "../../Utility/utilites";

export default function UserApplied() {
  const { categoriesType } = useSelector((state) => state.dashboard);

  const [appliedJobs, setAppliedJobs] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    pending: 0,
    reviewed: 0,
    shortlisted: 0,
    interview: 0,
    hired: 0,
    rejected: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const navigate = useNavigate();

  const fetchAppliedJobs = async (
    search = searchTerm,
    status = selectedStatus,
    sort = sortBy,
  ) => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.set("search", search);
      if (status !== "all") queryParams.set("status", status);
      if (sort) queryParams.set("sortBy", sort);

      const query = queryParams.toString();
      const response = await customerservice.getMyApplications(`?${query}`);
      if (response.success) {
        setAppliedJobs(response.data || []);
        if (response.statusCounts) {
          setStatusCounts(response.statusCounts);
        }
      } else {
        toast.error(response.message || "Failed to load applied jobs");
      }
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
      toast.error("An error occurred while fetching applied jobs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchAppliedJobs(searchTerm, selectedStatus, sortBy);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchTerm, selectedStatus, sortBy]);

  const getStatusBadge = (status) => {
    const st = (status || "pending").toLowerCase();
    switch (st) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200/70 text-xs font-bold rounded-full shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <Clock className="w-3.5 h-3.5" /> Pending Review
          </span>
        );
      case "reviewed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200/70 text-xs font-bold rounded-full shadow-xs">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <CheckCircle2 className="w-3.5 h-3.5" /> Profile Reviewed
          </span>
        );
      case "shortlisted":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200/70 text-xs font-bold rounded-full shadow-xs">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <Award className="w-3.5 h-3.5" /> Shortlisted 🎉
          </span>
        );
      case "interview":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200/70 text-xs font-bold rounded-full shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <Users className="w-3.5 h-3.5" /> Interview Stage
          </span>
        );
      case "hired":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/70 text-xs font-bold rounded-full shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5" /> Hired 🏆
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200/70 text-xs font-bold rounded-full shadow-xs">
            <XCircle className="w-3.5 h-3.5" /> Not Selected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full capitalize">
            {status || "Submitted"}
          </span>
        );
    }
  };

  const statusTabs = [
    { id: "all", label: "All Applications", count: statusCounts.all || 0 },
    { id: "pending", label: "Pending", count: statusCounts.pending || 0 },
    { id: "reviewed", label: "Reviewed", count: statusCounts.reviewed || 0 },
    {
      id: "shortlisted",
      label: "Shortlisted",
      count: statusCounts.shortlisted || 0,
    },
    {
      id: "interview",
      label: "Interview",
      count: statusCounts.interview || 0,
    },
    { id: "hired", label: "Hired", count: statusCounts.hired || 0 },
    {
      id: "rejected",
      label: "Not Selected",
      count: statusCounts.rejected || 0,
    },
  ];

  const filteredJobs = appliedJobs;

  const handleCardClick = (application) => {
    navigate(`/user/applied/${application._id}`, {
      state: { application },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* 1. Header & Quick Stat KPI Cards */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgb(0,0,0,0.03)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-brand-50 text-brand-700 text-xs font-bold rounded-full border border-brand-100">
                Application History
              </span>
              <span className="text-xs text-slate-400 font-medium">
                • {statusCounts.all || 0} Applications Total
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              My Applied Jobs
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Track real-time status updates, recruiter activity, and review
              your submissions.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={() =>
                fetchAppliedJobs(searchTerm, selectedStatus, sortBy)
              }
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition shadow-xs cursor-pointer"
              title="Refresh applications list"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <button
              onClick={() => navigate("/jobs")}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl transition shadow-sm cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              Find More Jobs
            </button>
          </div>
        </div>

        {/* KPI Mini-Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/60">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
              Total Applied
            </span>
            <p className="text-2xl font-extrabold text-blue-900 mt-1">
              {statusCounts.all || 0}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100/60">
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
              In Review / Pending
            </span>
            <p className="text-2xl font-extrabold text-amber-900 mt-1">
              {statusCounts.pending + statusCounts.reviewed}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100/60">
            <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block">
              Interview / Shortlist
            </span>
            <p className="text-2xl font-extrabold text-purple-900 mt-1">
              {statusCounts.interview + statusCounts.shortlisted}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/60">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
              Hired / Accepted
            </span>
            <p className="text-2xl font-extrabold text-emerald-900 mt-1">
              {statusCounts.hired}
            </p>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col lg:flex-row items-stretch lg:items-center gap-3 justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by job title, company name, location, role, skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all w-full placeholder:text-slate-400 font-sans"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200/60 rounded-full px-1.5 py-0.5"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="relative w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-48 appearance-none pl-3.5 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer"
            >
              <option value="newest">Sort: Applied (Newest)</option>
              <option value="oldest">Sort: Applied (Oldest)</option>
              <option value="salary">Sort: Salary (Highest)</option>
              <option value="experience">Sort: Experience (High)</option>
            </select>
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-4">
          {statusTabs.map((tab) => {
            const isSelected = selectedStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-brand-600 text-white shadow-sm shadow-brand-500/20"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-slate-200/80 text-slate-700"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Applied Jobs List Grid */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 space-y-3 shadow-xs">
            <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-500">
              Loading your applications...
            </p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 space-y-3 shadow-xs">
            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No applications found
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {searchTerm || selectedStatus !== "all"
                ? "No applications match your current filters. Try changing search keywords or status filter."
                : "You haven't submitted any job applications yet. Start exploring open opportunities!"}
            </p>
            {searchTerm || selectedStatus !== "all" ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("all");
                }}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-brand-50 text-brand-600 text-xs font-semibold rounded-xl hover:bg-brand-100 transition cursor-pointer"
              >
                Clear all filters
              </button>
            ) : (
              <button
                onClick={() => navigate("/jobs")}
                className="mt-2 inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                Browse Jobs
              </button>
            )}
          </div>
        ) : (
          filteredJobs.map((app) => {
            const job = app.job || {};
            const company = job.companyProfile || {};
            const locationStr =
              app.location ||
              [job.location?.city, job.location?.state]
                .filter(Boolean)
                .join(", ") ||
              "Location N/A";

            const expectedCTCFormatted = formatCTC(app.expectedCTC);
            const currentCTCFormatted = formatCTC(app.currentCTC);

            return (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-[0_2px_15px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-brand-200 transition-all flex flex-col gap-4"
              >
                {/* Top Row: Company Info & Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div
                    onClick={() => handleCardClick(app)}
                    className="flex items-start gap-4 cursor-pointer flex-1"
                  >
                    <img
                      src={
                        company.logo
                          ? import.meta.env.VITE_API_URL + company.logo
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              company.companyName || job.title || "Job",
                            )}&background=2563eb&color=fff&size=128`
                      }
                      alt={company.companyName || "Company Logo"}
                      className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-contain border border-slate-100 p-1 bg-white shadow-xs shrink-0"
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors capitalize">
                          {job.title || "Job Position"}
                        </h3>
                        {job.category && (
                          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            {categoriesType.find((f) => f.value == job.category)
                              ?.label || job.category.toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2.5 mt-1 flex-wrap text-xs text-slate-600 font-medium">
                        <span className="flex items-center gap-1 text-slate-800 font-semibold capitalize">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {company.companyName || "Company"}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1 text-slate-500 capitalize">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {job.location?.city || "Remote"}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Applied:{" "}
                          {new Date(app.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    {getStatusBadge(app.status)}
                  </div>
                </div>

                {/* Middle Row: Candidate Submitted Highlights Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-2.5 px-3.5 bg-slate-50/70 rounded-2xl border border-slate-100 text-xs text-slate-600">
                  {/* Experience */}
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      Experience:{" "}
                      <strong className="text-slate-800 font-semibold">
                        {app.totalExperience !== undefined
                          ? `${app.totalExperience} yrs`
                          : "N/A"}
                      </strong>
                    </span>
                  </div>

                  {/* Notice Period */}
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      Notice:{" "}
                      <strong className="text-slate-800 font-semibold">
                        {app.noticePeriod || "Immediate"}
                      </strong>
                    </span>
                  </div>

                  {/* Expected CTC */}
                  <div className="flex items-center gap-2 truncate">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      Expected:{" "}
                      <strong className="text-emerald-700 font-semibold">
                        {expectedCTCFormatted || "Negotiable"}
                      </strong>
                    </span>
                  </div>

                  {/* Work Mode / Type */}
                  <div className="flex items-center gap-2 truncate">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate capitalize">
                      Mode:{" "}
                      <strong className="text-slate-800 font-semibold">
                        {job.location?.workMode || job.jobType || "Full-time"}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Skills preview, Cover letter indicator & Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
                  {/* Skills tags preview */}
                  <div className="flex flex-wrap items-center gap-1.5 flex-1">
                    {job.skills && job.skills.length > 0 ? (
                      <>
                        {job.skills.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-medium rounded-lg border border-slate-200/60"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 3 && (
                          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">
                            +{job.skills.length - 3} more
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        No specific skills listed
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    {job._id && (
                      <button
                        onClick={() => navigate(`/jobs/${job._id}`)}
                        className="p-2 flex items-center gap-1 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition cursor-pointer"
                        title="View Public Job Posting"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-xs">View Job Details</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleCardClick(app)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer group/btn"
                    >
                      <span>View Application Details</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
