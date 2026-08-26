import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Search,
  Filter,
  MoreVertical,
  X,
  Download,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Bookmark, // <-- Added Bookmark here
} from "lucide-react";

// Dummy Data - Replace with real API data
const initialApplicants = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Senior Frontend Engineer",
    appliedDate: "Oct 24, 2023",
    status: "Reviewing",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    email: "sarah.j@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    experience: "6 Years",
    education: "B.S. Computer Science, UC Berkeley",
    skills: ["React", "TypeScript", "Next.js", "Framer Motion", "Tailwind CSS"],
    about:
      "Passionate UI engineer with a track record of building high-performance, accessible web applications. Led frontend architecture at my previous startup, improving rendering performance by 40%.",
    portfolio: "sarahjenkins.dev",
  },
  {
    id: 2,
    name: "Michael Chang",
    role: "Product Manager",
    appliedDate: "Oct 23, 2023",
    status: "Shortlisted",
    avatar: "https://i.pravatar.cc/150?u=michael",
    email: "m.chang@example.com",
    phone: "+1 (555) 987-6543",
    location: "New York, NY",
    experience: "8 Years",
    education: "MBA, Stern School of Business",
    skills: ["Agile", "Jira", "User Research", "Data Analytics", "Roadmapping"],
    about:
      "Data-driven Product Manager with experience scaling SaaS products from $1M to $10M ARR. Adept at cross-functional leadership and translating user needs into technical specs.",
    portfolio: "linkedin.com/in/mchang",
  },
  {
    id: 3,
    name: "Elena Rostova",
    role: "UI/UX Designer",
    appliedDate: "Oct 21, 2023",
    status: "Interviewing",
    avatar: "https://i.pravatar.cc/150?u=elena",
    email: "elena.design@example.com",
    phone: "+44 7700 900077",
    location: "London, UK (Remote)",
    experience: "4 Years",
    education: "B.A. Graphic Design, Central Saint Martins",
    skills: ["Figma", "Prototyping", "Wireframing", "User Testing", "CSS"],
    about:
      "Detail-oriented designer obsessed with creating intuitive, pixel-perfect user experiences. Strong background in design systems and accessibility standards.",
    portfolio: "dribbble.com/elenar",
  },
];

const statusConfig = {
  Reviewing: { color: "bg-blue-50 text-blue-600 border-blue-100", icon: Clock },
  Shortlisted: {
    color: "bg-purple-50 text-purple-600 border-purple-100",
    icon: Bookmark,
  },
  Interviewing: {
    color: "bg-amber-50 text-amber-600 border-amber-100",
    icon: Calendar,
  },
  Hired: {
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    icon: CheckCircle2,
  },
  Rejected: { color: "bg-red-50 text-red-600 border-red-100", icon: XCircle },
};

