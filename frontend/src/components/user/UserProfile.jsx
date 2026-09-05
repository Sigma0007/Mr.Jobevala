import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { User, UploadCloud, FileText, Loader2 } from "lucide-react";
import customerservice from "../../customer/customerservice";
import {
  workModeType,
  jobType as jobTypeOptions,
} from "../../Utility/utilites";
import { useSelector } from "react-redux";
import LocationPickerMap from "../provider/LocationPickerMap";

export default function UserProfile() {
  const { categoriesType } = useSelector((state) => state.dashboard);

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    dob: "",
    gender: "",
    title: "",
    jobType: "full-time",
    location: {
      address: "",
      city: "",
      state: "",
      talukaOrVillage: "",
      country: "India",
      workMode: "on-site",
      lat: null,
      lng: null,
    },
    salary: {
      min: 0,
      max: 0,
      currency: "INR",
    },
    bio: "",
    skills: "",
    experience: 0,
    education: "",
    resume: "",
    profileImage: "",
    category: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locationHierarchy, setLocationHierarchy] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchLocationHierarchy();
  }, []);

  const fetchLocationHierarchy = async () => {
    try {
      setLocationsLoading(true);
      const res = await customerservice.getLocationsHierarchy();
      if (res?.success && Array.isArray(res?.data)) {
        setLocationHierarchy(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch location hierarchy:", err);
    } finally {
      setLocationsLoading(false);
    }
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setProfile((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        state: selectedState,
        city: "",
        talukaOrVillage: "",
      },
    }));
  };

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setProfile((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        city: selectedDistrict,
        talukaOrVillage: "",
      },
    }));
  };

  const handleSubDivisionChange = (e) => {
    const selectedSubDiv = e.target.value;
    setProfile((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        talukaOrVillage: selectedSubDiv,
      },
    }));
  };

  const selectedStateObj = locationHierarchy.find(
    (item) =>
      item.state_name?.toLowerCase() === profile.location?.state?.toLowerCase(),
  );
  const availableDistricts = selectedStateObj?.districts || [];

  const selectedDistrictObj = availableDistricts.find(
    (item) =>
      item.district_name?.toLowerCase() ===
      profile.location?.city?.toLowerCase(),
  );
  const availableSubDivisions = selectedDistrictObj?.subDivisions || [];

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await customerservice.getUserProfile();
      if (res.success && res.data) {
        setProfile({
          name: res.data.name || "",
          phone: res.data.phone || "",
          dob: res.data.dob || "",
          gender: res.data.gender || "",
          title: res.data.title || "",
          jobType: res.data.jobType || "full-time",
          category: res.data.category || "",
          location: {
            address: res.data.location?.address || "",
            city: res.data.location?.city || "",
            state: res.data.location?.state || "",
            talukaOrVillage: res.data.location?.talukaOrVillage || "",
            country: res.data.location?.country || "India",
            workMode: res.data.location?.workMode || "on-site",
            lat: res.data.location?.lat || null,
            lng: res.data.location?.lng || null,
          },
          salary: res.data.salary || {
            min: 0,
            max: 0,
            currency: "INR",
          },
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
            dob: res.data.dob || "",
            gender: res.data.gender || "",
            title: res.data.title || "",
            jobType: res.data.jobType || "full-time",
            category: res.data.category || "",
            location: {
              address: res.data.location?.address || "",
              city: res.data.location?.city || "",
              state: res.data.location?.state || "",
              talukaOrVillage: res.data.location?.talukaOrVillage || "",
              country: res.data.location?.country || "India",
              workMode: res.data.location?.workMode || "on-site",
              lat: res.data.location?.lat || null,
              lng: res.data.location?.lng || null,
            },
            salary: res.data.salary || {
              min: 0,
              max: 0,
              currency: "INR",
            },
            bio: res.data.bio || "",
            skills: res.data.skills ? res.data.skills.join(", ") : "",
            experience: res.data.experience || 0,
            education: res.data.education || "",
            resume: res.data.resume || "",
            profileImage: res.data.profileImage || "",
          });
        }
      } else {
        toast.error(res.message || "Failed to update profile");
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
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setProfile({
                      ...profile,
                      profileImage: reader.result,
                    });
                  };
                  reader.readAsDataURL(file);
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
                Date of Birth
              </label>
              <input
                type="date"
                value={profile.dob ? profile.dob.substring(0, 10) : ""}
                onChange={(e) =>
                  setProfile({ ...profile, dob: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Gender (Sex)
              </label>
              <select
                value={profile.gender || ""}
                onChange={(e) =>
                  setProfile({ ...profile, gender: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
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

          {/* Location & Map Picker */}
          <div className="pt-2">
            <LocationPickerMap
              label="Location / Address"
              subLabel="(Pin your exact location on the map or search your locality)"
              placeholder="Search area, road, city, or locality..."
              value={
                profile.location.address || profile.location.locationName || ""
              }
              lat={profile.location.lat}
              lng={profile.location.lng}
              onChange={(locStr, coords) => {
                setProfile((prev) => ({
                  ...prev,
                  location: {
                    ...prev.location,
                    address: locStr,
                    ...(coords
                      ? {
                          lat: coords.lat,
                          lng: coords.lng,
                        }
                      : {}),
                  },
                }));
              }}
              onCoordinatesChange={(lat, lng) => {
                setProfile((prev) => ({
                  ...prev,
                  location: {
                    ...prev.location,
                    lat: lat,
                    lng: lng,
                  },
                }));
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">
                  State
                </label>
                {locationsLoading && (
                  <span className="text-xs text-brand-600 animate-pulse">
                    Loading...
                  </span>
                )}
              </div>
              <select
                value={profile.location.state}
                onChange={handleStateChange}
                disabled={locationsLoading}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="">
                  {locationsLoading ? "Loading States..." : "Select State"}
                </option>
                {locationHierarchy.map((st) => (
                  <option
                    key={st.state_code || st._id || st.state_name}
                    value={st.state_name}
                  >
                    {st.state_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                District / City
              </label>
              <select
                value={profile.location.city}
                onChange={handleDistrictChange}
                disabled={
                  !profile.location.state || availableDistricts.length === 0
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="">
                  {!profile.location.state
                    ? "Select State First"
                    : availableDistricts.length === 0
                      ? "No Districts Available"
                      : "Select District / City"}
                </option>
                {availableDistricts.map((dist) => (
                  <option
                    key={dist.district_code || dist._id || dist.district_name}
                    value={dist.district_name}
                  >
                    {dist.district_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Taluka / Sub-Division / Village
              </label>
              <select
                value={profile.location.talukaOrVillage || ""}
                onChange={handleSubDivisionChange}
                disabled={
                  !profile.location.city || availableSubDivisions.length === 0
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="">
                  {!profile.location.city
                    ? "Select District First"
                    : availableSubDivisions.length === 0
                      ? "No Sub-Divisions Available"
                      : "Select Taluka / Sub-Division"}
                </option>
                {availableSubDivisions.map((sub) => (
                  <option
                    key={
                      sub.sub_division_code || sub._id || sub.sub_division_name
                    }
                    value={sub.sub_division_name}
                  >
                    {sub.sub_division_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Work Mode
              </label>
              <select
                value={profile.location.workMode}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    location: { ...profile.location, workMode: e.target.value },
                  })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
              >
                {workModeType.map((mode) => (
                  <option key={mode.value} value={mode.value}>
                    {mode.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Min Salary
              </label>
              <input
                type="number"
                min="0"
                value={profile.salary.min}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    salary: { ...profile.salary, min: Number(e.target.value) },
                  })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Max Salary
              </label>
              <input
                type="number"
                min="0"
                value={profile.salary.max}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    salary: { ...profile.salary, max: Number(e.target.value) },
                  })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Currency
              </label>
              <select
                value={profile.salary.currency}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    salary: { ...profile.salary, currency: e.target.value },
                  })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Job Type
              </label>
              <select
                value={profile.jobType}
                onChange={(e) =>
                  setProfile({ ...profile, jobType: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
              >
                {jobTypeOptions.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Job Category
              </label>
              <select
                value={profile.category}
                onChange={(e) =>
                  setProfile({ ...profile, category: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
              >
                {categoriesType.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label || cat.title}
                  </option>
                ))}
              </select>
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
