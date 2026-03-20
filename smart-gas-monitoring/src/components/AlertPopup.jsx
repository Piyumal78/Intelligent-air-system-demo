import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const AlertPopup = ({ alert, onClose }) => {
    if (!alert) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100 animate-in zoom-in-95 duration-200 border-l-8 border-red-500">
                <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className="bg-red-100 p-3 rounded-full text-red-600">
                            <AlertTriangle size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">DANGER ALERT!</h3>
                            <p className="text-slate-500 text-sm mt-1">Gas levels have exceeded safe limits.</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="mt-6 bg-red-50 rounded-xl p-4 border border-red-100">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-600 font-medium">Gas Type:</span>
                        <span className="text-lg font-bold text-slate-800">{alert.gasType}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium">Current Level:</span>
                        <span className="text-2xl font-black text-red-600">{alert.value} <span className="text-sm font-semibold text-red-400">PPM</span></span>
                    </div>
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-500/30"
                    >
                        ACKNOWLEDGE
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                    >
                        MUTE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertPopup;
