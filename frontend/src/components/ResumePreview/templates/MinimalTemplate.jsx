import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import TravelDetailsSection from "../TravelDetailsSection";

export default function MinimalTemplate({ resume, color, font }) {
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
      className="resume-page minimal-template"
      style={{
        "--primary-color": color || "#475569",
        fontFamily: font || "Inter, sans-serif"
      }}
    >
      {/* Minimal Header */}
      <header className="minimal-header">
        <h1>{personal.fullName || "Your Full Name"}</h1>
        <div className="job-title">{personal.jobTitle || "Professional Title"}</div>

        <div className="contacts-row">
          {personal.email && (
            <a href={`mailto:${personal.email}`} className="contact-item">
              <Mail />
              <span>{personal.email}</span>
            </a>
          )}
          {personal.phone && (
            <a href={`tel:${personal.phone}`} className="contact-item">
              <Phone />
              <span>{personal.phone}</span>
            </a>
          )}
          {personal.location && (
            <span className="contact-item">
              <MapPin />
              <span>{personal.location}</span>
            </span>
          )}
          {personal.website && (
            <a
              href={personal.website.startsWith("http") ? personal.website : `https://${personal.website}`}
              target="_blank"
              rel="noreferrer"
              className="contact-item"
            >
              <Globe />
              <span>{personal.website.replace(/^https?:\/\//, "")}</span>
            </a>
          )}
          {personal.linkedin && (
            <a
              href={personal.linkedin.startsWith("http") ? personal.linkedin : `https://${personal.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="contact-item"
            >
              <FaLinkedin />
              <span>{personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}</span>
            </a>
          )}
          {personal.github && (
            <a
              href={personal.github.startsWith("http") ? personal.github : `https://${personal.github}`}
              target="_blank"
              rel="noreferrer"
              className="contact-item"
            >
              <FaGithub />
              <span>{personal.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}</span>
            </a>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="minimal-section resume-section-block">
          <h2 className="minimal-section-title">About Me</h2>
          <p style={{ fontSize: "12.5px", color: "#334155", lineHeight: 1.65, margin: 0 }}>
            {summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="minimal-section resume-section-block">
          <h2 className="minimal-section-title">Experience</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="resume-exp-item">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 600, fontSize: "13px", color: "#0f172a" }}>
                    {exp.jobTitle} <span style={{ fontWeight: 400, color: "#64748b" }}>at</span> {exp.company}
                  </span>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                    {exp.startDate} {exp.startDate && (exp.endDate || exp.isCurrent) ? "–" : ""}{" "}
                    {exp.isCurrent ? "Present" : exp.endDate}
                  </span>
                </div>
                {exp.location && (
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>
                    {exp.location}
                  </div>
                )}
                {exp.description && (
                  <div style={{ fontSize: "12px", color: "#475569", whiteSpace: "pre-line", lineHeight: 1.55 }}>
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="minimal-section resume-section-block">
          <h2 className="minimal-section-title">Education</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="resume-edu-item">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 600, fontSize: "12.5px", color: "#0f172a" }}>
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                  </span>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                    {edu.startDate} {edu.startDate && edu.endDate ? "–" : ""} {edu.endDate}
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>
                  {edu.institution} {edu.location ? `• ${edu.location}` : ""}
                </div>
                {edu.description && (
                  <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: "2px" }}>
                    {edu.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="minimal-section resume-section-block">
          <h2 className="minimal-section-title">Selected Projects</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="resume-proj-item">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 600, fontSize: "12.5px", color: "#0f172a" }}>
                    {proj.name} {proj.role ? `(${proj.role})` : ""}
                  </span>
                  {proj.projectUrl && (
                    <a
                      href={proj.projectUrl.startsWith("http") ? proj.projectUrl : `https://${proj.projectUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: "11px", color: "var(--primary-color)", display: "inline-flex", alignItems: "center", gap: "2px" }}
                    >
                      <ExternalLink style={{ width: 10, height: 10 }} /> View
                    </a>
                  )}
                </div>
                {proj.technologies && (
                  <div style={{ fontSize: "11px", color: "var(--primary-color)", margin: "2px 0" }}>
                    {proj.technologies}
                  </div>
                )}
                {proj.description && (
                  <div style={{ fontSize: "11.5px", color: "#475569", lineHeight: 1.5 }}>
                    {proj.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="minimal-section resume-section-block">
          <h2 className="minimal-section-title">Skills & Capabilities</h2>
          <p style={{ fontSize: "12px", color: "#334155", lineHeight: 1.6, margin: 0 }}>
            {skills.join("  •  ")}
          </p>
        </section>
      )}

      {/* Certifications & Languages */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {certifications && certifications.length > 0 && (
          <section className="minimal-section resume-section-block">
            <h2 className="minimal-section-title">Certifications</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "11.5px", color: "#334155" }}>
              {certifications.map((cert, idx) => (
                <div key={cert.id || idx}>
                  <strong>{cert.name}</strong> — {cert.organization}
                </div>
              ))}
            </div>
          </section>
        )}

        {languages && languages.length > 0 && (
          <section className="minimal-section resume-section-block">
            <h2 className="minimal-section-title">Languages</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "11.5px", color: "#334155" }}>
              {languages.map((lang, idx) => (
                <div key={lang.id || idx}>
                  <strong>{lang.language}:</strong> {lang.proficiency}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Interests */}
      {interests && interests.length > 0 && (
        <section className="minimal-section resume-section-block">
          <h2 className="minimal-section-title">Interests</h2>
          <p style={{ fontSize: "11.5px", color: "#64748b", margin: 0 }}>
            {interests.join(", ")}
          </p>
        </section>
      )}

      {/* Passport, License & Travel Details */}
      <TravelDetailsSection travelDetails={travelDetails} variant="minimal" />
    </div>
  );
}
