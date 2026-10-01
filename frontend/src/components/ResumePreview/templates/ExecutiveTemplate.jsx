import { Mail, Phone, MapPin, Globe, ExternalLink, Award, Briefcase, GraduationCap, Code } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import TravelDetailsSection from "../TravelDetailsSection";

export default function ExecutiveTemplate({ resume, color, font }) {
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
      className="resume-page executive-template"
      style={{
        "--primary-color": color || "#1e3a8a",
        fontFamily: font || "Inter, sans-serif"
      }}
    >
      {/* Executive Header Banner */}
      <header className="exec-header">
        <div className="exec-header-top">
          {personal.photo && (
            <img
              src={personal.photo}
              alt={personal.fullName || "Executive Profile"}
              className="exec-photo"
            />
          )}
          <div className="exec-title-block">
            <h1 className="exec-name">{personal.fullName || "Your Full Name"}</h1>
            <div className="exec-role">{personal.jobTitle || "Executive / Senior Leader"}</div>
            <div className="exec-accent-line"></div>
          </div>
        </div>

        <div className="exec-contact-bar">
          {personal.email && (
            <a href={`mailto:${personal.email}`} className="exec-contact-item">
              <Mail className="w-3.5 h-3.5" />
              <span>{personal.email}</span>
            </a>
          )}
          {personal.phone && (
            <a href={`tel:${personal.phone}`} className="exec-contact-item">
              <Phone className="w-3.5 h-3.5" />
              <span>{personal.phone}</span>
            </a>
          )}
          {personal.location && (
            <span className="exec-contact-item">
              <MapPin className="w-3.5 h-3.5" />
              <span>{personal.location}</span>
            </span>
          )}
          {personal.website && (
            <a
              href={personal.website.startsWith("http") ? personal.website : `https://${personal.website}`}
              target="_blank"
              rel="noreferrer"
              className="exec-contact-item"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{personal.website.replace(/^https?:\/\//, "")}</span>
            </a>
          )}
          {personal.linkedin && (
            <a
              href={personal.linkedin.startsWith("http") ? personal.linkedin : `https://${personal.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="exec-contact-item"
            >
              <FaLinkedin className="w-3.5 h-3.5" />
              <span>{personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}</span>
            </a>
          )}
          {personal.github && (
            <a
              href={personal.github.startsWith("http") ? personal.github : `https://${personal.github}`}
              target="_blank"
              rel="noreferrer"
              className="exec-contact-item"
            >
              <FaGithub className="w-3.5 h-3.5" />
              <span>{personal.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}</span>
            </a>
          )}
        </div>
      </header>

      {/* Main Two-Column Layout */}
      <div className="exec-body">
        {/* Main Left Column (70%) */}
        <div className="exec-main-col">
          {/* Executive Summary */}
          {summary && (
            <section className="resume-section-block exec-section">
              <h2 className="exec-section-title">
                <Briefcase className="exec-section-icon" />
                Executive Summary
              </h2>
              <div className="exec-summary-box">
                <p>{summary}</p>
              </div>
            </section>
          )}

          {/* Work Experience */}
          {experience && experience.length > 0 && (
            <section className="resume-section-block exec-section">
              <h2 className="exec-section-title">
                <Briefcase className="exec-section-icon" />
                Leadership & Experience
              </h2>
              <div className="exec-timeline">
                {experience.map((exp, idx) => (
                  <div key={exp.id || idx} className="exec-timeline-item resume-exp-item">
                    <div className="exec-item-header">
                      <div>
                        <span className="exec-item-role">{exp.jobTitle || "Job Title"}</span>
                        <span className="exec-item-sep">•</span>
                        <span className="exec-item-org">{exp.company}</span>
                        {exp.location && <span className="exec-item-loc">({exp.location})</span>}
                      </div>
                      <span className="exec-item-date">
                        {exp.startDate} {exp.startDate && (exp.endDate || exp.isCurrent) ? "–" : ""}{" "}
                        {exp.isCurrent ? "Present" : exp.endDate}
                      </span>
                    </div>
                    {exp.description && (
                      <div className="exec-item-desc">{exp.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Key Projects */}
          {projects && projects.length > 0 && (
            <section className="resume-section-block exec-section">
              <h2 className="exec-section-title">
                <Code className="exec-section-icon" />
                Strategic Initiatives & Projects
              </h2>
              <div className="exec-projects-list">
                {projects.map((proj, idx) => (
                  <div key={proj.id || idx} className="exec-proj-item resume-proj-item">
                    <div className="exec-item-header">
                      <span className="exec-item-role">{proj.name}</span>
                      {proj.projectUrl && (
                        <a
                          href={proj.projectUrl.startsWith("http") ? proj.projectUrl : `https://${proj.projectUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="exec-link"
                        >
                          <ExternalLink className="w-3 h-3 inline mr-1" />
                          View Project
                        </a>
                      )}
                    </div>
                    {proj.role && <div className="exec-proj-role">{proj.role}</div>}
                    {proj.technologies && (
                      <div className="exec-proj-tech">
                        <span>Stack:</span> {proj.technologies}
                      </div>
                    )}
                    {proj.description && (
                      <div className="exec-item-desc">{proj.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Passport, License & Travel Details */}
          <TravelDetailsSection travelDetails={travelDetails} variant="executive" />
        </div>

        {/* Right Sidebar Column (30%) */}
        <aside className="exec-side-col">
          {/* Core Competencies / Skills */}
          {skills && skills.length > 0 && (
            <section className="resume-section-block exec-side-section">
              <h3 className="exec-side-title">Core Competencies</h3>
              <div className="exec-skills-grid">
                {skills.map((skill, idx) => (
                  <div key={idx} className="exec-skill-pill">
                    <span className="exec-skill-dot"></span>
                    {skill}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <section className="resume-section-block exec-side-section">
              <h3 className="exec-side-title">
                <GraduationCap className="w-3.5 h-3.5 inline mr-1" />
                Education
              </h3>
              <div className="exec-side-list">
                {education.map((edu, idx) => (
                  <div key={edu.id || idx} className="exec-side-item resume-edu-item">
                    <div className="exec-edu-degree">
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                    </div>
                    <div className="exec-edu-school">{edu.institution}</div>
                    <div className="exec-side-meta">
                      {edu.startDate} {edu.startDate && edu.endDate ? "–" : ""} {edu.endDate}
                    </div>
                    {edu.description && <div className="exec-side-desc">{edu.description}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <section className="resume-section-block exec-side-section">
              <h3 className="exec-side-title">
                <Award className="w-3.5 h-3.5 inline mr-1" />
                Certifications
              </h3>
              <div className="exec-side-list">
                {certifications.map((cert, idx) => (
                  <div key={cert.id || idx} className="exec-side-item resume-cert-item">
                    <div className="exec-cert-name">{cert.name}</div>
                    <div className="exec-cert-org">
                      {cert.organization} {cert.issueDate ? `(${cert.issueDate})` : ""}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <section className="resume-section-block exec-side-section">
              <h3 className="exec-side-title">Languages</h3>
              <div className="exec-lang-list">
                {languages.map((lang, idx) => (
                  <div key={lang.id || idx} className="exec-lang-row">
                    <span className="font-semibold text-slate-800">{lang.language}</span>
                    <span className="text-slate-500 text-[11px]">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Interests */}
          {interests && interests.length > 0 && (
            <section className="resume-section-block exec-side-section">
              <h3 className="exec-side-title">Interests</h3>
              <div className="exec-interests-tags">
                {interests.map((interest, idx) => (
                  <span key={idx} className="exec-interest-badge">
                    {interest}
                  </span>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
