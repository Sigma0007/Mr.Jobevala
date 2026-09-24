import React, { useState, useEffect } from "react";
import customerservice from "../../customer/customerservice";
import {
  ShieldAlert,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Trash2,
  Eye,
  X,
  Building2,
  Briefcase,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  ExternalLink,
  DollarSign,
  FileText,
  Check,
  Ban,
  RefreshCw,
  Loader2,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { workModeType } from "../../Utility/utilites";

const REASON_LABELS = {
  fraud: {
    label: "Fraud / Scam",
    color: "bg-rose-100 text-rose-800 border-rose-200",
  },
  money_demand: {
    label: "Demanding Money / Fees",
    color: "bg-amber-100 text-amber-800 border-amber-200",
  },
  fake_company: {
    label: "Fake Job / Company",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  spam: {
    label: "Spam / Duplicate",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  misleading: {
    label: "Misleading Details",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  inappropriate: {
    label: "Inappropriate Content",
    color: "bg-pink-100 text-pink-800 border-pink-200",
  },
  expired_or_unavailable: {
    label: "Expired / Closed",
    color: "bg-slate-100 text-slate-800 border-slate-200",
  },
  other: {
    label: "Other Issue",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
};

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    bg: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
  investigating: {
    label: "Investigating",
    bg: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  resolved: {
    label: "Resolved",
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  dismissed: {
    label: "Dismissed",
    bg: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
  },
};

export default function AdminReportsList() {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    investigatingReports: 0,
    resolvedReports: 0,
    dismissedReports: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Modal editing state
  const [editStatus, setEditStatus] = useState("pending");
  const [editActionTaken, setEditActionTaken] = useState("none");
  const [editAdminNotes, setEditAdminNotes] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = `?status=${statusFilter}&reason=${reasonFilter}&search=${encodeURIComponent(
        searchQuery
      )}`;
      const res = await customerservice.getAdminReports(params);
      if (res?.success) {
        setReports(res.reports || []);
        if (res.stats) {
          setStats(res.stats);
        }
      }
    } catch (err) {
      console.error("Error fetching admin reports:", err);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter, reasonFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReports();
  };

  const openInspectionModal = (report) => {
    setSelectedReport(report);
    setEditStatus(report.status || "pending");
    setEditActionTaken(report.actionTaken || "none");
    setEditAdminNotes(report.adminNotes || "");
  };

  const handleUpdateReport = async (e) => {
    if (e) e.preventDefault();
    if (!selectedReport) return;

    setIsUpdating(true);
    try {
      const res = await customerservice.updateAdminReport(selectedReport._id, {
        status: editStatus,
        actionTaken: editActionTaken,
        adminNotes: editAdminNotes,
      });

      if (res?.success) {
        toast.success("Report updated successfully");
        setSelectedReport(res.report);
        fetchReports();
      } else {
        toast.error(res?.message || "Failed to update report");
      }
    } catch (err) {
      console.error("Error updating report:", err);
      toast.error(err?.message || "Failed to update report");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteJob = async (reportId) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this reported job? All job applications will also be deleted, and the report will be marked as Resolved."
      )
    ) {
      return;
    }

    try {
      const res = await customerservice.deleteReportedJob(reportId);
      if (res?.success) {
        toast.success("Job permanently removed and report marked as resolved");
        if (selectedReport && selectedReport._id === reportId) {
          setSelectedReport(null);
        }
        fetchReports();
      } else {
        toast.error(res?.message || "Failed to remove reported job");
      }
    } catch (err) {
      console.error("Error deleting reported job:", err);
      toast.error(err?.message || "Failed to remove job");
    }
  };

  const handleDeleteReportEntry = async (reportId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this report record? (The job itself will not be removed)."
      )
    ) {
      return;
    }

    try {
      const res = await customerservice.deleteAdminReport(reportId);
      if (res?.success) {
        toast.success("Report record deleted");
        if (selectedReport && selectedReport._id === reportId) {
          setSelectedReport(null);
        }
        fetchReports();
      } else {
        toast.error(res?.message || "Failed to delete report");
      }
    } catch (err) {
      console.error("Error deleting report:", err);
      toast.error(err?.message || "Failed to delete report");
    }
  };

  return (
    <div className="space-y-6">
      {/* Metric KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Total Complaints
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 block">
            {stats.totalReports}
          </span>
        </div>

        <div className="bg-rose-50/70 p-4 sm:p-5 rounded-2xl border border-rose-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
              Pending Review
            </span>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-rose-950 mt-1 block">
            {stats.pendingReports}
          </span>
        </div>

        <div className="bg-amber-50/70 p-4 sm:p-5 rounded-2xl border border-amber-100 shadow-xs">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
            Investigating
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-950 mt-1 block">
            {stats.investigatingReports}
          </span>
        </div>

        <div className="bg-emerald-50/70 p-4 sm:p-5 rounded-2xl border border-emerald-100 shadow-xs">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
            Resolved
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-950 mt-1 block">
            {stats.resolvedReports}
          </span>
        </div>

        <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/70 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Dismissed
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-700 mt-1 block">
            {stats.dismissedReports}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
          {["all", "pending", "investigating", "resolved", "dismissed"].map(
            (st) => {
              const isActive = statusFilter === st;
              return (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {st}
                  {st === "pending" && stats.pendingReports > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px]">
                      {stats.pendingReports}
                    </span>
                  )}
                </button>
              );
            }
          )}
        </div>

        {/* Reason Filter & Search Form */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <select
            value={reasonFilter}
            onChange={(e) => setReasonFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Violation Types</option>
            <option value="fraud">Fraud / Scam</option>
            <option value="money_demand">Demanding Money / Fees</option>
            <option value="fake_company">Fake Company</option>
            <option value="spam">Spam / Duplicate</option>
            <option value="misleading">Misleading Details</option>
            <option value="inappropriate">Inappropriate Content</option>
            <option value="expired_or_unavailable">Expired / Closed</option>
            <option value="other">Other</option>
          </select>

          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job, company, user..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <button
              type="submit"
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition cursor-pointer"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={fetchReports}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </form>
        </div>
      </div>

      {/* Reports Table / List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm font-semibold text-slate-600">
              Loading complaints & reports...
            </p>
          </div>
        ) : reports.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No Reports Found
            </h3>
            <p className="text-xs text-slate-400 max-w-sm">
              There are no job reports matching the current filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Reported Job & Employer</th>
                  <th className="py-3.5 px-5">Reported By</th>
                  <th className="py-3.5 px-5">Reason & Details</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Date</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {reports.map((report) => {
                  const job = report.job || {};
                  const company = job.companyProfile || {};
                  const provider = job.provider || {};
                  const reporter = report.reporter || {};
                  const reasonInfo = REASON_LABELS[report.reason] || REASON_LABELS.other;
                  const statusInfo = STATUS_CONFIG[report.status] || STATUS_CONFIG.pending;

                  const isJobDeleted = !job._id;

                  return (
                    <tr
                      key={report._id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Job & Employer */}
                      <td className="py-4 px-5 max-w-xs">
                        {isJobDeleted ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                              <Ban className="w-3 h-3" /> Job Removed
                            </span>
                            <p className="text-xs text-slate-400 italic">
                              This job has been deleted from the database.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-slate-900 truncate">
                                {job.title}
                              </h4>
                              {job.status === "closed" && (
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                                  Closed
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span className="flex items-center gap-1 font-semibold text-slate-700 truncate">
                                <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                                {company.companyName || "No Company"}
                              </span>
                              <span>•</span>
                              <span className="truncate">
                                {job.location?.city || "Remote"}
                              </span>
                            </div>
                            {provider.email && (
                              <div className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                                <span>Employer:</span>
                                <span className="text-slate-600 font-medium truncate">
                                  {provider.name || provider.email}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Reported By */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-800 text-xs sm:text-sm">
                            {reporter.name || "User"}
                          </p>
                          <p className="text-xs text-slate-500 font-medium">
                            {reporter.email || report.contactEmail || "N/A"}
                          </p>
                          {reporter.role && (
                            <span className="inline-block text-[10px] font-semibold uppercase px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                              {reporter.role}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Reason & Excerpt */}
                      <td className="py-4 px-5 max-w-sm">
                        <div className="space-y-1.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${reasonInfo.color}`}
                          >
                            <ShieldAlert className="w-3 h-3" />
                            {reasonInfo.label}
                          </span>
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            "{report.description}"
                          </p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                          {statusInfo.label}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-5 whitespace-nowrap text-xs text-slate-500 font-medium">
                        {new Date(report.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openInspectionModal(report)}
                            className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                            title="Inspect Details & Take Action"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">Inspect</span>
                          </button>

                          {!isJobDeleted && (
                            <button
                              onClick={() => handleDeleteJob(report._id)}
                              className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs transition cursor-pointer"
                              title="Delete Spam Job"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Comprehensive Report & Job Inspection Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <div
            onClick={() => setSelectedReport(null)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] z-10 my-auto overflow-hidden">
            {/* Modal Header */}
            <div className="shrink-0 p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    Job Complaint Investigation
                  </h3>
                  <p className="text-xs text-slate-400">
                    Report ID: {selectedReport._id} • Filed on{" "}
                    {new Date(selectedReport.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-slate-50/50">
              {/* Top Banner: Reason & Description */}
              <div className="bg-white p-5 rounded-2xl border border-rose-200/80 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        (REASON_LABELS[selectedReport.reason] || REASON_LABELS.other).color
                      }`}
                    >
                      Violation: {(REASON_LABELS[selectedReport.reason] || REASON_LABELS.other).label}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        (STATUS_CONFIG[selectedReport.status] || STATUS_CONFIG.pending).bg
                      }`}
                    >
                      Status: {selectedReport.status}
                    </span>
                  </div>

                  {selectedReport.actionTaken && selectedReport.actionTaken !== "none" && (
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                      Action: {selectedReport.actionTaken.replace("_", " ")}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Complainant's Statement
                  </h4>
                  <p className="text-sm font-medium text-slate-800 mt-1 bg-rose-50/40 p-3 rounded-xl border border-rose-100/60 leading-relaxed whitespace-pre-line">
                    "{selectedReport.description}"
                  </p>
                </div>

                {(selectedReport.contactEmail || selectedReport.contactPhone || selectedReport.evidence) && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    {selectedReport.contactEmail && (
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{selectedReport.contactEmail}</span>
                      </div>
                    )}
                    {selectedReport.contactPhone && (
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{selectedReport.contactPhone}</span>
                      </div>
                    )}
                    {selectedReport.evidence && (
                      <div className="flex items-center gap-1.5 text-blue-600 font-semibold truncate sm:col-span-3">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="truncate">Proof: {selectedReport.evidence}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 2 Columns: Reported Job Details vs Provider / Company Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Column 1: Full Job Details */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Briefcase className="w-4 h-4 text-blue-600" /> Reported Job Details
                  </h4>

                  {selectedReport.job ? (
                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-slate-400 font-semibold block">Job Title</span>
                        <span className="text-sm font-bold text-slate-900 block mt-0.5">
                          {selectedReport.job.title}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-slate-400 font-semibold block">Job Type</span>
                          <span className="font-bold text-slate-700 capitalize">
                            {selectedReport.job.jobType || "Full-time"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold block">Vacancies</span>
                          <span className="font-bold text-slate-700">
                            {selectedReport.job.vacancies || 1}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-slate-400 font-semibold block">Location</span>
                          <span className="font-bold text-slate-700">
                            {selectedReport.job.location?.city || "Remote"}
                            {selectedReport.job.location?.state ? `, ${selectedReport.job.location.state}` : ""}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold block">Salary Range</span>
                          <span className="font-bold text-blue-600">
                            ₹{selectedReport.job.salary?.min?.toLocaleString()} - ₹{selectedReport.job.salary?.max?.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 font-semibold block">Job Description</span>
                        <p className="text-slate-600 mt-1 line-clamp-4 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          {selectedReport.job.description}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                        <span className="text-slate-400">
                          Job ID: <code className="text-slate-600">{selectedReport.job._id}</code>
                        </span>
                        <a
                          href={`/jobs/${selectedReport.job._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-bold flex items-center gap-1"
                        >
                          View Job Page <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-rose-600 font-semibold">
                      This job has already been deleted from the database.
                    </p>
                  )}
                </div>

                {/* Column 2: Provider & Company Information */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Building2 className="w-4 h-4 text-indigo-600" /> Employer / Company Profile
                  </h4>

                  {selectedReport.job?.companyProfile || selectedReport.job?.provider ? (
                    <div className="space-y-3 text-xs">
                      {/* Company Info */}
                      <div>
                        <span className="text-slate-400 font-semibold block">Company Name</span>
                        <span className="text-sm font-bold text-slate-900 block mt-0.5">
                          {selectedReport.job.companyProfile?.companyName || "Not Set"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-slate-400 font-semibold block">Industry</span>
                          <span className="font-bold text-slate-700 capitalize">
                            {selectedReport.job.companyProfile?.industry || "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold block">Company Size</span>
                          <span className="font-bold text-slate-700">
                            {selectedReport.job.companyProfile?.companySize ? `${selectedReport.job.companyProfile.companySize} Employees` : "N/A"}
                          </span>
                        </div>
                      </div>

                      {selectedReport.job.companyProfile?.website && (
                        <div>
                          <span className="text-slate-400 font-semibold block">Website</span>
                          <a
                            href={selectedReport.job.companyProfile.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline font-semibold flex items-center gap-1 truncate mt-0.5"
                          >
                            <Globe className="w-3 h-3" />
                            {selectedReport.job.companyProfile.website}
                          </a>
                        </div>
                      )}

                      {/* Recruiter User Account */}
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <span className="text-xs font-bold text-slate-700 block">
                          Posted By User Account
                        </span>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>{selectedReport.job.provider?.name || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{selectedReport.job.provider?.email || "N/A"}</span>
                          </div>
                          {selectedReport.job.provider?.phone && (
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{selectedReport.job.provider.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">
                      Company / Provider details not available.
                    </p>
                  )}
                </div>
              </div>

              {/* Reporter Info Strip */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block">Report Submitted By</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedReport.reporter?.name || "Anonymous User"}
                  </span>
                  <span className="text-slate-500 block">
                    {selectedReport.reporter?.email || selectedReport.contactEmail || "N/A"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 font-semibold block">User Role</span>
                  <span className="inline-block px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-700 capitalize mt-0.5">
                    {selectedReport.reporter?.role || "user"}
                  </span>
                </div>
              </div>

              {/* Admin Action & Resolution Form */}
              <form onSubmit={handleUpdateReport} className="bg-white p-5 rounded-2xl border border-blue-200 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <ShieldAlert className="w-4 h-4 text-blue-600" /> Admin Action & Resolution Controls
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Change Status */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Investigation Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="pending">Pending Review</option>
                      <option value="investigating">Investigating / In Progress</option>
                      <option value="resolved">Resolved (Action Taken)</option>
                      <option value="dismissed">Dismissed (No Violation)</option>
                    </select>
                  </div>

                  {/* Action Taken */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Action Taken
                    </label>
                    <select
                      value={editActionTaken}
                      onChange={(e) => setEditActionTaken(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="none">None (Under Review)</option>
                      <option value="job_removed">Job Removed / Deleted</option>
                      <option value="employer_warned">Employer Warned</option>
                      <option value="employer_deactivated">Employer Deactivated</option>
                      <option value="dismissed_valid_job">Dismissed - Valid Job Post</option>
                      <option value="other">Other Action</option>
                    </select>
                  </div>
                </div>

                {/* Admin Internal Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Internal Admin Notes
                  </label>
                  <textarea
                    rows={2}
                    value={editAdminNotes}
                    onChange={(e) => setEditAdminNotes(e.target.value)}
                    placeholder="Add internal notes about this report, contact made with employer, or reasons for decision..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    {selectedReport.job && (
                      <button
                        type="button"
                        onClick={() => handleDeleteJob(selectedReport._id)}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete & Take Down Job</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteReportEntry(selectedReport._id)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition cursor-pointer"
                    >
                      Delete Report Record
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Resolution</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
