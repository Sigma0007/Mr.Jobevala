import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Briefcase,
  Star,
  ChevronDown,
  Mail,
  ShieldCheck,
} from "lucide-react";
import customerservice from "../customer/customerservice";
import { workModeType } from "../Utility/utilites";
import CommonFilters from "../components/CommonFilters";

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function FindCandidates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [candidatesData, setCandidatesData] = useState([]);

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [selectedWorkModes, setSelectedWorkModes] = useState([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedSalaryRanges, setSelectedSalaryRanges] = useState([]);

  const handleFilterChange = (setter, value) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedExperience([]);
    setSelectedWorkModes([]);
    setSelectedJobTypes([]);
    setSelectedSalaryRanges([]);
  };

  const fetchCandidates = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append("search", searchTerm);
      if (selectedCategories.length > 0)
        queryParams.append("categories", selectedCategories.join(","));
      if (selectedExperience.length > 0)
        queryParams.append("experience", selectedExperience.join(","));
      if (selectedWorkModes.length > 0)
        queryParams.append("workModes", selectedWorkModes.join(","));
      if (selectedJobTypes.length > 0)
        queryParams.append("jobTypes", selectedJobTypes.join(","));
      if (selectedSalaryRanges.length > 0)
        queryParams.append("salaryRanges", selectedSalaryRanges.join(","));

      const queryString = queryParams.toString()
        ? `?${queryParams.toString()}`
        : "";

      const response = await customerservice.getAllUserProfiles(queryString);
      if (response.success) {
        setCandidatesData(response.data);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCandidates();
    }, 300);
    return () => clearTimeout(timer);
  }, [
    searchTerm,
    selectedCategories,
    selectedExperience,
    selectedWorkModes,
    selectedJobTypes,
    selectedSalaryRanges,
  ]);

  const filteredCandidates = candidatesData;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Premium Hero Section with Photographic Background & Overlap Layout */}
      <div className="relative w-full pt-28 pb-52 overflow-hidden bg-slate-900">
        {/* Unsplash Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2850&q=80")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Premium Blue Gradient Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-blue-900/85 z-0" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/60 via-blue-800/80 to-slate-900/90 z-0" />

        {/* Subtle Background Pattern for texture */}
        <div className="absolute inset-0 z-0 opacity-[0.05] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent bg-[length:24px_24px]" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6"
          >
            Discover Top Talent
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
            className="text-blue-50 text-lg md:text-xl max-w-2xl mx-auto font-medium tracking-wide"
          >
            Connect with pre-vetted professionals ready to elevate your team.
          </motion.p>
        </div>
      </div>

      {/* Main Content Area - Overlaps the Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <CommonFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedExperience={selectedExperience}
            setSelectedExperience={setSelectedExperience}
            selectedWorkModes={selectedWorkModes}
            setSelectedWorkModes={setSelectedWorkModes}
            selectedJobTypes={selectedJobTypes}
            setSelectedJobTypes={setSelectedJobTypes}
            selectedSalaryRanges={selectedSalaryRanges}
            setSelectedSalaryRanges={setSelectedSalaryRanges}
            handleFilterChange={handleFilterChange}
            clearAllFilters={clearAllFilters}
          />

          {/* Right Main Content - Candidate List */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider pl-2">
                <span className="text-blue-600">
                  {filteredCandidates.length}
                </span>{" "}
                Candidates Available
              </h2>
              <div className="flex items-center gap-2 pr-2">
                <span className="text-sm font-medium text-slate-500">
                  Sort by:
                </span>
                <button className="flex items-center gap-1 text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 hover:border-blue-100">
                  Relevance <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-5"
            >
              <AnimatePresence>
                {filteredCandidates.length > 0 ? (
                  filteredCandidates.map((candidate) => (
                    <motion.div
                      key={candidate._id}
                      variants={itemVariants}
                      whileHover={{ y: -2 }}
                      className="group bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-blue-200 transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Avatar & Status */}
                        <div className="flex-shrink-0 flex flex-col items-center gap-4">
                          <div className="relative">
                            <div className="absolute inset-0 rounded-2xl bg-blue-500 blur opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                            <img
                              src={
                                candidate.profileImage ||
                                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces&q=80"
                              }
                              alt={candidate.name}
                              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-sm"
                            />
                            <div className="absolute -bottom-2 -right-2 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-sm">
                              <div
                                className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"
                                title="Available to hire"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 shadow-sm w-full">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            4.9
                          </div>
                        </div>

                        {/* Core Info */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                                    {candidate.name}
                                  </h3>
                                  <ShieldCheck
                                    className="w-5 h-5 text-blue-500"
                                    title="Identity Verified"
                                  />
                                </div>
                                <p className="text-blue-600 font-semibold text-sm sm:text-base mb-4">
                                  {candidate.title}
                                </p>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-3 flex-shrink-0">
                                <motion.button
                                  whileTap={{ scale: 0.97 }}
                                  className="flex-1 sm:flex-none px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                  <Mail className="w-4 h-4" />{" "}
                                  <span className="hidden sm:inline">
                                    Message
                                  </span>
                                </motion.button>
                                <motion.button
                                  whileTap={{ scale: 0.97 }}
                                  className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)]"
                                >
                                  View Profile
                                </motion.button>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-sm text-slate-500 mb-5">
                              <span className="flex items-center gap-1.5 font-medium">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                {candidate.location?.city
                                  ? `${candidate.location.city}, ${candidate.location.state}`
                                  : "Location Not Specified"}
                                <span className="ml-2">
                                  {
                                    workModeType.find(
                                      (mode) =>
                                        mode.value ===
                                        candidate.location?.workMode,
                                    )?.label
                                  }
                                </span>
                              </span>
                              <span className="flex items-center gap-1.5 font-medium">
                                <Briefcase className="w-4 h-4 text-slate-400" />
                                {candidate.experience
                                  ? `${candidate.experience} Years`
                                  : "Fresher"}
                              </span>
                              <span className="flex items-center gap-1.5 font-semibold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60">
                                {candidate.salary?.min
                                  ? `${candidate.salary.currency === "INR" ? "₹" : candidate.salary.currency || "$"}${candidate.salary.min} - ${candidate.salary.max}`
                                  : "Not Disclosed"}
                              </span>
                            </div>
                          </div>

                          {/* Bio & Skills */}
                          <div>
                            <p className="text-slate-600 text-sm leading-relaxed mb-5 max-w-3xl">
                              {candidate.bio || "No bio available."}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {candidate.skills?.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1.5 bg-blue-50/50 text-blue-700 border border-blue-100/50 rounded-lg text-xs font-semibold hover:border-blue-200 hover:bg-blue-50 transition-colors cursor-default"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white p-10 rounded-3xl border border-slate-200/60 text-center flex flex-col items-center"
                  >
                    <Search className="w-12 h-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      No candidates found
                    </h3>
                    <p className="text-slate-500 mb-6">
                      We couldn't find any candidates matching your current
                      filters.
                    </p>
                    <button
                      onClick={clearAllFilters}
                      className="px-5 py-2 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
