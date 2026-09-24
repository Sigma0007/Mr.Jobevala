import { Plus, Trash2 } from "lucide-react";

export default function ExperienceForm({ experience = [], onChange }) {
  const handleAdd = () => {
    const newItem = {
      id: "exp-" + Date.now(),
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: ""
    };
    onChange([...experience, newItem]);
  };

  const handleUpdate = (id, field, value) => {
    const updated = experience.map((item) => {
      if (item.id === id) {
        const next = { ...item, [field]: value };
        if (field === "isCurrent" && value === true) {
          next.endDate = "";
        }
        return next;
      }
      return item;
    });
    onChange(updated);
  };

  const handleRemove = (id) => {
    onChange(experience.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      {experience.map((exp, index) => (
        <div key={exp.id || index} className="repeatable-item-card">
          <div className="repeatable-item-header">
            <span className="repeatable-item-num">
              Experience #{index + 1} {exp.company ? `• ${exp.company}` : ""}
            </span>
            <button
              type="button"
              onClick={() => handleRemove(exp.id)}
              className="btn btn-danger-outline"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove
            </button>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Job Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Senior Software Engineer"
                value={exp.jobTitle || ""}
                onChange={(e) => handleUpdate(exp.id, "jobTitle", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Company / Employer</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Google, Acme Corp"
                value={exp.company || ""}
                onChange={(e) => handleUpdate(exp.id, "company", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. New York, NY / Remote"
                value={exp.location || ""}
                onChange={(e) => handleUpdate(exp.id, "location", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 2021-03 or Mar 2021"
                value={exp.startDate || ""}
                onChange={(e) => handleUpdate(exp.id, "startDate", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 2023-08 or Present"
                disabled={exp.isCurrent}
                value={exp.isCurrent ? "Present" : exp.endDate || ""}
                onChange={(e) => handleUpdate(exp.id, "endDate", e.target.value)}
              />
            </div>
          </div>

          <div className="form-group flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              id={`current-job-${exp.id}`}
              checked={!!exp.isCurrent}
              onChange={(e) => handleUpdate(exp.id, "isCurrent", e.target.checked)}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
            <label htmlFor={`current-job-${exp.id}`} className="text-xs font-medium text-slate-700 cursor-pointer select-none">
              I currently work in this role
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Job Description / Responsibilities</label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="• Architected and developed scalable frontend features...&#10;• Mentored junior engineers and improved team productivity..."
              value={exp.description || ""}
              onChange={(e) => handleUpdate(exp.id, "description", e.target.value)}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="btn-add-item"
      >
        <Plus className="w-4 h-4" /> Add Work Experience
      </button>
    </div>
  );
}
