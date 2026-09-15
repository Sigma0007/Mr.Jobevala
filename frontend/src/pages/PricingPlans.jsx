import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ShieldCheck,
  Zap,
  Sparkles,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  User,
  Building2,
  Users,
  Crown,
  Star,
  Flame,
  HelpCircle,
  Layers,
  MessageSquare,
  Briefcase,
  UserCheck,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import customerservice from "../customer/customerservice";
import { loadRazorpayScript } from "../Utility/loadRazorpay";

export const DEFAULT_PLAN_CATEGORIES = [
  {
    id: "seekers",
    name: "For Job Seekers",
    shortName: "Job Seekers",
    icon: User,
    badge: "Candidate Boost",
    tagline:
      "Accelerate your career, get noticed by recruiters & land your dream job.",
  },
  {
    id: "employers",
    name: "For Employers",
    shortName: "Employers",
    icon: Building2,
    badge: "Direct Hiring",
    tagline: "Fast-track your hiring pipeline with verified candidate talent.",
  },
];

export default function PricingPlans() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Initial tab based on user role
  const getDefaultCategory = () => {
    if (user?.role === "recruiter" || user?.role === "employer")
      return "employers";
    if (user?.role === "admin") return "employers";
    return "seekers";
  };

  const [activeTab, setActiveTab] = useState(getDefaultCategory);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [razorpayKey, setRazorpayKey] = useState("");
  const [lastPaymentSuccess, setLastPaymentSuccess] = useState(null);

  // Sync tab if user loads later
  useEffect(() => {
    if (user?.role === "recruiter" || user?.role === "employer") {
      setActiveTab("employers");
    }
  }, [user?.role]);

  // Fetch Pricing Plans from Backend API
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await customerservice.getPricingPlans();
      if (res?.success && Array.isArray(res.data)) {
        setPlans(res.data);
      } else {
        setPlans([]);
      }
    } catch (err) {
      console.error("Error fetching pricing plans:", err);
      toast.error("Failed to load pricing plans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Fetch Razorpay public key on load
  useEffect(() => {
    const fetchKey = async () => {
      try {
        const res = await customerservice.getRazorpayKey();
        if (res?.success && res?.key) {
          setRazorpayKey(res.key);
        }
      } catch (err) {
        console.warn("Could not fetch Razorpay key:", err);
      }
    };
    fetchKey();
  }, []);

  // Compute available categories dynamically based on defaults + any custom plan categories
  const categories = React.useMemo(() => {
    const base = [...DEFAULT_PLAN_CATEGORIES];
    const existingIds = new Set(base.map((c) => c.id));

    plans.forEach((p) => {
      if (p.categoryId && !existingIds.has(p.categoryId)) {
        existingIds.add(p.categoryId);
        base.push({
          id: p.categoryId,
          name: p.category || p.categoryId,
          shortName: p.category || p.categoryId,
          icon: Layers,
          badge: "Special Plan",
          tagline: "Custom curated plans for unique recruitment requirements.",
        });
      }
    });

    return base;
  }, [plans]);

  const handlePayment = async (plan) => {
    const amount = plan.price;
    const planId = plan.planId || plan._id || plan.id;
    const purpose = plan.name;

    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoadingPlan(planId);

    try {
      // 1. Ensure Razorpay SDK script is loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error(
          "Razorpay SDK failed to load. Please check your internet connection.",
        );
        setLoadingPlan(null);
        return;
      }

      // 2. Create Order on Backend
      const orderPayload = {
        amount: Number(amount),
        currency: "INR",
        purpose,
        planId,
        customerDetails: {
          name: user?.name || "Job Portal User",
          email: user?.email || "user@jobportal.com",
          phone: user?.phone || "9999999999",
        },
      };

      const orderRes = await customerservice.createPaymentOrder(orderPayload);

      if (!orderRes?.success || !orderRes?.order) {
        throw new Error(
          orderRes?.message || "Failed to initiate payment order",
        );
      }

      const { order, key } = orderRes;
      const effectiveKey = key || razorpayKey;

      if (!effectiveKey) {
        throw new Error("Razorpay Key ID is not configured on the server.");
      }

      // 3. Open Razorpay Checkout Window
      const options = {
        key: effectiveKey,
        amount: order.amount,
        currency: order.currency,
        name: "Job Portal Inc.",
        description: `Payment for ${purpose} (${plan.category})`,
        order_id: order.id,
        image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        notes: {
          planId,
          purpose,
          category: plan.category,
        },
        theme: {
          color: "#4f46e5", // Indigo theme
        },
        handler: async function (response) {
          try {
            toast.loading("Verifying payment with bank...", {
              id: "verify-toast",
            });

            // 4. Send verification payload to backend
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const verifyRes =
              await customerservice.verifyPayment(verifyPayload);

            toast.dismiss("verify-toast");

            if (verifyRes?.success) {
              toast.success("Payment Successful! 🎉");
              setLastPaymentSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                amount: amount,
                planName: purpose,
                category: plan.category,
                date: new Date().toLocaleString(),
              });
            } else {
              toast.error(
                verifyRes?.message || "Payment signature verification failed.",
              );
            }
          } catch (verErr) {
            toast.dismiss("verify-toast");
            console.error("Verification error:", verErr);
            toast.error(
              verErr?.response?.data?.message || "Payment verification failed.",
            );
          }
        },
        modal: {
          ondismiss: function () {
            toast("Payment cancelled by user.", { icon: "ℹ️" });
            setLoadingPlan(null);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on("payment.failed", function (failResponse) {
        console.error("Payment failed:", failResponse.error);
        toast.error(
          `Payment Failed: ${failResponse.error.description || "Transaction failed"}`,
        );
        setLoadingPlan(null);
      });

      razorpayInstance.open();
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to initialize payment.",
      );
    } finally {
      setLoadingPlan(null);
    }
  };

  const filteredPlans = plans.filter((plan) => plan.categoryId === activeTab);

  const currentCategoryInfo =
    categories.find((cat) => cat.id === activeTab) || categories[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Transparent Pricing & Instant Activation</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Choose the Perfect Plan for{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            Your Growth
          </span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Tailored solutions for{" "}
          <span className="font-semibold text-slate-800">Job Seekers</span>,{" "}
          <span className="font-semibold text-slate-800">Employers</span>, and{" "}
          <span className="font-semibold text-slate-800">Agencies</span>. Enjoy
          safe, instant payments via UPI, Cards, NetBanking, and Wallets.
        </p>

        {user && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link
              to="/payments/history"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-all border border-indigo-100"
            >
              <CreditCard className="w-4 h-4" />
              View My Transaction History
            </Link>
          </div>
        )}
      </div>

      {/* Category Tab Selector */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="bg-slate-100/80 p-1.5 rounded-2xl sm:rounded-full flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 shadow-inner border border-slate-200">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex-1 min-w-[140px] sm:min-w-0 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl sm:rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 relative ${
                  isActive
                    ? "text-white shadow-md bg-gradient-to-r from-indigo-600 to-blue-600"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`}
                />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Category Tagline */}
        {currentCategoryInfo && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-center mt-4 text-xs sm:text-sm text-slate-500"
          >
            <span className="inline-block font-medium text-slate-700 mr-1.5">
              💡 {currentCategoryInfo.name}:
            </span>
            {currentCategoryInfo.tagline}
          </motion.div>
        )}
      </div>

      {/* Success Receipt Modal / Card */}
      <AnimatePresence>
        {lastPaymentSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-xl mx-auto mb-12 bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl -z-0"></div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Payment Successful!
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Thank you for your purchase. Your plan is now active
                  immediately.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 space-y-3 text-sm mb-6 border border-slate-100">
              <div className="flex justify-between items-center text-slate-600">
                <span>Category:</span>
                <span className="font-semibold text-indigo-600">
                  {lastPaymentSuccess.category || "Service Plan"}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Plan / Item:</span>
                <span className="font-semibold text-slate-900">
                  {lastPaymentSuccess.planName}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Amount Paid:</span>
                <span className="font-bold text-emerald-600 text-base">
                  ₹{lastPaymentSuccess.amount}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Payment ID:</span>
                <span className="font-mono text-xs bg-white px-2 py-1 rounded border border-slate-200 text-slate-800">
                  {lastPaymentSuccess.paymentId}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Order ID:</span>
                <span className="font-mono text-xs text-slate-700">
                  {lastPaymentSuccess.orderId}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Date & Time:</span>
                <span className="text-xs text-slate-700">
                  {lastPaymentSuccess.date}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setLastPaymentSuccess(null)}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
              >
                Close Receipt
              </button>
              <Link
                to="/payments/history"
                className="flex-1 text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-2.5 rounded-xl transition-colors text-sm"
              >
                All Receipts
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pricing Cards Grid */}
      <AnimatePresence mode="wait">
        {loading ? (
          <div className="py-24 text-center">
            <RefreshCw className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-base font-semibold text-slate-700">
              Loading current pricing plans...
            </p>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="max-w-md mx-auto py-16 text-center bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">
              No Plans Available
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-4">
              There are currently no active plans listed under {currentCategoryInfo?.name}.
            </p>
            <button
              onClick={fetchPlans}
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700"
            >
              Refresh
            </button>
          </div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className={`max-w-7xl mx-auto grid grid-cols-1 ${
              filteredPlans.length > 3
                ? "md:grid-cols-2 lg:grid-cols-3"
                : "md:grid-cols-3"
            } gap-8 items-stretch mb-16`}
          >
            {filteredPlans.map((plan) => {
              const discountPercent =
                plan.originalPrice && plan.price && plan.originalPrice > plan.price
                  ? Math.round(
                      ((plan.originalPrice - plan.price) / plan.originalPrice) *
                        100,
                    )
                  : 0;

              const planKey = plan.planId || plan._id || plan.id;

              return (
                <motion.div
                  key={planKey}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2 }}
                  className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between bg-white transition-all shadow-xl ${
                    plan.highlighted
                      ? "border-2 border-indigo-500 shadow-indigo-100 ring-4 ring-indigo-50/70"
                      : "border border-slate-200/90 hover:border-slate-300"
                  }`}
                >
                  {/* Highlight / Category Badges */}
                  {plan.badge && (
                    <div
                      className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-white shadow-md flex items-center gap-1.5 ${
                        plan.highlighted
                          ? "bg-gradient-to-r from-indigo-600 to-blue-600"
                          : "bg-slate-800"
                      }`}
                    >
                      {plan.highlighted && (
                        <Flame className="w-3 h-3 text-amber-300" />
                      )}
                      <span>{plan.badge}</span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-md">
                        {plan.category}
                      </span>
                      {discountPercent > 0 && (
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                      {plan.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 min-h-[44px] leading-relaxed">
                      {plan.description}
                    </p>

                    <div className="mt-6 flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                        ₹{plan.price}
                      </span>
                      {plan.originalPrice && (
                        <span className="text-slate-400 line-through text-lg font-medium">
                          ₹{plan.originalPrice}
                        </span>
                      )}
                      <span className="text-xs text-slate-500 font-medium">
                        / {plan.validityDays ? `${plan.validityDays} days` : "one-time"}
                      </span>
                    </div>

                    {/* Quota Highlights */}
                    {(Number(plan.directMessagesLimit) > 0 ||
                      Number(plan.jobPostsLimit) > 0 ||
                      Number(plan.unlockContactsLimit) > 0) && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {Number(plan.directMessagesLimit) > 0 && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50/80 text-indigo-700 text-xs font-semibold border border-indigo-100">
                            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                            <span>
                              {plan.directMessagesLimit >= 1000
                                ? "Unlimited"
                                : plan.directMessagesLimit}{" "}
                              Direct Messages
                            </span>
                          </div>
                        )}
                        {Number(plan.jobPostsLimit) > 0 && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50/80 text-blue-700 text-xs font-semibold border border-blue-100">
                            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                            <span>{plan.jobPostsLimit} Job Posts</span>
                          </div>
                        )}
                        {Number(plan.unlockContactsLimit) > 0 && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50/80 text-emerald-700 text-xs font-semibold border border-emerald-100">
                            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>
                              {plan.unlockContactsLimit} Candidate Unlocks
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="w-full border-t border-slate-100 my-6"></div>

                    <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
                      What's Included:
                    </div>

                    <ul className="space-y-3 text-sm text-slate-700">
                      {plan.features?.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <div className="mt-0.5 rounded-full p-1 bg-emerald-50 text-emerald-600 flex-shrink-0">
                            <Check className="w-3.5 h-3.5" strokeWidth={3} />
                          </div>
                          <span className="text-slate-700 text-xs sm:text-sm font-normal">
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-4">
                    <button
                      onClick={() => handlePayment(plan)}
                      disabled={loadingPlan === planKey}
                      className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-semibold text-sm transition-all cursor-pointer shadow-lg disabled:opacity-70 ${
                        plan.highlighted
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25"
                          : "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20"
                      }`}
                    >
                      {loadingPlan === planKey ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Connecting Razorpay...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          Pay ₹{plan.price} with Razorpay
                        </>
                      )}
                    </button>
                    <p className="text-center text-[11px] text-slate-400 mt-2">
                      Instant automated activation after payment
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trust Badges & Supported Modes */}
      <div className="max-w-4xl mx-auto pt-8 border-t border-slate-200 text-center">
        <div className="flex flex-wrap items-center justify-center gap-8 text-slate-500 text-xs font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span>256-Bit SSL Secured</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>UPI / GPay / PhonePe / Paytm</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span>Credit / Debit Cards & NetBanking</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <span>Instant Plan Activation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
