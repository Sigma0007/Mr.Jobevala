import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Download,
  RefreshCw,
  AlertCircle,
  Crown,
  Calendar,
  Layers,
  Sparkles,
  User,
  ShieldCheck,
  ChevronRight,
  FileText,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import customerservice from "../customer/customerservice";
import SubscriptionModal from "../components/Modals/SubscriptionModal";

export default function PaymentHistory() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("subscriptions"); // 'subscriptions' | 'transactions'
  const [payments, setPayments] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const handleDownloadInvoice = async (item, type = "payment") => {
    try {
      toast.loading("Fetching invoice PDF...", { id: "inv-toast" });
      let invoiceUrl =
        import.meta.env.VITE_API_URL + item.invoiceUrl + item.invoiceUrl;

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
            res?.message || "Failed to fetch invoice. Please try again.",
          );
        }
      }

      toast.dismiss("inv-toast");
      if (invoiceUrl) {
        window.open(invoiceUrl, "_blank", "noopener,noreferrer");
        toast.success("Invoice opened!");
      }
    } catch (err) {
      toast.dismiss("inv-toast");
      console.error("Invoice open error:", err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Could not retrieve invoice.",
      );
    }
  };

  const fetchPayments = async (currentPage = 1) => {
    setLoading(true);
    try {
      const res = await customerservice.getMyPayments(
        `?page=${currentPage}&limit=10`,
      );
      if (res?.success) {
        setPayments(res.data || []);
        setTotalPages(res.totalPages || 1);
        setPage(res.page || 1);
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
      toast.error("Failed to load payment history.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptions = async (currentPage = 1) => {
    setLoading(true);
    try {
      const res = await customerservice.getMySubscriptionHistory(
        `?page=${currentPage}&limit=10`,
      );
      if (res?.success) {
        setSubscriptions(res.data || []);
        setTotalPages(res.totalPages || 1);
        setPage(res.page || 1);
      }
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
      toast.error("Failed to load subscriptions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "subscriptions") {
      fetchSubscriptions(page);
    } else {
      fetchPayments(page);
    }
  }, [activeTab, page]);

  const handleRefresh = () => {
    if (activeTab === "subscriptions") {
      fetchSubscriptions(page);
    } else {
      fetchPayments(page);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "paid":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            {status.toUpperCase()}
          </span>
        );
      case "cancelled":
      case "failed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            {status.toUpperCase()}
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            EXPIRED
          </span>
        );
      case "created":
      case "attempted":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {status ? status.toUpperCase() : "PENDING"}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Pricing & Plans
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">
              Subscriptions & Billing History
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage your active subscription plans, validity dates, and payment
              receipts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user?.role === "admin" && (
              <Link
                to="/admin/dashboard"
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Billing Center</span>
              </Link>
            )}
            <button
              onClick={handleRefresh}
              className="p-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-slate-600 hover:text-slate-900 shadow-sm transition-all cursor-pointer"
              title="Refresh"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
            <Link
              to="/pricing"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              Upgrade / Browse Plans
            </Link>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-2">
          <button
            onClick={() => {
              setActiveTab("subscriptions");
              setPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "subscriptions"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>My Subscription Plans ({subscriptions.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("transactions");
              setPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "transactions"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>All Payment Transactions ({payments.length})</span>
          </button>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-16 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-indigo-500" />
              <p className="text-sm">Loading your records...</p>
            </div>
          ) : activeTab === "subscriptions" ? (
            // Subscriptions Table View
            subscriptions.length === 0 ? (
              <div className="p-16 text-center">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-500">
                  <Crown className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  No Subscriptions Found
                </h3>
                <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                  You haven't purchased any subscription plans yet. Unlock
                  premium features today.
                </p>
                <Link
                  to="/pricing"
                  className="mt-6 inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
                >
                  Explore Pricing Plans
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-4 px-6">Plan Name & Details</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6">Price Paid</th>
                      <th className="py-4 px-6">Validity (Start - End)</th>
                      <th className="py-4 px-6">Payment ID</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {subscriptions.map((sub) => {
                      const plan = sub.planDetails || {};
                      return (
                        <tr
                          key={sub._id}
                          className="hover:bg-slate-50/70 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                                <Crown className="w-4 h-4 text-amber-500" />
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">
                                  {plan.name || sub.planId}
                                </div>
                                <div className="text-xs text-indigo-600 font-medium">
                                  {plan.category ||
                                    (plan.categoryId === "employers"
                                      ? "For Employers"
                                      : "For Job Seekers")}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            {getStatusBadge(sub.status)}
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-bold text-slate-900 text-base">
                              ₹{plan.price || sub.payment?.amount || 0}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-xs text-slate-600">
                            <div>
                              <span className="font-semibold text-slate-800">
                                {new Date(sub.startDate).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </span>{" "}
                              to{" "}
                              <span className="font-semibold text-slate-800">
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
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-mono text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded">
                              {sub.paymentId || "N/A"}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() =>
                                  handleDownloadInvoice(sub, "subscription")
                                }
                                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                                title="Download Official Tax Receipt PDF"
                              >
                                <Download className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Invoice</span>
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedSubscription(sub);
                                  setIsSubModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                              >
                                <span>View Modal</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          ) : // Payments Table View
          payments.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                <CreditCard className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                No Transactions Found
              </h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                You haven't made any payments yet. Explore our featured pricing
                plans to get started.
              </p>
              <Link
                to="/pricing"
                className="mt-6 inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
              >
                Explore Plans
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-4 px-6">Description / Plan</th>
                    <th className="py-4 px-6">Amount</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Payment ID</th>
                    <th className="py-4 px-6">Order ID</th>
                    <th className="py-4 px-6">Details / Reason</th>
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {payments.map((p) => {
                    const isFailed = p.status === "failed";
                    return (
                      <tr
                        key={p._id}
                        className={`transition-colors ${isFailed ? "bg-red-50/30 hover:bg-red-50/50" : "hover:bg-slate-50/70"}`}
                      >
                        <td className="py-4 px-6">
                          <div className="font-semibold text-slate-900">
                            {p.purpose || "Job Portal Plan"}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">
                            Receipt: {p.receipt || "N/A"}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-slate-900 text-base">
                            ₹{p.amount?.toLocaleString("en-IN")}
                          </span>
                          <span className="text-xs text-slate-400 ml-1">
                            {p.currency}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {getStatusBadge(p.status)}
                        </td>
                        <td className="py-4 px-6">
                          {p.paymentId ? (
                            <span className="font-mono text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded">
                              {p.paymentId}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs italic">
                              N/A
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-mono text-xs text-slate-500">
                            {p.orderId}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {isFailed ? (
                            <div className="text-xs text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                              <span className="font-semibold block">
                                Failed:
                              </span>
                              <span className="text-[11px] leading-tight block">
                                {p.errorDetails ||
                                  "Transaction failed or cancelled"}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-emerald-600 font-medium">
                              Paid & Verified
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-500">
                          {new Date(p.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="py-4 px-6 text-right">
                          {p.status === "paid" ? (
                            <button
                              onClick={() =>
                                handleDownloadInvoice(p, "payment")
                              }
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
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50/30">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <span className="text-xs text-slate-500">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Subscription Details Modal */}
      <SubscriptionModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        subscription={selectedSubscription}
        onSubscriptionCancelled={() => {
          fetchSubscriptions(page);
        }}
      />
    </div>
  );
}
