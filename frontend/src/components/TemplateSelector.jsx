import { LayoutTemplate, Sparkles, Award, FileText } from "lucide-react";

export const TEMPLATES_LIST = [
  {
    id: "modern",
    name: "Modern",
    badge: "Popular",
    description: "Sleek dual-column layout with vibrant gradient header and distinct skill badges",
    icon: Sparkles
  },
  {
    id: "professional",
    name: "Professional",
    badge: "Executive",
    description: "Classic structured corporate format with elegant horizontal dividers",
    icon: Award
  },
  {
    id: "minimal",
    name: "Minimal",
    badge: "Clean",
    description: "Ultra clean typography with generous spacing and minimalist accent bars",
    icon: FileText
  }
];

export default function TemplateSelector({ selectedTemplate, onSelectTemplate }) {
  return (
    <div>
      <label className="form-label flex items-center gap-1.5 mb-2">
        <LayoutTemplate className="w-4 h-4 text-brand-600" />
        Choose Template
      </label>
      <div className="template-grid">
        {TEMPLATES_LIST.map((tmpl) => {
          const Icon = tmpl.icon;
          const isActive = selectedTemplate === tmpl.id;
          return (
            <div
              key={tmpl.id}
              onClick={() => onSelectTemplate(tmpl.id)}
              className={`template-card cursor-pointer ${isActive ? "active" : ""}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-800">{tmpl.name}</span>
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {tmpl.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 text-left line-clamp-2">
                {tmpl.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
