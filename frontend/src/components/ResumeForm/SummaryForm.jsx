export default function SummaryForm({ summary, onChange }) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-2">
        Write a concise, impactful 2–4 sentence summary highlighting your top skills, career achievements, and professional focus.
      </p>
      <div className="form-group">
        <label className="form-label">Professional Summary</label>
        <textarea
          className="form-textarea"
          rows={5}
          placeholder="e.g. Experienced software engineer with expertise in building scalable cloud architectures and responsive web applications..."
          value={summary || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
