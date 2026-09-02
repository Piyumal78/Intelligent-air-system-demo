import React from 'react';

const AdminSettings = () => {
    return (
        <div className="max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">System Configuration</h2>

            <div className="space-y-8">
                <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Threshold Configuration</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Max Safe CO (PPM)</label>
                            <input type="number" className="w-full border rounded-lg p-2 bg-slate-50" defaultValue={50} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Max Safe LPG (PPM)</label>
                            <input type="number" className="w-full border rounded-lg p-2 bg-slate-50" defaultValue={100} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Max Safe H2 (PPM)</label>
                            <input type="number" className="w-full border rounded-lg p-2 bg-slate-50" defaultValue={25} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Max Safe NH3 (PPM)</label>
                            <input type="number" className="w-full border rounded-lg p-2 bg-slate-50" defaultValue={30} />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Notification Settings</h3>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3">
                            <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" defaultChecked />
                            <span className="text-slate-700 font-medium">Email Alerts to Admins</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" defaultChecked />
                            <span className="text-slate-700 font-medium">SMS Alerts to Users (Critical Only)</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                            <span className="text-slate-700 font-medium">Enable System Sound</span>
                        </label>
                    </div>
                </div>

                <div className="pt-4 flex gap-4">
                    <button className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-700 transition-colors">
                        Save Configuration
                    </button>
                    <button className="text-slate-500 font-medium hover:text-slate-700">
                        Reset Defaults
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
