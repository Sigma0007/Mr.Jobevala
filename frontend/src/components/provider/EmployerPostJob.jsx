import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import customerservice from "../../customer/customerservice";

export default function EmployerPostJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
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
    isRemote: false,
    vacancies: 1,
    applicationDeadline: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
          isRemote: formData.isRemote,
        },
        vacancies: Number(formData.vacancies),
        status: "active",
        applicationDeadline: formData.applicationDeadline || null,
      };

      const res = await customerservice.createJob(payload);

      if (res.success) {
        toast.success("Job posted successfully");

        navigate("/provider/jobs");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Post a New Job</h1>

        <p className="text-slate-500 mt-2">
          Find the right candidate for your company.
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

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isRemote"
            checked={formData.isRemote}
            onChange={handleChange}
          />

          <label>This is a remote job</label>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
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
            {loading ? "Posting..." : "Post Job"}
          </button>
        </div>
      </form>
    </div>
  );
}
