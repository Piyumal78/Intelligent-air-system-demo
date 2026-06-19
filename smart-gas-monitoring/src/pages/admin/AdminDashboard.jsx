import React, { useState } from 'react';
import {
    LayoutDashboard, Users, Smartphone, FileText, Settings,
    Activity, Server, Shield
} from 'lucide-react';
import AdminOverview from './AdminOverview';
import AdminUsers from './AdminUsers';
import AdminDevices from './AdminDevices';
import AdminLogs from './AdminLogs';
import AdminSettings from './AdminSettings';
import AdminMonitor from './AdminMonitor';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <AdminOverview />;
            case 'monitor': return <AdminMonitor />;
            case 'users': return <AdminUsers />;
            case 'devices': return <AdminDevices />;
            case 'logs': return <AdminLogs />;
            case 'settings': return <AdminSettings />;
            default: return <AdminOverview />;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Admin Portal</h1>
                    <p className="text-slate-500">System control and monitoring center</p>
                </div>

                {/* Navigation Tabs */}
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                    {[
                        { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                        { id: 'monitor', icon: Activity, label: 'Monitor' },
                        { id: 'users', icon: Users, label: 'Users' },
                        { id: 'devices', icon: Smartphone, label: 'Devices' },
                        { id: 'logs', icon: FileText, label: 'Logs' },
                        { id: 'settings', icon: Settings, label: 'Settings' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-slate-800 text-white shadow-md'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="min-h-[500px]">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;
