import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Loader2,
  Building2,
  UploadCloud,
  Link,
  Globe,
  Hash,
  Eye,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import api from "../../customer/customerservice";
import { toast } from "react-hot-toast";

const MarqueeModal = ({
  isOpen,
  onClose,
  companyToEdit,
  onCompanySaved,
}) => {
  const [name, setName] = useState("");
  const [logoType, setLogoType] = useState("url"); // 'url' or 'upload'
  const [logoUrl, setLogoUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (companyToEdit) {
      setName(companyToEdit.name || "");
      setLogoUrl(companyToEdit.logo || "");
      setPreviewUrl(companyToEdit.logo || "");
      setWebsiteUrl(companyToEdit.websiteUrl || "");
      setOrder(companyToEdit.order !== undefined ? companyToEdit.order : 0);
      setIsActive(companyToEdit.isActive !== undefined ? companyToEdit.isActive : true);
      setSelectedFile(null);
      setLogoType("url");
    } else {
      setName("");
      setLogoUrl("");
      setPreviewUrl("");
      setSelectedFile(null);
      setWebsiteUrl("");
      setOrder(0);
      setIsActive(true);
      setLogoType("url");
    }
  }, [companyToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file (PNG, JPG, SVG, WEBP)");
        return;
      }
      setSelectedFile(file);
      const objUrl = URL.createObjectURL(file);
      setPreviewUrl(objUrl);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setPreviewUrl(logoUrl || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please provide a company name.");
      return;
    }

    if (logoType === "url" && !logoUrl.trim() && !previewUrl) {
      toast.error("Please enter a valid logo image URL.");
      return;
    }

    if (logoType === "upload" && !selectedFile && !logoUrl.trim()) {
      toast.error("Please choose a logo file to upload.");
      return;
    }

    setLoading(true);

    try {
      let response;
      if (selectedFile) {
        // Multipart FormData upload
        const formData = new FormData();
        formData.append("name", name.trim());
        formData.append("websiteUrl", websiteUrl.trim());
        formData.append("order", String(order));
        formData.append("isActive", String(isActive));
        formData.append("logoImage", selectedFile);

        if (companyToEdit?._id) {
          response = await api.updateMarqueeCompany(companyToEdit._id, formData, true);
        } else {
          response = await api.createMarqueeCompany(formData, true);
        }
      } else {
        // Standard JSON payload
        const payload = {
          name: name.trim(),
          logo: logoUrl.trim(),
          websiteUrl: websiteUrl.trim(),
          order: Number(order) || 0,
          isActive,
        };

        if (companyToEdit?._id) {
          response = await api.updateMarqueeCompany(companyToEdit._id, payload, false);
        } else {
          response = await api.createMarqueeCompany(payload, false);
        }
      }

      if (response.success) {
        toast.success(
          response.message ||
            (companyToEdit
              ? "Partner logo updated successfully!"
              : "Partner company added to marquee successfully!")
        );
        onCompanySaved();
        onClose();
      } else {
        toast.error(response.message || "Operation failed.");
      }
    } catch (error) {
      console.error("Error saving marquee company:", error);
      toast.error(error.message || "Failed to save marquee company.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Building2 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {companyToEdit ? "Edit Partner Company" : "Add Partner Company"}
              </h2>
              <p className="text-xs text-slate-500">
                {companyToEdit
                  ? "Update company name, logo or display priority"
                  : "Add brand logo to the home page marquee"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Company Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Company Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Google, Microsoft, Airbnb"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium text-slate-900"
              />
            </div>
          </div>

          {/* Logo Input Type Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Company Logo <span className="text-red-500">*</span>
              </label>
              <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setLogoType("url")}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    logoType === "url"
                      ? "bg-white text-blue-600 shadow-2xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Image URL
                </button>
                <button
                  type="button"
                  onClick={() => setLogoType("upload")}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    logoType === "upload"
                      ? "bg-white text-blue-600 shadow-2xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Upload File
                </button>
              </div>
            </div>

            {logoType === "url" ? (
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Link size={16} />
                  </div>
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => {
                      setLogoUrl(e.target.value);
                      setPreviewUrl(e.target.value);
                    }}
                    placeholder="https://example.com/logo.svg"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono text-xs text-slate-800"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Tip: Direct SVG, PNG or WebP image link from Wikimedia or official CDN works best.
                </p>
              </div>
            ) : (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/svg+xml,image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                  id="marquee-file-upload"
                />
                <label
                  htmlFor="marquee-file-upload"
                  className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-200 hover:border-blue-500/50 bg-slate-50/50 hover:bg-blue-50/20 rounded-2xl cursor-pointer transition-all text-center group"
                >
                  <UploadCloud
                    size={28}
                    className="text-slate-400 group-hover:text-blue-600 mb-1.5 transition-colors"
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    {selectedFile ? selectedFile.name : "Click to select logo image"}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    SVG, PNG, WebP or JPG (Max 10MB)
                  </span>
                </label>
                {selectedFile && (
                  <div className="flex items-center justify-between mt-2 px-3 py-1.5 bg-blue-50/60 rounded-xl text-xs text-blue-800">
                    <span className="truncate max-w-[280px]">{selectedFile.name}</span>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                      title="Remove file"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Live Logo Preview Box */}
            {previewUrl && (
              <div className="mt-3 p-3 bg-slate-100/70 border border-slate-200/80 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center p-1.5 shadow-2xs">
                    <img
                      src={previewUrl}
                      alt="Logo preview"
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">
                      Preview
                    </span>
                    <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                      <CheckCircle2 size={12} /> Ready for marquee
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Scale: 1x
                </span>
              </div>
            )}
          </div>

          {/* Website / Careers URL (Optional) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Website or Careers URL <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Globe size={16} />
              </div>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://company.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono text-xs text-slate-800"
              />
            </div>
          </div>

          {/* Display Order & Active Toggle Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Display Priority / Order
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Hash size={16} />
                </div>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-semibold text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Status
              </label>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-full py-2.5 px-4 rounded-xl border flex items-center justify-between text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-slate-100 border-slate-200 text-slate-500"
                }`}
              >
                <span>{isActive ? "Active (Visible)" : "Inactive (Hidden)"}</span>
                <span
                  className={`w-3 h-3 rounded-full ${
                    isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{companyToEdit ? "Save Changes" : "Add to Marquee"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarqueeModal;
