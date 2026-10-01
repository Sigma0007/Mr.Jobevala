import React, { useState, useEffect } from "react";
import api from "../../customer/customerservice";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Building2,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "react-hot-toast";
import MarqueeModal from "./MarqueeModal";

const AdminMarqueeList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyToEdit, setCompanyToEdit] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const fetchMarqueeCompanies = async () => {
    setLoading(true);
    try {
      const response = await api.getAdminMarqueeCompanies();
      if (response.success) {
        setCompanies(response.data || []);
      } else {
        toast.error(response.message || "Failed to load partner companies.");
      }
    } catch (error) {
      console.error("Error fetching partner companies:", error);
      toast.error("Failed to load partner companies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarqueeCompanies();
  }, []);

  const handleAddNew = () => {
    setCompanyToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (company) => {
    setCompanyToEdit(company);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    setTogglingId(id);
    try {
      const response = await api.toggleMarqueeCompanyStatus(id, {
        isActive: !currentStatus,
      });
      if (response.success) {
        toast.success(
          !currentStatus
            ? "Company is now visible on home marquee"
            : "Company hidden from home marquee"
        );
        setCompanies((prev) =>
          prev.map((c) =>
            c._id === id ? { ...c, isActive: !currentStatus } : c
          )
        );
      } else {
        toast.error(response.message || "Failed to toggle status.");
      }
    } catch (error) {
      console.error("Error toggling company status:", error);
      toast.error("Failed to update status.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${name}" from the marquee? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await api.deleteMarqueeCompany(id);
      if (response.success) {
        toast.success(response.message || "Company deleted successfully!");
        setCompanies((prev) => prev.filter((c) => c._id !== id));
      } else {
        toast.error(response.message || "Failed to delete company.");
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error(error.message || "Failed to delete company.");
    }
  };

  const handleSeedDefaults = async () => {
    if (
      !window.confirm(
        "Would you like to seed / reset default top hiring brands (Google, Microsoft, Amazon, Spotify, Netflix, Airbnb, Slack, Uber)?"
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.seedMarqueeCompanies({ reset: false });
      if (response.success) {
        toast.success("Default partner brands seeded successfully!");
        setCompanies(response.data || []);
      } else {
        toast.error(response.message || "Failed to seed companies.");
      }
    } catch (error) {
      console.error("Error seeding default companies:", error);
      toast.error("Failed to seed companies.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter((c) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    const matchName = c.name?.toLowerCase().includes(term);
    const matchWebsite = c.websiteUrl?.toLowerCase().includes(term);
    return matchName || matchWebsite;
  });

  const activeCount = companies.filter((c) => c.isActive).length;
  const inactiveCount = companies.length - activeCount;

  return (
    <div className="space-y-6">
      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Brands
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {companies.length}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Building2 size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Live in Marquee
            </p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">
              {activeCount}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Hidden / Inactive
            </p>
            <h3 className="text-2xl font-bold text-slate-500 mt-1">
              {inactiveCount}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
            <EyeOff size={20} />
          </div>
        </div>
      </div>

      {/* Action and Search Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search company name or website..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMarqueeCompanies}
            className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={handleSeedDefaults}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition-all cursor-pointer"
            title="Seed default top brands"
          >
            <Sparkles size={16} className="text-amber-500" />
            <span className="hidden md:inline">Seed Defaults</span>
          </button>
          <button
            onClick={handleAddNew}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <Plus size={18} />
            <span>Add Company</span>
          </button>
        </div>
      </div>

      {/* Companies Table Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 size={20} className="text-blue-600" />
            <h2 className="font-bold text-slate-900 text-base">
              Marquee Partner Brands
            </h2>
          </div>
          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
            {companies.length} Total Registered
          </span>
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-400">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
            <p className="text-sm font-medium">Loading partner brands...</p>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Building2 size={24} />
            </div>
            <h3 className="text-base font-semibold text-slate-800">
              No partner companies found
            </h3>
            <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
              {searchTerm
                ? "No brands match your search query."
                : "No partner brands have been added yet."}
            </p>
            {!searchTerm && (
              <div className="flex items-center justify-center gap-3 mt-4">
                <button
                  onClick={handleAddNew}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={16} /> Add First Brand
                </button>
                <button
                  onClick={handleSeedDefaults}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles size={16} className="text-amber-500" /> Load Default Logos
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Priority</th>
                  <th className="py-4 px-6">Logo</th>
                  <th className="py-4 px-6">Company Name</th>
                  <th className="py-4 px-6">Website Link</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCompanies.map((company, index) => {
                  const isToggling = togglingId === company._id;

                  return (
                    <tr
                      key={company._id || index}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Priority Order */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-mono text-xs font-bold">
                          {company.order !== undefined ? company.order : index + 1}
                        </span>
                      </td>

                      {/* Logo Preview */}
                      <td className="py-4 px-6">
                        <div className="w-20 h-10 bg-white rounded-xl border border-slate-200/80 p-1.5 flex items-center justify-center shadow-2xs group-hover:border-blue-300 transition-all">
                          <img
                            src={company.logo}
                            alt={`${company.name} logo`}
                            className="max-h-7 max-w-full object-contain"
                            onError={(e) => {
                              e.target.src =
                                "https://placehold.co/100x40?text=Logo";
                            }}
                          />
                        </div>
                      </td>

                      {/* Company Name */}
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900 text-sm">
                          {company.name}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          ID: {company._id?.slice(-6)}
                        </span>
                      </td>

                      {/* Website Link */}
                      <td className="py-4 px-6">
                        {company.websiteUrl ? (
                          <a
                            href={company.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 hover:underline max-w-[200px] truncate"
                          >
                            <span className="truncate">{company.websiteUrl}</span>
                            <ExternalLink size={12} className="shrink-0" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            No website link
                          </span>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() =>
                            handleToggleStatus(company._id, company.isActive)
                          }
                          disabled={isToggling}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            company.isActive
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200/60"
                          } ${isToggling ? "opacity-50" : ""}`}
                          title="Click to toggle visibility"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              company.isActive
                                ? "bg-emerald-500"
                                : "bg-slate-400"
                            }`}
                          />
                          <span>{company.isActive ? "Active" : "Hidden"}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleEdit(company)}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit brand"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(company._id, company.name)
                            }
                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete brand"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Marquee Modal for Add/Edit */}
      <MarqueeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        companyToEdit={companyToEdit}
        onCompanySaved={fetchMarqueeCompanies}
      />
    </div>
  );
};

export default AdminMarqueeList;
