import React, { useState, useEffect } from "react";
import api from "../../customer/customerservice";
import { X, MapPin, Sparkles, AlertCircle, Building2, Map, Navigation } from "lucide-react";
import { toast } from "react-hot-toast";

const LocationModal = ({
  isOpen,
  onClose,
  initialType = "state", // 'state', 'district', 'subdivision'
  locationToEdit = null,
  locationHierarchy = [],
  onLocationSaved,
}) => {
  const [type, setType] = useState(initialType);
  const [loading, setLoading] = useState(false);
  const [fetchingCode, setFetchingCode] = useState(false);
  const [errors, setErrors] = useState({});

  // Form states
  const [stateName, setStateName] = useState("");
  const [stateCode, setStateCode] = useState("");

  const [selectedStateCodeForDistrict, setSelectedStateCodeForDistrict] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [districtCode, setDistrictCode] = useState("");

  const [selectedStateCodeForSubDiv, setSelectedStateCodeForSubDiv] = useState("");
  const [selectedDistrictCodeForSubDiv, setSelectedDistrictCodeForSubDiv] = useState("");
  const [subDivisionName, setSubDivisionName] = useState("");
  const [subDivisionCode, setSubDivisionCode] = useState("");

  const isEditMode = !!locationToEdit;

  // Initialize or reset form when modal opens or edit data changes
  useEffect(() => {
    if (!isOpen) return;

    setErrors({});
    if (locationToEdit) {
      setType(locationToEdit.type || initialType);

      if (locationToEdit.type === "state") {
        setStateName(locationToEdit.state_name || "");
        setStateCode(locationToEdit.state_code?.toString() || "");
      } else if (locationToEdit.type === "district") {
        setSelectedStateCodeForDistrict(locationToEdit.state_code?.toString() || "");
        setDistrictName(locationToEdit.district_name || "");
        setDistrictCode(locationToEdit.district_code?.toString() || "");
      } else if (locationToEdit.type === "subdivision") {
        // Find which state this district belongs to
        let foundStateCode = "";
        for (const st of locationHierarchy) {
          if (st.districts?.some((d) => d.district_code === locationToEdit.district_code)) {
            foundStateCode = st.state_code?.toString();
            break;
          }
        }
        setSelectedStateCodeForSubDiv(foundStateCode || "");
        setSelectedDistrictCodeForSubDiv(locationToEdit.district_code?.toString() || "");
        setSubDivisionName(locationToEdit.sub_division_name || "");
        setSubDivisionCode(locationToEdit.sub_division_code?.toString() || "");
      }
    } else {
      setType(initialType);
      setStateName("");
      setStateCode("");
      setSelectedStateCodeForDistrict(locationHierarchy[0]?.state_code?.toString() || "");
      setDistrictName("");
      setDistrictCode("");
      setSelectedStateCodeForSubDiv(locationHierarchy[0]?.state_code?.toString() || "");
      setSelectedDistrictCodeForSubDiv(locationHierarchy[0]?.districts?.[0]?.district_code?.toString() || "");
      setSubDivisionName("");
      setSubDivisionCode("");

      // Fetch auto-generated next code for the initial type
      fetchNextCode(initialType);
    }
  }, [isOpen, locationToEdit, initialType, locationHierarchy]);

  // When changing type in add mode, fetch next usable sequential code
  const handleTypeChange = (newType) => {
    if (isEditMode) return;
    setType(newType);
    setErrors({});
    fetchNextCode(newType);
  };

  const fetchNextCode = async (targetType) => {
    try {
      setFetchingCode(true);
      const res = await api.getNextLocationCode(targetType);
      if (res.success && res.data?.next_code !== undefined) {
        const codeStr = res.data.next_code.toString();
        if (targetType === "state") setStateCode(codeStr);
        if (targetType === "district") setDistrictCode(codeStr);
        if (targetType === "subdivision") setSubDivisionCode(codeStr);
      }
    } catch (err) {
      console.error("Error fetching next code:", err);
    } finally {
      setFetchingCode(false);
    }
  };

  // Sub-division state selection change handler
  const handleSubDivStateChange = (newStCode) => {
    setSelectedStateCodeForSubDiv(newStCode);
    const selectedState = locationHierarchy.find((st) => st.state_code.toString() === newStCode);
    if (selectedState?.districts?.length > 0) {
      setSelectedDistrictCodeForSubDiv(selectedState.districts[0].district_code.toString());
    } else {
      setSelectedDistrictCodeForSubDiv("");
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (type === "state") {
      if (!stateName.trim()) newErrors.stateName = "State name is required.";
      if (!stateCode || isNaN(Number(stateCode)) || Number(stateCode) <= 0) {
        newErrors.stateCode = "Valid positive integer state code is required.";
      }
    } else if (type === "district") {
      if (!selectedStateCodeForDistrict) newErrors.districtState = "Parent State must be selected.";
      if (!districtName.trim()) newErrors.districtName = "District name is required.";
      if (!districtCode || isNaN(Number(districtCode)) || Number(districtCode) <= 0) {
        newErrors.districtCode = "Valid positive integer district code is required.";
      }
    } else if (type === "subdivision") {
      if (!selectedDistrictCodeForSubDiv) newErrors.subDivDistrict = "Parent District must be selected.";
      if (!subDivisionName.trim()) newErrors.subDivisionName = "Sub-Division name is required.";
      if (!subDivisionCode || isNaN(Number(subDivisionCode)) || Number(subDivisionCode) <= 0) {
        newErrors.subDivisionCode = "Valid positive integer sub-division code is required.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (type === "state") {
        const payload = {
          state_name: stateName.trim(),
          state_code: Number(stateCode),
        };

        if (isEditMode) {
          const res = await api.updateState(locationToEdit._id, payload);
          if (res.success) {
            toast.success(res.message || "State updated successfully!");
            onLocationSaved();
            onClose();
          } else {
            toast.error(res.message || "Failed to update state.");
          }
        } else {
          const res = await api.createState(payload);
          if (res.success) {
            toast.success(res.message || "State created successfully!");
            onLocationSaved();
            onClose();
          } else {
            toast.error(res.message || "Failed to create state.");
          }
        }
      } else if (type === "district") {
        const payload = {
          state_code: Number(selectedStateCodeForDistrict),
          district_name: districtName.trim(),
          district_code: Number(districtCode),
        };

        if (isEditMode) {
          const res = await api.updateDistrict(locationToEdit._id, payload);
          if (res.success) {
            toast.success(res.message || "District updated successfully!");
            onLocationSaved();
            onClose();
          } else {
            toast.error(res.message || "Failed to update district.");
          }
        } else {
          const res = await api.createDistrict(payload);
          if (res.success) {
            toast.success(res.message || "District created successfully!");
            onLocationSaved();
            onClose();
          } else {
            toast.error(res.message || "Failed to create district.");
          }
        }
      } else if (type === "subdivision") {
        const payload = {
          district_code: Number(selectedDistrictCodeForSubDiv),
          sub_division_name: subDivisionName.trim(),
          sub_division_code: Number(subDivisionCode),
        };

        if (isEditMode) {
          const res = await api.updateSubDivision(locationToEdit._id, payload);
          if (res.success) {
            toast.success(res.message || "Sub-Division updated successfully!");
            onLocationSaved();
            onClose();
          } else {
            toast.error(res.message || "Failed to update sub-division.");
          }
        } else {
          const res = await api.createSubDivision(payload);
          if (res.success) {
            toast.success(res.message || "Sub-Division created successfully!");
            onLocationSaved();
            onClose();
          } else {
            toast.error(res.message || "Failed to create sub-division.");
          }
        }
      }
    } catch (err) {
      console.error("Error saving location:", err);
      toast.error(err.message || "Failed to save location.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Selected state for subdivision to filter districts
  const currentSubDivStateObj = locationHierarchy.find(
    (st) => st.state_code.toString() === selectedStateCodeForSubDiv
  );
  const availableDistrictsForSubDiv = currentSubDivStateObj?.districts || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                {isEditMode ? `Edit ${type === "state" ? "State" : type === "district" ? "District" : "Sub-Division"}` : "Add New Location"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isEditMode ? "Modify details with hierarchy validation" : "Select hierarchy level and add location"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Level Type Selector (Only in Create Mode) */}
        {!isEditMode && (
          <div className="p-4 bg-slate-100/70 border-b border-slate-200/60">
            <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">
              Select Hierarchy Level:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange("state")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                  type === "state"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
                }`}
              >
                <Map size={14} />
                <span>1. State</span>
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange("district")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                  type === "district"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
                }`}
              >
                <Building2 size={14} />
                <span>2. District</span>
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange("subdivision")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                  type === "subdivision"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
                }`}
              >
                <Navigation size={14} />
                <span>3. Sub-Division</span>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* STATE FIELDS */}
          {type === "state" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  State Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  placeholder="e.g. GUJARAT, MAHARASHTRA"
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all ${
                    errors.stateName ? "border-red-400 bg-red-50/20" : "border-slate-200"
                  }`}
                />
                {errors.stateName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.stateName}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    State Code <span className="text-red-500">*</span>
                  </label>
                  {!isEditMode && (
                    <button
                      type="button"
                      onClick={() => fetchNextCode("state")}
                      disabled={fetchingCode}
                      className="text-[11px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      <Sparkles size={12} />
                      {fetchingCode ? "Calculating..." : "Auto-generate Code"}
                    </button>
                  )}
                </div>
                <input
                  type="number"
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value)}
                  placeholder="e.g. 24"
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all ${
                    errors.stateCode ? "border-red-400 bg-red-50/20" : "border-slate-200"
                  }`}
                />
                {errors.stateCode && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.stateCode}
                  </p>
                )}
                <p className="text-[11px] text-slate-400 mt-1">
                  Sequential numeric code uniquely identifying the state.
                </p>
              </div>
            </>
          )}

          {/* DISTRICT FIELDS */}
          {type === "district" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Parent State <span className="text-red-500">* (Hierarchy)</span>
                </label>
                <select
                  value={selectedStateCodeForDistrict}
                  onChange={(e) => setSelectedStateCodeForDistrict(e.target.value)}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all ${
                    errors.districtState ? "border-red-400" : "border-slate-200"
                  }`}
                >
                  <option value="">-- Select Parent State --</option>
                  {locationHierarchy.map((st) => (
                    <option key={st._id || st.state_code} value={st.state_code}>
                      {st.state_name} (Code: {st.state_code})
                    </option>
                  ))}
                </select>
                {errors.districtState && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.districtState}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  District Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={districtName}
                  onChange={(e) => setDistrictName(e.target.value)}
                  placeholder="e.g. AHMEDABAD, SURAT, PUNE"
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all ${
                    errors.districtName ? "border-red-400 bg-red-50/20" : "border-slate-200"
                  }`}
                />
                {errors.districtName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.districtName}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    District Code <span className="text-red-500">*</span>
                  </label>
                  {!isEditMode && (
                    <button
                      type="button"
                      onClick={() => fetchNextCode("district")}
                      disabled={fetchingCode}
                      className="text-[11px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      <Sparkles size={12} />
                      {fetchingCode ? "Calculating..." : "Auto-generate Code"}
                    </button>
                  )}
                </div>
                <input
                  type="number"
                  value={districtCode}
                  onChange={(e) => setDistrictCode(e.target.value)}
                  placeholder="e.g. 438"
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all ${
                    errors.districtCode ? "border-red-400 bg-red-50/20" : "border-slate-200"
                  }`}
                />
                {errors.districtCode && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.districtCode}
                  </p>
                )}
                <p className="text-[11px] text-slate-400 mt-1">
                  Sequential numeric code uniquely identifying the district.
                </p>
              </div>
            </>
          )}

          {/* SUB-DIVISION FIELDS */}
          {type === "subdivision" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  1. Filter State <span className="text-slate-400 font-normal">(to view districts)</span>
                </label>
                <select
                  value={selectedStateCodeForSubDiv}
                  onChange={(e) => handleSubDivStateChange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                >
                  <option value="">-- Select State --</option>
                  {locationHierarchy.map((st) => (
                    <option key={st._id || st.state_code} value={st.state_code}>
                      {st.state_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  2. Parent District <span className="text-red-500">* (Hierarchy)</span>
                </label>
                <select
                  value={selectedDistrictCodeForSubDiv}
                  onChange={(e) => setSelectedDistrictCodeForSubDiv(e.target.value)}
                  disabled={availableDistrictsForSubDiv.length === 0}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all ${
                    errors.subDivDistrict ? "border-red-400" : "border-slate-200"
                  }`}
                >
                  <option value="">
                    {availableDistrictsForSubDiv.length === 0
                      ? "-- No districts found for selected state --"
                      : "-- Select Parent District --"}
                  </option>
                  {availableDistrictsForSubDiv.map((dist) => (
                    <option key={dist._id || dist.district_code} value={dist.district_code}>
                      {dist.district_name} (Code: {dist.district_code})
                    </option>
                  ))}
                </select>
                {errors.subDivDistrict && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.subDivDistrict}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Sub-Division / Taluka / City Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={subDivisionName}
                  onChange={(e) => setSubDivisionName(e.target.value)}
                  placeholder="e.g. Ahmadabad City, Daskroi, Sanand"
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all ${
                    errors.subDivisionName ? "border-red-400 bg-red-50/20" : "border-slate-200"
                  }`}
                />
                {errors.subDivisionName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.subDivisionName}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Sub-Division Code <span className="text-red-500">*</span>
                  </label>
                  {!isEditMode && (
                    <button
                      type="button"
                      onClick={() => fetchNextCode("subdivision")}
                      disabled={fetchingCode}
                      className="text-[11px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      <Sparkles size={12} />
                      {fetchingCode ? "Calculating..." : "Auto-generate Code"}
                    </button>
                  )}
                </div>
                <input
                  type="number"
                  value={subDivisionCode}
                  onChange={(e) => setSubDivisionCode(e.target.value)}
                  placeholder="e.g. 3812"
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all ${
                    errors.subDivisionCode ? "border-red-400 bg-red-50/20" : "border-slate-200"
                  }`}
                />
                {errors.subDivisionCode && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.subDivisionCode}
                  </p>
                )}
                <p className="text-[11px] text-slate-400 mt-1">
                  Sequential numeric code uniquely identifying the sub-division.
                </p>
              </div>
            </>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />}
              <span>{isEditMode ? "Save Changes" : "Create Location"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationModal;
