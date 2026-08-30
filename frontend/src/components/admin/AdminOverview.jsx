import React, { useState, useEffect } from "react";
import api from "../../customer/customerservice";
import { Users, Briefcase, FileText, Building } from "lucide-react";
import { toast } from "react-hot-toast";

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.getAdminStats();
        const data = response;

        if (data.success) {
          setStats(data.stats);
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
    },
    {
      title: "Total Jobs",
      value: stats.totalJobs,
      icon: Briefcase,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Applications",
      value: stats.totalApplications,
      icon: FileText,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      title: "Companies",
      value: stats.totalCompanies,
      icon: Building,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4"
          >
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <Icon size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {stat.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminOverview;
