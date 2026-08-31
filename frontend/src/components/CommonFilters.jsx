import React from "react";
import { motion } from "framer-motion";
import { Search, CheckCircle2 } from "lucide-react";
import { useSelector } from "react-redux";
import {
  EXPERIENCE_LEVELS,
  workModeType,
  jobType,
  SalaryRangeType,
} from "../Utility/utilites";

export default function CommonFilters({
  searchTerm = "",
  setSearchTerm,
  selectedCategories = [],
  setSelectedCategories,
  selectedExperience = [],
  setSelectedExperience,
  selectedWorkModes = [],
  setSelectedWorkModes,
  selectedJobTypes = [],
  setSelectedJobTypes,
  selectedSalaryRanges = [],
  setSelectedSalaryRanges,
  handleFilterChange,
  clearAllFilters,
  categoriesType: propCategoriesType,
  className = "",
}) {
  const reduxCategories = useSelector(
    (state) => state.dashboard?.categoriesType || [],
  );
  const categoriesType = propCategoriesType || reduxCategories;

  const defaultHandleFilterChange = (setter, value) => {
    if (handleFilterChange) {
      handleFilterChange(setter, value);
    } else if (setter) {
      setter((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value],
      );
    }
  };

  const handleClearAll = () => {
    if (clearAllFilters) {
      clearAllFilters();
    } else {
      setSearchTerm?.("");
      setSelectedCategories?.([]);
      setSelectedExperience?.([]);
      setSelectedWorkModes?.([]);
      setSelectedJobTypes?.([]);
      setSelectedSalaryRanges?.([]);
    }
  };

  return (
    <div className={`w-full lg:w-72 flex-shrink-0 ${className}`}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] sticky top-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Filters
          </h2>
          <button
            type="button"
            onClick={handleClearAll}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Search Box */}
        <div className="mb-8">
          <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-3">
            Search
          </label>
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Role or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all duration-200"
            />
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-8" />

        {/* Categories */}
        <div className="mb-8">
          <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-4">
            CATEGORIES
          </label>
          <div className="space-y-3.5">
            {categoriesType.map((cat) => (
              <label
                key={cat.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    selectedCategories.includes(cat.value)
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-300 bg-white group-hover:border-blue-500"
                  }`}
                >
                  <CheckCircle2
                    className={`w-3.5 h-3.5 text-blue-600 transition-opacity ${
                      selectedCategories.includes(cat.value)
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-50"
                    }`}
                  />
                </div>
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                  {cat.title}
                </span>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selectedCategories.includes(cat.value)}
                  onChange={() =>
                    defaultHandleFilterChange(setSelectedCategories, cat.value)
                  }
                />
              </label>
            ))}
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-8" />

        {/* Experience Level */}
        <div className="mb-8">
          <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-4">
            Experience Level
          </label>
          <div className="space-y-3.5">
            {EXPERIENCE_LEVELS.map((exp) => (
              <label
                key={exp.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                    selectedExperience.includes(exp.value)
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-300 bg-white group-hover:border-blue-500"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full bg-blue-600 transition-opacity ${
                      selectedExperience.includes(exp.value)
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-50"
                    }`}
                  />
                </div>
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                  {exp.label}
                </span>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selectedExperience.includes(exp.value)}
                  onChange={() =>
                    defaultHandleFilterChange(setSelectedExperience, exp.value)
                  }
                />
              </label>
            ))}
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-8" />

        {/* Work Mode */}
        <div className="mb-8">
          <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-4">
            Work Mode
          </label>
          <div className="space-y-3.5">
            {workModeType.map((mode) => (
              <label
                key={mode.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    selectedWorkModes.includes(mode.value)
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-300 bg-white group-hover:border-blue-500"
                  }`}
                >
                  <CheckCircle2
                    className={`w-3.5 h-3.5 text-blue-600 transition-opacity ${
                      selectedWorkModes.includes(mode.value)
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-50"
                    }`}
                  />
                </div>
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                  {mode.label}
                </span>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selectedWorkModes.includes(mode.value)}
                  onChange={() =>
                    defaultHandleFilterChange(setSelectedWorkModes, mode.value)
                  }
                />
              </label>
            ))}
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-8" />

        {/* Job Type */}
        <div className="mb-8">
          <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-4">
            Job Type
          </label>
          <div className="space-y-3.5">
            {jobType.map((type) => (
              <label
                key={type.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    selectedJobTypes.includes(type.value)
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-300 bg-white group-hover:border-blue-500"
                  }`}
                >
                  <CheckCircle2
                    className={`w-3.5 h-3.5 text-blue-600 transition-opacity ${
                      selectedJobTypes.includes(type.value)
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-50"
                    }`}
                  />
                </div>
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                  {type.label}
                </span>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selectedJobTypes.includes(type.value)}
                  onChange={() =>
                    defaultHandleFilterChange(setSelectedJobTypes, type.value)
                  }
                />
              </label>
            ))}
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-8" />

        {/* Salary Range */}
        <div>
          <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-4">
            Salary Range
          </label>
          <div className="space-y-3.5">
            {SalaryRangeType.map((range) => (
              <label
                key={range.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                    selectedSalaryRanges.includes(range.value)
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-300 bg-white group-hover:border-blue-500"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full bg-blue-600 transition-opacity ${
                      selectedSalaryRanges.includes(range.value)
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-50"
                    }`}
                  />
                </div>
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                  {range.label}
                </span>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selectedSalaryRanges.includes(range.value)}
                  onChange={() =>
                    defaultHandleFilterChange(
                      setSelectedSalaryRanges,
                      range.value,
                    )
                  }
                />
              </label>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
