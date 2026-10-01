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
  Check,
  Lock
} from "lucide-react";

export const TEMPLATES_LIST = [
  // --- FREE SIMPLE TEMPLATES ---
  {
    id: "modern",
    name: "Modern Classic",
    category: "Simple",
    badge: "Free",
    isPremium: false,
    description: "Sleek dual-column layout with vibrant header and skill tags",
    icon: Sparkles
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    category: "Simple",
    badge: "Free",
    isPremium: false,
    description: "Ultra clean typography with generous spacing and minimalist accent bars",
    icon: FileText
  },
  {
    id: "compact",
    name: "Compact ATS",
    category: "Simple",
    badge: "Free",
    isPremium: false,
    description: "Maximized space efficiency with high-density sidebar and scannable cards",
    icon: Maximize2
  },

  // --- PREMIUM SUBSCRIPTION TEMPLATES ---
  {
    id: "professional",
    name: "Professional Corporate",
    category: "Corporate",
    badge: "Pro",
    isPremium: true,
    description: "Classic structured corporate format with elegant horizontal dividers",
    icon: Award
  },
  {
    id: "executive",
    name: "Executive Leadership",
    category: "Corporate",
    badge: "Pro",
    isPremium: true,
    description: "Navy leadership header with executive summary box & competencies",
    icon: Crown
  },
  {
    id: "creative",
    name: "Creative Portfolio",
    category: "Creative",
    badge: "Pro",
    isPremium: true,
    description: "Bold sidebar with glowing profile, rounded cards, and portfolio focus",
    icon: Palette
  },
  {
    id: "tech",
    name: "Tech & Dev Terminal",
    category: "Tech",
    badge: "Pro",
    isPremium: true,
    description: "Terminal prompt styling, monospace code tags, and repo links",
    icon: Terminal
  },
  {
    id: "elegant",
    name: "Elegant Serif",
    category: "Corporate",
    badge: "Pro",
    isPremium: true,
    description: "Sophisticated editorial serif typography with delicate diamond ornaments",
    icon: Feather
  },
  {
    id: "nordic",
    name: "Nordic Minimal",
    category: "Simple",
    badge: "Pro",
    isPremium: true,
    description: "Airy layout with subtle green accents, geometric dots, and pill tags",
    icon: Compass
  },
  {
    id: "infographic",
    name: "Infographic Visual",
    category: "Creative",
    badge: "Pro",
    isPremium: true,
    description: "Visual icons, proficiency meters, and structured timeline badges",
    icon: PieChart
  },
  {
    id: "startup",
    name: "Startup Impact",
    category: "Tech",
    badge: "Pro",
    isPremium: true,
    description: "High-contrast dynamic header with bold project demo buttons and metric focus",
    icon: Rocket
  },
  {
    id: "academic",
    name: "Academic Scholarly",
    category: "Corporate",
    badge: "Pro",
    isPremium: true,
    description: "Scholarly CV format prioritizing research, appointments, and publications",
    icon: BookOpen
  },
  {
    id: "timeline",
    name: "Chronicle Timeline",
    category: "Creative",
    badge: "Pro",
    isPremium: true,
    description: "Connected vertical timeline spine highlighting career and education growth",
    icon: GitBranch
  },
  {
    id: "metro",
    name: "Metro Modular",
    category: "Popular",
    badge: "Pro",
    isPremium: true,
    description: "Clean tile-based modular cards with colored accent borders",
    icon: LayoutGrid
  },
  {
    id: "corporate",
    name: "Wall Street Suite",
    category: "Corporate",
    badge: "Pro",
    isPremium: true,
    description: "Traditional corporate blue banner with distinct competency matrix",
    icon: ShieldCheck
  },
  {
    id: "chic",
    name: "Chic Vogue",
    category: "Creative",
    badge: "Pro",
    isPremium: true,
    description: "Modern vogue aesthetics with refined typography and soft card styling",
    icon: Sparkles
  }
];

const CATEGORIES = ["All", "Free Simple", "Corporate", "Tech", "Creative", "Popular"];

export default function TemplateSelector({
  selectedTemplate,
  onSelectTemplate,
  hasSubscriptionAccess = false,
  onLockedTemplateClick
}) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTemplates =
    selectedCategory === "All"
      ? TEMPLATES_LIST
      : selectedCategory === "Free Simple"
        ? TEMPLATES_LIST.filter((t) => !t.isPremium)
        : TEMPLATES_LIST.filter((t) => t.category === selectedCategory);

  const handleTemplateClick = (tmpl) => {
    if (tmpl.isPremium && !hasSubscriptionAccess) {
      if (onLockedTemplateClick) {
        onLockedTemplateClick(tmpl);
      }
      return;
    }
    onSelectTemplate(tmpl.id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="form-label flex items-center gap-1.5 m-0">
          <LayoutTemplate className="w-4 h-4 text-brand-600" />
          Choose Template ({TEMPLATES_LIST.length} Available)
        </label>
        {hasSubscriptionAccess ? (
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Crown className="w-3 h-3 text-amber-500" />
            All Unlocked
          </span>
        ) : (
          <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            3 Free Simple • 13 Pro
          </span>
        )}
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
      <div className="template-grid max-h-[300px] overflow-y-auto pr-1 space-y-2">
        {filteredTemplates.map((tmpl) => {
          const Icon = tmpl.icon;
          const isActive = selectedTemplate === tmpl.id;
          const isLocked = tmpl.isPremium && !hasSubscriptionAccess;

          return (
            <div
              key={tmpl.id}
              onClick={() => handleTemplateClick(tmpl)}
              className={`template-card cursor-pointer relative group transition-all duration-150 p-3 rounded-xl border ${
                isActive
                  ? "active ring-2 ring-brand-600 border-brand-500 bg-brand-50/40 shadow-xs"
                  : isLocked
                    ? "border-slate-200 bg-slate-50/70 hover:border-amber-300 hover:bg-amber-50/30"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive
                        ? "text-brand-600"
                        : isLocked
                          ? "text-slate-400 group-hover:text-amber-600"
                          : "text-slate-500 group-hover:text-brand-600"
                    }`}
                  />
                  <span className="text-xs font-bold text-slate-800">
                    {tmpl.name}
                  </span>
                </div>

                {isLocked ? (
                  <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-2xs flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    PRO
                  </span>
                ) : !tmpl.isPremium ? (
                  <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    FREE
                  </span>
                ) : (
                  <span className="text-[9.5px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 flex items-center gap-1">
                    <Crown className="w-2.5 h-2.5 text-amber-500" />
                    PRO
                  </span>
                )}
              </div>

              <p className="text-[10.5px] text-slate-500 text-left line-clamp-2 leading-tight">
                {tmpl.description}
              </p>

              {isActive && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-brand-600 rounded-full flex items-center justify-center shadow-xs">
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
