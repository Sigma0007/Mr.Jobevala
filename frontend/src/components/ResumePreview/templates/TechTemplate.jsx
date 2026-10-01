import { Terminal, Mail, Phone, MapPin, Globe, ExternalLink, Code2, Cpu, GraduationCap, Award, GitBranch } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import TravelDetailsSection from "../TravelDetailsSection";

export default function TechTemplate({ resume, color, font }) {
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
      className="resume-page tech-template"
      style={{
        "--primary-color": color || "#0284c7",
        fontFamily: font || "Inter, monospace, sans-serif"
      }}
    >
      {/* Tech Header Banner */}
      <header className="tech-header">
        <div className="tech-header-main">
          {personal.photo && (
            <img
              src={personal.photo}
              alt={personal.fullName || "Tech Lead"}
              className="tech-photo"
            />
          )}
          <div className="tech-title-wrap">
            <div className="tech-term-prompt">
              <span className="tech-prompt-symbol">&gt;_</span> ~/developer/profile
            </div>
            <h1 className="tech-name">{personal.fullName || "Your Full Name"}</h1>
            <div className="tech-role">{personal.jobTitle || "Software Engineer / Architect"}</div>
          </div>
        </div>

        {/* Developer Contact Ribbon */}
        <div className="tech-contact-row">
          {personal.email && (
            <a href={`mailto:${personal.email}`} className="tech-contact-item">
              <Mail className="tech-icon" />
              <span>{personal.email}</span>
            </a>
          )}
          {personal.phone && (
            <a href={`tel:${personal.phone}`} className="tech-contact-item">
              <Phone className="tech-icon" />
              <span>{personal.phone}</span>
            </a>
          )}
          {personal.location && (
            <span className="tech-contact-item">
              <MapPin className="tech-icon" />
              <span>{personal.location}</span>
            </span>
          )}
          {personal.github && (
            <a
              href={personal.github.startsWith("http") ? personal.github : `https://${personal.github}`}
              target="_blank"
              rel="noreferrer"
              className="tech-contact-item tech-highlight"
            >
              <FaGithub className="tech-icon" />
              <span>github.com/{personal.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}</span>
            </a>
          )}
          {personal.linkedin && (
            <a
              href={personal.linkedin.startsWith("http") ? personal.linkedin : `https://${personal.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="tech-contact-item"
            >
              <FaLinkedin className="tech-icon" />
              <span>linkedin.com/in/{personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}</span>
            </a>
          )}
          {personal.website && (
            <a
              href={personal.website.startsWith("http") ? personal.website : `https://${personal.website}`}
              target="_blank"
              rel="noreferrer"
              className="tech-contact-item"
            >
              <Globe className="tech-icon" />
              <span>{personal.website.replace(/^https?:\/\//, "")}</span>
            </a>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="resume-section-block tech-section">
          <div className="tech-section-title">
            <Terminal className="tech-title-icon" />
            <span>01. ABOUT_ME</span>
          </div>
          <div className="tech-summary-box">
            <p>{summary}</p>
          </div>
        </section>
      )}

      {/* Tech Stack / Skills Bar */}
      {skills && skills.length > 0 && (
        <section className="resume-section-block tech-section">
          <div className="tech-section-title">
            <Cpu className="tech-title-icon" />
            <span>02. TECHNICAL_SKILLS</span>
          </div>
          <div className="tech-skills-grid">
            {skills.map((skill, idx) => (
              <span key={idx} className="tech-skill-badge">
                <code>{`{ ${skill} }`}</code>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="resume-section-block tech-section">
          <div className="tech-section-title">
            <GitBranch className="tech-title-icon" />
            <span>03. WORK_EXPERIENCE</span>
          </div>
          <div className="tech-exp-list">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="tech-exp-item resume-exp-item">
                <div className="tech-exp-header">
                  <div>
                    <span className="tech-item-title">{exp.jobTitle || "Engineer"}</span>
                    <span className="tech-item-sep">@</span>
                    <span className="tech-item-company">{exp.company}</span>
                    {exp.location && <span className="tech-item-loc">[{exp.location}]</span>}
                  </div>
                  <span className="tech-item-date">
                    {exp.startDate} {exp.startDate && (exp.endDate || exp.isCurrent) ? "–" : ""}{" "}
                    {exp.isCurrent ? "Present" : exp.endDate}
                  </span>
                </div>
                {exp.description && (
                  <div className="tech-exp-desc">{exp.description}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="resume-section-block tech-section">
          <div className="tech-section-title">
            <Code2 className="tech-title-icon" />
            <span>04. FEATURED_PROJECTS</span>
          </div>
          <div className="tech-projects-grid">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="tech-project-card resume-proj-item">
                <div className="tech-proj-head">
                  <div className="tech-proj-name">{proj.name}</div>
                  {proj.projectUrl && (
                    <a
                      href={proj.projectUrl.startsWith("http") ? proj.projectUrl : `https://${proj.projectUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="tech-proj-link"
                    >
                      <ExternalLink className="w-3 h-3" /> Live
                    </a>
                  )}
                </div>
                {proj.role && <div className="tech-proj-role">{proj.role}</div>}
                {proj.technologies && (
                  <div className="tech-proj-stack">
                    <span className="text-slate-400">Stack:</span> {proj.technologies}
                  </div>
                )}
                {proj.description && (
                  <div className="tech-proj-desc">{proj.description}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Certifications Row */}
      <div className="tech-two-col">
        {/* Education */}
        {education && education.length > 0 && (
          <section className="resume-section-block tech-section">
            <div className="tech-section-title">
              <GraduationCap className="tech-title-icon" />
              <span>05. EDUCATION</span>
            </div>
            <div className="tech-edu-list">
              {education.map((edu, idx) => (
                <div key={edu.id || idx} className="tech-edu-item resume-edu-item">
                  <div className="font-bold text-xs text-slate-900">
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                  </div>
                  <div className="text-xs font-semibold text-sky-700">{edu.institution}</div>
                  <div className="text-[11px] text-slate-500">
                    {edu.startDate} {edu.startDate && edu.endDate ? "–" : ""} {edu.endDate}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Languages */}
        {((certifications && certifications.length > 0) || (languages && languages.length > 0)) && (
          <section className="resume-section-block tech-section">
            <div className="tech-section-title">
              <Award className="tech-title-icon" />
              <span>06. CERTS_&_LANGS</span>
            </div>
            <div className="tech-cert-list">
              {certifications && certifications.map((cert, idx) => (
                <div key={cert.id || idx} className="tech-cert-item resume-cert-item">
                  <span className="font-semibold text-xs text-slate-900">{cert.name}</span>
                  <span className="text-[11px] text-slate-500 ml-1">[{cert.organization}]</span>
                </div>
              ))}
              {languages && languages.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <span className="text-[11px] font-bold text-slate-600 uppercase">Languages: </span>
                  <span className="text-xs text-slate-700">
                    {languages.map((l) => `${l.language} (${l.proficiency})`).join(", ")}
                  </span>
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      {/* Passport, License & Travel Details */}
      <TravelDetailsSection travelDetails={travelDetails} variant="tech" />
    </div>
  );
}
