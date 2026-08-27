import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Briefcase,
  Filter,
  X,
  DollarSign,
  Clock,
  CheckCircle,
  Building2,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import customerservice from "../customer/customerservice";

const timeAgo = (dateString) => {
  if (!dateString) return "";
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

export default function FindJobs() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedModes, setSelectedModes] = useState([]);
  const [salaryRange, setSalaryRange] = useState("Any");
  const [sortBy, setSortBy] = useState("newest");
  const [jobsData, setJobsData] = useState([]);

  const filteredJobs = useMemo(() => {
    let result = jobsData.filter((job) => {
      const matchesSearch =
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.companyProfileId?.companyName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const locationString =
        `${job.location?.city || ""} ${job.location?.state || ""} ${job.location?.country || ""}`.toLowerCase();
      const matchesLocation =
        locationString.includes(locationQuery.toLowerCase()) ||
        (locationQuery.toLowerCase() === "remote" && job.location?.isRemote);

      const matchesType =
        selectedTypes.length === 0 ||
        selectedTypes.some(
          (type) => type.toLowerCase() === job.jobType?.toLowerCase(),
        );

      const mode = job.location?.isRemote ? "Remote" : "On-site";
      const matchesMode =
        selectedModes.length === 0 || selectedModes.includes(mode);

      let matchesSalary = true;
      const salaryMin = job.salary?.min || 0;
      if (salaryRange === "₹30k - ₹60k") {
        matchesSalary = salaryMin >= 30000 && salaryMin <= 60000;
      } else if (salaryRange === "₹60k - ₹100k") {
        matchesSalary = salaryMin > 60000 && salaryMin <= 100000;
      } else if (salaryRange === "₹100k+") {
        matchesSalary = salaryMin > 100000;
      }

      return (
        matchesSearch &&
        matchesLocation &&
        matchesType &&
        matchesMode &&
        matchesSalary
      );
    });

    if (sortBy === "highest") {
      result.sort((a, b) => (b.salary?.min || 0) - (a.salary?.min || 0));
    } else if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [
    jobsData,
    searchQuery,
    locationQuery,
    selectedTypes,
    selectedModes,
    salaryRange,
    sortBy,
  ]);

  const toggleArrayItem = (array, setArray, item) => {
    if (array.includes(item)) {
      setArray(array.filter((i) => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 1, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  useEffect(() => {
    const fetchJobs = async () => {
      const response = await customerservice.getAllJobs();
      if (response.success) {
        setJobsData(response.data);
      }
      console.log("response", response);
    };
    fetchJobs();
  }, []);

  console.log("filteredJobs", filteredJobs);

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-16 bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Find your next <span className="text-blue-600">premium role</span>
          </h1>
          <p className="mt-2 text-slate-500 text-base md:text-lg">
            Discover top-tier opportunities at the world's most innovative
            companies.
          </p>
        </div>

        {/* Search Header Container */}
        <div className="bg-white p-3 md:p-4 rounded-[2rem] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row gap-3 mb-8 lg:mb-12 transition-all">
          <div className="flex-1 flex items-center gap-3 px-5 py-3.5 bg-slate-50/50 rounded-2xl border border-transparent focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Job title, keywords, or company..."
              className="w-full bg-transparent border-none focus:outline-none text-base text-slate-900 placeholder-slate-400"
            />
          </div>
          <div className="flex-1 flex items-center gap-3 px-5 py-3.5 bg-slate-50/50 rounded-2xl border border-transparent focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
            <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="City, state, or 'Remote'"
              className="w-full bg-transparent border-none focus:outline-none text-base text-slate-900 placeholder-slate-400"
            />
          </div>
          <button className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl text-base font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2">
            Search Jobs
          </button>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="w-full flex items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-slate-200/60 shadow-sm font-medium text-slate-700"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              <span>Advanced Filters</span>
            </div>
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-300 ${
                isMobileFilterOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {(isMobileFilterOpen ||
              (typeof window !== "undefined" && window.innerWidth >= 1024)) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="w-full lg:w-72 flex-shrink-0 overflow-hidden lg:overflow-visible"
              >
                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-8">
                  <div className="hidden lg:flex items-center gap-2 mb-8 pb-5 border-b border-slate-100">
                    <Filter className="w-5 h-5 text-blue-600" />
                    <h2 className="font-bold text-slate-900 text-lg tracking-tight">
                      Filters
                    </h2>
                  </div>

                  <div className="space-y-8">
                    {/* Job Type Filter */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                        Job Type
                      </h3>
                      <div className="space-y-3">
                        {[
                          "Full-Time",
                          "Part-Time",
                          "Contract",
                          "Freelance",
                        ].map((type) => (
                          <label
                            key={type}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <div className="relative flex items-center justify-center">
                              <input
                                type="checkbox"
                                checked={selectedTypes.includes(type)}
                                onChange={() =>
                                  toggleArrayItem(
                                    selectedTypes,
                                    setSelectedTypes,
                                    type,
                                  )
                                }
                                className="peer appearance-none w-5 h-5 rounded-md border-2 border-slate-300 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer focus:ring-4 focus:ring-blue-500/20 outline-none"
                              />
                              <CheckCircle className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                            </div>
                            <span className="text-[15px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                              {type}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Work Mode Filter */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                        Work Mode
                      </h3>
                      <div className="space-y-3">
                        {["On-site", "Remote", "Hybrid"].map((mode) => (
                          <label
                            key={mode}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <div className="relative flex items-center justify-center">
                              <input
                                type="checkbox"
                                checked={selectedModes.includes(mode)}
                                onChange={() =>
                                  toggleArrayItem(
                                    selectedModes,
                                    setSelectedModes,
                                    mode,
                                  )
                                }
                                className="peer appearance-none w-5 h-5 rounded-md border-2 border-slate-300 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer focus:ring-4 focus:ring-blue-500/20 outline-none"
                              />
                              <CheckCircle className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                            </div>
                            <span className="text-[15px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                              {mode}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Salary Filter */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                        Salary Range
                      </h3>
                      <div className="relative">
                        <select
                          value={salaryRange}
                          onChange={(e) => setSalaryRange(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 hover:border-slate-200 rounded-xl text-[15px] font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer text-slate-700 appearance-none"
                        >
                          <option>Any Salary</option>
                          <option>₹30k - ₹60k</option>
                          <option>₹60k - ₹100k</option>
                          <option>₹100k+</option>
                        </select>
                        <ChevronDown className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Job Listings Area */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* List Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-slate-600 font-medium text-[15px]">
                Showing{" "}
                <span className="font-bold text-slate-900">
                  {filteredJobs.length}
                </span>{" "}
                premium jobs
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer appearance-none shadow-sm transition-all"
                  >
                    <option value="relevant">Most Relevant</option>
                    <option value="newest">Newest</option>
                    <option value="highest">Highest Paid</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Job Grid / List */}
            {filteredJobs.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-4 md:space-y-5"
              >
                {filteredJobs.map((job) => (
                  <motion.div
                    variants={itemVariants}
                    key={job._id}
                    onClick={() => setSelectedJob(job)}
                    className="bg-white p-5 md:p-6 rounded-[1.5rem] border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-blue-200 transition-all cursor-pointer group flex flex-col sm:flex-row gap-5 md:gap-6 relative overflow-hidden"
                  >
                    {/* Hover indicator strip */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 opacity-1 group-hover:opacity-100 transition-opacity" />

                    <img
                      src={
                        job.companyProfileId?.logo ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(job.companyProfileId?.companyName || "C")}&background=random`
                      }
                      alt={job.companyProfileId?.companyName}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-contain p-2 md:p-3 border border-slate-100 shadow-sm shrink-0 bg-white"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-1">
                        <div>
                          <h3 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors capitalize">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-slate-500">
                            <Building2 className="w-4 h-4 shrink-0" />
                            <p className="text-sm md:text-[15px] font-medium capitalize">
                              {job.companyProfileId?.companyName}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-4 text-xs md:text-[13px] font-medium text-slate-600">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg capitalize">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />{" "}
                          {job.location?.city}
                          {job.location?.state ? `, ${job.location.state}` : ""}
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/50 text-blue-700 border border-blue-100/50 rounded-lg">
                          <DollarSign className="w-3.5 h-3.5 text-blue-500 shrink-0" />{" "}
                          {job.salary?.currency === "INR" ? "₹" : "$"}
                          {job.salary?.min?.toLocaleString()} -{" "}
                          {job.salary?.max?.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg capitalize">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />{" "}
                          {job.jobType}
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg">
                          {job.location?.isRemote ? "Remote" : "On-site"}
                        </span>

                        <span className="flex items-center gap-1.5 text-slate-400 ml-auto pt-2 md:pt-0">
                          <Clock className="w-3.5 h-3.5 shrink-0" />{" "}
                          {timeAgo(job.createdAt)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-[2rem] border border-slate-200/60 border-dashed"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  No exact matches found
                </h3>
                <p className="text-slate-500 max-w-md mx-auto text-sm md:text-base">
                  We couldn't find any premium roles matching your exact
                  filters. Try broadening your search or adjusting the criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setLocationQuery("");
                    setSelectedTypes([]);
                    setSelectedModes([]);
                    setSalaryRange("Any");
                  }}
                  className="mt-6 text-blue-600 font-semibold hover:text-blue-700 hover:underline"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
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
                    src={
                      selectedJob.companyProfileId?.logo ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedJob.companyProfileId?.companyName || "C")}&background=random`
                    }
                    alt="logo"
                    className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-[1.25rem] object-contain p-2 sm:p-3 border-2 border-white shadow-md bg-white shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-1 sm:mb-2 capitalize">
                      {selectedJob.title}
                    </h2>
                    <p className="text-sm sm:text-lg font-medium text-slate-500 flex items-center gap-2 capitalize">
                      <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
                      {selectedJob.companyProfileId?.companyName}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 sm:mt-4 text-xs sm:text-[14px] font-medium text-slate-600">
                      <span className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 bg-white border border-slate-200 rounded-md shadow-sm capitalize">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 shrink-0" />{" "}
                        {selectedJob.location?.city}
                        {selectedJob.location?.state
                          ? `, ${selectedJob.location.state}`
                          : ""}
                      </span>
                      <span className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 bg-white border border-slate-200 rounded-md shadow-sm">
                        <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" />{" "}
                        {selectedJob.salary?.currency === "INR" ? "₹" : "$"}
                        {selectedJob.salary?.min?.toLocaleString()} -{" "}
                        {selectedJob.salary?.max?.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 bg-white border border-slate-200 rounded-md shadow-sm">
                        {selectedJob.location?.isRemote ? "Remote" : "On-site"}
                      </span>
                      <span className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 bg-white border border-slate-200 rounded-md shadow-sm capitalize">
                        <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 shrink-0" />{" "}
                        {selectedJob.jobType}
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
                    Requirements & Skills
                  </h3>
                  <ul className="space-y-3 sm:space-y-4">
                    {selectedJob.skills?.map((skill, i) => (
                      <RequirementItem key={i} text={skill} />
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
    </div>
  );
}
