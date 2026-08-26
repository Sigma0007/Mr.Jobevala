import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { User, UploadCloud, FileText } from "lucide-react";

export default function CandidateProfile() {
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    title: "Senior Frontend Engineer",
    location: "New York, NY",
    bio: "Passionate about building scalable UI architectures.",
  });

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };

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
          <div className="bg-brand-50 p-3 rounded-2xl text-brand-600">
            <User className="w-6 h-6" />
          </div>
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
                value={profile.fullName}
                onChange={(e) =>
                  setProfile({ ...profile, fullName: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
              />
            </div>
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
              className="bg-brand-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-700 shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] transition-all hover:-translate-y-0.5"
            >
              Save Details
            </button>
          </div>
        </form>
      </div>

      {/* Resume Upload Card */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Resume & Documents
        </h2>
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:bg-slate-50 hover:border-brand-300 transition-colors cursor-pointer group">
          <div className="mx-auto w-12 h-12 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-slate-900">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-slate-500 mt-1">PDF, DOCX up to 5MB</p>
        </div>

        {/* Dummy Existing Resume */}
        <div className="mt-4 flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-brand-600" />
            <div>
              <p className="text-sm font-medium text-slate-900">
                John_Doe_Resume_2026.pdf
              </p>
              <p className="text-xs text-slate-500">Uploaded 2 days ago</p>
            </div>
          </div>
          <button className="text-xs font-medium text-red-500 hover:text-red-600">
            Remove
          </button>
        </div>
      </div>
    </motion.div>
  );
}
