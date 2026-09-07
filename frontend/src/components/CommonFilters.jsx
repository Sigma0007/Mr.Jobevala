import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle2, ChevronDown } from "lucide-react";
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

  const [openSections, setOpenSections] = useState({
    search: false,
    categories: false,
    experience: false,
    workMode: false,
    jobType: false,
    salary: false,
  });

  const toggleSection = (sectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

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

  const totalActiveFilters =
    (searchTerm.trim() ? 1 : 0) +
    selectedCategories.length +
    selectedExperience.length +
    selectedWorkModes.length +
    selectedJobTypes.length +
    selectedSalaryRanges.length;

  const renderSectionHeader = (title, count, isOpen, onToggle) => (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between py-1 group text-left focus:outline-none select-none"
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold tracking-wider text-slate-400 group-hover:text-slate-600 uppercase transition-colors">
          {title}
        </span>
        {count > 0 && (
          <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200/80 rounded-full">
            {count}
          </span>
        )}
      </div>
      <ChevronDown
        className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>
  );

  return (
    <div className={`w-full lg:w-72 flex-shrink-0 ${className}`}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] sticky top-8"
      >
        {/* Main Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Filters
            </h2>
            {totalActiveFilters > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold bg-blue-600 text-white rounded-full">
                {totalActiveFilters}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleClearAll}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Search Box */}
        <div className="mb-6">
          {renderSectionHeader(
            "Search",
            searchTerm.trim() ? 1 : 0,
            openSections.search,
            () => toggleSection("search"),
          )}
          <AnimatePresence initial={false}>
            {openSections.search && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pt-3"
              >
                <div className="relative group">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Role or keyword..."
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm && setSearchTerm(e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all duration-200"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-6" />

        {/* Categories */}
        <div className="mb-6">
          {renderSectionHeader(
            "CATEGORIES",
            selectedCategories.length,
            openSections.categories,
            () => toggleSection("categories"),
          )}
          <AnimatePresence initial={false}>
            {openSections.categories && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pt-3"
              >
                <div className="space-y-3.5 max-h-48 overflow-y-auto pr-1.5 focus:outline-none">
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
                        {cat.label || cat.title}
                      </span>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedCategories.includes(cat.value)}
                        onChange={() =>
                          defaultHandleFilterChange(
                            setSelectedCategories,
                            cat.value,
                          )
                        }
                      />
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-6" />

        {/* Experience Level */}
        <div className="mb-6">
          {renderSectionHeader(
            "Experience Level",
            selectedExperience.length,
            openSections.experience,
            () => toggleSection("experience"),
          )}
          <AnimatePresence initial={false}>
            {openSections.experience && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pt-3"
              >
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
                          defaultHandleFilterChange(
                            setSelectedExperience,
                            exp.value,
                          )
                        }
                      />
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-6" />

        {/* Work Mode */}
        <div className="mb-6">
          {renderSectionHeader(
            "Work Mode",
            selectedWorkModes.length,
            openSections.workMode,
            () => toggleSection("workMode"),
          )}
          <AnimatePresence initial={false}>
            {openSections.workMode && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pt-3"
              >
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
                          defaultHandleFilterChange(
                            setSelectedWorkModes,
                            mode.value,
                          )
                        }
                      />
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-6" />

        {/* Job Type */}
        <div className="mb-6">
          {renderSectionHeader(
            "Job Type",
            selectedJobTypes.length,
            openSections.jobType,
            () => toggleSection("jobType"),
          )}
          <AnimatePresence initial={false}>
            {openSections.jobType && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pt-3"
              >
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
                          defaultHandleFilterChange(
                            setSelectedJobTypes,
                            type.value,
                          )
                        }
                      />
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-6" />

        {/* Salary Range */}
        <div>
          {renderSectionHeader(
            "Salary Range",
            selectedSalaryRanges.length,
            openSections.salary,
            () => toggleSection("salary"),
          )}
          <AnimatePresence initial={false}>
            {openSections.salary && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pt-3"
              >
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
