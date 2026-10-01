import { LayoutGrid, Mail, Phone, MapPin, Globe, ExternalLink, Briefcase, GraduationCap, Award, Cpu, Code } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import TravelDetailsSection from "../TravelDetailsSection";

export default function MetroTemplate({ resume, color, font }) {
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
      className="resume-page metro-template"
      style={{
        "--primary-color": color || "#4338ca",
        fontFamily: font || "Inter, system-ui, sans-serif"
      }}
    >
      {/* Metro Header Tile */}
      <header className="metro-header-card">
        <div className="metro-header-left">
          {personal.photo && (
            <img
              src={personal.photo}
              alt={personal.fullName || "Candidate"}
              className="metro-photo"
            />
          )}
          <div>
            <h1 className="metro-name">{personal.fullName || "Your Full Name"}</h1>
            <div className="metro-role">{personal.jobTitle || "Professional Title"}</div>
          </div>
        </div>

        <div className="metro-contact-grid">
          {personal.email && (
            <a href={`mailto:${personal.email}`} className="metro-contact-item">
              <Mail className="metro-icon" />
              <span>{personal.email}</span>
            </a>
          )}
          {personal.phone && (
            <a href={`tel:${personal.phone}`} className="metro-contact-item">
              <Phone className="metro-icon" />
              <span>{personal.phone}</span>
            </a>
          )}
          {personal.location && (
            <span className="metro-contact-item">
              <MapPin className="metro-icon" />
              <span>{personal.location}</span>
            </span>
          )}
          {personal.website && (
            <a
              href={personal.website.startsWith("http") ? personal.website : `https://${personal.website}`}
              target="_blank"
              rel="noreferrer"
              className="metro-contact-item"
            >
              <Globe className="metro-icon" />
              <span>{personal.website.replace(/^https?:\/\//, "")}</span>
            </a>
          )}
          {personal.linkedin && (
            <a
              href={personal.linkedin.startsWith("http") ? personal.linkedin : `https://${personal.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="metro-contact-item"
            >
              <FaLinkedin className="metro-icon" />
              <span>{personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}</span>
            </a>
          )}
          {personal.github && (
            <a
              href={personal.github.startsWith("http") ? personal.github : `https://${personal.github}`}
              target="_blank"
              rel="noreferrer"
              className="metro-contact-item"
            >
              <FaGithub className="metro-icon" />
              <span>{personal.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}</span>
            </a>
          )}
        </div>
      </header>

      {/* Summary Card */}
      {summary && (
        <section className="resume-section-block metro-card">
          <h2 className="metro-card-title">Professional Overview</h2>
          <p className="metro-summary">{summary}</p>
        </section>
      )}

      {/* Experience Tile */}
      {experience && experience.length > 0 && (
        <section className="resume-section-block metro-card">
          <h2 className="metro-card-title">Experience</h2>
          <div className="metro-list">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="metro-item resume-exp-item">
                <div className="metro-item-header">
                  <div>
                    <h3 className="metro-item-role">{exp.jobTitle || "Job Title"}</h3>
                    <div className="metro-item-sub">
                      {exp.company} {exp.location ? `• ${exp.location}` : ""}
                    </div>
                  </div>
                  <span className="metro-date-badge">
                    {exp.startDate} {exp.startDate && (exp.endDate || exp.isCurrent) ? "–" : ""}{" "}
                    {exp.isCurrent ? "Present" : exp.endDate}
                  </span>
                </div>
                {exp.description && <div className="metro-desc">{exp.description}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Tile */}
      {projects && projects.length > 0 && (
        <section className="resume-section-block metro-card">
          <h2 className="metro-card-title">Projects</h2>
          <div className="metro-grid-2">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="metro-sub-card resume-proj-item">
                <div className="flex items-center justify-between">
                  <h3 className="metro-item-role">{proj.name}</h3>
                  {proj.projectUrl && (
                    <a
                      href={proj.projectUrl.startsWith("http") ? proj.projectUrl : `https://${proj.projectUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="metro-link"
                    >
                      <ExternalLink className="w-3 h-3 inline mr-1" />
                      View
                    </a>
                  )}
                </div>
                {proj.role && <div className="metro-item-sub">{proj.role}</div>}
                {proj.technologies && <div className="metro-tech">Tech: {proj.technologies}</div>}
                {proj.description && <div className="metro-desc">{proj.description}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills Card */}
      {skills && skills.length > 0 && (
        <section className="resume-section-block metro-card">
          <h2 className="metro-card-title">Skills & Capabilities</h2>
          <div className="metro-skills-wrap">
            {skills.map((skill, idx) => (
              <span key={idx} className="metro-skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Education & Certifications Row */}
      <div className="metro-grid-2">
        {education && education.length > 0 && (
          <section className="resume-section-block metro-card">
            <h2 className="metro-card-title">Education</h2>
            <div className="metro-list">
              {education.map((edu, idx) => (
                <div key={edu.id || idx} className="metro-sub-card resume-edu-item">
                  <div className="font-bold text-xs text-slate-800">
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                  </div>
                  <div className="text-xs text-indigo-700">{edu.institution}</div>
                  <div className="text-[11px] text-slate-500">
                    {edu.startDate} {edu.startDate && edu.endDate ? "–" : ""} {edu.endDate}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {certifications && certifications.length > 0 && (
          <section className="resume-section-block metro-card">
            <h2 className="metro-card-title">Certifications</h2>
            <div className="metro-list">
              {certifications.map((cert, idx) => (
                <div key={cert.id || idx} className="metro-sub-card resume-cert-item">
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
        <div className="metro-footer">
          {languages && languages.length > 0 && (
            <div className="text-xs text-slate-700">
              <strong>Languages: </strong>
              {languages.map((l) => `${l.language} (${l.proficiency})`).join(" • ")}
            </div>
          )}
          {interests && interests.length > 0 && (
            <div className="text-xs text-slate-500 mt-1">
              <strong>Interests: </strong>
              {interests.join(", ")}
            </div>
          )}
        </div>
      )}

      {/* Passport, License & Travel Details */}
      <TravelDetailsSection travelDetails={travelDetails} variant="metro" />
    </div>
  );
}
