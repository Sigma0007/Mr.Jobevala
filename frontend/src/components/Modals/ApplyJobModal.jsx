import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Briefcase, Building2, MapPin, IndianRupee } from "lucide-react";
import toast from "react-hot-toast";

export default function ApplyJobModal({ isOpen, onClose, job, onSubmit }) {
  const [formData, setFormData] = useState({
    coverLetter: "",
    location: "",
    totalExperience: "",
    noticePeriod: "",
    currentCTC: "",
    expectedCTC: "",
    currentCompany: "",
    currentRole: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        const data = {
          ...formData,
          jobId: job._id,
        };
        await onSubmit(data);
      } else {
        toast.success("Application submitted successfully!");
        onClose();
      }
    } catch (error) {
      toast.error("Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !job) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl sm:rounded-[2rem] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-white/20 z-10"
        >
          {/* Modal Header */}
          <div className="shrink-0 p-5 sm:p-8 border-b border-slate-100 bg-slate-50/50 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-white border border-slate-200 text-slate-500 rounded-full hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 relative z-10 pr-8 sm:pr-12">
              <img
                src={
                  job?.companyProfile?.logo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    job?.companyProfile?.companyName || "C",
                  )}&background=random`
                }
                alt="logo"
                className="w-16 h-16 rounded-2xl object-contain p-2 border-2 border-white shadow-md bg-white shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight mb-1 capitalize">
                  Apply for {job?.title}
                </h2>
                <p className="text-sm font-medium text-slate-500 flex items-center gap-2 capitalize">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                  {job?.companyProfile?.companyName || "Company"}
                </p>
              </div>
            </div>
          </div>

          {/* Modal Body / Form */}
          <div className="p-5 sm:p-8 overflow-y-auto custom-scrollbar flex-1">
            <form id="apply-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Current Role */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Current Role{" "}
                    <span className="text-slate-400 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="currentRole"
                      value={formData.currentRole}
                      onChange={handleChange}
                      placeholder="e.g. Software Engineer"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Current Company */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Current Company{" "}
                    <span className="text-slate-400 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="currentCompany"
                      value={formData.currentCompany}
                      onChange={handleChange}
                      placeholder="e.g. Google"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Total Experience */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Total Experience (Years)
                  </label>
                  <input
                    type="number"
                    name="totalExperience"
                    min="0"
                    step="0.1"
                    value={formData.totalExperience}
                    onChange={handleChange}
                    placeholder="e.g. 2.5"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                    required
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Current Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. New York, USA"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Notice Period */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Notice Period
                  </label>
                  <input
                    type="text"
                    name="noticePeriod"
                    value={formData.noticePeriod}
                    onChange={handleChange}
                    placeholder="e.g. 30 Days, Immediate"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                    required
                  />
                </div>

                {/* Current CTC */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Current CTC{" "}
                    <span className="text-slate-400 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="currentCTC"
                    value={formData.currentCTC}
                    onChange={handleChange}
                    placeholder="e.g. 10 LPA or $80,000"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                  />
                </div>

                {/* Expected CTC */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Expected CTC
                  </label>
                  <input
                    type="number"
                    name="expectedCTC"
                    value={formData.expectedCTC}
                    onChange={handleChange}
                    placeholder="e.g. 15 or 100000"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Please provide numerical value matching the company's
                    currency.
                  </p>
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Cover Letter{" "}
                  <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tell us why you are a great fit for this role..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none resize-none"
                ></textarea>
              </div>
            </form>
          </div>

          {/* Modal Footer */}
          <div className="shrink-0 p-4 sm:p-6 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:border-slate-300 hover:bg-slate-50 transition-all text-center text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="apply-form"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-2.5 sm:py-3 bg-brand-600 text-white font-bold rounded-xl shadow-[0_4px_20px_0_rgb(37,99,235,0.3)] hover:bg-brand-700 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all text-center text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          </div>
        </motion.div>
      </div>
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
    </AnimatePresence>
  );
}
