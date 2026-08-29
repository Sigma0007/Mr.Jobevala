import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Search,
  Filter,
  X,
  Download,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";
import customerservice from "../../customer/customerservice";
import toast from "react-hot-toast";
import { statusConfig } from "../../Utility/utilites";

export default function EmployerApplicants() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [applicantsData, setApplicantsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const filteredApplicants = applicantsData.filter((app) => {
    const nameMatch = app.userProfile?.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const roleMatch = app.job?.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return nameMatch || roleMatch;
  });

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingStatus(newStatus);
    try {
      const response = await customerservice.updateApplicationStatus(id, {
        status: newStatus,
      });
      if (response.success) {
        toast.success("Application status updated successfully");
        setApplicantsData((prev) =>
          prev.map((app) =>
            app._id === id ? { ...app, status: newStatus } : app,
          ),
        );
        if (selectedApplicant && selectedApplicant._id === id) {
          setSelectedApplicant({ ...selectedApplicant, status: newStatus });
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      toast.error("Error updating application status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  useEffect(() => {
    async function loadApplicants() {
      try {
        setLoading(true);
        const response = await customerservice.getProviderApplications();
        if (response.success) {
          setApplicantsData(response.data);
        } else {
          setError(response.message || "Failed to load applications");
        }
      } catch (err) {
        console.error(err);
        setError("Error loading applications");
      } finally {
        setLoading(false);
      }
    }
    loadApplicants();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Applicants Management
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Review, manage, and track candidate progress.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all w-full md:w-64"
              />
            </div>
            <button className="p-2.5 text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Applicant List Grid */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
            <p className="text-slate-500">Loading applicants...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          filteredApplicants.map((applicant) => {
            const statusKey = (applicant.status || "pending").toLowerCase();
            const StatusIcon =
              statusConfig[statusKey]?.icon || statusConfig.pending.icon;
            const StatusText =
              statusConfig[statusKey]?.name || applicant.status;
            return (
              <motion.div
                key={applicant._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedApplicant(applicant)}
                className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-brand-100 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      applicant.userProfile?.profileImage ||
                      "https://via.placeholder.com/150"
                    }
                    alt={applicant.userProfile?.name || "Applicant"}
                    className="w-14 h-14 rounded-full object-cover border border-slate-100"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {applicant.userProfile?.name || "Unknown Applicant"}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                      <span className="font-medium text-slate-700">
                        {applicant.job?.title || "Unknown Role"}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span>
                        Applied{" "}
                        {new Date(applicant.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 md:ml-auto">
                  <span
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                      statusConfig[statusKey]?.color ||
                      statusConfig.pending.color
                    }`}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    {StatusText}
                  </span>
                  <button className="text-brand-600 font-medium text-sm hover:text-brand-700 px-4 py-2 bg-brand-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                    View Profile
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
        {!loading && filteredApplicants.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
            <p className="text-slate-500">
              No applicants found matching your search.
            </p>
          </div>
        )}
      </div>

      {/* Advanced Profile Modal */}
      <AnimatePresence>
        {selectedApplicant && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApplicant(null)}
              className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-3xl shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex-shrink-0 border-b border-slate-100 bg-white px-8 py-6 flex items-start justify-between sticky top-0 z-10">
                <div className="flex items-center gap-5">
                  <img
                    src={
                      selectedApplicant.userProfile?.profileImage ||
                      "https://via.placeholder.com/150"
                    }
                    alt={selectedApplicant.userProfile?.name || "Applicant"}
                    className="w-20 h-20 rounded-full object-cover border-4 border-slate-50 shadow-sm"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {selectedApplicant.userProfile?.name ||
                        "Unknown Applicant"}
                    </h2>
                    <p className="text-brand-600 font-medium mt-1">
                      {selectedApplicant.job?.title || "Unknown Role"}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />{" "}
                        {selectedApplicant.location || "Not specified"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> Applied{" "}
                        {new Date(
                          selectedApplicant.createdAt,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column (Details) */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* About Section */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                      <h3 className="text-base font-bold text-slate-900 mb-3">
                        Cover Letter / Summary
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-sm">
                        {selectedApplicant.coverLetter ||
                          "No cover letter provided."}
                      </p>
                    </div>

                    {/* Experience & Education */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
                          <Briefcase className="w-5 h-5 text-brand-600" />
                          Experience Level
                        </h3>
                        <p className="text-slate-700 font-medium text-sm pl-7">
                          {selectedApplicant.userProfile?.experience ||
                            selectedApplicant.totalExperience ||
                            "0"}{" "}
                          total experience
                        </p>
                      </div>
                      <div className="w-full h-px bg-slate-100"></div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
                          <GraduationCap className="w-5 h-5 text-brand-600" />
                          Education Background
                        </h3>
                        <p className="text-slate-700 font-medium text-sm pl-7">
                          {selectedApplicant.userProfile?.education ||
                            "Not specified"}
                        </p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                      <h3 className="text-base font-bold text-slate-900 mb-4">
                        Top Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedApplicant.userProfile?.skills?.map(
                          (skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg text-sm font-medium border border-slate-100"
                            >
                              {skill}
                            </span>
                          ),
                        ) || (
                          <span className="text-sm text-slate-500">
                            No skills listed.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column (Actions & Contact) */}
                  <div className="space-y-6">
                    {/* Action Card */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                        Update Status
                      </h3>
                      <div className="space-y-2">
                        {Object.keys(statusConfig).map((status) => (
                          <button
                            key={status}
                            disabled={updatingStatus !== null}
                            onClick={() =>
                              handleStatusChange(selectedApplicant._id, status)
                            }
                            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                              (
                                selectedApplicant.status || "pending"
                              ).toLowerCase() === status
                                ? "bg-slate-900 text-white shadow-md"
                                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                            } ${updatingStatus !== null ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            {statusConfig[status].name}
                            {updatingStatus === status ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              (
                                selectedApplicant.status || "pending"
                              ).toLowerCase() === status && (
                                <CheckCircle2 className="w-4 h-4" />
                              )
                            )}
                          </button>
                        ))}
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100">
                        {selectedApplicant.userProfile?.resume ? (
                          <a
                            href={selectedApplicant.userProfile?.resume}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full flex items-center justify-center gap-2 bg-brand-50 text-brand-600 hover:bg-brand-100 hover:text-brand-700 px-4 py-3 rounded-xl text-sm font-bold transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Download Resume
                          </a>
                        ) : (
                          <button
                            disabled
                            className="w-full flex items-center justify-center gap-2 bg-slate-50 text-slate-400 px-4 py-3 rounded-xl text-sm font-bold cursor-not-allowed"
                          >
                            <Download className="w-4 h-4" />
                            No Resume Available
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Contact Info Card */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                        Contact Info
                      </h3>
                      <a
                        href={`mailto:${selectedApplicant.user?.email}`}
                        className="flex items-center gap-3 text-sm text-slate-600 hover:text-brand-600 transition-colors group"
                      >
                        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-brand-50 transition-colors">
                          <Mail className="w-4 h-4" />
                        </div>
                        {selectedApplicant.user?.email || "No Email"}
                      </a>
                      <a
                        href={`tel:${selectedApplicant.userProfile?.phone}`}
                        className="flex items-center gap-3 text-sm text-slate-600 hover:text-brand-600 transition-colors group"
                      >
                        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-brand-50 transition-colors">
                          <Phone className="w-4 h-4" />
                        </div>
                        {selectedApplicant.userProfile?.phone || "No Phone"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
