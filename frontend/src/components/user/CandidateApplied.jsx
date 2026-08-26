import { motion } from "framer-motion";
import {
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Users,
} from "lucide-react";

export default function CandidateApplied() {
  const applications = [
    {
      id: 1,
      role: "Senior React Developer",
      company: "TechFlow",
      date: "Aug 4, 2026",
      status: "Interviewing",
      logo: "https://images.unsplash.com/photo-1549924293-3b909efef92d?w=150&q=80",
    },
    {
      id: 2,
      role: "Frontend Architect",
      company: "Nexus API",
      date: "Aug 1, 2026",
      status: "Approved",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&q=80",
    },
    {
      id: 3,
      role: "UI/UX Developer",
      company: "Studio Creative",
      date: "Jul 28, 2026",
      status: "Pending",
      logo: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=150&q=80",
    },
    {
      id: 4,
      role: "Fullstack Engineer",
      company: "GlobalData",
      date: "Jul 20, 2026",
      status: "Rejected",
      logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&q=80",
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Interviewing":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
            <Users className="w-3.5 h-3.5" /> Interviewing
          </span>
        );
      case "Approved":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full">
            <CheckCircle className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case "Pending":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 text-xs font-semibold rounded-full">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
      case "Rejected":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
    >
      <div className="mb-8">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Application History
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Track the status of your active and past job applications.
        </p>
      </div>

      <div className="space-y-4">
        {applications.map((app) => (
          <div
            key={app.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-slate-100 rounded-2xl hover:border-brand-100 transition-colors bg-white"
          >
            <div className="flex items-center gap-4">
              <img
                src={app.logo}
                alt={app.company}
                className="w-12 h-12 rounded-xl object-cover border border-slate-100"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {app.role}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" /> {app.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Applied: {app.date}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center justify-end">
              {getStatusBadge(app.status)}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
