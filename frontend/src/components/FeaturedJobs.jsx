import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  ArrowRight,
  Building2,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Sparkles,
  Zap,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import customerservice from "../customer/customerservice";
import { useSelector } from "react-redux";

const timeAgo = (dateString) => {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
};

const formatSalary = (salary) => {
  if (!salary) return "₹12 - ₹24 LPA";
  if (typeof salary === "object") {
    const symbol = salary.currency === "INR" || !salary.currency ? "₹" : "$";
    if (salary.min && salary.max) {
      if (salary.min >= 100000) {
        return `${symbol}${(salary.min / 100000).toFixed(0)} - ${symbol}${(salary.max / 100000).toFixed(0)} LPA`;
      }
      return `${symbol}${salary.min.toLocaleString()} - ${symbol}${salary.max.toLocaleString()}`;
    }
  }
  if (typeof salary === "string") return salary;
  return "Competitive";
};

// Fallback high-impact jobs if API data is sparse
const DEMO_JOBS = [
  {
    _id: "demo-1",
    title: "Senior Full-Stack Engineer",
    company: "Razorpay",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg",
    location: { city: "Bengaluru", state: "KA" },
    salary: { min: 2400000, max: 3600000, currency: "INR" },
    jobType: "Full-Time",
    workMode: "Hybrid",
    category: "software_development",
    tags: ["React", "Node.js", "TypeScript", "AWS"],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    featured: true,
  },
  {
    _id: "demo-2",
    title: "Lead UI/UX Product Designer",
    company: "Swiggy",
    companyLogo: "https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg",
    location: { city: "Remote", state: "India" },
    salary: { min: 1800000, max: 2800000, currency: "INR" },
    jobType: "Full-Time",
    workMode: "Remote",
    category: "design_multimedia",
    tags: ["Figma", "Design Systems", "User Research"],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    featured: true,
  },
  {
    _id: "demo-3",
    title: "DevOps & Cloud Architect",
    company: "Zomato",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Zomato_Logo.svg",
    location: { city: "Gurugram", state: "NCR" },
    salary: { min: 3000000, max: 4500000, currency: "INR" },
    jobType: "Full-Time",
    workMode: "On-site",
    category: "software_development",
    tags: ["Kubernetes", "Docker", "Terraform", "GCP"],
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    featured: true,
  },
  {
    _id: "demo-4",
    title: "Product Marketing Manager",
    company: "Postman",
    companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop",
    location: { city: "Bengaluru", state: "KA" },
    salary: { min: 1600000, max: 2500000, currency: "INR" },
    jobType: "Full-Time",
    workMode: "Remote",
    category: "marketing_sales",
    tags: ["B2B SaaS", "Growth", "GTM", "Analytics"],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    featured: true,
  },
  {
    _id: "demo-5",
    title: "AI & Machine Learning Scientist",
    company: "Microsoft",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    location: { city: "Hyderabad", state: "TS" },
    salary: { min: 3500000, max: 5500000, currency: "INR" },
    jobType: "Full-Time",
    workMode: "Hybrid",
    category: "software_development",
    tags: ["PyTorch", "LLMs", "NLP", "Python"],
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    featured: true,
  },
  {
    _id: "demo-6",
    title: "Senior Financial Analyst",
    company: "Cred",
    companyLogo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop",
    location: { city: "Bengaluru", state: "KA" },
    salary: { min: 1800000, max: 2600000, currency: "INR" },
    jobType: "Full-Time",
    workMode: "On-site",
    category: "finance_accounting",
    tags: ["Financial Modeling", "FinTech", "Risk", "SQL"],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    featured: true,
  },
];

