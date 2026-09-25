import React, { useState, useEffect } from "react";
import {
  Heart,
  Share2,
  Building2,
  Sparkles,
  Search,
  Clock,
  ExternalLink,
  PlusCircle,
  Flame,
  Trash2,
  X,
  Maximize2,
  Image as ImageIcon,
  Send,
  AlertCircle,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import customerservice from "../customer/customerservice";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setDashboardActiveTab } from "../Redux/Dashboard/DashboardAction";

export default function CommunityFeed() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // 'all' | 'popular' | 'latest'
  const [selectedLightboxImage, setSelectedLightboxImage] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [sharingPostId, setSharingPostId] = useState(null);
  const [deleteModalPostId, setDeleteModalPostId] = useState(null);

  // Provider Post Creation State (Modal & Composer)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [postDescription, setPostDescription] = useState("");
  const [postImageFile, setPostImageFile] = useState(null);
  const [postImagePreview, setPostImagePreview] = useState("");
  const [submittingPost, setSubmittingPost] = useState(false);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
    if (user?.role === "provider") {
      fetchCompanyProfileData();
      fetchSubscriptionData();
    }
  }, [user]);

  const fetchSubscriptionData = async () => {
    try {
      setSubLoading(true);
      const res = await customerservice.getCurrentSubscription();
      if (res?.success) {
        setSubscription(res.activeSubscription || res.data || null);
      }
    } catch (err) {
      console.warn("Could not fetch employer subscription:", err);
    } finally {
      setSubLoading(false);
    }
  };

  const fetchCompanyProfileData = async () => {
    try {
      const res = await customerservice.getCompanyProfile();
      if (res?.success && res?.data) {
        setCompanyProfile(res.data);
      }
    } catch (e) {
      console.warn("Could not fetch company profile details:", e);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await customerservice.getAllPosts();
      if (res?.success && Array.isArray(res.data)) {
        setPosts(res.data);
      }
    } catch (error) {
      console.error("Error fetching feed posts:", error);
      toast.error("Failed to load community feed");
    } finally {
      setLoading(false);
    }
  };

  // Handle Post Creation File Change
  const handlePostImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPG, PNG, WEBP, GIF)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file size cannot exceed 10MB");
      return;
    }

    setPostImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPostImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePostImage = () => {
    setPostImageFile(null);
    setPostImagePreview("");
  };

  // Submit New Employer Post
  const handleSubmitPost = async (e) => {
    e.preventDefault();

    if (user?.role !== "provider" && user?.role !== "admin") {
      toast.error("Only registered employers can publish company posts.");
      return;
    }

    const descTrimmed = postDescription.trim();
    if (!descTrimmed && !postImageFile) {
      toast.error("Please add either a description or an image to share your company post.");
      return;
    }

    if (descTrimmed.length > 3000) {
      toast.error("Post description cannot exceed 3000 characters.");
      return;
    }

    setSubmittingPost(true);
    try {
      let res;
      if (postImageFile) {
        const formData = new FormData();
        formData.append("description", descTrimmed);
        formData.append("image", postImageFile);
        res = await customerservice.createPost(formData, true);
      } else {
        res = await customerservice.createPost({
          description: descTrimmed,
        });
      }

      if (res?.success) {
        toast.success("Company post published to community! 🎉");
        setPostDescription("");
        setPostImageFile(null);
        setPostImagePreview("");
        setIsCreateModalOpen(false);
        fetchPosts();
        if (user?.role === "provider") {
          fetchSubscriptionData();
        }
      } else {
        toast.error(res?.message || "Failed to publish company post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      const errMsg =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong while publishing the post.";
      toast.error(errMsg);
    } finally {
      setSubmittingPost(false);
    }
  };

  // Toggle Like Handler (Available to both Users and Providers)
  const handleToggleLike = async (postId) => {
    if (!user) {
      toast.error("Please sign in to like this post");
      navigate("/login");
      return;
    }

    // Optimistic UI Update
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post._id === postId) {
          const wasLiked = post.isLiked;
          return {
            ...post,
            isLiked: !wasLiked,
            likesCount: wasLiked
              ? Math.max(0, (post.likesCount || 1) - 1)
              : (post.likesCount || 0) + 1,
          };
        }
        return post;
      }),
    );

    try {
      const res = await customerservice.toggleLikePost(postId);
      if (!res?.success) {
        fetchPosts();
      }
    } catch (error) {
      console.error("Error liking post:", error);
      fetchPosts();
    }
  };

  // Share Handler
  const handleShare = async (post) => {
    const postUrl = `${window.location.origin}/feed#post-${post._id}`;
    setSharingPostId(post._id);

    try {
      await customerservice.sharePost(post._id);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === post._id
            ? { ...p, sharesCount: (p.sharesCount || 0) + 1 }
            : p,
        ),
      );
    } catch (e) {
      console.error("Error incrementing share:", e);
    }

    const shareTitle =
      post?.companyProfile?.companyName ||
      "JobPortal Company Post";

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: post.description
            ? post.description.slice(0, 100) + "..."
            : "Check out this update on JobPortal!",
          url: postUrl,
        });
        toast.success("Shared successfully!");
      } catch (err) {
        if (err.name !== "AbortError") {
          copyToClipboard(postUrl);
        }
      }
    } else {
      copyToClipboard(postUrl);
    }

    setTimeout(() => setSharingPostId(null), 1500);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Post link copied to clipboard!");
  };

  // Delete Handler (Employer Owner or Admin)
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

  // Helper: Format Time
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  // Filter & Search Logic
  const filteredPosts = posts
    .filter((post) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        post.description?.toLowerCase().includes(q) ||
        post?.companyProfile?.companyName?.toLowerCase().includes(q) ||
        post.authorHeadline?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (activeFilter === "popular") {
        return (b.likesCount || 0) - (a.likesCount || 0);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const getMediaUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
      return url;
    }
    return (import.meta.env.VITE_API_URL || "") + url;
  };

  const isEmployer = user?.role === "provider" || user?.role === "admin";
  const employerCompanyName = companyProfile?.companyName || user?.name || "Company";
  const employerCompanyLogo = companyProfile?.logo || "";
  const employerHeadline = companyProfile?.industry
    ? `${companyProfile.industry}${companyProfile.location ? ` • ${companyProfile.location}` : ""}`
    : "Verified Employer";

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50">
      {/* Top Banner / Hero Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-brand-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-blue-500/10">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>JobPortal Community</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Company & Employer Feed
              </h1>
              <p className="text-blue-100 text-sm sm:text-base mt-2 max-w-xl">
                Discover updates, hiring announcements, company culture, and project
                milestones directly from verified employers & recruiters.
              </p>
            </div>

            {isEmployer && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 bg-white text-brand-600 hover:bg-brand-50 px-5 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-black/10 hover:-translate-y-0.5 transition-all shrink-0 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-brand-600" />
                Create Post
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Quick Post Prompt Bar ONLY for Employers / Providers */}
        {isEmployer && (
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center overflow-hidden shrink-0">
                {employerCompanyLogo ? (
                  <img
                    src={getMediaUrl(employerCompanyLogo)}
                    alt={employerCompanyName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-6 h-6 text-brand-600" />
                )}
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex-1 text-left px-5 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 text-slate-500 text-sm font-medium transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Share an announcement, hiring news, or team photo...</span>
                <ImageIcon className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Quota Indicator Bar for Employer */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                {user?.role === "admin" ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold text-[11px] bg-indigo-50 text-indigo-700 border border-indigo-100">
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                    Admin Unlimited Access
                  </span>
                ) : subscription && subscription.status === "active" ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    {subscription.companyPostsLimit > 0
                      ? `${Math.max(0, subscription.companyPostsLimit - (subscription.companyPostsUsed || 0))} of ${subscription.companyPostsLimit} Company Posts Remaining`
                      : "Company Posts: Unlimited"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold text-[11px] bg-amber-50 text-amber-700 border border-amber-100">
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    Subscription Required to Post
                  </span>
                )}
              </div>

              {user?.role === "provider" && (!subscription || subscription.status !== "active" || (subscription.companyPostsLimit > 0 && subscription.companyPostsUsed >= subscription.companyPostsLimit)) && (
                <Link
                  to="/pricing"
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1"
                >
                  <span>Choose Plan / Upgrade</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          {/* Tabs */}
          <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200/80 shadow-sm self-start">
            <button
              onClick={() => setActiveFilter("all")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activeFilter === "all"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              All Updates
            </button>
            <button
              onClick={() => setActiveFilter("latest")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activeFilter === "latest"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Latest
            </button>
            <button
              onClick={() => setActiveFilter("popular")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activeFilter === "popular"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Most Liked
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts or companies..."
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200/80 bg-white text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-pulse space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
                  <div className="space-y-1 flex-1">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/4" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3.5 bg-slate-100 rounded w-full" />
                  <div className="h-3.5 bg-slate-100 rounded w-5/6" />
                </div>
                <div className="h-64 bg-slate-100 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              No posts found
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
              {searchQuery
                ? `No posts matched "${searchQuery}". Try different keywords.`
                : "No company announcements published yet."}
            </p>
            {isEmployer && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-2xl text-sm font-semibold hover:bg-brand-700 transition-colors shadow-sm cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Create Company Post
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => {
              const currentUserId = (user?._id || user?.id)?.toString();
              const isAuthorOrAdmin =
                user &&
                (user.role === "admin" ||
                  (post.provider &&
                    (post.provider._id?.toString() === currentUserId ||
                      post.provider?.toString() === currentUserId)));

              const isDescriptionLong = (post.description || "").length > 280;
              const isExpanded = expandedDescriptions[post._id];

              const companyName =
                post.companyProfile?.companyName ||
                post.provider?.name ||
                "Verified Employer";

              const companyLogo = post.companyProfile?.logo || "";

              return (
                <article
                  key={post._id}
                  id={`post-${post._id}`}
                  className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Post Header */}
                  <div className="p-5 sm:p-6 pb-3 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                        {companyLogo ? (
                          <img
                            src={getMediaUrl(companyLogo)}
                            alt={companyName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building2 className="w-6 h-6 text-brand-600" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900 truncate">
                            {companyName}
                          </h3>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                            Employer
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">
                          {post.authorHeadline || "Verified Employer & Recruiter"}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimeAgo(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Author delete action (Employer owner or Admin) */}
                    {isAuthorOrAdmin && (
                      <button
                        onClick={() => setDeleteModalPostId(post._id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Post Content (Description) */}
                  {post.description && (
                    <div className="px-5 sm:px-6 pt-2 pb-4">
                      <p className="text-sm sm:text-base text-slate-800 leading-relaxed whitespace-pre-line font-normal">
                        {isDescriptionLong && !isExpanded
                          ? `${post.description.slice(0, 280)}...`
                          : post.description}
                      </p>
                      {isDescriptionLong && (
                        <button
                          onClick={() =>
                            setExpandedDescriptions((prev) => ({
                              ...prev,
                              [post._id]: !prev[post._id],
                            }))
                          }
                          className="mt-1 text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline cursor-pointer"
                        >
                          {isExpanded ? "Show less" : "See more"}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Post Media (Image) */}
                  {post.image && (
                    <div className="relative group cursor-pointer overflow-hidden bg-slate-950/5">
                      <div
                        onClick={() => setSelectedLightboxImage(getMediaUrl(post.image))}
                        className="relative max-h-[500px] w-full flex items-center justify-center overflow-hidden"
                      >
                        <img
                          src={getMediaUrl(post.image)}
                          alt="Post attachment"
                          className="w-full max-h-[500px] object-contain hover:scale-[1.01] transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 bg-slate-900/75 text-white px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm transition-opacity flex items-center gap-1.5">
                            <Maximize2 className="w-3.5 h-3.5" /> Click to expand
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Engagement Counts Bar */}
                  <div className="px-5 sm:px-6 py-2.5 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-[10px]">
                        ❤️
                      </span>
                      <span className="font-medium text-slate-600">
                        {post.likesCount || 0}{" "}
                        {post.likesCount === 1 ? "Like" : "Likes"}
                      </span>
                    </div>

                    <div>
                      <span>
                        {post.sharesCount || 0}{" "}
                        {post.sharesCount === 1 ? "Share" : "Shares"}
                      </span>
                    </div>
                  </div>

                  {/* Interaction Action Bar (Available to all logged-in users) */}
                  <div className="px-4 sm:px-6 py-2 border-t border-slate-100 grid grid-cols-2 gap-2 bg-slate-50/50">
                    {/* 1. Like Button */}
                    <button
                      onClick={() => handleToggleLike(post._id)}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                        post.isLiked || post.likes?.includes(user?._id)
                          ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <motion.div
                        whileTap={{ scale: 1.4 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <Heart
                          className={`w-5 h-5 transition-colors ${
                            post.isLiked || post.likes?.includes(user?._id)
                              ? "text-rose-600 fill-rose-600"
                              : "text-slate-500"
                          }`}
                        />
                      </motion.div>
                      <span>
                        {post.isLiked || post.likes?.includes(user?._id)
                          ? "Liked"
                          : "Like"}
                      </span>
                    </button>

                    {/* 2. Share Button */}
                    <button
                      onClick={() => handleShare(post)}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-brand-600 transition-all cursor-pointer"
                    >
                      <Share2 className="w-5 h-5 text-slate-500" />
                      <span>
                        {sharingPostId === post._id ? "Sharing..." : "Share"}
                      </span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Employer Post Creator Modal (Provider / Admin Only) */}
      <AnimatePresence>
        {isCreateModalOpen && isEmployer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-100 shadow-2xl space-y-5"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center overflow-hidden shrink-0">
                    {employerCompanyLogo ? (
                      <img
                        src={getMediaUrl(employerCompanyLogo)}
                        alt={employerCompanyName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="w-6 h-6 text-brand-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {employerCompanyName}
                    </h3>
                    <p className="text-xs text-slate-500">{employerHeadline}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quota Notice Banner inside Modal for Providers */}
              {user?.role === "provider" && (
                <div>
                  {!subscription || subscription.status !== "active" ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>
                          An active employer subscription is required to publish company posts.
                        </span>
                      </div>
                      <Link
                        to="/pricing"
                        className="shrink-0 font-bold text-brand-600 hover:underline px-2.5 py-1 bg-white rounded-lg border border-amber-200 shadow-sm"
                      >
                        Choose Plan
                      </Link>
                    </div>
                  ) : subscription.companyPostsLimit > 0 &&
                    (subscription.companyPostsUsed || 0) >= subscription.companyPostsLimit ? (
                    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 text-xs text-rose-900 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>
                          Quota reached ({subscription.companyPostsUsed}/{subscription.companyPostsLimit} posts used). Upgrade your plan to post more.
                        </span>
                      </div>
                      <Link
                        to="/pricing"
                        className="shrink-0 font-bold text-rose-700 hover:underline px-2.5 py-1 bg-white rounded-lg border border-rose-200 shadow-sm"
                      >
                        Upgrade Plan
                      </Link>
                    </div>
                  ) : (
                    <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl px-4 py-2 text-xs text-indigo-800 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>
                          {subscription.companyPostsLimit > 0
                            ? `${Math.max(0, subscription.companyPostsLimit - (subscription.companyPostsUsed || 0))} of ${subscription.companyPostsLimit} Company Posts remaining`
                            : "Unlimited Company Posts"}
                        </span>
                      </div>
                      <span className="text-[11px] text-indigo-600 font-semibold">
                        {subscription.planDetails?.name || "Active Plan"}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmitPost} className="space-y-4">
                <div className="relative">
                  <textarea
                    rows={4}
                    value={postDescription}
                    onChange={(e) => setPostDescription(e.target.value)}
                    maxLength={3000}
                    placeholder="What's happening at your company? Share updates, hiring news, culture, or project achievements..."
                    className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm resize-none"
                  />
                  <div className="text-right text-[11px] text-slate-400 mt-1">
                    {postDescription.length} / 3000 characters
                  </div>
                </div>

                {/* Uploaded Image Preview */}
                {postImagePreview && (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-60 bg-black/5 flex items-center justify-center">
                    <img
                      src={postImagePreview}
                      alt="Upload Preview"
                      className="w-full max-h-60 object-contain rounded-2xl"
                    />
                    <button
                      type="button"
                      onClick={handleRemovePostImage}
                      className="absolute top-2 right-2 p-2 bg-slate-900/80 hover:bg-red-600 text-white rounded-xl backdrop-blur-sm transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/50 text-slate-700 text-sm font-medium transition-all">
                    <ImageIcon className="w-4 h-4 text-brand-600" />
                    <span>{postImagePreview ? "Change Image" : "Add Image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePostImageChange}
                      className="hidden"
                    />
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={
                        (!postDescription.trim() && !postImageFile) ||
                        submittingPost
                      }
                      className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        (postDescription.trim() || postImageFile) &&
                        !submittingPost
                          ? "bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 cursor-pointer"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      {submittingPost ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Publishing...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Publish Post</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox Image Modal */}
      <AnimatePresence>
        {selectedLightboxImage && (
          <div
            onClick={() => setSelectedLightboxImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[90vh] flex items-center justify-center"
            >
              <img
                src={selectedLightboxImage}
                alt="Enlarged preview"
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              />
              <button
                onClick={() => setSelectedLightboxImage(null)}
                className="absolute -top-3 -right-3 sm:top-2 sm:right-2 p-2 bg-slate-900/80 hover:bg-red-600 text-white rounded-full backdrop-blur-md transition-colors shadow-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                  This post will be permanently removed from the community feed.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setDeleteModalPostId(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePost(deleteModalPostId)}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all shadow-md shadow-red-500/20 cursor-pointer"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
