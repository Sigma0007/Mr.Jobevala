import { Plus, Trash2 } from "lucide-react";

const PROFICIENCY_LEVELS = [
  "Native / Bilingual",
  "Fluent / Full Professional",
  "Professional Working",
  "Intermediate",
  "Elementary / Basic"
];

export default function LanguagesForm({ languages = [], onChange }) {
  const handleAdd = () => {
    const newItem = {
      id: "lang-" + Date.now(),
      language: "",
      proficiency: "Fluent / Full Professional"
    };
    onChange([...languages, newItem]);
  };

  const handleUpdate = (id, field, value) => {
    const updated = languages.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  const handleRemove = (id) => {
    onChange(languages.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      {languages.map((lang, index) => (
        <div key={lang.id || index} className="repeatable-item-card">
          <div className="repeatable-item-header">
            <span className="repeatable-item-num">Language #{index + 1}</span>
            <button
              type="button"
              onClick={() => handleRemove(lang.id)}
              className="btn btn-danger-outline"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove
            </button>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Language</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. English, Spanish, French"
                value={lang.language || ""}
                onChange={(e) => handleUpdate(lang.id, "language", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Proficiency Level</label>
              <select
                className="form-select"
                value={lang.proficiency || "Fluent / Full Professional"}
                onChange={(e) => handleUpdate(lang.id, "proficiency", e.target.value)}
              >
                {PROFICIENCY_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="btn-add-item"
      >
        <Plus className="w-4 h-4" /> Add Language
      </button>
    </div>
  );
}
