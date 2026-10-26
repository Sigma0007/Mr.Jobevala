import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Briefcase,
  Building2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Crown,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  Zap,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import customerservice from "../../customer/customerservice";
import { loadRazorpayScript } from "../../Utility/loadRazorpay";
import { useSelector } from "react-redux";

export default function ExtraPostModal({
  isOpen,
  onClose,
  actionType = "job_post", // 'job_post' | 'company_post'
  subscription,
  onSuccess,
}) {
  const { user } = useSelector((state) => state.auth);
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const isJob = actionType === "job_post";
  const label = isJob ? "Job Post" : "Company Post";
  const pluralLabel = isJob ? "Job Posts" : "Company Posts";

  const planDetails = subscription?.planDetails || {};
  const unitPrice = isJob
    ? Number(
        planDetails.extraJobPostPrice ??
          subscription?.plan?.extraJobPostPrice ??
          99,
      )
    : Number(
        planDetails.extraCompanyPostPrice ??
          subscription?.plan?.extraCompanyPostPrice ??
          49,
      );

  const limit = isJob
    ? subscription?.jobPostsLimit || 0
    : subscription?.companyPostsLimit || 0;
  const used = isJob
    ? subscription?.jobPostsUsed || 0
    : subscription?.companyPostsUsed || 0;

  // Fetch dynamic plans configured by Admin
  useEffect(() => {
    let isMounted = true;
    if (!isOpen) return;

    const fetchPlans = async () => {
      setPlansLoading(true);
      try {
        const res = await customerservice.getExtraPostPlans(
          `?postType=${actionType}`,
        );
        if (isMounted) {
          if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
            setPlans(res.data);
            setSelectedPlan(res.data[0]);
          } else {
            // Fallback default packages if none returned from API
            const fallbackPackages = [
              {
                _id: "fallback_1",
                planId: isJob ? "extra_job_1" : "extra_company_1",
                name: `1 Extra ${label}`,
                postType: actionType,
                quantity: 1,
                price: unitPrice * 1,
                originalPrice: Math.round(unitPrice * 1.4),
                tag: "Instant Post",
                description: `Unlock 1 extra ${label.toLowerCase()} to publish now`,
              },
              {
                _id: "fallback_3",
                planId: isJob ? "extra_job_3" : "extra_company_3",
                name: `3 Extra ${label}s`,
                postType: actionType,
                quantity: 3,
                price: Math.round(unitPrice * 2.6),
                originalPrice: unitPrice * 3,
                tag: isJob ? "Hiring Sprint" : "Growth Sprint",
                description: `Save time with 3 extra ${label.toLowerCase()} credits`,
              },
              {
                _id: "fallback_5",
                planId: isJob ? "extra_job_5" : "extra_company_5",
                name: `5 Extra ${label}s`,
                postType: actionType,
                quantity: 5,
                price: Math.round(unitPrice * 4.1),
                originalPrice: unitPrice * 5,
                tag: "Best Value",
                description: `Top up 5 ${label.toLowerCase()}s for ongoing campaigns`,
              },
            ];
            setPlans(fallbackPackages);
            setSelectedPlan(fallbackPackages[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dynamic extra post plans:", err);
        if (isMounted) {
          const fallback = [
            {
              _id: "fallback_1",
              planId: isJob ? "extra_job_1" : "extra_company_1",
              name: `1 Extra ${label}`,
              postType: actionType,
              quantity: 1,
              price: unitPrice * 1,
              originalPrice: Math.round(unitPrice * 1.4),
              tag: "Instant Post",
              description: `Unlock 1 extra ${label.toLowerCase()} to publish now`,
            },
          ];
          setPlans(fallback);
          setSelectedPlan(fallback[0]);
        }
      } finally {
        if (isMounted) setPlansLoading(false);
      }
    };

    fetchPlans();

    return () => {
      isMounted = false;
    };
  }, [isOpen, actionType, unitPrice, label, isJob]);

  if (!isOpen) return null;

  const selectedQty = selectedPlan ? Number(selectedPlan.quantity) : 1;
  const totalAmount = selectedPlan
    ? Number(selectedPlan.price)
    : unitPrice * selectedQty;

  const handlePayAndUnlock = async () => {
    try {
      setLoading(true);

      // 1. Ensure Razorpay SDK script is loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error(
          "Razorpay SDK failed to load. Please check your internet connection.",
        );
        setLoading(false);
        return;
      }

      // 2. Fetch Razorpay key
      let key = "";
      try {
        const keyRes = await customerservice.getRazorpayKey();
        key = keyRes?.key || "";
      } catch (err) {
        console.warn("Could not fetch key from server:", err);
      }

      if (!key) {
        toast.error("Payment gateway is not currently configured.");
        setLoading(false);
        return;
      }

      // 3. Create backend payment order
      const isFallback = selectedPlan?._id?.toString().startsWith("fallback_");
      const orderPayload = {
        amount: totalAmount,
        currency: "INR",
        purpose: `Extra ${label} (+${selectedQty}): ${selectedPlan?.name || label}`,
        planId:
          selectedPlan?.planId ||
          (isJob ? "extra_job_post" : "extra_company_post"),
        notes: {
          type: "extra_post",
          actionType,
          quantity: selectedQty,
          extraPlanId: isFallback ? undefined : selectedPlan?._id,
        },
        customerDetails: {
          name: user?.name || "Provider",
          email: user?.email || "",
          phone: user?.phone || "",
        },
      };

      const orderRes = await customerservice.createPaymentOrder(orderPayload);
      if (!orderRes?.success || !orderRes?.order) {
        throw new Error(orderRes?.message || "Failed to create payment order");
      }

      const { order } = orderRes;

      // 4. Open Razorpay Checkout modal
      const options = {
        key: orderRes.key || key,
        amount: order.amount,
        currency: order.currency,
        name: "Mr Job Wala",
        description: `Pay for ${selectedPlan?.name || `${selectedQty} Extra ${label}s`}`,
        order_id: order.id,
        image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#26897D", // MR. JOB WALA theme
        },
        handler: async function (response) {
          try {
            toast.loading("Verifying payment...", { id: "verify-extra-toast" });

            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const verifyRes =
              await customerservice.verifyPayment(verifyPayload);
            toast.dismiss("verify-extra-toast");

            if (verifyRes?.success) {
              toast.success(
                `Payment Successful! +${selectedQty} ${label}${selectedQty > 1 ? "s" : ""} added to your plan 🎉`,
              );
              if (onSuccess) {
                await onSuccess(verifyRes.subscription || verifyRes);
              }
              onClose();
            } else {
              toast.error(verifyRes?.message || "Payment verification failed.");
            }
          } catch (verErr) {
            toast.dismiss("verify-extra-toast");
            console.error("Verification error:", verErr);
            toast.error(
              verErr?.response?.data?.message || "Payment verification failed.",
            );
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            toast("Payment cancelled.", { icon: "ℹ️" });
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", async function (failRes) {
        console.error("Payment failed:", failRes.error);
        toast.error(
          `Payment failed: ${failRes.error?.description || "Transaction declined"}`,
        );
        setLoading(false);
      });

      rzp.open();
    } catch (error) {
      console.error("Extra post checkout error:", error);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to initiate payment",
      );
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full h-full overflow-y-auto scrollbar-none max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
        >
          {/* Header Banner */}
          <div className="relative p-6 sm:p-7 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <Crown className="w-3.5 h-3.5" />
                Active Subscription Add-On
              </span>
              <span className="text-xs text-slate-400">
                {planDetails.name || "Employer Plan"}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              {isJob ? (
                <Briefcase className="w-6 h-6 text-brand-400" />
              ) : (
                <Building2 className="w-6 h-6 text-brand-400" />
              )}
              <span>Unlock Extra {label}</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              You have exhausted your included {pluralLabel} quota (
              <strong className="text-amber-300 font-semibold">
                {used} / {limit} Used
              </strong>
              ). Choose an add-on plan below to publish immediately without
              changing your monthly subscription!
            </p>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-7 space-y-6">
            {/* Dynamic Package Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Add-On Plan
                </label>
                <span className="text-[11px] text-brand-600 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Admin Configured Plans
                </span>
              </div>

              {plansLoading ? (
                <div className="py-8 flex flex-col items-center justify-center gap-2 text-brand-600 bg-slate-50 rounded-2xl border border-slate-100">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-xs font-semibold text-slate-600">
                    Loading available add-on plans...
                  </span>
                </div>
              ) : (
                <div
                  className={`grid gap-3 ${
                    plans.length === 1
                      ? "grid-cols-1"
                      : plans.length === 2
                        ? "grid-cols-2"
                        : "grid-cols-3"
                  }`}
                >
                  {plans.map((pkg) => {
                    const isSelected =
                      selectedPlan?._id === pkg._id ||
                      selectedPlan?.planId === pkg.planId;
                    const discount =
                      pkg.originalPrice && pkg.originalPrice > pkg.price
                        ? Math.round(
                            ((pkg.originalPrice - pkg.price) /
                              pkg.originalPrice) *
                              100,
                          )
                        : 0;

                    return (
                      <button
                        key={pkg._id || pkg.planId}
                        type="button"
                        onClick={() => setSelectedPlan(pkg)}
                        className={`relative p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "border-brand-600 bg-brand-50/40 shadow-sm ring-2 ring-brand-500/20"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-600" />
                        )}

                        <div>
                          {pkg.tag ? (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 px-2 py-0.5 rounded-md bg-brand-100/70 inline-block mb-1.5">
                              {pkg.tag}
                            </span>
                          ) : discount > 0 ? (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 px-2 py-0.5 rounded-md bg-emerald-100/70 inline-block mb-1.5">
                              {discount}% OFF
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-0.5 rounded-md bg-slate-100 inline-block mb-1.5">
                              Add-On
                            </span>
                          )}

                          <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                            +{pkg.quantity} {isJob ? "Job" : "Post"}
                            {pkg.quantity > 1 ? "s" : ""}
                          </div>

                          {pkg.description && (
                            <p className="text-[10px] text-slate-500 line-clamp-1 mt-1">
                              {pkg.description}
                            </p>
                          )}
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-extrabold text-slate-900">
                              ₹{pkg.price}
                            </span>
                            {pkg.originalPrice &&
                              pkg.originalPrice > pkg.price && (
                                <span className="text-[10px] text-slate-400 line-through">
                                  ₹{pkg.originalPrice}
                                </span>
                              )}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            ₹{Math.round(pkg.price / (pkg.quantity || 1))} each
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Price Breakdown Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Selected Plan</span>
                <span className="font-semibold text-slate-900">
                  {selectedPlan?.name ||
                    `+${selectedQty} ${label}${selectedQty > 1 ? "s" : ""}`}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Add-On Credits</span>
                <span className="font-semibold text-slate-900">
                  +{selectedQty} {label}
                  {selectedQty > 1 ? "s" : ""}
                </span>
              </div>
              {selectedPlan && Number(selectedPlan.quantity) > 0 && (
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Effective Per-Post Rate</span>
                  <span className="font-semibold text-brand-700">
                    ₹{Math.round(totalAmount / selectedQty)} / {label}
                  </span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-slate-900">
                    Total Payable
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Inclusive of all platform taxes
                  </p>
                </div>
                <div className="text-2xl font-black text-brand-600">
                  ₹{totalAmount}
                </div>
              </div>
            </div>

            {/* Features check list */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  Instant activation — credit added immediately to your
                  subscription
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  Valid for the entire duration of your active subscription
                  period
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>
                  Secure payment powered by Razorpay 256-bit SSL encryption
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                disabled={loading || plansLoading || !selectedPlan}
                onClick={handlePayAndUnlock}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-teal-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>
                      Pay ₹{totalAmount} & Unlock +{selectedQty} {label}
                      {selectedQty > 1 ? "s" : ""}
                    </span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>Need a larger monthly quota?</span>
                <Link
                  to="/pricing"
                  onClick={onClose}
                  className="font-bold text-brand-600 hover:underline flex items-center gap-1"
                >
                  <span>Explore Higher Plans</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
