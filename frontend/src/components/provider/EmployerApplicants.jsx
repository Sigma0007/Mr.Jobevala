import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Loader2,
  Briefcase,
  MapPin,
  Calendar,
  Mail,
  Phone,
  DollarSign,
  GraduationCap,
  Clock,
  Building2,
  ChevronDown,
  Sparkles,
  SlidersHorizontal,
  RefreshCw,
  Eye,
  FileText,
  UserCheck,
  CheckCircle2,
  XCircle,
  Bookmark,
  Users,
} from "lucide-react";
import customerservice from "../../customer/customerservice";
import toast from "react-hot-toast";
import { statusConfig } from "../../Utility/utilites";
import CandidateDetailsModal from "../Modals/CandidateDetailsModal";

// Helper for formatting CTC in list view
const formatCompactCTC = (val) => {
  if (val === undefined || val === null || val === "") return null;
  if (
    typeof val === "string" &&
    (val.toLowerCase().includes("lpa") ||
      val.includes("₹") ||
      val.includes("$"))
  ) {
    return val;
  }
  const num = Number(val);
  if (!isNaN(num) && num > 0) {
    if (num >= 100000) {
      const lpa = (num / 100000).toFixed(num % 100000 === 0 ? 0 : 1);
      return `₹${lpa} LPA`;
    }
    return `₹${num.toLocaleString("en-IN")}`;
  }
  return String(val);
};

const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

