import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";

export default function ElegantTemplate({ resume, color, font }) {
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
      className="resume-page elegant-template"
      style={{
        "--primary-color": color || "#831843",
        fontFamily: font || "Georgia, Cambria, serif"
      }}
    >
      {/* Centered Sophisticated Header */}
      <header className="elegant-header">
        {personal.photo && (
          <img
            src={personal.photo}
            alt={personal.fullName || "Candidate"}
            className="elegant-photo"
          />
        )}
        <h1 className="elegant-name">{personal.fullName || "Your Full Name"}</h1>
        <div className="elegant-title">{personal.jobTitle || "Professional Title"}</div>

        <div className="elegant-ornament">
          <span className="elegant-line"></span>
          <span className="elegant-diamond">✦</span>
          <span className="elegant-line"></span>
        </div>

        <div className="elegant-contact-row">
          {personal.email && (
            <a href={`mailto:${personal.email}`} className="elegant-contact-item">
              <Mail className="w-3 h-3" />
              <span>{personal.email}</span>
            </a>
          )}
          {personal.phone && (
            <a href={`tel:${personal.phone}`} className="elegant-contact-item">
              <Phone className="w-3 h-3" />
              <span>{personal.phone}</span>
            </a>
          )}
          {personal.location && (
            <span className="elegant-contact-item">
              <MapPin className="w-3 h-3" />
              <span>{personal.location}</span>
            </span>
          )}
          {personal.website && (
            <a
              href={personal.website.startsWith("http") ? personal.website : `https://${personal.website}`}
              target="_blank"
              rel="noreferrer"
              className="elegant-contact-item"
            >
              <Globe className="w-3 h-3" />
              <span>{personal.website.replace(/^https?:\/\//, "")}</span>
            </a>
          )}
          {personal.linkedin && (
            <a
              href={personal.linkedin.startsWith("http") ? personal.linkedin : `https://${personal.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="elegant-contact-item"
            >
              <FaLinkedin className="w-3 h-3" />
              <span>{personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}</span>
            </a>
          )}
          {personal.github && (
            <a
              href={personal.github.startsWith("http") ? personal.github : `https://${personal.github}`}
              target="_blank"
              rel="noreferrer"
              className="elegant-contact-item"
            >
              <FaGithub className="w-3 h-3" />
              <span>{personal.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}</span>
            </a>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="resume-section-block elegant-section">
          <h2 className="elegant-sec-title">Personal Profile</h2>
          <p className="elegant-summary">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="resume-section-block elegant-section">
          <h2 className="elegant-sec-title">Professional Experience</h2>
          <div className="elegant-list">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="elegant-item resume-exp-item">
                <div className="elegant-item-head">
                  <div>
                    <h3 className="elegant-role">{exp.jobTitle || "Job Title"}</h3>
                    <div className="elegant-org">{exp.company} {exp.location ? `• ${exp.location}` : ""}</div>
                  </div>
                  <span className="elegant-dates">
                    {exp.startDate} {exp.startDate && (exp.endDate || exp.isCurrent) ? "–" : ""}{" "}
                    {exp.isCurrent ? "Present" : exp.endDate}
                  </span>
                </div>
                {exp.description && <p className="elegant-desc">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="resume-section-block elegant-section">
          <h2 className="elegant-sec-title">Notable Endeavors & Projects</h2>
          <div className="elegant-list">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="elegant-item resume-proj-item">
                <div className="elegant-item-head">
                  <div>
                    <h3 className="elegant-role">{proj.name}</h3>
                    {proj.role && <span className="elegant-sub">{proj.role}</span>}
                  </div>
                  {proj.projectUrl && (
                    <a
                      href={proj.projectUrl.startsWith("http") ? proj.projectUrl : `https://${proj.projectUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="elegant-link"
                    >
                      <ExternalLink className="w-3 h-3 inline mr-1" />
                      View Portfolio
                    </a>
                  )}
                </div>
                {proj.technologies && (
                  <div className="elegant-tech">Technologies: {proj.technologies}</div>
                )}
                {proj.description && <p className="elegant-desc">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="resume-section-block elegant-section">
          <h2 className="elegant-sec-title">Education & Credentials</h2>
          <div className="elegant-list">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="elegant-item resume-edu-item">
                <div className="elegant-item-head">
                  <div>
                    <h3 className="elegant-role">
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                    </h3>
                    <div className="elegant-org">{edu.institution}</div>
                  </div>
                  <span className="elegant-dates">
                    {edu.startDate} {edu.startDate && edu.endDate ? "–" : ""} {edu.endDate}
                  </span>
                </div>
                {edu.description && <p className="elegant-desc">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills, Certifications & Languages Grid */}
      <div className="elegant-bottom-grid">
        {skills && skills.length > 0 && (
          <div className="resume-section-block">
            <h3 className="elegant-sub-title">Expertise</h3>
            <div className="elegant-skills">
              {skills.map((skill, idx) => (
                <span key={idx} className="elegant-skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {certifications && certifications.length > 0 && (
          <div className="resume-section-block">
            <h3 className="elegant-sub-title">Certificates</h3>
            <div className="elegant-certs">
              {certifications.map((c, idx) => (
                <div key={c.id || idx} className="resume-cert-item text-xs text-slate-700 mb-1">
                  <strong>{c.name}</strong> — {c.organization} ({c.issueDate})
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Languages & Interests */}
      {((languages && languages.length > 0) || (interests && interests.length > 0)) && (
        <div className="elegant-footer-meta">
          {languages && languages.length > 0 && (
            <div>
              <strong>Languages: </strong>
              {languages.map((l) => `${l.language} (${l.proficiency})`).join(" • ")}
            </div>
          )}
          {interests && interests.length > 0 && (
            <div className="mt-1">
              <strong>Interests: </strong>
              {interests.join(", ")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
