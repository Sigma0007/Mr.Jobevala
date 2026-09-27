import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Search,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Zap,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

const CANDIDATE_STEPS = [
  {
    step: "01",
    title: "Create Profile & Build Smart Resume",
    desc: "Build an ATS-optimized resume in 5 minutes with our AI Resume Builder. Highlight your skills and stand out to recruiters.",
    icon: FileText,
    action: { label: "Build Resume Free", to: "/resume" },
    highlight: "ATS Score: 95/100",
  },
  {
    step: "02",
    title: "Instant AI Match & 1-Click Apply",
    desc: "Our Angel Match engine pairs your profile directly with openings where you are in the top 5% of qualified applicants.",
    icon: Zap,
    action: { label: "Explore Matching Jobs", to: "/jobs" },
    highlight: "98% Match Precision",
  },
  {
    step: "03",
    title: "Direct Recruiter Chat & Get Hired",
    desc: "Skip the middlemen. Chat directly with hiring managers, schedule real-time interviews, and get hired faster.",
    icon: MessageSquare,
    action: { label: "Join Community Feed", to: "/feed" },
    highlight: "Avg. Hiring Time: 7 Days",
  },
];

const EMPLOYER_STEPS = [
  {
    step: "01",
    title: "Post Your Job in 2 Minutes",
    desc: "Define your requirements, compensation, and preferred skills. Reach thousands of verified candidates instantly.",
    icon: Building2,
    action: { label: "Post a Job Now", to: "/register" },
    highlight: "Reach 1.2M+ Seekers",
  },
  {
    step: "02",
    title: "AI Shortlists Top 5% Candidates",
    desc: "Our AI filters out unqualified applicants and surfaces only candidates who strictly meet your experience & stack needs.",
    icon: UserCheck,
    action: { label: "Browse Candidates", to: "/candidates" },
    highlight: "Zero Spam Applicants",
  },
  {
    step: "03",
    title: "Direct Connect & Fast-Track Onboarding",
    desc: "Message candidates in real-time, view verified portfolio links, send offers, and build high-impact teams.",
    icon: ShieldCheck,
    action: { label: "View Employer Plans", to: "/pricing" },
    highlight: "0% Commission",
  },
];

export default function HowItWorksSection() {
  const [activeAudience, setActiveAudience] = useState("candidate"); // "candidate" | "employer"

  const steps = activeAudience === "candidate" ? CANDIDATE_STEPS : EMPLOYER_STEPS;

  return (
    <section className="py-20 lg:py-28 bg-white border-y border-brand-100/60 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-xs font-bold text-brand-700 uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            Seamless Career Journey
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 tracking-tight mb-4">
            How MR. JOB WALA Works
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Fast, transparent, and driven by smart AI matchmaking for candidates and companies.
          </p>

          {/* Audience Switcher */}
          <div className="inline-flex items-center p-1.5 bg-slate-100/80 rounded-full border border-slate-200 mt-8">
            <button
              onClick={() => setActiveAudience("candidate")}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeAudience === "candidate"
                  ? "bg-navy-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-navy-900"
              }`}
            >
              For Job Seekers
            </button>
            <button
              onClick={() => setActiveAudience("employer")}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeAudience === "employer"
                  ? "bg-navy-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-navy-900"
              }`}
            >
              For Employers &amp; HRs
            </button>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={`${activeAudience}-${idx}`}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35, delay: idx * 0.1 }}
                  className="group relative bg-[#FAF8F5] p-8 rounded-3xl border border-brand-100/80 hover:border-brand-400 hover:bg-white shadow-[0_4px_20px_rgba(14,39,56,0.03)] hover:shadow-[0_15px_35px_rgba(38,137,125,0.12)] transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Number & Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-brand-200/80 flex items-center justify-center text-brand-600 shadow-xs group-hover:bg-navy-900 group-hover:text-white transition-colors duration-300">
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="text-3xl font-black text-brand-300/80 group-hover:text-brand-500 transition-colors">
                        {item.step}
                      </span>
                    </div>

                    {/* Step Highlight Badge */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-brand-200/70 text-[11px] font-bold text-brand-700 mb-3 shadow-2xs">
                      <CheckCircle2 className="w-3 h-3 text-brand-600" />
                      {item.highlight}
                    </div>

                    <h3 className="text-xl font-bold text-navy-950 mb-3 group-hover:text-brand-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-8 pt-5 border-t border-slate-200/70">
                    <Link
                      to={item.action.to}
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-700 group-hover:text-brand-600 group-hover:translate-x-1 transition-all"
                    >
                      <span>{item.action.label}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
