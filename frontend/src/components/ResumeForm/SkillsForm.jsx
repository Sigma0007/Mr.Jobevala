import { useState } from "react";
import { Plus, X } from "lucide-react";

export default function SkillsForm({ skills = [], onChange }) {
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = (e) => {
    e?.preventDefault();
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    if (!skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
    }
    setNewSkill("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    onChange(skills.filter((s) => s !== skillToRemove));
  };

  return (
    <div>
      <p className="text-xs text-slate-500 mb-3">
        Add your key technical and soft skills. Type a skill and press Enter or click Add.
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          className="form-input"
          placeholder="e.g. React, Python, Project Management..."
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onClick={handleAddSkill}
          className="btn btn-primary whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      <div className="tags-container">
        {skills.map((skill, index) => (
          <div key={index} className="tag-badge">
            <span>{skill}</span>
            <button
              type="button"
              onClick={() => handleRemoveSkill(skill)}
              aria-label={`Remove ${skill}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {skills.length === 0 && (
          <p className="text-xs text-slate-400 italic">No skills added yet.</p>
        )}
      </div>
    </div>
  );
}
