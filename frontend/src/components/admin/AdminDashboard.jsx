import React, { useState } from "react";
import AdminOverview from "./AdminOverview";
import AdminUsersList from "./AdminUsersList";
import AdminJobsList from "./AdminJobsList";
import AdminCategoriesList from "./AdminCategoriesList";
import AdminLocationsList from "./AdminLocationsList";
import AdminPlansList from "./AdminPlansList";
import AdminSubscriptionsList from "./AdminSubscriptionsList";
import AdminReportsList from "./AdminReportsList";
import AdminMarqueeList from "./AdminMarqueeList";
import AdminSystemIssuesList from "./AdminSystemIssuesList";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Layers,
  MapPin,
  CreditCard,
  Crown,
  ShieldAlert,
  Building2,
  Activity,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setDashboardActiveTab } from "../../Redux/Dashboard/DashboardAction";
import customerservice from "../../customer/customerservice";
import { useSocket } from "../../context/SocketContext";
import { useEffect } from "react";

const AdminDashboard = () => {
  const { dashboardActiveTab } = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const [criticalIssuesCount, setCriticalIssuesCount] = useState(0);

  useEffect(() => {
    const fetchIssueStats = async () => {
      try {
        const res = await customerservice.getSystemIssueStats();
        if (res && res.success && res.stats) {
          setCriticalIssuesCount(res.stats.criticalCount + res.stats.openCount);
        }
      } catch (_) {}
    };

    fetchIssueStats();

    if (socket) {
      const handleAlert = () => fetchIssueStats();
      socket.on("system_issue_alert", handleAlert);
      return () => socket.off("system_issue_alert", handleAlert);
    }
  }, [socket]);

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    {
      id: "issues",
      label: "Server & Issues Monitor",
      icon: Activity,
      badge: criticalIssuesCount,
    },
    { id: "reports", label: "Job Reports & Fraud", icon: ShieldAlert },
    { id: "subscriptions", label: "Subscriptions & Billing", icon: Crown },
    { id: "plans", label: "Manage Plans", icon: CreditCard },
    { id: "users", label: "Manage Users", icon: Users },
    { id: "jobs", label: "Manage Jobs", icon: Briefcase },
    { id: "categories", label: "Manage Categories", icon: Layers },
    { id: "locations", label: "Manage Locations", icon: MapPin },
    { id: "marquee", label: "Partner Logos", icon: Building2 },
  ];

  return (
    <div className="pt-28 pb-12 px-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Admin Control Center
        </h1>
        <p className="text-slate-600 mt-2">
          Platform metrics, spam/fraud complaints & job reports, subscriptions,
          pricing plans, categories, partner logos, jobs, users, and locations.
        </p>
      </div>

      <div className="flex space-x-2 mb-8 bg-slate-100 p-1.5 rounded-xl  overflow-x-auto w-full ">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = dashboardActiveTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => dispatch(setDashboardActiveTab(tab.id))}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-white text-blue-600 shadow-sm border border-slate-200/50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <Icon size={18} />
              {tab.label}
              {tab.badge > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="min-h-[500px]">
        {dashboardActiveTab === "overview" && <AdminOverview />}
        {dashboardActiveTab === "issues" && <AdminSystemIssuesList />}
        {dashboardActiveTab === "reports" && <AdminReportsList />}
        {dashboardActiveTab === "subscriptions" && <AdminSubscriptionsList />}
        {dashboardActiveTab === "plans" && <AdminPlansList />}
        {dashboardActiveTab === "users" && <AdminUsersList />}
        {dashboardActiveTab === "jobs" && <AdminJobsList />}
        {dashboardActiveTab === "categories" && <AdminCategoriesList />}
        {dashboardActiveTab === "locations" && <AdminLocationsList />}
        {dashboardActiveTab === "marquee" && <AdminMarqueeList />}
      </div>
    </div>
  );
};

export default AdminDashboard;
