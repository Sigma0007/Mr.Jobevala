import { Mail, Phone, MapPin, Globe, ExternalLink, BookOpen, GraduationCap, Award, FileText } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import TravelDetailsSection from "../TravelDetailsSection";

export default function AcademicTemplate({ resume, color, font }) {
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
      className="resume-page academic-template"
      style={{
        "--primary-color": color || "#1e293b",
        fontFamily: font || "Georgia, Cambria, serif"
      }}
    >
      {/* Formal Header */}
      <header className="academic-header">
        <h1 className="academic-name">{personal.fullName || "Your Full Name"}</h1>
        <div className="academic-title">{personal.jobTitle || "Curriculum Vitae / Researcher"}</div>

        <div className="academic-contact-line">
          {personal.email && (
            <a href={`mailto:${personal.email}`} className="academic-contact-item">
              <Mail className="w-3 h-3" />
              <span>{personal.email}</span>
            </a>
          )}
          {personal.phone && (
            <a href={`tel:${personal.phone}`} className="academic-contact-item">
              <Phone className="w-3 h-3" />
              <span>{personal.phone}</span>
            </a>
          )}
          {personal.location && (
            <span className="academic-contact-item">
              <MapPin className="w-3 h-3" />
              <span>{personal.location}</span>
            </span>
          )}
          {personal.website && (
            <a
              href={personal.website.startsWith("http") ? personal.website : `https://${personal.website}`}
              target="_blank"
              rel="noreferrer"
              className="academic-contact-item"
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
              className="academic-contact-item"
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
              className="academic-contact-item"
            >
              <FaGithub className="w-3 h-3" />
              <span>{personal.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}</span>
            </a>
          )}
        </div>
        <div className="academic-divider-line"></div>
      </header>

      {/* Summary / Research Statement */}
      {summary && (
        <section className="resume-section-block academic-section">
          <h2 className="academic-sec-title">
            <BookOpen className="w-3.5 h-3.5 inline mr-1" />
            Research Interests & Summary
          </h2>
          <p className="academic-text">{summary}</p>
        </section>
      )}

      {/* Education (Prioritized in Academic CV) */}
      {education && education.length > 0 && (
        <section className="resume-section-block academic-section">
          <h2 className="academic-sec-title">
            <GraduationCap className="w-3.5 h-3.5 inline mr-1" />
            Education & Academic Background
          </h2>
          <div className="academic-list">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="academic-item resume-edu-item">
                <div className="academic-item-top">
                  <div>
                    <span className="academic-item-role">
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                    </span>
                    <span className="academic-item-org"> — {edu.institution}</span>
                    {edu.location && <span className="text-slate-500 text-xs">, {edu.location}</span>}
                  </div>
                  <span className="academic-item-date">
                    {edu.startDate} {edu.startDate && edu.endDate ? "–" : ""} {edu.endDate}
                  </span>
                </div>
                {edu.description && <div className="academic-item-desc">{edu.description}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Academic & Professional Appointments / Experience */}
      {experience && experience.length > 0 && (
        <section className="resume-section-block academic-section">
          <h2 className="academic-sec-title">
            <FileText className="w-3.5 h-3.5 inline mr-1" />
            Appointments & Experience
          </h2>
          <div className="academic-list">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="academic-item resume-exp-item">
                <div className="academic-item-top">
                  <div>
                    <span className="academic-item-role">{exp.jobTitle || "Position"}</span>
                    <span className="academic-item-org">, {exp.company}</span>
                    {exp.location && <span className="text-slate-500 text-xs"> ({exp.location})</span>}
                  </div>
                  <span className="academic-item-date">
                    {exp.startDate} {exp.startDate && (exp.endDate || exp.isCurrent) ? "–" : ""}{" "}
                    {exp.isCurrent ? "Present" : exp.endDate}
                  </span>
                </div>
                {exp.description && <div className="academic-item-desc">{exp.description}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Research Projects & Publications */}
      {projects && projects.length > 0 && (
        <section className="resume-section-block academic-section">
          <h2 className="academic-sec-title">Research Projects & Publications</h2>
          <div className="academic-list">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="academic-item resume-proj-item">
                <div className="academic-item-top">
                  <div>
                    <span className="academic-item-role">"{proj.name}"</span>
                    {proj.role && <span className="text-slate-600 text-xs italic"> ({proj.role})</span>}
                  </div>
                  {proj.projectUrl && (
                    <a
                      href={proj.projectUrl.startsWith("http") ? proj.projectUrl : `https://${proj.projectUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="academic-link"
                    >
                      <ExternalLink className="w-3 h-3 inline mr-1" />
                      Publication
                    </a>
                  )}
                </div>
                {proj.technologies && (
                  <div className="text-xs text-slate-600 italic">Methodologies: {proj.technologies}</div>
                )}
                {proj.description && <div className="academic-item-desc">{proj.description}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Honors */}
      {certifications && certifications.length > 0 && (
        <section className="resume-section-block academic-section">
          <h2 className="academic-sec-title">
            <Award className="w-3.5 h-3.5 inline mr-1" />
            Honors, Awards & Certifications
          </h2>
          <div className="academic-list">
            {certifications.map((cert, idx) => (
              <div key={cert.id || idx} className="academic-cert-row resume-cert-item">
                <span className="font-bold text-xs">{cert.name}</span>
                <span className="text-slate-600 text-xs"> — {cert.organization}</span>
                {cert.issueDate && <span className="text-slate-400 text-xs ml-1">({cert.issueDate})</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Areas of Expertise / Skills */}
      {skills && skills.length > 0 && (
        <section className="resume-section-block academic-section">
          <h2 className="academic-sec-title">Areas of Expertise & Skills</h2>
          <div className="academic-skills-text">
            {skills.join(" • ")}
          </div>
        </section>
      )}

      {/* Languages & Affiliations */}
      {((languages && languages.length > 0) || (interests && interests.length > 0)) && (
        <div className="academic-footer">
          {languages && languages.length > 0 && (
            <div className="text-xs text-slate-700">
              <strong>Language Proficiencies: </strong>
              {languages.map((l) => `${l.language} (${l.proficiency})`).join("; ")}
            </div>
          )}
          {interests && interests.length > 0 && (
            <div className="text-xs text-slate-600 mt-1">
              <strong>Affiliations / Interests: </strong>
              {interests.join(", ")}
            </div>
          )}
        </div>
      )}

      {/* Passport, License & Travel Details */}
      <TravelDetailsSection travelDetails={travelDetails} variant="academic" />
    </div>
  );
}
