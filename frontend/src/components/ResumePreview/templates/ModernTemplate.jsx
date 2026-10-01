import { Mail, Phone, MapPin, Globe, ExternalLink, Calendar } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import TravelDetailsSection from "../TravelDetailsSection";

export default function ModernTemplate({ resume, color, font }) {
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
      className="resume-page modern-template"
      style={{
        "--primary-color": color || "#2563eb",
        fontFamily: font || "Inter, sans-serif"
      }}
    >
      {/* Modern Header Bar */}
      <header className="modern-header">
        {personal.photo && (
          <img
            src={personal.photo}
            alt={personal.fullName || "Profile"}
            className="profile-photo"
          />
        )}
        <div className="header-info">
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
        </div>
      </header>

      {/* Two Column Body */}
      <div className="modern-body">
        {/* Main Column */}
        <div className="modern-main-col">
          {/* Summary */}
          {summary && (
            <section className="resume-section-block">
              <h2 className="modern-section-title">Professional Summary</h2>
              <p style={{ color: "#334155", lineHeight: 1.6, margin: 0 }}>
                {summary}
              </p>
            </section>
          )}

          {/* Work Experience */}
          {experience && experience.length > 0 && (
            <section className="resume-section-block">
              <h2 className="modern-section-title">Work Experience</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {experience.map((exp, idx) => (
                  <div key={exp.id || idx} className="resume-exp-item">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2px" }}>
                      <span style={{ fontWeight: 700, fontSize: "13.5px", color: "#0f172a" }}>
                        {exp.jobTitle || "Job Title"}
                      </span>
                      <span style={{ fontSize: "11.5px", color: "#64748b", fontWeight: 500 }}>
                        {exp.startDate} {exp.startDate && (exp.endDate || exp.isCurrent) ? "–" : ""}{" "}
                        {exp.isCurrent ? "Present" : exp.endDate}
                      </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ fontWeight: 600, color: "var(--primary-color)", fontSize: "12.5px" }}>
                        {exp.company}
                      </span>
                      {exp.location && (
                        <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                          {exp.location}
                        </span>
                      )}
                    </div>

                    {exp.description && (
                      <div style={{ fontSize: "12px", color: "#334155", whiteSpace: "pre-line", lineHeight: 1.55 }}>
                        {exp.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <section className="resume-section-block">
              <h2 className="modern-section-title">Key Projects</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {projects.map((proj, idx) => (
                  <div key={proj.id || idx} className="resume-proj-item">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontWeight: 700, fontSize: "13px", color: "#0f172a" }}>
                        {proj.name}
                      </span>
                      {proj.projectUrl && (
                        <a
                          href={proj.projectUrl.startsWith("http") ? proj.projectUrl : `https://${proj.projectUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: "11px", color: "var(--primary-color)", display: "inline-flex", alignItems: "center", gap: "3px" }}
                        >
                          <ExternalLink style={{ width: 11, height: 11 }} /> Link
                        </a>
                      )}
                    </div>

                    {proj.role && (
                      <div style={{ fontSize: "11.5px", fontWeight: 600, color: "#475569", marginBottom: "2px" }}>
                        {proj.role}
                      </div>
                    )}

                    {proj.technologies && (
                      <div style={{ fontSize: "11px", color: "var(--primary-color)", fontWeight: 500, marginBottom: "4px" }}>
                        Tech: {proj.technologies}
                      </div>
                    )}

                    {proj.description && (
                      <div style={{ fontSize: "12px", color: "#334155", whiteSpace: "pre-line", lineHeight: 1.5 }}>
                        {proj.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Passport, License & Travel Details */}
          <TravelDetailsSection travelDetails={travelDetails} variant="modern" />
        </div>

        {/* Sidebar Column */}
        <div className="modern-side-col">
          {/* Skills */}
          {skills && skills.length > 0 && (
            <section className="resume-section-block">
              <h2 className="modern-section-title">Skills</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {skills.map((skill, idx) => (
                  <span key={idx} className="resume-skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <section className="resume-section-block">
              <h2 className="modern-section-title">Education</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {education.map((edu, idx) => (
                  <div key={edu.id || idx} className="resume-edu-item">
                    <div style={{ fontWeight: 700, fontSize: "12.5px", color: "#0f172a" }}>
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                    </div>
                    <div style={{ color: "var(--primary-color)", fontWeight: 600, fontSize: "12px" }}>
                      {edu.institution}
                    </div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>
                      {edu.startDate} {edu.startDate && edu.endDate ? "–" : ""} {edu.endDate}
                      {edu.location ? ` | ${edu.location}` : ""}
                    </div>
                    {edu.description && (
                      <div style={{ fontSize: "11.5px", color: "#475569", marginTop: "3px" }}>
                        {edu.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <section className="resume-section-block">
              <h2 className="modern-section-title">Certifications</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {certifications.map((cert, idx) => (
                  <div key={cert.id || idx} className="resume-cert-item">
                    <div style={{ fontWeight: 700, fontSize: "12px", color: "#0f172a" }}>
                      {cert.name}
                    </div>
                    <div style={{ fontSize: "11.5px", color: "#475569" }}>
                      {cert.organization} {cert.issueDate ? `• ${cert.issueDate}` : ""}
                    </div>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl.startsWith("http") ? cert.credentialUrl : `https://${cert.credentialUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: "11px", color: "var(--primary-color)" }}
                      >
                        Verify Credential
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <section className="resume-section-block">
              <h2 className="modern-section-title">Languages</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {languages.map((lang, idx) => (
                  <div key={lang.id || idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px" }}>
                    <span style={{ fontWeight: 600, color: "#1e293b" }}>{lang.language}</span>
                    <span style={{ color: "#64748b" }}>{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Interests */}
          {interests && interests.length > 0 && (
            <section className="resume-section-block">
              <h2 className="modern-section-title">Interests</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {interests.map((interest, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: "11px",
                      padding: "2px 8px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "4px",
                      color: "#475569"
                    }}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
