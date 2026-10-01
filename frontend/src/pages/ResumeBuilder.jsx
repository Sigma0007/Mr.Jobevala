import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FileText,
  User,
  AlignLeft,
  Wrench,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  Languages,
  Heart,
  Download,
  Printer,
  RotateCcw,
  Save,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sliders,
  Eye,
  Edit3,
  Sparkles,
  Crown,
  Lock,
  ArrowRight,
  X,
  ShieldCheck,
  Plane
} from "lucide-react";

import { initialResume, emptyResume } from "../data/initialResume";
import PersonalForm from "../components/ResumeForm/PersonalForm";
import SummaryForm from "../components/ResumeForm/SummaryForm";
import SkillsForm from "../components/ResumeForm/SkillsForm";
import ExperienceForm from "../components/ResumeForm/ExperienceForm";
import EducationForm from "../components/ResumeForm/EducationForm";
import ProjectsForm from "../components/ResumeForm/ProjectsForm";
import CertificationsForm from "../components/ResumeForm/CertificationsForm";
import LanguagesForm from "../components/ResumeForm/LanguagesForm";
import InterestsForm from "../components/ResumeForm/InterestsForm";
import TravelDetailsForm from "../components/ResumeForm/TravelDetailsForm";

import ResumePreview from "../components/ResumePreview/ResumePreview";
import TemplateSelector, { TEMPLATES_LIST } from "../components/TemplateSelector";
import ColorSelector from "../components/ColorSelector";
import customerservice from "../customer/customerservice";

import "../styles/resume.css";
import "../styles/builder.css";

const STORAGE_KEY = "resume_builder_data_v1";
const SETTINGS_KEY = "resume_builder_settings_v1";

