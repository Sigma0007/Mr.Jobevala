import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShieldCheck, Zap, Sparkles, CreditCard, ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import customerservice from "../customer/customerservice";
import { loadRazorpayScript } from "../Utility/loadRazorpay";

const PRICING_PLANS = [
  {
    id: "candidate_basic",
    name: "Candidate Starter",
    category: "For Job Seekers",
    price: 199,
    originalPrice: 499,
    badge: "Popular",
    description: "Boost your profile visibility to top hiring companies.",
    features: [
      "Featured Profile Badge for 30 days",
      "Direct message to 10 recruiters",
      "AI Resume score & suggestions",
      "Priority in candidate search results",
      "Instant email notifications on application view",
    ],
    accentColor: "from-blue-600 to-indigo-600",
    buttonClass: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20",
  },
  {
    id: "employer_pro",
    name: "Employer Pro Boost",
    category: "For Employers",
    price: 499,
    originalPrice: 999,
    badge: "Most Recommended",
    highlighted: true,
    description: "Accelerate your hiring with featured job listings.",
    features: [
      "Post 5 Featured Jobs with high visibility",
      "Highlight tag on job search page",
      "Direct access to top verified candidates",
      "Applicant tracking & filtering dashboard",
      "24/7 Priority support",
      "Valid for 60 days",
    ],
    accentColor: "from-indigo-600 to-violet-600",
    buttonClass: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30",
  },
  {
    id: "enterprise_hiring",
    name: "Enterprise Unlimited",
    category: "For Agencies & Teams",
    price: 1499,
    originalPrice: 2999,
    badge: "Maximum Value",
    description: "Comprehensive recruitment suite for growing organizations.",
    features: [
      "Unlimited Job Postings for 6 months",
      "Top-tier sponsored placement on Home & Search",
      "Unlimited resume downloads & candidate contacts",
      "Dedicated account manager",
      "Custom branding on job posts",
      "Full analytics & recruitment insights",
    ],
    accentColor: "from-emerald-600 to-teal-600",
    buttonClass: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20",
  },
];

