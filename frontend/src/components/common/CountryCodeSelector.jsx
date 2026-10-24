import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Check, Globe } from "lucide-react";
import { countries, getEmojiFlag } from "countries-list";

// List of priority / popular countries to highlight at top
const POPULAR_ISO_CODES = [
  "IN", // India
  "US", // United States
  "GB", // United Kingdom
  "AE", // United Arab Emirates
  "CA", // Canada
  "AU", // Australia
  "SA", // Saudi Arabia
  "DE", // Germany
  "SG", // Singapore
  "QA", // Qatar
  "KW", // Kuwait
  "OM", // Oman
  "BH", // Bahrain
  "MY", // Malaysia
  "NZ", // New Zealand
];

export default function CountryCodeSelector({
  value = "+91",
  selectedIso = "IN",
  onChange,
  disabled = false,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Build the complete country list from countries-list
  const allCountries = useMemo(() => {
    try {
      return Object.entries(countries)
        .map(([iso, data]) => {
          const rawPhone = Array.isArray(data.phone) ? data.phone[0] : data.phone;
          if (!rawPhone) return null;
          return {
            iso,
            name: data.name,
            dialCode: `+${rawPhone}`,
            emoji: getEmojiFlag ? getEmojiFlag(iso) : data.emoji || "🌐",
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.name.localeCompare(b.name));
    } catch (err) {
      console.error("Error loading countries-list:", err);
      return [
        { iso: "IN", name: "India", dialCode: "+91", emoji: "🇮🇳" },
        { iso: "US", name: "United States", dialCode: "+1", emoji: "🇺🇸" },
        { iso: "GB", name: "United Kingdom", dialCode: "+44", emoji: "🇬🇧" },
        { iso: "AE", name: "United Arab Emirates", dialCode: "+971", emoji: "🇦🇪" },
      ];
    }
  }, []);

  // Popular countries list
  const popularCountries = useMemo(() => {
    return POPULAR_ISO_CODES.map((iso) =>
      allCountries.find((c) => c.iso === iso)
    ).filter(Boolean);
  }, [allCountries]);

  // Current selected country
  const currentCountry = useMemo(() => {
    if (selectedIso) {
      const match = allCountries.find((c) => c.iso === selectedIso);
      if (match) return match;
    }
    if (value) {
      const cleanVal = value.startsWith("+") ? value : `+${value}`;
      const match = allCountries.find((c) => c.dialCode === cleanVal);
      if (match) return match;
    }
    return (
      allCountries.find((c) => c.iso === "IN") || {
        iso: "IN",
        name: "India",
        dialCode: "+91",
        emoji: "🇮🇳",
      }
    );
  }, [allCountries, selectedIso, value]);

  // Filter countries based on search query
  const filteredCountries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allCountries;
    return allCountries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.toLowerCase().includes(q) ||
        c.iso.toLowerCase().includes(q)
    );
  }, [allCountries, searchQuery]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      setTimeout(() => {
        if (searchInputRef.current) searchInputRef.current.focus();
      }, 50);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (country) => {
    if (disabled) return;
    onChange?.({
      dialCode: country.dialCode,
      iso: country.iso,
      name: country.name,
      emoji: country.emoji,
    });
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`h-full inline-flex items-center gap-1.5 px-3 py-3 border-r border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100/80 hover:bg-slate-200/70 transition-colors cursor-pointer select-none focus:outline-none ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
        title={`Country Code: ${currentCountry.name} (${currentCountry.dialCode})`}
        aria-label="Select Country Code"
        aria-expanded={isOpen}
      >
        <span className="text-base leading-none select-none" role="img" aria-label={currentCountry.name}>
          {currentCountry.emoji}
        </span>
        <span className="font-mono tracking-tight text-slate-800">
          {currentCountry.dialCode}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-brand-600" : ""
          }`}
        />
      </button>

      {/* Floating Dropdown Modal / Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute left-0 top-full mt-2 w-80 sm:w-88 max-w-[92vw] bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden flex flex-col text-left"
            style={{ maxHeight: "360px" }}
          >
            {/* Header & Search Input */}
            <div className="p-2.5 border-b border-slate-100 bg-slate-50/70 sticky top-0 z-10">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search country or code (+91, US)..."
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            {/* Country List Scrollable */}
            <div className="overflow-y-auto divide-y divide-slate-50 flex-1 p-1.5 scrollbar-thin scrollbar-thumb-slate-200">
              {/* Popular Countries Section (Only when not actively searching) */}
              {!searchQuery.trim() && (
                <div className="mb-2">
                  <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    <span>Popular Countries</span>
                  </div>
                  {popularCountries.map((c) => {
                    const isSelected =
                      c.iso === currentCountry.iso || c.dialCode === currentCountry.dialCode;
                    return (
                      <button
                        key={`pop-${c.iso}`}
                        type="button"
                        onClick={() => handleSelect(c)}
                        className={`w-full px-2.5 py-1.5 rounded-lg text-xs sm:text-sm flex items-center justify-between transition-colors cursor-pointer group ${
                          isSelected
                            ? "bg-brand-50 text-brand-700 font-semibold"
                            : "hover:bg-slate-100/80 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-lg leading-none">{c.emoji}</span>
                          <span className="truncate">{c.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 pl-2">
                          <span className="font-mono text-xs text-slate-500 bg-slate-100 group-hover:bg-white px-1.5 py-0.5 rounded border border-slate-200/60">
                            {c.dialCode}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-brand-600 shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                  <div className="my-1.5 border-t border-slate-100" />
                  <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    All Countries
                  </div>
                </div>
              )}

              {/* All / Filtered Countries */}
              {filteredCountries.length > 0 ? (
                filteredCountries.map((c) => {
                  const isSelected =
                    c.iso === currentCountry.iso && c.dialCode === currentCountry.dialCode;
                  return (
                    <button
                      key={c.iso}
                      type="button"
                      onClick={() => handleSelect(c)}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-xs sm:text-sm flex items-center justify-between transition-colors cursor-pointer group ${
                        isSelected
                          ? "bg-brand-50 text-brand-700 font-semibold"
                          : "hover:bg-slate-100/80 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-lg leading-none">{c.emoji}</span>
                        <span className="truncate">{c.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 pl-2">
                        <span className="font-mono text-xs text-slate-500 bg-slate-100 group-hover:bg-white px-1.5 py-0.5 rounded border border-slate-200/60">
                          {c.dialCode}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-brand-600 shrink-0" />}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">
                  No countries found matching "{searchQuery}"
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
