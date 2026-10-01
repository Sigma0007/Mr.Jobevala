import { Mail, Phone, MapPin, Globe, ExternalLink, Calendar, Circle } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import TravelDetailsSection from "../TravelDetailsSection";

export default function TimelineTemplate({ resume, color, font }) {
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
      className="resume-page timeline-template"
      style={{
        "--primary-color": color || "#0891b2",
        fontFamily: font || "Inter, system-ui, sans-serif"
      }}
    >
      {/* Header */}
      <header className="tl-header">
        <div className="tl-header-left">
          {personal.photo && (
            <img
              src={personal.photo}
              alt={personal.fullName || "Candidate"}
              className="tl-photo"
            />
          )}
          <div>
            <h1 className="tl-name">{personal.fullName || "Your Full Name"}</h1>
            <div className="tl-role">{personal.jobTitle || "Professional Title"}</div>
          </div>
        </div>

        <div className="tl-contacts">
          {personal.email && (
            <a href={`mailto:${personal.email}`} className="tl-contact-item">
              <Mail className="tl-icon" />
              <span>{personal.email}</span>
            </a>
          )}
          {personal.phone && (
            <a href={`tel:${personal.phone}`} className="tl-contact-item">
              <Phone className="tl-icon" />
              <span>{personal.phone}</span>
            </a>
          )}
          {personal.location && (
            <span className="tl-contact-item">
              <MapPin className="tl-icon" />
              <span>{personal.location}</span>
            </span>
          )}
          {personal.website && (
            <a
              href={personal.website.startsWith("http") ? personal.website : `https://${personal.website}`}
              target="_blank"
              rel="noreferrer"
              className="tl-contact-item"
            >
              <Globe className="tl-icon" />
              <span>{personal.website.replace(/^https?:\/\//, "")}</span>
            </a>
          )}
          {personal.linkedin && (
            <a
              href={personal.linkedin.startsWith("http") ? personal.linkedin : `https://${personal.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="tl-contact-item"
            >
              <FaLinkedin className="tl-icon" />
              <span>{personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}</span>
            </a>
          )}
          {personal.github && (
            <a
              href={personal.github.startsWith("http") ? personal.github : `https://${personal.github}`}
              target="_blank"
              rel="noreferrer"
              className="tl-contact-item"
            >
              <FaGithub className="tl-icon" />
              <span>{personal.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}</span>
            </a>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="resume-section-block tl-section">
          <h2 className="tl-section-title">Summary</h2>
          <p className="tl-summary-text">{summary}</p>
        </section>
      )}

      {/* Experience with Connected Timeline Spine */}
      {experience && experience.length > 0 && (
        <section className="resume-section-block tl-section">
          <h2 className="tl-section-title">Career Timeline</h2>
          <div className="tl-spine-container">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="tl-spine-row resume-exp-item">
                <div className="tl-spine-bullet">
                  <div className="tl-spine-dot"></div>
                  {idx < experience.length - 1 && <div className="tl-spine-line"></div>}
                </div>
                <div className="tl-spine-content">
                  <div className="tl-item-header">
                    <div>
                      <h3 className="tl-item-role">{exp.jobTitle || "Job Title"}</h3>
                      <div className="tl-item-company">
                        {exp.company} {exp.location ? `• ${exp.location}` : ""}
                      </div>
                    </div>
                    <span className="tl-date-badge">
                      {exp.startDate} {exp.startDate && (exp.endDate || exp.isCurrent) ? "–" : ""}{" "}
                      {exp.isCurrent ? "Present" : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <div className="tl-item-desc">{exp.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="resume-section-block tl-section">
          <h2 className="tl-section-title">Key Projects</h2>
          <div className="tl-grid-2">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="tl-card resume-proj-item">
                <div className="flex items-center justify-between">
                  <h3 className="tl-card-title">{proj.name}</h3>
                  {proj.projectUrl && (
                    <a
                      href={proj.projectUrl.startsWith("http") ? proj.projectUrl : `https://${proj.projectUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="tl-card-link"
                    >
                      <ExternalLink className="w-3 h-3 inline mr-0.5" /> Link
                    </a>
                  )}
                </div>
                {proj.role && <div className="tl-card-role">{proj.role}</div>}
                {proj.technologies && (
                  <div className="tl-card-tech">Tech: {proj.technologies}</div>
                )}
                {proj.description && <p className="tl-card-desc">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education Timeline */}
      {education && education.length > 0 && (
        <section className="resume-section-block tl-section">
          <h2 className="tl-section-title">Education Journey</h2>
          <div className="tl-spine-container">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="tl-spine-row resume-edu-item">
                <div className="tl-spine-bullet">
                  <div className="tl-spine-dot"></div>
                  {idx < education.length - 1 && <div className="tl-spine-line"></div>}
                </div>
                <div className="tl-spine-content">
                  <div className="tl-item-header">
                    <div>
                      <h3 className="tl-item-role">
                        {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                      </h3>
                      <div className="tl-item-company">{edu.institution}</div>
                    </div>
                    <span className="tl-date-badge">
                      {edu.startDate} {edu.startDate && edu.endDate ? "–" : ""} {edu.endDate}
                    </span>
                  </div>
                  {edu.description && <div className="tl-item-desc">{edu.description}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills, Certifications, Languages Footer Grid */}
      <div className="tl-footer-grid">
        {skills && skills.length > 0 && (
          <div className="resume-section-block">
            <h3 className="tl-sub-title">Skills</h3>
            <div className="tl-skills-wrap">
              {skills.map((s, idx) => (
                <span key={idx} className="tl-skill-badge">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {certifications && certifications.length > 0 && (
          <div className="resume-section-block">
            <h3 className="tl-sub-title">Certifications</h3>
            <div className="tl-cert-list">
              {certifications.map((c, idx) => (
                <div key={c.id || idx} className="resume-cert-item text-xs text-slate-700">
                  <span className="font-semibold">{c.name}</span> — {c.organization}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Languages & Interests */}
      {((languages && languages.length > 0) || (interests && interests.length > 0)) && (
        <div className="tl-meta-bar">
          {languages && languages.length > 0 && (
            <div>
              <strong className="text-slate-800">Languages: </strong>
              {languages.map((l) => `${l.language} (${l.proficiency})`).join(" • ")}
            </div>
          )}
          {interests && interests.length > 0 && (
            <div className="mt-1">
              <strong className="text-slate-800">Interests: </strong>
              {interests.join(", ")}
            </div>
          )}
        </div>
      )}

      {/* Passport, License & Travel Details */}
      <TravelDetailsSection travelDetails={travelDetails} variant="timeline" />
    </div>
  );
}
