import React, { useState, useEffect } from "react";
import api from "../../customer/customerservice";
import { Trash2, ExternalLink } from "lucide-react";
import { toast } from "react-hot-toast";

const AdminJobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const response = await api.getAdminJobs();
      const data = response;

      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this job? All related applications will also be removed.",
      )
    )
      return;

    try {
      const response = await api.deleteAdminJob(id);
      const data = response.data;

      if (data.success) {
        toast.success(data.message);
        setJobs(jobs.filter((job) => job._id !== id));
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error(error.response?.data?.message || "Failed to delete job.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-slate-500 animate-pulse">
        Loading jobs...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-sm font-medium text-slate-500">
              <th className="py-4 px-6">Job Title</th>
              <th className="py-4 px-6">Company</th>
              <th className="py-4 px-6">Posted By</th>
              <th className="py-4 px-6">Posted On</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-500">
                  No jobs found.
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr
                  key={job._id}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-4 px-6 font-medium text-slate-900">
                    {job.title}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {job.companyProfile?.companyName || "N/A"}
                  </td>
                  <td className="py-4 px-6 text-slate-600 text-sm">
                    {job.provider?.name || "N/A"}
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-sm">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Job"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminJobsList;
