import { Rocket, Mail, Phone, MapPin, Globe, ExternalLink, Zap, Layers, Sparkles } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import TravelDetailsSection from "../TravelDetailsSection";

export default function StartupTemplate({ resume, color, font }) {
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
      className="resume-page startup-template"
      style={{
        "--primary-color": color || "#ef4444",
        fontFamily: font || "Inter, system-ui, sans-serif"
      }}
    >
      {/* Startup High-Impact Header */}
      <header className="startup-header">
        <div className="startup-header-badge">
          <Rocket className="w-3.5 h-3.5 inline mr-1 text-amber-300" />
          <span>READY TO SCALE & IMPACT</span>
        </div>

        <div className="startup-header-main">
          {personal.photo && (
            <img
              src={personal.photo}
              alt={personal.fullName || "Candidate"}
              className="startup-photo"
            />
          )}
          <div>
            <h1 className="startup-name">{personal.fullName || "Your Full Name"}</h1>
            <div className="startup-title">{personal.jobTitle || "Product Engineer / Growth Leader"}</div>
          </div>
        </div>

        <div className="startup-contacts">
          {personal.email && (
            <a href={`mailto:${personal.email}`} className="startup-contact-link">
              <Mail className="startup-icon" />
              <span>{personal.email}</span>
            </a>
          )}
          {personal.phone && (
            <a href={`tel:${personal.phone}`} className="startup-contact-link">
              <Phone className="startup-icon" />
              <span>{personal.phone}</span>
            </a>
          )}
          {personal.location && (
            <span className="startup-contact-link">
              <MapPin className="startup-icon" />
              <span>{personal.location}</span>
            </span>
          )}
          {personal.website && (
            <a
              href={personal.website.startsWith("http") ? personal.website : `https://${personal.website}`}
              target="_blank"
              rel="noreferrer"
              className="startup-contact-link"
            >
              <Globe className="startup-icon" />
              <span>{personal.website.replace(/^https?:\/\//, "")}</span>
            </a>
          )}
          {personal.linkedin && (
            <a
              href={personal.linkedin.startsWith("http") ? personal.linkedin : `https://${personal.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="startup-contact-link"
            >
              <FaLinkedin className="startup-icon" />
              <span>{personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}</span>
            </a>
          )}
          {personal.github && (
            <a
              href={personal.github.startsWith("http") ? personal.github : `https://${personal.github}`}
              target="_blank"
              rel="noreferrer"
              className="startup-contact-link"
            >
              <FaGithub className="startup-icon" />
              <span>{personal.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}</span>
            </a>
          )}
        </div>
      </header>

      {/* Body Area */}
      <div className="startup-body">
        {/* Pitch / Summary */}
        {summary && (
          <section className="resume-section-block startup-section">
            <h2 className="startup-sec-title">
              <Zap className="startup-sec-icon" />
              Impact Summary
            </h2>
            <div className="startup-summary-card">
              <p>{summary}</p>
            </div>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section className="resume-section-block startup-section">
            <h2 className="startup-sec-title">
              <Layers className="startup-sec-icon" />
              Career Traction & Experience
            </h2>
            <div className="startup-exp-list">
              {experience.map((exp, idx) => (
                <div key={exp.id || idx} className="startup-exp-card resume-exp-item">
                  <div className="startup-exp-top">
                    <div>
                      <h3 className="startup-exp-role">{exp.jobTitle || "Role Title"}</h3>
                      <div className="startup-exp-company">
                        {exp.company} {exp.location ? `• ${exp.location}` : ""}
                      </div>
                    </div>
                    <span className="startup-exp-date">
                      {exp.startDate} {exp.startDate && (exp.endDate || exp.isCurrent) ? "–" : ""}{" "}
                      {exp.isCurrent ? "Present" : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <div className="startup-exp-desc">{exp.description}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section className="resume-section-block startup-section">
            <h2 className="startup-sec-title">
              <Sparkles className="startup-sec-icon" />
              Shipped Products & Projects
            </h2>
            <div className="startup-projects-grid">
              {projects.map((proj, idx) => (
                <div key={proj.id || idx} className="startup-proj-card resume-proj-item">
                  <div className="startup-proj-head">
                    <h3 className="startup-proj-title">{proj.name}</h3>
                    {proj.projectUrl && (
                      <a
                        href={proj.projectUrl.startsWith("http") ? proj.projectUrl : `https://${proj.projectUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="startup-proj-btn"
                      >
                        <ExternalLink className="w-3 h-3" /> Demo
                      </a>
                    )}
                  </div>
                  {proj.role && <div className="startup-proj-role">{proj.role}</div>}
                  {proj.technologies && (
                    <div className="startup-proj-tech">Built with: {proj.technologies}</div>
                  )}
                  {proj.description && (
                    <div className="startup-proj-desc">{proj.description}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <section className="resume-section-block startup-section">
            <h2 className="startup-sec-title">Core Stack & Superpowers</h2>
            <div className="startup-skills-cloud">
              {skills.map((skill, idx) => (
                <span key={idx} className="startup-skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education & Certs Row */}
        <div className="startup-grid-2">
          {education && education.length > 0 && (
            <section className="resume-section-block startup-section">
              <h2 className="startup-sec-title">Education</h2>
              {education.map((edu, idx) => (
                <div key={edu.id || idx} className="startup-mini-item resume-edu-item">
                  <div className="font-bold text-xs text-slate-900">
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                  </div>
                  <div className="text-xs text-red-600 font-semibold">{edu.institution}</div>
                  <div className="text-[11px] text-slate-500">
                    {edu.startDate} {edu.startDate && edu.endDate ? "–" : ""} {edu.endDate}
                  </div>
                </div>
              ))}
            </section>
          )}

          {certifications && certifications.length > 0 && (
            <section className="resume-section-block startup-section">
              <h2 className="startup-sec-title">Certifications</h2>
              {certifications.map((cert, idx) => (
                <div key={cert.id || idx} className="startup-mini-item resume-cert-item">
                  <div className="font-bold text-xs text-slate-900">{cert.name}</div>
                  <div className="text-xs text-slate-600">
                    {cert.organization} {cert.issueDate ? `(${cert.issueDate})` : ""}
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Languages & Interests */}
        {((languages && languages.length > 0) || (interests && interests.length > 0)) && (
          <div className="startup-footer-tags">
            {languages && languages.length > 0 && (
              <div className="text-xs text-slate-700">
                <strong>Languages: </strong>
                {languages.map((l) => `${l.language} (${l.proficiency})`).join(" • ")}
              </div>
            )}
            {interests && interests.length > 0 && (
              <div className="text-xs text-slate-500 mt-1">
                <strong>Interests: </strong>
                {interests.join(", ")}
              </div>
            )}
          </div>
        )}

        {/* Passport, License & Travel Details */}
        <TravelDetailsSection travelDetails={travelDetails} variant="startup" />
      </div>
    </div>
  );
}
