import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, CheckCircle, XCircle, Clock, ArrowLeft, Download, RefreshCw, AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import customerservice from "../customer/customerservice";

export default function PaymentHistory() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPayments = async (currentPage = 1) => {
    setLoading(true);
    try {
      const res = await customerservice.getMyPayments(`?page=${currentPage}&limit=10`);
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

  useEffect(() => {
    fetchPayments(page);
  }, [page]);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Paid
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            Failed
          </span>
        );
      case "created":
      case "attempted":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending / Initiated
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
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
            <h1 className="text-3xl font-bold text-slate-900">Payment & Transaction History</h1>
            <p className="text-slate-500 text-sm mt-1">View your order receipts, payment statuses, and transaction IDs.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchPayments(page)}
              className="p-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-slate-600 hover:text-slate-900 shadow-sm transition-all"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <Link
              to="/pricing"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all"
            >
              Buy New Plan
            </Link>
          </div>
        </div>

        {/* Payments Table / List */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-16 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-indigo-500" />
              <p className="text-sm">Loading your transactions...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                <CreditCard className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Transactions Found</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                You haven't made any payments yet. Explore our featured pricing plans to get started.
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
                    <th className="py-4 px-6">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {payments.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900">{p.purpose || "Job Portal Plan"}</div>
                        <div className="text-xs text-slate-400">Receipt: {p.receipt}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-slate-900 text-base">₹{p.amount}</span>
                        <span className="text-xs text-slate-400 ml-1">{p.currency}</span>
                      </td>
                      <td className="py-4 px-6">{getStatusBadge(p.status)}</td>
                      <td className="py-4 px-6">
                        {p.paymentId ? (
                          <span className="font-mono text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded">
                            {p.paymentId}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs italic">N/A</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-mono text-xs text-slate-500">{p.orderId}</span>
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
                    </tr>
                  ))}
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
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs text-slate-500">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
