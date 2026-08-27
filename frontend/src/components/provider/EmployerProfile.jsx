import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Building2, Upload } from "lucide-react";
import customerService from "../../customer/customerservice";

export default function EmployerProfile() {
  const [profile, setProfile] = useState({
    name: "",
    companyName: "",
    location: "",
    phone: "",
    logo: "",
    website: "",
    industry: "",
    companySize: "",
    aboutCompany: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await customerService.getCompanyProfile();
        if (response.success && response.data) {
          setProfile({
            name: response.data.name || "",
            companyName: response.data.companyName || "",
            location: response.data.location || "",
            phone: response.data.phone || "",
            logo: response.data.logo || "",
            website: response.data.website || "",
            industry: response.data.industry || "",
            companySize: response.data.companySize || "",
            aboutCompany: response.data.aboutCompany || "",
          });
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load company profile",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await customerService.updateCompanyProfile(profile);
      if (response.success) {
        toast.success("Company profile updated successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading profile...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8 pb-6 border-b border-slate-100">
        <div className="relative group cursor-pointer">
          <label className="cursor-pointer block">
            <img
              src={
                profile.logo ||
                "https://images.unsplash.com/photo-1549924293-3b909efef92d?w=150&q=80"
              }
              alt="Company Logo"
              className="w-20 h-20 rounded-2xl object-cover border border-slate-200 group-hover:opacity-75 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-2xl">
              <Upload className="w-6 h-6 text-white drop-shadow-md" />
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setProfile({ ...profile, logo: reader.result });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Company Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Update how your brand appears to candidates across the platform.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Contact Name *
            </label>
            <input
              type="text"
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={profile.companyName}
              onChange={(e) =>
                setProfile({ ...profile, companyName: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone
            </label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) =>
                setProfile({ ...profile, location: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Website
            </label>
            <input
              type="text"
              value={profile.website}
              onChange={(e) =>
                setProfile({ ...profile, website: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Industry
            </label>
            <input
              type="text"
              value={profile.industry}
              onChange={(e) =>
                setProfile({ ...profile, industry: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Company Size
            </label>
            <input
              type="text"
              value={profile.companySize}
              onChange={(e) =>
                setProfile({ ...profile, companySize: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            About Company
          </label>
          <textarea
            rows="4"
            value={profile.aboutCompany}
            onChange={(e) =>
              setProfile({ ...profile, aboutCompany: e.target.value })
            }
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all resize-none"
          ></textarea>
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-100">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-brand-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-700 shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
          >
            Save Changes
          </button>
        </div>
      </form>
    </motion.div>
  );
}
