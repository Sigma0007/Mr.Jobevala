import { Plus, Trash2 } from "lucide-react";

export default function ProjectsForm({ projects = [], onChange }) {
  const handleAdd = () => {
    const newItem = {
      id: "proj-" + Date.now(),
      name: "",
      role: "",
      technologies: "",
      projectUrl: "",
      description: ""
    };
    onChange([...projects, newItem]);
  };

  const handleUpdate = (id, field, value) => {
    const updated = projects.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  const handleRemove = (id) => {
    onChange(projects.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      {projects.map((proj, index) => (
        <div key={proj.id || index} className="repeatable-item-card">
          <div className="repeatable-item-header">
            <span className="repeatable-item-num">
              Project #{index + 1} {proj.name ? `• ${proj.name}` : ""}
            </span>
            <button
              type="button"
              onClick={() => handleRemove(proj.id)}
              className="btn btn-danger-outline"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove
            </button>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Project Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. E-Commerce Platform"
                value={proj.name || ""}
                onChange={(e) => handleUpdate(proj.id, "name", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Your Role</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Lead Full Stack Developer"
                value={proj.role || ""}
                onChange={(e) => handleUpdate(proj.id, "role", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Technologies Used</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. React, Node.js, MongoDB, Tailwind"
                value={proj.technologies || ""}
                onChange={(e) => handleUpdate(proj.id, "technologies", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Project URL / GitHub</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://github.com/your-project"
                value={proj.projectUrl || ""}
                onChange={(e) => handleUpdate(proj.id, "projectUrl", e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Project Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="e.g. Developed high-throughput REST API with automated unit tests and continuous deployment..."
              value={proj.description || ""}
              onChange={(e) => handleUpdate(proj.id, "description", e.target.value)}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="btn-add-item"
      >
        <Plus className="w-4 h-4" /> Add Project
      </button>
    </div>
  );
}
