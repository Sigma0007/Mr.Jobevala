import { useState } from "react";
import { Plus, X } from "lucide-react";

export default function InterestsForm({ interests = [], onChange }) {
  const [newInterest, setNewInterest] = useState("");

  const handleAddInterest = (e) => {
    e?.preventDefault();
    const trimmed = newInterest.trim();
    if (!trimmed) return;
    if (!interests.includes(trimmed)) {
      onChange([...interests, trimmed]);
    }
    setNewInterest("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddInterest();
    }
  };

  const handleRemoveInterest = (itemToRemove) => {
    onChange(interests.filter((item) => item !== itemToRemove));
  };

  return (
    <div>
      <p className="text-xs text-slate-500 mb-3">
        Add your extracurricular interests, hobbies, or volunteering topics (e.g. Open Source, Photography, Hiking).
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          className="form-input"
          placeholder="e.g. Open Source Contributing, Chess..."
          value={newInterest}
          onChange={(e) => setNewInterest(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onClick={handleAddInterest}
          className="btn btn-primary whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      <div className="tags-container">
        {interests.map((interest, index) => (
          <div key={index} className="tag-badge" style={{ backgroundColor: "#f3f4f6", color: "#374151", borderColor: "#e5e7eb" }}>
            <span>{interest}</span>
            <button
              type="button"
              onClick={() => handleRemoveInterest(interest)}
              aria-label={`Remove ${interest}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {interests.length === 0 && (
          <p className="text-xs text-slate-400 italic">No interests added yet.</p>
        )}
      </div>
    </div>
  );
}