export default function ResumeBuilder() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Subscription state
  const [hasSubscriptionAccess, setHasSubscriptionAccess] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [lockedTemplateAttempted, setLockedTemplateAttempted] = useState(null);

  // Resume data state with localStorage persistence
  const [resumeData, setResumeData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialResume;
    } catch (e) {
      console.error("Failed to parse saved resume data:", e);
      return initialResume;
    }
  });

  // Visual customization state (Template, Color, Font)
  const [template, setTemplate] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? JSON.parse(saved).template : "modern";
    } catch {
      return "modern";
    }
  });

  const [color, setColor] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? JSON.parse(saved).color : "#2563eb";
    } catch {
      return "#2563eb";
    }
  });

  const [font, setFont] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? JSON.parse(saved).font : "Inter, sans-serif";
    } catch {
      return "Inter, sans-serif";
    }
  });

  // Check user subscription for resumeAccess
  useEffect(() => {
    const checkAccess = async () => {
      setCheckingSubscription(true);
      if (user?.role === "admin") {
        setHasSubscriptionAccess(true);
        setCheckingSubscription(false);
        return;
      }

      if (!user) {
        setHasSubscriptionAccess(false);
        setCheckingSubscription(false);
        return;
      }

      try {
        const res = await customerservice.getCurrentSubscription();
        if (
          res?.success &&
          res?.data &&
          res.data.status === "active" &&
          (res.data.resumeAccess || res.data.planDetails?.resumeAccess)
        ) {
          setHasSubscriptionAccess(true);
        } else {
          setHasSubscriptionAccess(false);
        }
      } catch (err) {
        console.warn("Could not check subscription access:", err);
        setHasSubscriptionAccess(false);
      } finally {
        setCheckingSubscription(false);
      }
    };

    checkAccess();
  }, [user]);

  // If user does not have subscription and currently selected template is premium, fallback to modern (free simple template)
  useEffect(() => {
    if (!checkingSubscription && !hasSubscriptionAccess) {
      const currentTmpl = TEMPLATES_LIST.find((t) => t.id === template);
      if (currentTmpl?.isPremium) {
        setTemplate("modern");
      }
    }
  }, [hasSubscriptionAccess, checkingSubscription, template]);

  // Mobile tab state ('form' or 'preview')
  const [mobileTab, setMobileTab] = useState("form");

  // Section collapse states
  const [openSections, setOpenSections] = useState({
    personal: true,
    summary: true,
    skills: true,
    experience: true,
    education: true,
    projects: false,
    certifications: false,
    languages: false,
    interests: false,
    travelDetails: true
  });

  // Form validation errors
  const [errors, setErrors] = useState({});
  const [isDownloading, setIsDownloading] = useState(false);
  const previewRef = useRef(null);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
    } catch (err) {
      console.error("Auto-save failed:", err);
    }
  }, [resumeData]);

  // Save visual settings
  useEffect(() => {
    try {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ template, color, font })
      );
    } catch (err) {
      console.error("Settings save failed:", err);
    }
  }, [template, color, font]);

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Validation function for required fields
  const validateForm = () => {
    const errs = {};
    const { personal } = resumeData;

    if (!personal?.fullName?.trim()) {
      errs.fullName = "Full name is required";
    }
    if (!personal?.jobTitle?.trim()) {
      errs.jobTitle = "Professional title is required";
    }
    if (!personal?.email?.trim()) {
      errs.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(personal.email)) {
      errs.email = "Please enter a valid email address";
    }
    if (!personal?.phone?.trim()) {
      errs.phone = "Phone number is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleManualSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ template, color, font })
      );
      toast.success("Resume saved successfully!");
    } catch {
      toast.error("Failed to save resume");
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset your resume? This will clear your currently entered data."
      )
    ) {
      setResumeData(emptyResume);
      setErrors({});
      toast.success("Resume reset to blank");
    }
  };

  const handleLoadSample = () => {
    if (
      window.confirm("Load sample professional resume data to explore templates?")
    ) {
      setResumeData(initialResume);
      setErrors({});
      toast.success("Sample resume loaded");
    }
  };

  // Browser-based Print fallback
  const handlePrint = () => {
    const currentTmpl = TEMPLATES_LIST.find((t) => t.id === template);
    if (currentTmpl?.isPremium && !hasSubscriptionAccess) {
      setLockedTemplateAttempted(currentTmpl);
      setUpgradeModalOpen(true);
      toast.error("This premium template requires a Pro Subscription.");
      return;
    }
    window.print();
  };

  // Real PDF Export using Node.js Puppeteer backend
  const handleDownloadPdf = async () => {
    const currentTmpl = TEMPLATES_LIST.find((t) => t.id === template);
    if (currentTmpl?.isPremium && !hasSubscriptionAccess) {
      setLockedTemplateAttempted(currentTmpl);
      setUpgradeModalOpen(true);
      toast.error("This premium template requires a Pro Subscription to download.");
      return;
    }

    const isValid = validateForm();
    if (!isValid) {
      toast.error("Please fill in the required personal information fields");
      setOpenSections((prev) => ({ ...prev, personal: true }));
    }

    const previewEl = document.getElementById("resume-printable-area");
    if (!previewEl) {
      toast.error("Resume preview element not found");
      return;
    }

    setIsDownloading(true);
    const toastId = toast.loading("Generating high-fidelity A4 PDF with Puppeteer...");

    try {
      const resumeHtml = previewEl.outerHTML;
      const candidateName = resumeData.personal?.fullName || "Resume";
      const fileName = `${candidateName.toLowerCase().replace(/\s+/g, "_")}_resume.pdf`;

      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiBase}/api/resume/pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          html: resumeHtml,
          title: fileName.replace(".pdf", "")
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("PDF downloaded successfully!", { id: toastId });
    } catch (error) {
      console.warn("Backend PDF generation error, switching to browser print fallback:", error);
      toast.error("Backend PDF service unavailable. Opening print preview...", { id: toastId });
      setTimeout(() => {
        window.print();
      }, 500);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="builder-container">
      {/* Top sticky Action Bar */}
      <div className="builder-topbar no-print">
        <div className="builder-topbar-left">
          <div className="builder-topbar-title">
            <FileText className="w-5 h-5 text-brand-600" />
            Resume Studio
          </div>
          <span className="auto-save-badge">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Auto-saved
          </span>

          {/* Subscription Status Pill */}
          {hasSubscriptionAccess ? (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              Pro All-Access (16 Templates)
            </span>
          ) : (
            <div className="hidden sm:inline-flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Free Tier: Simple Templates Only
              </span>
              <button
                type="button"
                onClick={() => {
                  setLockedTemplateAttempted(null);
                  setUpgradeModalOpen(true);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-2xs transition-all cursor-pointer"
              >
                <Crown className="w-3 h-3 text-amber-300" />
                Upgrade Plan
              </button>
            </div>
          )}
        </div>

        <div className="builder-topbar-actions">
          <button
            type="button"
            onClick={handleLoadSample}
            className="btn btn-secondary text-xs"
            title="Load sample data"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Sample
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary text-xs"
            title="Reset resume"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset
          </button>

          <button
            type="button"
            onClick={handleManualSave}
            className="btn btn-secondary text-xs"
          >
            <Save className="w-3.5 h-3.5 text-brand-600" /> Save
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="btn btn-secondary text-xs"
            title="Print resume"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="btn btn-primary text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            {isDownloading ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="builder-main-split">
        {/* Left Side: Form Controls */}
        <div
          className={`builder-form-pane no-print ${
            mobileTab === "preview" ? "mobile-hidden" : ""
          }`}
        >
          {/* Customization Card: Template, Accent Color, Typography */}
          <div className="builder-customization-panel">
            <TemplateSelector
              selectedTemplate={template}
              onSelectTemplate={setTemplate}
              hasSubscriptionAccess={hasSubscriptionAccess}
              onLockedTemplateClick={(tmpl) => {
                setLockedTemplateAttempted(tmpl);
                setUpgradeModalOpen(true);
              }}
            />
            <ColorSelector
              selectedColor={color}
              onSelectColor={setColor}
              selectedFont={font}
              onSelectFont={setFont}
            />
          </div>

          {/* Form Section 1: Personal Info */}
          <div className="form-section-card">
            <div
              className="form-section-header"
              onClick={() => toggleSection("personal")}
            >
              <div className="form-section-title">
                <User className="w-4 h-4 text-brand-600" />
                Personal Information
              </div>
              {openSections.personal ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
            {openSections.personal && (
              <div className="form-section-content">
                <PersonalForm
                  data={resumeData.personal}
                  errors={errors}
                  onChange={(personal) =>
                    setResumeData((prev) => ({ ...prev, personal }))
                  }
                />
              </div>
            )}
          </div>

          {/* Form Section: Passport, License & Travel Details */}
          <div className="form-section-card">
            <div
              className="form-section-header"
              onClick={() => toggleSection("travelDetails")}
            >
              <div className="form-section-title">
                <Plane className="w-4 h-4 text-brand-600" />
                Passport, License & Travel Details
              </div>
              {openSections.travelDetails ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
            {openSections.travelDetails && (
              <div className="form-section-content">
                <TravelDetailsForm
                  data={resumeData.travelDetails}
                  onChange={(travelDetails) =>
                    setResumeData((prev) => ({ ...prev, travelDetails }))
                  }
                />
              </div>
            )}
          </div>

          {/* Form Section 2: Summary */}
          <div className="form-section-card">
            <div
              className="form-section-header"
              onClick={() => toggleSection("summary")}
            >
              <div className="form-section-title">
                <AlignLeft className="w-4 h-4 text-brand-600" />
                Professional Summary
              </div>
              {openSections.summary ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
            {openSections.summary && (
              <div className="form-section-content">
                <SummaryForm
                  summary={resumeData.summary}
                  onChange={(summary) =>
                    setResumeData((prev) => ({ ...prev, summary }))
                  }
                />
              </div>
            )}
          </div>

          {/* Form Section 3: Skills */}
          <div className="form-section-card">
            <div
              className="form-section-header"
              onClick={() => toggleSection("skills")}
            >
              <div className="form-section-title">
                <Wrench className="w-4 h-4 text-brand-600" />
                Skills ({resumeData.skills?.length || 0})
              </div>
              {openSections.skills ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
            {openSections.skills && (
              <div className="form-section-content">
                <SkillsForm
                  skills={resumeData.skills}
                  onChange={(skills) =>
                    setResumeData((prev) => ({ ...prev, skills }))
                  }
                />
              </div>
            )}
          </div>

          {/* Form Section 4: Work Experience */}
          <div className="form-section-card">
            <div
              className="form-section-header"
              onClick={() => toggleSection("experience")}
            >
              <div className="form-section-title">
                <Briefcase className="w-4 h-4 text-brand-600" />
                Work Experience ({resumeData.experience?.length || 0})
              </div>
              {openSections.experience ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
            {openSections.experience && (
              <div className="form-section-content">
                <ExperienceForm
                  experience={resumeData.experience}
                  onChange={(experience) =>
                    setResumeData((prev) => ({ ...prev, experience }))
                  }
                />
              </div>
            )}
          </div>

          {/* Form Section 5: Education */}
          <div className="form-section-card">
            <div
              className="form-section-header"
              onClick={() => toggleSection("education")}
            >
              <div className="form-section-title">
                <GraduationCap className="w-4 h-4 text-brand-600" />
                Education ({resumeData.education?.length || 0})
              </div>
              {openSections.education ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
            {openSections.education && (
              <div className="form-section-content">
                <EducationForm
                  education={resumeData.education}
                  onChange={(education) =>
                    setResumeData((prev) => ({ ...prev, education }))
                  }
                />
              </div>
            )}
          </div>

          {/* Form Section 6: Key Projects */}
          <div className="form-section-card">
            <div
              className="form-section-header"
              onClick={() => toggleSection("projects")}
            >
              <div className="form-section-title">
                <FolderGit2 className="w-4 h-4 text-brand-600" />
                Projects ({resumeData.projects?.length || 0})
              </div>
              {openSections.projects ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
            {openSections.projects && (
              <div className="form-section-content">
                <ProjectsForm
                  projects={resumeData.projects}
                  onChange={(projects) =>
                    setResumeData((prev) => ({ ...prev, projects }))
                  }
                />
              </div>
            )}
          </div>

          {/* Form Section 7: Certifications */}
          <div className="form-section-card">
            <div
              className="form-section-header"
              onClick={() => toggleSection("certifications")}
            >
              <div className="form-section-title">
                <Award className="w-4 h-4 text-brand-600" />
                Certifications ({resumeData.certifications?.length || 0})
              </div>
              {openSections.certifications ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
            {openSections.certifications && (
              <div className="form-section-content">
                <CertificationsForm
                  certifications={resumeData.certifications}
                  onChange={(certifications) =>
                    setResumeData((prev) => ({ ...prev, certifications }))
                  }
                />
              </div>
            )}
          </div>

          {/* Form Section 8: Languages */}
          <div className="form-section-card">
            <div
              className="form-section-header"
              onClick={() => toggleSection("languages")}
            >
              <div className="form-section-title">
                <Languages className="w-4 h-4 text-brand-600" />
                Languages ({resumeData.languages?.length || 0})
              </div>
              {openSections.languages ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
            {openSections.languages && (
              <div className="form-section-content">
                <LanguagesForm
                  languages={resumeData.languages}
                  onChange={(languages) =>
                    setResumeData((prev) => ({ ...prev, languages }))
                  }
                />
              </div>
            )}
          </div>

          {/* Form Section 9: Interests */}
          <div className="form-section-card">
            <div
              className="form-section-header"
              onClick={() => toggleSection("interests")}
            >
              <div className="form-section-title">
                <Heart className="w-4 h-4 text-brand-600" />
                Interests ({resumeData.interests?.length || 0})
              </div>
              {openSections.interests ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
            {openSections.interests && (
              <div className="form-section-content">
                <InterestsForm
                  interests={resumeData.interests}
                  onChange={(interests) =>
                    setResumeData((prev) => ({ ...prev, interests }))
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Live A4 Resume Preview */}
        <div
          className={`builder-preview-pane ${
            mobileTab === "preview" ? "mobile-active" : ""
          }`}
        >
          <div className="preview-toolbar no-print">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-brand-600" /> Live A4 Preview
            </span>
            <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">
              Format: Standard A4 (210mm x 297mm)
            </span>
          </div>

          <ResumePreview
            ref={previewRef}
            resume={resumeData}
            templateId={template}
            color={color}
            font={font}
          />
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <div className="mobile-view-toggle no-print">
        <button
          type="button"
          className={mobileTab === "form" ? "active" : ""}
          onClick={() => setMobileTab("form")}
        >
          <Edit3 className="w-3.5 h-3.5 inline mr-1" /> Edit
        </button>
        <button
          type="button"
          className={mobileTab === "preview" ? "active" : ""}
          onClick={() => setMobileTab("preview")}
        >
          <Eye className="w-3.5 h-3.5 inline mr-1" /> Preview
        </button>
      </div>

      {/* Subscription Required / Upgrade Modal */}
      {upgradeModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 no-print">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header with gradient and glow */}
            <div className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-7 overflow-hidden">
              <div className="absolute -right-10 -top-10 w-36 h-36 bg-amber-500/20 rounded-full blur-2xl pointer-events-none"></div>

              <button
                type="button"
                onClick={() => setUpgradeModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Subscription Required</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Unlock 16 Premium Templates
              </h3>
              <p className="text-xs sm:text-sm text-indigo-200 mt-1">
                {lockedTemplateAttempted
                  ? `The "${lockedTemplateAttempted.name}" template is an exclusive Pro plan feature.`
                  : "Upgrade to any Pro plan to unlock all 16 premium resume designs & unlimited PDF exports."}
              </p>
            </div>

            {/* Body Perks List */}
            <div className="p-6 space-y-4">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                What you get with Pro Resume Access:
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                    ✓
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-semibold">
                      All 16 Executive, Tech & Creative Layouts
                    </strong>
                    <span className="text-slate-500 text-[11px]">
                      Stand out with Wall Street, Leadership, Vogue, Infographic & Terminal formats.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                    ✓
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-semibold">
                      High-Fidelity A4 Puppeteer PDF Generation
                    </strong>
                    <span className="text-slate-500 text-[11px]">
                      Pixel-perfect multi-page export optimized for ATS scanners and recruiters.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                    ✓
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-semibold">
                      Candidate Spotlight & Recruiter Direct Messaging
                    </strong>
                    <span className="text-slate-500 text-[11px]">
                      Get top placement in recruiter searches & direct message quotas.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-6 pt-2 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setTemplate("modern");
                  setUpgradeModalOpen(false);
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
              >
                Use Free Simple Template
              </button>

              <button
                type="button"
                onClick={() => {
                  setUpgradeModalOpen(false);
                  navigate("/pricing");
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
              >
                <span>View Plans & Upgrade</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
