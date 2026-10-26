import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  Sparkles,
  Crown,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  CreditCard,
  Plus,
} from "lucide-react";
import customerservice from "../../customer/customerservice";
import { clearSelectedJob } from "../../Redux/Job/JobAction";
import ExtraPostModal from "../Modals/ExtraPostModal";
import {
  workModeType,
  qualificationTypes,
  genderPreferenceTypes,
  jobShiftTypes,
} from "../../Utility/utilites";

export default function EmployerPostJob() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const selectedJob = useSelector((state) => state.job?.selectedJob);
  const { categoriesType } = useSelector((state) => state.dashboard);
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditMode);
  const [locationHierarchy, setLocationHierarchy] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [subLoading, setSubLoading] = useState(true);
  const [isExtraModalOpen, setIsExtraModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subCategory: "",
    skills: "",
    jobType: "full-time",
    qualification: "",
    education: "",
    genderPreference: "any",
    jobTimings: "",
    jobShift: "day",
    experienceMin: "",
    experienceMax: "",
    salaryMin: "",
    salaryMax: "",
    city: "",
    state: "",
    country: "India",
    talukaOrVillage: "",
    address: "",
    workMode: "on-site",
    vacancies: 1,
    applicationDeadline: "",
  });

  const fetchSubscription = async () => {
    try {
      setSubLoading(true);
      const res = await customerservice.getCurrentSubscription();
      if (res?.success) {
        setSubscription(res.activeSubscription || res.data || null);
      }
    } catch (err) {
      console.warn("Error fetching current subscription:", err);
    } finally {
      setSubLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  useEffect(() => {
    const fetchJobData = async () => {
      let jobToEdit = selectedJob;

      // If no job in Redux but we have an ID (e.g. page refresh), fetch it
      if (isEditMode && !jobToEdit) {
        try {
          const res = await customerservice.getMyJobById(id);
          if (res.success) {
            jobToEdit = res.data;
          } else {
            throw new Error("Job not found");
          }
        } catch (error) {
          toast.error("Failed to load job details.");
          return;
        }
      }

      if (jobToEdit) {
        setFormData({
          title: jobToEdit.title || "",
          description: jobToEdit.description || "",
          category: jobToEdit.category || "",
          subCategory: jobToEdit.subCategory || "",
          skills: jobToEdit.skills ? jobToEdit.skills.join(", ") : "",
          jobType: jobToEdit.jobType || "full-time",
          qualification: jobToEdit.qualification || "",
          education: jobToEdit.education || "",
          genderPreference: jobToEdit.genderPreference || "any",
          jobTimings: jobToEdit.jobTimings || "",
          jobShift: jobToEdit.jobShift || "day",
          experienceMin: jobToEdit.experience?.min ?? "",
          experienceMax: jobToEdit.experience?.max ?? "",
          salaryMin: jobToEdit.salary?.min ?? "",
          salaryMax: jobToEdit.salary?.max ?? "",
          city: jobToEdit.location?.city || "",
          state: jobToEdit.location?.state || "",
          country: jobToEdit.location?.country || "India",
          talukaOrVillage: jobToEdit.location?.talukaOrVillage || "",
          address: jobToEdit.location?.address || "",
          workMode: jobToEdit.location?.workMode || "on-site",
          vacancies: jobToEdit.vacancies || 1,
          applicationDeadline: jobToEdit.applicationDeadline
            ? jobToEdit.applicationDeadline.split("T")[0]
            : "",
        });
      }
      setPageLoading(false);
    };

    fetchJobData();

    return () => {
      if (isEditMode) {
        dispatch(clearSelectedJob());
      }
    };
  }, [id, isEditMode, selectedJob, navigate, dispatch]);

  useEffect(() => {
    const fetchLocationHierarchy = async () => {
      try {
        setLocationsLoading(true);
        const res = await customerservice.getLocationsHierarchy();
        if (res?.success && Array.isArray(res?.data)) {
          setLocationHierarchy(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch location hierarchy:", err);
      } finally {
        setLocationsLoading(false);
      }
    };

    fetchLocationHierarchy();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setFormData((prev) => ({
      ...prev,
      state: selectedState,
      city: "",
      talukaOrVillage: "",
    }));
  };

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setFormData((prev) => ({
      ...prev,
      city: selectedDistrict,
      talukaOrVillage: "",
    }));
  };

  const handleSubDivisionChange = (e) => {
    const selectedSubDiv = e.target.value;
    setFormData((prev) => ({
      ...prev,
      talukaOrVillage: selectedSubDiv,
    }));
  };

  const selectedStateObj = locationHierarchy.find(
    (item) => item.state_name?.toLowerCase() === formData.state?.toLowerCase(),
  );
  const availableDistricts = selectedStateObj?.districts || [];

  const selectedDistrictObj = availableDistricts.find(
    (item) =>
      item.district_name?.toLowerCase() === formData.city?.toLowerCase(),
  );
  const availableSubDivisions = selectedDistrictObj?.subDivisions || [];

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const categoryObj = categoriesType.find(
      (c) => c.value === selectedCategory,
    );
    const isSubCatValid = categoryObj?.roles?.some(
      (r) => r.value === formData.subCategory,
    );

    setFormData((prev) => ({
      ...prev,
      category: selectedCategory,
      subCategory: isSubCatValid ? prev.subCategory : "",
    }));
  };

  const handleSubCategoryChange = (e) => {
    const selectedSubCategory = e.target.value;
    const parentCategory = categoriesType.find((c) =>
      c.roles?.some((r) => r.value === selectedSubCategory),
    );

    setFormData((prev) => ({
      ...prev,
      subCategory: selectedSubCategory,
      category: parentCategory ? parentCategory.value : prev.category,
    }));
  };

  const selectedCategoryObj = categoriesType.find(
    (cat) => cat.value === formData.category,
  );

  const buildJobPayload = () => {
    return {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      subCategory: formData.subCategory,
      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      jobType: formData.jobType,
      qualification: formData.qualification,
      education: formData.education,
      genderPreference: formData.genderPreference,
      jobTimings: formData.jobTimings,
      jobShift: formData.jobShift,
      experience: {
        min: Number(formData.experienceMin) || 0,
        max: Number(formData.experienceMax) || 0,
      },
      salary: {
        min: Number(formData.salaryMin) || 0,
        max: Number(formData.salaryMax) || 0,
        currency: "INR",
      },
      location: {
        city: formData.city || "rajkot",
        state: formData.state || "gujrat",
        country: formData.country || "india",
        talukaOrVillage: formData.talukaOrVillage,
        address: formData.address,
        workMode: formData.workMode,
      },
      vacancies: Number(formData.vacancies) || 1,
      status: "active",
      applicationDeadline: formData.applicationDeadline || null,
    };
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      subCategory: "",
      skills: "",
      jobType: "full-time",
      qualification: "",
      education: "",
      genderPreference: "any",
      jobTimings: "",
      jobShift: "day",
      experienceMin: "",
      experienceMax: "",
      salaryMin: "",
      salaryMax: "",
      city: "",
      state: "",
      country: "India",
      talukaOrVillage: "",
      address: "",
      workMode: "on-site",
      vacancies: 1,
      applicationDeadline: "",
    });
  };

  const submitJobData = async () => {
    try {
      setLoading(true);
      const payload = buildJobPayload();
      const res = await customerservice.createJob(payload);
      if (res.success) {
        toast.success("Job posted successfully 🎉");
        fetchSubscription();
        resetForm();
        navigate("/provider/dashboard");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create job";
      toast.error(errorMsg);
      if (error?.response?.data?.quotaExhausted) {
        setIsExtraModalOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExtraPostSuccess = async (updatedSub) => {
    if (updatedSub) {
      setSubscription(updatedSub);
    } else {
      await fetchSubscription();
    }
    // Now trigger job creation
    // await submitJobData();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.title.trim()) {
      toast.error("Please enter a Job Title");
      return;
    }

    if (!formData.description || !formData.description.trim()) {
      toast.error("Please enter a Job Description");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a Category Type");
      return;
    }

    if (!formData.qualification) {
      toast.error("Please select a Minimum Qualification");
      return;
    }

    // if (!formData.state) {
    //   toast.error("Please select a State");
    //   return;
    // }

    // if (!formData.city) {
    //   toast.error("Please select a District / City");
    //   return;
    // }

    // If quota exhausted on new job post, prompt for extra post payment modal!
    if (!isEditMode && isQuotaExhausted) {
      setIsExtraModalOpen(true);
      return;
    }

    if (isEditMode) {
      try {
        setLoading(true);
        const payload = buildJobPayload();
        const res = await customerservice.updateJob(id, payload);
        if (res.success) {
          toast.success("Job updated successfully");
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to update job",
        );
      } finally {
        setLoading(false);
      }
    } else {
      await submitJobData();
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
        <span className="ml-3 text-slate-600 font-medium">
          Loading job details...
        </span>
      </div>
    );
  }

  const hasActiveSub = subscription && subscription.status === "active";
  const jobLimit = subscription?.jobPostsLimit || 0;
  const jobUsed = subscription?.jobPostsUsed || 0;
  const jobRemaining = Math.max(0, jobLimit - jobUsed);
  const isQuotaExhausted = hasActiveSub && jobLimit > 0 && jobUsed >= jobLimit;
  const extraJobPostPrice =
    subscription?.planDetails?.extraJobPostPrice ??
    subscription?.plan?.extraJobPostPrice ??
    99;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {isEditMode ? "Edit Job" : "Post a New Job"}
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            {isEditMode
              ? "Update your job details below."
              : "Find the right candidate for your company."}
          </p>
        </div>

        {!isEditMode && !subLoading && (
          <div className="flex items-center gap-2">
            {hasActiveSub ? (
              <div className="flex flex-wrap items-center gap-2">
                <div
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold ${
                    isQuotaExhausted
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span>
                    Quota:{" "}
                    <strong>
                      {jobUsed} / {jobLimit > 0 ? jobLimit : "∞"}
                    </strong>{" "}
                    used (
                    {jobLimit > 0 ? `${jobRemaining} remaining` : "Unlimited"})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsExtraModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-brand-600" />
                  <span>Buy Extra Job (₹{extraJobPostPrice})</span>
                </button>
              </div>
            ) : (
              <Link
                to="/pricing"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
              >
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <span>Subscription Required</span>
                <ArrowRight className="w-3 h-3 ml-0.5" />
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Subscription Alerts for New Job Posts */}
      {!isEditMode && !subLoading && (
        <>
          {!hasActiveSub ? (
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-amber-900">
                    Active Subscription Plan Required
                  </h4>
                  <p className="text-xs text-amber-700 mt-0.5">
                    You need an active employer plan to publish new job listings
                    on the platform.
                  </p>
                </div>
              </div>
              <Link
                to="/pricing"
                className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-xs font-semibold rounded-xl hover:shadow-md transition-all whitespace-nowrap flex items-center gap-1.5"
              >
                <Crown className="w-3.5 h-3.5" />
                View Employer Plans
              </Link>
            </div>
          ) : isQuotaExhausted ? (
            <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-rose-50 to-orange-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                  <CreditCard className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">
                      Job Post Quota Reached ({jobUsed}/{jobLimit})
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-800">
                      Pay-per-post available
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    You have used all jobs included in your plan (
                    <strong>
                      {subscription.planDetails?.name || "Active Plan"}
                    </strong>
                    ). Pay <strong>₹{extraJobPostPrice}</strong> to publish this
                    extra job right away without changing your monthly plan!
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsExtraModalOpen(true)}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-brand-600 to-teal-600 text-white text-xs font-bold rounded-xl hover:shadow-md transition-all whitespace-nowrap flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Pay ₹{extraJobPostPrice} Extra Post
                </button>
                <Link
                  to="/pricing"
                  className="px-3 py-2.5 bg-white text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all whitespace-nowrap"
                >
                  View Plans
                </Link>
              </div>
            </div>
          ) : null}
        </>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm"
      >
        {/* Job Title */}
        <div>
          <label className="block mb-2 font-medium text-slate-700">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g. Senior React Developer"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        {/* Category Type & Sub-category Type */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Category Type <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleCategoryChange}
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="">Select Category Type</option>
              {categoriesType.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label || cat.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Sub-category Type
            </label>
            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleSubCategoryChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="">Select Sub-category Type</option>
              {selectedCategoryObj
                ? (selectedCategoryObj.roles || []).map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))
                : categoriesType.map((cat) => (
                    <optgroup key={cat.value} label={cat.label || cat.title}>
                      {(cat.roles || []).map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
            </select>
            <p className="text-xs text-slate-400 mt-1">
              Selecting a sub-category will automatically select its Category
              Type.
            </p>
          </div>
        </div>

        {/* Job Description */}
        <div>
          <label className="block mb-2 font-medium text-slate-700">
            Job Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="6"
            placeholder="Write job description, responsibilities, and requirements..."
            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block mb-2 font-medium text-slate-700">
            Skills
          </label>
          <input
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="React, Node.js, MongoDB, TypeScript"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
          <p className="text-xs text-slate-400 mt-1">
            Separate skills using comma (e.g. React, Node.js, MongoDB).
          </p>
        </div>

        {/* Minimum Qualification & Education */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Minimum Qualification <span className="text-red-500">*</span>
            </label>
            <select
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="">Select Qualification</option>
              {qualificationTypes.map((q) => (
                <option key={q.value} value={q.value}>
                  {q.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Education / Degree
            </label>
            <input
              name="education"
              value={formData.education}
              onChange={handleChange}
              placeholder="e.g. B.Tech / B.E, BCA, B.Sc Computer Science"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Gender Preference, Job Shift, Job Timings */}
        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Gender Preference <span className="text-red-500">*</span>
            </label>
            <select
              name="genderPreference"
              value={formData.genderPreference}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              {genderPreferenceTypes.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Job Shift <span className="text-red-500">*</span>
            </label>
            <select
              name="jobShift"
              value={formData.jobShift}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              {jobShiftTypes.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Job Timings
            </label>
            <input
              name="jobTimings"
              value={formData.jobTimings}
              onChange={handleChange}
              placeholder="e.g. 9:00 AM - 6:00 PM"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Job Type & Work Mode */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Job Type <span className="text-red-500">*</span>
            </label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Work Mode
            </label>
            <select
              name="workMode"
              value={formData.workMode}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              {workModeType.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Experience & Salary */}
        <div className="grid md:grid-cols-4 gap-5">
          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Min Experience (Yrs)
            </label>
            <input
              type="number"
              min="0"
              name="experienceMin"
              value={formData.experienceMin}
              onChange={handleChange}
              placeholder="0"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Max Experience (Yrs)
            </label>
            <input
              type="number"
              min="0"
              name="experienceMax"
              value={formData.experienceMax}
              onChange={handleChange}
              placeholder="3"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Min Salary (₹)
            </label>
            <input
              type="number"
              min="0"
              name="salaryMin"
              value={formData.salaryMin}
              onChange={handleChange}
              placeholder="300000"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Max Salary (₹)
            </label>
            <input
              type="number"
              min="0"
              name="salaryMax"
              value={formData.salaryMax}
              onChange={handleChange}
              placeholder="600000"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Location Section */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Location Details
            </h2>
            {locationsLoading && (
              <span className="text-xs text-brand-600 font-medium animate-pulse">
                Loading locations...
              </span>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block mb-2 font-medium text-slate-700">
                State <span className="text-red-500">*</span>
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleStateChange}
                disabled={locationsLoading}
                // required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="">
                  {locationsLoading ? "Loading States..." : "Select State"}
                </option>
                {locationHierarchy.map((st) => (
                  <option key={st.state_code || st._id} value={st.state_name}>
                    {st.state_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium text-slate-700">
                District / City <span className="text-red-500">*</span>
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleDistrictChange}
                disabled={!formData.state || availableDistricts.length === 0}
                // required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="">
                  {!formData.state
                    ? "Select State First"
                    : availableDistricts.length === 0
                      ? "No Districts Available"
                      : "Select District / City"}
                </option>
                {availableDistricts.map((dist) => (
                  <option
                    key={dist.district_code || dist._id}
                    value={dist.district_name}
                  >
                    {dist.district_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block mb-2 font-medium text-slate-700">
                Job Location (Taluka / Sub-Division / Village)
              </label>
              <select
                name="talukaOrVillage"
                value={formData.talukaOrVillage}
                onChange={handleSubDivisionChange}
                disabled={!formData.city || availableSubDivisions.length === 0}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="">
                  {!formData.city
                    ? "Select District First"
                    : availableSubDivisions.length === 0
                      ? "No Sub-Divisions Available"
                      : "Select Taluka / Sub-Division"}
                </option>
                {availableSubDivisions.map((sub) => (
                  <option
                    key={sub.sub_division_code || sub._id}
                    value={sub.sub_division_name}
                  >
                    {sub.sub_division_name}
                  </option>
                ))}
              </select>
            </div>

            {/* <div>
              <label className="block mb-2 font-medium text-slate-700">
                Country
              </label>
              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g. India"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div> */}
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Job Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              placeholder="Enter complete office/workplace address..."
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Vacancies & Deadline */}
        <div className="grid md:grid-cols-2 gap-5 border-t border-slate-100 pt-5">
          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Vacancies
            </label>
            <input
              type="number"
              name="vacancies"
              min="1"
              value={formData.vacancies}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-slate-700">
              Application Deadline
            </label>
            <input
              type="date"
              name="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading || (!hasActiveSub && !isEditMode)}
            className={`px-8 py-3.5 font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
              isQuotaExhausted && !isEditMode
                ? "bg-gradient-to-r from-brand-600 via-teal-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white shadow-brand-500/25 hover:scale-[1.01] active:scale-[0.99]"
                : "bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white"
            }`}
          >
            {loading ? (
              isEditMode ? (
                "Updating..."
              ) : (
                "Posting..."
              )
            ) : isQuotaExhausted && !isEditMode ? (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Pay ₹{extraJobPostPrice} & Post Job</span>
              </>
            ) : isEditMode ? (
              "Update Job"
            ) : (
              "Post Job"
            )}
          </button>
        </div>
      </form>

      {/* Extra Post Pay Modal */}
      <ExtraPostModal
        isOpen={isExtraModalOpen}
        onClose={() => setIsExtraModalOpen(false)}
        actionType="job_post"
        subscription={subscription}
        onSuccess={handleExtraPostSuccess}
      />
    </div>
  );
}
