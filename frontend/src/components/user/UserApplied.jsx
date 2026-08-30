import { motion } from "framer-motion";
import {
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Users,
} from "lucide-react";
import customerservice from "../../customer/customerservice";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserApplied() {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 text-xs font-semibold rounded-full">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
      case "reviewed":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full">
            <CheckCircle className="w-3.5 h-3.5" /> Reviewed
          </span>
        );
      case "shortlisted":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-600 text-xs font-semibold rounded-full">
            <CheckCircle className="w-3.5 h-3.5" /> Shortlisted
          </span>
        );
      case "interview":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
            <Users className="w-3.5 h-3.5" /> Interview
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      case "hired":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full">
            <CheckCircle className="w-3.5 h-3.5" /> Hired
          </span>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    setIsLoading(true);
    try {
      const response = await customerservice.getMyApplications();
      if (response.success) {
        setAppliedJobs(response.data);
      } else {
        toast.error("Failed to load applied jobs");
      }
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
      toast.error("An error occurred while fetching applied jobs");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
    >
      <div className="mb-8">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Application History
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Track the status of your active and past job applications.
        </p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <p className="text-slate-500 text-sm">Loading applications...</p>
        ) : appliedJobs.length === 0 ? (
          <p className="text-slate-500 text-sm">No applications found.</p>
        ) : (
          appliedJobs.map((app) => (
            <div
              key={app._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-slate-100 rounded-2xl hover:border-brand-100 transition-colors bg-white"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    app.job?.companyProfile?.logo ||
                    "https://images.unsplash.com/photo-1549924293-3b909efef92d?w=150&q=80"
                  }
                  alt={app.job?.companyProfile?.companyName || "Company Logo"}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {app.job?.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />{" "}
                      {app.job?.companyProfile?.companyName ||
                        "Unknown Company"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Applied:{" "}
                      {new Date(app.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center justify-end">
                {getStatusBadge(app.status)}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
