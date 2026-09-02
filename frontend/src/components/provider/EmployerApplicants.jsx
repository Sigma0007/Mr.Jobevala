import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Loader2 } from "lucide-react";
import customerservice from "../../customer/customerservice";
import toast from "react-hot-toast";
import { statusConfig } from "../../Utility/utilites";
import CandidateDetailsModal from "../Modals/CandidateDetailsModal";

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

      {/* Candidate Details Modal */}
      <CandidateDetailsModal
        applicant={selectedApplicant}
        onClose={() => setSelectedApplicant(null)}
        onStatusChange={handleStatusChange}
        updatingStatus={updatingStatus}
      />
    </div>
  );
}
