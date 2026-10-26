import React, { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  Send,
  Trash2,
  ExternalLink,
  Sparkles,
  Heart,
  Share2,
  X,
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  Eye,
  Crown,
  CreditCard,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import customerservice from "../../customer/customerservice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ExtraPostModal from "../Modals/ExtraPostModal";

export default function EmployerPosts() {
  const { user } = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [subLoading, setSubLoading] = useState(true);
  const [isExtraModalOpen, setIsExtraModalOpen] = useState(false);

  // Form State
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [deleteModalPostId, setDeleteModalPostId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Load provider company profile & existing posts & subscription
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    setSubLoading(true);
    try {
      const [profileRes, postsRes, subRes] = await Promise.all([
        customerservice.getCompanyProfile(),
        customerservice.getMyPosts(),
        customerservice.getCurrentSubscription(),
      ]);

      if (profileRes?.success && profileRes?.data) {
        setCompanyProfile(profileRes.data);
      }
      if (postsRes?.success && Array.isArray(postsRes?.data)) {
        setPosts(postsRes.data);
      }
      if (subRes?.success) {
        setSubscription(subRes.activeSubscription || subRes.data || null);
      }
    } catch (error) {
      console.error("Error fetching provider posts data:", error);
      toast.error("Failed to load your posts");
    } finally {
      setLoading(false);
      setSubLoading(false);
    }
  };

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP, GIF)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file size must be less than 10MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const hasActiveSub = subscription && subscription.status === "active";
  const companyLimit = subscription?.companyPostsLimit || 0;
  const companyUsed = subscription?.companyPostsUsed || 0;
  const companyRemaining = Math.max(0, companyLimit - companyUsed);
  const isQuotaExhausted = hasActiveSub && companyLimit > 0 && companyUsed >= companyLimit;
  const extraCompanyPostPrice =
    subscription?.planDetails?.extraCompanyPostPrice ??
    (subscription?.plan?.extraCompanyPostPrice ?? 49);

  const submitPostData = async () => {
    setSubmitting(true);
    try {
      let res;
      if (imageFile) {
        const formData = new FormData();
        formData.append("description", description.trim());
        formData.append("image", imageFile);
        res = await customerservice.createPost(formData, true);
      } else {
        res = await customerservice.createPost({
          description: description.trim(),
        });
      }

      if (res?.success) {
        toast.success("Post published to community feed! 🎉");
        setDescription("");
        setImageFile(null);
        setImagePreview("");
        setShowPreview(false);
        // Refresh posts and subscription
        const [updatedPosts, updatedSub] = await Promise.all([
          customerservice.getMyPosts(),
          customerservice.getCurrentSubscription(),
        ]);
        if (updatedPosts?.success) {
          setPosts(updatedPosts.data);
        }
        if (updatedSub?.success) {
          setSubscription(updatedSub.activeSubscription || updatedSub.data || null);
        }
      } else {
        toast.error(res?.message || "Failed to publish post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong while creating the post.";
      toast.error(errMsg);
      if (error?.response?.data?.quotaExhausted) {
        setIsExtraModalOpen(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleExtraPostSuccess = async (updatedSub) => {
    if (updatedSub) {
      setSubscription(updatedSub);
    } else {
      const subRes = await customerservice.getCurrentSubscription();
      if (subRes?.success) setSubscription(subRes.activeSubscription || subRes.data || null);
    }
    // Now trigger post creation
    await submitPostData();
  };

  // Submit Post
  const handleCreatePost = async (e) => {
    e.preventDefault();

    const hasDesc = description.trim().length > 0;
    const hasImg = !!imageFile || !!imagePreview;

    if (!hasDesc && !hasImg) {
      toast.error(
        "Please add either a description or an image to publish your post.",
      );
      return;
    }

    if (!hasActiveSub) {
      toast.error("An active subscription plan is required to publish company posts.");
      return;
    }

    if (isQuotaExhausted) {
      setIsExtraModalOpen(true);
      return;
    }

    await submitPostData();
  };

  // Delete Post
  const handleDeletePost = async (postId) => {
    try {
      const res = await customerservice.deletePost(postId);
      if (res?.success) {
        toast.success("Post deleted successfully");
        setPosts((prev) => prev.filter((p) => p._id !== postId));
        setDeleteModalPostId(null);
      } else {
        toast.error(res?.message || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  const authorName =
    companyProfile?.companyName ||
    companyProfile?.name ||
    user?.name ||
    "My Company";
  const authorLogo = companyProfile?.logo || "";
  const authorHeadline =
    companyProfile?.industry ||
    (companyProfile?.location
      ? `Company in ${companyProfile.location}`
      : "Employer");

  const canSubmit = description.trim().length > 0 || !!imageFile;

  return (
    <div className="space-y-8">
      {/* Header with quick link to Public Feed and Quota Pill */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-brand-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-100 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Community & Updates</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Company Posts & Feed
          </h1>
          <p className="text-blue-100/90 text-sm mt-1 max-w-xl">
            Publish announcements, hiring news, company culture, or updates to
            the community feed. Posts only require either text or an image.
          </p>

          {!subLoading && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {hasActiveSub ? (
                <>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      isQuotaExhausted
                        ? "bg-rose-500/20 text-rose-200 border border-rose-400/30"
                        : "bg-emerald-500/20 text-emerald-200 border border-emerald-400/30"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Quota: {companyUsed} /{" "}
                    {companyLimit > 0 ? companyLimit : "∞"} used (
                    {companyLimit > 0
                      ? `${companyRemaining} remaining`
                      : "Unlimited"}
                    )
                  </span>

                  <button
                    type="button"
                    onClick={() => setIsExtraModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 hover:bg-white/30 text-white border border-white/25 shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Buy Extra Post (₹{extraCompanyPostPrice})</span>
                  </button>
                </>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-200 border border-amber-400/30">
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  Subscription Required
                </span>
              )}
            </div>
          )}
        </div>

        <Link
          to="/feed"
          className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white px-5 py-3 rounded-2xl text-sm font-semibold transition-all border border-white/20 shadow-sm shrink-0"
        >
          <ExternalLink className="w-4 h-4" />
          View Live Feed
        </Link>
      </div>

      {/* Subscription / Quota Alerts */}
      {!subLoading && (
        <>
          {!hasActiveSub ? (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-amber-900">
                    Active Subscription Plan Required
                  </h4>
                  <p className="text-xs text-amber-700 mt-0.5">
                    You need an active employer subscription to post company updates to the feed.
                  </p>
                </div>
              </div>
              <Link
                to="/pricing"
                className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-xs font-semibold rounded-xl hover:shadow-md transition-all whitespace-nowrap flex items-center gap-1.5"
              >
                <Crown className="w-3.5 h-3.5" />
                View Employer Plans
              </Link>
            </div>
          ) : isQuotaExhausted ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-rose-50 to-orange-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                  <CreditCard className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">
                      Company Post Quota Reached ({companyUsed}/{companyLimit})
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-800">
                      Pay-per-post available
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    You have used all company posts included in your plan (
                    <strong>{subscription.planDetails?.name || "Active Plan"}</strong>
                    ). Pay <strong>₹{extraCompanyPostPrice}</strong> to publish this extra company post right away!
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsExtraModalOpen(true)}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-brand-600 to-teal-600 text-white text-xs font-bold rounded-xl hover:shadow-md transition-all whitespace-nowrap flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Pay ₹{extraCompanyPostPrice} Extra Post
                </button>
                <Link
                  to="/pricing"
                  className="px-3 py-2.5 bg-white text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all whitespace-nowrap"
                >
                  View Plans
                </Link>
              </div>
            </div>
          ) : null}
        </>
      )}

      {/* Post Creator Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_4px_25px_rgb(0,0,0,0.03)]">
        <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
            {authorLogo ? (
              <img
                src={import.meta.env.VITE_API_URL + authorLogo}
                alt={authorName}
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2 className="w-6 h-6 text-brand-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900 truncate">
              {authorName}
            </h3>
            <p className="text-xs text-slate-500 truncate">{authorHeadline}</p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
            <AlertCircle className="w-3.5 h-3.5 text-brand-600" />
            Image or Text required
          </span>
        </div>

        <form onSubmit={handleCreatePost} className="mt-5 space-y-4">
          {/* Description Textarea */}
          <div className="relative">
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's happening at your company? Share updates, hiring news, culture, or project achievements..."
              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm resize-none"
            />
          </div>

          {/* Image Preview Box */}
          {imagePreview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900/5 max-h-96 flex items-center justify-center group"
            >
              <img
                src={imagePreview}
                alt="Upload preview"
                className="w-full max-h-96 object-contain rounded-2xl"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-3 right-3 p-2 bg-slate-900/70 hover:bg-red-600 text-white rounded-xl backdrop-blur-md transition-all shadow-md"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Action Bar (Upload Image Button + Submit) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/50 text-slate-700 text-sm font-medium transition-all">
                <ImageIcon className="w-4 h-4 text-brand-600" />
                <span>{imagePreview ? "Change Image" : "Add Image"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {(description.trim() || imagePreview) && (
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {showPreview ? "Hide Preview" : "Live Preview"}
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={(!canSubmit && !isQuotaExhausted) || submitting || (!hasActiveSub && !subLoading)}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isQuotaExhausted
                  ? "bg-gradient-to-r from-brand-600 via-teal-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white shadow-md shadow-brand-500/25 hover:-translate-y-0.5 cursor-pointer"
                  : canSubmit && !submitting
                  ? "bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 hover:-translate-y-0.5 cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : isQuotaExhausted ? (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Pay ₹{extraCompanyPostPrice} & Publish Post</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Publish Post</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Preview Card */}
        <AnimatePresence>
          {showPreview && (description.trim() || imagePreview) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-slate-100"
            >
              <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <Eye className="w-3.5 h-3.5" />
                Feed Preview
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4 max-w-xl mx-auto shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
                    {authorLogo ? (
                      <img
                        src={import.meta.env.VITE_API_URL + authorLogo}
                        alt={authorName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="w-5 h-5 text-brand-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {authorName}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {authorHeadline} • Just now
                    </p>
                  </div>
                </div>

                {description.trim() && (
                  <p className="text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                    {description}
                  </p>
                )}

                {imagePreview && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-black/5">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-h-80 object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" /> 0 Likes
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5" /> 0 Shares
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* My Published Posts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              My Published Posts ({posts.length})
            </h2>
            <p className="text-xs text-slate-500">
              Manage your existing posts, view their engagement, or remove them.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-pulse space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-xl" />
                  <div className="space-y-1 flex-1">
                    <div className="h-3 bg-slate-200 rounded w-1/3" />
                    <div className="h-2.5 bg-slate-100 rounded w-1/4" />
                  </div>
                </div>
                <div className="h-16 bg-slate-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              No posts published yet
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-5">
              Publish your first company post above to reach potential job
              seekers and community members.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => {
              const formattedDate = new Date(post.createdAt).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                },
              );

              return (
                <div
                  key={post._id}
                  className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center overflow-hidden shrink-0">
                          {post?.companyProfile?.logo ? (
                            <img
                              src={
                                import.meta.env.VITE_API_URL +
                                post?.companyProfile?.logo
                              }
                              alt={post?.companyProfile?.companyName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building2 className="w-5 h-5 text-brand-600" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {post?.companyProfile?.companyName}
                          </h4>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>{formattedDate}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setDeleteModalPostId(post._id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Description */}
                    {post.description && (
                      <p className="text-sm text-slate-700 whitespace-pre-line line-clamp-3">
                        {post.description}
                      </p>
                    )}

                    {/* Image */}
                    {post.image && (
                      <div className="rounded-2xl overflow-hidden border border-slate-100 max-h-56 bg-slate-900/5">
                        <img
                          src={import.meta.env.VITE_API_URL + post.image}
                          alt="Post attachment"
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                  </div>

                  {/* Footer Stats & Feed Link */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 font-medium text-slate-600">
                        <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                        {post.likesCount ||
                          (post.likes ? post.likes.length : 0)}{" "}
                        Likes
                      </span>
                      <span className="flex items-center gap-1.5 font-medium text-slate-600">
                        <Share2 className="w-4 h-4 text-brand-600" />
                        {post.sharesCount || 0} Shares
                      </span>
                    </div>

                    <Link
                      to="/feed"
                      className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 font-semibold"
                    >
                      View in Feed
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalPostId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-100 shadow-2xl space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900">
                  Delete this post?
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  This action cannot be undone. The post will be permanently
                  removed from the community feed.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setDeleteModalPostId(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePost(deleteModalPostId)}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all shadow-md shadow-red-500/20"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Extra Post Pay Modal */}
      <ExtraPostModal
        isOpen={isExtraModalOpen}
        onClose={() => setIsExtraModalOpen(false)}
        actionType="company_post"
        subscription={subscription}
        onSuccess={handleExtraPostSuccess}
      />
    </div>
  );
}
