import React, { useState, useEffect } from "react";
import api from '../../customer/customerservice';
import { Trash2, ExternalLink, Eye, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminJobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

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
                        onClick={() => setSelectedJob(job)}
                        className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Job Details"
                      >
                        <Eye size={18} />
                      </button>
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

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden my-8">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-900">Job Details</h2>
              <button 
                onClick={() => setSelectedJob(null)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div>
                <p className="text-sm font-medium text-slate-500">Job Title</p>
                <p className="text-xl font-semibold text-slate-900 mt-1">{selectedJob.title}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Company</p>
                  <p className="text-base text-slate-900">{selectedJob.companyProfile?.companyName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Posted By</p>
                  <p className="text-base text-slate-900">{selectedJob.provider?.name || "N/A"} ({selectedJob.provider?.email})</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Job Type</p>
                  <p className="text-base text-slate-900 capitalize">{selectedJob.jobType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Location</p>
                  <p className="text-base text-slate-900">
                    {selectedJob.location?.city}{selectedJob.location?.state ? `, ${selectedJob.location.state}` : ''}
                    {selectedJob.location?.isRemote && ' (Remote)'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Salary Range</p>
                  <p className="text-base text-slate-900">
                    {selectedJob.salary?.min} - {selectedJob.salary?.max} {selectedJob.salary?.currency}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Vacancies</p>
                  <p className="text-base text-slate-900">{selectedJob.vacancies}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Status</p>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    selectedJob.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                    selectedJob.status === 'closed' ? 'bg-red-100 text-red-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                      {selectedJob.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Posted On</p>
                  <p className="text-base text-slate-900">{new Date(selectedJob.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500 mb-2">Description</p>
                <div className="bg-slate-50 p-4 rounded-xl text-slate-700 whitespace-pre-wrap text-sm">
                  {selectedJob.description}
                </div>
              </div>

              {selectedJob.skills && selectedJob.skills.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setSelectedJob(null)}
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobsList;
