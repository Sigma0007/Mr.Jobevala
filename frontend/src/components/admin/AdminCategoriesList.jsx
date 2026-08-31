import React, { useState, useEffect } from "react";
import api from "../../customer/customerservice";
import { Plus, Edit2, Trash2, Search, Layers, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import CategoryModal from "./CategoryModal";

const AdminCategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.getCategories();
      if (response.success) {
        setCategories(response.data || []);
      } else {
        toast.error(response.message || "Failed to load categories.");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddNew = () => {
    setCategoryToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setCategoryToEdit(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, title) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the category "${title}"?`,
      )
    ) {
      return;
    }

    try {
      const response = await api.deleteCategory(id);
      if (response.success) {
        toast.success(response.message || "Category deleted successfully!");
        setCategories((prev) => prev.filter((c) => c._id !== id));
      } else {
        toast.error(response.message || "Failed to delete category.");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category.");
    }
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.value.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
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
            placeholder="Search categories by title or slug..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCategories}
            className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            title="Refresh categories"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={handleAddNew}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-sm hover:shadow transition-all"
          >
            <Plus size={18} />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={20} className="text-blue-600" />
            <h2 className="font-bold text-slate-900 text-base">
              Categories List
            </h2>
          </div>
          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
            {categories.length} Total
          </span>
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-400">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
            <p className="text-sm font-medium">Loading categories...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Layers size={24} />
            </div>
            <h3 className="text-base font-semibold text-slate-800">
              No categories found
            </h3>
            <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
              {searchTerm
                ? "No categories match your search term. Try adjusting your search query."
                : "No categories have been created yet. Click 'Add Category' to get started."}
            </p>
            {!searchTerm && (
              <button
                onClick={handleAddNew}
                className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus size={16} /> Add First Category
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">#</th>
                  <th className="py-4 px-6">Category Title</th>
                  <th className="py-4 px-6">Slug / Value</th>
                  <th className="py-4 px-6">Created Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCategories.map((category, index) => (
                  <tr
                    key={category._id || index}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-4 px-6 text-xs text-slate-400 font-mono">
                      {index + 1}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900 text-sm">
                        {category.title}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-mono">
                        {category.value}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-sm">
                      {category.createdAt
                        ? new Date(category.createdAt).toLocaleDateString()
                        : "Predefined"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Category"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(category._id, category.title)
                          }
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Category"
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
        )}
      </div>

      {/* Category Modal for Add/Edit */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryToEdit={categoryToEdit}
        onCategorySaved={fetchCategories}
      />
    </div>
  );
};

export default AdminCategoriesList;
