import {
  User,
  FileText,
  Bookmark,
  LayoutDashboard,
  CreditCard,
  Sparkles,
} from "lucide-react";

// Candidate Components
import UserOverview from "./UserOverview";
import UserApplied from "./UserApplied";
import UserSaved from "./UserSaved";
import UserProfile from "./UserProfile";
import PaymentHistory from "../../pages/PaymentHistory";
import { useState } from "react";

export function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const menuItems = [
    { id: "overview", name: "Dashboard", icon: LayoutDashboard },
    { id: "applied", name: "Applied Jobs", icon: FileText },
    { id: "saved", name: "Saved Jobs", icon: Bookmark },
    { id: "profile", name: "My Profile", icon: User },
    { id: "payments", name: "Payments & Invoices", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Candidate Sidebar */}
          <div className="w-full md:w-64">
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] sticky top-28 space-y-1">
              <div className="px-4 py-3 mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Candidate Menu
                </span>
              </div>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-brand-600 text-white shadow-[0_4px_14px_0_rgb(37,99,235,0.39)]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? "text-white" : "text-slate-400"
                      }`}
                    />
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Main Content Area */}
          <div className="flex-1">
            {activeTab === "overview" && (
              <UserOverview setActiveTab={setActiveTab} />
            )}
            {activeTab === "applied" && <UserApplied />}
            {activeTab === "saved" && <UserSaved />}
            {activeTab === "profile" && <UserProfile />}
            {activeTab === "payments" && <PaymentHistory />}
          </div>
        </div>
      </div>
    </div>
  );
}
