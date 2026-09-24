import { useState, useEffect, useRef } from "react";
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
  Sparkles
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

import ResumePreview from "../components/ResumePreview/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorSelector from "../components/ColorSelector";

import "../styles/resume.css";
import "../styles/builder.css";

const STORAGE_KEY = "resume_builder_data_v1";
const SETTINGS_KEY = "resume_builder_settings_v1";

export default function ResumeBuilder() {
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
    interests: false
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
    window.print();
  };

  // Real PDF Export using Node.js Puppeteer backend
  const handleDownloadPdf = async () => {
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
    </div>
  );
}
