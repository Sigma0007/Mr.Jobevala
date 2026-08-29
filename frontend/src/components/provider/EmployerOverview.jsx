import { motion } from "framer-motion";
import { Briefcase, Users, UserCheck, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import customerservice from "../../customer/customerservice";

export default function EmployerOverview() {
  const [applicantsData, setApplicantsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState([
    {
      id: "activeJobs",
      title: "Active Job Postings",
      value: "0",
      change: "0",
      icon: Briefcase,
      color: "text-blue-600 bg-blue-50",
    },
    {
      id: "totalApplications",
      title: "Total Applications",
      value: "0",
      change: "0",
      icon: Users,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      id: "hiredCandidates",
      title: "Candidates Hired",
      value: "0",
      change: "0",
      icon: UserCheck,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      id: "profileViews",
      title: "Profile Views",
      value: "1,420",
      change: "18%",
      icon: TrendingUp,
      color: "text-brand-600 bg-brand-50",
    },
  ]);

  useEffect(() => {
    async function loadApplicants() {
      try {
        setLoading(true);
        const response = await customerservice.getProviderApplications();
        if (response.success) {
          setApplicantsData(response.data);
        } else {
          setError(response.message || "Failed to load applications");
        }
      } catch (err) {
        console.error(err);
        setError("Error loading applications");
      } finally {
        setLoading(false);
      }
    }

    async function loadStats() {
      try {
        const response = await customerservice.getProviderStats();
        if (response.success) {
          const fetchedStats = response.data;
          setStats((prevStats) =>
            prevStats.map((stat) => {
              const fetchedStat = fetchedStats.find((s) => s.id === stat.id);
              if (fetchedStat) {
                return {
                  ...stat,
                  value: fetchedStat.value,
                  change: fetchedStat.change,
                };
              }
              return stat;
            }),
          );
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadApplicants();
    loadStats();
  }, []);

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
                  +{stat.change} this week
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
          {loading ? (
            <div className="py-8 text-center text-sm text-slate-500">
              Loading applications...
            </div>
          ) : error ? (
            <div className="py-8 text-center text-sm text-red-500">{error}</div>
          ) : applicantsData.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              No applications found.
            </div>
          ) : (
            applicantsData.map((app, i) => (
              <div
                key={app._id || i}
                className="py-4 flex items-center justify-between first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      app.userProfile?.profileImage ||
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80"
                    }
                    alt={app.userProfile?.name || "Applicant"}
                    className="w-12 h-12 rounded-full object-cover border border-slate-100"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {app.userProfile?.name}
                    </h4>
                    <p className="text-xs text-slate-500">{app.job?.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium px-3 py-1 bg-brand-50 text-brand-600 rounded-full capitalize">
                    {app.status}
                  </span>
                  <span className="hidden sm:inline-block text-xs text-slate-400">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
