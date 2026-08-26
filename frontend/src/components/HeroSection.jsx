import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Briefcase,
  CheckCircle2,
  Star,
  TrendingUp,
} from "lucide-react";

const PREDEFINED_CITIES = [
  "New York, NY",
  "San Francisco, CA",
  "London, UK",
  "Austin, TX",
  "Remote",
  "Toronto, CA",
  "Berlin, DE",
  "Sydney, AU",
  "Seattle, WA",
  "Chicago, IL",
];

export default function HeroSection() {
  const [locationInput, setLocationInput] = useState("");
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

  return (
    <section className="relative min-h-[90vh] flex items-center bg-[#F8FAFC] overflow-hidden pt-24 pb-16 lg:pt-28 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ================= LEFT COLUMN ================= */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left mt-8 lg:mt-0"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-600 tracking-wider uppercase mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Best Jobs Place
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6">
              The Easiest Way <br className="hidden sm:block" />
              to Get Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-500">
                New Job
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-500 mb-8 lg:mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
              Each month, more than 3 million job seekers turn to our website in
              their search for work, making over 140,000 applications every
              single day.
            </p>

            <div className="bg-white p-2 sm:p-3 rounded-2xl md:rounded-full border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] flex flex-col md:flex-row items-center gap-2 relative text-left mx-auto max-w-2xl lg:max-w-none">
              <div className="flex-1 flex items-center w-full px-4 py-3 md:py-4 border-b md:border-b-0 md:border-r border-slate-100">
                <Briefcase className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Job title, Company"
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder-slate-400 px-3 text-sm sm:text-base outline-none font-medium"
                />
              </div>

              <div
                className="flex-1 flex items-center w-full px-4 py-3 md:py-4 relative"
                ref={dropdownRef}
              >
                <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Location"
                  value={locationInput}
                  onChange={handleLocationChange}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder-slate-400 px-3 text-sm sm:text-base outline-none font-medium"
                />

                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 w-full mt-3 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden z-[60]"
                  >
                    <ul className="max-h-60 overflow-y-auto py-2 custom-scrollbar">
                      {filteredCities.length > 0 ? (
                        filteredCities.map((city, index) => (
                          <li
                            key={index}
                            onMouseDown={() => selectCity(city)}
                            className="px-5 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 text-slate-700 font-medium transition-colors text-sm sm:text-base"
                          >
                            <MapPin className="w-4 h-4 text-slate-400" />
                            {city}
                          </li>
                        ))
                      ) : (
                        <li className="px-5 py-3 text-slate-400 text-sm">
                          No locations found
                        </li>
                      )}
                    </ul>
                  </motion.div>
                )}
              </div>

              <button className="w-full md:w-auto px-8 py-3.5 md:py-4 bg-brand-600 text-white rounded-xl md:rounded-full text-base font-bold hover:bg-brand-700 shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] transition-all hover:scale-105 flex-shrink-0 mt-2 md:mt-0">
                Find now
              </button>
            </div>

            <div className="mt-8 lg:mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-8 text-sm font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span>
                  <strong className="text-slate-900">50k+</strong> Active Jobs
                </span>
              </div>
              <div className="flex items-center gap-2 hover:text-brand-600 cursor-pointer transition-colors">
                <CheckCircle2 className="w-4 h-4 text-brand-500" />
                Post Your Job
              </div>
            </div>
          </motion.div>

          {/* ================= RIGHT COLUMN (Properly Responsive) ================= */}
          <div className="relative h-[450px] sm:h-[550px] lg:h-[650px] w-full flex items-center justify-center mt-10 lg:mt-0">
            {/* Glowing Gradient Orbs in Background */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
                rotate: [0, 90, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] bg-brand-400/30 rounded-full blur-[80px] lg:blur-[100px] z-0"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
                rotate: [0, -90, 0],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/4 right-0 w-[200px] h-[200px] sm:w-[350px] sm:h-[350px] lg:w-[400px] lg:h-[400px] bg-indigo-400/20 rounded-full blur-[60px] lg:blur-[80px] z-0"
            />

            {/* Main Image Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 100,
                duration: 1,
              }}
              className="relative z-10 w-[280px] h-[360px] sm:w-[380px] sm:h-[460px] lg:w-[85%] lg:h-[90%] rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] lg:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-[6px] lg:border-[8px] border-white bg-white"
            >
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2000&auto=format&fit=crop"
                alt="Professional Worker"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
            </motion.div>

            {/* Floating Card 1: Congratulations */}
            <motion.div
              initial={{ opacity: 0, x: -50, y: 20 }}
              animate={{ opacity: 1, x: 0, y: [0, -15, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: 0.5 },
                x: { type: "spring", stiffness: 100, delay: 0.5 },
                y: {
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                  delay: 1,
                },
              }}
              className="absolute top-8 sm:top-16 left-0 sm:-left-8 z-20 bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.1)] border border-white/50 flex items-center gap-3 sm:gap-4 hover:scale-105 transition-transform scale-90 sm:scale-100 origin-top-left"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900">
                  Congratulation! 🎉
                </p>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5">
                  Application Completed
                </p>
              </div>
            </motion.div>

            {/* Floating Card 2: Interactive Stats */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0, y: [0, 15, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: 0.7 },
                x: { type: "spring", stiffness: 100, delay: 0.7 },
                y: {
                  repeat: Infinity,
                  duration: 5,
                  ease: "easeInOut",
                  delay: 1.5,
                },
              }}
              className="absolute top-1/3 right-0 sm:-right-10 z-20 bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.1)] border border-white/50 flex flex-col items-center justify-center min-w-[120px] sm:min-w-[150px] hover:scale-105 transition-transform scale-90 sm:scale-100 origin-right hidden sm:flex"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2 sm:mb-3 shadow-inner">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 fill-indigo-600" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-slate-900">
                10,000+
              </p>
              <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
                Premium Roles
              </p>
            </motion.div>

            {/* Floating Card 3: Mini Profile */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: [0, -10, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: 0.9 },
                y: {
                  repeat: Infinity,
                  duration: 3.5,
                  ease: "easeInOut",
                  delay: 2,
                },
              }}
              className="absolute bottom-10 sm:bottom-16 left-4 sm:-left-4 z-20 bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.1)] border border-white/50 flex items-center gap-3 sm:gap-4 hover:scale-105 transition-transform scale-90 sm:scale-100 origin-bottom-left"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
                  alt="User"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900">
                  Senior Designer
                </p>
                <p className="text-[10px] sm:text-xs text-brand-600 font-bold mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Hired Today
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
