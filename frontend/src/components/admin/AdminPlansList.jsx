import React, { useState, useEffect } from "react";
import api from "../../customer/customerservice";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  CreditCard,
  RefreshCw,
  Check,
  Flame,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  User,
  Building2,
  Layers,
  MessageSquare,
  Briefcase,
  UserCheck,
  Users,
} from "lucide-react";
import { toast } from "react-hot-toast";
import PlanModal from "./PlanModal";

const AdminPlansList = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [planToEdit, setPlanToEdit] = useState(null);
  const [seedingLoading, setSeedingLoading] = useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      // Pass all=true so admin can see inactive plans too
      const response = await api.getPricingPlans("?all=true");
      if (response.success) {
        setPlans(response.data || []);
      } else {
        toast.error(response.message || "Failed to load pricing plans.");
      }
    } catch (error) {
      console.error("Error fetching pricing plans:", error);
      toast.error("Failed to load pricing plans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleAddNew = () => {
    setPlanToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (plan) => {
    setPlanToEdit(plan);
    setIsModalOpen(true);
  };

  const handleDelete = async (plan) => {
    const targetId = plan._id || plan.planId;
    if (
      !window.confirm(
        `Are you sure you want to delete the plan "${plan.name}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      const response = await api.deletePricingPlan(targetId);
      if (response.success) {
        toast.success(response.message || "Pricing plan deleted successfully!");
        setPlans((prev) =>
          prev.filter((p) => (p._id || p.planId) !== targetId),
        );
      } else {
        toast.error(response.message || "Failed to delete pricing plan.");
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast.error(error?.response?.data?.message || "Failed to delete plan.");
    }
  };

  const handleToggleActive = async (plan) => {
    const targetId = plan._id || plan.planId;
    const newStatus = !plan.isActive;

    try {
      const response = await api.updatePricingPlan(targetId, {
        isActive: newStatus,
      });
      if (response.success) {
        toast.success(
          `Plan is now ${newStatus ? "Active (Live)" : "Inactive (Hidden)"}`,
        );
        setPlans((prev) =>
          prev.map((p) =>
            (p._id || p.planId) === targetId
              ? { ...p, isActive: newStatus }
              : p,
          ),
        );
      } else {
        toast.error(response.message || "Failed to update plan status.");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Failed to update plan status.");
    }
  };

  const handleSeedDefaults = async () => {
    if (
      !window.confirm(
        "This will restore and sync default plans for Job Seekers and Employers. Continue?",
      )
    ) {
      return;
    }

    setSeedingLoading(true);
    try {
      const response = await api.seedPricingPlans({ overwrite: false });
      if (response.success) {
        toast.success("Default plans synced successfully!");
        setPlans(response.data || []);
      } else {
        toast.error(response.message || "Failed to seed default plans.");
      }
    } catch (err) {
      console.error("Seed error:", err);
      toast.error(err?.response?.data?.message || "Failed to seed plans.");
    } finally {
      setSeedingLoading(false);
    }
  };

  // Filter plans
  const filteredPlans = plans.filter((p) => {
    const matchesCategory =
      selectedCategory === "all" || p.categoryId === selectedCategory;

    const term = searchTerm.toLowerCase().trim();
    if (!term) return matchesCategory;

    const matchesName = p.name?.toLowerCase().includes(term);
    const matchesId = p.planId?.toLowerCase().includes(term);
    const matchesCategoryName = p.category?.toLowerCase().includes(term);
    const matchesDesc = p.description?.toLowerCase().includes(term);
    const matchesFeature = p.features?.some((f) =>
      f?.toLowerCase().includes(term),
    );

    return (
      matchesCategory &&
      (matchesName ||
        matchesId ||
        matchesCategoryName ||
        matchesDesc ||
        matchesFeature)
    );
  });

  const activeCount = plans.filter((p) => p.isActive).length;
  const featuredCount = plans.filter((p) => p.highlighted).length;
  const seekersCount = plans.filter((p) => p.categoryId === "seekers").length;
  const employersCount = plans.filter(
    (p) => p.categoryId === "employers",
  ).length;
  const customCount = plans.filter((p) => p.categoryId === "custom").length;

  return (
    <div className="space-y-6">
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Plans</p>
            <p className="text-xl font-bold text-slate-900">{plans.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Active (Live)</p>
            <p className="text-xl font-bold text-emerald-600">{activeCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Job Seekers</p>
            <p className="text-xl font-bold text-blue-600">{seekersCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Employers</p>
            <p className="text-xl font-bold text-violet-600">
              {employersCount}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">
              Special Audience
            </p>
            <p className="text-xl font-bold text-purple-600">{customCount}</p>
          </div>
        </div>
      </div>

      {/* Main Header & Actions */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              Dynamic Pricing Plans Management
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Create, edit, toggle active status, and manage pricing & perks for
              Job Seekers and Employers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleSeedDefaults}
              disabled={seedingLoading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
              title="Sync initial default plans"
            >
              <RotateCcw
                className={`w-3.5 h-3.5 ${seedingLoading ? "animate-spin" : ""}`}
              />
              Seed Defaults
            </button>

            <button
              onClick={fetchPlans}
              disabled={loading}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title="Refresh plans"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>

            <button
              onClick={handleAddNew}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add New Plan
            </button>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto w-fit">
            {[
              { id: "all", label: "All Plans" },
              { id: "seekers", label: "Job Seekers" },
              { id: "employers", label: "Employers" },
              { id: "custom", label: "Special Audience" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === tab.id
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px] sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search plans or features..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Plans Grid */}
        <div className="mt-6">
          {loading ? (
            <div className="py-20 text-center">
              <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-600">
                Loading pricing plans...
              </p>
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="py-16 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800">
                No Pricing Plans Found
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-5">
                {searchTerm
                  ? "No plans match your current search query."
                  : "No pricing plans in this category yet. You can create one or seed initial presets."}
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleAddNew}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-md transition-colors"
                >
                  Create New Plan
                </button>
                <button
                  onClick={handleSeedDefaults}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Seed Default Plans
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlans.map((plan) => {
                const discount =
                  plan.originalPrice &&
                  plan.price &&
                  plan.originalPrice > plan.price
                    ? Math.round(
                        ((plan.originalPrice - plan.price) /
                          plan.originalPrice) *
                          100,
                      )
                    : 0;

                return (
                  <div
                    key={plan._id || plan.planId}
                    className={`relative rounded-3xl p-6 flex flex-col justify-between bg-white border transition-all ${
                      plan.highlighted
                        ? "border-indigo-500 ring-2 ring-indigo-100 shadow-lg shadow-indigo-100/50"
                        : "border-slate-200/90 shadow-sm hover:shadow-md"
                    } ${!plan.isActive ? "opacity-60 bg-slate-50/70" : ""}`}
                  >
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-md">
                          {plan.category}
                        </span>
                        {plan.badge && (
                          <span className="text-[10px] font-bold text-slate-700 uppercase bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                            {plan.highlighted && (
                              <Flame className="w-2.5 h-2.5 text-amber-500" />
                            )}
                            {plan.badge}
                          </span>
                        )}
                      </div>

                      {/* Active Status Badge */}
                      <button
                        onClick={() => handleToggleActive(plan)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors ${
                          plan.isActive
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                        }`}
                        title="Click to toggle active status"
                      >
                        {plan.isActive ? (
                          <>
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                            Live
                          </>
                        ) : (
                          <>
                            <XCircle className="w-2.5 h-2.5 text-rose-500" />
                            Hidden
                          </>
                        )}
                      </button>
                    </div>

                    {/* Plan Title & ID */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                        {plan.name}
                      </h3>
                      <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                        Key: {plan.planId}
                      </p>

                      {plan.categoryId === "custom" && (
                        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
                            <Users className="w-3 h-3 text-purple-600" />
                            {Array.isArray(plan.targetProviders) &&
                            plan.targetProviders.length > 0
                              ? `Targeted: ${plan.targetProviders.length} Provider(s)`
                              : "Special Audience (Open)"}
                          </span>
                          {Array.isArray(plan.targetProviders) &&
                            plan.targetProviders.length > 0 && (
                              <span
                                className="text-[10px] text-slate-500 truncate max-w-[200px]"
                                title={plan.targetProviders
                                  .map((p) =>
                                    typeof p === "object"
                                      ? p.name || p.email
                                      : p,
                                  )
                                  .join(", ")}
                              >
                                (
                                {plan.targetProviders
                                  .map((p) =>
                                    typeof p === "object"
                                      ? p.name || p.email
                                      : p,
                                  )
                                  .slice(0, 2)
                                  .join(", ")}
                                {plan.targetProviders.length > 2 ? "..." : ""})
                              </span>
                            )}
                        </div>
                      )}

                      <p className="mt-2 text-xs text-slate-600 line-clamp-2 min-h-[32px] leading-relaxed">
                        {plan.description || "No description provided."}
                      </p>

                      {/* Price & Discount */}
                      <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-slate-900">
                          ₹{plan.price}
                        </span>
                        {plan.originalPrice && (
                          <span className="text-slate-400 line-through text-sm font-medium">
                            ₹{plan.originalPrice}
                          </span>
                        )}
                        {discount > 0 && (
                          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                            {discount}% OFF
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 ml-auto font-medium">
                          {plan.validityDays} Days
                        </span>
                      </div>

                      {/* Quota Limits Preview */}
                      {(Number(plan.directMessagesLimit) > 0 ||
                        Number(plan.jobPostsLimit) > 0 ||
                        Number(plan.companyPostsLimit) > 0 ||
                        Number(plan.unlockContactsLimit) > 0) && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {Number(plan.directMessagesLimit) > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-semibold border border-indigo-100">
                              <MessageSquare className="w-2.5 h-2.5" />
                              {plan.directMessagesLimit} DMs
                            </span>
                          )}
                          {Number(plan.jobPostsLimit) > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-100">
                              <Briefcase className="w-2.5 h-2.5" />
                              {plan.jobPostsLimit} Jobs
                            </span>
                          )}
                          {Number(plan.companyPostsLimit) > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 text-[10px] font-semibold border border-purple-100">
                              <Sparkles className="w-2.5 h-2.5" />
                              {plan.companyPostsLimit} Company Posts
                            </span>
                          )}
                          {Number(plan.unlockContactsLimit) > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-100">
                              <UserCheck className="w-2.5 h-2.5" />
                              {plan.unlockContactsLimit} Unlocks
                            </span>
                          )}
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${
                              plan.resumeAccess
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                          >
                            <Sparkles className="w-2.5 h-2.5" />
                            {plan.resumeAccess
                              ? "Premium Resumes (True)"
                              : "Simple Resumes (False)"}
                          </span>
                        </div>
                      )}

                      <div className="w-full border-t border-slate-100 my-4"></div>

                      {/* Features preview */}
                      <div className="space-y-1.5 mb-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Features ({plan.features?.length || 0})
                        </p>
                        {plan.features?.slice(0, 3).map((feat, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-1.5 text-xs text-slate-700"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{feat}</span>
                          </div>
                        ))}
                        {plan.features?.length > 3 && (
                          <p className="text-[11px] text-indigo-600 font-medium pl-5">
                            +{plan.features.length - 3} more perks
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                      <button
                        onClick={() => handleToggleActive(plan)}
                        className={`text-xs font-semibold py-1.5 px-3 rounded-xl border transition-colors ${
                          plan.isActive
                            ? "border-slate-200 text-slate-600 hover:bg-slate-100"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {plan.isActive ? "Hide from Users" : "Publish Live"}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEdit(plan)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                          title="Edit plan"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(plan)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Delete plan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Plan Modal (Create / Edit) */}
      <PlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        planToEdit={planToEdit}
        onPlanSaved={() => {
          fetchPlans();
        }}
      />
    </div>
  );
};

export default AdminPlansList;
