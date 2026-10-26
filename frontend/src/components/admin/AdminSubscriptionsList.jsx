import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  Filter,
  User,
  Mail,
  Phone,
  Calendar,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  TrendingUp,
  AlertCircle,
  Eye,
  Ban,
  Sparkles,
  ArrowUpRight,
  IndianRupee,
  Download,
} from "lucide-react";
import toast from "react-hot-toast";
import customerservice from "../../customer/customerservice";
import SubscriptionModal from "../Modals/SubscriptionModal";

export default function AdminSubscriptionsList() {
  const [activeTab, setActiveTab] = useState("subscriptions"); // "subscriptions" | "payments"
  const [subscriptions, setSubscriptions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDownloadInvoice = async (item, type = "payment") => {
    try {
      toast.loading("Fetching invoice PDF...", { id: "admin-inv-toast" });
      let invoiceUrl = import.meta.env.VITE_API_URL + item.invoiceUrl;

      if (!invoiceUrl) {
        const id = item._id;
        const res =
          type === "subscription"
            ? await customerservice.getSubscriptionInvoice(id)
            : await customerservice.getPaymentInvoice(id);

        if (res?.success && res.invoiceUrl) {
          invoiceUrl = res.invoiceUrl;
        } else {
          throw new Error(
            res?.message || "Invoice is being generated. Please retry.",
          );
        }
      }

      toast.dismiss("admin-inv-toast");
      if (invoiceUrl) {
        window.open(invoiceUrl, "_blank", "noopener,noreferrer");
        toast.success("Invoice opened!");
      }
    } catch (err) {
      toast.dismiss("admin-inv-toast");
      console.error("Admin invoice open error:", err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Could not retrieve invoice.",
      );
    }
  };

  // Pagination & Search & Filtering
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Summary statistics
  const [subStats, setSubStats] = useState([]);
  const [paymentStats, setPaymentStats] = useState([]);
  const [totalAllSubs, setTotalAllSubs] = useState(0);
  const [totalAllPayments, setTotalAllPayments] = useState(0);

  // Modal inspection
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState("");

  // Copy helper
  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(""), 2000);
  };

  // Fetch Subscriptions
  const fetchSubscriptions = useCallback(
    async (
      targetPage = 1,
      currentSearch = search,
      currentStatus = statusFilter,
    ) => {
      setLoading(true);
      try {
        let query = `?page=${targetPage}&limit=${limit}`;
        if (currentStatus && currentStatus !== "all") {
          query += `&status=${encodeURIComponent(currentStatus)}`;
        }
        if (currentSearch && currentSearch.trim()) {
          query += `&search=${encodeURIComponent(currentSearch.trim())}`;
        }

        const res = await customerservice.getAllSubscriptionsAdmin(query);
        if (res?.success) {
          setSubscriptions(res.data || []);
          setTotalPages(res.totalPages || 1);
          setTotalCount(res.total || 0);
          setTotalAllSubs(res.totalAll || res.total || 0);
          setSubStats(res.stats || []);
          setPage(res.page || 1);
        }
      } catch (err) {
        console.error("Failed to fetch admin subscriptions:", err);
        toast.error("Failed to load subscriptions list.");
      } finally {
        setLoading(false);
      }
    },
    [limit, search, statusFilter],
  );

  // Fetch Payments
  const fetchPayments = useCallback(
    async (
      targetPage = 1,
      currentSearch = search,
      currentStatus = statusFilter,
    ) => {
      setLoading(true);
      try {
        let query = `?page=${targetPage}&limit=${limit}`;
        if (currentStatus && currentStatus !== "all") {
          query += `&status=${encodeURIComponent(currentStatus)}`;
        }
        if (currentSearch && currentSearch.trim()) {
          query += `&search=${encodeURIComponent(currentSearch.trim())}`;
        }

        const res = await customerservice.getAllPaymentsAdmin(query);
        if (res?.success) {
          setPayments(res.data || []);
          setTotalPages(res.totalPages || 1);
          setTotalCount(res.total || 0);
          setTotalAllPayments(res.totalAll || res.total || 0);
          setPaymentStats(res.stats || []);
          setPage(res.page || 1);
        }
      } catch (err) {
        console.error("Failed to fetch admin payments:", err);
        toast.error("Failed to load payment transactions.");
      } finally {
        setLoading(false);
      }
    },
    [limit, search, statusFilter],
  );

  // Trigger fetch on tab, page, filter changes
  useEffect(() => {
    if (activeTab === "subscriptions") {
      fetchSubscriptions(page, search, statusFilter);
    } else {
      fetchPayments(page, search, statusFilter);
    }
  }, [activeTab, page, statusFilter, fetchSubscriptions, fetchPayments]);

  // Handle Search Input with debounce/submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    if (activeTab === "subscriptions") {
      fetchSubscriptions(1, search, statusFilter);
    } else {
      fetchPayments(1, search, statusFilter);
    }
  };

  const handleRefresh = () => {
    if (activeTab === "subscriptions") {
      fetchSubscriptions(page, search, statusFilter);
    } else {
      fetchPayments(page, search, statusFilter);
    }
  };

  const handleCancelSub = async (subId) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this user's subscription immediately?",
      )
    ) {
      return;
    }

    try {
      toast.loading("Cancelling subscription...", { id: "cancel-sub" });
      const res = await customerservice.cancelSubscription(subId);
      toast.dismiss("cancel-sub");
      if (res?.success) {
        toast.success("Subscription cancelled successfully.");
        fetchSubscriptions(page, search, statusFilter);
      } else {
        toast.error(res?.message || "Failed to cancel subscription.");
      }
    } catch (err) {
      toast.dismiss("cancel-sub");
      toast.error(
        err?.response?.data?.message || "Failed to cancel subscription.",
      );
    }
  };

  // Extract Stats helpers
  const activeSubsCount = subStats.find((s) => s._id === "active")?.count || 0;
  const expiredSubsCount =
    subStats.find((s) => s._id === "expired")?.count || 0;
  const cancelledSubsCount =
    subStats.find((s) => s._id === "cancelled")?.count || 0;

  const paidPayments = paymentStats.find((s) => s._id === "paid") || {
    count: 0,
    totalAmount: 0,
  };
  const failedPayments = paymentStats.find((s) => s._id === "failed") || {
    count: 0,
    totalAmount: 0,
  };
  const createdPayments = paymentStats.find((s) => s._id === "created") || {
    count: 0,
    totalAmount: 0,
  };

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "paid":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="capitalize">
              {status === "paid" ? "Success / Paid" : "Active"}
            </span>
          </span>
        );
      case "failed":
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            <span className="capitalize">{status}</span>
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Expired</span>
          </span>
        );
      case "created":
      case "attempted":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span className="capitalize">{status || "Pending"}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Cards: Platform Revenue & Subscription Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Subscriptions Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-indigo-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Subscriptions
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {activeSubsCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              of {totalAllSubs} total
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 border-t border-slate-100 pt-2">
            <span className="text-amber-600 font-medium">
              {expiredSubsCount} Expired
            </span>
            <span>•</span>
            <span className="text-red-500 font-medium">
              {cancelledSubsCount} Cancelled
            </span>
          </div>
        </div>

        {/* Total Collected Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-emerald-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Successful Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              ₹{(paidPayments.totalAmount || 0).toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              {paidPayments.count} Orders
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500 border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>Successful Transactions</span>
            <span className="text-emerald-600 font-medium">100% Verified</span>
          </div>
        </div>

        {/* Failed Transactions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-red-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Failed Transactions
            </span>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-red-600">
              {failedPayments.count || 0}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ₹{(failedPayments.totalAmount || 0).toLocaleString("en-IN")}
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500 border-t border-slate-100 pt-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            <span className="text-red-600 font-medium">
              Gateway & signature errors
            </span>
          </div>
        </div>

        {/* Pending / Initiated */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Initiated / Pending
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {createdPayments.count || 0}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Checkout sessions
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500 border-t border-slate-100 pt-2">
            <span>Awaiting gateway completion</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Top Control Bar: Tab Toggle & Search & Filter */}
        <div className="p-5 border-b border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* View Switcher Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl w-fit">
              <button
                onClick={() => {
                  setActiveTab("subscriptions");
                  setStatusFilter("all");
                  setPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "subscriptions"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Crown className="w-4 h-4 text-amber-500" />
                <span>All Subscriptions</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("payments");
                  setStatusFilter("all");
                  setPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "payments"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <CreditCard className="w-4 h-4 text-indigo-500" />
                <span>Payment History (Success & Failed)</span>
              </button>
            </div>

            {/* Action Tools */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleRefresh}
                className="p-2.5 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-600 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
                title="Refresh Table"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Search Bar & Filter Options */}
          <div className="flex flex-col md:flex-row gap-3 pt-2">
            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  activeTab === "subscriptions"
                    ? "Search by user name, email, plan name, payment ID..."
                    : "Search by user name, email, order ID, payment ID, receipt..."
                }
                className="w-full pl-10 pr-24 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700 py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                {activeTab === "subscriptions" ? (
                  <>
                    <option value="active">Active Only</option>
                    <option value="expired">Expired Only</option>
                    <option value="cancelled">Cancelled Only</option>
                  </>
                ) : (
                  <>
                    <option value="paid">Success / Paid Only</option>
                    <option value="failed">Failed Only</option>
                    <option value="created">Created / Pending Only</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Content Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="py-24 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-indigo-500" />
              <p className="text-sm font-medium">
                Loading records from database...
              </p>
            </div>
          ) : activeTab === "subscriptions" ? (
            // ==================== SUBSCRIPTIONS TABLE ====================
            subscriptions.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <Crown className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  No Subscriptions Found
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {search || statusFilter !== "all"
                    ? "Try adjusting your search criteria or filter options."
                    : "No users have enrolled in a subscription plan yet."}
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-5">User / Subscriber</th>
                    <th className="py-3.5 px-5">Plan Details</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5">Price</th>
                    <th className="py-3.5 px-5">Validity Period</th>
                    <th className="py-3.5 px-5">Quotas & Usage</th>
                    <th className="py-3.5 px-5">Payment Ref</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {subscriptions.map((sub) => {
                    const plan = sub.planDetails || {};
                    const isExpired =
                      sub.status === "expired" ||
                      (sub.endDate && new Date() > new Date(sub.endDate));

                    return (
                      <tr
                        key={sub._id}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        {/* User Subscriber Info */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0 border border-indigo-100">
                              {sub.user?.name
                                ? sub.user.name.charAt(0).toUpperCase()
                                : "U"}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-900 text-sm truncate flex items-center gap-1.5">
                                <span>
                                  {sub.user?.name || "Anonymous User"}
                                </span>
                                {sub.user?.role && (
                                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                    {sub.user.role}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3 text-slate-400" />
                                <span>{sub.user?.email || "No email"}</span>
                              </div>
                              {sub.user?.phone && (
                                <div className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                                  <Phone className="w-3 h-3 text-slate-300" />
                                  <span>{sub.user.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Plan Details */}
                        <td className="py-3.5 px-5">
                          <div>
                            <div className="font-bold text-slate-900 text-sm">
                              {plan.name || sub.planId}
                            </div>
                            <div className="text-xs text-indigo-600 font-medium">
                              {plan.category ||
                                (plan.categoryId === "employers"
                                  ? "Employer Plan"
                                  : "Candidate Plan")}
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-5">
                          {getStatusBadge(sub.status)}
                        </td>

                        {/* Price Paid */}
                        <td className="py-3.5 px-5">
                          <span className="font-bold text-slate-900 text-sm">
                            ₹{plan.price || sub.payment?.amount || 0}
                          </span>
                        </td>

                        {/* Validity Period */}
                        <td className="py-3.5 px-5 text-xs text-slate-600">
                          <div className="space-y-0.5">
                            <div>
                              <span className="text-slate-400">Start:</span>{" "}
                              <span className="font-semibold text-slate-700">
                                {new Date(sub.startDate).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400">End:</span>{" "}
                              <span
                                className={`font-semibold ${isExpired ? "text-red-500" : "text-emerald-700"}`}
                              >
                                {new Date(sub.endDate).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Quotas & Usage */}
                        <td className="py-3.5 px-5 text-xs">
                          <div className="space-y-1 min-w-[140px]">
                            {sub.jobPostsLimit > 0 && (
                              <div className="flex items-center justify-between text-[11px] text-slate-600">
                                <span>Jobs:</span>
                                <span className="font-bold text-slate-800">
                                  {sub.jobPostsUsed || 0}/{sub.jobPostsLimit}
                                </span>
                              </div>
                            )}
                            {sub.unlockContactsLimit > 0 && (
                              <div className="flex items-center justify-between text-[11px] text-slate-600">
                                <span>Contacts:</span>
                                <span className="font-bold text-slate-800">
                                  {sub.unlockContactsUsed || 0}/
                                  {sub.unlockContactsLimit}
                                </span>
                              </div>
                            )}
                            {sub.directMessagesLimit > 0 && (
                              <div className="flex items-center justify-between text-[11px] text-slate-600">
                                <span>DMs:</span>
                                <span className="font-bold text-slate-800">
                                  {sub.directMessagesUsed || 0}/
                                  {sub.directMessagesLimit}
                                </span>
                              </div>
                            )}
                            {sub.jobPostsLimit === 0 &&
                              sub.unlockContactsLimit === 0 &&
                              sub.directMessagesLimit === 0 && (
                                <span className="text-slate-400 italic">
                                  Unlimited / Base
                                </span>
                              )}
                          </div>
                        </td>

                        {/* Payment Ref */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded max-w-[110px] truncate">
                              {sub.paymentId || "pay_mock"}
                            </span>
                            {sub.paymentId && (
                              <button
                                onClick={() => handleCopy(sub.paymentId)}
                                className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                title="Copy Payment ID"
                              >
                                {copiedId === sub.paymentId ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() =>
                                handleDownloadInvoice(sub, "subscription")
                              }
                              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                              title="Download Tax Invoice PDF"
                            >
                              <Download className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Invoice</span>
                            </button>

                            <button
                              onClick={() => {
                                setSelectedSubscription(sub);
                                setIsModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                              title="Inspect Full Subscription Modal"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </button>

                            {sub.status === "active" && (
                              <button
                                onClick={() => handleCancelSub(sub._id)}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                                title="Cancel subscription immediately"
                              >
                                <Ban className="w-3.5 h-3.5" />
                                <span>Cancel</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )
          ) : // ==================== PAYMENTS TABLE ====================
          payments.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400">
                <CreditCard className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                No Payment Records Found
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {search || statusFilter !== "all"
                  ? "Try adjusting your search criteria or status filter."
                  : "No payment transactions have been recorded in the system yet."}
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">User / Customer</th>
                  <th className="py-3.5 px-5">Plan Description</th>
                  <th className="py-3.5 px-5">Amount</th>
                  <th className="py-3.5 px-5">Payment Status</th>
                  <th className="py-3.5 px-5">Payment & Order ID</th>
                  <th className="py-3.5 px-5">Failure Info / Reason</th>
                  <th className="py-3.5 px-5">Date & Time</th>
                  <th className="py-3.5 px-5 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {payments.map((p) => {
                  const isFailed = p.status === "failed";
                  const customerName =
                    p.user?.name || p.customerDetails?.name || "Guest Customer";
                  const customerEmail =
                    p.user?.email || p.customerDetails?.email || "No email";
                  const customerPhone =
                    p.user?.phone || p.customerDetails?.phone || "";

                  return (
                    <tr
                      key={p._id}
                      className={`transition-colors ${isFailed ? "bg-red-50/30 hover:bg-red-50/50" : "hover:bg-slate-50/70"}`}
                    >
                      {/* Customer */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                              isFailed
                                ? "bg-red-100 text-red-700 border-red-200"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            {customerName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 text-sm truncate flex items-center gap-1.5">
                              <span>{customerName}</span>
                              {p.user?.role && (
                                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                  {p.user.role}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{customerEmail}</span>
                            </div>
                            {customerPhone && (
                              <div className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                                <Phone className="w-3 h-3 text-slate-300" />
                                <span>{customerPhone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Plan Description */}
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-slate-900 text-sm">
                          {p.purpose || "Job Portal Service"}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          Receipt: {p.receipt || "N/A"}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-5">
                        <span className="font-bold text-slate-900 text-base">
                          ₹{p.amount?.toLocaleString("en-IN") || 0}
                        </span>
                        <span className="text-[11px] text-slate-400 ml-1 font-semibold uppercase">
                          {p.currency || "INR"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-5">
                        {getStatusBadge(p.status)}
                      </td>

                      {/* IDs */}
                      <td className="py-3.5 px-5">
                        <div className="space-y-1">
                          {p.paymentId ? (
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded max-w-[120px] truncate">
                                {p.paymentId}
                              </span>
                              <button
                                onClick={() => handleCopy(p.paymentId)}
                                className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                                title="Copy Payment ID"
                              >
                                {copiedId === p.paymentId ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">
                              No Payment ID
                            </span>
                          )}

                          {p.orderId && (
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[11px] text-slate-400 max-w-[120px] truncate">
                                {p.orderId}
                              </span>
                              <button
                                onClick={() => handleCopy(p.orderId)}
                                className="p-0.5 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                                title="Copy Order ID"
                              >
                                {copiedId === p.orderId ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Failure reason if failed */}
                      <td className="py-3.5 px-5">
                        {isFailed ? (
                          <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-2.5 py-1.5 rounded-lg max-w-[200px]">
                            <div className="font-bold flex items-center gap-1 text-[11px]">
                              <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                              <span>Failed Error</span>
                            </div>
                            <p
                              className="mt-0.5 text-[11px] leading-tight text-red-600 truncate"
                              title={
                                p.errorDetails ||
                                "Payment cancelled or rejected"
                              }
                            >
                              {p.errorDetails ||
                                "Transaction failed at payment gateway."}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-emerald-600 font-medium inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verified</span>
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-5 text-xs text-slate-500">
                        <div>
                          {new Date(p.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {new Date(p.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>

                      {/* Invoice Action */}
                      <td className="py-3.5 px-5 text-right">
                        {p.status === "paid" ? (
                          <button
                            onClick={() => handleDownloadInvoice(p, "payment")}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                            title="Download Tax Invoice PDF"
                          >
                            <Download className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Invoice</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            N/A
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="text-xs text-slate-500">
              Showing page{" "}
              <span className="font-bold text-slate-800">{page}</span> of{" "}
              <span className="font-bold text-slate-800">{totalPages}</span> (
              {totalCount} total results)
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber = i + 1;
                  if (totalPages > 5 && page > 3) {
                    pageNumber = page - 2 + i;
                    if (pageNumber > totalPages) {
                      pageNumber = totalPages - (4 - i);
                    }
                  }
                  if (pageNumber < 1 || pageNumber > totalPages) return null;

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        page === pageNumber
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-200/60"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Subscription Details Modal */}
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subscription={selectedSubscription}
        onSubscriptionCancelled={() => {
          fetchSubscriptions(page, search, statusFilter);
        }}
      />
    </div>
  );
}
