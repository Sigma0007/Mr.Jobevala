import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Briefcase,
  Building2,
  MapPin,
  IndianRupee,
  User,
  Mail,
  Phone,
  FileText,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Clock,
  Send,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import customerservice from "../../customer/customerservice";

export default function ApplyJobModal({ isOpen, onClose, job, onSubmit }) {
  const { user: authUser } = useSelector((state) => state.auth || {});
  const [formData, setFormData] = useState({
    coverLetter: "",
    location: "",
    totalExperience: "",
    noticePeriod: "Immediate",
    currentCTC: "",
    expectedCTC: "",
    currentCompany: "",
    currentRole: "",
  });

  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user profile on modal open to pre-fill application details
  useEffect(() => {
    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen]);

  const fetchUserProfile = async () => {
    try {
      setLoadingProfile(true);
      const res = await customerservice.getUserProfile();
      if (res?.success && res?.data) {
        const profile = res.data;
        setUserProfile(profile);

        // Pre-fill location from profile if available
        let profileLocation = "";
        if (profile.location) {
          const parts = [profile.location.city, profile.location.state].filter(
            Boolean,
          );
          profileLocation = parts.join(", ") || profile.location.address || "";
        }

        // Set form data with profile defaults if not already typed
        setFormData((prev) => ({
          ...prev,
          currentRole: prev.currentRole || profile.title || "",
          totalExperience:
            prev.totalExperience ||
            (profile.experience !== undefined && profile.experience !== null
              ? String(profile.experience)
              : ""),
          location: prev.location || profileLocation || "",
          currentCTC:
            prev.currentCTC ||
            (profile.salary?.min ? `${profile.salary.min} LPA` : ""),
          expectedCTC:
            prev.expectedCTC ||
            (profile.salary?.max ? String(profile.salary.max) : ""),
        }));
      }
    } catch (error) {
      console.error("Error fetching user profile in ApplyJobModal:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNoticePeriodSelect = (period) => {
    setFormData((prev) => ({
      ...prev,
      noticePeriod: period,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        const data = {
          ...formData,
          jobId: job._id,
        };
        await onSubmit(data);
      } else {
        toast.success("Application submitted successfully!");
        onClose();
      }
    } catch (error) {
      toast.error("Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !job) return null;

  const candidateName = userProfile?.name || authUser?.name || "Job Applicant";
  const candidateEmail = authUser?.email || "No email available";
  const candidatePhone =
    userProfile?.phone || authUser?.phone || "No phone provided";
  const candidateImage =
    userProfile?.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      candidateName,
    )}&background=3b82f6&color=fff&bold=true`;
  const candidateResume = userProfile?.resume;
  const candidateSkills = Array.isArray(userProfile?.skills)
    ? userProfile.skills
    : [];
  const candidateEducation = userProfile?.education;

  const noticeOptions = [
    "Immediate",
    "15 Days",
    "30 Days",
    "45 Days",
    "60 Days",
    "90 Days",
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 font-sans">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 24 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-100 z-10"
        >
          {/* Modal Header */}
          <div className="shrink-0 p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-full transition-all shadow-sm z-20 backdrop-blur-sm"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10 pr-10">
              <div className="relative">
                <img
                  src={
                    job?.companyProfile?.logo ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      job?.companyProfile?.companyName || "C",
                    )}&background=2563eb&color=fff&bold=true`
                  }
                  alt="Company Logo"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-contain p-2 border-2 border-white/20 shadow-lg bg-white shrink-0"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500/30 text-brand-200 border border-brand-400/30 mb-1">
                  <Sparkles className="w-3 h-3 text-brand-300" /> Applying for
                  Position
                </div>
                <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-tight capitalize truncate">
                  {job?.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300 mt-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    {job?.companyProfile?.companyName || "Company"}
                  </span>
                  {job?.location && (
                    <>
                      <span className="text-white/30">•</span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        {job.location.city},{job.location.state}
                      </span>
                    </>
                  )}
                  {job?.salary && (
                    <>
                      <span className="text-white/30">•</span>
                      <span className="flex items-center gap-1 text-emerald-300 font-semibold">
                        <IndianRupee className="w-3.5 h-3.5 shrink-0" />
                        {typeof job.salary === "object"
                          ? `${job.salary.min || 0} - ${job.salary.max || 0} ${job.salary.currency || "INR"}`
                          : job.salary}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Body / Form */}
          <div className="p-5 sm:p-7 overflow-y-auto custom-scrollbar flex-1 space-y-6">
            {/* SECTION 1: Applicant Profile Information (Shared with Provider) */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Applicant Profile Information
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      This verified information will be directly shared with{" "}
                      <span className="font-semibold text-slate-700">
                        {job?.companyProfile?.companyName || "the employer"}
                      </span>
                    </p>
                  </div>
                </div>
                {loadingProfile && (
                  <span className="flex items-center gap-1.5 text-xs text-brand-600">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading...
                  </span>
                )}
              </div>

              {/* Applicant Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Name & Avatar */}
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
                  <img
                    src={candidateImage}
                    alt={candidateName}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Full Name
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {candidateName}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Email Address
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                      {candidateEmail}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Contact Phone
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                      {candidatePhone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Secondary Details: Resume & Education / Skills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Resume Status Card */}
                <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        candidateResume
                          ? "bg-purple-50 text-purple-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Resume / CV
                      </p>
                      <p className="text-xs font-semibold text-slate-800 truncate flex items-center gap-1">
                        {candidateResume ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            Resume Attached
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            No Resume on Profile
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {candidateResume && (
                    <a
                      href={candidateResume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1 transition-colors shrink-0"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Education or Skills preview */}
                <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Education / Degree
                    </p>
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {candidateEducation || "Higher Education / Graduate"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Skills Tags */}
              {candidateSkills.length > 0 && (
                <div className="pt-2">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Profile Skills & Tags
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {candidateSkills.slice(0, 8).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 bg-white text-slate-700 text-xs font-semibold rounded-lg border border-slate-200/80 shadow-2xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {candidateSkills.length > 8 && (
                      <span className="px-2 py-1 bg-slate-200 text-slate-600 text-[11px] font-semibold rounded-lg">
                        +{candidateSkills.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: Application Details Form */}
            <form id="apply-form" onSubmit={handleSubmit} className="space-y-5">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-brand-600" />
                  Employment & Application Details Required by Provider
                </h3>
                <p className="text-xs text-slate-500">
                  Please review and customize your experience, availability, and
                  expectations for this role.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Current Role */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Current Role / Designation{" "}
                    <span className="text-slate-400 font-normal lowercase">
                      (optional)
                    </span>
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="currentRole"
                      value={formData.currentRole}
                      onChange={handleChange}
                      placeholder="e.g. Senior Frontend Engineer"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Current Company */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Current Employer / Company{" "}
                    <span className="text-slate-400 font-normal lowercase">
                      (optional)
                    </span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="currentCompany"
                      value={formData.currentCompany}
                      onChange={handleChange}
                      placeholder="e.g. Infosys, Freelance, Google"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Total Experience */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Total Experience (Years){" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="totalExperience"
                    min="0"
                    step="0.1"
                    value={formData.totalExperience}
                    onChange={handleChange}
                    placeholder="e.g. 3.5"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none font-medium"
                    required
                  />
                </div>

                {/* Current Location */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Current Location / City{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Ahmedabad, Gujarat"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Notice Period */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Notice Period / Availability{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {noticeOptions.map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => handleNoticePeriodSelect(opt)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          formData.noticePeriod === opt
                            ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="noticePeriod"
                      value={formData.noticePeriod}
                      onChange={handleChange}
                      placeholder="e.g. 30 Days or Serving Notice"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Current CTC */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Current CTC{" "}
                    <span className="text-slate-400 font-normal lowercase">
                      (optional)
                    </span>
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="currentCTC"
                      value={formData.currentCTC}
                      onChange={handleChange}
                      placeholder="e.g. 6.5 LPA"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Expected CTC */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Expected CTC / Salary{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      name="expectedCTC"
                      value={formData.expectedCTC}
                      onChange={handleChange}
                      placeholder="e.g. 9 or 900000"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none font-semibold"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Numerical value matching annual/monthly package
                    expectations.
                  </p>
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Cover Letter / Pitch to Employer{" "}
                  <span className="text-slate-400 font-normal lowercase">
                    (optional)
                  </span>
                </label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Introduce yourself and highlight why your skills and experience make you an excellent fit for this position..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none resize-none leading-relaxed"
                ></textarea>
              </div>
            </form>
          </div>

          {/* Modal Footer */}
          <div className="shrink-0 p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              Information submitted securely to provider
            </p>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-xs hover:border-slate-300 hover:bg-slate-100 transition-all text-center text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="apply-form"
                disabled={isSubmitting}
                className="flex-1 sm:flex-initial px-6 py-2.5 bg-brand-600 text-white font-bold rounded-xl shadow-[0_4px_16px_0_rgb(37,99,235,0.3)] hover:bg-brand-700 active:scale-[0.98] transition-all text-center text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        @media (min-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
          border: 2px solid white;
        }
        @media (min-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar-thumb {
            border: 3px solid white;
          }
        }
      `,
        }}
      />
    </AnimatePresence>
  );
}
