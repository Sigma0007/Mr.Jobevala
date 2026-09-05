import React, { useState, useEffect } from "react";
import api from "../../customer/customerservice";
import {
  MapPin,
  Plus,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight,
  Map,
  Building2,
  Navigation,
  Layers,
  FolderTree,
  Filter,
} from "lucide-react";
import { toast } from "react-hot-toast";
import LocationModal from "./LocationModal";

const AdminLocationsList = () => {
  const [hierarchyData, setHierarchyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("tree"); // 'tree', 'states', 'districts', 'subdivisions'

  // Filters for flat table modes
  const [selectedStateFilter, setSelectedStateFilter] = useState("");
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState("");

  // Tree expanded states
  const [expandedStates, setExpandedStates] = useState({});
  const [expandedDistricts, setExpandedDistricts] = useState({});

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialType, setModalInitialType] = useState("state");
  const [locationToEdit, setLocationToEdit] = useState(null);

  const fetchLocationsHierarchy = async () => {
    setLoading(true);
    try {
      const response = await api.getLocationsHierarchy();
      if (response.success && Array.isArray(response.data)) {
        setHierarchyData(response.data);
      } else {
        toast.error(response.message || "Failed to load locations.");
      }
    } catch (error) {
      console.error("Error fetching locations hierarchy:", error);
      toast.error("Failed to load locations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationsHierarchy();
  }, []);

  // Compute total counts
  const totalStates = hierarchyData.length;
  let totalDistricts = 0;
  let totalSubDivisions = 0;

  hierarchyData.forEach((st) => {
    totalDistricts += st.districts?.length || 0;
    st.districts?.forEach((d) => {
      totalSubDivisions += d.subDivisions?.length || 0;
    });
  });

  // Flat lists for table views
  const flatStates = hierarchyData;
  const flatDistricts = hierarchyData.flatMap((st) =>
    (st.districts || []).map((d) => ({
      ...d,
      parent_state_name: st.state_name,
      parent_state_code: st.state_code,
    }))
  );
  const flatSubDivisions = hierarchyData.flatMap((st) =>
    (st.districts || []).flatMap((d) =>
      (d.subDivisions || []).map((sub) => ({
        ...sub,
        parent_district_name: d.district_name,
        parent_district_code: d.district_code,
        parent_state_name: st.state_name,
        parent_state_code: st.state_code,
      }))
    )
  );

  // Toggle tree accordion
  const toggleStateExpand = (stateCode) => {
    setExpandedStates((prev) => ({
      ...prev,
      [stateCode]: !prev[stateCode],
    }));
  };

  const toggleDistrictExpand = (districtCode) => {
    setExpandedDistricts((prev) => ({
      ...prev,
      [districtCode]: !prev[districtCode],
    }));
  };

  // Add / Edit Handlers
  const handleAddNew = (type = "state") => {
    setLocationToEdit(null);
    setModalInitialType(type);
    setIsModalOpen(true);
  };

  const handleEditState = (state) => {
    setLocationToEdit({
      _id: state._id,
      type: "state",
      state_name: state.state_name,
      state_code: state.state_code,
    });
    setModalInitialType("state");
    setIsModalOpen(true);
  };

  const handleEditDistrict = (district, stateCode) => {
    setLocationToEdit({
      _id: district._id,
      type: "district",
      district_name: district.district_name,
      district_code: district.district_code,
      state_code: district.state_code || stateCode,
    });
    setModalInitialType("district");
    setIsModalOpen(true);
  };

  const handleEditSubDivision = (subDivision, districtCode) => {
    setLocationToEdit({
      _id: subDivision._id,
      type: "subdivision",
      sub_division_name: subDivision.sub_division_name,
      sub_division_code: subDivision.sub_division_code,
      district_code: subDivision.district_code || districtCode,
    });
    setModalInitialType("subdivision");
    setIsModalOpen(true);
  };

  // Delete Handlers
  const handleDeleteState = async (state) => {
    if (state.districts && state.districts.length > 0) {
      toast.error(
        `Cannot delete State "${state.state_name}" because it contains ${state.districts.length} district(s). Please delete child districts first.`
      );
      return;
    }

    if (!window.confirm(`Are you sure you want to delete State "${state.state_name}" (Code: ${state.state_code})?`)) {
      return;
    }

    try {
      const res = await api.deleteState(state._id);
      if (res.success) {
        toast.success(res.message || "State deleted successfully.");
        fetchLocationsHierarchy();
      } else {
        toast.error(res.message || "Failed to delete state.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete state.");
    }
  };

  const handleDeleteDistrict = async (district) => {
    if (district.subDivisions && district.subDivisions.length > 0) {
      toast.error(
        `Cannot delete District "${district.district_name}" because it contains ${district.subDivisions.length} sub-division(s). Please delete child sub-divisions first.`
      );
      return;
    }

    if (!window.confirm(`Are you sure you want to delete District "${district.district_name}" (Code: ${district.district_code})?`)) {
      return;
    }

    try {
      const res = await api.deleteDistrict(district._id);
      if (res.success) {
        toast.success(res.message || "District deleted successfully.");
        fetchLocationsHierarchy();
      } else {
        toast.error(res.message || "Failed to delete district.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete district.");
    }
  };

  const handleDeleteSubDivision = async (subDivision) => {
    if (!window.confirm(`Are you sure you want to delete Sub-Division "${subDivision.sub_division_name}" (Code: ${subDivision.sub_division_code})?`)) {
      return;
    }

    try {
      const res = await api.deleteSubDivision(subDivision._id);
      if (res.success) {
        toast.success(res.message || "Sub-Division deleted successfully.");
        fetchLocationsHierarchy();
      } else {
        toast.error(res.message || "Failed to delete sub-division.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete sub-division.");
    }
  };

  // Filtered queries
  const term = searchTerm.toLowerCase().trim();

  const filteredTreeData = hierarchyData
    .map((st) => {
      const matchState = st.state_name?.toLowerCase().includes(term) || st.state_code?.toString().includes(term);

      const matchedDistricts = (st.districts || [])
        .map((dist) => {
          const matchDist = dist.district_name?.toLowerCase().includes(term) || dist.district_code?.toString().includes(term);

          const matchedSubDivs = (dist.subDivisions || []).filter(
            (sub) => sub.sub_division_name?.toLowerCase().includes(term) || sub.sub_division_code?.toString().includes(term)
          );

          if (matchDist || matchedSubDivs.length > 0) {
            return {
              ...dist,
              subDivisions: term ? (matchDist ? dist.subDivisions : matchedSubDivs) : dist.subDivisions,
            };
          }
          return null;
        })
        .filter(Boolean);

      if (matchState || matchedDistricts.length > 0) {
        return {
          ...st,
          districts: term ? (matchState ? st.districts : matchedDistricts) : st.districts,
        };
      }
      return null;
    })
    .filter(Boolean);

  const filteredFlatStates = flatStates.filter(
    (st) => !term || st.state_name?.toLowerCase().includes(term) || st.state_code?.toString().includes(term)
  );

  const filteredFlatDistricts = flatDistricts.filter((dist) => {
    if (selectedStateFilter && dist.state_code?.toString() !== selectedStateFilter) return false;
    if (!term) return true;
    return (
      dist.district_name?.toLowerCase().includes(term) ||
      dist.district_code?.toString().includes(term) ||
      dist.parent_state_name?.toLowerCase().includes(term)
    );
  });

  const filteredFlatSubDivisions = flatSubDivisions.filter((sub) => {
    if (selectedStateFilter && sub.parent_state_code?.toString() !== selectedStateFilter) return false;
    if (selectedDistrictFilter && sub.parent_district_code?.toString() !== selectedDistrictFilter) return false;
    if (!term) return true;
    return (
      sub.sub_division_name?.toLowerCase().includes(term) ||
      sub.sub_division_code?.toString().includes(term) ||
      sub.parent_district_name?.toLowerCase().includes(term) ||
      sub.parent_state_name?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">States</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalStates}</h3>
            <p className="text-xs text-slate-400 mt-1">Level 1 hierarchy</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Map size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Districts</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalDistricts}</h3>
            <p className="text-xs text-slate-400 mt-1">Level 2 hierarchy</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Building2 size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sub-Divisions / Talukas</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalSubDivisions}</h3>
            <p className="text-xs text-slate-400 mt-1">Level 3 hierarchy</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
            <Navigation size={22} />
          </div>
        </div>
      </div>

      {/* Toolbar & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search state, district, or sub-division..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          />
        </div>

        {/* View Switcher Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 overflow-x-auto">
          <button
            onClick={() => setViewMode("tree")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              viewMode === "tree" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FolderTree size={14} />
            <span>Tree View</span>
          </button>
          <button
            onClick={() => setViewMode("states")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              viewMode === "states" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Map size={14} />
            <span>States ({totalStates})</span>
          </button>
          <button
            onClick={() => setViewMode("districts")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              viewMode === "districts" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building2 size={14} />
            <span>Districts ({totalDistricts})</span>
          </button>
          <button
            onClick={() => setViewMode("subdivisions")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              viewMode === "subdivisions" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Navigation size={14} />
            <span>Sub-Divisions ({totalSubDivisions})</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={fetchLocationsHierarchy}
            className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            title="Refresh locations"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>

          <button
            onClick={() => handleAddNew(viewMode === "districts" ? "district" : viewMode === "subdivisions" ? "subdivision" : "state")}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-sm hover:shadow transition-all whitespace-nowrap"
          >
            <Plus size={18} />
            <span>Add Location</span>
          </button>
        </div>
      </div>

      {/* Optional Secondary Filter bar for Flat Modes */}
      {(viewMode === "districts" || viewMode === "subdivisions") && (
        <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
            <Filter size={14} />
            <span>Filter By:</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">State:</span>
            <select
              value={selectedStateFilter}
              onChange={(e) => {
                setSelectedStateFilter(e.target.value);
                setSelectedDistrictFilter("");
              }}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All States</option>
              {hierarchyData.map((st) => (
                <option key={st._id || st.state_code} value={st.state_code}>
                  {st.state_name}
                </option>
              ))}
            </select>
          </div>

          {viewMode === "subdivisions" && (
            <div className="flex items-center gap-2">
              <span className="text-slate-500">District:</span>
              <select
                value={selectedDistrictFilter}
                onChange={(e) => setSelectedDistrictFilter(e.target.value)}
                disabled={!selectedStateFilter}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="">All Districts</option>
                {(
                  hierarchyData.find((st) => st.state_code.toString() === selectedStateFilter)?.districts || []
                ).map((d) => (
                  <option key={d._id || d.district_code} value={d.district_code}>
                    {d.district_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(selectedStateFilter || selectedDistrictFilter) && (
            <button
              onClick={() => {
                setSelectedStateFilter("");
                setSelectedDistrictFilter("");
              }}
              className="text-blue-600 hover:text-blue-800 font-medium ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center shadow-sm">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3" />
          <p className="text-sm font-medium text-slate-500">Loading hierarchical location records...</p>
        </div>
      ) : (
        <>
          {/* 1. HIERARCHY TREE VIEW */}
          {viewMode === "tree" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderTree size={20} className="text-blue-600" />
                  <h2 className="font-bold text-slate-900 text-base">Hierarchy Explorer (State &rarr; District &rarr; Sub-Division)</h2>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {filteredTreeData.length} States Displayed
                </span>
              </div>

              {filteredTreeData.length === 0 ? (
                <div className="p-16 text-center">
                  <MapPin size={32} className="mx-auto text-slate-300 mb-2" />
                  <h3 className="font-semibold text-slate-700 text-sm">No locations found</h3>
                  <p className="text-xs text-slate-400 mt-1">Try adjusting your search term.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredTreeData.map((state) => {
                    const isStateOpen = !!expandedStates[state.state_code] || !!term;
                    const districts = state.districts || [];

                    return (
                      <div key={state._id || state.state_code} className="transition-colors">
                        {/* State Header Row */}
                        <div className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-100/70 transition-colors">
                          <div
                            onClick={() => toggleStateExpand(state.state_code)}
                            className="flex items-center gap-3 cursor-pointer flex-1 select-none"
                          >
                            <button className="p-1 text-slate-400 hover:text-slate-700 transition-transform">
                              {isStateOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </button>
                            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                              {state.state_code}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm">{state.state_name}</h4>
                              <p className="text-[11px] text-slate-500">
                                State Code: <span className="font-mono">{state.state_code}</span> &bull; {districts.length} Districts
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setModalInitialType("district");
                                setLocationToEdit(null);
                                setIsModalOpen(true);
                              }}
                              className="px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                              title="Add District to this State"
                            >
                              <Plus size={14} /> Add District
                            </button>
                            <button
                              onClick={() => handleEditState(state)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit State"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteState(state)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete State"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        {/* Districts Accordion */}
                        {isStateOpen && (
                          <div className="pl-8 pr-4 py-2 bg-white space-y-2 border-t border-slate-100">
                            {districts.length === 0 ? (
                              <p className="text-xs text-slate-400 py-2 pl-4 italic">No districts registered in this state.</p>
                            ) : (
                              districts.map((district) => {
                                const isDistrictOpen = !!expandedDistricts[district.district_code] || !!term;
                                const subDivs = district.subDivisions || [];

                                return (
                                  <div
                                    key={district._id || district.district_code}
                                    className="border border-slate-200/70 rounded-xl overflow-hidden bg-slate-50/20"
                                  >
                                    {/* District Header Row */}
                                    <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50/70 hover:bg-slate-100/50 transition-colors">
                                      <div
                                        onClick={() => toggleDistrictExpand(district.district_code)}
                                        className="flex items-center gap-2.5 cursor-pointer flex-1 select-none"
                                      >
                                        <button className="p-0.5 text-slate-400">
                                          {isDistrictOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                                        </button>
                                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[11px] font-mono font-bold">
                                          {district.district_code}
                                        </span>
                                        <div>
                                          <span className="font-semibold text-slate-800 text-xs">{district.district_name}</span>
                                          <span className="text-[10px] text-slate-400 ml-2">({subDivs.length} Sub-Divisions)</span>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => {
                                            setModalInitialType("subdivision");
                                            setLocationToEdit(null);
                                            setIsModalOpen(true);
                                          }}
                                          className="px-2 py-1 text-[11px] font-medium text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1"
                                          title="Add Sub-Division to this District"
                                        >
                                          <Plus size={12} /> Add Sub-Div
                                        </button>
                                        <button
                                          onClick={() => handleEditDistrict(district, state.state_code)}
                                          className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                                          title="Edit District"
                                        >
                                          <Edit2 size={13} />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteDistrict(district)}
                                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                          title="Delete District"
                                        >
                                          <Trash2 size={13} />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Sub-Divisions List */}
                                    {isDistrictOpen && (
                                      <div className="p-3 bg-white">
                                        {subDivs.length === 0 ? (
                                          <p className="text-[11px] text-slate-400 italic pl-2">No sub-divisions registered in this district.</p>
                                        ) : (
                                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                            {subDivs.map((sub) => (
                                              <div
                                                key={sub._id || sub.sub_division_code}
                                                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-colors"
                                              >
                                                <div className="min-w-0 pr-2">
                                                  <p className="text-xs font-medium text-slate-800 truncate">{sub.sub_division_name}</p>
                                                  <p className="text-[10px] font-mono text-purple-700 font-semibold">
                                                    Code: {sub.sub_division_code}
                                                  </p>
                                                </div>
                                                <div className="flex items-center gap-0.5">
                                                  <button
                                                    onClick={() => handleEditSubDivision(sub, district.district_code)}
                                                    className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Edit Sub-Division"
                                                  >
                                                    <Edit2 size={12} />
                                                  </button>
                                                  <button
                                                    onClick={() => handleDeleteSubDivision(sub)}
                                                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete Sub-Division"
                                                  >
                                                    <Trash2 size={12} />
                                                  </button>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 2. STATES TABLE VIEW */}
          {viewMode === "states" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-4 px-6">State Code</th>
                      <th className="py-4 px-6">State Name</th>
                      <th className="py-4 px-6">Child Districts</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredFlatStates.map((state) => (
                      <tr key={state._id || state.state_code} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6 font-mono font-bold text-xs text-blue-600">{state.state_code}</td>
                        <td className="py-4 px-6 font-semibold text-slate-900 text-sm">{state.state_name}</td>
                        <td className="py-4 px-6">
                          <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-semibold">
                            {state.districts?.length || 0} Districts
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditState(state)}
                              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit State"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteState(state)}
                              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete State"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. DISTRICTS TABLE VIEW */}
          {viewMode === "districts" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-4 px-6">District Code</th>
                      <th className="py-4 px-6">District Name</th>
                      <th className="py-4 px-6">Parent State</th>
                      <th className="py-4 px-6">Child Sub-Divisions</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredFlatDistricts.map((district) => (
                      <tr key={district._id || district.district_code} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6 font-mono font-bold text-xs text-emerald-700">{district.district_code}</td>
                        <td className="py-4 px-6 font-semibold text-slate-900 text-sm">{district.district_name}</td>
                        <td className="py-4 px-6 text-xs text-slate-600 font-medium">
                          {district.parent_state_name} <span className="text-slate-400 font-mono">({district.parent_state_code})</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-block px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-semibold">
                            {district.subDivisions?.length || 0} Sub-Divs
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditDistrict(district, district.parent_state_code)}
                              className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Edit District"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteDistrict(district)}
                              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete District"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. SUB-DIVISIONS TABLE VIEW */}
          {viewMode === "subdivisions" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-4 px-6">Sub-Div Code</th>
                      <th className="py-4 px-6">Sub-Division / Taluka / City</th>
                      <th className="py-4 px-6">Parent District</th>
                      <th className="py-4 px-6">Parent State</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredFlatSubDivisions.map((sub) => (
                      <tr key={sub._id || sub.sub_division_code} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6 font-mono font-bold text-xs text-purple-700">{sub.sub_division_code}</td>
                        <td className="py-4 px-6 font-semibold text-slate-900 text-sm">{sub.sub_division_name}</td>
                        <td className="py-4 px-6 text-xs text-slate-600 font-medium">{sub.parent_district_name}</td>
                        <td className="py-4 px-6 text-xs text-slate-600 font-medium">{sub.parent_state_name}</td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditSubDivision(sub, sub.parent_district_code)}
                              className="p-2 text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Edit Sub-Division"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteSubDivision(sub)}
                              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Sub-Division"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Dynamic Location Modal */}
      <LocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialType={modalInitialType}
        locationToEdit={locationToEdit}
        locationHierarchy={hierarchyData}
        onLocationSaved={fetchLocationsHierarchy}
      />
    </div>
  );
};

export default AdminLocationsList;
