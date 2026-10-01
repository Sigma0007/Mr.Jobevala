import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import TravelDetailsSection from "../TravelDetailsSection";

export default function CompactTemplate({ resume, color, font }) {
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
      className="resume-page compact-template"
      style={{
        "--primary-color": color || "#334155",
        fontFamily: font || "Inter, system-ui, sans-serif"
      }}
    >
      {/* Left Sidebar (33%) */}
      <div className="compact-sidebar">
        {personal.photo && (
          <div className="compact-photo-wrap">
            <img
              src={personal.photo}
              alt={personal.fullName || "Candidate"}
              className="compact-photo"
            />
          </div>
        )}

        {/* Contact Info */}
        <div className="compact-side-block">
          <h3 className="compact-side-heading">Contact</h3>
          <div className="compact-contact-list">
            {personal.email && (
              <a href={`mailto:${personal.email}`} className="compact-contact-item">
                <Mail className="compact-icon" />
                <span className="break-all">{personal.email}</span>
              </a>
            )}
            {personal.phone && (
              <a href={`tel:${personal.phone}`} className="compact-contact-item">
                <Phone className="compact-icon" />
                <span>{personal.phone}</span>
              </a>
            )}
            {personal.location && (
              <div className="compact-contact-item">
                <MapPin className="compact-icon" />
                <span>{personal.location}</span>
              </div>
            )}
            {personal.website && (
              <a
                href={personal.website.startsWith("http") ? personal.website : `https://${personal.website}`}
                target="_blank"
                rel="noreferrer"
                className="compact-contact-item"
              >
                <Globe className="compact-icon" />
                <span>{personal.website.replace(/^https?:\/\//, "")}</span>
              </a>
            )}
            {personal.linkedin && (
              <a
                href={personal.linkedin.startsWith("http") ? personal.linkedin : `https://${personal.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="compact-contact-item"
              >
                <FaLinkedin className="compact-icon" />
                <span>{personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}</span>
              </a>
            )}
            {personal.github && (
              <a
                href={personal.github.startsWith("http") ? personal.github : `https://${personal.github}`}
                target="_blank"
                rel="noreferrer"
                className="compact-contact-item"
              >
                <FaGithub className="compact-icon" />
                <span>{personal.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}</span>
              </a>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="compact-side-block">
            <h3 className="compact-side-heading">Skills</h3>
            <div className="compact-skills-list">
              {skills.map((skill, idx) => (
                <span key={idx} className="compact-skill-badge">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div className="compact-side-block">
            <h3 className="compact-side-heading">Education</h3>
            <div className="compact-side-items">
              {education.map((edu, idx) => (
                <div key={edu.id || idx} className="compact-side-item resume-edu-item">
                  <div className="compact-side-item-title">
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                  </div>
                  <div className="compact-side-item-sub">{edu.institution}</div>
                  <div className="compact-side-item-date">
                    {edu.startDate} {edu.startDate && edu.endDate ? "–" : ""} {edu.endDate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div className="compact-side-block">
            <h3 className="compact-side-heading">Certifications</h3>
            <div className="compact-side-items">
              {certifications.map((c, idx) => (
                <div key={c.id || idx} className="compact-side-item resume-cert-item">
                  <div className="compact-side-item-title">{c.name}</div>
                  <div className="compact-side-item-sub">
                    {c.organization} {c.issueDate ? `(${c.issueDate})` : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <div className="compact-side-block">
            <h3 className="compact-side-heading">Languages</h3>
            <div className="compact-lang-list">
              {languages.map((l, idx) => (
                <div key={l.id || idx} className="compact-lang-row">
                  <span>{l.language}</span>
                  <span className="opacity-75">{l.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Main Content (67%) */}
      <div className="compact-main">
        <header className="compact-header">
          <h1 className="compact-name">{personal.fullName || "Your Full Name"}</h1>
          <div className="compact-role">{personal.jobTitle || "Professional Title"}</div>
        </header>

        {/* Summary */}
        {summary && (
          <section className="resume-section-block compact-section">
            <h2 className="compact-sec-heading">Profile</h2>
            <p className="compact-summary-text">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section className="resume-section-block compact-section">
            <h2 className="compact-sec-heading">Experience</h2>
            <div className="compact-exp-list">
              {experience.map((exp, idx) => (
                <div key={exp.id || idx} className="compact-exp-item resume-exp-item">
                  <div className="compact-exp-header">
                    <div>
                      <span className="compact-job-title">{exp.jobTitle || "Job Title"}</span>
                      <span className="compact-sep">|</span>
                      <span className="compact-company">{exp.company}</span>
                      {exp.location && <span className="compact-loc">({exp.location})</span>}
                    </div>
                    <span className="compact-date">
                      {exp.startDate} {exp.startDate && (exp.endDate || exp.isCurrent) ? "–" : ""}{" "}
                      {exp.isCurrent ? "Present" : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <div className="compact-desc">{exp.description}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section className="resume-section-block compact-section">
            <h2 className="compact-sec-heading">Projects</h2>
            <div className="compact-proj-list">
              {projects.map((proj, idx) => (
                <div key={proj.id || idx} className="compact-proj-item resume-proj-item">
                  <div className="compact-proj-header">
                    <div>
                      <span className="compact-proj-name">{proj.name}</span>
                      {proj.role && <span className="compact-proj-role"> — {proj.role}</span>}
                    </div>
                    {proj.projectUrl && (
                      <a
                        href={proj.projectUrl.startsWith("http") ? proj.projectUrl : `https://${proj.projectUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="compact-proj-link"
                      >
                        <ExternalLink className="w-3 h-3 inline" /> Link
                      </a>
                    )}
                  </div>
                  {proj.technologies && (
                    <div className="compact-proj-tech">Stack: {proj.technologies}</div>
                  )}
                  {proj.description && (
                    <div className="compact-desc">{proj.description}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Interests */}
        {interests && interests.length > 0 && (
          <section className="resume-section-block compact-section">
            <h2 className="compact-sec-heading">Interests</h2>
            <div className="compact-interests-row">
              {interests.join(" • ")}
            </div>
          </section>
        )}

        {/* Passport, License & Travel Details */}
        <TravelDetailsSection travelDetails={travelDetails} variant="compact" />
      </div>
    </div>
  );
}
