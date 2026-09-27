import { motion } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  FileCheck2,
  BellRing,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

const ADVANTAGES = [
  {
    icon: Zap,
    title: "AI Angel Matchmaker",
    desc: "Our deep learning engine compares your resume skills with job requirements to surface roles with 90%+ hiring probability.",
    badge: "Instant ATS Score",
    color: "from-brand-500 to-brand-600",
  },
  {
    icon: ShieldCheck,
    title: "100% Verified Employers",
    desc: "Zero spam postings. Every recruiter and company profile is manual-verified with corporate domain verification.",
    badge: "Anti-Ghosting Policy",
    color: "from-navy-800 to-navy-950",
  },
  {
    icon: FileCheck2,
    title: "Built-in ATS Resume Builder",
    desc: "Choose from professional recruiter-tested templates, auto-suggest bullet points, and export print-ready PDFs for free.",
    badge: "ATS Compliant",
    color: "from-brand-600 to-teal-700",
  },
  {
    icon: BellRing,
    title: "Real-Time Interview Alerts",
    desc: "Get instant web socket notifications when recruiters review your application, shortlist your profile, or schedule interviews.",
    badge: "Live Status Sync",
    color: "from-navy-700 to-brand-700",
  },
];

const METRICS = [
  { value: "50,000+", label: "Verified Active Jobs", detail: "Updated hourly" },
  { value: "12,000+", label: "Hiring Tech Companies", detail: "Startups to MNCs" },
  { value: "₹45 LPA", label: "Highest Package Offered", detail: "Tech & Product Roles" },
  { value: "98.4%", label: "Candidate Satisfaction", detail: "Based on 14k+ reviews" },
];

export default function AngelAdvantage() {
  return (
    <section className="py-20 lg:py-28 bg-[#FAF8F5] relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-brand-200/30 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-navy-200/25 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-xs font-bold text-brand-700 uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            The Angel Advantage
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 tracking-tight mb-4">
            Why Top Candidates Choose <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-500 to-navy-800">
              MR. JOB WALA
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            We built a career platform that removes the friction, long wait times, and uncertainty from the modern hiring process.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {ADVANTAGES.map((adv, idx) => {
            const Icon = adv.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group bg-white p-7 rounded-3xl border border-slate-200/80 hover:border-brand-400 shadow-[0_4px_20px_rgba(14,39,56,0.04)] hover:shadow-[0_15px_35px_rgba(38,137,125,0.14)] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-13 h-13 rounded-2xl bg-gradient-to-tr ${adv.color} text-white flex items-center justify-center shadow-md`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200/60">
                      {adv.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-navy-950 mb-2.5 group-hover:text-brand-600 transition-colors">
                    {adv.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {adv.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-brand-700">
                  <CheckCircle2 className="w-4 h-4 text-brand-500" />
                  <span>Verified Platform Feature</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Metrics Banner Card */}
        <div className="bg-navy-900 text-white rounded-3xl p-8 sm:p-12 border border-navy-800 shadow-[0_20px_50px_rgba(14,39,56,0.3)] relative overflow-hidden">
          {/* Angel Wing Teal Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-400/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 text-center">
            {METRICS.map((metric, mIdx) => (
              <div key={mIdx} className="flex flex-col items-center">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-200 to-brand-400">
                    {metric.value}
                  </span>
                </p>
                <p className="text-sm sm:text-base font-bold text-brand-100 mt-2">
                  {metric.label}
                </p>
                <p className="text-xs text-navy-300 mt-0.5">
                  {metric.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
