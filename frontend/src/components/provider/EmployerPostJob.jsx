import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import customerservice from "../../customer/customerservice";
import { clearSelectedJob } from "../../Redux/Job/JobAction";
import { workModeType } from "../../Utility/utilites";

export default function EmployerPostJob() {
  const { categoriesType } = useSelector((state) => state.dashboard);
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const selectedJob = useSelector((state) => state.job?.selectedJob);
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditMode);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    skills: "",
    jobType: "full-time",
    experienceMin: "",
    experienceMax: "",
    salaryMin: "",
    salaryMax: "",
    city: "",
    state: "",
    country: "India",
    workMode: "on-site",
    vacancies: 1,
    applicationDeadline: "",
  });

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
          skills: jobToEdit.skills ? jobToEdit.skills.join(", ") : "",
          jobType: jobToEdit.jobType || "full-time",
          experienceMin: jobToEdit.experience?.min || "",
          experienceMax: jobToEdit.experience?.max || "",
          salaryMin: jobToEdit.salary?.min || "",
          salaryMax: jobToEdit.salary?.max || "",
          city: jobToEdit.location?.city || "",
          state: jobToEdit.location?.state || "",
          country: jobToEdit.location?.country || "India",
          workMode: jobToEdit.location?.workMode || "on-site",
          vacancies: jobToEdit.vacancies || 1,
          applicationDeadline: jobToEdit.applicationDeadline
            ? jobToEdit.applicationDeadline.split("T")[0]
            : "",
          category: jobToEdit.category || "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        title: formData.title,
        description: formData.description,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),

        jobType: formData.jobType,
        experience: {
          min: Number(formData.experienceMin),
          max: Number(formData.experienceMax),
        },
        salary: {
          min: Number(formData.salaryMin),
          max: Number(formData.salaryMax),
          currency: "INR",
        },
        location: {
          city: formData.city,
          state: formData.state,
          country: formData.country,
          workMode: formData.workMode,
        },
        vacancies: Number(formData.vacancies),
        status: "active",
        applicationDeadline: formData.applicationDeadline || null,
        category: formData.category,
      };

      if (isEditMode) {
        const res = await customerservice.updateJob(id, payload);
        if (res.success) {
          toast.success("Job updated successfully");
        }
      } else {
        const res = await customerservice.createJob(payload);
        if (res.success) {
          toast.success("Job posted successfully");
          setFormData({
            title: "",
            description: "",
            skills: "",
            jobType: "full-time",
            experienceMin: "",
            experienceMax: "",
            salaryMin: "",
            salaryMax: "",
            city: "",
            state: "",
            country: "India",
            workMode: "on-site",
            vacancies: 1,
            applicationDeadline: "",
            category: "",
          });
        }
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} job`,
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <div className="p-8">Loading job details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          {isEditMode ? "Edit Job" : "Post a New Job"}
        </h1>

        <p className="text-slate-500 mt-2">
          {isEditMode
            ? "Update your job details below."
            : "Find the right candidate for your company."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6"
      >
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-2">Job Title</label>

            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="React Developer"
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>
          <div>
            <label className="block mb-2">Category Type</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            >
              {categoriesType.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-2">Job Description</label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="6"
            placeholder="Write job description..."
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block mb-2">Skills</label>

          <input
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="React, Node.js, MongoDB"
            className="w-full border rounded-xl px-4 py-3"
          />

          <p className="text-sm text-slate-400 mt-1">
            Separate skills using comma.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <label className="block mb-2">Job Type</label>

            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            >
              <option value="full-time">Full Time</option>

              <option value="part-time">Part Time</option>

              <option value="contract">Contract</option>

              <option value="internship">Internship</option>

              <option value="freelance">Freelance</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Min Experience</label>

            <input
              type="number"
              name="experienceMin"
              value={formData.experienceMin}
              onChange={handleChange}
              placeholder="1"
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2">Max Experience</label>

            <input
              type="number"
              name="experienceMax"
              value={formData.experienceMax}
              onChange={handleChange}
              placeholder="3"
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-2">Minimum Salary</label>

            <input
              type="number"
              name="salaryMin"
              value={formData.salaryMin}
              onChange={handleChange}
              placeholder="300000"
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2">Maximum Salary</label>

            <input
              type="number"
              name="salaryMax"
              value={formData.salaryMax}
              onChange={handleChange}
              placeholder="600000"
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-2">City</label>

            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="Rajkot"
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2">State</label>

            <input
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Gujarat"
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <label className="block mb-2">Work Mode</label>

            <select
              name="workMode"
              value={formData.workMode}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            >
              {workModeType.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Vacancies</label>

            <input
              type="number"
              name="vacancies"
              min="1"
              value={formData.vacancies}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2">Application Deadline</label>

            <input
              type="date"
              name="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-brand-600 text-white rounded-xl"
          >
            {loading
              ? isEditMode
                ? "Updating..."
                : "Posting..."
              : isEditMode
                ? "Update Job"
                : "Post Job"}
          </button>
        </div>
      </form>
    </div>
  );
}
