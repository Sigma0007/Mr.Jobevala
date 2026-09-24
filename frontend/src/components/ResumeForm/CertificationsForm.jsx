import { Plus, Trash2 } from "lucide-react";

export default function CertificationsForm({ certifications = [], onChange }) {
  const handleAdd = () => {
    const newItem = {
      id: "cert-" + Date.now(),
      name: "",
      organization: "",
      issueDate: "",
      credentialUrl: ""
    };
    onChange([...certifications, newItem]);
  };

  const handleUpdate = (id, field, value) => {
    const updated = certifications.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  const handleRemove = (id) => {
    onChange(certifications.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      {certifications.map((cert, index) => (
        <div key={cert.id || index} className="repeatable-item-card">
          <div className="repeatable-item-header">
            <span className="repeatable-item-num">
              Certification #{index + 1} {cert.name ? `• ${cert.name}` : ""}
            </span>
            <button
              type="button"
              onClick={() => handleRemove(cert.id)}
              className="btn btn-danger-outline"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove
            </button>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Certification Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. AWS Solutions Architect"
                value={cert.name || ""}
                onChange={(e) => handleUpdate(cert.id, "name", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Issuing Organization</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Amazon Web Services, Google"
                value={cert.organization || ""}
                onChange={(e) => handleUpdate(cert.id, "organization", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Issue Date</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 2023-05 or May 2023"
                value={cert.issueDate || ""}
                onChange={(e) => handleUpdate(cert.id, "issueDate", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Credential URL (Optional)</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://verification-url.com"
                value={cert.credentialUrl || ""}
                onChange={(e) => handleUpdate(cert.id, "credentialUrl", e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="btn-add-item"
      >
        <Plus className="w-4 h-4" /> Add Certification
      </button>
    </div>
  );
}
