import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { User, UploadCloud, FileText, Loader2 } from "lucide-react";
import customerservice from "../../customer/customerservice";

export default function UserProfile() {
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    title: "",
    location: "",
    bio: "",
    skills: "",
    experience: 0,
    education: "",
    resume: "",
    profileImage: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await customerservice.getUserProfile();
      if (res.success && res.data) {
        setProfile({
          name: res.data.name || "",
          phone: res.data.phone || "",
          title: res.data.title || "",
          location: res.data.location || "",
          bio: res.data.bio || "",
          skills: res.data.skills ? res.data.skills.join(", ") : "",
          experience: res.data.experience || 0,
          education: res.data.education || "",
          resume: res.data.resume || "",
          profileImage: res.data.profileImage || "",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const dataToSave = {
        ...profile,
        skills: profile.skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
      };
      const res = await customerservice.updateUserProfile(dataToSave);
      if (res.success) {
        toast.success("Profile updated successfully!");
        if (res.data) {
          setProfile({
            name: res.data.name || "",
            phone: res.data.phone || "",
            title: res.data.title || "",
            location: res.data.location || "",
            bio: res.data.bio || "",
            skills: res.data.skills ? res.data.skills.join(", ") : "",
            experience: res.data.experience || 0,
            education: res.data.education || "",
            resume: res.data.resume || "",
            profileImage: res.data.profileImage || "",
          });
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl space-y-6"
    >
      {/* Profile Info Card */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
          <label className="cursor-pointer">
            <div className="bg-brand-50 w-16 h-16 rounded-full flex items-center justify-center text-brand-600 overflow-hidden relative group">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8" />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <UploadCloud className="w-5 h-5 text-white" />
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setProfile({
                    ...profile,
                    profileImage: URL.createObjectURL(e.target.files[0]),
                  });
                }
              }}
            />
          </label>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Personal Information
            </h1>
            <p className="text-sm text-slate-500">
              Update your details to stand out to employers.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Professional Title
              </label>
              <input
                type="text"
                value={profile.title}
                onChange={(e) =>
                  setProfile({ ...profile, title: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                min="0"
                value={profile.experience}
                onChange={(e) =>
                  setProfile({ ...profile, experience: Number(e.target.value) })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Education
              </label>
              <input
                type="text"
                value={profile.education}
                onChange={(e) =>
                  setProfile({ ...profile, education: e.target.value })
                }
                placeholder="e.g. B.S. Computer Science"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Skills (comma separated)
            </label>
            <input
              type="text"
              value={profile.skills}
              onChange={(e) =>
                setProfile({ ...profile, skills: e.target.value })
              }
              placeholder="React, Node.js, UI/UX"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Professional Bio
            </label>
            <textarea
              rows="4"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all resize-none"
            ></textarea>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-brand-600 flex items-center gap-2 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-700 shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Saving..." : "Save Details"}
            </button>
          </div>
        </form>
      </div>

      {/* Resume Upload Card */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Resume & Documents
        </h2>
        <label className="block border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:bg-slate-50 hover:border-brand-300 transition-colors cursor-pointer group">
          <div className="mx-auto w-12 h-12 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-slate-900">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-slate-500 mt-1">PDF, DOCX up to 5MB</p>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setProfile({
                  ...profile,
                  resume: URL.createObjectURL(e.target.files[0]),
                });
              }
            }}
          />
        </label>

        {profile.resume && (
          <div className="mt-4 flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-brand-600" />
              <div>
                <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">
                  {profile.resume.startsWith("blob:")
                    ? "New_Resume_Uploaded.pdf"
                    : profile.resume.substring(
                        profile.resume.lastIndexOf("/") + 1,
                      ) || "Resume Document"}
                </p>
                <p className="text-xs text-slate-500">Ready</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setProfile({ ...profile, resume: "" })}
              className="text-xs font-medium text-red-500 hover:text-red-600"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
