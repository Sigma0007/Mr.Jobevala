import { Plus, Trash2 } from "lucide-react";

export default function EducationForm({ education = [], onChange }) {
  const handleAdd = () => {
    const newItem = {
      id: "edu-" + Date.now(),
      institution: "",
      degree: "",
      fieldOfStudy: "",
      location: "",
      startDate: "",
      endDate: "",
      description: ""
    };
    onChange([...education, newItem]);
  };

  const handleUpdate = (id, field, value) => {
    const updated = education.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  const handleRemove = (id) => {
    onChange(education.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      {education.map((edu, index) => (
        <div key={edu.id || index} className="repeatable-item-card">
          <div className="repeatable-item-header">
            <span className="repeatable-item-num">
              Education #{index + 1} {edu.institution ? `• ${edu.institution}` : ""}
            </span>
            <button
              type="button"
              onClick={() => handleRemove(edu.id)}
              className="btn btn-danger-outline"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove
            </button>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">School / Institution</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Stanford University"
                value={edu.institution || ""}
                onChange={(e) => handleUpdate(edu.id, "institution", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Degree</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Bachelor of Science, Master"
                value={edu.degree || ""}
                onChange={(e) => handleUpdate(edu.id, "degree", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">Field of Study</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Computer Science"
                value={edu.fieldOfStudy || ""}
                onChange={(e) => handleUpdate(edu.id, "fieldOfStudy", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 2017"
                value={edu.startDate || ""}
                onChange={(e) => handleUpdate(edu.id, "startDate", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Date / Expected</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 2021"
                value={edu.endDate || ""}
                onChange={(e) => handleUpdate(edu.id, "endDate", e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Location (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Cambridge, MA"
              value={edu.location || ""}
              onChange={(e) => handleUpdate(edu.id, "location", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description / Honors (Optional)</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="e.g. Graduated with Honors (GPA 3.9/4.0), Dean's List..."
              value={edu.description || ""}
              onChange={(e) => handleUpdate(edu.id, "description", e.target.value)}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="btn-add-item"
      >
        <Plus className="w-4 h-4" /> Add Education
      </button>
    </div>
  );
}