export default function EmployerApplicants() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedJobId, setSelectedJobId] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [applicantsData, setApplicantsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const loadApplicants = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await customerservice.getProviderApplications();
      if (response.success) {
        setApplicantsData(response.data || []);
      } else {
        setError(response.message || "Failed to load applications");
      }
    } catch (err) {
      console.error("Error loading applicants:", err);
      setError("Error loading applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplicants();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingStatus(newStatus);
    try {
      const response = await customerservice.updateApplicationStatus(id, {
        status: newStatus,
      });
      if (response.success) {
        toast.success(`Application marked as ${newStatus} 🎉`);
        setApplicantsData((prev) =>
          prev.map((app) =>
            app._id === id ? { ...app, status: newStatus } : app,
          ),
        );
        if (selectedApplicant && selectedApplicant._id === id) {
          setSelectedApplicant((prev) => ({ ...prev, status: newStatus }));
        }
      } else {
        toast.error(response.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      toast.error("Error updating application status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Distinct jobs for filtering
  const distinctJobs = useMemo(() => {
    const jobMap = new Map();
    applicantsData.forEach((app) => {
      if (app.job && app.job._id) {
        jobMap.set(app.job._id, app.job.title || "Untitled Role");
      }
    });
    return Array.from(jobMap.entries()).map(([id, title]) => ({ id, title }));
  }, [applicantsData]);

  // Counts by status
  const statusCounts = useMemo(() => {
    const counts = {
      all: applicantsData.length,
      pending: 0,
      reviewed: 0,
      shortlisted: 0,
      interview: 0,
      hired: 0,
      rejected: 0,
    };
    applicantsData.forEach((app) => {
      const st = (app.status || "pending").toLowerCase();
      if (counts[st] !== undefined) {
        counts[st] += 1;
      }
    });
    return counts;
  }, [applicantsData]);

  // Filter & Sort applicants
  const filteredApplicants = useMemo(() => {
    return applicantsData
      .filter((app) => {
        // Status filter
        if (
          selectedStatus !== "all" &&
          (app.status || "pending").toLowerCase() !== selectedStatus
        ) {
          return false;
        }

        // Job filter
        if (selectedJobId !== "all" && app.job?._id !== selectedJobId) {
          return false;
        }

        // Search match
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const name = (
            app.userProfile?.name ||
            app.user?.name ||
            ""
          ).toLowerCase();
          const email = (app.user?.email || "").toLowerCase();
          const phone = (
            app.userProfile?.phone ||
            app.user?.phone ||
            ""
          ).toLowerCase();
          const jobTitle = (app.job?.title || "").toLowerCase();
          const currentRole = (
            app.currentRole ||
            app.userProfile?.title ||
            ""
          ).toLowerCase();
          const currentCompany = (app.currentCompany || "").toLowerCase();
          const location = (
            app.location ||
            app.userProfile?.location?.city ||
            ""
          ).toLowerCase();
          const skills = (app.userProfile?.skills || [])
            .join(" ")
            .toLowerCase();

          const matches =
            name.includes(term) ||
            email.includes(term) ||
            phone.includes(term) ||
            jobTitle.includes(term) ||
            currentRole.includes(term) ||
            currentCompany.includes(term) ||
            location.includes(term) ||
            skills.includes(term);

          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        if (sortBy === "experience") {
          const expA = a.totalExperience ?? a.userProfile?.experience ?? 0;
          const expB = b.totalExperience ?? b.userProfile?.experience ?? 0;
          return Number(expB) - Number(expA);
        }
        if (sortBy === "expectedCTC") {
          const ctcA = Number(a.expectedCTC) || 0;
          const ctcB = Number(b.expectedCTC) || 0;
          return ctcA - ctcB;
        }
        return 0;
      });
  }, [applicantsData, searchTerm, selectedStatus, selectedJobId, sortBy]);

  const statusTabs = [
    { id: "all", label: "All Applicants", count: statusCounts.all },
    { id: "pending", label: "Pending", count: statusCounts.pending },
    { id: "reviewed", label: "Reviewed", count: statusCounts.reviewed },
    {
      id: "shortlisted",
      label: "Shortlisted",
      count: statusCounts.shortlisted,
    },
    { id: "interview", label: "Interview", count: statusCounts.interview },
    { id: "hired", label: "Hired", count: statusCounts.hired },
    { id: "rejected", label: "Rejected", count: statusCounts.rejected },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header & Summary Stats */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgb(0,0,0,0.03)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-brand-50 text-brand-700 text-xs font-bold rounded-full border border-brand-100">
                Candidate Pipeline
              </span>
              <span className="text-xs text-slate-400 font-medium">
                • {applicantsData.length} Total Applications
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Applicants Management
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Review, filter, evaluate candidate profiles, and manage status
              transitions.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={loadApplicants}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition"
              title="Refresh applicants list"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Search & Filter Controls Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col lg:flex-row items-stretch lg:items-center gap-3 justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by candidate name, email, role, company, skills, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all w-full placeholder:text-slate-400"
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

          {/* Job Filter Dropdown */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            <div className="relative w-full sm:w-auto">
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full sm:w-48 appearance-none pl-3.5 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer"
              >
                <option value="all">All Jobs ({applicantsData.length})</option>
                {distinctJobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Sort Selector */}
            <div className="relative w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-44 appearance-none pl-3.5 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="experience">Sort: Experience (High)</option>
                <option value="expectedCTC">Sort: Expected CTC (Low)</option>
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="mt-5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-4">
          {statusTabs.map((tab) => {
            const isSelected = selectedStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
                  isSelected
                    ? "bg-brand-600 text-white shadow-sm shadow-brand-500/20"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-slate-200/70 text-slate-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Applicant Cards Grid / List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 space-y-3">
            <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-500">
              Loading candidate applications...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-red-100 p-6 space-y-3">
            <p className="text-sm font-semibold text-red-600">{error}</p>
            <button
              onClick={loadApplicants}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-xl hover:bg-red-700 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Try Again
            </button>
          </div>
        ) : filteredApplicants.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 space-y-3">
            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No applicants found
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No applications match your current filter and search criteria. Try
              adjusting search terms or status filters.
            </p>
            {(searchTerm ||
              selectedStatus !== "all" ||
              selectedJobId !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("all");
                  setSelectedJobId("all");
                }}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-brand-50 text-brand-600 text-xs font-semibold rounded-xl hover:bg-brand-100 transition"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          filteredApplicants.map((applicant) => {
            const user = applicant.user || {};
            const userProfile = applicant.userProfile || {};
            const job = applicant.job || {};

            const candidateName = userProfile.name || user.name || "Candidate";
            const candidateEmail = user.email || "";
            const candidatePhone = userProfile.phone || user.phone || "";
            const candidateRole =
              applicant.currentRole || userProfile.title || "Applicant";
            const candidateCompany = applicant.currentCompany;
            const expYears =
              applicant.totalExperience ?? userProfile.experience;
            const locationStr =
              applicant.location ||
              [userProfile.location?.city, userProfile.location?.state]
                .filter(Boolean)
                .join(", ") ||
              "Location N/A";

            const statusKey = (applicant.status || "pending").toLowerCase();
            const StatusIcon =
              statusConfig[statusKey]?.icon || statusConfig.pending.icon;
            const StatusText =
              statusConfig[statusKey]?.name || applicant.status;

            const currentCTCFormatted = formatCompactCTC(applicant.currentCTC);
            const expectedCTCFormatted = formatCompactCTC(
              applicant.expectedCTC,
            );

            return (
              <motion.div
                key={applicant._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-[0_2px_15px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-brand-200 transition-all flex flex-col gap-4"
              >
                {/* Top Row: Candidate Header + Status */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div
                    onClick={() => setSelectedApplicant(applicant)}
                    className="flex items-start gap-4 cursor-pointer flex-1"
                  >
                    {userProfile.profileImage ? (
                      <img
                        src={
                          import.meta.env.VITE_API_URL +
                          userProfile.profileImage
                        }
                        alt={candidateName}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-base sm:text-lg shadow-sm shrink-0 uppercase tracking-wider">
                        {getInitials(candidateName)}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                          {candidateName}
                        </h3>
                        <span className="text-xs text-slate-400 font-normal">
                          • {candidateRole}
                        </span>
                      </div>

                      {/* Job Applied Badge */}
                      <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-slate-600">
                        <span className="font-semibold text-brand-700 bg-brand-50/80 px-2 py-0.5 rounded-lg border border-brand-100">
                          Applied: {job.title || "Job Position"}
                        </span>
                        {job.companyProfile?.companyName && (
                          <span className="text-slate-400 text-[11px]">
                            ({job.companyProfile.companyName})
                          </span>
                        )}
                        <span className="text-slate-400 text-[11px] flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(applicant.createdAt).toLocaleDateString(
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

                  {/* Status Badge & Quick Dropdown */}
                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                        statusConfig[statusKey]?.color ||
                        statusConfig.pending.color
                      }`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {StatusText}
                    </span>

                    {/* Quick Status Selector */}
                    <div className="relative">
                      <select
                        value={statusKey}
                        disabled={updatingStatus !== null}
                        onChange={(e) =>
                          handleStatusChange(applicant._id, e.target.value)
                        }
                        className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold py-1.5 pl-2.5 pr-7 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer transition"
                        title="Quick change status"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interview">Interview</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Middle Row: Rich Info Tags Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 py-2.5 px-3.5 bg-slate-50/70 rounded-2xl border border-slate-100 text-xs text-slate-600">
                  {/* Current Role & Company */}
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {candidateCompany ? (
                        <span>
                          <strong className="text-slate-800 font-medium">
                            {candidateCompany}
                          </strong>
                        </span>
                      ) : (
                        <span>Fresher / Independent</span>
                      )}
                    </span>
                  </div>

                  {/* Experience */}
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      Exp:{" "}
                      <strong className="text-slate-800 font-semibold">
                        {expYears !== undefined ? `${expYears} yrs` : "N/A"}
                      </strong>
                    </span>
                  </div>

                  {/* CTC (Current -> Expected) */}
                  <div className="flex items-center gap-2 truncate">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {expectedCTCFormatted ? (
                        <span>
                          Exp:{" "}
                          <strong className="text-emerald-700 font-semibold">
                            {expectedCTCFormatted}
                          </strong>
                        </span>
                      ) : (
                        <span>CTC: Negotiable</span>
                      )}
                    </span>
                  </div>

                  {/* Notice Period */}
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      Notice:{" "}
                      <strong className="text-slate-800 font-semibold">
                        {applicant.noticePeriod || "Immediate"}
                      </strong>
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 col-span-2 sm:col-span-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate" title={locationStr}>
                      {locationStr}
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Skills pills, Cover letter preview & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
                  {/* Skills Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 flex-1">
                    {userProfile.skills && userProfile.skills.length > 0 ? (
                      <>
                        {userProfile.skills.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-medium rounded-lg border border-slate-200/60"
                          >
                            {skill}
                          </span>
                        ))}
                        {userProfile.skills.length > 4 && (
                          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">
                            +{userProfile.skills.length - 4} more
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        No specific skills listed
                      </span>
                    )}
                  </div>

                  {/* Quick Contact & View Profile Action */}
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    {candidateEmail && (
                      <a
                        href={`mailto:${candidateEmail}`}
                        className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition"
                        title={`Email: ${candidateEmail}`}
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                    {candidatePhone && (
                      <a
                        href={`tel:${candidatePhone}`}
                        className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition"
                        title={`Call: ${candidatePhone}`}
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => setSelectedApplicant(applicant)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-600 hover:text-brand-700 text-xs font-bold rounded-xl transition shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Profile
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Candidate Details Modal */}
      <CandidateDetailsModal
        applicant={selectedApplicant}
        onClose={() => setSelectedApplicant(null)}
        onStatusChange={handleStatusChange}
        updatingStatus={updatingStatus}
      />
    </div>
  );
}
