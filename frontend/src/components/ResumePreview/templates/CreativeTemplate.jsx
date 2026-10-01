import { Mail, Phone, MapPin, Globe, ExternalLink, Sparkles, Folder, GraduationCap, Award, Heart } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import TravelDetailsSection from "../TravelDetailsSection";

export default function CreativeTemplate({ resume, color, font }) {
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
      className="resume-page creative-template"
      style={{
        "--primary-color": color || "#7c3aed",
        fontFamily: font || "Inter, sans-serif"
      }}
    >
      {/* Left Sidebar */}
      <aside className="creative-sidebar">
        {/* Profile photo with creative glowing border */}
        {personal.photo ? (
          <div className="creative-photo-wrap">
            <img
              src={personal.photo}
              alt={personal.fullName || "Creative Profile"}
              className="creative-photo"
            />
          </div>
        ) : (
          <div className="creative-initials-badge">
            {(personal.fullName || "CV").slice(0, 2).toUpperCase()}
          </div>
        )}

        {/* Contact info list */}
        <div className="creative-side-group">
          <h4 className="creative-side-heading">Contact</h4>
          <div className="creative-contact-list">
            {personal.email && (
              <a href={`mailto:${personal.email}`} className="creative-contact-item">
                <Mail className="creative-icon" />
                <span className="break-all">{personal.email}</span>
              </a>
            )}
            {personal.phone && (
              <a href={`tel:${personal.phone}`} className="creative-contact-item">
                <Phone className="creative-icon" />
                <span>{personal.phone}</span>
              </a>
            )}
            {personal.location && (
              <div className="creative-contact-item">
                <MapPin className="creative-icon" />
                <span>{personal.location}</span>
              </div>
            )}
            {personal.website && (
              <a
                href={personal.website.startsWith("http") ? personal.website : `https://${personal.website}`}
                target="_blank"
                rel="noreferrer"
                className="creative-contact-item"
              >
                <Globe className="creative-icon" />
                <span>{personal.website.replace(/^https?:\/\//, "")}</span>
              </a>
            )}
            {personal.linkedin && (
              <a
                href={personal.linkedin.startsWith("http") ? personal.linkedin : `https://${personal.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="creative-contact-item"
              >
                <FaLinkedin className="creative-icon" />
                <span>{personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}</span>
              </a>
            )}
            {personal.github && (
              <a
                href={personal.github.startsWith("http") ? personal.github : `https://${personal.github}`}
                target="_blank"
                rel="noreferrer"
                className="creative-contact-item"
              >
                <FaGithub className="creative-icon" />
                <span>{personal.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}</span>
              </a>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="creative-side-group">
            <h4 className="creative-side-heading">Expertise</h4>
            <div className="creative-skills-wrap">
              {skills.map((skill, idx) => (
                <span key={idx} className="creative-skill-pill">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div className="creative-side-group">
            <h4 className="creative-side-heading">Education</h4>
            <div className="creative-side-items">
              {education.map((edu, idx) => (
                <div key={edu.id || idx} className="creative-side-item resume-edu-item">
                  <div className="font-bold text-xs text-white">
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                  </div>
                  <div className="text-white/80 text-[11px] font-medium">{edu.institution}</div>
                  <div className="text-white/60 text-[10px]">
                    {edu.startDate} {edu.startDate && edu.endDate ? "–" : ""} {edu.endDate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <div className="creative-side-group">
            <h4 className="creative-side-heading">Languages</h4>
            <div className="creative-lang-list">
              {languages.map((lang, idx) => (
                <div key={lang.id || idx} className="creative-lang-item">
                  <span className="text-white text-xs font-medium">{lang.language}</span>
                  <span className="text-white/70 text-[10.5px]">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="creative-main">
        {/* Header Name & Title */}
        <header className="creative-header">
          <h1 className="creative-name">{personal.fullName || "Your Full Name"}</h1>
          <div className="creative-tagline">{personal.jobTitle || "Creative Designer & Developer"}</div>
        </header>

        {/* Summary */}
        {summary && (
          <section className="resume-section-block creative-section">
            <div className="creative-section-header">
              <Sparkles className="creative-sec-icon" />
              <h2>About Me</h2>
            </div>
            <p className="creative-summary-text">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section className="resume-section-block creative-section">
            <div className="creative-section-header">
              <Sparkles className="creative-sec-icon" />
              <h2>Experience</h2>
            </div>
            <div className="creative-exp-list">
              {experience.map((exp, idx) => (
                <div key={exp.id || idx} className="creative-exp-card resume-exp-item">
                  <div className="creative-exp-top">
                    <div>
                      <h3 className="creative-exp-title">{exp.jobTitle || "Role Title"}</h3>
                      <div className="creative-exp-company">
                        {exp.company} {exp.location ? `• ${exp.location}` : ""}
                      </div>
                    </div>
                    <span className="creative-exp-badge">
                      {exp.startDate} {exp.startDate && (exp.endDate || exp.isCurrent) ? "–" : ""}{" "}
                      {exp.isCurrent ? "Present" : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="creative-exp-desc">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section className="resume-section-block creative-section">
            <div className="creative-section-header">
              <Folder className="creative-sec-icon" />
              <h2>Featured Projects</h2>
            </div>
            <div className="creative-projects-grid">
              {projects.map((proj, idx) => (
                <div key={proj.id || idx} className="creative-proj-card resume-proj-item">
                  <div className="creative-proj-head">
                    <h3 className="creative-proj-title">{proj.name}</h3>
                    {proj.projectUrl && (
                      <a
                        href={proj.projectUrl.startsWith("http") ? proj.projectUrl : `https://${proj.projectUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="creative-link-badge"
                      >
                        <ExternalLink className="w-3 h-3" /> Link
                      </a>
                    )}
                  </div>
                  {proj.role && <div className="creative-proj-role">{proj.role}</div>}
                  {proj.technologies && (
                    <div className="creative-proj-tech">
                      <span>Stack:</span> {proj.technologies}
                    </div>
                  )}
                  {proj.description && (
                    <p className="creative-proj-desc">{proj.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Interests Row */}
        {((certifications && certifications.length > 0) || (interests && interests.length > 0)) && (
          <div className="creative-bottom-grid">
            {certifications && certifications.length > 0 && (
              <section className="resume-section-block creative-section">
                <div className="creative-section-header">
                  <Award className="creative-sec-icon" />
                  <h2>Certifications</h2>
                </div>
                <div className="creative-cert-list">
                  {certifications.map((cert, idx) => (
                    <div key={cert.id || idx} className="creative-cert-item resume-cert-item">
                      <div className="font-bold text-xs text-slate-800">{cert.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {cert.organization} {cert.issueDate ? `(${cert.issueDate})` : ""}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {interests && interests.length > 0 && (
              <section className="resume-section-block creative-section">
                <div className="creative-section-header">
                  <Heart className="creative-sec-icon" />
                  <h2>Interests</h2>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {interests.map((int, idx) => (
                    <span key={idx} className="creative-interest-chip">
                      {int}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Passport, License & Travel Details */}
        <TravelDetailsSection travelDetails={travelDetails} variant="creative" />
      </main>
    </div>
  );
}
