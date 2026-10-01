import { Mail, Phone, MapPin, Globe, ExternalLink, User, Briefcase, GraduationCap, Award, Wrench, FolderGit2, Languages, Heart } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import TravelDetailsSection from "../TravelDetailsSection";

export default function InfographicTemplate({ resume, color, font }) {
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
      className="resume-page infographic-template"
      style={{
        "--primary-color": color || "#d97706",
        fontFamily: font || "Inter, system-ui, sans-serif"
      }}
    >
      {/* Header Infographic Card */}
      <header className="info-header">
        <div className="info-header-content">
          {personal.photo && (
            <img
              src={personal.photo}
              alt={personal.fullName || "Candidate"}
              className="info-photo"
            />
          )}
          <div className="info-title-group">
            <h1 className="info-name">{personal.fullName || "Your Full Name"}</h1>
            <div className="info-badge-role">{personal.jobTitle || "Professional Title"}</div>
          </div>
        </div>

        {/* Contact info icon grid */}
        <div className="info-contact-grid">
          {personal.email && (
            <a href={`mailto:${personal.email}`} className="info-contact-card">
              <Mail className="info-icon" />
              <span>{personal.email}</span>
            </a>
          )}
          {personal.phone && (
            <a href={`tel:${personal.phone}`} className="info-contact-card">
              <Phone className="info-icon" />
              <span>{personal.phone}</span>
            </a>
          )}
          {personal.location && (
            <div className="info-contact-card">
              <MapPin className="info-icon" />
              <span>{personal.location}</span>
            </div>
          )}
          {personal.website && (
            <a
              href={personal.website.startsWith("http") ? personal.website : `https://${personal.website}`}
              target="_blank"
              rel="noreferrer"
              className="info-contact-card"
            >
              <Globe className="info-icon" />
              <span>{personal.website.replace(/^https?:\/\//, "")}</span>
            </a>
          )}
          {personal.linkedin && (
            <a
              href={personal.linkedin.startsWith("http") ? personal.linkedin : `https://${personal.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="info-contact-card"
            >
              <FaLinkedin className="info-icon" />
              <span>{personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}</span>
            </a>
          )}
          {personal.github && (
            <a
              href={personal.github.startsWith("http") ? personal.github : `https://${personal.github}`}
              target="_blank"
              rel="noreferrer"
              className="info-contact-card"
            >
              <FaGithub className="info-icon" />
              <span>{personal.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}</span>
            </a>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="resume-section-block info-section">
          <div className="info-sec-badge">
            <User className="w-4 h-4 text-white" />
            <span>Executive Overview</span>
          </div>
          <div className="info-summary-card">
            <p>{summary}</p>
          </div>
        </section>
      )}

      {/* Skills Infographic Badges */}
      {skills && skills.length > 0 && (
        <section className="resume-section-block info-section">
          <div className="info-sec-badge">
            <Wrench className="w-4 h-4 text-white" />
            <span>Skills & Proficiencies</span>
          </div>
          <div className="info-skills-flex">
            {skills.map((skill, idx) => (
              <div key={idx} className="info-skill-card">
                <span className="info-skill-dot"></span>
                <span className="info-skill-text">{skill}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="resume-section-block info-section">
          <div className="info-sec-badge">
            <Briefcase className="w-4 h-4 text-white" />
            <span>Career Path</span>
          </div>
          <div className="info-timeline">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="info-timeline-node resume-exp-item">
                <div className="info-node-marker"></div>
                <div className="info-node-card">
                  <div className="info-node-header">
                    <div>
                      <h3 className="info-node-title">{exp.jobTitle || "Job Title"}</h3>
                      <div className="info-node-subtitle">
                        {exp.company} {exp.location ? `• ${exp.location}` : ""}
                      </div>
                    </div>
                    <span className="info-date-tag">
                      {exp.startDate} {exp.startDate && (exp.endDate || exp.isCurrent) ? "–" : ""}{" "}
                      {exp.isCurrent ? "Present" : exp.endDate}
                    </span>
                  </div>
                  {exp.description && <p className="info-node-desc">{exp.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="resume-section-block info-section">
          <div className="info-sec-badge">
            <FolderGit2 className="w-4 h-4 text-white" />
            <span>Key Projects</span>
          </div>
          <div className="info-projects-grid">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="info-proj-card resume-proj-item">
                <div className="info-node-header">
                  <h3 className="info-node-title">{proj.name}</h3>
                  {proj.projectUrl && (
                    <a
                      href={proj.projectUrl.startsWith("http") ? proj.projectUrl : `https://${proj.projectUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="info-link"
                    >
                      <ExternalLink className="w-3 h-3 inline mr-1" />
                      View
                    </a>
                  )}
                </div>
                {proj.role && <div className="text-xs font-semibold text-slate-700">{proj.role}</div>}
                {proj.technologies && (
                  <div className="text-[11px] text-amber-700 font-medium">Tech: {proj.technologies}</div>
                )}
                {proj.description && <p className="info-node-desc">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Certifications Row */}
      <div className="info-split-2">
        {education && education.length > 0 && (
          <section className="resume-section-block info-section">
            <div className="info-sec-badge">
              <GraduationCap className="w-4 h-4 text-white" />
              <span>Education</span>
            </div>
            <div className="info-cards-col">
              {education.map((edu, idx) => (
                <div key={edu.id || idx} className="info-mini-card resume-edu-item">
                  <div className="font-bold text-xs text-slate-800">
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                  </div>
                  <div className="text-xs text-amber-800">{edu.institution}</div>
                  <div className="text-[11px] text-slate-500">
                    {edu.startDate} {edu.startDate && edu.endDate ? "–" : ""} {edu.endDate}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {certifications && certifications.length > 0 && (
          <section className="resume-section-block info-section">
            <div className="info-sec-badge">
              <Award className="w-4 h-4 text-white" />
              <span>Certificates</span>
            </div>
            <div className="info-cards-col">
              {certifications.map((cert, idx) => (
                <div key={cert.id || idx} className="info-mini-card resume-cert-item">
                  <div className="font-bold text-xs text-slate-800">{cert.name}</div>
                  <div className="text-xs text-slate-500">
                    {cert.organization} {cert.issueDate ? `(${cert.issueDate})` : ""}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Languages & Interests */}
      {((languages && languages.length > 0) || (interests && interests.length > 0)) && (
        <div className="info-footer-box">
          {languages && languages.length > 0 && (
            <div className="info-footer-item">
              <Languages className="w-3.5 h-3.5 text-amber-700 inline mr-1" />
              <strong className="text-xs text-slate-800">Languages: </strong>
              <span className="text-xs text-slate-600">
                {languages.map((l) => `${l.language} (${l.proficiency})`).join(" • ")}
              </span>
            </div>
          )}
          {interests && interests.length > 0 && (
            <div className="info-footer-item">
              <Heart className="w-3.5 h-3.5 text-rose-500 inline mr-1" />
              <strong className="text-xs text-slate-800">Interests: </strong>
              <span className="text-xs text-slate-600">{interests.join(", ")}</span>
            </div>
          )}
        </div>
      )}

      {/* Passport, License & Travel Details */}
      <TravelDetailsSection travelDetails={travelDetails} variant="infographic" />
    </div>
  );
}
