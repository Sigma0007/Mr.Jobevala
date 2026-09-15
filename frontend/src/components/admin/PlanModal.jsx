import React, { useState, useEffect } from "react";
import {
  X,
  Loader2,
  Sparkles,
  Plus,
  Trash2,
  Check,
  Flame,
  CheckCircle2,
  Tag,
  CreditCard,
  Eye,
  MessageSquare,
  Briefcase,
  UserCheck,
} from "lucide-react";
import api from "../../customer/customerservice";
import { toast } from "react-hot-toast";

const PlanModal = ({ isOpen, onClose, planToEdit, onPlanSaved }) => {
  const [formData, setFormData] = useState({
    planId: "",
    categoryId: "seekers",
    category: "For Job Seekers",
    name: "",
    price: "",
    originalPrice: "",
    badge: "",
    highlighted: false,
    description: "",
    features: [],
    directMessagesLimit: 0,
    jobPostsLimit: 0,
    unlockContactsLimit: 0,
    validityDays: 30,
    sortOrder: 0,
    isActive: true,
  });

  const [newFeatureText, setNewFeatureText] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);

  useEffect(() => {
    if (planToEdit) {
      setFormData({
        planId: planToEdit.planId || "",
        categoryId: planToEdit.categoryId || "seekers",
        category: planToEdit.category || "For Job Seekers",
        name: planToEdit.name || "",
        price: planToEdit.price !== undefined ? planToEdit.price : "",
        originalPrice:
          planToEdit.originalPrice !== undefined
            ? planToEdit.originalPrice
            : "",
        badge: planToEdit.badge || "",
        highlighted: Boolean(planToEdit.highlighted),
        description: planToEdit.description || "",
        features: Array.isArray(planToEdit.features)
          ? [...planToEdit.features]
          : [],
        directMessagesLimit:
          planToEdit.directMessagesLimit !== undefined
            ? planToEdit.directMessagesLimit
            : 0,
        jobPostsLimit:
          planToEdit.jobPostsLimit !== undefined
            ? planToEdit.jobPostsLimit
            : 0,
        unlockContactsLimit:
          planToEdit.unlockContactsLimit !== undefined
            ? planToEdit.unlockContactsLimit
            : 0,
        validityDays: planToEdit.validityDays || 30,
        sortOrder: planToEdit.sortOrder || 0,
        isActive: planToEdit.isActive !== undefined ? planToEdit.isActive : true,
      });
      setAutoSlug(false);
    } else {
      setFormData({
        planId: "",
        categoryId: "seekers",
        category: "For Job Seekers",
        name: "",
        price: "",
        originalPrice: "",
        badge: "",
        highlighted: false,
        description: "",
        features: [],
        directMessagesLimit: 0,
        jobPostsLimit: 0,
        unlockContactsLimit: 0,
        validityDays: 30,
        sortOrder: 0,
        isActive: true,
      });
      setAutoSlug(true);
    }
    setNewFeatureText("");
  }, [planToEdit, isOpen]);

  if (!isOpen) return null;

  const generateSlug = (text, categoryId, price) => {
    const slug = text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/(^_|_$)/g, "");
    return `${categoryId || "plan"}_${slug || "custom"}_${price || ""}`.replace(
      /_+$/,
      "",
    );
  };

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "categoryId") {
        if (value === "seekers") updated.category = "For Job Seekers";
        else if (value === "employers") updated.category = "For Employers";
        else updated.category = "Custom Plan";
      }

      if (autoSlug && !planToEdit && (field === "name" || field === "categoryId" || field === "price")) {
        const nameVal = field === "name" ? value : prev.name;
        const catVal = field === "categoryId" ? value : prev.categoryId;
        const priceVal = field === "price" ? value : prev.price;
        updated.planId = generateSlug(nameVal, catVal, priceVal);
      }

      return updated;
    });
  };

  const handleAddFeature = (e) => {
    e?.preventDefault();
    const cleanText = newFeatureText.trim();
    if (!cleanText) return;

    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, cleanText],
    }));
    setNewFeatureText("");
  };

  const handleRemoveFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, idx) => idx !== index),
    }));
  };

  const discountPercent =
    formData.price && formData.originalPrice && Number(formData.originalPrice) > Number(formData.price)
      ? Math.round(
          ((Number(formData.originalPrice) - Number(formData.price)) /
            Number(formData.originalPrice)) *
            100,
        )
      : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter a plan name.");
      return;
    }

    if (formData.price === "" || Number(formData.price) < 0) {
      toast.error("Please enter a valid plan price.");
      return;
    }

    if (formData.originalPrice === "" || Number(formData.originalPrice) < 0) {
      toast.error("Please enter a valid original price.");
      return;
    }

    if (!formData.features.length) {
      toast.error("Please add at least one feature item.");
      return;
    }

    setLoading(true);

    try {
      let response;
      if (planToEdit) {
        const targetId = planToEdit._id || planToEdit.planId;
        response = await api.updatePricingPlan(targetId, formData);
      } else {
        response = await api.createPricingPlan(formData);
      }

      if (response.success) {
        toast.success(
          response.message ||
            (planToEdit
              ? "Plan updated successfully!"
              : "Plan created successfully!"),
        );
        if (onPlanSaved) onPlanSaved(response.data);
        onClose();
      } else {
        toast.error(response.message || "Failed to save plan.");
      }
    } catch (err) {
      console.error("Save plan error:", err);
      toast.error(
        err?.response?.data?.message || err.message || "Failed to save plan.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-indigo-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {planToEdit ? "Edit Pricing Plan" : "Create New Pricing Plan"}
              </h2>
              <p className="text-xs text-slate-500">
                Configure plan details, pricing, features list & settings
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowLivePreview(!showLivePreview)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors ${
                showLivePreview
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              {showLivePreview ? "Hide Preview" : "Live Preview"}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Live Card Preview (Collapsible) */}
          {showLivePreview && (
            <div className="p-5 bg-slate-50 rounded-2xl border border-indigo-100 mb-6">
              <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Live Card Preview
              </div>
              <div className="max-w-sm mx-auto">
                <div
                  className={`relative rounded-3xl p-6 flex flex-col justify-between bg-white shadow-xl ${
                    formData.highlighted
                      ? "border-2 border-indigo-500 ring-4 ring-indigo-50/70"
                      : "border border-slate-200/90"
                  }`}
                >
                  {formData.badge && (
                    <div
                      className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-white shadow-md flex items-center gap-1.5 ${
                        formData.highlighted
                          ? "bg-gradient-to-r from-indigo-600 to-blue-600"
                          : "bg-slate-800"
                      }`}
                    >
                      {formData.highlighted && (
                        <Flame className="w-3 h-3 text-amber-300" />
                      )}
                      <span>{formData.badge}</span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-md">
                        {formData.category || "Plan Category"}
                      </span>
                      {discountPercent > 0 && (
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                      {formData.name || "Plan Name Here"}
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed min-h-[32px]">
                      {formData.description || "Plan description goes here..."}
                    </p>

                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        ₹{formData.price || 0}
                      </span>
                      {formData.originalPrice && (
                        <span className="text-slate-400 line-through text-sm font-medium">
                          ₹{formData.originalPrice}
                        </span>
                      )}
                      <span className="text-xs text-slate-500 font-medium">
                        / {formData.validityDays} days
                      </span>
                    </div>

                    {/* Quota limits pills */}
                    {(Number(formData.directMessagesLimit) > 0 ||
                      Number(formData.jobPostsLimit) > 0 ||
                      Number(formData.unlockContactsLimit) > 0) && (
                      <div className="flex flex-wrap gap-1.5 my-3">
                        {Number(formData.directMessagesLimit) > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-semibold border border-indigo-100">
                            <MessageSquare className="w-2.5 h-2.5" />
                            {formData.directMessagesLimit} DMs
                          </span>
                        )}
                        {Number(formData.jobPostsLimit) > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-100">
                            <Briefcase className="w-2.5 h-2.5" />
                            {formData.jobPostsLimit} Posts
                          </span>
                        )}
                        {Number(formData.unlockContactsLimit) > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-100">
                            <UserCheck className="w-2.5 h-2.5" />
                            {formData.unlockContactsLimit} Contacts
                          </span>
                        )}
                      </div>
                    )}

                    <div className="w-full border-t border-slate-100 my-4"></div>

                    <div className="text-[11px] font-semibold text-slate-900 uppercase tracking-wider mb-2">
                      What's Included:
                    </div>

                    <ul className="space-y-2 text-xs text-slate-700">
                      {(formData.features.length > 0
                        ? formData.features
                        : ["Sample feature 1", "Sample feature 2"]
                      ).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="mt-0.5 rounded-full p-0.5 bg-emerald-50 text-emerald-600 flex-shrink-0">
                            <Check className="w-3 h-3" strokeWidth={3} />
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-2">
                    <button
                      type="button"
                      className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-xs shadow-md ${
                        formData.highlighted
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25"
                          : "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20"
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      Pay ₹{formData.price || 0} with Razorpay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Core Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Category Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Target Category *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => handleChange("categoryId", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="seekers">For Job Seekers (seekers)</option>
                <option value="employers">For Employers (employers)</option>
                <option value="custom">Custom / Special Audience</option>
              </select>
            </div>

            {/* Category Display Label */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Category Display Label *
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                placeholder="e.g. For Job Seekers"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            {/* Plan Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Plan Title / Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g. Candidate Spotlight Pro"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-semibold"
                required
              />
            </div>

            {/* Plan Slug / ID */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Unique Plan ID / Key *
                </label>
                {!planToEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      setAutoSlug(!autoSlug);
                      if (!autoSlug) {
                        setFormData((prev) => ({
                          ...prev,
                          planId: generateSlug(
                            prev.name,
                            prev.categoryId,
                            prev.price,
                          ),
                        }));
                      }
                    }}
                    className="text-[11px] text-indigo-600 hover:underline"
                  >
                    {autoSlug ? "Manual Slug" : "Auto Slug"}
                  </button>
                )}
              </div>
              <input
                type="text"
                value={formData.planId}
                onChange={(e) => {
                  setAutoSlug(false);
                  handleChange("planId", e.target.value);
                }}
                placeholder="e.g. seeker_pro_199"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 font-mono bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Pricing & Discount Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 bg-indigo-50/40 p-4 rounded-2xl border border-indigo-100/60">
            {/* Offer Price */}
            <div>
              <label className="block text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">
                Offer Price (₹) *
              </label>
              <input
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="e.g. 199"
                className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 bg-white text-base font-bold text-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Original Price */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Original Price (₹) *
              </label>
              <input
                type="number"
                min="0"
                value={formData.originalPrice}
                onChange={(e) => handleChange("originalPrice", e.target.value)}
                placeholder="e.g. 499"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-base font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Discount & Validity */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Validity (Days) & Discount
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={formData.validityDays}
                  onChange={(e) => handleChange("validityDays", e.target.value)}
                  placeholder="30"
                  className="w-24 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {discountPercent > 0 && (
                  <span className="px-3 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold whitespace-nowrap">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Plan Limits & Access Quotas (Validation Rules) */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-3">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Access Quotas & Validation Limits
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Configured limits used for User / Provider feature access validation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              {/* Direct Messages Limit */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                  Direct Messages Limit
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.directMessagesLimit}
                  onChange={(e) =>
                    handleChange("directMessagesLimit", e.target.value)
                  }
                  placeholder="e.g. 15"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Allowed direct messages
                </span>
              </div>

              {/* Job Posts Limit */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                  Job Posts Limit
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.jobPostsLimit}
                  onChange={(e) =>
                    handleChange("jobPostsLimit", e.target.value)
                  }
                  placeholder="e.g. 5"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Allowed job posts (Employers)
                </span>
              </div>

              {/* Unlock Candidate Contacts Limit */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Unlock Contacts Limit
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.unlockContactsLimit}
                  onChange={(e) =>
                    handleChange("unlockContactsLimit", e.target.value)
                  }
                  placeholder="e.g. 100"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Verified candidate unlocks
                </span>
              </div>
            </div>
          </div>

          {/* Badge & Highlighted Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Top Badge Text (Optional)
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => handleChange("badge", e.target.value)}
                placeholder="e.g. Most Popular, Starter, Ultimate Value"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Display Order (Sort Index)
              </label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => handleChange("sortOrder", e.target.value)}
                placeholder="0, 1, 2..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-6 pt-2">
            <label className="inline-flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.highlighted}
                onChange={(e) => handleChange("highlighted", e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
              />
              <span className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                Featured Plan (Glow border & primary focus)
              </span>
            </label>

            <label className="inline-flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleChange("isActive", e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300"
              />
              <span className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Active & Live on Pricing Page
              </span>
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Plan Summary / Tagline
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="e.g. Supercharge your career search with top-tier visibility and recruiter access."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Features Manager */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Features & Benefits List ({formData.features.length}) *
            </label>

            {/* Input to add feature */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="Type a feature bullet point and click Add (or press Enter)..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {/* Features Pill/List View */}
            {formData.features.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                No features added yet. Type above and click Add.
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {formData.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200/80 px-3.5 py-2 rounded-xl text-xs text-slate-800"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                      </div>
                      <span className="font-medium">{feat}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/80">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-sm font-semibold transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {planToEdit ? "Update Plan" : "Create Plan"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanModal;
