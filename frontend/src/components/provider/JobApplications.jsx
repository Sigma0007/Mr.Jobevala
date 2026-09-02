import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import customerservice from "../../customer/customerservice";
import { setJobApplications, setSelectedJob } from "../../Redux/Job/JobAction";
import toast from "react-hot-toast";
import {
  statusConfig,
  workModeType,
  jobType,
  qualificationTypes,
  genderPreferenceTypes,
  jobShiftTypes,
  JOB_ROLES_CATEGORY_TYPE,
} from "../../Utility/utilites";
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
  GraduationCap,
  Clock,
  UserCheck,
  Tag,
  Building,
  Edit3,
  Sparkles,
} from "lucide-react";

const JobApplications = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedJob, jobApplications } = useSelector((state) => state.job);
  const { categoriesType } = useSelector((state) => state.dashboard);
  const [loading, setLoading] = useState(true);
  const [updatingAppId, setUpdatingAppId] = useState(null);
  const [updatingStatusValue, setUpdatingStatusValue] = useState(null);

  useEffect(() => {
    const fetchJobAndApplications = async () => {
      try {
        setLoading(true);
        const promises = [customerservice.getJobApplications(id)];
        if (!selectedJob || selectedJob._id !== id) {
          promises.push(customerservice.getMyJobById(id));
        }

        const [appsRes, jobRes] = await Promise.all(promises);

        if (appsRes?.success) {
          dispatch(setJobApplications(appsRes.data));
        }
        if (jobRes?.success && jobRes.data) {
          dispatch(setSelectedJob(jobRes.data));
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
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        <div className="text-slate-600 font-medium text-sm">Loading details...</div>
      </div>
    );
  }

  if (!selectedJob) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center gap-4">
        <div className="text-red-500 font-medium">Job not found.</div>
        <Link
          to="/provider/dashboard"
          className="inline-flex items-center gap-2 text-brand-600 hover:underline text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const allCategories = categoriesType?.length ? categoriesType : JOB_ROLES_CATEGORY_TYPE;
  const currentCategory = allCategories.find((c) => c.value === selectedJob.category);
  const categoryLabel =
    currentCategory?.label ||
    selectedJob.category?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const currentSubCategory = currentCategory?.roles?.find(
    (r) => r.value === selectedJob.subCategory,
  );
  const subCategoryLabel =
    currentSubCategory?.label ||
    selectedJob.subCategory?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const formatSalary = (salary) => {
    if (!salary) return "Not specified";
    const curr = salary.currency === "INR" ? "₹" : salary.currency || "₹";
    const min = salary.min;
    const max = salary.max;

    if (min === 0 && max === 0) return "Unpaid / Negotiable";
    if (min !== undefined && max !== undefined && max > 0) {
      return `${curr}${min.toLocaleString()} - ${curr}${max.toLocaleString()}`;
    }
    if (max !== undefined && max > 0) {
      return `Up to ${curr}${max.toLocaleString()}`;
    }
    if (min !== undefined && min > 0) {
      return `From ${curr}${min.toLocaleString()}`;
    }
    return "Not specified";
  };

  const formatExperience = (exp) => {
    if (!exp) return "Not specified";
    if (exp.min === 0 && (exp.max === 0 || exp.max === undefined)) return "Fresher (0 yrs)";
    if (exp.min !== undefined && exp.max !== undefined && exp.max > 0) {
      return `${exp.min} - ${exp.max} Years`;
    }
    if (exp.min !== undefined) return `${exp.min}+ Years`;
    return "Not specified";
  };

  const qualificationLabel =
    qualificationTypes.find((q) => q.value === selectedJob.qualification)?.label ||
    selectedJob.qualification ||
    "Not specified";

  const genderLabel =
    genderPreferenceTypes.find((g) => g.value === selectedJob.genderPreference)?.label ||
    selectedJob.genderPreference ||
    "Any";

  const shiftLabel =
    jobShiftTypes.find((s) => s.value === selectedJob.jobShift)?.label ||
    selectedJob.jobShift ||
    "Day";

  const workModeLabel =
    workModeType.find((w) => w.value === selectedJob.location?.workMode)?.label ||
    selectedJob.location?.workMode ||
    "On-site";

  const jobTypeLabel =
    jobType.find((j) => j.value === selectedJob.jobType)?.label ||
    selectedJob.jobType?.replace("-", " ") ||
    "Full-time";

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation / Actions Bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            to="/provider/dashboard"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors font-medium text-sm"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <Link
            to={`/provider/jobs/${selectedJob._id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-brand-600 hover:border-brand-300 rounded-xl text-sm font-medium transition-all shadow-sm"
          >
            <Edit3 size={15} />
            Edit Job
          </Link>
        </div>

        {/* Complete Job Details Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
          {/* Header Info */}
          <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-4 pb-6 border-b border-slate-100">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                    selectedJob.status === "active"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {selectedJob.status?.toUpperCase()}
                </span>

                {categoryLabel && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 border border-brand-200/60 rounded-full text-xs font-semibold">
                    <Tag size={12} />
                    {categoryLabel}
                  </span>
                )}

                {subCategoryLabel && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded-full text-xs font-semibold">
                    <Sparkles size={12} />
                    {subCategoryLabel}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 capitalize tracking-tight">
                {selectedJob.title}
              </h1>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                <span>
                  Posted on:{" "}
                  <strong className="text-slate-700 font-medium">
                    {new Date(selectedJob.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </strong>
                </span>
                {selectedJob.applicationDeadline && (
                  <span>
                    • Deadline:{" "}
                    <strong className="text-slate-700 font-medium">
                      {new Date(selectedJob.applicationDeadline).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </strong>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Key Job Specifications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-6 border-b border-slate-100">
            {/* Experience */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Briefcase size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Experience
                </p>
                <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                  {formatExperience(selectedJob.experience)}
                </p>
              </div>
            </div>

            {/* Salary */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <Banknote size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Salary
                </p>
                <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                  {formatSalary(selectedJob.salary)}
                </p>
              </div>
            </div>

            {/* Job Type & Work Mode */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 shrink-0">
                <Building size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Job Type / Mode
                </p>
                <p className="font-semibold text-slate-900 text-sm sm:text-base capitalize truncate">
                  {jobTypeLabel} • {workModeLabel}
                </p>
              </div>
            </div>

            {/* Vacancies */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                <Users size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Vacancies
                </p>
                <p className="font-semibold text-slate-900 text-sm sm:text-base">
                  {selectedJob.vacancies || 1} {selectedJob.vacancies === 1 ? "Opening" : "Openings"}
                </p>
              </div>
            </div>

            {/* Minimum Qualification & Education */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                <GraduationCap size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Qualification
                </p>
                <p className="font-semibold text-slate-900 text-sm sm:text-base capitalize truncate">
                  {qualificationLabel}
                </p>
                {selectedJob.education && (
                  <p className="text-xs text-slate-500 truncate" title={selectedJob.education}>
                    {selectedJob.education}
                  </p>
                )}
              </div>
            </div>

            {/* Gender Preference */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                <UserCheck size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Gender Preference
                </p>
                <p className="font-semibold text-slate-900 text-sm sm:text-base capitalize">
                  {genderLabel}
                </p>
              </div>
            </div>

            {/* Shift & Timings */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                <Clock size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Shift & Timings
                </p>
                <p className="font-semibold text-slate-900 text-sm sm:text-base capitalize">
                  {shiftLabel} Shift
                </p>
                {selectedJob.jobTimings && (
                  <p className="text-xs text-slate-500">{selectedJob.jobTimings}</p>
                )}
              </div>
            </div>

            {/* Deadline */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 shrink-0">
                <CalendarDays size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Application Deadline
                </p>
                <p className="font-semibold text-slate-900 text-sm sm:text-base">
                  {selectedJob.applicationDeadline
                    ? new Date(selectedJob.applicationDeadline).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "No deadline"}
                </p>
              </div>
            </div>
          </div>

          {/* Location Details Card */}
          {selectedJob.location && (
            <div className="py-5 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                <MapPin size={16} className="text-brand-600" />
                Location Details
              </h3>
              <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium">City / State / Country</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">
                    {[
                      selectedJob.location.city,
                      selectedJob.location.state,
                      selectedJob.location.country,
                    ]
                      .filter(Boolean)
                      .join(", ") || "Not specified"}
                  </p>
                </div>

                {selectedJob.location.talukaOrVillage && (
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Taluka / Village</p>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">
                      {selectedJob.location.talukaOrVillage}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-slate-500 font-medium">Work Mode</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5 capitalize">
                    {workModeLabel}
                  </p>
                </div>

                {selectedJob.location.address && (
                  <div className="md:col-span-3 pt-2 border-t border-slate-200/60">
                    <p className="text-xs text-slate-500 font-medium">Full Workplace Address</p>
                    <p className="text-sm text-slate-800 mt-0.5">
                      {selectedJob.location.address}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Job Description */}
          <div className="pt-5">
            <h3 className="text-base font-bold text-slate-900 mb-2.5">
              Job Description
            </h3>
            <p className="text-slate-600 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
              {selectedJob.description}
            </p>
          </div>

          {/* Required Skills */}
          {selectedJob.skills && selectedJob.skills.length > 0 && (
            <div className="mt-6 pt-5 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedJob.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs sm:text-sm font-medium rounded-xl border border-slate-200 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Applications Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Users className="text-brand-600" />
            Received Applications ({jobApplications?.length || 0})
          </h2>
        </div>

        {jobApplications && jobApplications.length > 0 ? (
          <div className="grid gap-6">
            {jobApplications.map((app) => {
              const profile = app.userProfile || {};
              const candidateName = profile.name || app.user?.name || "Applicant";
              const candidateEmail = app.user?.email || profile.email;
              const candidatePhone = profile.phone || app.user?.phone;
              const candidateImage =
                profile.profileImage ||
                app.user?.profilePicture ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(candidateName)}&background=eff6ff&color=2563eb`;

              const resumeLink = app.resume || profile.resume;

              return (
                <div
                  key={app._id}
                  className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={candidateImage}
                        alt={candidateName}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-slate-900">
                            {candidateName}
                          </h3>
                          {profile.title && (
                            <span className="text-xs bg-slate-100 text-slate-600 font-medium px-2.5 py-0.5 rounded-md">
                              {profile.title}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-sm text-slate-600">
                          {candidateEmail && (
                            <div className="flex items-center gap-1.5">
                              <Mail size={14} className="text-slate-400" />
                              <a
                                href={`mailto:${candidateEmail}`}
                                className="hover:text-brand-600"
                              >
                                {candidateEmail}
                              </a>
                            </div>
                          )}
                          {candidatePhone && (
                            <div className="flex items-center gap-1.5">
                              <Phone size={14} className="text-slate-400" />
                              <span>{candidatePhone}</span>
                            </div>
                          )}
                        </div>

                        {/* Application Extra Details */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 text-xs text-slate-500">
                          {app.totalExperience !== undefined && (
                            <span>Experience: <strong className="text-slate-700">{app.totalExperience} yrs</strong></span>
                          )}
                          {app.currentRole && (
                            <span>Current Role: <strong className="text-slate-700">{app.currentRole}</strong></span>
                          )}
                          {app.currentCompany && (
                            <span>Company: <strong className="text-slate-700">{app.currentCompany}</strong></span>
                          )}
                          {app.noticePeriod && (
                            <span>Notice: <strong className="text-slate-700">{app.noticePeriod}</strong></span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end gap-3">
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
                        Applied on: {new Date(app.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  {app.coverLetter && (
                    <div className="mt-5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <h4 className="text-sm font-semibold text-slate-900 mb-1.5 flex items-center gap-2">
                        <FileText size={16} className="text-brand-600" /> Cover Letter
                      </h4>
                      <p className="text-sm text-slate-600 whitespace-pre-wrap">
                        {app.coverLetter}
                      </p>
                    </div>
                  )}

                  {/* Resume Link */}
                  {resumeLink && (
                    <div className="mt-4">
                      <a
                        href={resumeLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline"
                      >
                        <FileText size={16} />
                        View Attached Resume
                      </a>
                    </div>
                  )}

                  {/* Status Action Buttons */}
                  <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap gap-2.5">
                    {Object.keys(statusConfig).map((actionStatus) => {
                      const config = statusConfig[actionStatus];
                      const isUpdatingThis =
                        updatingAppId === app._id &&
                        updatingStatusValue === actionStatus;
                      const isDisabled = updatingAppId === app._id;
                      const isCurrentStatus = (app.status || "pending").toLowerCase() === actionStatus;

                      return (
                        <button
                          key={actionStatus}
                          onClick={() =>
                            handleUpdateStatus(app._id, actionStatus)
                          }
                          disabled={isDisabled}
                          className={`flex-1 min-w-[110px] flex justify-center items-center gap-1.5 py-2 px-3 ${
                            isCurrentStatus
                              ? `${config.color} ring-2 ring-brand-500/20 font-bold shadow-sm`
                              : `${config.color} opacity-80 hover:opacity-100 font-medium`
                          } rounded-xl text-xs sm:text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {isUpdatingThis ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            config.name
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border rounded-3xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No applications yet
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto text-sm">
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
