import React, { useState, useEffect } from "react";
import { X, Loader2, Sparkles, FolderPlus, Edit3 } from "lucide-react";
import api from "../../customer/customerservice";
import { toast } from "react-hot-toast";

const CategoryModal = ({ isOpen, onClose, categoryToEdit, onCategorySaved }) => {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);

  useEffect(() => {
    if (categoryToEdit) {
      setTitle(categoryToEdit.title || "");
      setValue(categoryToEdit.value || "");
      setAutoSlug(false);
    } else {
      setTitle("");
      setValue("");
      setAutoSlug(true);
    }
  }, [categoryToEdit, isOpen]);

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (autoSlug && !categoryToEdit) {
      setValue(generateSlug(newTitle));
    }
  };

  const handleValueChange = (e) => {
    setValue(e.target.value);
    setAutoSlug(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Category title is required.");
      return;
    }

    const payload = {
      title: title.trim(),
      value: value.trim() ? value.trim() : generateSlug(title),
    };

    setLoading(true);
    try {
      if (categoryToEdit) {
        const res = await api.updateCategory(categoryToEdit._id, payload);
        if (res.success) {
          toast.success(res.message || "Category updated successfully!");
          onCategorySaved();
          onClose();
        } else {
          toast.error(res.message || "Failed to update category.");
        }
      } else {
        const res = await api.createCategory(payload);
        if (res.success) {
          toast.success(res.message || "Category added successfully!");
          onCategorySaved();
          onClose();
        } else {
          toast.error(res.message || "Failed to add category.");
        }
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("An error occurred while saving the category.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 transform transition-all">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50/50">
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
                  ? "Update category details below"
                  : "Create a new category for job listings"}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Category Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Software Development"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 placeholder:text-slate-400 text-sm transition-all"
              />
            </div>

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
                      setValue(generateSlug(title));
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
                placeholder="e.g. software-development"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 placeholder:text-slate-400 text-sm font-mono transition-all"
              />
              <p className="text-xs text-slate-500 mt-1.5">
                Used in URLs, filters, and database references.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
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
