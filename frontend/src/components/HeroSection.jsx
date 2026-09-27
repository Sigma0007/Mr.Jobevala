import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Briefcase,
  CheckCircle2,
  Star,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PREDEFINED_CITIES = [
  "Bengaluru, India",
  "Mumbai, India",
  "Delhi NCR, India",
  "Hyderabad, India",
  "Pune, India",
  "Chennai, India",
  "Remote",
  "San Francisco, USA",
  "London, UK",
  "Dubai, UAE",
  "Singapore",
];

const TRENDING_TAGS = [
  { label: "React Developer", type: "search" },
  { label: "UI/UX Designer", type: "search" },
  { label: "Remote", type: "mode" },
  { label: "Product Manager", type: "search" },
  { label: "Node.js", type: "search" },
  { label: "Full Stack", type: "search" },
  { label: "Data Analyst", type: "search" },
];

export default function HeroSection() {
  const navigate = useNavigate();
  const [keywordInput, setKeywordInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [jobTypeInput, setJobTypeInput] = useState("");
  const [filteredCities, setFilteredCities] = useState(PREDEFINED_CITIES);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocationInput(value);
    setShowDropdown(true);

    if (value) {
      setFilteredCities(
        PREDEFINED_CITIES.filter((city) =>
          city.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setFilteredCities(PREDEFINED_CITIES);
    }
  };

  const selectCity = (city) => {
    setLocationInput(city);
    setShowDropdown(false);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (keywordInput.trim()) params.append("searchQuery", keywordInput.trim());
    if (locationInput.trim()) params.append("locationQuery", locationInput.trim());
    if (jobTypeInput.trim()) params.append("jobType", jobTypeInput.trim());

    navigate(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleTagClick = (tag) => {
    if (tag.type === "mode") {
      navigate(`/jobs?workMode=${encodeURIComponent(tag.label.toLowerCase())}`);
    } else {
      navigate(`/jobs?searchQuery=${encodeURIComponent(tag.label)}`);
    }
  };

  return (
    <section className="relative min-h-[92vh] flex items-center bg-[#FAF8F5] overflow-hidden pt-28 pb-16 lg:pt-32 lg:pb-24">
      {/* Dynamic Background Halo & Angel Wing Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Teal Angel Wing Aura (Left/Center) */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.55, 0.35],
            rotate: [0, 45, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[550px] h-[550px] lg:w-[700px] lg:h-[700px] bg-gradient-to-br from-brand-300/40 via-brand-400/25 to-transparent rounded-full blur-[100px]"
        />

        {/* Navy Deep Atmosphere Orb (Right) */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.25, 0.45, 0.25],
            rotate: [0, -35, 0],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[15%] right-[-5%] w-[450px] h-[450px] lg:w-[650px] lg:h-[650px] bg-gradient-to-bl from-navy-800/20 via-brand-500/20 to-transparent rounded-full blur-[110px]"
        />

        {/* Subtle Halo Golden/Teal Ring Accent */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-to-b from-brand-100/40 to-transparent rounded-full blur-3xl opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* ================= LEFT COLUMN: HERO HEADLINE & SEARCH ================= */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-7 text-center lg:text-left"
          >
            {/* Guardian Angel Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 border border-brand-200/80 text-xs sm:text-sm font-bold text-navy-900 tracking-wide mb-6 shadow-[0_4px_15px_rgba(50,168,153,0.12)] backdrop-blur-md">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500"></span>
              </span>
              <span className="text-brand-700 font-extrabold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                MR. JOB WALA
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-navy-800">Your Career Guardian Angel</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-navy-900 leading-[1.08] tracking-tight mb-6">
              Land Your Next Job With{" "}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-500 to-navy-700">
                Angel Precision
                {/* Decorative Halo Curve under the gradient word */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-brand-400 opacity-70"
                  viewBox="0 0 200 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 5.5C50 1.5 150 1.5 199 5.5"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 mb-8 lg:mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Direct connection to <strong className="text-navy-900 font-semibold">12,000+ top companies</strong>. Verified recruiter chats, instant ATS resume matching, and zero spam.
            </p>

            {/* Modern Multifunctional Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl border border-brand-100 shadow-[0_15px_40px_-10px_rgba(14,39,56,0.12)] flex flex-col md:flex-row items-center gap-2 relative text-left mx-auto lg:mx-0 max-w-2xl lg:max-w-none hover:border-brand-300 transition-colors"
            >
              {/* Keyword Input */}
              <div className="flex-1 flex items-center w-full px-3.5 py-3 md:py-3.5 border-b md:border-b-0 md:border-r border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center mr-2.5 shrink-0 text-brand-600">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Job title, skill, company..."
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 text-navy-950 placeholder-slate-400 text-sm sm:text-base outline-none font-medium"
                />
              </div>

              {/* Location Input with Auto-Dropdown */}
              <div
                className="flex-1 flex items-center w-full px-3.5 py-3 md:py-3.5 border-b md:border-b-0 md:border-r border-slate-100 relative"
                ref={dropdownRef}
              >
                <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center mr-2.5 shrink-0 text-navy-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Location or Remote"
                  value={locationInput}
                  onChange={handleLocationChange}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full bg-transparent border-none focus:ring-0 text-navy-950 placeholder-slate-400 text-sm sm:text-base outline-none font-medium"
                />

                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 w-full mt-3 bg-white border border-brand-100 rounded-2xl shadow-2xl overflow-hidden z-[70]"
                  >
                    <div className="p-2 border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400 px-4">
                      Popular Job Hubs
                    </div>
                    <ul className="max-h-56 overflow-y-auto py-1.5 custom-scrollbar">
                      {filteredCities.length > 0 ? (
                        filteredCities.map((city, index) => (
                          <li
                            key={index}
                            onMouseDown={() => selectCity(city)}
                            className="px-4 py-2.5 hover:bg-brand-50/70 cursor-pointer flex items-center gap-3 text-navy-900 font-medium transition-colors text-sm"
                          >
                            <MapPin className="w-4 h-4 text-brand-600" />
                            {city}
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-3 text-slate-400 text-sm">
                          No matching locations
                        </li>
                      )}
                    </ul>
                  </motion.div>
                )}
              </div>

              {/* Job Type Dropdown */}
              <div className="hidden xl:flex items-center px-3 py-3 border-r border-slate-100">
                <select
                  value={jobTypeInput}
                  onChange={(e) => setJobTypeInput(e.target.value)}
                  className="bg-transparent text-sm font-medium text-navy-800 outline-none cursor-pointer pr-2"
                >
                  <option value="">All Types</option>
                  <option value="Full-time">Full-Time</option>
                  <option value="Part-time">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              {/* Find Jobs Action Button */}
              <button
                type="submit"
                className="w-full md:w-auto px-7 py-3.5 md:py-4 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 hover:from-brand-700 hover:to-brand-600 text-white rounded-xl sm:rounded-2xl text-base font-bold shadow-[0_8px_20px_rgba(38,137,125,0.35)] hover:shadow-[0_12px_28px_rgba(38,137,125,0.45)] transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Find Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Trending Keywords Quick Search */}
            <div className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm">
              <span className="font-bold text-navy-900 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-brand-600" />
                Popular:
              </span>
              {TRENDING_TAGS.map((tag, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="px-3 py-1 rounded-lg bg-white border border-slate-200/80 hover:border-brand-400 hover:bg-brand-50/60 text-slate-600 hover:text-brand-700 font-medium text-xs transition-all shadow-2xs cursor-pointer"
                >
                  {tag.label}
                </button>
              ))}
            </div>

            {/* Key Trust Highlights */}
            <div className="mt-8 pt-6 border-t border-slate-200/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>
                  <strong className="text-navy-900">50,000+</strong> Live Jobs
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-brand-100 text-brand-700 rounded-lg">
                  <Zap className="w-4 h-4" />
                </div>
                <span>
                  <strong className="text-navy-900">98%</strong> Match Accuracy
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                  <Star className="w-4 h-4 text-amber-600 fill-amber-500" />
                </div>
                <span>
                  <strong className="text-navy-900">4.9/5</strong> Candidate Rating
                </span>
              </div>
            </div>
          </motion.div>

          {/* ================= RIGHT COLUMN: MR. JOB WALA HERO COMPOSITION ================= */}
          <div className="lg:col-span-5 relative h-[460px] sm:h-[540px] lg:h-[580px] w-full flex items-center justify-center">
            {/* Animated Halo Ring behind central card */}
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.05, 1],
              }}
              transition={{
                rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full border-2 border-dashed border-brand-400/40 pointer-events-none z-0"
            />

            {/* Glowing Angel Backdrop Shield */}
            <div className="absolute w-[260px] h-[340px] sm:w-[320px] sm:h-[420px] bg-gradient-to-tr from-navy-900 via-navy-800 to-brand-800 rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(14,39,56,0.35)] p-1 overflow-hidden z-10">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop"
                alt="Confident Professional Working"
                className="w-full h-full object-cover rounded-[2.4rem] opacity-90 brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent rounded-[2.4rem]" />

              {/* Bottom text inside the main portrait card */}
              <div className="absolute bottom-5 inset-x-5 text-white z-20">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-500/80 backdrop-blur-sm text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  <Sparkles className="w-3 h-3" /> Angel Match AI
                </div>
                <h4 className="text-base font-bold text-white leading-snug">
                  "Got 3 interview calls within 24 hours!"
                </h4>
                <p className="text-xs text-brand-200 mt-0.5">
                  Sneha R. • Product Designer @ Tech Unicorn
                </p>
              </div>
            </div>

            {/* Floating Card 1: Instant Offer Released */}
            <motion.div
              initial={{ opacity: 0, x: -40, y: -20 }}
              animate={{ opacity: 1, x: 0, y: [0, -12, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: 0.3 },
                y: { repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 },
              }}
              className="absolute top-4 sm:top-8 -left-2 sm:-left-6 z-20 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-[0_15px_35px_rgba(14,39,56,0.15)] border border-brand-100 flex items-center gap-3.5 max-w-[240px] sm:max-w-[270px]"
            >
              <div className="w-11 h-11 bg-gradient-to-tr from-brand-500 to-brand-400 rounded-xl flex items-center justify-center text-white shadow-md shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-brand-700 uppercase tracking-wider">
                  <span>Offer Released 🎉</span>
                </div>
                <p className="text-xs sm:text-sm font-extrabold text-navy-950 mt-0.5">
                  ₹28 LPA Full Stack Lead
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  Direct Verified Recruiter
                </p>
              </div>
            </motion.div>

            {/* Floating Card 2: 99% Skill Score Match */}
            <motion.div
              initial={{ opacity: 0, x: 40, y: 30 }}
              animate={{ opacity: 1, x: 0, y: [0, 14, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: 0.5 },
                y: { repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 },
              }}
              className="absolute bottom-6 sm:bottom-10 -right-2 sm:-right-6 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-[0_15px_35px_rgba(14,39,56,0.15)] border border-brand-100 min-w-[210px]"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-navy-900 uppercase tracking-wide">
                    Angel Match Score
                  </span>
                </div>
                <span className="text-xs font-black text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                  99%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-gradient-to-r from-brand-500 to-brand-400 h-full w-[99%] rounded-full" />
              </div>
              <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-brand-600" />
                Matched with 18+ Top Startups
              </p>
            </motion.div>

            {/* Floating Card 3: Top Recruiter Response */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
              transition={{
                opacity: { duration: 0.5, delay: 0.7 },
                y: { repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 1.5 },
              }}
              className="absolute top-1/2 -right-4 sm:-right-8 -translate-y-1/2 z-20 bg-navy-900 text-white p-3 sm:p-3.5 rounded-2xl shadow-xl border border-navy-700 hidden sm:flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">&lt; 15 Mins Response</p>
                <p className="text-[10px] text-brand-300">Fast-Track Hiring</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
