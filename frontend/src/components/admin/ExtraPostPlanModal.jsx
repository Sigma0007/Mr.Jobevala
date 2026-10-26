import React, { useState, useEffect } from "react";
import {
  X,
  Loader2,
  Sparkles,
  Plus,
  Trash2,
  Check,
  CreditCard,
  Briefcase,
  Building2,
  Tag,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react";
import api from "../../customer/customerservice";
import { toast } from "react-hot-toast";

const ExtraPostPlanModal = ({ isOpen, onClose, planToEdit, onPlanSaved }) => {
  const [formData, setFormData] = useState({
    planId: "",
    name: "",
    postType: "job_post", // 'job_post' | 'company_post'
    quantity: 1,
    price: "",
    originalPrice: "",
    tag: "",
    description: "",
    features: [],
    sortOrder: 0,
    isActive: true,
  });

  const [newFeatureText, setNewFeatureText] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);

  const generateSlug = (name, postType, quantity) => {
    const type = postType === "company_post" ? "company" : "job";
    const cleaned = (name || "plan")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/(^_|_$)/g, "");
    return `extra_${type}_${quantity || 1}_${cleaned}`.slice(0, 45);
  };

  useEffect(() => {
    if (planToEdit) {
      setFormData({
        planId: planToEdit.planId || "",
        name: planToEdit.name || "",
        postType: planToEdit.postType || "job_post",
        quantity: planToEdit.quantity || 1,
        price: planToEdit.price !== undefined ? planToEdit.price : "",
        originalPrice:
          planToEdit.originalPrice !== undefined ? planToEdit.originalPrice : "",
        tag: planToEdit.tag || "",
        description: planToEdit.description || "",
        features: Array.isArray(planToEdit.features)
          ? [...planToEdit.features]
          : [],
        sortOrder: planToEdit.sortOrder || 0,
        isActive: planToEdit.isActive !== undefined ? planToEdit.isActive : true,
      });
      setAutoSlug(false);
    } else {
      setFormData({
        planId: "",
        name: "",
        postType: "job_post",
        quantity: 1,
        price: "",
        originalPrice: "",
        tag: "Instant Post",
        description: "Unlock 1 extra post to publish immediately",
        features: [
            "Instant credit added to subscription",
            "Valid for entire active subscription period",
        ],
        sortOrder: 0,
        isActive: true,
      });
      setAutoSlug(true);
    }
  }, [planToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (
        autoSlug &&
        !planToEdit &&
        (field === "name" || field === "postType" || field === "quantity")
      ) {
        updated.planId = generateSlug(
          field === "name" ? value : prev.name,
          field === "postType" ? value : prev.postType,
          field === "quantity" ? value : prev.quantity
        );
      }
      return updated;
    });
  };

  const handleAddFeature = () => {
    const trimmed = newFeatureText.trim();
    if (!trimmed) return;
    if (formData.features.includes(trimmed)) {
      toast.error("This perk/feature is already in the list.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, trimmed],
    }));
    setNewFeatureText("");
  };

  const handleRemoveFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter a plan name.");
      return;
    }

    if (formData.price === "" || Number(formData.price) < 0) {
      toast.error("Please enter a valid price (₹).");
      return;
    }

    if (Number(formData.quantity) < 1) {
      toast.error("Quantity must be at least 1 post.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        postType: formData.postType,
        quantity: Number(formData.quantity) || 1,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice) || 0,
        tag: formData.tag.trim(),
        description: formData.description.trim(),
        features: formData.features,
        sortOrder: Number(formData.sortOrder) || 0,
        isActive: Boolean(formData.isActive),
        planId: formData.planId.trim() || undefined,
      };

      let response;
      if (planToEdit) {
        const targetId = planToEdit._id || planToEdit.planId;
        response = await api.updateExtraPostPlan(targetId, payload);
      } else {
        response = await api.createExtraPostPlan(payload);
      }

      if (response.success) {
        toast.success(
          response.message ||
            `Extra post plan ${planToEdit ? "updated" : "created"} successfully!`
        );
        if (onPlanSaved) {
          onPlanSaved(response.data);
        }
        onClose();
      } else {
        toast.error(response.message || "Failed to save extra post plan.");
      }
    } catch (error) {
      console.error("Save Extra Post Plan error:", error);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to save extra post plan."
      );
    } finally {
      setLoading(false);
    }
  };

  const discountPercent =
    formData.originalPrice &&
    Number(formData.originalPrice) > Number(formData.price) &&
    Number(formData.price) > 0
      ? Math.round(
          ((Number(formData.originalPrice) - Number(formData.price)) /
            Number(formData.originalPrice)) *
            100
        )
      : 0;

  const isJob = formData.postType === "job_post";
  const label = isJob ? "Job Post" : "Company Post";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  isJob
                    ? "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                    : "bg-purple-500/20 text-purple-300 border border-purple-400/30"
                }`}
              >
                {isJob ? (
                  <Briefcase className="w-3 h-3" />
                ) : (
                  <Building2 className="w-3 h-3" />
                )}
                {isJob ? "Extra Job Post Plan" : "Extra Company Post Plan"}
              </span>
              <span className="text-xs text-slate-400">
                {planToEdit ? "Edit Plan" : "Create New Add-On Plan"}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white mt-1">
              {planToEdit ? `Edit: ${planToEdit.name}` : "Create Extra Post Add-On Plan"}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowLivePreview(!showLivePreview)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                showLivePreview
                  ? "bg-brand-500 text-white shadow-sm"
                  : "bg-white/10 text-slate-300 hover:text-white hover:bg-white/15"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showLivePreview ? "Hide Preview" : "Live Preview"}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Live Preview Card */}
          {showLivePreview && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-brand-600" />
                  Employer Modal Card Preview
                </span>
                <span className="text-[10px] text-slate-400">
                  How it appears in ExtraPostModal
                </span>
              </div>

              <div className="max-w-xs mx-auto p-4 rounded-2xl border-2 border-brand-600 bg-brand-50/40 shadow-sm ring-2 ring-brand-500/20 relative">
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-brand-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 px-2 py-0.5 rounded-md bg-brand-100/70 inline-block mb-1.5">
                  {formData.tag || "Instant Post"}
                </span>
                <div className="text-base font-black text-slate-900">
                  +{formData.quantity || 1} {isJob ? "Job" : "Post"}
                  {Number(formData.quantity) > 1 ? "s" : ""}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {formData.description || "Unlock extra posts to publish now"}
                </p>

                <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-black text-slate-900">
                      ₹{formData.price || 0}
                    </span>
                    {formData.originalPrice &&
                      Number(formData.originalPrice) > Number(formData.price) && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{formData.originalPrice}
                        </span>
                      )}
                  </div>
                  {discountPercent > 0 && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  ₹
                  {Math.round(
                    (Number(formData.price) || 0) / (Number(formData.quantity) || 1)
                  )}{" "}
                  each
                </div>
              </div>
            </div>
          )}

          {/* Post Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Add-On Category / Target Quota *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleChange("postType", "job_post")}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  formData.postType === "job_post"
                    ? "border-blue-600 bg-blue-50/70 text-blue-900 shadow-sm ring-2 ring-blue-500/20"
                    : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    formData.postType === "job_post"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold">Extra Job Posts</div>
                  <div className="text-[11px] text-slate-500">
                    For publishing job listings beyond plan quota
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleChange("postType", "company_post")}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  formData.postType === "company_post"
                    ? "border-purple-600 bg-purple-50/70 text-purple-900 shadow-sm ring-2 ring-purple-500/20"
                    : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    formData.postType === "company_post"
                      ? "bg-purple-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold">Extra Company Posts</div>
                  <div className="text-[11px] text-slate-500">
                    For publishing community feed posts
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Title & Slug Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Plan Name / Title *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g. 1 Job Post or Hiring Sprint (3 Posts)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Plan Slug / ID *
                </label>
                {!planToEdit && (
                  <button
                    type="button"
                    onClick={() => setAutoSlug(!autoSlug)}
                    className="text-[11px] text-brand-600 hover:underline cursor-pointer"
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
                placeholder="e.g. extra_job_3"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>
          </div>

          {/* Quantity, Price, Original Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100/60">
            <div>
              <label className="block text-xs font-bold text-indigo-950 uppercase tracking-wider mb-1.5">
                Post Credits Quantity *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleChange("quantity", e.target.value)}
                  placeholder="1"
                  className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 bg-white text-base font-bold text-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400">
                  Posts
                </span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Number of extra {isJob ? "jobs" : "posts"} unlocked
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-indigo-950 uppercase tracking-wider mb-1.5">
                Offer Price (₹) *
              </label>
              <input
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="99"
                className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 bg-white text-base font-bold text-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Amount charged via Razorpay
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Original Price (₹)
                </label>
                {discountPercent > 0 && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
              <input
                type="number"
                min="0"
                value={formData.originalPrice}
                onChange={(e) => handleChange("originalPrice", e.target.value)}
                placeholder="149"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                For strikethrough discount display
              </span>
            </div>
          </div>

          {/* Badge Tag & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tag / Badge Text (Optional)
              </label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) => handleChange("tag", e.target.value)}
                placeholder="e.g. Instant Post, Best Value, Hiring Sprint"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Sort Order (Display Index)
              </label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => handleChange("sortOrder", e.target.value)}
                placeholder="1, 2, 3..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Short Description / Subtitle
            </label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="e.g. Unlock 1 extra post to publish now without changing your plan"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Features / Bullet Points */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Features & Perks Included
            </label>
            <div className="flex gap-2 mb-2.5">
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
                placeholder="e.g. Instant activation, valid with active plan"
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>

            {formData.features.length > 0 && (
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {formData.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <div className="text-sm font-bold text-slate-800">
                Plan Active Status
              </div>
              <div className="text-xs text-slate-500">
                Active plans appear inside the employer's Unlock Extra Post modal
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleChange("isActive", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-500/25 transition-all cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{planToEdit ? "Update Plan" : "Create Plan"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExtraPostPlanModal;
