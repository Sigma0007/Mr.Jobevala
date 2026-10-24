import React, { useState, useEffect } from "react";
import customerservice from "../../customer/customerservice";
import {
  X,
  AlertTriangle,
  ServerCrash,
  Cpu,
  Database,
  Code2,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  Globe,
  Terminal,
  Activity,
  User,
  Layers,
  Wrench,
  History,
  Loader2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";

const SEVERITY_CONFIG = {
  critical: {
    label: "Critical",
    badge: "bg-red-100 text-red-800 border-red-300",
    dot: "bg-red-500",
    cardBg: "bg-red-50/60 border-red-200",
  },
  high: {
    label: "High Severity",
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
  code_error: { label: "Code Exception", icon: Code2, color: "text-purple-600 bg-purple-50" },
  server_crash: { label: "Server Crash", icon: ServerCrash, color: "text-red-600 bg-red-50" },
  server_load: { label: "Server Load", icon: Cpu, color: "text-amber-600 bg-amber-50" },
  database_issue: { label: "MongoDB Issue", icon: Database, color: "text-emerald-600 bg-emerald-50" },
  api_error: { label: "API 500 Error", icon: Terminal, color: "text-indigo-600 bg-indigo-50" },
  security_issue: { label: "Security Alert", icon: ShieldAlert, color: "text-rose-600 bg-rose-50" },
  other: { label: "System Issue", icon: AlertTriangle, color: "text-slate-600 bg-slate-50" },
};

export default function SystemIssueDetailModal({ issueId, isOpen, onClose, onIssueUpdated }) {
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState("open");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [copiedStack, setCopiedStack] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (isOpen && issueId) {
      fetchIssueDetails();
    } else {
      setIssue(null);
      setResolutionNotes("");
    }
  }, [isOpen, issueId]);

  const fetchIssueDetails = async () => {
    try {
      setLoading(true);
      const res = await customerservice.getSystemIssueById(issueId);
      if (res && res.success && res.issue) {
        setIssue(res.issue);
        setStatus(res.issue.status || "open");
        setResolutionNotes(res.issue.resolutionNotes || "");
      } else {
        toast.error("Failed to load issue details");
      }
    } catch (err) {
      console.error("Error fetching issue details:", err);
      toast.error("Error loading issue details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      setUpdating(true);
      const res = await customerservice.updateSystemIssueStatus(issue._id, {
        status: newStatus,
        resolutionNotes,
      });

      if (res && res.success) {
        setIssue(res.issue);
        setStatus(res.issue.status);
        toast.success(`Issue updated to ${newStatus}`);
        if (onIssueUpdated) onIssueUpdated(res.issue);
      } else {
        toast.error(res?.message || "Failed to update issue status");
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update issue status");
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveResolution = async () => {
    try {
      setUpdating(true);
      const res = await customerservice.updateSystemIssueStatus(issue._id, {
        status,
        resolutionNotes,
      });

      if (res && res.success) {
        setIssue(res.issue);
        toast.success("Resolution notes saved successfully");
        if (onIssueUpdated) onIssueUpdated(res.issue);
      } else {
        toast.error(res?.message || "Failed to save resolution notes");
      }
    } catch (err) {
      console.error("Failed to save resolution:", err);
      toast.error("Failed to save resolution");
    } finally {
      setUpdating(false);
    }
  };

  const copyToClipboard = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === "stack") {
      setCopiedStack(true);
      setTimeout(() => setCopiedStack(false), 2000);
      toast.success("Stack trace copied to clipboard");
    } else {
      setCopiedMsg(true);
      setTimeout(() => setCopiedMsg(false), 2000);
      toast.success("Error message copied to clipboard");
    }
  };

  if (!isOpen) return null;

  const typeConfig = TYPE_CONFIG[issue?.type] || TYPE_CONFIG.other;
  const TypeIcon = typeConfig.icon;
  const severityConfig = SEVERITY_CONFIG[issue?.severity] || SEVERITY_CONFIG.medium;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5 flex-1 min-w-0">
            <div className={`p-2.5 rounded-xl border border-slate-200/80 shrink-0 ${typeConfig.color}`}>
              <TypeIcon size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${severityConfig.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${severityConfig.dot} animate-pulse`} />
                  {severityConfig.label}
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  {typeConfig.label}
                </span>

                {issue?.occurrenceCount > 1 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                    Occurred {issue.occurrenceCount} times
                  </span>
                )}

                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                  issue?.status === "resolved"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : issue?.status === "investigating"
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : issue?.status === "ignored"
                    ? "bg-slate-100 text-slate-600 border border-slate-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}>
                  Status: {issue?.status || "open"}
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 truncate" title={issue?.title}>
                {issue?.title || "Issue Diagnostics & Details"}
              </h2>

              <p className="text-xs text-slate-500 mt-0.5">
                First seen: {issue?.firstOccurredAt ? new Date(issue.firstOccurredAt).toLocaleString() : "Unknown"} 
                {issue?.lastOccurredAt && ` • Latest: ${new Date(issue.lastOccurredAt).toLocaleString()}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-5 bg-white space-x-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Activity size={16} />
            Diagnostic & Trace
          </button>
          <button
            onClick={() => setActiveTab("context")}
            className={`py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === "context"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Layers size={16} />
            System & Environment
          </button>
          <button
            onClick={() => setActiveTab("troubleshoot")}
            className={`py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === "troubleshoot"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Wrench size={16} />
            Resolution & Solution
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="animate-spin text-blue-600 mb-3" size={32} />
              <p className="text-sm font-medium">Loading issue diagnostic details...</p>
            </div>
          ) : !issue ? (
            <div className="py-20 text-center text-slate-500">
              <AlertTriangle className="mx-auto text-amber-500 mb-2" size={32} />
              <p>Issue record not found or has been removed.</p>
            </div>
          ) : (
            <>
              {/* Quick Status Action Bar */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <span>Manage Status:</span>
                  <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-xs">
                    {["open", "investigating", "resolved", "ignored"].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(st)}
                        disabled={updating}
                        className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-all cursor-pointer ${
                          status === st
                            ? st === "resolved"
                              ? "bg-emerald-600 text-white shadow-xs"
                              : st === "investigating"
                              ? "bg-amber-500 text-white shadow-xs"
                              : st === "ignored"
                              ? "bg-slate-600 text-white shadow-xs"
                              : "bg-rose-600 text-white shadow-xs"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {issue.status === "resolved" && issue.resolvedBy && (
                  <div className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 size={15} />
                    <span>
                      Resolved by <strong>{issue.resolvedBy.name || "Admin"}</strong> on{" "}
                      {new Date(issue.resolvedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* TAB 1: Overview & Trace */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Error Message Box */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Terminal size={14} /> Error Message
                      </label>
                      <button
                        onClick={() => copyToClipboard(issue.message, "msg")}
                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer font-medium"
                      >
                        {copiedMsg ? <Check size={13} /> : <Copy size={13} />}
                        {copiedMsg ? "Copied" : "Copy Message"}
                      </button>
                    </div>
                    <div className="p-3.5 bg-rose-50/70 border border-rose-200 text-rose-900 rounded-xl text-sm font-mono leading-relaxed break-words whitespace-pre-wrap">
                      {issue.message || "No error message provided."}
                    </div>
                  </div>

                  {/* Stack Trace Box */}
                  {issue.stackTrace ? (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                          <Code2 size={14} /> Stack Trace & Code Origin
                        </label>
                        <button
                          onClick={() => copyToClipboard(issue.stackTrace, "stack")}
                          className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer font-medium"
                        >
                          {copiedStack ? <Check size={13} /> : <Copy size={13} />}
                          {copiedStack ? "Copied Stack" : "Copy Stack"}
                        </button>
                      </div>
                      <div className="p-4 bg-slate-950 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto max-h-80 border border-slate-800 leading-relaxed scrollbar-thin">
                        <pre>{issue.stackTrace}</pre>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 italic">
                      No stack trace recorded (system event or server resource alert).
                    </div>
                  )}

                  {/* Source / Endpoint Quick Context */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-xs font-semibold text-slate-500 block mb-1">Source / Origin</span>
                      <span className="text-sm font-mono text-slate-800 break-all">
                        {issue.source || issue.endpoint || "Internal System"}
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-xs font-semibold text-slate-500 block mb-1">HTTP Endpoint & Method</span>
                      <span className="text-sm font-mono text-slate-800">
                        {issue.method ? (
                          <span className="font-bold text-blue-600 mr-1.5">{issue.method}</span>
                        ) : null}
                        {issue.endpoint || "N/A (Process Event)"}
                        {issue.statusCode ? ` (${issue.statusCode})` : ""}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: System & Environment */}
              {activeTab === "context" && (
                <div className="space-y-6">
                  {/* System Hardware Snapshot */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Cpu size={16} className="text-blue-600" />
                      Server Resource Snapshot (At Incident Time)
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-xs text-slate-500 block">CPU Load</span>
                        <span className="text-base font-bold text-slate-900">
                          {issue.systemMetrics?.cpuUsagePercent ?? 0}%
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-xs text-slate-500 block">Memory (RAM)</span>
                        <span className="text-base font-bold text-slate-900">
                          {issue.systemMetrics?.memoryUsagePercent ?? 0}%
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          {issue.systemMetrics?.memoryUsedMB || 0} MB / {issue.systemMetrics?.memoryTotalMB || 0} MB
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-xs text-slate-500 block">Process Uptime</span>
                        <span className="text-base font-bold text-slate-900">
                          {issue.systemMetrics?.processUptime
                            ? `${Math.round(issue.systemMetrics.processUptime / 60)} mins`
                            : "N/A"}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-xs text-slate-500 block">Environment</span>
                        <span className="text-sm font-bold text-slate-900 truncate block">
                          {issue.systemMetrics?.nodeVersion || process.version || "Node.js"}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          {issue.systemMetrics?.platform || "OS"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Database Snapshot */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Database size={16} className="text-emerald-600" />
                      MongoDB Database State (At Incident Time)
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-xs text-slate-500 block">Connection State</span>
                        <span className={`text-sm font-bold capitalize ${
                          issue.databaseMetrics?.dbState === "connected"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}>
                          {issue.databaseMetrics?.dbState || "Unknown"}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-xs text-slate-500 block">Ping Latency</span>
                        <span className="text-base font-bold text-slate-900">
                          {issue.databaseMetrics?.pingMs ? `${issue.databaseMetrics.pingMs} ms` : "N/A"}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-xs text-slate-500 block">Database Data Size</span>
                        <span className="text-base font-bold text-slate-900">
                          {issue.databaseMetrics?.dataSizeMB ? `${issue.databaseMetrics.dataSizeMB} MB` : "N/A"}
                        </span>
                        {issue.databaseMetrics?.storageSizeMB > 0 && (
                          <span className="text-[11px] text-slate-500 block">
                            Storage: {issue.databaseMetrics.storageSizeMB} MB
                          </span>
                        )}
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-xs text-slate-500 block">Collections</span>
                        <span className="text-base font-bold text-slate-900">
                          {issue.databaseMetrics?.collectionsCount || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Request & Client Info */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Globe size={16} className="text-indigo-600" />
                      Client Request & User Context
                    </h3>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-200/60">
                        <span className="text-slate-500">Triggered User:</span>
                        <span className="font-semibold text-slate-900">
                          {issue.user ? `${issue.user.name} (${issue.user.email}) - ${issue.user.role}` : "Anonymous / Guest / Background"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200/60">
                        <span className="text-slate-500">Client IP Address:</span>
                        <span className="font-mono text-slate-800">{issue.clientIp || "N/A"}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">User Agent:</span>
                        <span className="font-mono text-slate-800 truncate max-w-md" title={issue.userAgent}>
                          {issue.userAgent || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Resolution & Troubleshooting */}
              {activeTab === "troubleshoot" && (
                <div className="space-y-6">
                  {/* Smart Automated Solution Advice */}
                  <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl">
                    <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-2">
                      <Sparkles size={16} className="text-blue-600" />
                      Suggested Admin Solution & Troubleshooting Guide
                    </div>
                    <div className="text-xs text-blue-950 space-y-1.5 leading-relaxed">
                      {issue.type === "database_issue" ? (
                        <>
                          <p>• <strong>Check MongoDB Connection:</strong> Verify MongoDB URI in <code>backend/.env</code> and check MongoDB Atlas cluster connectivity.</p>
                          <p>• <strong>Storage Limit Check:</strong> If the database is full, upgrade your MongoDB tier, delete unused old documents, or compact indexes.</p>
                          <p>• <strong>Network IP Whitelist:</strong> Ensure your server host IP or <code>0.0.0.0/0</code> is allowed in MongoDB Atlas Network Access.</p>
                        </>
                      ) : issue.type === "server_load" ? (
                        <>
                          <p>• <strong>High Memory (RAM) Consumption:</strong> Check for unbounded memory leaks, open streams, or heavy unpaginated queries.</p>
                          <p>• <strong>Node Memory Flag:</strong> You can increase Node.js heap limit using <code>--max-old-space-size=4096</code> in start scripts.</p>
                          <p>• <strong>High CPU:</strong> Review CPU-intensive tasks such as image cropping, PDF generation, or infinite loops.</p>
                        </>
                      ) : issue.type === "server_crash" ? (
                        <>
                          <p>• <strong>Crash Prevention:</strong> Look at the uncaught exception in the trace above. Wrap async promises in <code>try/catch</code> blocks.</p>
                          <p>• <strong>Process Manager:</strong> Ensure the server runs with a process manager like PM2 or Docker so it auto-restarts on any fatal failure.</p>
                        </>
                      ) : (
                        <>
                          <p>• <strong>Null/Undefined Reference:</strong> Check line numbers in the stack trace for properties accessed on <code>null</code> or <code>undefined</code>.</p>
                          <p>• <strong>Request Validation:</strong> Ensure route controllers validate <code>req.body</code> and query parameters before processing.</p>
                          <p>• <strong>Third-party APIs:</strong> If calling external services (Email, Razorpay, SMS), ensure timeouts and fallback error handling are active.</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Admin Resolution Notes Editor */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                      <span>Admin Resolution Notes & Fix Summary</span>
                      <span className="text-[11px] text-slate-400 font-normal">Document what was done to fix this issue</span>
                    </label>
                    <textarea
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      placeholder="e.g. Added null check in otpController.js line 45 and restarted the backend service. Verified registration flow works now."
                      rows={4}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
                    />

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={handleSaveResolution}
                        disabled={updating}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
                      >
                        {updating ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                        Save Notes & Update
                      </button>
                    </div>
                  </div>

                  {/* Audit / Action History */}
                  {issue.history && issue.history.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                        <History size={14} /> Audit Trail & Status History
                      </h4>
                      <div className="space-y-2">
                        {issue.history.map((h, i) => (
                          <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-start justify-between">
                            <div>
                              <span className="font-semibold text-slate-800">{h.action}</span>
                              {h.note && <p className="text-slate-600 mt-0.5 italic">"{h.note}"</p>}
                            </div>
                            <span className="text-slate-400 shrink-0 text-[11px]">
                              {new Date(h.timestamp).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Issue ID: <code className="font-mono text-slate-700">{issue?._id}</code>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              Close
            </button>
            {issue?.status !== "resolved" && (
              <button
                onClick={() => handleUpdateStatus("resolved")}
                disabled={updating}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
              >
                <CheckCircle2 size={14} />
                Mark Resolved
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
