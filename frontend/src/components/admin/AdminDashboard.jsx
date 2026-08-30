import React, { useState } from 'react';
import AdminOverview from './AdminOverview';
import AdminUsersList from './AdminUsersList';
import AdminJobsList from './AdminJobsList';
import { LayoutDashboard, Users, Briefcase } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'users', label: 'Manage Users', icon: Users },
        { id: 'jobs', label: 'Manage Jobs', icon: Briefcase },
    ];

    return (
        <div className="pt-28 pb-12 px-4 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">
                    Admin Control Center
                </h1>
                <p className="text-slate-600 mt-2">
                    Platform metrics and management dashboard.
                </p>
            </div>

            <div className="flex space-x-2 mb-8 bg-slate-100 p-1.5 rounded-xl w-fit">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                isActive 
                                    ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' 
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                            }`}
                        >
                            <Icon size={18} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <div className="min-h-[500px]">
                {activeTab === 'overview' && <AdminOverview />}
                {activeTab === 'users' && <AdminUsersList />}
                {activeTab === 'jobs' && <AdminJobsList />}
            </div>
        </div>
    );
};

export default AdminDashboard;