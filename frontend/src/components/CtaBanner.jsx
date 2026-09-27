import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, FileText, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

export default function CtaBanner() {
  return (
    <section className="py-20 bg-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-[2.5rem] bg-gradient-to-r from-navy-950 via-navy-900 to-brand-950 p-8 sm:p-14 lg:p-20 text-white shadow-[0_25px_60px_-15px_rgba(14,39,56,0.35)] border border-navy-800/80 overflow-hidden text-center lg:text-left">
          {/* Angel Wings / Teal Ambient Background Glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-brand-400/25 via-brand-500/15 to-transparent rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-[400px] h-[400px] bg-brand-600/15 rounded-full blur-[90px] pointer-events-none" />

          {/* Halo Ring graphic */}
          <div className="absolute top-1/2 right-12 -translate-y-1/2 w-72 h-72 rounded-full border border-brand-400/20 pointer-events-none hidden lg:block" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left: Text Info */}
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/20 border border-brand-400/30 text-xs font-bold text-brand-300 uppercase tracking-widest mb-6 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                Join 1.2M+ Professionals
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] mb-6">
                Ready to Land Your Dream Job with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-brand-300 to-white">
                  Angel Precision?
                </span>
              </h2>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed mb-8">
                Create your free profile in under 2 minutes. Build an ATS-friendly resume, match with verified top employers, and take charge of your career today.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs sm:text-sm text-brand-200 font-semibold">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-400" />
                  100% Free for Seekers
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-brand-400" />
                  Instant ATS Resume Score
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-brand-400" />
                  Verified Direct HRs
                </span>
              </div>
            </div>

            {/* Right: Dual CTAs */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 justify-center">
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-500 via-brand-400 to-brand-500 hover:from-brand-600 hover:to-brand-500 text-white font-extrabold text-base shadow-[0_10px_25px_rgba(50,168,153,0.35)] transition-all hover:scale-[1.03] cursor-pointer"
              >
                <span>Find Jobs Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/resume"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-base border border-white/20 backdrop-blur-sm transition-all hover:scale-[1.03] cursor-pointer"
              >
                <FileText className="w-5 h-5 text-brand-300" />
                <span>Build Smart Resume</span>
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-brand-300 hover:text-white transition-colors pt-1"
              >
                <span>Hiring for your team? Post a job free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
