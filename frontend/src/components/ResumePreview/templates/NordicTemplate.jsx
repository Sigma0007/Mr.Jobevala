import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";

export default function NordicTemplate({ resume, color, font }) {
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
      className="resume-page nordic-template"
      style={{
        "--primary-color": color || "#059669",
        fontFamily: font || "Inter, system-ui, sans-serif"
      }}
    >
      {/* Nordic Top Header */}
      <header className="nordic-header">
        <div className="nordic-header-main">
          {personal.photo && (
            <img
              src={personal.photo}
              alt={personal.fullName || "Candidate"}
              className="nordic-photo"
            />
          )}
          <div>
            <h1 className="nordic-name">{personal.fullName || "Your Full Name"}</h1>
            <div className="nordic-job">{personal.jobTitle || "Professional Title"}</div>
          </div>
        </div>

        <div className="nordic-contact-chips">
          {personal.email && (
            <a href={`mailto:${personal.email}`} className="nordic-chip">
              <Mail className="nordic-icon" />
              <span>{personal.email}</span>
            </a>
          )}
          {personal.phone && (
            <a href={`tel:${personal.phone}`} className="nordic-chip">
              <Phone className="nordic-icon" />
              <span>{personal.phone}</span>
            </a>
          )}
          {personal.location && (
            <span className="nordic-chip">
              <MapPin className="nordic-icon" />
              <span>{personal.location}</span>
            </span>
          )}
          {personal.website && (
            <a
              href={personal.website.startsWith("http") ? personal.website : `https://${personal.website}`}
              target="_blank"
              rel="noreferrer"
              className="nordic-chip"
            >
              <Globe className="nordic-icon" />
              <span>{personal.website.replace(/^https?:\/\//, "")}</span>
            </a>
          )}
          {personal.linkedin && (
            <a
              href={personal.linkedin.startsWith("http") ? personal.linkedin : `https://${personal.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="nordic-chip"
            >
              <FaLinkedin className="nordic-icon" />
              <span>{personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}</span>
            </a>
          )}
          {personal.github && (
            <a
              href={personal.github.startsWith("http") ? personal.github : `https://${personal.github}`}
              target="_blank"
              rel="noreferrer"
              className="nordic-chip"
            >
              <FaGithub className="nordic-icon" />
              <span>{personal.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}</span>
            </a>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="resume-section-block nordic-section">
          <h2 className="nordic-heading">About</h2>
          <p className="nordic-summary">{summary}</p>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="resume-section-block nordic-section">
          <h2 className="nordic-heading">Competencies</h2>
          <div className="nordic-skills-wrap">
            {skills.map((skill, idx) => (
              <span key={idx} className="nordic-skill-pill">
                <span className="nordic-dot"></span>
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="resume-section-block nordic-section">
          <h2 className="nordic-heading">Experience</h2>
          <div className="nordic-list">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="nordic-item resume-exp-item">
                <div className="nordic-item-head">
                  <div>
                    <h3 className="nordic-role">{exp.jobTitle || "Job Title"}</h3>
                    <div className="nordic-sub">
                      {exp.company} {exp.location ? `• ${exp.location}` : ""}
                    </div>
                  </div>
                  <span className="nordic-dates">
                    {exp.startDate} {exp.startDate && (exp.endDate || exp.isCurrent) ? "–" : ""}{" "}
                    {exp.isCurrent ? "Present" : exp.endDate}
                  </span>
                </div>
                {exp.description && <p className="nordic-desc">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="resume-section-block nordic-section">
          <h2 className="nordic-heading">Key Projects</h2>
          <div className="nordic-list">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="nordic-item resume-proj-item">
                <div className="nordic-item-head">
                  <h3 className="nordic-role">{proj.name}</h3>
                  {proj.projectUrl && (
                    <a
                      href={proj.projectUrl.startsWith("http") ? proj.projectUrl : `https://${proj.projectUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="nordic-link"
                    >
                      <ExternalLink className="w-3 h-3 inline mr-1" />
                      View Project
                    </a>
                  )}
                </div>
                {proj.role && <div className="nordic-sub">{proj.role}</div>}
                {proj.technologies && (
                  <div className="nordic-tech">Tech: {proj.technologies}</div>
                )}
                {proj.description && <p className="nordic-desc">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Certifications Split */}
      <div className="nordic-grid-2">
        {education && education.length > 0 && (
          <section className="resume-section-block nordic-section">
            <h2 className="nordic-heading">Education</h2>
            <div className="nordic-list">
              {education.map((edu, idx) => (
                <div key={edu.id || idx} className="nordic-item resume-edu-item">
                  <div className="font-bold text-xs text-slate-800">
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                  </div>
                  <div className="text-xs text-emerald-800 font-medium">{edu.institution}</div>
                  <div className="text-[11px] text-slate-400">
                    {edu.startDate} {edu.startDate && edu.endDate ? "–" : ""} {edu.endDate}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {certifications && certifications.length > 0 && (
          <section className="resume-section-block nordic-section">
            <h2 className="nordic-heading">Certifications</h2>
            <div className="nordic-list">
              {certifications.map((cert, idx) => (
                <div key={cert.id || idx} className="nordic-item resume-cert-item">
                  <div className="font-bold text-xs text-slate-800">{cert.name}</div>
                  <div className="text-xs text-slate-500">
                    {cert.organization} {cert.issueDate ? `• ${cert.issueDate}` : ""}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Languages & Interests */}
      {((languages && languages.length > 0) || (interests && interests.length > 0)) && (
        <div className="nordic-footer">
          {languages && languages.length > 0 && (
            <div className="text-xs text-slate-600">
              <strong className="text-slate-800">Languages: </strong>
              {languages.map((l) => `${l.language} (${l.proficiency})`).join(" • ")}
            </div>
          )}
          {interests && interests.length > 0 && (
            <div className="text-xs text-slate-500 mt-1">
              <strong className="text-slate-800">Interests: </strong>
              {interests.join(", ")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
