import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";

export default function ProfessionalTemplate({ resume, color, font }) {
  const {
    personal = {},
    summary = "",
    skills = [],
    experience = [],
    education = [],
    projects = [],
    certifications = [],
    languages = [],
    interests = []
  } = resume;

  return (
    <div
      className="resume-page professional-template"
      style={{
        "--primary-color": color || "#0f172a",
        fontFamily: font || "Inter, sans-serif"
      }}
    >
      {/* Executive Header */}
      <header className="prof-header">
        <div>
          <h1>{personal.fullName || "Your Full Name"}</h1>
          <div className="job-title">{personal.jobTitle || "Professional Title"}</div>

          <div className="contacts-grid">
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
        </div>

        {personal.photo && (
          <img
            src={personal.photo}
            alt={personal.fullName || "Profile"}
            className="profile-photo"
          />
        )}
      </header>

      {/* Summary */}
      {summary && (
        <section className="prof-section resume-section-block">
          <h2 className="prof-section-title">Executive Summary</h2>
          <p style={{ fontSize: "12.5px", color: "#334155", lineHeight: 1.6, margin: 0 }}>
            {summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="prof-section resume-section-block">
          <h2 className="prof-section-title">Professional Experience</h2>
          {experience.map((exp, idx) => (
            <div key={exp.id || idx} className="prof-timeline-item resume-exp-item">
              <div className="prof-timeline-header">
                <div>
                  <span className="prof-item-title">{exp.jobTitle || "Job Title"}</span>
                  <span style={{ margin: "0 6px", color: "#94a3b8" }}>|</span>
                  <span className="prof-item-subtitle">{exp.company}</span>
                  {exp.location && (
                    <span style={{ fontSize: "11.5px", color: "#64748b", marginLeft: "6px" }}>
                      ({exp.location})
                    </span>
                  )}
                </div>
                <span className="prof-item-date">
                  {exp.startDate} {exp.startDate && (exp.endDate || exp.isCurrent) ? "–" : ""}{" "}
                  {exp.isCurrent ? "Present" : exp.endDate}
                </span>
              </div>
              {exp.description && (
                <div className="prof-desc">{exp.description}</div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="prof-section resume-section-block">
          <h2 className="prof-section-title">Education</h2>
          {education.map((edu, idx) => (
            <div key={edu.id || idx} className="prof-timeline-item resume-edu-item">
              <div className="prof-timeline-header">
                <div>
                  <span className="prof-item-title">
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                  </span>
                  <span style={{ margin: "0 6px", color: "#94a3b8" }}>|</span>
                  <span className="prof-item-subtitle">{edu.institution}</span>
                </div>
                <span className="prof-item-date">
                  {edu.startDate} {edu.startDate && edu.endDate ? "–" : ""} {edu.endDate}
                </span>
              </div>
              {edu.description && (
                <div style={{ fontSize: "11.5px", color: "#475569", marginTop: "2px" }}>
                  {edu.description}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="prof-section resume-section-block">
          <h2 className="prof-section-title">Key Projects</h2>
          {projects.map((proj, idx) => (
            <div key={proj.id || idx} className="prof-timeline-item resume-proj-item">
              <div className="prof-timeline-header">
                <div>
                  <span className="prof-item-title">{proj.name}</span>
                  {proj.role && (
                    <span style={{ fontSize: "12px", color: "#64748b", marginLeft: "6px" }}>
                      • {proj.role}
                    </span>
                  )}
                </div>
                {proj.projectUrl && (
                  <a
                    href={proj.projectUrl.startsWith("http") ? proj.projectUrl : `https://${proj.projectUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: "11px", color: "var(--primary-color)", display: "inline-flex", alignItems: "center", gap: "2px" }}
                  >
                    <ExternalLink style={{ width: 11, height: 11 }} /> Link
                  </a>
                )}
              </div>
              {proj.technologies && (
                <div style={{ fontSize: "11px", color: "var(--primary-color)", fontWeight: 500 }}>
                  Technologies: {proj.technologies}
                </div>
              )}
              {proj.description && (
                <div className="prof-desc">{proj.description}</div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills & Certifications Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Skills */}
        {skills && skills.length > 0 && (
          <section className="prof-section resume-section-block">
            <h2 className="prof-section-title">Core Competencies</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: "11.5px",
                    fontWeight: 500,
                    padding: "2px 8px",
                    borderRadius: "4px",
                    background: "#f1f5f9",
                    color: "#334155"
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <section className="prof-section resume-section-block">
            <h2 className="prof-section-title">Certifications</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {certifications.map((cert, idx) => (
                <div key={cert.id || idx} className="resume-cert-item" style={{ fontSize: "11.5px" }}>
                  <span style={{ fontWeight: 600, color: "#0f172a" }}>{cert.name}</span>
                  <span style={{ color: "#64748b", marginLeft: "4px" }}>
                    — {cert.organization} ({cert.issueDate})
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Languages & Interests */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {languages && languages.length > 0 && (
          <section className="prof-section resume-section-block">
            <h2 className="prof-section-title">Languages</h2>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", fontSize: "11.5px" }}>
              {languages.map((lang, idx) => (
                <span key={lang.id || idx} style={{ color: "#334155" }}>
                  <strong>{lang.language}:</strong> {lang.proficiency}
                </span>
              ))}
            </div>
          </section>
        )}

        {interests && interests.length > 0 && (
          <section className="prof-section resume-section-block">
            <h2 className="prof-section-title">Interests</h2>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", fontSize: "11.5px", color: "#64748b" }}>
              {interests.join(" • ")}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
