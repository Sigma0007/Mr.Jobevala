import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Briefcase, ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PREDEFINED_CITIES = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Pune",
  "Ahmedabad",
  "Surat",
  "Rajkot",
  "Vadodara",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Indore",
  "Jaipur",
  "Remote",
];

export default function HeroSection() {
  const JobCategories = useSelector(
    (state) => state.dashboard?.categoriesType || [],
  );

  const navigate = useNavigate();
  const [keywordInput, setKeywordInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [jobCategoryInput, setJobCategoryInput] = useState("");
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

    if (value.trim()) {
      setFilteredCities(
        PREDEFINED_CITIES.filter((city) =>
          city.toLowerCase().includes(value.toLowerCase()),
        ),
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
    if (locationInput.trim())
      params.append("locationQuery", locationInput.trim());
    if (jobCategoryInput.trim())
      params.append("category", jobCategoryInput.trim());

    navigate(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <section className="relative h-screen flex items-center bg-gradient-to-r from-[#e3f9f6] via-[#d6f7f1] to-[#e4faf7] overflow-hidden pt-24 pb-12 lg:pt-28 lg:pb-14 select-none">
      {/* ================= BACKGROUND GRAPHICS & TEXTURES ================= */}

      {/* Industrial Factory Skyline & Walking Executives (Seamless gradient blend) */}

      {/* Top Left Graceful Translucent White Arc Swoosh */}
      <div className="absolute -top-12 -left-12 w-[380px] sm:w-[500px] lg:w-[620px] h-[380px] sm:h-[500px] lg:h-[620px] pointer-events-none z-0">
        <svg viewBox="0 0 500 500" className="w-full h-full" fill="none">
          <path
            d="M-20,0 C150,50 260,180 240,380 C230,460 160,510 40,530 L-20,530 Z"
            fill="url(#topSwoosh)"
          />
          <path
            d="M-20,0 C150,50 260,180 240,380 C230,460 160,510 40,530"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="4"
          />
          <defs>
            <linearGradient
              id="topSwoosh"
              x1="0"
              y1="0"
              x2="360"
              y2="360"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0.8" />
              <stop offset="0.6" stopColor="#d5f7f2" stopOpacity="0.4" />
              <stop offset="1" stopColor="#c2f2ea" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Soft Ambient Radiance over left text area */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[300px] bg-white/50 rounded-full blur-3xl pointer-events-none" />

      {/* ================= MAIN HERO CONTAINER ================= */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          {/* ================= LEFT COLUMN: HERO CONTENT ================= */}
          <div className="lg:col-span-8 xl:col-span-8 text-left">
            {/* Tagline / Sub-badge */}
            <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
              <span className="w-7 h-[3.5px] bg-[#00a88a] rounded-full inline-block shrink-0" />
              <span className="text-sm sm:text-base md:text-lg font-bold text-[#0c3144] tracking-wide">
                Focus on Skill, Job हम देंगे
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="tracking-tight uppercase mb-4">
              <span className="block text-4xl sm:text-5xl lg:text-[54px] xl:text-[62px] font-black text-[#0a2f44] leading-[1.05] drop-shadow-[0_2px_10px_rgba(0,180,160,0.2)]">
                MR. JOB WALA
              </span>
              <span className="block capitalize font-bold text-[#08283a] text-3xl sm:text-4xl lg:text-[46px] xl:text-[52px] leading-[1.08] mt-1 drop-shadow-xs">
                Find Your Dream Job
              </span>
              <span className="block capitalize font-bold text-[#08283a] text-3xl sm:text-4xl lg:text-[46px] xl:text-[52px] leading-[1.08]">
                Today
              </span>
            </h1>

            {/* Subtitle Description */}
            <p className="text-[#324f5f] text-sm sm:text-base lg:text-[16px] leading-relaxed max-w-xl mb-7 font-medium">
              We connect skilled people with the right opportunities in all
              fields, especially in manufacturing units and beyond.
            </p>

            {/* Unified Search Bar Pill (Matching user's reference) */}
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white rounded-2xl md:rounded-full p-2 md:p-2 md:pl-5 shadow-[0_12px_36px_rgba(4,107,98,0.14)] border border-[#a8e6db] flex flex-col md:flex-row items-center gap-2 w-full max-w-full lg:max-w-[840px] xl:max-w-[880px] transition-all hover:shadow-[0_16px_44px_rgba(4,107,98,0.22)]"
            >
              {/* Field 1: Job title, keyword, company */}
              <div className="flex items-center w-full md:w-auto md:flex-[1.8] px-2 py-2.5 md:py-1 min-w-[230px]">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#0a2f44] shrink-0 mr-2.5" />
                <input
                  type="text"
                  placeholder="Job title, keyword, company"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-[#0c2f42] placeholder-slate-400 text-xs sm:text-[13.5px] font-semibold"
                />
              </div>

              {/* Vertical Divider 1 */}
              <div className="hidden md:block h-6 w-[1px] bg-slate-200/90 shrink-0 mx-1" />

              {/* Field 2: Location */}
              <div
                className="relative flex items-center w-full md:w-auto md:flex-[1] px-2 py-2.5 md:py-1 border-t md:border-t-0 border-slate-100 min-w-[120px]"
                ref={dropdownRef}
              >
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#0a2f44] shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder="Location"
                  value={locationInput}
                  onChange={handleLocationChange}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-[#0c2f42] placeholder-slate-400 text-xs sm:text-[13.5px] font-semibold"
                />

                {/* Auto-suggest dropdown */}
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-3 w-64 bg-white border border-[#a8e6db] rounded-2xl shadow-2xl py-2 z-50 max-h-56 overflow-y-auto custom-scrollbar"
                    >
                      <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Popular Locations
                      </div>
                      {filteredCities.map((city, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onMouseDown={() => selectCity(city)}
                          className="w-full text-left px-3.5 py-2 hover:bg-[#e6faf6] flex items-center gap-2.5 text-xs font-semibold text-[#0c3144] transition-colors cursor-pointer"
                        >
                          <MapPin className="w-3.5 h-3.5 text-[#009b86]" />
                          {city}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Vertical Divider 2 */}
              <div className="hidden md:block h-6 w-[1px] bg-slate-200/90 shrink-0 mx-1" />

              {/* Field 3: Job Category */}
              <div className="flex items-center w-full md:w-auto md:flex-[1.1] px-2 py-2.5 md:py-1 border-t md:border-t-0 border-slate-100 min-w-[130px]">
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-[#0a2f44] shrink-0 mr-2" />
                <select
                  value={jobCategoryInput}
                  onChange={(e) => setJobCategoryInput(e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-[#0c2f42] text-xs sm:text-[13.5px] font-semibold cursor-pointer pr-1"
                >
                  <option value="">Job Category</option>
                  {JobCategories.map((cat, idx) => (
                    <option key={idx} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Action Button with glowing cyan aura */}
              <button
                type="submit"
                className="w-full md:w-auto px-6 sm:px-7 py-3 rounded-xl md:rounded-full bg-gradient-to-r from-[#01584f] via-[#026c62] to-[#01524a] hover:from-[#01473f] hover:to-[#013f38] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(2,108,98,0.45),0_0_18px_rgba(0,225,195,0.45)] hover:shadow-[0_6px_22px_rgba(2,108,98,0.6),0_0_24px_rgba(0,225,195,0.65)] transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 cursor-pointer whitespace-nowrap"
              >
                <span>Search Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Feature Highlights with Green Checkmark Circles (Bottom of Left Column) */}
            <div className="mt-8 flex flex-wrap items-center gap-5 sm:gap-7">
              {/* Badge 1 */}
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-[#092a3d]">
                <span className="w-5 h-5 rounded-full bg-[#0a5c53] flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
                <span>100% Genuine Jobs</span>
              </div>

              {/* Badge 2 */}
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-[#092a3d]">
                <span className="w-5 h-5 rounded-full bg-[#0a5c53] flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
                <span>Free Registration</span>
              </div>

              {/* Badge 3 */}
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-[#092a3d]">
                <span className="w-5 h-5 rounded-full bg-[#0a5c53] flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
                <span>Direct Company Joining</span>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: MR. JOB WALA LOGO & BRAND AURA ================= */}
          <div className="lg:col-span-4 xl:col-span-4 relative flex flex-col items-center justify-center z-20 -mt-8 sm:-mt-12 lg:-mt-16 xl:-mt-20 py-2 sm:py-4 lg:py-0">
            {/* Brilliant White-Green Radiant Center Core Glow */}
            <div className="absolute w-[320px] sm:w-[420px] lg:w-[480px] h-[320px] sm:h-[420px] lg:h-[480px] rounded-full bg-[radial-gradient(circle_at_center,_#ffffff_0%,_rgba(255,255,255,0.95)_18%,_rgba(30,225,175,0.65)_42%,_rgba(16,185,129,0.28)_62%,_transparent_75%)] blur-2xl pointer-events-none" />

            {/* Ambient Animated Green/Mint Halo Flare */}
            <motion.div
              animate={{
                scale: [1, 1.06, 1],
                opacity: [0.55, 0.8, 0.55],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute w-[260px] sm:w-[350px] lg:w-[390px] h-[260px] sm:h-[350px] lg:h-[390px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.85)_0%,_rgba(0,240,195,0.5)_38%,_rgba(16,185,129,0.2)_65%,_transparent_75%)] blur-3xl pointer-events-none"
            />

            {/* Angel Character & Brand Mark Container */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative z-20 flex flex-col items-center"
            >
              {/* Angel Logo Image from public/Image */}
              <div className="w-[220px] sm:w-[270px] lg:w-[310px] h-[170px] sm:h-[210px] lg:h-[240px] relative flex items-center justify-center">
                <img
                  src="/Image/logo.png"
                  alt="Mr. Job Wala Angel Logo"
                  className="w-full h-full object-contain drop-shadow-[0_16px_32px_rgba(0,180,150,0.45)] filter brightness-[1.03]"
                />
              </div>

              {/* Brand Typography under Angel */}
              <div className="text-center mt-1 sm:mt-1.5">
                <div className="text-base sm:text-lg font-black text-[#0b3145] tracking-[0.22em] leading-none drop-shadow-xs">
                  MR.
                </div>
                <div className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#00bda5] leading-tight drop-shadow-[0_2px_12px_rgba(0,189,165,0.45)]">
                  JOB WALA
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#0c3144] tracking-wide mt-1">
                  Focus on Skill, Job हम देंगे
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
