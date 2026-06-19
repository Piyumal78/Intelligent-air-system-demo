import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import Dashboard from '../Dashboard';
import { Monitor } from 'lucide-react';

const AdminMonitor = () => {
    const { devices } = useSystem();
    const [selectedDevice, setSelectedDevice] = useState("");

    if (devices.length === 0) {
        return (
            <div className="p-12 text-center bg-white rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-700 mb-2">No Devices Found</h3>
                <p className="text-slate-500">Register a new device to start monitoring.</p>
            </div>
        );
    }

    const activeDevice = selectedDevice || (devices.length > 0 ? devices[0].id : "");

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Device Selector */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shadow-inner">
                    <Monitor size={24} />
                </div>
                <div className="flex-1">
                    <h2 className="text-lg font-bold text-slate-800 mb-1">Live Monitor Access</h2>
                    <p className="text-sm text-slate-500">Select any connected device to view its real-time dashboard</p>
                </div>
                <div className="w-full md:w-auto">
                    <select
                        className="w-full md:w-64 border border-slate-200 p-3 text-sm font-bold text-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer bg-slate-50 hover:bg-white transition-colors shadow-sm"
                        value={activeDevice}
                        onChange={(e) => setSelectedDevice(e.target.value)}
                    >
                        {devices.map((device) => (
                            <option key={device.id} value={device.id}>
                                {device.id} {device.status?.toLowerCase() === 'online' ? '(🟢 Online)' : '(🔴 Offline)'}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Injected Dashboard */}
            <div className="bg-slate-50/50 p-2 md:p-8 rounded-3xl border-2 border-slate-200/60 shadow-inner relative min-h-[500px]">
                <div className="absolute top-4 right-6 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs rounded-full shadow-md z-10 hidden md:block">
                    {activeDevice} - Admin Override Active
                </div>
                {activeDevice ? (
                    <div className="scale-[0.98] origin-top">
                        <Dashboard forceDeviceId={activeDevice} />
                    </div>
                ) : (
                    <div className="h-64 flex items-center justify-center text-slate-400 font-medium">Loading monitor...</div>
                )}
            </div>
        </div>
    );
};

export default AdminMonitor;
