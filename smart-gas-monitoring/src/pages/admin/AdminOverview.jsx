import React from 'react';
import { Users, Smartphone, Activity, Shield } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

const AdminOverview = () => {
    const { users, devices, alerts } = useSystem();

    const activeDevices = devices.filter(d => d.status?.toLowerCase() === 'online').length;
    const criticalAlerts = alerts.filter(a => a.status === 'Danger').length;

    const stats = [
        { title: 'Total Users', value: users.length, icon: Users, color: 'blue' },
        { title: 'Active Devices', value: activeDevices, total: devices.length, icon: Smartphone, color: 'emerald' },
        { title: 'System Health', value: 'Good', icon: Activity, color: 'indigo' },
        { title: 'Active Alerts', value: criticalAlerts, icon: Shield, color: criticalAlerts > 0 ? 'red' : 'amber' },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
                                <h3 className={`text-3xl font-bold mt-1 text-slate-800`}>
                                    {stat.value}
                                    {stat.total !== undefined && <span className="text-lg text-slate-400 font-normal">/{stat.total}</span>}
                                </h3>
                            </div>
                            <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity/Alerts Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Live System Alerts</h3>
                <div className="space-y-4">
                    {alerts.length === 0 ? (
                        <p className="text-slate-400 text-sm italic">No active alerts system-wide.</p>
                    ) : (
                        alerts.slice(0, 5).map((alert) => (
                            <div key={alert.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                    <div>
                                        <p className="text-sm font-semibold text-red-700">{alert.message}</p>
                                        <p className="text-xs text-red-500">Device: {alert.device} • Level: {alert.level}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-red-400 font-mono">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
