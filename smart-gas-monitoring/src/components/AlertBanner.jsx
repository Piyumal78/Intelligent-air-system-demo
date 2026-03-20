import React from 'react';
import { useSystem } from '../context/SystemContext';
import { AlertTriangle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AlertBanner = () => {
    const { alerts } = useSystem();
    const { currentUser } = useAuth();

    // Filter alerts: Admins see all, Users see only their device's alerts
    const activeAlerts = alerts.filter(alert =>
        alert.status === 'Danger' &&
        (currentUser?.role === 'admin' || currentUser?.role === 'Admin' || alert.device === currentUser?.deviceId)
    );

    if (activeAlerts.length === 0) return null;

    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4 animate-in slide-in-from-top-4 duration-300">
            {activeAlerts.slice(0, 1).map((alert) => (
                <div key={alert.id} className="bg-red-600 text-white p-4 rounded-xl shadow-2xl flex items-center justify-between border-2 border-red-400">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-white/20 rounded-full animate-pulse">
                            <AlertTriangle size={28} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">CRITICAL WARNING: {alert.type} High</h3>
                            <p className="text-red-100 text-sm">{alert.message} • Level: {alert.level} PPM</p>
                        </div>
                    </div>
                    <div className="bg-white text-red-700 px-4 py-2 rounded-lg font-bold text-sm tracking-wide shadow-sm">
                        EVACUATE
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AlertBanner;
