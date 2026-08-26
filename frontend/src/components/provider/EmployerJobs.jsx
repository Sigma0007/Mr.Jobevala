import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import { Edit, Trash2, Plus, Eye } from "lucide-react";
import customerservice from "../../customer/customerservice";

export default function EmployerJobs() {
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const res = await customerservice.getMyJobs();

      if (res.success) {
        setJobs(res.data);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?",
    );

    if (!confirmDelete) return;

    try {
      const res = await customerservice.deleteJob(id);

      if (res.success) {
        toast.success("Job deleted successfully");

        setJobs((prev) => prev.filter((job) => job._id !== id));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete job");
    }
  };

  const changeStatus = async (id, status) => {
    try {
      const res = await customerservice.updateJobStatus(id, { status });

      if (res.success) {
        toast.success("Job status updated");

        setJobs((prev) =>
          prev.map((job) =>
            job._id === id
              ? {
                  ...job,
                  status,
                }
              : job,
          ),
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) {
    return <div className="p-8">Loading jobs...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Jobs</h1>

          <p className="text-slate-500 mt-1">Manage all your job posts</p>
        </div>

        <Link
          to="/provider/jobs/create"
          className="flex items-center gap-2 bg-brand-600 text-white px-5 py-3 rounded-xl"
        >
          <Plus size={18} />
          Post Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white border rounded-2xl p-10 text-center">
          <h2 className="text-xl font-semibold">No jobs posted yet</h2>

          <p className="text-slate-500 mt-2">
            Start by creating your first job.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white border border-slate-200 rounded-2xl p-6"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold">{job.title}</h2>

                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        job.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <p className="text-slate-500 mt-2">
                    {job.companyName}
                    {" • "}
                    {job.location?.city}
                  </p>

                  <p className="text-sm text-slate-500 mt-3">
                    {job.jobType}
                    {" • "}
                    {job.vacancies} Vacancies
                  </p>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/provider/jobs/${job._id}/edit`}
                    className="p-2 border rounded-lg"
                  >
                    <Edit size={18} />
                  </Link>

                  <button
                    onClick={() => handleDelete(job._id)}
                    className="p-2 border rounded-lg text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                {job.status === "active" ? (
                  <button
                    onClick={() => changeStatus(job._id, "closed")}
                    className="border px-4 py-2 rounded-xl"
                  >
                    Close Job
                  </button>
                ) : (
                  <button
                    onClick={() => changeStatus(job._id, "active")}
                    className="border px-4 py-2 rounded-xl"
                  >
                    Open Job
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
