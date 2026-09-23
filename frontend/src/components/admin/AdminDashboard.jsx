import React, { useState } from "react";
import AdminOverview from "./AdminOverview";
import AdminUsersList from "./AdminUsersList";
import AdminJobsList from "./AdminJobsList";
import AdminCategoriesList from "./AdminCategoriesList";
import AdminLocationsList from "./AdminLocationsList";
import AdminPlansList from "./AdminPlansList";
import AdminSubscriptionsList from "./AdminSubscriptionsList";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Layers,
  MapPin,
  CreditCard,
  Crown,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setDashboardActiveTab } from "../../Redux/Dashboard/DashboardAction";

const AdminDashboard = () => {
  const { dashboardActiveTab } = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "subscriptions", label: "Subscriptions & Billing", icon: Crown },
    { id: "plans", label: "Manage Plans", icon: CreditCard },
    { id: "users", label: "Manage Users", icon: Users },
    { id: "jobs", label: "Manage Jobs", icon: Briefcase },
    { id: "categories", label: "Manage Categories", icon: Layers },
    { id: "locations", label: "Manage Locations", icon: MapPin },
  ];

  return (
    <div className="pt-28 pb-12 px-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Admin Control Center
        </h1>
        <p className="text-slate-600 mt-2">
          Platform metrics, subscriptions & transactions, pricing plans,
          categories, jobs, users, and location hierarchy.
        </p>
      </div>

      <div className="flex space-x-2 mb-8 bg-slate-100 p-1.5 rounded-xl w-fit overflow-x-auto">
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
            </button>
          );
        })}
      </div>

      <div className="min-h-[500px]">
        {dashboardActiveTab === "overview" && <AdminOverview />}
        {dashboardActiveTab === "subscriptions" && <AdminSubscriptionsList />}
        {dashboardActiveTab === "plans" && <AdminPlansList />}
        {dashboardActiveTab === "users" && <AdminUsersList />}
        {dashboardActiveTab === "jobs" && <AdminJobsList />}
        {dashboardActiveTab === "categories" && <AdminCategoriesList />}
        {dashboardActiveTab === "locations" && <AdminLocationsList />}
      </div>
    </div>
  );
};

export default AdminDashboard;