const FILTER_TABS = [
  { id: "all", label: "All Roles" },
  { id: "remote", label: "Remote Only" },
  { id: "software_development", label: "Software & Tech" },
  { id: "design_multimedia", label: "Design & UX" },
  { id: "marketing_sales", label: "Marketing" },
  { id: "finance_accounting", label: "Finance" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function FeaturedJobs() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [savedJobs, setSavedJobs] = useState(new Set());

  const fetchLastSixJobs = async () => {
    try {
      const response = await customerservice.getLastsixJobs();
      if (response?.success && response?.data?.length > 0) {
        setJobs(response.data);
      } else {
        setJobs(DEMO_JOBS);
      }
    } catch (error) {
      console.error("Error fetching last six jobs:", error);
      setJobs(DEMO_JOBS);
    }
  };

  useEffect(() => {
    fetchLastSixJobs();
  }, []);

  const handleToggleBookmark = (e, jobId) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please log in to save jobs.");
      return;
    }
    const nextSaved = new Set(savedJobs);
    if (nextSaved.has(jobId)) {
      nextSaved.delete(jobId);
      toast.success("Job removed from saved list");
    } else {
      nextSaved.add(jobId);
      toast.success("Job saved to your bookmarks! 📌");
    }
    setSavedJobs(nextSaved);
  };

  const filteredJobs = jobs.filter((job) => {
    if (activeTab === "all") return true;
    if (activeTab === "remote") {
      const mode = (job.workMode || "").toLowerCase();
      const loc = typeof job.location === "string" ? job.location.toLowerCase() : (job.location?.city || "").toLowerCase();
      return mode.includes("remote") || loc.includes("remote");
    }
    return job.category === activeTab;
  });

  return (
    <section className="py-20 lg:py-28 bg-[#FAF8F5] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-xs font-bold text-brand-700 uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            Hand-Picked Opportunities
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 tracking-tight mb-4">
            Featured Premium Roles
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Curated high-paying openings from verified hiring companies ready to interview this week.
          </p>
        </div>

        {/* Filter Tabs Bar */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto gap-2 pb-4 mb-10 custom-scrollbar">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-navy-900 text-white shadow-md shadow-navy-950/20"
                  : "bg-white text-slate-600 hover:text-navy-900 hover:bg-brand-50/70 border border-slate-200/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Jobs Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14"
        >
          <AnimatePresence>
            {filteredJobs.slice(0, 6).map((job) => {
              const companyName =
                job.companyProfile?.companyName ||
                job.companyProfile?.name ||
                job.company ||
                "Verified Partner";
              const companyLogo = job.companyLogo
                ? job.companyLogo
                : job.companyProfile?.logo
                ? (job.companyProfile.logo.startsWith("http")
                    ? job.companyProfile.logo
                    : import.meta.env.VITE_API_URL + job.companyProfile.logo)
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    companyName
                  )}&background=0E2738&color=32A899&bold=true`;
              const locationText = job.location?.city
                ? `${job.location.city}${
                    job.location.state ? `, ${job.location.state}` : ""
                  }`
                : typeof job.location === "string"
                ? job.location
                : "Remote";
              const salaryText = formatSalary(job.salary);
              const typeText = job.jobType || job.type || "Full-Time";
              const postedText = timeAgo(job.createdAt || job.posted);
              const isSaved = savedJobs.has(job._id || job.id);
              const workMode = job.workMode || (locationText.toLowerCase().includes("remote") ? "Remote" : "Hybrid");

              return (
                <motion.div
                  key={job._id || job.id}
                  variants={cardVariants}
                  onClick={() => navigate(`/jobs/${job._id || job.id}`)}
                  className="group relative bg-white p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 hover:border-brand-400 shadow-[0_4px_20px_rgba(14,39,56,0.04)] hover:shadow-[0_15px_35px_rgba(38,137,125,0.14)] transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5"
                >
                  {/* Left Accent Stripe */}
                  <div className="absolute left-0 top-8 bottom-8 w-1.5 bg-gradient-to-b from-brand-500 to-navy-800 opacity-0 group-hover:opacity-100 transition-opacity rounded-r-full" />

                  <div>
                    {/* Top Row: Logo, Company, Verified, Bookmark */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-13 h-13 rounded-xl p-2 bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
                          <img
                            src={companyLogo}
                            alt={companyName}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                companyName
                              )}&background=0E2738&color=32A899&bold=true`;
                            }}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-slate-500">
                              {companyName}
                            </span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 fill-brand-100" />
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-navy-950 group-hover:text-brand-600 transition-colors line-clamp-1 mt-0.5">
                            {job.title}
                          </h3>
                        </div>
                      </div>

                      {/* Bookmark Icon Button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleBookmark(e, job._id || job.id)}
                        className={`p-2 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                          isSaved
                            ? "bg-brand-50 text-brand-600 border-brand-200"
                            : "bg-slate-50 text-slate-400 hover:text-navy-900 border-slate-100"
                        }`}
                        title={isSaved ? "Saved" : "Save Job"}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-4 h-4 text-brand-600" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Metadata Pills */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-brand-50/80 border border-brand-100 text-brand-700 rounded-lg text-xs font-bold">
                        <DollarSign className="w-3 h-3 text-brand-600" />
                        {salaryText}
                      </span>
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200/70 text-slate-600 rounded-lg text-xs font-medium">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {locationText}
                      </span>
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-navy-50 border border-navy-100 text-navy-700 rounded-lg text-xs font-medium">
                        <Briefcase className="w-3 h-3 text-navy-500" />
                        {workMode}
                      </span>
                    </div>

                    {/* Tags preview */}
                    {job.tags && job.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {job.tags.slice(0, 3).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded text-[11px] font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Row */}
                  <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-slate-400 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {postedText}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-brand-600 group-hover:translate-x-0.5 transition-transform">
                      Apply Now <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Bottom CTA Row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-navy-900 to-navy-800 hover:from-navy-950 hover:to-navy-900 text-white rounded-full text-base font-bold shadow-[0_8px_20px_rgba(14,39,56,0.2)] hover:shadow-[0_12px_28px_rgba(14,39,56,0.3)] transition-all hover:scale-105 cursor-pointer"
          >
            <span>Explore All 50,000+ Active Openings</span>
            <ArrowRight className="w-5 h-5 text-brand-400" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
