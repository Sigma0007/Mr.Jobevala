import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import customerservice from "../../customer/customerservice";
import { setJobApplications } from "../../Redux/Job/JobAction";
import toast from "react-hot-toast";
import { statusConfig, workModeType } from "../../Utility/utilites";
import {
  Briefcase,
  MapPin,
  Banknote,
  Users,
  CalendarDays,
  ArrowLeft,
  Mail,
  Phone,
  FileText,
  Loader2,
} from "lucide-react";

const JobApplications = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedJob, jobApplications } = useSelector((state) => state.job);
  const [loading, setLoading] = useState(true);
  const [updatingAppId, setUpdatingAppId] = useState(null);
  const [updatingStatusValue, setUpdatingStatusValue] = useState(null);

  useEffect(() => {
    const fetchJobAndApplications = async () => {
      try {
        setLoading(true);
        const appsRes = await customerservice.getJobApplications(id);
        if (appsRes.success) {
          dispatch(setJobApplications(appsRes.data));
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndApplications();
  }, [id, dispatch]);

  const handleUpdateStatus = async (appId, status) => {
    try {
      setUpdatingAppId(appId);
      setUpdatingStatusValue(status);
      const res = await customerservice.updateApplicationStatus(appId, {
        status,
      });
      if (res.success) {
        toast.success(`Application status updated to ${status}`);
        // update locally
        const updatedApps = jobApplications.map((app) =>
          app._id === appId ? { ...app, status } : app,
        );
        dispatch(setJobApplications(updatedApps));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingAppId(null);
      setUpdatingStatusValue(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-brand-600 font-medium">Loading details...</div>
      </div>
    );
  }

  if (!selectedJob) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-red-500 font-medium">Job not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/provider/dashboard"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>

        {/* Job Details Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {selectedJob.title}
              </h1>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full border ${
                    selectedJob.status === "active"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {selectedJob.status?.charAt(0).toUpperCase() +
                    selectedJob.status?.slice(1)}
                </span>
                <span className="text-sm text-slate-500">
                  Posted on{" "}
                  {new Date(selectedJob.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Location
                </p>
                <p className="font-semibold text-slate-900">
                  {selectedJob.location?.city}
                  {selectedJob.location?.state
                    ? `, ${selectedJob.location.state}`
                    : ""}{" "}
                  (
                  {
                    workModeType.find(
                      (mode) => mode.value === selectedJob.location?.workMode,
                    )?.label
                  }
                  )
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                <Briefcase size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Job Type
                </p>
                <p className="font-semibold text-slate-900 capitalize">
                  {selectedJob.jobType?.replace("-", " ")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                <Banknote size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Salary
                </p>
                <p className="font-semibold text-slate-900">
                  {selectedJob.salary
                    ? `${selectedJob.salary.min.toLocaleString()} - ${selectedJob.salary.max.toLocaleString()} ${selectedJob.salary.currency}`
                    : "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                <Users size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Vacancies
                </p>
                <p className="font-semibold text-slate-900">
                  {selectedJob.vacancies}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3">
              Job Description
            </h3>
            <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
              {selectedJob.description}
            </p>
          </div>

          {selectedJob.skills && selectedJob.skills.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedJob.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Applications Section */}
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Users className="text-brand-600" />
          Applications ({jobApplications?.length || 0})
        </h2>

        {jobApplications && jobApplications.length > 0 ? (
          <div className="grid gap-6">
            {jobApplications.map((app) => (
              <div
                key={app._id}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={
                        app.user?.profilePicture ||
                        `https://ui-avatars.com/api/?name=${app.user?.name}&background=eff6ff&color=2563eb`
                      }
                      alt={app.user?.name}
                      className="w-14 h-14 rounded-2xl object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {app.user?.name}
                      </h3>
                      <div className="flex flex-col gap-1 mt-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-slate-400" />
                          <a
                            href={`mailto:${app.user?.email}`}
                            className="hover:text-brand-600"
                          >
                            {app.user?.email}
                          </a>
                        </div>
                        {app.user?.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-slate-400" />
                            <span>{app.user?.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    {(() => {
                      const currentStatus = (
                        app.status || "pending"
                      ).toLowerCase();
                      const config =
                        statusConfig[currentStatus] || statusConfig.pending;
                      const StatusIcon = config.icon;

                      return (
                        <span
                          className={`px-4 py-1.5 text-sm font-medium rounded-full border flex items-center gap-1.5 ${config.color}`}
                        >
                          {StatusIcon && <StatusIcon size={14} />}
                          {config.name}
                        </span>
                      );
                    })()}
                    <span className="text-xs text-slate-500">
                      Applied: {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Cover Letter */}
                {app.coverLetter && (
                  <div className="mt-5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <FileText size={16} className="text-brand-600" /> Cover
                      Letter
                    </h4>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">
                      {app.coverLetter}
                    </p>
                  </div>
                )}

                {app.resume && (
                  <div className="mt-4">
                    <a
                      href={app.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700"
                    >
                      <FileText size={16} />
                      View Resume
                    </a>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-slate-100 flex gap-3">
                  {Object.keys(statusConfig).map((actionStatus) => {
                    const config = statusConfig[actionStatus];
                    const isUpdatingThis =
                      updatingAppId === app._id &&
                      updatingStatusValue === actionStatus;
                    const isDisabled = updatingAppId === app._id;

                    return (
                      <button
                        key={actionStatus}
                        onClick={() =>
                          handleUpdateStatus(app._id, actionStatus)
                        }
                        disabled={isDisabled}
                        className={`flex-1 flex justify-center items-center gap-2 py-2 ${config.color} hover:opacity-80 font-medium rounded-xl text-sm transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isUpdatingThis ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          config.name
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border rounded-3xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No applications yet
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              You haven't received any applications for this job yet. Check back
              later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplications;
