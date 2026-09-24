import { useState } from "react";
import {
  LayoutTemplate,
  Sparkles,
  Award,
  FileText,
  Crown,
  Palette,
  Terminal,
  Feather,
  Maximize2,
  Compass,
  PieChart,
  Rocket,
  BookOpen,
  GitBranch,
  LayoutGrid,
  ShieldCheck,
  Check
} from "lucide-react";

export const TEMPLATES_LIST = [
  {
    id: "modern",
    name: "Modern",
    category: "Popular",
    badge: "Popular",
    description: "Sleek dual-column layout with vibrant header and skill tags",
    icon: Sparkles
  },
  {
    id: "professional",
    name: "Professional",
    category: "Corporate",
    badge: "Executive",
    description: "Classic structured corporate format with elegant horizontal dividers",
    icon: Award
  },
  {
    id: "minimal",
    name: "Minimal",
    category: "Simple",
    badge: "Clean",
    description: "Ultra clean typography with generous spacing and minimalist accent bars",
    icon: FileText
  },
  {
    id: "executive",
    name: "Executive",
    category: "Corporate",
    badge: "Leadership",
    description: "Navy leadership header with executive summary box & competencies",
    icon: Crown
  },
  {
    id: "creative",
    name: "Creative",
    category: "Creative",
    badge: "Design",
    description: "Bold sidebar with glowing profile, rounded cards, and portfolio focus",
    icon: Palette
  },
  {
    id: "tech",
    name: "Tech & Dev",
    category: "Tech",
    badge: "Developer",
    description: "Terminal prompt styling, monospace code tags, and repo links",
    icon: Terminal
  },
  {
    id: "elegant",
    name: "Elegant Serif",
    category: "Corporate",
    badge: "Editorial",
    description: "Sophisticated editorial serif typography with delicate diamond ornaments",
    icon: Feather
  },
  {
    id: "compact",
    name: "Compact ATS",
    category: "Simple",
    badge: "High Density",
    description: "Maximized space efficiency with high-density sidebar and scannable cards",
    icon: Maximize2
  },
  {
    id: "nordic",
    name: "Nordic Minimal",
    category: "Simple",
    badge: "Scandinavian",
    description: "Airy layout with subtle green accents, geometric dots, and pill tags",
    icon: Compass
  },
  {
    id: "infographic",
    name: "Infographic",
    category: "Creative",
    badge: "Visual",
    description: "Visual icons, proficiency meters, and structured timeline badges",
    icon: PieChart
  },
  {
    id: "startup",
    name: "Startup Bold",
    category: "Tech",
    badge: "High Impact",
    description: "High-contrast dynamic header with bold project demo buttons and metric focus",
    icon: Rocket
  },
  {
    id: "academic",
    name: "Academic CV",
    category: "Corporate",
    badge: "Research",
    description: "Scholarly CV format prioritizing research, appointments, and publications",
    icon: BookOpen
  },
  {
    id: "timeline",
    name: "Chronicle Timeline",
    category: "Creative",
    badge: "Timeline",
    description: "Connected vertical timeline spine highlighting career and education growth",
    icon: GitBranch
  },
  {
    id: "metro",
    name: "Metro Cards",
    category: "Popular",
    badge: "Modular",
    description: "Clean tile-based modular cards with colored accent borders",
    icon: LayoutGrid
  },
  {
    id: "corporate",
    name: "Wall Street",
    category: "Corporate",
    badge: "Classic",
    description: "Traditional corporate blue banner with distinct competency matrix",
    icon: ShieldCheck
  },
  {
    id: "chic",
    name: "Chic Vogue",
    category: "Creative",
    badge: "Stylish",
    description: "Modern vogue aesthetics with refined typography and soft card styling",
    icon: Sparkles
  }
];

const CATEGORIES = ["All", "Popular", "Corporate", "Tech", "Creative", "Simple"];

export default function TemplateSelector({ selectedTemplate, onSelectTemplate }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTemplates =
    selectedCategory === "All"
      ? TEMPLATES_LIST
      : TEMPLATES_LIST.filter((t) => t.category === selectedCategory);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="form-label flex items-center gap-1.5 m-0">
          <LayoutTemplate className="w-4 h-4 text-brand-600" />
          Choose Template ({TEMPLATES_LIST.length} Available)
        </label>
        <span className="text-[11px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
          16 Templates
        </span>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-1 mb-2.5 pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-all ${
              selectedCategory === cat
                ? "bg-brand-600 text-white shadow-xs font-semibold"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template Scrollable Grid */}
      <div className="template-grid max-h-[290px] overflow-y-auto pr-1">
        {filteredTemplates.map((tmpl) => {
          const Icon = tmpl.icon;
          const isActive = selectedTemplate === tmpl.id;
          return (
            <div
              key={tmpl.id}
              onClick={() => onSelectTemplate(tmpl.id)}
              className={`template-card cursor-pointer relative group transition-all duration-150 ${
                isActive
                  ? "active ring-2 ring-brand-600 border-brand-500 bg-brand-50/40"
                  : "hover:border-slate-300 hover:shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? "text-brand-600" : "text-slate-500 group-hover:text-brand-600"
                    }`}
                  />
                  <span className="text-xs font-bold text-slate-800">{tmpl.name}</span>
                </div>
                <span
                  className={`text-[9.5px] font-semibold px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {tmpl.badge}
                </span>
              </div>
              <p className="text-[10.5px] text-slate-500 text-left line-clamp-2 leading-tight">
                {tmpl.description}
              </p>
              {isActive && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-600 rounded-full flex items-center justify-center shadow-xs">
                  <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
