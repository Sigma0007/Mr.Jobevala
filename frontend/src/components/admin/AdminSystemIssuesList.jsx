import React, { useState, useEffect, useCallback } from "react";
import customerservice from "../../customer/customerservice";
import { useSocket } from "../../context/SocketContext";
import {
  AlertTriangle,
  ServerCrash,
  Cpu,
  Database,
  Code2,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Trash2,
  Eye,
  RefreshCw,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  Zap,
  HardDrive,
  X,
  PlayCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertOctagon,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import SystemIssueDetailModal from "./SystemIssueDetailModal";

const SEVERITY_CONFIG = {
  critical: {
    label: "Critical",
    badge: "bg-red-100 text-red-800 border-red-300",
    dot: "bg-red-500",
    cardBg: "bg-red-50/60 border-red-200",
  },
  high: {
    label: "High",
    badge: "bg-orange-100 text-orange-800 border-orange-300",
    dot: "bg-orange-500",
    cardBg: "bg-orange-50/60 border-orange-200",
  },
  medium: {
    label: "Medium",
    badge: "bg-amber-100 text-amber-800 border-amber-300",
    dot: "bg-amber-500",
    cardBg: "bg-amber-50/60 border-amber-200",
  },
  low: {
    label: "Low",
    badge: "bg-blue-100 text-blue-800 border-blue-300",
    dot: "bg-blue-500",
    cardBg: "bg-blue-50/60 border-blue-200",
  },
};

const TYPE_CONFIG = {
  code_error: { label: "Code Error", icon: Code2, color: "text-purple-600 bg-purple-50" },
  server_crash: { label: "Crash / Exception", icon: ServerCrash, color: "text-red-600 bg-red-50" },
  server_load: { label: "Server Load", icon: Cpu, color: "text-amber-600 bg-amber-50" },
  database_issue: { label: "MongoDB / DB", icon: Database, color: "text-emerald-600 bg-emerald-50" },
  api_error: { label: "API 500", icon: Terminal, color: "text-indigo-600 bg-indigo-50" },
  security_issue: { label: "Security", icon: ShieldAlert, color: "text-rose-600 bg-rose-50" },
  other: { label: "General Issue", icon: AlertTriangle, color: "text-slate-600 bg-slate-50" },
};

export default function AdminSystemIssuesList() {
  const { socket } = useSocket();

  // State
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({
    totalCount: 0,
    openCount: 0,
    investigatingCount: 0,
    criticalCount: 0,
    highCount: 0,
    resolvedCount: 0,
    todayCount: 0,
  });
  const [liveHealth, setLiveHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshingHealth, setRefreshingHealth] = useState(false);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [simulateModalOpen, setSimulateModalOpen] = useState(false);
  const [simulating, setSimulating] = useState(false);

  // Simulation form
  const [simData, setSimData] = useState({
    type: "code_error",
    severity: "high",
    title: "TypeError: Cannot read properties of undefined in otpController.js",
    message: "Unhandled runtime exception occurred during user verification workflow.",
  });

  // Fetch Live Server Health
  const fetchLiveHealth = useCallback(async () => {
    try {
      setRefreshingHealth(true);
      const res = await customerservice.getLiveHealth();
      if (res && res.success && res.health) {
        setLiveHealth(res.health);
      }
    } catch (err) {
      console.error("Failed to fetch live health:", err);
    } finally {
      setRefreshingHealth(false);
    }
  }, []);

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await customerservice.getSystemIssueStats();
      if (res && res.success && res.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error("Failed to fetch issue stats:", err);
    }
  }, []);

  // Fetch Issues List
  const fetchIssues = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", 15);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (severityFilter !== "all") params.append("severity", severityFilter);
      if (typeFilter !== "all") params.append("type", typeFilter);
      if (search.trim()) params.append("search", search.trim());

      const res = await customerservice.getSystemIssues(`?${params.toString()}`);
      if (res && res.success) {
        setIssues(res.issues || []);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.totalCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch system issues:", err);
      toast.error("Failed to load system issues");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, severityFilter, typeFilter, search]);

  // Initial load
  useEffect(() => {
    fetchLiveHealth();
    fetchStats();
  }, [fetchLiveHealth, fetchStats]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  // Real-time socket listener for new system issues
  useEffect(() => {
    if (!socket) return;

    const handleSystemIssueAlert = (data) => {
      // Toast notification for admin
      if (data?.issue?.severity === "critical" || data?.issue?.severity === "high") {
        toast.error(
          `System Alert: ${data.issue.title || "Critical system event detected!"}`,
          { duration: 6000 }
        );
      }
      // Re-fetch issues and stats
      fetchIssues();
      fetchStats();
      fetchLiveHealth();
    };

    socket.on("system_issue_alert", handleSystemIssueAlert);

    return () => {
      socket.off("system_issue_alert", handleSystemIssueAlert);
    };
  }, [socket, fetchIssues, fetchStats, fetchLiveHealth]);

  // Quick Resolve
  const handleQuickResolve = async (issueId) => {
    try {
      const res = await customerservice.updateSystemIssueStatus(issueId, {
        status: "resolved",
        resolutionNotes: "Quick resolved by Administrator from monitoring panel",
      });
      if (res && res.success) {
        toast.success("Issue marked as resolved");
        fetchIssues();
        fetchStats();
      }
    } catch (err) {
      toast.error("Failed to update issue status");
    }
  };

  // Delete Issue
  const handleDelete = async (issueId) => {
    if (!window.confirm("Are you sure you want to permanently delete this issue log?")) return;
    try {
      const res = await customerservice.deleteSystemIssue(issueId);
      if (res && res.success) {
        toast.success("Issue log deleted");
        fetchIssues();
        fetchStats();
      }
    } catch (err) {
      toast.error("Failed to delete issue log");
    }
  };

  // Clear Resolved
  const handleClearResolved = async () => {
    if (!window.confirm("Delete all resolved and ignored issue logs to free up space?")) return;
    try {
      const res = await customerservice.clearResolvedSystemIssues();
      if (res && res.success) {
        toast.success(res.message || "Resolved issue logs cleared");
        fetchIssues();
        fetchStats();
      }
    } catch (err) {
      toast.error("Failed to clear resolved issues");
    }
  };

  // Trigger Simulation
  const handleSimulate = async (e) => {
    e.preventDefault();
    try {
      setSimulating(true);
      const res = await customerservice.simulateTestIssue(simData);
      if (res && res.success) {
        toast.success("Simulated test issue triggered and logged!");
        setSimulateModalOpen(false);
        fetchIssues();
        fetchStats();
      } else {
        toast.error(res?.message || "Simulation failed");
      }
    } catch (err) {
      toast.error("Failed to simulate issue");
    } finally {
      setSimulating(false);
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setSeverityFilter("all");
    setTypeFilter("all");
    setPage(1);
  };

  const formatUptime = (seconds) => {
    if (!seconds) return "N/A";
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m ${seconds % 60}s`;
  };

  const getHealthStatusBadge = (status) => {
    if (status === "healthy") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          System Healthy
        </span>
      );
    }
    if (status === "warning") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Elevated Load / Warning
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
        Critical Alert
      </span>
    );
  };

  return (
    <div className="space-y-6">

      {/* 1. LIVE SERVER & DATABASE HEALTH MONITOR BAR */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <Activity size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Live System & Server Health</h2>
                {liveHealth && getHealthStatusBadge(liveHealth.status)}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time node process diagnostics, memory allocation, CPU utilization & MongoDB cluster status
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={fetchLiveHealth}
              disabled={refreshingHealth}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
            >
              <RefreshCw size={14} className={refreshingHealth ? "animate-spin" : ""} />
              Refresh Health
            </button>

            <button
              onClick={() => setSimulateModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Zap size={14} />
              Simulate Test Error
            </button>

            <button
              onClick={handleClearResolved}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-rose-50 hover:text-rose-700 text-slate-600 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Trash2 size={14} />
              Clear Resolved
            </button>
          </div>
        </div>

        {/* Live Gauges & Metric Cards */}
        {liveHealth ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            {/* CPU Load */}
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                <span className="font-semibold flex items-center gap-1.5">
                  <Cpu size={14} className="text-blue-600" /> CPU Load
                </span>
                <span className="font-bold text-slate-900">{liveHealth.system.cpuUsagePercent}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    liveHealth.system.cpuUsagePercent >= 80 ? "bg-red-500" : liveHealth.system.cpuUsagePercent >= 60 ? "bg-amber-500" : "bg-blue-600"
                  }`}
                  style={{ width: `${Math.min(100, liveHealth.system.cpuUsagePercent)}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {liveHealth.system.platform}
              </span>
            </div>

            {/* Server Memory / RAM */}
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                <span className="font-semibold flex items-center gap-1.5">
                  <Layers size={14} className="text-purple-600" /> RAM Memory
                </span>
                <span className="font-bold text-slate-900">{liveHealth.system.memoryUsagePercent}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    liveHealth.system.memoryUsagePercent >= 85 ? "bg-red-500" : liveHealth.system.memoryUsagePercent >= 70 ? "bg-amber-500" : "bg-purple-600"
                  }`}
                  style={{ width: `${Math.min(100, liveHealth.system.memoryUsagePercent)}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Used: {liveHealth.system.memoryUsedMB} MB / {liveHealth.system.memoryTotalMB} MB
              </span>
            </div>

            {/* MongoDB Database State & Size */}
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold flex items-center gap-1.5">
                  <Database size={14} className="text-emerald-600" /> MongoDB Cluster
                </span>
                <span className={`font-bold capitalize ${
                  liveHealth.database.dbState === "connected" ? "text-emerald-600" : "text-red-600"
                }`}>
                  {liveHealth.database.dbState}
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-sm font-bold text-slate-800">
                  {liveHealth.database.dataSizeMB} MB <span className="text-[11px] font-normal text-slate-500">Data</span>
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {liveHealth.database.pingMs}ms latency
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Storage: {liveHealth.database.storageSizeMB || 0} MB • {liveHealth.database.collectionsCount || 0} Collections
              </span>
            </div>

            {/* Uptime & Environment */}
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold flex items-center gap-1.5">
                  <Clock size={14} className="text-amber-600" /> Process Uptime
                </span>
                <span className="font-mono text-xs font-semibold text-slate-700">
                  {liveHealth.system.nodeVersion}
                </span>
              </div>
              <div className="text-base font-bold text-slate-900 mt-1">
                {formatUptime(liveHealth.system.processUptime)}
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Live background monitoring active
              </span>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-slate-400 text-xs">
            Loading real-time health metrics...
          </div>
        )}
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Critical</span>
            <AlertOctagon size={16} className="text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.criticalCount}</div>
          <span className="text-[11px] text-slate-400">Needs instant attention</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">High Severity</span>
            <AlertTriangle size={16} className="text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-orange-600">{stats.highCount}</div>
          <span className="text-[11px] text-slate-400">Server & code errors</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Open Issues</span>
            <Activity size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{stats.openCount}</div>
          <span className="text-[11px] text-slate-400">Pending resolution</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Investigating</span>
            <Clock size={16} className="text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.investigatingCount}</div>
          <span className="text-[11px] text-slate-400">Under review</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Resolved</span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{stats.resolvedCount}</div>
          <span className="text-[11px] text-slate-400">Successfully fixed</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Today's Logs</span>
            <Zap size={16} className="text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-indigo-600">{stats.todayCount}</div>
          <span className="text-[11px] text-slate-400">Occurred today</span>
        </div>
      </div>

      {/* 3. FILTERS & SEARCH */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by error title, message, endpoint (e.g. /api/auth) or source..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open Only</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="ignored">Ignored</option>
          </select>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => {
              setSeverityFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Issue Types</option>
            <option value="code_error">Code Exception</option>
            <option value="server_crash">Server Crash</option>
            <option value="server_load">Server Load / RAM</option>
            <option value="database_issue">MongoDB / Database</option>
            <option value="api_error">API 500 Error</option>
            <option value="security_issue">Security Alert</option>
          </select>

          {(search || statusFilter !== "all" || severityFilter !== "all" || typeFilter !== "all") && (
            <button
              onClick={handleResetFilters}
              className="px-3 py-2 text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer whitespace-nowrap"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* 4. ISSUES LIST TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="animate-spin text-blue-600 mb-3" size={32} />
            <p className="text-sm font-medium">Loading system issues...</p>
          </div>
        ) : issues.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-emerald-100">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-base font-bold text-slate-900">No System Issues Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Your server, MongoDB database, and APIs are operating smoothly. No matching error logs or alerts recorded.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Severity & Type</th>
                  <th className="py-3.5 px-4">Issue Title & Message</th>
                  <th className="py-3.5 px-4">Source / Endpoint</th>
                  <th className="py-3.5 px-4">Repeats</th>
                  <th className="py-3.5 px-4">Last Seen</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {issues.map((item) => {
                  const severityConfig = SEVERITY_CONFIG[item.severity] || SEVERITY_CONFIG.medium;
                  const typeConfig = TYPE_CONFIG[item.type] || TYPE_CONFIG.other;
                  const TypeIcon = typeConfig.icon;

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={() => {
                        setSelectedIssueId(item._id);
                        setDetailModalOpen(true);
                      }}
                    >
                      {/* Severity & Type */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1.5 items-start">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${severityConfig.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${severityConfig.dot} animate-pulse`} />
                            {severityConfig.label}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                            <TypeIcon size={12} className={typeConfig.color} />
                            {typeConfig.label}
                          </span>
                        </div>
                      </td>

                      {/* Title & Message */}
                      <td className="py-4 px-4 max-w-xs sm:max-w-md">
                        <div className="font-semibold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </div>
                        <div className="text-xs text-slate-500 line-clamp-1 font-mono mt-0.5">
                          {item.message}
                        </div>
                        {item.resolutionNotes && (
                          <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
                            <CheckCircle2 size={11} />
                            <span className="truncate">Fix: {item.resolutionNotes}</span>
                          </div>
                        )}
                      </td>

                      {/* Source / Endpoint */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-mono text-xs text-slate-700 max-w-[180px] truncate" title={item.endpoint || item.source}>
                          {item.method && (
                            <span className="font-bold text-blue-600 mr-1">{item.method}</span>
                          )}
                          {item.endpoint || item.source || "Server"}
                        </div>
                        {item.statusCode ? (
                          <span className="text-[10px] text-slate-400 font-mono">
                            HTTP {item.statusCode}
                          </span>
                        ) : null}
                      </td>

                      {/* Occurrence Counter */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {item.occurrenceCount > 1 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            {item.occurrenceCount}x
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">1x</span>
                        )}
                      </td>

                      {/* Last Seen */}
                      <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500">
                        <span title={new Date(item.lastOccurredAt).toLocaleString()}>
                          {new Date(item.lastOccurredAt).toLocaleDateString()}
                        </span>
                        <span className="block text-[11px] text-slate-400">
                          {new Date(item.lastOccurredAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={item.status}
                          onChange={(e) => {
                            customerservice.updateSystemIssueStatus(item._id, {
                              status: e.target.value,
                            }).then((res) => {
                              if (res && res.success) {
                                toast.success(`Issue marked as ${e.target.value}`);
                                fetchIssues();
                                fetchStats();
                              }
                            });
                          }}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer capitalize ${
                            item.status === "resolved"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                              : item.status === "investigating"
                              ? "bg-amber-50 text-amber-700 border-amber-300"
                              : item.status === "ignored"
                              ? "bg-slate-100 text-slate-600 border-slate-300"
                              : "bg-rose-50 text-rose-700 border-rose-300"
                          }`}
                        >
                          <option value="open">Open</option>
                          <option value="investigating">Investigating</option>
                          <option value="resolved">Resolved</option>
                          <option value="ignored">Ignored</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setSelectedIssueId(item._id);
                              setDetailModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="View Stack Trace & Details"
                          >
                            <Eye size={16} />
                          </button>

                          {item.status !== "resolved" && (
                            <button
                              onClick={() => handleQuickResolve(item._id)}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="Quick Mark Resolved"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Issue Log"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Showing {issues.length} of {totalCount} logged issues
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-3 py-1 font-semibold text-slate-800">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. ISSUE DETAILS MODAL */}
      <SystemIssueDetailModal
        issueId={selectedIssueId}
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedIssueId(null);
        }}
        onIssueUpdated={() => {
          fetchIssues();
          fetchStats();
        }}
      />

      {/* 6. SIMULATE TEST ISSUE MODAL */}
      {simulateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Simulate Test System Issue</h3>
                  <p className="text-xs text-slate-500">Test error logging, stack trace capture, and real-time alerts</p>
                </div>
              </div>
              <button
                onClick={() => setSimulateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSimulate} className="p-5 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Issue Type</label>
                <select
                  value={simData.type}
                  onChange={(e) => setSimData({ ...simData, type: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="code_error">Code Error (TypeError / Exception)</option>
                  <option value="server_crash">Server Crash (Uncaught Rejection)</option>
                  <option value="server_load">Server Load (High RAM / CPU)</option>
                  <option value="database_issue">MongoDB Database Issue / Connection Drop</option>
                  <option value="api_error">API 500 Internal Error</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Severity Level</label>
                <select
                  value={simData.severity}
                  onChange={(e) => setSimData({ ...simData, severity: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="critical">Critical (Highest Alert)</option>
                  <option value="high">High Severity</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Issue Title</label>
                <input
                  type="text"
                  required
                  value={simData.title}
                  onChange={(e) => setSimData({ ...simData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Error Message / Diagnostic Summary</label>
                <textarea
                  required
                  rows={3}
                  value={simData.message}
                  onChange={(e) => setSimData({ ...simData, message: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSimulateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={simulating}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {simulating ? <Loader2 size={14} className="animate-spin" /> : <PlayCircle size={14} />}
                  Trigger Simulation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
