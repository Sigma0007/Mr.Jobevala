import { User, Briefcase, Mail, Phone, MapPin, Globe, Image } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";

export default function PersonalForm({ data, onChange, errors = {} }) {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange("photo", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Profile Photo Upload */}
      <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
        {data.photo ? (
          <img
            src={data.photo}
            alt="Profile Preview"
            className="w-16 h-16 rounded-full object-cover border-2 border-brand-500 shadow-sm"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 border border-slate-300">
            <User className="w-8 h-8" />
          </div>
        )}
        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Profile Photo (Optional)
          </label>
          <div className="flex items-center gap-2">
            <label className="btn btn-secondary cursor-pointer text-xs py-1.5 px-3">
              <Image className="w-3.5 h-3.5 mr-1 inline" /> Choose Image
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
            {data.photo && (
              <button
                type="button"
                onClick={() => handleChange("photo", "")}
                className="text-xs text-red-500 hover:underline cursor-pointer"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="form-row-2">
        <div className="form-group">
          <label className="form-label">
            Full Name <span className="required">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              className={`form-input ${errors.fullName ? "error" : ""}`}
              placeholder="e.g. Alex Morgan"
              value={data.fullName || ""}
              onChange={(e) => handleChange("fullName", e.target.value)}
            />
          </div>
          {errors.fullName && (
            <p className="form-error-text">{errors.fullName}</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Professional Title <span className="required">*</span>
          </label>
          <input
            type="text"
            className={`form-input ${errors.jobTitle ? "error" : ""}`}
            placeholder="e.g. Senior Software Engineer"
            value={data.jobTitle || ""}
            onChange={(e) => handleChange("jobTitle", e.target.value)}
          />
          {errors.jobTitle && (
            <p className="form-error-text">{errors.jobTitle}</p>
          )}
        </div>
      </div>

      <div className="form-row-2">
        <div className="form-group">
          <label className="form-label">
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            className={`form-input ${errors.email ? "error" : ""}`}
            placeholder="alex@example.com"
            value={data.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          {errors.email && (
            <p className="form-error-text">{errors.email}</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Phone <span className="required">*</span>
          </label>
          <input
            type="tel"
            className={`form-input ${errors.phone ? "error" : ""}`}
            placeholder="+1 (555) 000-0000"
            value={data.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
          {errors.phone && (
            <p className="form-error-text">{errors.phone}</p>
          )}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Location</label>
        <input
          type="text"
          className="form-input"
          placeholder="City, State / Country (e.g. San Francisco, CA)"
          value={data.location || ""}
          onChange={(e) => handleChange("location", e.target.value)}
        />
      </div>

      <div className="form-row-3">
        <div className="form-group">
          <label className="form-label">Website / Portfolio</label>
          <input
            type="url"
            className="form-input"
            placeholder="https://yourportfolio.com"
            value={data.website || ""}
            onChange={(e) => handleChange("website", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">LinkedIn</label>
          <input
            type="text"
            className="form-input"
            placeholder="linkedin.com/in/username"
            value={data.linkedin || ""}
            onChange={(e) => handleChange("linkedin", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">GitHub</label>
          <input
            type="text"
            className="form-input"
            placeholder="github.com/username"
            value={data.github || ""}
            onChange={(e) => handleChange("github", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
