import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  ArrowRight,
  X,
  CheckCircle,
  Building2,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const FEATURED_JOBS = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    company: "Google",
    location: "Mountain View, CA",
    type: "Full-Time",
    mode: "Hybrid",
    salary: "$160k - $210k",
    posted: "2 hours ago",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
    description:
      "We are looking for a Senior Frontend Engineer to build high-performance web applications for Google Workspace. You will lead UI architecture, mentor junior developers, and establish frontend best practices for our rapidly scaling enterprise product.",
    reqs: [
      "5+ years of React/Angular experience",
      "Expertise in TypeScript",
      "Advanced State Management",
      "Experience with large-scale distributed systems",
    ],
  },
  {
    id: 2,
    title: "Lead Product Designer",
    company: "Microsoft",
    location: "Redmond, WA",
    type: "Full-Time",
    mode: "Hybrid",
    salary: "$150k - $190k",
    posted: "5 hours ago",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    description:
      "Design beautiful, intuitive experiences for our core enterprise platform. You will work closely with product and engineering to take complex workflows and turn them into elegant, user-friendly interfaces.",
    reqs: [
      "Exceptional portfolio demonstrating enterprise design",
      "Mastery of Figma and prototyping tools",
      "Deep understanding of UX research methodologies",
      "Experience building design systems",
    ],
  },
  {
    id: 3,
    title: "Backend Node.js Developer",
    company: "Spotify",
    location: "London, UK",
    type: "Full-Time",
    mode: "Hybrid",
    salary: "$120k - $150k",
    posted: "1 day ago",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
    description:
      "Help scale our core audio processing systems. You will be building resilient, secure microservices that handle millions of streams daily with high throughput and low latency.",
    reqs: [
      "Strong Node.js and Express experience",
      "Proficiency with PostgreSQL and Redis",
      "Experience with AWS or GCP",
      "Knowledge of high-volume streaming architecture",
    ],
  },
  {
    id: 4,
    title: "Frontend Developer",
    company: "Airbnb",
    location: "San Francisco, CA",
    type: "Contract",
    mode: "Remote",
    salary: "$80 - $100/hr",
    posted: "2 days ago",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg",
    description:
      "Join our Guest Experience team to build stunning, high-converting interfaces. You will own the frontend implementation from zero to launch using React and modern CSS architecture.",
    reqs: [
      "Strong React fundamentals",
      "Expertise in modern CSS/Tailwind",
      "Experience with Next.js",
      "Ability to move fast and iterate perfectly to spec",
    ],
  },
  {
    id: 5,
    title: "Machine Learning Engineer",
    company: "Netflix",
    location: "Los Gatos, CA",
    type: "Full-Time",
    mode: "Hybrid",
    salary: "$200k - $250k",
    posted: "3 days ago",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Netflix_2015_N_logo.svg",
    description:
      "Join our core Personalization team to develop and deploy recommendation models. You will optimize inference pipelines and work on cutting-edge machine learning implementations.",
    reqs: [
      "Python, PyTorch, or TensorFlow",
      "Experience deploying models to production",
      "Strong background in statistics and linear algebra",
      "Experience with CUDA/GPU optimization",
    ],
  },
  {
    id: 6,
    title: "Marketing Website Developer",
    company: "Slack",
    location: "Denver, CO",
    type: "Freelance",
    mode: "Remote",
    salary: "$70 - $90/hr",
    posted: "1 week ago",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",
    description:
      "We need a highly skilled freelance developer to build stunning, high-converting marketing landing pages with Framer and Webflow, ensuring perfect responsiveness.",
    reqs: [
      "Framer and Webflow mastery",
      "Strong eye for high-end web design",
      "Understanding of SEO best practices",
      "Basic knowledge of React/Next.js",
    ],
  },
];

