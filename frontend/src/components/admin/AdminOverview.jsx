import React, { useState, useEffect } from "react";
import api from "../../customer/customerservice";
import { Users, Briefcase, FileText, Building, ShieldAlert, Activity } from "lucide-react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setDashboardActiveTab } from "../../Redux/Dashboard/DashboardAction";

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [issueStats, setIssueStats] = useState({ openCount: 0, criticalCount: 0 });
  const [healthStatus, setHealthStatus] = useState("healthy");
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [response, issueRes, healthRes] = await Promise.allSettled([
          api.getAdminStats(),
          api.getSystemIssueStats(),
          api.getLiveHealth(),
        ]);

        if (response.status === "fulfilled" && response.value?.success) {
          setStats(response.value.stats);
        }

        if (issueRes.status === "fulfilled" && issueRes.value?.success && issueRes.value?.stats) {
          setIssueStats(issueRes.value.stats);
        }

        if (healthRes.status === "fulfilled" && healthRes.value?.success && healthRes.value?.health) {
          setHealthStatus(healthRes.value.health.status);
        }
      } catch (error) {
        console.error("Error fetching admin stats:", error);
        toast.error("Failed to load platform statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);


  if (loading) {
    return (
      <div className="text-center py-12 text-slate-500 animate-pulse">
        Loading statistics...
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-red-500">
        Could not load statistics.
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
      tab: "users",
    },
    {
      title: "Total Jobs",
      value: stats.totalJobs,
      icon: Briefcase,
      color: "text-purple-600",
      bg: "bg-purple-100",
      tab: "jobs",
    },
    {
      title: "Applications",
      value: stats.totalApplications,
      icon: FileText,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      tab: "overview",
    },
    {
      title: "Companies",
      value: stats.totalCompanies,
      icon: Building,
      color: "text-amber-600",
      bg: "bg-amber-100",
      tab: "users",
    },
    {
      title: "Job Complaints & Reports",
      value: stats.totalReports || 0,
      subValue:
        stats.pendingReports > 0 ? `${stats.pendingReports} pending` : null,
      icon: ShieldAlert,
      color: "text-rose-600",
      bg: "bg-rose-100",
      tab: "reports",
    },
    {
      title: "System & Server Issues",
      value: issueStats.openCount || 0,
      subValue:
        issueStats.criticalCount > 0
          ? `${issueStats.criticalCount} critical`
          : healthStatus !== "healthy"
          ? healthStatus
          : "healthy",
      icon: Activity,
      color: issueStats.criticalCount > 0 ? "text-red-600" : "text-indigo-600",
      bg: issueStats.criticalCount > 0 ? "bg-red-100" : "bg-indigo-100",
      tab: "issues",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">

      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            onClick={() => stat.tab && dispatch(setDashboardActiveTab(stat.tab))}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4 hover:shadow-md hover:border-slate-200 transition-all cursor-pointer"
          >
            <div className={`p-3.5 rounded-xl ${stat.bg} ${stat.color} shrink-0`}>
              <Icon size={24} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500 truncate">
                {stat.title}
              </p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <h3 className="text-2xl font-bold text-slate-900">
                  {stat.value}
                </h3>
                {stat.subValue && (
                  <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100 truncate">
                    {stat.subValue}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminOverview;
