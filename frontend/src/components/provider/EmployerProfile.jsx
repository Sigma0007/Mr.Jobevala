import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Building2,
  Upload,
  User,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import customerService from "../../customer/customerservice";
import LocationPickerMap from "./LocationPickerMap";
import { IndustryType, BENEFITS } from "../../Utility/utilites";

export default function EmployerProfile() {
  const [profile, setProfile] = useState({
    // Company Owner Details
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",

    // Company Information
    companyName: "",
    website: "",
    industry: "",
    companySize: "",
    establishYear: "",
    logo: "",

    // Contact Person Details (HR / Manager / Other)
    contactPersonRole: "HR",
    contactPersonName: "",
    contactPersonPhone: "",
    contactPersonEmail: "",

    // Perks & Location & About
    benefits: [],
    location: "",
    lat: null,
    lng: null,
    aboutCompany: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await customerService.getCompanyProfile();
        if (response.success && response.data) {
          const profileData = response.data;

          setProfile({
            ownerName: profileData.ownerName || profileData.name || "",
            ownerPhone: profileData.ownerPhone || profileData.phone || "",
            ownerEmail: profileData.ownerEmail || "",

            companyName: profileData.companyName || "",
            website: profileData.website || "",
            industry: profileData.industry || "",
            companySize: profileData.companySize || "",
            establishYear: profileData.establishYear || "",
            logo: profileData.logo || "",

            contactPersonRole: profileData.contactPersonRole || "HR",
            contactPersonName: profileData.contactPersonName || "",
            contactPersonPhone: profileData.contactPersonPhone || "",
            contactPersonEmail: profileData.contactPersonEmail || "",

            benefits: Array.isArray(profileData.benefits)
              ? profileData.benefits
              : [],
            location: profileData.location || "",
            lat: profileData.lat || null,
            lng: profileData.lng || null,
            aboutCompany: profileData.aboutCompany || "",
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

  const handleBenefitToggle = (value) => {
    setProfile((prev) => {
      const currentBenefits = prev.benefits || [];
      if (currentBenefits.includes(value)) {
        return {
          ...prev,
          benefits: currentBenefits.filter((item) => item !== value),
        };
      } else {
        return {
          ...prev,
          benefits: [...currentBenefits, value],
        };
      }
    });
  };

  const handleRemoveBenefit = (valueToRemove) => {
    setProfile((prev) => ({
      ...prev,
      benefits: (prev.benefits || []).filter((b) => b !== valueToRemove),
    }));
  };

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
      className="max-w-4xl bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
    >
      {/* Header with Logo Upload */}
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

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Company Information */}
        <div>
          <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-600" />
            Company Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={profile.companyName}
                placeholder="e.g. Acme Corporation"
                onChange={(e) =>
                  setProfile({ ...profile, companyName: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Industry Type
              </label>
              <select
                value={profile.industry}
                onChange={(e) =>
                  setProfile({ ...profile, industry: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
              >
                <option value="">Select Industry Type</option>
                {IndustryType.map((ind) => (
                  <option key={ind.value} value={ind.value}>
                    {ind.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Website
              </label>
              <input
                type="url"
                value={profile.website}
                placeholder="https://example.com"
                onChange={(e) =>
                  setProfile({ ...profile, website: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Establish Year
              </label>
              <input
                type="number"
                min="1800"
                max={new Date().getFullYear()}
                placeholder="e.g. 2015"
                value={profile.establishYear}
                onChange={(e) =>
                  setProfile({ ...profile, establishYear: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Number of Employees
              </label>
              <input
                type="text"
                placeholder="e.g. 1-10, 11-50, 51-200, 500+"
                value={profile.companySize}
                onChange={(e) =>
                  setProfile({ ...profile, companySize: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Company Owner Details */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              Company Owner Details
            </h2>
            <span className="text-xs text-slate-400">
              Employer / Founder / Director
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Owner Name *
              </label>
              <input
                type="text"
                required
                placeholder="Owner / Founder Name"
                value={profile.ownerName}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    ownerName: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Owner Contact Number
              </label>
              <input
                type="tel"
                placeholder="+91 9876543210"
                value={profile.ownerPhone}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    ownerPhone: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Owner Email ID
              </label>
              <input
                type="email"
                placeholder="owner@company.com"
                value={profile.ownerEmail}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    ownerEmail: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Contact Person Details (HR / Manager / Recruiter / Other) */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <User className="w-4 h-4 text-brand-600" />
              Contact Person Details (HR / Manager / Recruiter)
            </h2>
            <span className="text-xs text-slate-400">
              Primary point of contact for candidates
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Designation / Role
              </label>
              <select
                value={profile.contactPersonRole}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    contactPersonRole: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
              >
                <option value="HR">HR / HR Manager</option>
                <option value="Recruiter">
                  Recruiter / Talent Acquisition
                </option>
                <option value="Hiring Manager">Hiring Manager</option>
                <option value="General Manager">General Manager</option>
                <option value="Operations Head">Operations Head</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contact Person Name
              </label>
              <input
                type="text"
                placeholder="e.g. Jane Doe"
                value={profile.contactPersonName}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    contactPersonName: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contact Person Phone Number
              </label>
              <input
                type="tel"
                placeholder="+91 9876543210"
                value={profile.contactPersonPhone}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    contactPersonPhone: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contact Person Email ID
              </label>
              <input
                type="email"
                placeholder="hr@company.com"
                value={profile.contactPersonEmail}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    contactPersonEmail: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Perks & Benefits Section */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700">
              Perks & Benefits
            </label>
            <span className="text-xs text-slate-400">
              {(profile.benefits || []).length} selected
            </span>
          </div>

          <div className="space-y-3">
            {/* <select
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  handleBenefitToggle(e.target.value);
                }
              }}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
            >
              <option value="">-- Choose a Perk / Benefit to add --</option>
              {BENEFITS.filter(
                (b) => !(profile.benefits || []).includes(b.value),
              ).map((benefit) => (
                <option key={benefit.value} value={benefit.value}>
                  + {benefit.label}
                </option>
              ))}
            </select> */}

            {/* Selected Benefits Badges */}
            {profile.benefits && profile.benefits.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {profile.benefits.map((benefitVal) => {
                  const benefitObj = BENEFITS.find(
                    (b) => b.value === benefitVal,
                  );
                  const label = benefitObj ? benefitObj.label : benefitVal;
                  return (
                    <span
                      key={benefitVal}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-700 border border-brand-200 rounded-lg text-xs font-medium"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                      {label}
                      <button
                        type="button"
                        onClick={() => handleRemoveBenefit(benefitVal)}
                        className="p-0.5 hover:bg-brand-100 rounded-full text-brand-600 hover:text-brand-800 transition-colors ml-1"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                No benefits selected. Choose from dropdown or click below to
                select.
              </p>
            )}

            {/* Quick Toggle Chips Grid */}
            <div className="pt-2">
              <div className="text-xs font-medium text-slate-500 mb-2">
                Quick Select Perks:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {BENEFITS.map((benefit) => {
                  const isSelected = (profile.benefits || []).includes(
                    benefit.value,
                  );
                  return (
                    <button
                      key={benefit.value}
                      type="button"
                      onClick={() => handleBenefitToggle(benefit.value)}
                      className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                        isSelected
                          ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {isSelected ? "✓ " : "+ "}
                      {benefit.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Office Address & Location */}
        <div className="pt-4 border-t border-slate-100">
          <LocationPickerMap
            label="Office Address"
            subLabel="(Sharing exact address will help candidates to reach you easily)"
            placeholder="Search area, road, city, or locality..."
            value={profile.location}
            lat={profile.lat}
            lng={profile.lng}
            onChange={(loc, coords) => {
              setProfile((prev) => ({
                ...prev,
                location: loc,
                ...(coords
                  ? {
                      lat: coords.lat,
                      lng: coords.lng,
                    }
                  : {}),
              }));
            }}
            onCoordinatesChange={(lat, lng) => {
              setProfile((prev) => ({
                ...prev,
                lat: lat,
                lng: lng,
              }));
            }}
          />
        </div>

        {/* Section 6: About Company */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            About Company
          </label>
          <textarea
            rows="4"
            placeholder="Tell candidates about your company culture, mission, and what makes working here great..."
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