const RequirementItem = ({ text }) => (
  <motion.li
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-start gap-3 text-slate-600"
  >
    <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
    <span className="leading-relaxed text-[15px]">{text}</span>
  </motion.li>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
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
  const [selectedJob, setSelectedJob] = useState(null);

  return (
    <section className="py-20 lg:py-28 bg-[#F8FAFC] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-brand-600 font-bold text-xs md:text-sm tracking-[0.2em] uppercase mb-3 block">
            Hiring Now
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Featured Premium Roles
          </h2>
          <p className="text-base md:text-lg text-slate-500 font-medium">
            Hand-picked opportunities from the world's most innovative tech
            companies.
          </p>
        </div>

        {/* Jobs Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {FEATURED_JOBS.map((job) => (
            <motion.div
              key={job.id}
              variants={cardVariants}
              onClick={() => setSelectedJob(job)}
              className="group relative bg-white p-6 rounded-[1.5rem] border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-blue-200 transition-all cursor-pointer flex flex-col"
            >
              <div className="absolute left-0 top-6 bottom-6 w-1.5 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-r-full" />

              <div className="flex items-start gap-4 mb-5">
                <img
                  src={job.logo}
                  alt={job.company}
                  className="w-14 h-14 rounded-2xl object-contain p-2.5 border border-slate-100 shadow-sm shrink-0 bg-white group-hover:scale-105 transition-transform duration-300"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {job.title}
                  </h3>
                  <p className="text-[15px] font-medium text-slate-500 mt-0.5">
                    {job.company}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-medium text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/50 border border-blue-100/50 rounded-lg text-xs font-medium text-blue-700">
                  <DollarSign className="w-3.5 h-3.5 text-blue-500" />
                  {job.salary}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-medium text-slate-600">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  {job.type}
                </span>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  {job.posted}
                </span>
                <span className="flex items-center gap-1 text-sm font-bold text-blue-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  View Job <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Centered Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <Link
            to="/jobs"
            className="group flex items-center gap-2 px-8 py-4 bg-brand-600 text-white rounded-full text-base font-bold shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:bg-brand-700 hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] transition-all hover:-translate-y-1"
          >
            Find More Jobs
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* --- Responsive Job Details Modal --- */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl sm:rounded-[2rem] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-white/20 z-10"
            >
              {/* Modal Header - Fixed shrink issue on mobile */}
              <div className="shrink-0 p-5 sm:p-8 border-b border-slate-100 bg-slate-50/50 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

                <button
                  onClick={() => setSelectedJob(null)}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-white border border-slate-200 text-slate-500 rounded-full hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm z-20"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 relative z-10 pr-8 sm:pr-12">
                  <img
                    src={selectedJob.logo}
                    alt="logo"
                    className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-[1.25rem] object-contain p-2 sm:p-3 border-2 border-white shadow-md bg-white shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-1 sm:mb-2">
                      {selectedJob.title}
                    </h2>
                    <p className="text-sm sm:text-lg font-medium text-slate-500 flex items-center gap-2">
                      <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
                      {selectedJob.company}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 sm:mt-4 text-xs sm:text-[14px] font-medium text-slate-600">
                      <span className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 bg-white border border-slate-200 rounded-md shadow-sm">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 shrink-0" />{" "}
                        {selectedJob.location}
                      </span>
                      <span className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 bg-white border border-slate-200 rounded-md shadow-sm">
                        <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" />{" "}
                        {selectedJob.salary}
                      </span>
                      <span className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 bg-white border border-slate-200 rounded-md shadow-sm">
                        {selectedJob.mode}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-8 overflow-y-auto custom-scrollbar flex-1">
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 sm:mb-3 flex items-center gap-2">
                    About the Role
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-[15px]">
                    {selectedJob.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
                    Requirements
                  </h3>
                  <ul className="space-y-3 sm:space-y-4">
                    {selectedJob.reqs.map((req, i) => (
                      <RequirementItem key={i} text={req} />
                    ))}
                  </ul>
                </div>
              </div>

              {/* Modal Footer - Fixed shrink issue */}
              <div className="shrink-0 p-4 sm:p-6 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                <button
                  onClick={() => {
                    toast.success("Saved to your shortlist!", { icon: "🔖" });
                  }}
                  className="w-full sm:w-auto px-6 py-3 sm:py-3.5 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:border-slate-300 hover:bg-slate-50 transition-all text-center text-sm sm:text-base"
                >
                  Save for later
                </button>
                <button
                  onClick={() => {
                    toast.success("Application Submitted Successfully! 🎉");
                    setSelectedJob(null);
                  }}
                  className="w-full sm:w-auto flex-1 bg-blue-600 text-white py-3 sm:py-3.5 rounded-xl font-bold shadow-[0_4px_20px_0_rgb(37,99,235,0.3)] hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all text-center text-sm sm:text-[15px]"
                >
                  Apply Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reused custom scrollbar style from FindJobs.jsx */}
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
    </section>
  );
}
