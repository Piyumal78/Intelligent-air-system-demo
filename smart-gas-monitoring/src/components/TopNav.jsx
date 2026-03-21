import React from 'react';
import { Bell, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSystem } from '../context/SystemContext';
import { Link } from 'react-router-dom';

const TopNav = () => {
    const { currentUser } = useAuth();
    const { alerts } = useSystem();

    const activeAlerts = (alerts || []).filter(alert =>
        alert.status === 'Danger' &&
        (currentUser?.role === 'admin' || currentUser?.role === 'Admin' || alert.device === currentUser?.deviceId)
    );

    return (
        <div className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-40">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-slate-800">Dashboard</h2>
            </div>

            <div className="flex items-center gap-6">
                <Link to="/alerts" className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer hover:bg-slate-50 rounded-full">
                    <Bell size={22} />
                    {activeAlerts.length > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white flex items-center justify-center text-[10px] font-bold rounded-full border border-white shadow-sm animate-pulse">
                            {activeAlerts.length}
                        </span>
                    )}
                </Link>

                <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-slate-700">{currentUser?.username || 'User'}</p>
                        <p className="text-xs text-slate-500">{currentUser?.role || 'Guest'}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User size={20} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopNav;
