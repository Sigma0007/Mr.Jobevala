import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Briefcase,
  Target,
  Users,
  Award,
  Sparkles,
  ShieldCheck,
  Globe2,
  TrendingUp,
  HeartHandshake,
  ArrowRight,
  CheckCircle2,
  Building2,
  Zap,
} from "lucide-react";

export default function AboutUs() {
  const stats = [
    { label: "Active Job Listings", value: "25,000+", icon: Briefcase, color: "text-brand-500", bg: "bg-brand-50" },
    { label: "Verified Employers", value: "4,200+", icon: Building2, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Successful Hires", value: "85,000+", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Talent Satisfaction", value: "99.4%", icon: Award, color: "text-amber-500", bg: "bg-amber-50" },
  ];

  const values = [
    {
      icon: Target,
      title: "Precision Matching",
      description: "We use intelligent contextual parsing to match candidates with roles that fit their true capabilities and ambition, not just keywords.",
    },
    {
      icon: ShieldCheck,
      title: "100% Verified Opportunities",
      description: "Every company and job posting is rigorously screened and verified to guarantee safe, authentic, and scam-free job hunting.",
    },
    {
      icon: HeartHandshake,
      title: "Human-Centric Empathy",
      description: "Behind every resume is a person with dreams. We build technology that respects candidates' time, career growth, and work-life balance.",
    },
    {
      icon: Zap,
      title: "Agile Hiring Velocity",
      description: "We reduce time-to-hire by over 60% with instant applicant tracking, automated screening tools, and real-time candidate messaging.",
    },
  ];

  const leaders = [
    {
      name: "Alex Sterling",
      role: "Founder & Chief Executive Officer",
      bio: "Former Talent VP at TechVentures with 15+ years revolutionizing recruitment pipelines and labor economics.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Sarah Jenkins",
      role: "Head of Product & AI Systems",
      bio: "Machine learning specialist passionate about equitable algorithms and transparent recommendation engines.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Marcus Vance",
      role: "Chief Technology Officer",
      bio: "Distributed systems architect committed to scalable, high-throughput career infrastructure and privacy.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Priya Patel",
      role: "VP of Candidate Experience",
      bio: "Dedicated career coach and advocate championing candidate mentorship, fair pay, and inclusive hiring practices.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    },
  ];

  const milestones = [
    {
      year: "2023",
      title: "The Genesis",
      desc: "Founded with a mission to remove friction and ghosting from the modern employment market.",
    },
    {
      year: "2024",
      title: "AI Matching & Resume Suite",
      desc: "Launched our real-time smart resume builder and employer applicant tracking dashboard.",
    },
    {
      year: "2025",
      title: "Global Community & 50K Hires",
      desc: "Expanded across 14 global tech hubs with over 50,000 verified careers launched.",
    },
    {
      year: "2026",
      title: "Next-Gen Hiring Ecosystem",
      desc: "Introducing instant verified skill assessments, live collaboration, and direct messaging.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-b from-brand-50/60 via-white to-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100/70 border border-brand-200 text-brand-800 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            Empowering Careers Everywhere
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-navy-950 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight"
          >
            Bridging Ambition With Opportunity via{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-teal-500">
              Intelligent Precision
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            MR. JOB WALA was engineered to transform how professionals find their dream roles and how forward-thinking employers assemble world-class teams.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-brand-500/25 transition-all duration-200 hover:-translate-y-0.5"
            >
              Explore Job Openings
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-navy-900 border border-slate-200 font-semibold px-7 py-3.5 rounded-xl shadow-sm transition-all duration-200 hover:border-slate-300"
            >
              Join as Employer
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-4 hover:border-brand-200 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-navy-950 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Our Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-brand-600 font-bold text-sm uppercase tracking-wider mb-3">
              <Globe2 className="w-4 h-4" />
              Our Purpose & Promise
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-950 tracking-tight leading-tight">
              Reinventing Recruitment to be Fair, Transparent, and Fast.
            </h2>
            <p className="mt-5 text-slate-600 leading-relaxed text-base">
              Traditional job hunting is plagued with opaque algorithms, endless ghosting, and irrelevant outreach. We envisioned a sanctuary where candidates receive clarity and feedback, while recruiters find verified, ready-to-interview talent instantly.
            </p>
            <div className="mt-8 space-y-4">
              {[
                "Zero Spam & Verified Companies Only",
                "Direct Messaging between Candidates and Hiring Managers",
                "Intelligent Resume Match Scoring and Salary Benchmarks",
                "Equal Opportunity & Bias-Minimized Screening Tools",
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-navy-900 font-medium text-sm sm:text-base">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/20 to-teal-400/20 rounded-3xl blur-2xl opacity-60" />
            <div className="relative bg-navy-900 rounded-3xl p-8 sm:p-10 text-white shadow-2xl border border-navy-800">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400 mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our North Star Vision</h3>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base mb-6">
                "To create a world where geographical boundaries, opaque networks, and biased filters never hinder passionate individuals from doing their life's best work."
              </p>
              <div className="pt-6 border-t border-navy-800 flex items-center justify-between text-xs text-slate-400">
                <span>MR. JOB WALA Core Philosophy</span>
                <span className="text-brand-400 font-bold">100% Community-Driven</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-white py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-brand-600 font-bold text-sm uppercase tracking-wider mb-2">
              What Guides Us
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-950 tracking-tight">
              Our Core Cultural Values
            </h2>
            <p className="text-slate-600 mt-3 text-base">
              The foundational pillars that govern our decisions, product architecture, and community standards every single day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="bg-slate-50 hover:bg-white rounded-2xl p-7 border border-slate-100 hover:border-brand-200 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 mb-6 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-navy-950 mb-2.5">
                    {v.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Milestones */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-brand-600 font-bold text-sm uppercase tracking-wider mb-2">
            Growth & Evolution
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-navy-950 tracking-tight">
            Our Journey So Far
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {milestones.map((m, idx) => (
            <div
              key={m.year}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm relative hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="text-3xl font-black text-brand-600 mb-2">
                {m.year}
              </div>
              <h4 className="text-lg font-bold text-navy-950 mb-2">{m.title}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership Team */}
      <section className="bg-slate-100/60 py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-brand-600 font-bold text-sm uppercase tracking-wider mb-2">
              The Innovators Behind the Platform
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-950 tracking-tight">
              Meet Our Leadership
            </h2>
            <p className="text-slate-600 mt-3 text-base">
              A diverse collective of engineers, recruiters, and career architects dedicated to your professional success.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {leaders.map((person) => (
              <div
                key={person.name}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative">
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-navy-950">{person.name}</h3>
                  <div className="text-xs font-semibold text-brand-600 mb-3">{person.role}</div>
                  <p className="text-slate-500 text-xs leading-relaxed">{person.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-brand-950 rounded-3xl p-8 sm:p-14 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
            Ready to Accelerate Your Career Journey?
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg mb-8">
            Join thousands of active professionals finding verified career breakthroughs every day.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/jobs"
              className="bg-brand-500 hover:bg-brand-400 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-brand-500/30 transition-all hover:scale-105"
            >
              Browse Open Jobs
            </Link>
            <Link
              to="/contact"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-8 py-3.5 rounded-xl backdrop-blur-sm transition-all"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
