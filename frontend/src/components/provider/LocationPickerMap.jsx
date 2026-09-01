import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapPin,
  Search,
  Crosshair,
  Map as MapIcon,
  Loader2,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";

// Custom modern SVG Pin for Leaflet
const createCustomIcon = () => {
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
        <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); width: 36px; height: 36px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(37,99,235,0.4); border: 2.5px solid white;">
          <div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        </div>
        <div style="width: 8px; height: 4px; background: rgba(0,0,0,0.25); border-radius: 50%; margin-top: 2px; filter: blur(1px);"></div>
      </div>
    `,
    iconSize: [36, 42],
    iconAnchor: [0, 0],
    popupAnchor: [0, -42],
  });
};

const customPinIcon = createCustomIcon();

// Default fallback coordinates (e.g. New Delhi / Global default)
const DEFAULT_CENTER = [28.6139, 77.209];
const DEFAULT_ZOOM = 13;

// Helper to animate/fly map center
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom || 15, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [center, zoom, map]);
  return null;
}

// Click event handler for the map
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPickerMap({
  value = "",
  lat = null,
  lng = null,
  onChange,
  onCoordinatesChange,
  label = "Company Location / Address",
  subLabel = "",
  placeholder = "Search area, city, street or select on map...",
  required = false,
}) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Map state
  const effectiveLng = lng;
  const initialHasCoords =
    lat !== null &&
    lat !== undefined &&
    effectiveLng !== null &&
    effectiveLng !== undefined &&
    !isNaN(Number(lat)) &&
    !isNaN(Number(effectiveLng));

  const [position, setPosition] = useState(
    initialHasCoords ? [Number(lat), Number(effectiveLng)] : DEFAULT_CENTER,
  );
  const [hasSelectedPoint, setHasSelectedPoint] = useState(initialHasCoords);
  const [markerAddress, setMarkerAddress] = useState("");

  const searchContainerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Sync internal query when external value changes
  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  // Sync coordinates when external lat/lng change
  useEffect(() => {
    const validLng = lng;
    if (
      lat !== null &&
      lat !== undefined &&
      validLng !== null &&
      validLng !== undefined &&
      !isNaN(Number(lat)) &&
      !isNaN(Number(validLng))
    ) {
      setPosition([Number(lat), Number(validLng)]);
      setHasSelectedPoint(true);
    }
  }, [lat, lng]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format Nominatim reverse geocode address with comprehensive address hierarchy
  const formatAddress = (data) => {
    if (!data) return "";
    if (data.address) {
      const addr = data.address;

      // 1. POI / Building / House name
      const premise =
        addr.building ||
        addr.office ||
        addr.amenity ||
        addr.shop ||
        addr.commercial ||
        addr.industrial ||
        addr.tourism ||
        addr.leisure ||
        addr.house_name ||
        addr.place;

      // 2. House number & Street/Road
      const road =
        addr.road ||
        addr.street ||
        addr.pedestrian ||
        addr.footway ||
        addr.path ||
        addr.lane;
      const streetPart = [addr.house_number, road].filter(Boolean).join(" ");

      // 3. Local Area / Neighborhood / Suburb
      const area =
        addr.neighbourhood ||
        addr.suburb ||
        addr.residential ||
        addr.quarter ||
        addr.borough ||
        addr.city_district ||
        addr.subdivision ||
        addr.block;

      // 4. Village / Hamlet / Colony / Settlement
      const village =
        addr.village || addr.hamlet || addr.isolated_dwelling || addr.croft;

      // 5. Town / City / Municipality
      const city = addr.city || addr.town || addr.municipality;

      // 6. Taluka / Tehsil / Subdistrict / County / District
      const district =
        addr.taluk ||
        addr.tehsil ||
        addr.mandal ||
        addr.subdistrict ||
        addr.district ||
        addr.county ||
        addr.state_district;

      // 7. State, Postcode, Country
      const state = addr.state || addr.province || addr.region;
      const postcode = addr.postcode;
      const country = addr.country;

      // Combine parts maintaining order and filtering out empty / duplicate entries
      const rawParts = [
        premise,
        streetPart,
        area,
        village,
        city,
        district,
        state,
        postcode,
        country,
      ].filter(Boolean);

      // Deduplicate case-insensitively while preserving order
      const uniqueParts = [];
      for (const part of rawParts) {
        const trimmed = String(part).trim();
        if (
          trimmed &&
          !uniqueParts.some((p) => p.toLowerCase() === trimmed.toLowerCase())
        ) {
          uniqueParts.push(trimmed);
        }
      }

      if (uniqueParts.length > 0) {
        return uniqueParts.join(", ");
      }
    }

    if (data.display_name) {
      return data.display_name;
    }

    return "";
  };

  // Perform Nominatim search for suggestions
  const fetchSuggestions = async (searchText) => {
    if (!searchText || searchText.trim().length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    try {
      const endpoint = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchText.trim(),
      )}&addressdetails=1&limit=6`;
      const res = await fetch(endpoint, {
        headers: { "Accept-Language": "en" },
      });
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data || []);
        setShowSuggestions(true);
      }
    } catch (err) {
      console.error("Location search failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle Search Input Change with Debounce
  const handleInputChange = (e) => {
    const text = e.target.value;
    setQuery(text);
    if (onChange) onChange(text);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (text.trim().length >= 2) {
      setIsSearching(true);
      debounceTimerRef.current = setTimeout(() => {
        fetchSuggestions(text);
      }, 350);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsSearching(false);
    }
  };

  // Reverse geocode lat, lon to get address string
  const reverseGeocode = async (lat, lon) => {
    setIsGeocoding(true);
    try {
      const endpoint = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;
      const res = await fetch(endpoint, {
        headers: { "Accept-Language": "en" },
      });
      if (res.ok) {
        const data = await res.json();
        const formatted = formatAddress(data);
        const resolvedAddress =
          formatted ||
          data.display_name ||
          `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
        setMarkerAddress(resolvedAddress);
        setQuery(resolvedAddress);
        if (onChange) onChange(resolvedAddress, { lat, lng: lon });
        if (onCoordinatesChange) onCoordinatesChange(lat, lon);
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
      const fallbackCoord = `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
      setMarkerAddress(fallbackCoord);
      setQuery(fallbackCoord);
      if (onChange) onChange(fallbackCoord, { lat, lng: lon });
      if (onCoordinatesChange) onCoordinatesChange(lat, lon);
    } finally {
      setIsGeocoding(false);
    }
  };

  // Handle Selecting a Suggestion from Dropdown
  const handleSelectSuggestion = (item) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    const formatted = formatAddress(item) || item.display_name;

    setQuery(formatted);
    setMarkerAddress(formatted);
    setPosition([lat, lon]);
    setHasSelectedPoint(true);
    setShowSuggestions(false);
    setShowMap(true);
    if (onChange) onChange(formatted, { lat, lng: lon });
    if (onCoordinatesChange) onCoordinatesChange(lat, lon);
  };

  // Handle Map Click or Marker Drag
  const handleMapLocationChange = useCallback(
    (lat, lon) => {
      setPosition([lat, lon]);
      setHasSelectedPoint(true);
      if (onCoordinatesChange) onCoordinatesChange(lat, lon);
      reverseGeocode(lat, lon);
    },
    [onCoordinatesChange],
  );

  // Use Browser Geolocation (Current Location)
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setPosition([lat, lon]);
        setHasSelectedPoint(true);
        setShowMap(true);
        if (onCoordinatesChange) onCoordinatesChange(lat, lon);
        reverseGeocode(lat, lon);
        setIsLocating(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert(
          "Could not retrieve your location. Please check browser permissions.",
        );
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  // Initial geocoding when map opens if value exists but coordinates aren't set
  const handleToggleMap = () => {
    const nextState = !showMap;
    setShowMap(nextState);
    if (nextState && query && !hasSelectedPoint) {
      fetchSuggestions(query).then(() => {
        // If we get immediate suggestion, pick first
        if (suggestions.length > 0) {
          const first = suggestions[0];
          const lat = parseFloat(first.lat);
          const lon = parseFloat(first.lon);
          setPosition([lat, lon]);
          setHasSelectedPoint(true);
          if (onCoordinatesChange) onCoordinatesChange(lat, lon);
        }
      });
    }
  };

  const handleClearLocation = () => {
    setQuery("");
    setMarkerAddress("");
    setHasSelectedPoint(false);
    setSuggestions([]);
    setShowSuggestions(false);
    if (onChange) onChange("", { lat: null, lng: null });
    if (onCoordinatesChange) onCoordinatesChange(null, null);
  };

  return (
    <div className="space-y-2">
      {/* Label and Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          {subLabel && (
            <p className="text-xs text-slate-400 mt-0.5">{subLabel}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100/80 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
            title="Detect your current location"
          >
            {isLocating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Crosshair className="w-3.5 h-3.5 text-brand-600" />
            )}
            <span>{isLocating ? "Locating..." : "Use Current GPS"}</span>
          </button>

          <button
            type="button"
            onClick={handleToggleMap}
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg transition-colors ${
              showMap
                ? "bg-slate-800 text-white hover:bg-slate-900"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>{showMap ? "Hide Map" : "Open Map Picker"}</span>
            {showMap ? (
              <ChevronUp className="w-3 h-3 ml-0.5" />
            ) : (
              <ChevronDown className="w-3 h-3 ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Search Input Container */}
      <div ref={searchContainerRef} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 pointer-events-none text-slate-400">
            {isSearching || isGeocoding ? (
              <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </div>

          <input
            type="text"
            required={required}
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            placeholder={placeholder}
            className="w-full pl-10 pr-20 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all placeholder:text-slate-400"
          />

          <div className="absolute right-2.5 flex items-center gap-1">
            {query && (
              <button
                type="button"
                onClick={handleClearLocation}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
                title="Clear address"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={handleToggleMap}
              className={`p-1.5 rounded-lg border transition-colors ${
                showMap
                  ? "bg-brand-50 border-brand-200 text-brand-600"
                  : "bg-white border-slate-200 text-slate-500 hover:text-slate-700"
              }`}
              title="Toggle interactive map"
            >
              <MapPin className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3.5 py-2 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Location Suggestions</span>
              <span className="text-[10px] text-slate-400">
                Click to place on map
              </span>
            </div>
            {suggestions.map((item, idx) => {
              const formatted = formatAddress(item);
              const displayNameParts = item.display_name
                ? item.display_name.split(",")
                : [];
              const primaryTitle = formatted
                ? formatted.split(",")[0]
                : displayNameParts[0] || "Location";
              const fullAddress = formatted || item.display_name;

              return (
                <button
                  key={item.place_id || idx}
                  type="button"
                  onClick={() => handleSelectSuggestion(item)}
                  className="w-full text-left px-4 py-2.5 hover:bg-brand-50/70 flex items-start gap-3 transition-colors group cursor-pointer"
                >
                  <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-brand-100 group-hover:text-brand-600 text-slate-500 transition-colors mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 group-hover:text-brand-600 truncate">
                      {primaryTitle}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {fullAddress}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Interactive Leaflet Map Section */}
      {showMap && (
        <div className="mt-3 border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-slate-50">
          {/* Map Top Bar Controls & Status */}
          <div className="px-4 py-2.5 bg-slate-100/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600"></span>
              </span>
              <span className="font-medium text-slate-700">
                {isGeocoding
                  ? "Detecting address..."
                  : hasSelectedPoint
                    ? "Location Selected"
                    : "Click anywhere or drag marker to set location"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {hasSelectedPoint && (
                <span className="text-[11px] text-slate-500 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                  {position[0].toFixed(4)}°, {position[1].toFixed(4)}°
                </span>
              )}
              <span className="text-[11px] text-slate-400">
                Tip: Drag pin or click map
              </span>
            </div>
          </div>

          {/* Map Container */}
          <div className="h-64 sm:h-72 w-full relative z-0">
            <MapContainer
              center={position}
              zoom={hasSelectedPoint ? 15 : DEFAULT_ZOOM}
              scrollWheelZoom={true}
              className="h-full w-full"
              style={{ minHeight: "260px", zIndex: 1 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapController
                center={position}
                zoom={hasSelectedPoint ? 15 : DEFAULT_ZOOM}
              />
              <MapClickHandler onLocationSelect={handleMapLocationChange} />

              {hasSelectedPoint && (
                <Marker
                  position={position}
                  icon={customPinIcon}
                  draggable={true}
                  eventHandlers={{
                    dragend: (e) => {
                      const marker = e.target;
                      const newPos = marker.getLatLng();
                      handleMapLocationChange(newPos.lat, newPos.lng);
                    },
                  }}
                >
                  <Popup>
                    <div className="p-1 max-w-xs">
                      <p className="font-semibold text-slate-800 text-xs mb-1">
                        Selected Location
                      </p>
                      <p className="text-slate-600 text-xs line-clamp-3">
                        {markerAddress || query || "Pinned on map"}
                      </p>
                      <p className="text-[10px] text-brand-600 font-medium mt-1">
                        (Drag pin to fine tune)
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>

            {/* Floating Geocoding overlay spinner */}
            {isGeocoding && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-slate-200 z-10 flex items-center gap-2 text-xs font-medium text-slate-700">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-600" />
                <span>Updating address...</span>
              </div>
            )}
          </div>

          {/* Selected Address Preview Banner */}
          {query && (
            <div className="px-4 py-2.5 bg-white border-t border-slate-200 flex items-start gap-2.5 text-xs">
              <div className="p-1 rounded-md bg-emerald-50 text-emerald-600 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-500 font-medium text-[11px]">
                  Selected Address:
                </p>
                <p className="text-slate-800 font-medium truncate">{query}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