export default function PricingPlans() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [loadingPlan, setLoadingPlan] = useState(null);
  const [razorpayKey, setRazorpayKey] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [customPurpose, setCustomPurpose] = useState("Custom Payment");
  const [lastPaymentSuccess, setLastPaymentSuccess] = useState(null);

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

  const handlePayment = async (plan) => {
    const amount = plan.price;
    const planId = plan.id;
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
        toast.error("Razorpay SDK failed to load. Please check your internet connection.");
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
        throw new Error(orderRes?.message || "Failed to initiate payment order");
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
        description: `Payment for ${purpose}`,
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
        },
        theme: {
          color: "#4f46e5", // Indigo theme
        },
        handler: async function (response) {
          try {
            toast.loading("Verifying payment with bank...", { id: "verify-toast" });

            // 4. Send verification payload to backend
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const verifyRes = await customerservice.verifyPayment(verifyPayload);

            toast.dismiss("verify-toast");

            if (verifyRes?.success) {
              toast.success("Payment Successful! 🎉");
              setLastPaymentSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                amount: amount,
                planName: purpose,
                date: new Date().toLocaleString(),
              });
            } else {
              toast.error(verifyRes?.message || "Payment signature verification failed.");
            }
          } catch (verErr) {
            toast.dismiss("verify-toast");
            console.error("Verification error:", verErr);
            toast.error(verErr?.response?.data?.message || "Payment verification failed.");
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
        toast.error(`Payment Failed: ${failResponse.error.description || "Transaction failed"}`);
        setLoadingPlan(null);
      });

      razorpayInstance.open();
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error?.response?.data?.message || error.message || "Failed to initialize payment.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Secure Razorpay Gateway Integrated</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Flexible Plans for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Growth & Hiring</span>
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          Upgrade your recruitment speed or stand out in the candidate crowd with our verified plans. Safe, instant payments via UPI, Cards, NetBanking, and Wallets.
        </p>

        {user && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link
              to="/payments/history"
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/70 px-4 py-2 rounded-xl transition-all"
            >
              <CreditCard className="w-4 h-4" />
              View My Transaction History
            </Link>
          </div>
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
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Payment Successful!</h3>
                <p className="text-sm text-slate-500">Thank you for your purchase. Your plan is now active.</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 space-y-3 text-sm mb-6 border border-slate-100">
              <div className="flex justify-between items-center text-slate-600">
                <span>Plan / Item:</span>
                <span className="font-semibold text-slate-900">{lastPaymentSuccess.planName}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Amount Paid:</span>
                <span className="font-bold text-emerald-600 text-base">₹{lastPaymentSuccess.amount}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Payment ID:</span>
                <span className="font-mono text-xs bg-white px-2 py-1 rounded border border-slate-200 text-slate-800">
                  {lastPaymentSuccess.paymentId}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Order ID:</span>
                <span className="font-mono text-xs text-slate-700">{lastPaymentSuccess.orderId}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Date & Time:</span>
                <span className="text-xs text-slate-700">{lastPaymentSuccess.date}</span>
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
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
        {PRICING_PLANS.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className={`relative rounded-3xl p-8 flex flex-col justify-between bg-white transition-all shadow-xl ${
              plan.highlighted
                ? "border-2 border-indigo-500 shadow-indigo-100 ring-4 ring-indigo-50"
                : "border border-slate-200/80 hover:border-slate-300"
            }`}
          >
            {plan.badge && (
              <div
                className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-md ${
                  plan.highlighted ? "bg-indigo-600" : "bg-slate-800"
                }`}
              >
                {plan.badge}
              </div>
            )}

            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                {plan.category}
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
              <p className="mt-2 text-sm text-slate-600 min-h-[40px]">{plan.description}</p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-900 tracking-tight">₹{plan.price}</span>
                <span className="text-slate-400 line-through text-lg font-medium">₹{plan.originalPrice}</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)}% OFF
                </span>
              </div>

              <div className="w-full border-t border-slate-100 my-6"></div>

              <ul className="space-y-3.5 text-sm text-slate-700">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full p-1 bg-emerald-50 text-emerald-600 flex-shrink-0">
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    </div>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4">
              <button
                onClick={() => handlePayment(plan)}
                disabled={loadingPlan === plan.id}
                className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-semibold text-sm transition-all cursor-pointer shadow-lg disabled:opacity-70 ${plan.buttonClass}`}
              >
                {loadingPlan === plan.id ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Connecting Gateway...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Pay ₹{plan.price} with Razorpay
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Custom Amount / Test Payment Card */}
      <div className="max-w-2xl mx-auto bg-slate-900 text-white rounded-3xl p-8 shadow-2xl border border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Custom Payment / Quick Test</h3>
            <p className="text-sm text-slate-400">Specify any custom amount to test or pay custom invoices directly.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Amount (INR ₹)
            </label>
            <input
              type="number"
              min="1"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="e.g. 100"
              className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Payment Note / Purpose
            </label>
            <input
              type="text"
              value={customPurpose}
              onChange={(e) => setCustomPurpose(e.target.value)}
              placeholder="e.g. Test Transaction"
              className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-base"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {[10, 50, 100, 500, 1000].map((quickVal) => (
            <button
              key={quickVal}
              type="button"
              onClick={() => setCustomAmount(quickVal.toString())}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg text-slate-300 transition-colors"
            >
              ₹{quickVal}
            </button>
          ))}
        </div>

        <button
          onClick={() =>
            handlePayment({
              id: "custom_amount",
              name: customPurpose || "Custom Payment",
              price: Number(customAmount),
            })
          }
          disabled={!customAmount || Number(customAmount) <= 0 || loadingPlan === "custom_amount"}
          className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingPlan === "custom_amount" ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              Pay ₹{customAmount || 0} via Razorpay
            </>
          )}
        </button>
      </div>

      {/* Trust Badges & Supported Modes */}
      <div className="max-w-4xl mx-auto mt-16 pt-8 border-t border-slate-200 text-center">
        <div className="flex flex-wrap items-center justify-center gap-8 text-slate-500 text-xs font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span>256-Bit SSL Encryption</span>
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
            <span>Instant Activation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
