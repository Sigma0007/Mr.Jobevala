import { Mail, Phone, MapPin, Globe, ExternalLink, Briefcase, GraduationCap, Award, ShieldCheck } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import TravelDetailsSection from "../TravelDetailsSection";

export default function CorporateTemplate({ resume, color, font }) {
  const {
    personal = {},
    summary = "",
    skills = [],
    experience = [],
    education = [],
    projects = [],
    certifications = [],
    languages = [],
    interests = [],
    travelDetails = {}
  } = resume;

  return (
    <div
      className="resume-page corporate-template"
      style={{
        "--primary-color": color || "#1d4ed8",
        fontFamily: font || "Inter, sans-serif"
      }}
    >
      {/* Top Banner Header */}
      <header className="corp-header">
        <div className="corp-header-top">
          {personal.photo && (
            <img
              src={personal.photo}
              alt={personal.fullName || "Corporate Professional"}
              className="corp-photo"
            />
          )}
          <div>
            <h1 className="corp-name">{personal.fullName || "Your Full Name"}</h1>
            <div className="corp-role">{personal.jobTitle || "Corporate Specialist"}</div>
          </div>
        </div>

        <div className="corp-contact-bar">
          {personal.email && (
            <a href={`mailto:${personal.email}`} className="corp-contact-item">
              <Mail className="w-3.5 h-3.5" />
              <span>{personal.email}</span>
            </a>
          )}
          {personal.phone && (
            <a href={`tel:${personal.phone}`} className="corp-contact-item">
              <Phone className="w-3.5 h-3.5" />
              <span>{personal.phone}</span>
            </a>
          )}
          {personal.location && (
            <span className="corp-contact-item">
              <MapPin className="w-3.5 h-3.5" />
              <span>{personal.location}</span>
            </span>
          )}
          {personal.website && (
            <a
              href={personal.website.startsWith("http") ? personal.website : `https://${personal.website}`}
              target="_blank"
              rel="noreferrer"
              className="corp-contact-item"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{personal.website.replace(/^https?:\/\//, "")}</span>
            </a>
          )}
          {personal.linkedin && (
            <a
              href={personal.linkedin.startsWith("http") ? personal.linkedin : `https://${personal.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="corp-contact-item"
            >
              <FaLinkedin className="w-3.5 h-3.5" />
              <span>{personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}</span>
            </a>
          )}
          {personal.github && (
            <a
              href={personal.github.startsWith("http") ? personal.github : `https://${personal.github}`}
              target="_blank"
              rel="noreferrer"
              className="corp-contact-item"
            >
              <FaGithub className="w-3.5 h-3.5" />
              <span>{personal.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}</span>
            </a>
          )}
        </div>
      </header>

      {/* Main Grid */}
      <div className="corp-body">
        {/* Left main pane (65%) */}
        <div className="corp-main-col">
          {/* Summary */}
          {summary && (
            <section className="resume-section-block corp-section">
              <h2 className="corp-section-title">
                <ShieldCheck className="corp-icon-inline" />
                Executive Summary
              </h2>
              <p className="corp-desc">{summary}</p>
            </section>
          )}

          {/* Work Experience */}
          {experience && experience.length > 0 && (
            <section className="resume-section-block corp-section">
              <h2 className="corp-section-title">
                <Briefcase className="corp-icon-inline" />
                Professional Experience
              </h2>
              <div className="corp-list">
                {experience.map((exp, idx) => (
                  <div key={exp.id || idx} className="corp-exp-item resume-exp-item">
                    <div className="corp-item-header">
                      <div>
                        <span className="corp-role-title">{exp.jobTitle || "Job Title"}</span>
                        <span className="corp-company-name"> | {exp.company}</span>
                        {exp.location && <span className="corp-location"> ({exp.location})</span>}
                      </div>
                      <span className="corp-date-pill">
                        {exp.startDate} {exp.startDate && (exp.endDate || exp.isCurrent) ? "–" : ""}{" "}
                        {exp.isCurrent ? "Present" : exp.endDate}
                      </span>
                    </div>
                    {exp.description && (
                      <div className="corp-desc whitespace-pre-line mt-1">{exp.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <section className="resume-section-block corp-section">
              <h2 className="corp-section-title">Key Projects & Deliverables</h2>
              <div className="corp-list">
                {projects.map((proj, idx) => (
                  <div key={proj.id || idx} className="corp-proj-item resume-proj-item">
                    <div className="corp-item-header">
                      <span className="corp-role-title">{proj.name}</span>
                      {proj.projectUrl && (
                        <a
                          href={proj.projectUrl.startsWith("http") ? proj.projectUrl : `https://${proj.projectUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="corp-link"
                        >
                          <ExternalLink className="w-3 h-3 inline mr-1" /> View Project
                        </a>
                      )}
                    </div>
                    {proj.role && <div className="text-xs text-slate-600 font-medium">{proj.role}</div>}
                    {proj.technologies && (
                      <div className="text-[11px] text-blue-700 font-semibold">Tech: {proj.technologies}</div>
                    )}
                    {proj.description && (
                      <div className="corp-desc whitespace-pre-line mt-1">{proj.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Passport, License & Travel Details */}
          <TravelDetailsSection travelDetails={travelDetails} variant="corporate" />
        </div>

        {/* Right sidebar pane (35%) */}
        <div className="corp-side-col">
          {/* Skills */}
          {skills && skills.length > 0 && (
            <section className="resume-section-block corp-side-section">
              <h3 className="corp-side-title">Core Skills</h3>
              <div className="corp-skills-grid">
                {skills.map((skill, idx) => (
                  <span key={idx} className="corp-skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <section className="resume-section-block corp-side-section">
              <h3 className="corp-side-title">
                <GraduationCap className="corp-icon-inline" />
                Education
              </h3>
              <div className="corp-side-items">
                {education.map((edu, idx) => (
                  <div key={edu.id || idx} className="corp-side-item resume-edu-item">
                    <div className="corp-edu-degree">
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                    </div>
                    <div className="corp-edu-school">{edu.institution}</div>
                    <div className="corp-side-meta">
                      {edu.startDate} {edu.startDate && edu.endDate ? "–" : ""} {edu.endDate}
                    </div>
                    {edu.description && <div className="text-[11px] text-slate-600 mt-1">{edu.description}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <section className="resume-section-block corp-side-section">
              <h3 className="corp-side-title">
                <Award className="corp-icon-inline" />
                Certifications
              </h3>
              <div className="corp-side-items">
                {certifications.map((cert, idx) => (
                  <div key={cert.id || idx} className="corp-side-item resume-cert-item">
                    <div className="font-bold text-xs text-slate-900">{cert.name}</div>
                    <div className="text-xs text-slate-600">
                      {cert.organization} {cert.issueDate ? `(${cert.issueDate})` : ""}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <section className="resume-section-block corp-side-section">
              <h3 className="corp-side-title">Languages</h3>
              <div className="corp-side-items">
                {languages.map((l, idx) => (
                  <div key={l.id || idx} className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800">{l.language}</span>
                    <span className="text-slate-500">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Interests */}
          {interests && interests.length > 0 && (
            <section className="resume-section-block corp-side-section">
              <h3 className="corp-side-title">Interests</h3>
              <div className="text-xs text-slate-600">
                {interests.join(" • ")}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
