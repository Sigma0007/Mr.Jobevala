import { motion } from "framer-motion";
import { Briefcase, Users, UserCheck, TrendingUp } from "lucide-react";

export default function EmployerOverview() {
  const stats = [
    {
      title: "Active Job Postings",
      value: "4",
      change: "+1 this week",
      icon: Briefcase,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Total Applications",
      value: "128",
      change: "+24 today",
      icon: Users,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      title: "Candidates Hired",
      value: "12",
      change: "+3 this month",
      icon: UserCheck,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Profile Views",
      value: "1,420",
      change: "+18%",
      icon: TrendingUp,
      color: "text-brand-600 bg-brand-50",
    },
  ];

  const recentApplicants = [
    {
      name: "Sarah Jenkins",
      role: "Senior Frontend Engineer",
      date: "2 hours ago",
      status: "Reviewing",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
    },
    {
      name: "Michael Chang",
      role: "Product Manager",
      date: "5 hours ago",
      status: "Shortlisted",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    },
    {
      name: "Elena Rostova",
      role: "UI/UX Designer",
      date: "1 day ago",
      status: "Interviewing",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor your recruitment pipeline and recent candidate activity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                {stat.value}
              </h3>
              <p className="text-sm text-slate-500 mt-1">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">
            Recent Applications
          </h2>
          <span className="text-sm font-medium text-brand-600 cursor-pointer hover:text-brand-700 transition-colors">
            View all
          </span>
        </div>
        <div className="divide-y divide-slate-100">
          {recentApplicants.map((app, i) => (
            <div
              key={i}
              className="py-4 flex items-center justify-between first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-4">
                <img
                  src={app.image}
                  alt={app.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-100"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {app.name}
                  </h4>
                  <p className="text-xs text-slate-500">{app.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-medium px-3 py-1 bg-brand-50 text-brand-600 rounded-full">
                  {app.status}
                </span>
                <span className="hidden sm:inline-block text-xs text-slate-400">
                  {app.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
