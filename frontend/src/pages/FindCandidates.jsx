import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Search,
  MapPin,
  Briefcase,
  Phone,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  DollarSign,
  User,
  ExternalLink,
  FileText,
  Check,
  Copy,
  LayoutGrid,
  List,
  Calendar,
  X,
  MessageCircle,
  Share2,
  Tag,
  Compass,
  SlidersHorizontal,
  Eye,
  Lock,
  Unlock,
  Crown,
  Send,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  Loader2,
  Zap,
  CheckCircle2,
} from "lucide-react";
import customerservice from "../customer/customerservice";
import { JOB_ROLES_CATEGORY_TYPE } from "../Utility/utilites";
import CommonFilters from "../components/CommonFilters";
import toast from "react-hot-toast";

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 24 },
  },
};

// Helpers
const getInitials = (name) => {
  if (!name) return "U";
  return name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

const calculateAge = (dobString) => {
  if (!dobString) return null;
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return null;
  const diffMs = Date.now() - dob.getTime();
  const ageDt = new Date(diffMs);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
};

const formatSalary = (salary) => {
  if (!salary || (!salary.min && !salary.max)) {
    return "Negotiable / Open";
  }
  const curr =
    salary.currency === "INR" || !salary.currency ? "₹" : salary.currency;
  const min = Number(salary.min) || 0;
  const max = Number(salary.max) || 0;

  if (min === 0 && max === 0) return "Negotiable";

  const formatAmount = (num) => {
    if (num >= 100000) {
      const lpa = (num / 100000).toFixed(num % 100000 === 0 ? 0 : 1);
      return `${curr}${lpa}L`;
    }
    return `${curr}${num.toLocaleString("en-IN")}`;
  };

  if (min > 0 && max > 0) {
    return `${formatAmount(min)} - ${formatAmount(max)}`;
  }
  if (min > 0) return `From ${formatAmount(min)}`;
  return `Up to ${formatAmount(max)}`;
};

const formatCategoryName = (catValue) => {
  if (!catValue) return "";
  const found = JOB_ROLES_CATEGORY_TYPE.find((c) => c.value === catValue);
  if (found) return found.label;
  return catValue
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const maskPhone = (phone) => {
  if (!phone || phone.length < 6) return "+91 ••••• •••••";
  const cleaned = phone.replace(/[^0-9]/g, "");
  if (cleaned.length <= 4) return "+91 •••• ••••";
  return `+91 ${cleaned.slice(0, 2)}•••• ••${cleaned.slice(-2)}`;
};

const getWorkModeConfig = (mode) => {
  switch (mode?.toLowerCase()) {
    case "remote":
      return {
        label: "Remote",
        bg: "bg-purple-50 text-purple-700 border-purple-200/70",
        dot: "bg-purple-500",
      };
    case "hybrid":
      return {
        label: "Hybrid",
        bg: "bg-amber-50 text-amber-700 border-amber-200/70",
        dot: "bg-amber-500",
      };
    default:
      return {
        label: "On-site",
        bg: "bg-blue-50 text-blue-700 border-blue-200/70",
        dot: "bg-blue-500",
      };
  }
};

export default function FindCandidates() {
  const navigate = useNavigate();
  const authState = useSelector((state) => state.auth);
  const currentUser = authState?.user;
  const isAuthenticated = Boolean(
    authState?.isAuthenticated || localStorage.getItem("token")
  );
  const userRole = currentUser?.role || localStorage.getItem("userRole");
  const isAdmin = userRole === "admin";
  const isProvider = userRole === "provider" || isAdmin;

  const [searchTerm, setSearchTerm] = useState("");
  const [candidatesData, setCandidatesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscription & Quota State
  const [subscription, setSubscription] = useState(null);
  const [subLoading, setSubLoading] = useState(true);
  const [unlockingCandidateId, setUnlockingCandidateId] = useState(null);

  // Direct Message Modal State
  const [directMessageCandidate, setDirectMessageCandidate] = useState(null);
  const [messageTemplate, setMessageTemplate] = useState("interview");
  const [messageSubject, setMessageSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [sendAlsoWhatsApp, setSendAlsoWhatsApp] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Upgrade Prompt Modal State
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradePromptReason, setUpgradePromptReason] = useState("unlock"); // 'unlock' | 'message'

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [selectedWorkModes, setSelectedWorkModes] = useState([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedSalaryRanges, setSelectedSalaryRanges] = useState([]);

  // UI States
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [copiedCandidateId, setCopiedCandidateId] = useState(null);

  const fetchSubscription = async () => {
    try {
      setSubLoading(true);
      const res = await customerservice.getCurrentSubscription();
      if (res?.success) {
        setSubscription(res.activeSubscription || res.data || null);
      }
    } catch (err) {
      console.warn("Could not fetch subscription in FindCandidates:", err);
    } finally {
      setSubLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubscription();
    } else {
      setSubLoading(false);
    }
  }, [isAuthenticated]);

  const hasActiveSub =
    isAdmin || (subscription && subscription.status === "active");

  const unlockLimit = subscription?.unlockContactsLimit || 0;
  const unlockUsed = subscription?.unlockContactsUsed || 0;
  const unlockRemaining = isAdmin
    ? "Unlimited"
    : unlockLimit > 0
    ? Math.max(0, unlockLimit - unlockUsed)
    : hasActiveSub
    ? "Unlimited"
    : 0;
  const isUnlockExhausted =
    !isAdmin && hasActiveSub && unlockLimit > 0 && unlockUsed >= unlockLimit;

  const msgLimit = subscription?.directMessagesLimit || 0;
  const msgUsed = subscription?.directMessagesUsed || 0;
  const msgRemaining = isAdmin
    ? "Unlimited"
    : msgLimit > 0
    ? Math.max(0, msgLimit - msgUsed)
    : hasActiveSub
    ? "Unlimited"
    : 0;
  const isMsgExhausted =
    !isAdmin && hasActiveSub && msgLimit > 0 && msgUsed >= msgLimit;

  const isCandidateUnlocked = (candidate) => {
    if (!candidate) return false;
    if (isAdmin) return true;
    if (!subscription || !subscription.unlockedCandidates) return false;

    const candidateId = candidate._id?.toString();
    const candidateUserId = (candidate.user?._id || candidate.user)?.toString();

    return subscription.unlockedCandidates.some((id) => {
      const sId = (id?._id || id)?.toString();
      return sId === candidateId || sId === candidateUserId;
    });
  };

  const handleFilterChange = (setter, value) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedExperience([]);
    setSelectedWorkModes([]);
    setSelectedJobTypes([]);
    setSelectedSalaryRanges([]);
  };

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append("search", searchTerm);
      if (selectedCategories.length > 0)
        queryParams.append("categories", selectedCategories.join(","));
      if (selectedExperience.length > 0)
        queryParams.append("experience", selectedExperience.join(","));
      if (selectedWorkModes.length > 0)
        queryParams.append("workModes", selectedWorkModes.join(","));
      if (selectedJobTypes.length > 0)
        queryParams.append("jobTypes", selectedJobTypes.join(","));
      if (selectedSalaryRanges.length > 0)
        queryParams.append("salaryRanges", selectedSalaryRanges.join(","));

      const queryString = queryParams.toString()
        ? `?${queryParams.toString()}`
        : "";

      const response = await customerservice.getAllUserProfiles(queryString);
      if (response && response.success) {
        setCandidatesData(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCandidates();
    }, 300);
    return () => clearTimeout(timer);
  }, [
    searchTerm,
    selectedCategories,
    selectedExperience,
    selectedWorkModes,
    selectedJobTypes,
    selectedSalaryRanges,
  ]);

  // Handle Candidate Unlock with Quota Validation
  const handleUnlockCandidate = async (candidate) => {
    if (!isAuthenticated) {
      toast.error("Please login as an Employer to unlock candidate details.");
      navigate("/login");
      return;
    }

    if (!isProvider) {
      toast.error("Candidate unlocking is only available for Employer / Provider accounts.");
      return;
    }

    if (!hasActiveSub) {
      setUpgradePromptReason("unlock");
      setShowUpgradeModal(true);
      return;
    }

    if (isUnlockExhausted) {
      setUpgradePromptReason("unlock");
      setShowUpgradeModal(true);
      return;
    }

    const candidateId = candidate.user?._id || candidate.user || candidate._id;
    if (!candidateId) {
      toast.error("Invalid candidate ID.");
      return;
    }

    if (isCandidateUnlocked(candidate)) {
      toast.success("Candidate contact is already unlocked!");
      return;
    }

    try {
      setUnlockingCandidateId(candidate._id);
      const res = await customerservice.unlockCandidateContact({
        candidateId: candidateId,
      });

      if (res.success) {
        toast.success(res.message || "Candidate contact unlocked! 🎉");
        setSubscription((prev) => {
          if (!prev) return prev;
          const currentUnlocked = prev.unlockedCandidates || [];
          return {
            ...prev,
            unlockContactsUsed: res.used ?? (prev.unlockContactsUsed || 0) + 1,
            unlockedCandidates: [...currentUnlocked, candidateId],
          };
        });
      } else {
        toast.error(res.message || "Failed to unlock candidate contact");
      }
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to unlock candidate contact";
      if (
        error?.response?.status === 403 ||
        errorMsg.toLowerCase().includes("quota") ||
        errorMsg.toLowerCase().includes("subscription")
      ) {
        setUpgradePromptReason("unlock");
        setShowUpgradeModal(true);
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setUnlockingCandidateId(null);
    }
  };

  // Handle Direct Message Modal Opening with Quota Validation
  const handleOpenDirectMessage = (candidate) => {
    if (!isAuthenticated) {
      toast.error("Please login as an Employer to send Direct Messages.");
      navigate("/login");
      return;
    }

    if (!isProvider) {
      toast.error("Direct messaging candidates is an Employer exclusive feature.");
      return;
    }

    if (!hasActiveSub) {
      setUpgradePromptReason("message");
      setShowUpgradeModal(true);
      return;
    }

    if (isMsgExhausted) {
      setUpgradePromptReason("message");
      setShowUpgradeModal(true);
      return;
    }

    // Set default template
    setDirectMessageCandidate(candidate);
    setMessageTemplate("interview");
    setMessageSubject(`Interview Invitation for ${candidate.title || "Open Position"}`);
    setMessageContent(
      `Hi ${candidate.name || "Candidate"},\n\nWe reviewed your profile on the Job Portal and were impressed by your background. We have an exciting opening that matches your skillset and would love to invite you for a preliminary interview conversation.\n\nPlease let us know your availability.\n\nBest regards,\nRecruitment Team`
    );
  };

  // Handle Message Template Change
  const handleTemplateSelect = (type) => {
    if (!directMessageCandidate) return;
    setMessageTemplate(type);
    const candidateName = directMessageCandidate.name || "Candidate";
    const candidateTitle = directMessageCandidate.title || "Open Opportunity";

    if (type === "interview") {
      setMessageSubject(`Interview Invitation for ${candidateTitle}`);
      setMessageContent(
        `Hi ${candidateName},\n\nWe reviewed your profile on the Job Portal and were impressed by your background. We have an exciting opening that matches your skillset and would love to invite you for a preliminary interview conversation.\n\nPlease let us know your availability.\n\nBest regards,\nRecruitment Team`
      );
    } else if (type === "opportunity") {
      setMessageSubject(`Exciting Job Opportunity: ${candidateTitle}`);
      setMessageContent(
        `Hi ${candidateName},\n\nOur team is currently hiring talented professionals in your field. Based on your experience and skills, we believe you would be a great fit for our organization.\n\nWould you be open to discussing current openings with us?\n\nWarm regards,\nHiring Manager`
      );
    } else if (type === "shortlisted") {
      setMessageSubject(`Profile Shortlisted - Next Steps`);
      setMessageContent(
        `Hi ${candidateName},\n\nCongratulations! Your profile has been shortlisted by our talent acquisition team. We would like to schedule a brief call to discuss your career preferences, expectations, and upcoming opportunities.\n\nLooking forward to speaking with you soon.`
      );
    } else {
      setMessageSubject(`Inquiry regarding your profile`);
      setMessageContent(
        `Hi ${candidateName},\n\n`
      );
    }
  };

  // Send Direct Message and Consume Quota
  const handleSendDirectMessage = async (e) => {
    e.preventDefault();
    if (!messageContent.trim()) {
      toast.error("Please enter your message before sending.");
      return;
    }

    try {
      setSendingMessage(true);
      const res = await customerservice.validateSubscriptionAction({
        actionType: "direct_message",
        consume: true,
      });

      if (res?.success) {
        toast.success(`Direct message successfully delivered to ${directMessageCandidate.name}! 🚀`);
        setSubscription((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            directMessagesUsed: res.used ?? (prev.directMessagesUsed || 0) + 1,
          };
        });

        // If WhatsApp option chosen and phone available
        if (sendAlsoWhatsApp && directMessageCandidate.phone) {
          const rawPhone = directMessageCandidate.phone.replace(/[^0-9]/g, "");
          const waText = encodeURIComponent(
            `*${messageSubject}*\n\n${messageContent}`
          );
          window.open(`https://wa.me/91${rawPhone}?text=${waText}`, "_blank");
        }

        setDirectMessageCandidate(null);
      } else {
        if (res?.subscriptionRequired || res?.quotaExhausted) {
          setDirectMessageCandidate(null);
          setUpgradePromptReason("message");
          setShowUpgradeModal(true);
        } else {
          toast.error(res?.message || "Failed to send direct message.");
        }
      }
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Could not send direct message.";
      if (err?.response?.status === 403) {
        setDirectMessageCandidate(null);
        setUpgradePromptReason("message");
        setShowUpgradeModal(true);
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setSendingMessage(false);
    }
  };

  const handleCopyPhone = (phone, candidateId) => {
    if (!phone) {
      toast.error("Phone number not provided");
      return;
    }
    navigator.clipboard.writeText(phone);
    setCopiedCandidateId(candidateId);
    toast.success(`Copied phone: ${phone}`);
    setTimeout(() => setCopiedCandidateId(null), 2000);
  };

  const handleShareProfile = (candidate) => {
    const text = `Candidate Profile: ${candidate.name} - ${candidate.title || "Professional"}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${text} | Location: ${candidate.location?.city || "India"}`
      );
      toast.success("Candidate details copied to clipboard!");
    }
  };

  const totalActiveFiltersCount =
    (searchTerm.trim() ? 1 : 0) +
    selectedCategories.length +
    selectedExperience.length +
    selectedWorkModes.length +
    selectedJobTypes.length +
    selectedSalaryRanges.length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Premium Hero Banner */}
      <div className="relative w-full pt-28 pb-48 overflow-hidden bg-slate-900">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2850&q=80")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-slate-950/85 z-0" />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/90 via-slate-900/80 to-blue-900/70 z-0" />
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Verified Talent Pool
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4"
          >
            Discover & Connect With{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              Top Candidates
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
            className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed mb-6"
          >
            Browse verified job seekers, unlock contact details, send direct
            messages, and hire top-tier talent for your growing team.
          </motion.p>
        </div>
      </div>

      {/* Main Content Area - Overlaps Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-28 relative z-20 pb-20">
        {/* Provider Subscription & Quota Status Header Card */}
        {isAuthenticated && (isProvider || isAdmin) && !subLoading && (
          <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-brand-500/20 shrink-0">
                <Crown className="w-6 h-6 text-amber-300" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Employer Talent Access
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      hasActiveSub
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    {isAdmin
                      ? "Admin Unlimited"
                      : subscription?.planDetails?.name ||
                        (hasActiveSub ? "Active Plan" : "No Active Plan")}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {hasActiveSub
                    ? "Your employer quota allows unlocking phone/CV and sending direct messages."
                    : "Subscribe to an employer plan to unlock candidate contact details & send direct messages."}
                </p>
              </div>
            </div>

            {/* Quota Counters */}
            <div className="flex items-center gap-3 flex-wrap w-full md:w-auto justify-start md:justify-end">
              {/* Candidate Unlocks Quota */}
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Unlock className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">
                    Candidate Unlocks
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {isAdmin
                      ? "Unlimited"
                      : hasActiveSub
                      ? `${unlockRemaining} left (${unlockUsed}/${unlockLimit > 0 ? unlockLimit : "∞"})`
                      : "0 Available"}
                  </span>
                </div>
              </div>

              {/* Direct Messages Quota */}
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">
                    Direct Messages
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {isAdmin
                      ? "Unlimited"
                      : hasActiveSub
                      ? `${msgRemaining} left (${msgUsed}/${msgLimit > 0 ? msgLimit : "∞"})`
                      : "0 Available"}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <Link
                to="/pricing"
                className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 shrink-0"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>{hasActiveSub ? "Upgrade Plan" : "View Plans"}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar Filters */}
          <CommonFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedExperience={selectedExperience}
            setSelectedExperience={setSelectedExperience}
            selectedWorkModes={selectedWorkModes}
            setSelectedWorkModes={setSelectedWorkModes}
            selectedJobTypes={selectedJobTypes}
            setSelectedJobTypes={setSelectedJobTypes}
            selectedSalaryRanges={selectedSalaryRanges}
            setSelectedSalaryRanges={setSelectedSalaryRanges}
            handleFilterChange={handleFilterChange}
            clearAllFilters={clearAllFilters}
          />

          {/* Right Main Content Column */}
          <div className="flex-1 min-w-0">
            {/* Top Toolbar / Stats & Sort Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 tracking-tight">
                      {loading ? (
                        <span className="text-slate-400">
                          Loading Candidates...
                        </span>
                      ) : (
                        <>
                          <span className="text-blue-600 font-extrabold">
                            {candidatesData.length}
                          </span>{" "}
                          Candidates Available
                        </>
                      )}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Showing matching professional profiles ready to hire
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                  {/* View Mode Switcher */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-lg transition-all ${
                        viewMode === "grid"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                      title="Grid View"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded-lg transition-all ${
                        viewMode === "list"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                      title="List View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filter Pills Bar */}
              {totalActiveFiltersCount > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400 mr-1">
                    Active Filters:
                  </span>

                  {searchTerm.trim() && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                      Search: "{searchTerm}"
                      <button
                        onClick={() => setSearchTerm("")}
                        className="hover:text-blue-900 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedCategories.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200"
                    >
                      {formatCategoryName(cat) || cat}
                      <button
                        onClick={() =>
                          setSelectedCategories((prev) =>
                            prev.filter((c) => c !== cat)
                          )
                        }
                        className="hover:text-slate-900 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {selectedExperience.map((exp) => (
                    <span
                      key={exp}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200"
                    >
                      Exp: {exp} yrs
                      <button
                        onClick={() =>
                          setSelectedExperience((prev) =>
                            prev.filter((e) => e !== exp)
                          )
                        }
                        className="hover:text-slate-900 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {selectedWorkModes.map((mode) => (
                    <span
                      key={mode}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 capitalize"
                    >
                      {mode}
                      <button
                        onClick={() =>
                          setSelectedWorkModes((prev) =>
                            prev.filter((m) => m !== mode)
                          )
                        }
                        className="hover:text-slate-900 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {selectedJobTypes.map((type) => (
                    <span
                      key={type}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 capitalize"
                    >
                      {type}
                      <button
                        onClick={() =>
                          setSelectedJobTypes((prev) =>
                            prev.filter((t) => t !== type)
                          )
                        }
                        className="hover:text-slate-900 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {selectedSalaryRanges.map((sal) => (
                    <span
                      key={sal}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200"
                    >
                      Salary: {sal}
                      <button
                        onClick={() =>
                          setSelectedSalaryRanges((prev) =>
                            prev.filter((s) => s !== sal)
                          )
                        }
                        className="hover:text-slate-900 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline ml-1"
                  >
                    Reset All
                  </button>
                </div>
              )}
            </div>

            {/* Content Area: Loading / Grid / List / Empty */}
            {loading ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-5"
                    : "space-y-4"
                }
              >
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm animate-pulse space-y-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-slate-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-slate-200 rounded-md w-1/2" />
                        <div className="h-4 bg-slate-100 rounded-md w-1/3" />
                      </div>
                    </div>
                    <div className="h-4 bg-slate-100 rounded w-full" />
                    <div className="h-4 bg-slate-100 rounded w-3/4" />
                    <div className="flex gap-2 pt-2">
                      <div className="h-8 bg-slate-100 rounded-xl flex-1" />
                      <div className="h-8 bg-slate-200 rounded-xl flex-1" />
                    </div>
                  </div>
                ))}
              </div>
            ) : candidatesData.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-5"
                    : "space-y-4"
                }
              >
                <AnimatePresence>
                  {candidatesData.map((candidate) => {
                    const candidateName = candidate.name || "Candidate";
                    const candidateTitle =
                      candidate.title || "Open to Opportunities";
                    const workModeConfig = getWorkModeConfig(
                      candidate.location?.workMode
                    );
                    const age = calculateAge(candidate.dob);
                    const locationText =
                      candidate.location?.city || candidate.location?.state
                        ? [candidate.location.city, candidate.location.state]
                            .filter(Boolean)
                            .join(", ")
                        : candidate.location?.country || "Location open";

                    const unlocked = isCandidateUnlocked(candidate);
                    const isUnlockingThis =
                      unlockingCandidateId === candidate._id;

                    if (viewMode === "grid") {
                      return (
                        <motion.div
                          key={candidate._id}
                          variants={itemVariants}
                          whileHover={{ y: -3 }}
                          className="group bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgb(0,0,0,0.08)] hover:border-blue-300/80 transition-all duration-300 flex flex-col justify-between"
                        >
                          <div>
                            {/* Top Card Header */}
                            <div className="flex items-start justify-between gap-3 mb-4">
                              <div className="flex items-center gap-3.5">
                                {/* Profile Avatar */}
                                <div className="relative flex-shrink-0">
                                  {candidate.profileImage ? (
                                    <img
                                      src={
                                        import.meta.env.VITE_API_URL +
                                        candidate?.profileImage
                                      }
                                      alt={candidateName}
                                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
                                    />
                                  ) : (
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                                      {getInitials(candidateName)}
                                    </div>
                                  )}
                                  <div
                                    className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm"
                                    title="Available to Hire"
                                  />
                                </div>

                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors truncate">
                                      {candidateName}
                                    </h3>
                                    <ShieldCheck
                                      className="w-4 h-4 text-blue-500 shrink-0"
                                      title="Verified Identity"
                                    />
                                  </div>
                                  <p className="text-xs font-semibold text-blue-600 truncate mt-0.5">
                                    {candidateTitle}
                                  </p>
                                </div>
                              </div>

                              {/* Work Mode & Unlock Status Pill */}
                              <div className="flex flex-col items-end gap-1.5">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-xs ${workModeConfig.bg}`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${workModeConfig.dot}`}
                                  />
                                  {workModeConfig.label}
                                </span>
                                {unlocked ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                    <Unlock className="w-3 h-3" /> Unlocked
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                    <Lock className="w-3 h-3" /> Locked
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Key Metadata Pills */}
                            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl text-slate-700 border border-slate-100">
                                <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                <span className="truncate font-semibold">
                                  {candidate.experience
                                    ? `${candidate.experience} Years Exp`
                                    : "Fresher"}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl text-slate-700 border border-slate-100">
                                <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="truncate font-semibold">
                                  {formatSalary(candidate.salary)}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl text-slate-700 border border-slate-100">
                                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                <span className="truncate font-medium">
                                  {locationText}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl text-slate-700 border border-slate-100">
                                <GraduationCap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                <span className="truncate font-medium">
                                  {candidate.education || "Graduate"}
                                </span>
                              </div>
                            </div>

                            {/* Bio Snippet */}
                            <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-4">
                              {candidate.bio ||
                                "Candidate looking for impactful opportunities and growth."}
                            </p>

                            {/* Skills Tag List */}
                            <div className="flex flex-wrap gap-1.5 mb-5">
                              {candidate.skills &&
                              candidate.skills.length > 0 ? (
                                <>
                                  {candidate.skills
                                    .slice(0, 4)
                                    .map((skill, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2.5 py-1 bg-blue-50/60 hover:bg-blue-100/70 text-blue-700 text-[11px] font-semibold rounded-lg border border-blue-100/60 transition-colors"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  {candidate.skills.length > 4 && (
                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[11px] font-semibold rounded-lg">
                                      +{candidate.skills.length - 4} more
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-[11px] text-slate-400 italic">
                                  No skills listed
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons Footer with Provider Validation */}
                          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                            <div className="flex items-center gap-2">
                              {/* View Profile */}
                              <button
                                onClick={() => setSelectedCandidate(candidate)}
                                className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                View Profile
                              </button>

                              {/* Direct Message Button (Validated) */}
                              <button
                                onClick={() =>
                                  handleOpenDirectMessage(candidate)
                                }
                                className="flex-1 py-2.5 px-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-purple-500/20 hover:shadow-purple-500/30 flex items-center justify-center gap-1.5"
                                title="Send Direct Message to Candidate"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                Direct Message
                              </button>
                            </div>

                            {/* Contact Unlock or Unlocked Actions Row */}
                            {unlocked ? (
                              <div className="flex items-center gap-2">
                                {candidate.phone && (
                                  <a
                                    href={`tel:${candidate.phone}`}
                                    className="flex-1 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 truncate"
                                  >
                                    <Phone className="w-3.5 h-3.5 shrink-0" />
                                    <span className="truncate">
                                      {candidate.phone}
                                    </span>
                                  </a>
                                )}

                                {candidate.phone && (
                                  <button
                                    onClick={() =>
                                      handleCopyPhone(
                                        candidate.phone,
                                        candidate._id
                                      )
                                    }
                                    className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-colors"
                                    title="Copy Phone"
                                  >
                                    {copiedCandidateId === candidate._id ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                )}

                                {candidate.phone && (
                                  <a
                                    href={`https://wa.me/91${candidate.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                      `Hi ${candidate.name}, we reviewed your profile on the job portal and would like to discuss an opportunity!`
                                    )}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-colors"
                                    title="Chat on WhatsApp"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  handleUnlockCandidate(candidate)
                                }
                                disabled={isUnlockingThis}
                                className="w-full py-2.5 px-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-500/20 hover:shadow-brand-500/30 transition-all flex items-center justify-center gap-1.5 disabled:opacity-60"
                              >
                                {isUnlockingThis ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>Unlocking Contact...</span>
                                  </>
                                ) : (
                                  <>
                                    <Unlock className="w-3.5 h-3.5 text-amber-300" />
                                    <span>Unlock Contact & Resume</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    }

                    // List View Rendering
                    return (
                      <motion.div
                        key={candidate._id}
                        variants={itemVariants}
                        whileHover={{ y: -2 }}
                        className="group bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.07)] hover:border-blue-300/80 transition-all duration-300"
                      >
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Avatar & Work Mode Badge */}
                          <div className="flex-shrink-0 flex flex-col items-center gap-3">
                            <div className="relative">
                              {candidate.profileImage ? (
                                <img
                                  src={
                                    import.meta.env.VITE_API_URL +
                                    candidate?.profileImage
                                  }
                                  alt={candidateName}
                                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-md"
                                />
                              ) : (
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-blue-500/20">
                                  {getInitials(candidateName)}
                                </div>
                              )}
                              <div
                                className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white shadow-sm"
                                title="Available to Hire"
                              />
                            </div>

                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${workModeConfig.bg}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${workModeConfig.dot}`}
                              />
                              {workModeConfig.label}
                            </span>
                          </div>

                          {/* Candidate Information Body */}
                          <div className="flex-1 flex flex-col justify-between min-w-0">
                            <div>
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
                                <div>
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                                      {candidateName}
                                    </h3>
                                    <ShieldCheck
                                      className="w-5 h-5 text-blue-500"
                                      title="Identity Verified"
                                    />
                                    {unlocked ? (
                                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                        <Unlock className="w-3 h-3" /> Unlocked
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                                        <Lock className="w-3 h-3" /> Contact Locked
                                      </span>
                                    )}
                                    {candidate.jobType && (
                                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                                        {candidate.jobType}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-blue-600 font-semibold text-sm sm:text-base">
                                    {candidateTitle}
                                  </p>
                                </div>

                                {/* Action Buttons Header Row */}
                                <div className="flex items-center gap-2 flex-wrap">
                                  {/* Direct Message Button */}
                                  <button
                                    onClick={() =>
                                      handleOpenDirectMessage(candidate)
                                    }
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                                    title="Direct Message"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span>Direct Message</span>
                                  </button>

                                  {/* Unlock or Phone Button */}
                                  {unlocked ? (
                                    <>
                                      {candidate.phone && (
                                        <button
                                          onClick={() =>
                                            handleCopyPhone(
                                              candidate.phone,
                                              candidate._id
                                            )
                                          }
                                          className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                                          title="Copy Phone"
                                        >
                                          {copiedCandidateId ===
                                          candidate._id ? (
                                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                                          ) : (
                                            <Phone className="w-3.5 h-3.5" />
                                          )}
                                          <span>{candidate.phone}</span>
                                        </button>
                                      )}
                                    </>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        handleUnlockCandidate(candidate)
                                      }
                                      disabled={isUnlockingThis}
                                      className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-60"
                                    >
                                      {isUnlockingThis ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      ) : (
                                        <Unlock className="w-3.5 h-3.5 text-amber-300" />
                                      )}
                                      <span>Unlock Contact</span>
                                    </button>
                                  )}

                                  <button
                                    onClick={() =>
                                      setSelectedCandidate(candidate)
                                    }
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    View
                                  </button>
                                </div>
                              </div>

                              {/* Highlight Badges Row */}
                              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 mb-4">
                                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                                  {locationText}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                                  <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                                  {candidate.experience
                                    ? `${candidate.experience} Years Experience`
                                    : "Fresher"}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                                  {formatSalary(candidate.salary)}
                                </span>
                                {candidate.education && (
                                  <>
                                    <span className="text-slate-300">•</span>
                                    <span className="flex items-center gap-1.5 font-medium text-slate-700">
                                      <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                                      {candidate.education}
                                    </span>
                                  </>
                                )}
                                {age && (
                                  <>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-slate-600 font-medium">
                                      {age} yrs{" "}
                                      {candidate.gender
                                        ? `• ${candidate.gender}`
                                        : ""}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Bio & Skills */}
                            <div>
                              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 max-w-3xl">
                                {candidate.bio ||
                                  "Qualified professional ready to contribute with hands-on expertise."}
                              </p>

                              <div className="flex flex-wrap gap-2">
                                {candidate.skills?.map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1 bg-blue-50/60 text-blue-700 border border-blue-100/60 rounded-lg text-xs font-semibold hover:bg-blue-100/80 transition-colors"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* Empty State */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center flex flex-col items-center shadow-sm"
              >
                <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  No candidates found
                </h3>
                <p className="text-slate-500 text-sm max-w-md mb-6 leading-relaxed">
                  We couldn't find any candidate profiles matching your selected
                  filters. Try broadening your criteria or search query.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 text-xs"
                >
                  Reset All Filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Candidate Profile Modal */}
      <AnimatePresence>
        {selectedCandidate && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCandidate(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden bg-white rounded-3xl shadow-2xl flex flex-col border border-slate-100 z-10 my-auto"
            >
              {/* Modal Top Header Banner */}
              <div className="relative bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-6 sm:px-8 pt-6 pb-8 text-white">
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  {/* Large Avatar */}
                  <div className="relative flex-shrink-0">
                    {selectedCandidate.profileImage ? (
                      <img
                        src={
                          import.meta.env.VITE_API_URL +
                          selectedCandidate.profileImage
                        }
                        alt={selectedCandidate.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white/20 shadow-xl"
                      />
                    ) : (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 text-white font-extrabold text-2xl sm:text-3xl flex items-center justify-center border-4 border-white/20 shadow-xl">
                        {getInitials(selectedCandidate.name)}
                      </div>
                    )}
                    <div
                      className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-slate-900 shadow-sm"
                      title="Available to Hire"
                    />
                  </div>

                  {/* Header Title Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        {selectedCandidate.name || "Candidate Profile"}
                      </h2>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified Profile
                      </span>
                      {isCandidateUnlocked(selectedCandidate) ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                          <Unlock className="w-3.5 h-3.5" />
                          Unlocked Contact
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                          <Lock className="w-3.5 h-3.5" />
                          Contact Locked
                        </span>
                      )}
                    </div>

                    <p className="text-blue-300 font-semibold text-sm sm:text-base mb-3">
                      {selectedCandidate.title || "Professional Candidate"}
                      {selectedCandidate.category && (
                        <span className="text-slate-300 text-xs ml-2 font-normal">
                          • {formatCategoryName(selectedCandidate.category)}
                        </span>
                      )}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        {selectedCandidate.location?.city || "City"},{" "}
                        {selectedCandidate.location?.state || "India"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 capitalize">
                        <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                        {selectedCandidate.jobType || "Full-time"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        Active Profile
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Toolbar Bar */}
              <div className="bg-slate-50 border-b border-slate-200/80 px-6 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Direct Message */}
                  <button
                    onClick={() => {
                      handleOpenDirectMessage(selectedCandidate);
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Send Direct Message
                  </button>

                  {/* If Unlocked: Phone Call and WhatsApp */}
                  {isCandidateUnlocked(selectedCandidate) ? (
                    <>
                      {selectedCandidate.phone && (
                        <a
                          href={`tel:${selectedCandidate.phone}`}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          Call {selectedCandidate.phone}
                        </a>
                      )}

                      {selectedCandidate.phone && (
                        <a
                          href={`https://wa.me/91${selectedCandidate.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Hi ${selectedCandidate.name}, we reviewed your profile on the job portal and would like to discuss an opportunity with you!`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          WhatsApp Chat
                        </a>
                      )}

                      {selectedCandidate.phone && (
                        <button
                          onClick={() =>
                            handleCopyPhone(
                              selectedCandidate.phone,
                              selectedCandidate._id
                            )
                          }
                          className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
                        >
                          {copiedCandidateId === selectedCandidate._id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          Copy Phone
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() =>
                        handleUnlockCandidate(selectedCandidate)
                      }
                      disabled={
                        unlockingCandidateId === selectedCandidate._id
                      }
                      className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-60"
                    >
                      {unlockingCandidateId === selectedCandidate._id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Unlock className="w-3.5 h-3.5 text-amber-300" />
                      )}
                      <span>Unlock Contact Details</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleShareProfile(selectedCandidate)}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share Candidate
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
                {/* 1. Locked Notice Bar if not unlocked */}
                {!isCandidateUnlocked(selectedCandidate) && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Lock className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-amber-900">
                          Candidate Contact & Full Resume Locked
                        </h4>
                        <p className="text-[11px] sm:text-xs text-amber-700 mt-0.5">
                          {hasActiveSub
                            ? `Use 1 of your candidate unlocks to reveal full phone number, direct WhatsApp, and CV document download.`
                            : `An active employer subscription is required to unlock candidate contact details.`}
                        </p>
                        {hasActiveSub && (
                          <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md mt-1.5">
                            Remaining Quota: {unlockRemaining} Unlocks
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleUnlockCandidate(selectedCandidate)
                      }
                      disabled={
                        unlockingCandidateId === selectedCandidate._id
                      }
                      className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 disabled:opacity-60"
                    >
                      {unlockingCandidateId === selectedCandidate._id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Unlock className="w-3.5 h-3.5 text-amber-300" />
                      )}
                      <span>
                        {hasActiveSub
                          ? "Unlock Contact Details"
                          : "Subscribe to Unlock"}
                      </span>
                    </button>
                  </div>
                )}

                {/* 2. Key Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                      <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                      Experience
                    </div>
                    <div className="text-sm sm:text-base font-bold text-slate-900">
                      {selectedCandidate.experience
                        ? `${selectedCandidate.experience} Years`
                        : "Fresher (0 yrs)"}
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      Expected Salary
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {formatSalary(selectedCandidate.salary)}
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                      <Compass className="w-3.5 h-3.5 text-purple-600" />
                      Work Mode
                    </div>
                    <div className="text-sm sm:text-base font-bold text-slate-900 capitalize">
                      {selectedCandidate.location?.workMode || "On-site"}
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                      Education
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {selectedCandidate.education || "Not specified"}
                    </div>
                  </div>
                </div>

                {/* 3. Personal & Contact Details */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Candidate Profile & Location Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">
                        Phone Number
                      </p>
                      <p className="font-semibold text-slate-800">
                        {isCandidateUnlocked(selectedCandidate)
                          ? selectedCandidate.phone || "Not provided"
                          : maskPhone(selectedCandidate.phone)}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">
                        Gender & Age
                      </p>
                      <p className="font-semibold text-slate-800 capitalize">
                        {selectedCandidate.gender || "Not specified"}{" "}
                        {selectedCandidate.dob && (
                          <span className="text-slate-500 font-normal">
                            ({calculateAge(selectedCandidate.dob)} yrs • Born{" "}
                            {selectedCandidate.dob})
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">
                        Industry / Category
                      </p>
                      <p className="font-semibold text-slate-800">
                        {formatCategoryName(selectedCandidate.category) ||
                          "General"}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2 md:col-span-3">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">
                        Address & Location
                      </p>
                      <p className="font-semibold text-slate-800">
                        {selectedCandidate.location?.address ||
                          [
                            selectedCandidate.location?.talukaOrVillage,
                            selectedCandidate.location?.city,
                            selectedCandidate.location?.state,
                            selectedCandidate.location?.country,
                          ]
                            .filter(Boolean)
                            .join(", ") ||
                          "Location not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Bio / About Section */}
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    About Candidate / Professional Summary
                  </h3>
                  <div className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200/70 leading-relaxed">
                    {selectedCandidate.bio ||
                      "No detailed bio provided yet. Contact the candidate directly to discuss their career background and qualifications."}
                  </div>
                </div>

                {/* 5. Skills & Competencies */}
                <div className="space-y-2.5">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-blue-600" />
                    Skills & Technical Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills &&
                    selectedCandidate.skills.length > 0 ? (
                      selectedCandidate.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3.5 py-1.5 bg-blue-50 text-blue-800 text-xs font-semibold rounded-xl border border-blue-200/70"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        No specific skills tagged.
                      </span>
                    )}
                  </div>
                </div>

                {/* 6. Resume / CV Attachment (Protected behind unlock) */}
                {selectedCandidate.resume ? (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white text-blue-600 rounded-xl shadow-sm border border-blue-100">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          Candidate Resume Document
                        </h4>
                        <p className="text-xs text-slate-500">
                          Curriculum Vitae / Portfolio document uploaded by
                          candidate.
                        </p>
                      </div>
                    </div>
                    {isCandidateUnlocked(selectedCandidate) ? (
                      <a
                        href={`${import.meta.env.VITE_API_URL}${selectedCandidate.resume}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition shrink-0"
                      >
                        View / Download Resume
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <button
                        onClick={() =>
                          handleUnlockCandidate(selectedCandidate)
                        }
                        disabled={
                          unlockingCandidateId === selectedCandidate._id
                        }
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-sm transition shrink-0 disabled:opacity-60"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Unlock to Access CV</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-3 text-xs text-slate-500">
                    <FileText className="w-5 h-5 text-slate-400 shrink-0" />
                    <span>
                      Resume file not directly attached. Contact the candidate
                      via Direct Message or Phone for CV request.
                    </span>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="shrink-0 border-t border-slate-100 px-6 sm:px-8 py-4 bg-slate-50 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  Candidate ID: #{selectedCandidate._id?.substring(0, 10)}...
                </div>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Direct Message Composition Modal */}
      <AnimatePresence>
        {directMessageCandidate && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDirectMessageCandidate(null)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 my-auto"
            >
              {/* Header */}
              <div className="px-6 py-5 bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-400/30">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold">
                      Direct Message Candidate
                    </h3>
                    <p className="text-xs text-purple-200/80">
                      Reach out directly to {directMessageCandidate.name}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setDirectMessageCandidate(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSendDirectMessage} className="p-6 space-y-4">
                {/* Candidate Info Card */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                      {getInitials(directMessageCandidate.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {directMessageCandidate.name}
                      </p>
                      <p className="text-[11px] text-blue-600 truncate">
                        {directMessageCandidate.title || "Job Seeker"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Zap className="w-3 h-3 text-purple-600" />
                      1 Message Credit
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {msgRemaining} remaining
                    </span>
                  </div>
                </div>

                {/* Template Quick Selectors */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Choose Message Template
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "interview", label: "Interview" },
                      { id: "opportunity", label: "Job Offer" },
                      { id: "shortlisted", label: "Shortlisted" },
                      { id: "custom", label: "Custom" },
                    ].map((t) => (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => handleTemplateSelect(t.id)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition border text-center ${
                          messageTemplate === t.id
                            ? "bg-purple-50 border-purple-300 text-purple-700 shadow-xs"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={messageSubject}
                    onChange={(e) => setMessageSubject(e.target.value)}
                    placeholder="Enter subject..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-xs sm:text-sm transition outline-none"
                    required
                  />
                </div>

                {/* Message Body */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Message Content
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {messageContent.length} chars
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Type your message to the candidate here..."
                    className="w-full p-3.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-xs sm:text-sm leading-relaxed transition outline-none resize-none font-normal"
                    required
                  />
                </div>

                {/* WhatsApp Checkbox Option */}
                {directMessageCandidate.phone && (
                  <label className="flex items-center gap-2 p-3 bg-emerald-50/70 border border-emerald-200/70 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendAlsoWhatsApp}
                      onChange={(e) => setSendAlsoWhatsApp(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-900">
                      Also open WhatsApp chat with this message
                    </span>
                  </label>
                )}

                {/* Modal Actions */}
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setDirectMessageCandidate(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingMessage}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-500/20 transition flex items-center gap-2 disabled:opacity-60"
                  >
                    {sendingMessage ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Direct Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Subscription / Quota Upgrade Prompt Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUpgradeModal(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 my-auto text-center p-6 sm:p-8"
            >
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/25">
                <Crown className="w-8 h-8" />
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
                {hasActiveSub
                  ? upgradePromptReason === "unlock"
                    ? "Candidate Unlock Quota Reached"
                    : "Direct Message Quota Reached"
                  : "Employer Subscription Required"}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto mb-6">
                {hasActiveSub
                  ? `You have reached the limit for your current plan (${subscription?.planDetails?.name || "Active Plan"}). Upgrade your employer plan to continue connecting with top candidates.`
                  : "An active employer subscription plan is required to unlock candidate contact details (phone, email, WhatsApp, resume) and send direct messages."}
              </p>

              {/* Benefits Checklist */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left space-y-2.5 mb-6 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct phone, WhatsApp & email contact access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Send direct job inquiries & interview invitations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Download verified candidate CVs & portfolio documents</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => {
                    setShowUpgradeModal(false);
                    navigate("/pricing");
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-500/20 hover:shadow-brand-500/30 transition flex items-center justify-center gap-1.5"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>View Employer Plans</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
