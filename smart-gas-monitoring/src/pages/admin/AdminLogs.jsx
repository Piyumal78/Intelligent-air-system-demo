import React from 'react';
import { useSystem } from '../../context/SystemContext';
import { FileText, Clock, Info, AlertTriangle, CheckCircle } from 'lucide-react';

const AdminLogs = () => {
    const { logs } = useSystem();

    const getIcon = (type) => {
        switch (type) {
            case 'Error': return <AlertTriangle className="text-red-500" size={18} />;
            case 'Warning': return <AlertTriangle className="text-amber-500" size={18} />;
            case 'Success': return <CheckCircle className="text-green-500" size={18} />;
            default: return <Info className="text-blue-500" size={18} />;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[600px]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">System Audit Logs</h2>
                <div className="text-sm text-slate-500">
                    Showing last {logs.length} events
                </div>
            </div>

            <div className="space-y-0 divide-y divide-slate-100">
                {logs.length > 0 ? logs.map((log) => (
                    <div key={log.id} className="flex flex-col md:flex-row md:items-center gap-4 py-4 hover:bg-slate-50 px-4 -mx-4 transition-colors">
                        <div className="flex items-center gap-2 w-48 text-slate-500 font-mono text-xs">
                            <Clock size={14} />
                            {new Date(log.timestamp).toLocaleString()}
                        </div>

                        <div className="flex items-start gap-3 flex-1">
                            <div className="mt-0.5">{getIcon(log.type)}</div>
                            <div>
                                <p className="font-medium text-slate-800 text-sm">{log.action}</p>
                                <p className="text-slate-500 text-xs">{log.detail}</p>
                            </div>
                        </div>

                        <div className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-600 uppercase tracking-wider">
                            {log.type}
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-12 text-slate-400">No logs generated yet.</div>
                )}
            </div>
        </div>
    );
};

export default AdminLogs;