export default function EmployerApplicants() {
  const [applicants, setApplicants] = useState(initialApplicants);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const filteredApplicants = applicants.filter(
    (app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleStatusChange = (id, newStatus) => {
    setApplicants((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app)),
    );
    if (selectedApplicant && selectedApplicant.id === id) {
      setSelectedApplicant({ ...selectedApplicant, status: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Applicants Management
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Review, manage, and track candidate progress.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all w-full md:w-64"
              />
            </div>
            <button className="p-2.5 text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Applicant List Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredApplicants.map((applicant) => {
          const StatusIcon = statusConfig[applicant.status].icon;
          return (
            <motion.div
              key={applicant.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedApplicant(applicant)}
              className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-brand-100 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={applicant.avatar}
                  alt={applicant.name}
                  className="w-14 h-14 rounded-full object-cover border border-slate-100"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {applicant.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                    <span className="font-medium text-slate-700">
                      {applicant.role}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>Applied {applicant.appliedDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 md:ml-auto">
                <span
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                    statusConfig[applicant.status].color
                  }`}
                >
                  <StatusIcon className="w-3.5 h-3.5" />
                  {applicant.status}
                </span>
                <button className="text-brand-600 font-medium text-sm hover:text-brand-700 px-4 py-2 bg-brand-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                  View Profile
                </button>
              </div>
            </motion.div>
          );
        })}
        {filteredApplicants.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
            <p className="text-slate-500">
              No applicants found matching your search.
            </p>
          </div>
        )}
      </div>

      {/* Advanced Profile Modal */}
      <AnimatePresence>
        {selectedApplicant && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApplicant(null)}
              className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-3xl shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex-shrink-0 border-b border-slate-100 bg-white px-8 py-6 flex items-start justify-between sticky top-0 z-10">
                <div className="flex items-center gap-5">
                  <img
                    src={selectedApplicant.avatar}
                    alt={selectedApplicant.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-slate-50 shadow-sm"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {selectedApplicant.name}
                    </h2>
                    <p className="text-brand-600 font-medium mt-1">
                      {selectedApplicant.role}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />{" "}
                        {selectedApplicant.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> Applied{" "}
                        {selectedApplicant.appliedDate}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column (Details) */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* About Section */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                      <h3 className="text-base font-bold text-slate-900 mb-3">
                        Professional Summary
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-sm">
                        {selectedApplicant.about}
                      </p>
                    </div>

                    {/* Experience & Education */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
                          <Briefcase className="w-5 h-5 text-brand-600" />
                          Experience Level
                        </h3>
                        <p className="text-slate-700 font-medium text-sm pl-7">
                          {selectedApplicant.experience} total experience
                        </p>
                      </div>
                      <div className="w-full h-px bg-slate-100"></div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
                          <GraduationCap className="w-5 h-5 text-brand-600" />
                          Education Background
                        </h3>
                        <p className="text-slate-700 font-medium text-sm pl-7">
                          {selectedApplicant.education}
                        </p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                      <h3 className="text-base font-bold text-slate-900 mb-4">
                        Top Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedApplicant.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg text-sm font-medium border border-slate-100"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column (Actions & Contact) */}
                  <div className="space-y-6">
                    {/* Action Card */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                        Update Status
                      </h3>
                      <div className="space-y-2">
                        {Object.keys(statusConfig).map((status) => (
                          <button
                            key={status}
                            onClick={() =>
                              handleStatusChange(selectedApplicant.id, status)
                            }
                            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                              selectedApplicant.status === status
                                ? "bg-slate-900 text-white shadow-md"
                                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            {status}
                            {selectedApplicant.status === status && (
                              <CheckCircle2 className="w-4 h-4" />
                            )}
                          </button>
                        ))}
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100">
                        <button className="w-full flex items-center justify-center gap-2 bg-brand-50 text-brand-600 hover:bg-brand-100 hover:text-brand-700 px-4 py-3 rounded-xl text-sm font-bold transition-colors">
                          <Download className="w-4 h-4" />
                          Download Resume
                        </button>
                      </div>
                    </div>

                    {/* Contact Info Card */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                        Contact Info
                      </h3>
                      <a
                        href={`mailto:${selectedApplicant.email}`}
                        className="flex items-center gap-3 text-sm text-slate-600 hover:text-brand-600 transition-colors group"
                      >
                        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-brand-50 transition-colors">
                          <Mail className="w-4 h-4" />
                        </div>
                        {selectedApplicant.email}
                      </a>
                      <a
                        href={`tel:${selectedApplicant.phone}`}
                        className="flex items-center gap-3 text-sm text-slate-600 hover:text-brand-600 transition-colors group"
                      >
                        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-brand-50 transition-colors">
                          <Phone className="w-4 h-4" />
                        </div>
                        {selectedApplicant.phone}
                      </a>
                      <a
                        href={`https://${selectedApplicant.portfolio}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 text-sm text-brand-600 font-medium hover:text-brand-700 transition-colors group"
                      >
                        <div className="p-2 bg-brand-50 rounded-lg group-hover:bg-brand-100 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </div>
                        {selectedApplicant.portfolio}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
