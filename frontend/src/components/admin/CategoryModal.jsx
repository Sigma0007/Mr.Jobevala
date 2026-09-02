import React, { useState, useEffect } from "react";
import { X, Loader2, Sparkles, FolderPlus, Edit3, Plus, Trash2, Tag } from "lucide-react";
import api from "../../customer/customerservice";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setAllCategoriesType } from "../../Redux/Dashboard/DashboardAction";

const CategoryModal = ({
  isOpen,
  onClose,
  categoryToEdit,
  onCategorySaved,
}) => {
  const dispatch = useDispatch();
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [roles, setRoles] = useState([]);
  const [newRoleLabel, setNewRoleLabel] = useState("");
  const [newRoleValue, setNewRoleValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);
  const [autoRoleSlug, setAutoRoleSlug] = useState(true);

  useEffect(() => {
    if (categoryToEdit) {
      setLabel(categoryToEdit.label || "");
      setValue(categoryToEdit.value || "");
      setRoles(Array.isArray(categoryToEdit.roles) ? [...categoryToEdit.roles] : []);
      setAutoSlug(false);
    } else {
      setLabel("");
      setValue("");
      setRoles([]);
      setAutoSlug(true);
    }
    setNewRoleLabel("");
    setNewRoleValue("");
    setAutoRoleSlug(true);
  }, [categoryToEdit, isOpen]);

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/(^_|_$)/g, "");
  };

  const handleLabelChange = (e) => {
    const newLabel = e.target.value;
    setLabel(newLabel);
    if (autoSlug && !categoryToEdit) {
      setValue(generateSlug(newLabel));
    }
  };

  const handleValueChange = (e) => {
    setValue(e.target.value);
    setAutoSlug(false);
  };

  const handleNewRoleLabelChange = (e) => {
    const text = e.target.value;
    setNewRoleLabel(text);
    if (autoRoleSlug) {
      setNewRoleValue(generateSlug(text));
    }
  };

  const handleNewRoleValueChange = (e) => {
    setNewRoleValue(e.target.value);
    setAutoRoleSlug(false);
  };

  const handleAddRole = (e) => {
    e?.preventDefault();
    const cleanLabel = newRoleLabel.trim();
    const cleanValue = newRoleValue.trim() ? newRoleValue.trim() : generateSlug(cleanLabel);

    if (!cleanLabel) {
      toast.error("Role label cannot be empty.");
      return;
    }

    if (roles.some((r) => r.value === cleanValue)) {
      toast.error("A role with this value/slug already exists in this category.");
      return;
    }

    setRoles((prev) => [...prev, { label: cleanLabel, value: cleanValue }]);
    setNewRoleLabel("");
    setNewRoleValue("");
    setAutoRoleSlug(true);
  };

  const handleRemoveRole = (indexToRemove) => {
    setRoles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!label.trim()) {
      toast.error("Category label is required.");
      return;
    }

    const cleanValue = value.trim() ? value.trim() : generateSlug(label);

    const payload = {
      label: label.trim(),
      value: cleanValue,
      roles: roles,
    };

    setLoading(true);
    try {
      if (categoryToEdit) {
        const res = await api.updateCategory(categoryToEdit._id, payload);
        if (res.success) {
          toast.success(res.message || "Category updated successfully!");
          // Refresh category list in Redux
          const catRes = await api.getCategories();
          if (catRes.success) {
            dispatch(setAllCategoriesType(catRes.data));
          }
          if (onCategorySaved) onCategorySaved();
          onClose();
        } else {
          toast.error(res.message || "Failed to update category.");
        }
      } else {
        const res = await api.createCategory(payload);
        if (res.success) {
          toast.success(res.message || "Category created successfully!");
          // Refresh category list in Redux
          const catRes = await api.getCategories();
          if (catRes.success) {
            dispatch(setAllCategoriesType(catRes.data));
          }
          if (onCategorySaved) onCategorySaved();
          onClose();
        } else {
          toast.error(res.message || "Failed to create category.");
        }
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error(error.message || "An error occurred while saving category.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-slate-100 transform transition-all">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              {categoryToEdit ? <Edit3 size={20} /> : <FolderPlus size={20} />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {categoryToEdit ? "Edit Category" : "Add New Category"}
              </h2>
              <p className="text-xs text-slate-500">
                {categoryToEdit
                  ? "Update category information and its sub-roles"
                  : "Create a new category with roles for job postings"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
            {/* Category Label */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Category Label <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={label}
                onChange={handleLabelChange}
                placeholder="e.g. Banking, Financial Services & Insurance"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 placeholder:text-slate-400 text-sm transition-all"
              />
            </div>

            {/* Category Slug / Value Identifier */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Slug / Value Identifier <span className="text-red-500">*</span>
                </label>
                {!categoryToEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      setAutoSlug(true);
                      setValue(generateSlug(label));
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
                  >
                    <Sparkles size={12} /> Auto-generate
                  </button>
                )}
              </div>
              <input
                type="text"
                value={value}
                onChange={handleValueChange}
                placeholder="e.g. banking_financial_services_insurance"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 placeholder:text-slate-400 text-sm font-mono transition-all"
              />
              <p className="text-xs text-slate-500 mt-1">
                Unique identifier used in API filters, database relations, and URLs.
              </p>
            </div>

            {/* Sub-Roles Section */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Tag size={16} className="text-blue-600" />
                  <span>Sub-Roles / Positions</span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
                    {roles.length}
                  </span>
                </label>
              </div>

              {/* Add New Role Box */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3 mb-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Role Title
                    </label>
                    <input
                      type="text"
                      value={newRoleLabel}
                      onChange={handleNewRoleLabelChange}
                      placeholder="e.g. Banking Operations"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-medium text-slate-600">
                        Role Slug
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setAutoRoleSlug(true);
                          setNewRoleValue(generateSlug(newRoleLabel));
                        }}
                        className="text-[11px] text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Auto
                      </button>
                    </div>
                    <input
                      type="text"
                      value={newRoleValue}
                      onChange={handleNewRoleValueChange}
                      placeholder="e.g. banking_operations"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddRole}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Plus size={14} /> Add Role
                  </button>
                </div>
              </div>

              {/* Roles List */}
              {roles.length === 0 ? (
                <div className="text-center py-5 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-slate-400 text-xs">
                  No roles added to this category yet. Use the form above to add sub-roles.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {roles.map((role, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 bg-white border border-slate-200/80 rounded-xl shadow-xs hover:border-slate-300 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 min-w-0">
                        <span className="text-xs font-semibold text-slate-800 truncate">
                          {role.label}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md w-fit">
                          {role.value}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveRole(idx)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2 shrink-0"
                        title="Remove role"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium text-sm disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm hover:shadow transition-all font-medium text-sm flex items-center gap-2 disabled:opacity-70"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {categoryToEdit ? "Save Changes" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
