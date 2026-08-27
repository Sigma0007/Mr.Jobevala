import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedJob } from "../../Redux/Job/JobAction";

import toast from "react-hot-toast";

import {
  Edit,
  Trash2,
  Plus,
  Eye,
  MapPin,
  Briefcase,
  CalendarDays,
  Banknote,
  Users,
} from "lucide-react";
import customerservice from "../../customer/customerservice";

export default function EmployerJobs({ setActiveTab }) {
  const [jobs, setJobs] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const handleEdit = (job) => {
    dispatch(setSelectedJob(job));
    navigate(`/provider/jobs/${job._id}/edit`);
    setActiveTab("post-job");
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
        <div className="bg-white border rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase size={32} className="text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">
            No jobs posted yet
          </h2>

          <p className="text-slate-500 mt-2 max-w-sm mx-auto">
            You haven't posted any jobs. Start by creating your first job post
            to find great candidates.
          </p>

          <Link
            to="/provider/jobs/create"
            className="inline-flex items-center gap-2 bg-brand-600 text-white px-5 py-3 rounded-xl mt-6 hover:bg-brand-700 transition-colors"
          >
            <Plus size={18} />
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-900">
                      {job.title}
                    </h2>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${
                        job.status === "active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {job.status?.charAt(0).toUpperCase() +
                        job.status?.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-3 gap-x-4 mt-5">
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <MapPin size={16} className="text-slate-400 shrink-0" />
                      <span className="truncate">
                        {job.location?.city}
                        {job.location?.state
                          ? `, ${job.location.state}`
                          : ""}{" "}
                        {job.location?.isRemote && "(Remote)"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <Briefcase
                        size={16}
                        className="text-slate-400 shrink-0"
                      />
                      <span className="capitalize">
                        {job.jobType?.replace("-", " ")}
                      </span>
                      {job.experience &&
                        ` • ${job.experience.min}-${job.experience.max} yrs`}
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <Banknote size={16} className="text-slate-400 shrink-0" />
                      <span className="truncate">
                        {job.salary
                          ? `${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} ${job.salary.currency}`
                          : "Not specified"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <Users size={16} className="text-slate-400 shrink-0" />
                      <span>
                        {job.vacancies}{" "}
                        {job.vacancies === 1 ? "Vacancy" : "Vacancies"}
                      </span>
                    </div>
                  </div>

                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-5">
                      {job.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-lg border border-slate-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-slate-500 text-xs mt-5">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays size={14} className="text-slate-400" />
                      <span>
                        Posted: {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-slate-300">•</span>
                    <div className="flex items-center gap-1.5">
                      <CalendarDays size={14} className="text-slate-400" />
                      <span>
                        Deadline:{" "}
                        {new Date(job.applicationDeadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(job)}
                    className="p-2 border border-slate-200 hover:border-brand-600 hover:text-brand-600 hover:bg-brand-50 transition-colors rounded-xl h-fit text-slate-500"
                    title="Edit Job"
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(job._id)}
                    className="p-2 border border-slate-200 hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-colors rounded-xl text-slate-500 h-fit"
                    title="Delete Job"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {job.status === "active" ? (
                    <button
                      onClick={() => changeStatus(job._id, "closed")}
                      className="border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    >
                      Close Job
                    </button>
                  ) : (
                    <button
                      onClick={() => changeStatus(job._id, "active")}
                      className="border border-brand-600 text-brand-600 hover:bg-brand-50 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    >
                      Reopen Job
                    </button>
                  )}
                </div>

                <Link
                  to={`/provider/jobs/${job._id}/applications`}
                  className="bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-brand-700 transition-colors flex items-center gap-2"
                >
                  <Eye size={16} />
                  View Applications
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
