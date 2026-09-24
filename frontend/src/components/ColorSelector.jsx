import { Palette, Type, Check } from "lucide-react";

export const COLOR_PALETTES = [
  { id: "blue", name: "Royal Blue", hex: "#2563eb" },
  { id: "black", name: "Executive Black", hex: "#0f172a" },
  { id: "darkgray", name: "Slate Gray", hex: "#475569" },
  { id: "green", name: "Emerald Green", hex: "#059669" },
  { id: "purple", name: "Deep Purple", hex: "#7c3aed" }
];

export const FONT_OPTIONS = [
  { id: "Inter, sans-serif", name: "Inter (Modern Sans)" },
  { id: "Roboto, sans-serif", name: "Roboto (Clean Sans)" },
  { id: "Arial, sans-serif", name: "Arial (Standard)" },
  { id: "Georgia, serif", name: "Georgia (Classic Serif)" }
];

export default function ColorSelector({
  selectedColor,
  onSelectColor,
  selectedFont,
  onSelectFont
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-100">
      {/* Color Accent Picker */}
      <div>
        <label className="form-label flex items-center gap-1.5 mb-2">
          <Palette className="w-4 h-4 text-brand-600" />
          Accent Color
        </label>
        <div className="color-picker-row">
          {COLOR_PALETTES.map((c) => {
            const isSelected = selectedColor === c.hex;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectColor(c.hex)}
                className={`color-swatch ${isSelected ? "active" : ""}`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Font Family Picker */}
      <div>
        <label className="form-label flex items-center gap-1.5 mb-2">
          <Type className="w-4 h-4 text-brand-600" />
          Typography / Font
        </label>
        <select
          className="form-select text-xs py-1.5"
          value={selectedFont}
          onChange={(e) => onSelectFont(e.target.value)}
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.id} value={f.id} style={{ fontFamily: f.id }}>
              {f.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
