import React from 'react';

const AdminDashboard = () => {
    return (
        <div className="pt-28 pb-12 px-4 max-w-7xl mx-auto">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h1 className="text-3xl font-bold text-slate-900">
                    Admin Control Center
                </h1>
                <p className="text-slate-600 mt-2">
                    Platform metrics and user management.
                </p>
            </div>
        </div>
    );
}

export default AdminDashboard;