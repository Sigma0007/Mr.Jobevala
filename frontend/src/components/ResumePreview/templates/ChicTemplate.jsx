import { Mail, Phone, MapPin, Globe, ExternalLink, Sparkles, Feather, Bookmark } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";

export default function ChicTemplate({ resume, color, font }) {
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
      className="resume-page chic-template"
      style={{
        "--primary-color": color || "#be185d",
        fontFamily: font || "'Playfair Display', Georgia, serif"
      }}
    >
      {/* Top Chic Header */}
      <header className="chic-header">
        <div className="chic-header-inner">
          {personal.photo && (
            <img
              src={personal.photo}
              alt={personal.fullName || "Candidate"}
              className="chic-photo"
            />
          )}
          <div className="chic-header-text">
            <h1 className="chic-name">{personal.fullName || "Your Full Name"}</h1>
            <div className="chic-subtitle">{personal.jobTitle || "Creative Director / Specialist"}</div>
          </div>
        </div>

        <div className="chic-contacts">
          {personal.email && (
            <a href={`mailto:${personal.email}`} className="chic-contact-item">
              <Mail className="chic-icon" />
              <span>{personal.email}</span>
            </a>
          )}
          {personal.phone && (
            <a href={`tel:${personal.phone}`} className="chic-contact-item">
              <Phone className="chic-icon" />
              <span>{personal.phone}</span>
            </a>
          )}
          {personal.location && (
            <span className="chic-contact-item">
              <MapPin className="chic-icon" />
              <span>{personal.location}</span>
            </span>
          )}
          {personal.website && (
            <a
              href={personal.website.startsWith("http") ? personal.website : `https://${personal.website}`}
              target="_blank"
              rel="noreferrer"
              className="chic-contact-item"
            >
              <Globe className="chic-icon" />
              <span>{personal.website.replace(/^https?:\/\//, "")}</span>
            </a>
          )}
          {personal.linkedin && (
            <a
              href={personal.linkedin.startsWith("http") ? personal.linkedin : `https://${personal.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="chic-contact-item"
            >
              <FaLinkedin className="chic-icon" />
              <span>{personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}</span>
            </a>
          )}
          {personal.github && (
            <a
              href={personal.github.startsWith("http") ? personal.github : `https://${personal.github}`}
              target="_blank"
              rel="noreferrer"
              className="chic-contact-item"
            >
              <FaGithub className="chic-icon" />
              <span>{personal.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}</span>
            </a>
          )}
        </div>
      </header>

      {/* Main Grid */}
      <div className="chic-grid">
        {/* Left Column (Main, 65%) */}
        <div className="chic-col-main">
          {/* Summary */}
          {summary && (
            <section className="resume-section-block chic-section">
              <h2 className="chic-sec-heading">About Me</h2>
              <p className="chic-summary">{summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <section className="resume-section-block chic-section">
              <h2 className="chic-sec-heading">Experience</h2>
              <div className="chic-list">
                {experience.map((exp, idx) => (
                  <div key={exp.id || idx} className="chic-item resume-exp-item">
                    <div className="chic-item-header">
                      <div>
                        <h3 className="chic-item-title">{exp.jobTitle || "Job Title"}</h3>
                        <div className="chic-item-sub">
                          {exp.company} {exp.location ? `• ${exp.location}` : ""}
                        </div>
                      </div>
                      <span className="chic-date">
                        {exp.startDate} {exp.startDate && (exp.endDate || exp.isCurrent) ? "–" : ""}{" "}
                        {exp.isCurrent ? "Present" : exp.endDate}
                      </span>
                    </div>
                    {exp.description && <p className="chic-desc">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <section className="resume-section-block chic-section">
              <h2 className="chic-sec-heading">Selected Projects</h2>
              <div className="chic-list">
                {projects.map((proj, idx) => (
                  <div key={proj.id || idx} className="chic-item resume-proj-item">
                    <div className="chic-item-header">
                      <h3 className="chic-item-title">{proj.name}</h3>
                      {proj.projectUrl && (
                        <a
                          href={proj.projectUrl.startsWith("http") ? proj.projectUrl : `https://${proj.projectUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="chic-link"
                        >
                          <ExternalLink className="w-3 h-3 inline mr-1" /> View
                        </a>
                      )}
                    </div>
                    {proj.role && <div className="chic-item-sub">{proj.role}</div>}
                    {proj.technologies && (
                      <div className="chic-tech">Technologies: {proj.technologies}</div>
                    )}
                    {proj.description && <p className="chic-desc">{proj.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column (Sidebar, 35%) */}
        <div className="chic-col-side">
          {/* Skills */}
          {skills && skills.length > 0 && (
            <section className="resume-section-block chic-side-box">
              <h3 className="chic-side-heading">Key Skills</h3>
              <div className="chic-skills-wrap">
                {skills.map((skill, idx) => (
                  <span key={idx} className="chic-skill-pill">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <section className="resume-section-block chic-side-box">
              <h3 className="chic-side-heading">Education</h3>
              <div className="chic-side-items">
                {education.map((edu, idx) => (
                  <div key={edu.id || idx} className="chic-side-item resume-edu-item">
                    <div className="font-bold text-xs text-slate-800">
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                    </div>
                    <div className="text-xs text-rose-800">{edu.institution}</div>
                    <div className="text-[11px] text-slate-400">
                      {edu.startDate} {edu.startDate && edu.endDate ? "–" : ""} {edu.endDate}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <section className="resume-section-block chic-side-box">
              <h3 className="chic-side-heading">Certifications</h3>
              <div className="chic-side-items">
                {certifications.map((c, idx) => (
                  <div key={c.id || idx} className="chic-side-item resume-cert-item">
                    <div className="font-bold text-xs text-slate-800">{c.name}</div>
                    <div className="text-xs text-slate-500">
                      {c.organization} {c.issueDate ? `(${c.issueDate})` : ""}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages & Interests */}
          {languages && languages.length > 0 && (
            <section className="resume-section-block chic-side-box">
              <h3 className="chic-side-heading">Languages</h3>
              <div className="chic-side-items">
                {languages.map((l, idx) => (
                  <div key={l.id || idx} className="flex justify-between text-xs text-slate-700">
                    <span className="font-medium">{l.language}</span>
                    <span className="text-slate-400">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {interests && interests.length > 0 && (
            <section className="resume-section-block chic-side-box">
              <h3 className="chic-side-heading">Interests</h3>
              <div className="text-xs text-slate-500 leading-relaxed">
                {interests.join(", ")}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
