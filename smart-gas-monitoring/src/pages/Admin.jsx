import React, { useState } from 'react';
import {
    UserPlus, Search, Trash2, Edit, X, Save,
    LayoutDashboard, Users, Smartphone, FileText, Settings,
    Activity, Server, Shield
} from 'lucide-react';

const AdminOverview = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Total Users</p>
                        <h3 className="text-3xl font-bold text-slate-800 mt-1">12</h3>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Users size={24} />
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Active Devices</p>
                        <h3 className="text-3xl font-bold text-slate-800 mt-1">8</h3>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <Smartphone size={24} />
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">System Status</p>
                        <h3 className="text-3xl font-bold text-emerald-500 mt-1">Healthy</h3>
                    </div>
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Activity size={24} />
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Alerts Today</p>
                        <h3 className="text-3xl font-bold text-amber-500 mt-1">3</h3>
                    </div>
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                        <Shield size={24} />
                    </div>
                </div>
            </div>
        </div>

        {/* Recent Activity Mini-Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Recent System Activity</h3>
            <div className="space-y-4">
                {[
                    { action: 'User Login', detail: 'JohnDoe logged in from DEVICE001', time: '2 mins ago' },
                    { action: 'Alert Triggered', detail: 'High CO levels detected on Lab 2', time: '15 mins ago' },
                    { action: 'Device Registered', detail: 'New device DEVICE005 added', time: '1 hour ago' },
                ].map((log, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <div>
                                <p className="text-sm font-semibold text-slate-700">{log.action}</p>
                                <p className="text-xs text-slate-500">{log.detail}</p>
                            </div>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">{log.time}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const AdminUsers = () => {
    const [users, setUsers] = useState([
        { id: 1, username: 'JohnDoe', deviceId: 'DEVICE001', role: 'User', status: 'Active' },
        { id: 2, username: 'JaneSmith', deviceId: 'DEVICE002', role: 'User', status: 'Active' },
        { id: 3, username: 'TechAdmin', deviceId: '-', role: 'Admin', status: 'Active' },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', password: '', deviceId: '', role: 'User' });

    const handleAddUser = (e) => {
        e.preventDefault();
        const user = { id: users.length + 1, ...newUser, status: 'Active' };
        setUsers([...users, user]);
        setIsModalOpen(false);
        setNewUser({ username: '', password: '', deviceId: '', role: 'User' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">User List</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-colors text-sm"
                >
                    <UserPlus size={18} />
                    Add User
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Username</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Device ID</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">{user.username}</td>
                                <td className="px-6 py-4"><span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">{user.role}</span></td>
                                <td className="px-6 py-4 font-mono">{user.deviceId}</td>
                                <td className="px-6 py-4 text-emerald-600 font-medium">{user.status}</td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button className="text-slate-400 hover:text-blue-600"><Edit size={16} /></button>
                                    <button className="text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold">Add New User</h2>
                            <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <input className="w-full px-4 py-2 bg-slate-50 border rounded-lg" placeholder="Username" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} required />
                            <input className="w-full px-4 py-2 bg-slate-50 border rounded-lg" type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required />
                            <input className="w-full px-4 py-2 bg-slate-50 border rounded-lg" placeholder="Device ID" value={newUser.deviceId} onChange={e => setNewUser({ ...newUser, deviceId: e.target.value })} required />
                            <select className="w-full px-4 py-2 bg-slate-50 border rounded-lg" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                            </select>
                            <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Save User</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const AdminDevices = () => {
    const devices = [
        { id: 'DEVICE001', assignedTo: 'JohnDoe', location: 'Kitchen', status: 'Online' },
        { id: 'DEVICE002', assignedTo: 'JaneSmith', location: 'Garage', status: 'Offline' },
        { id: 'DEVICE003', assignedTo: 'Unassigned', location: '-', status: 'New' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Device Management</h2>
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-emerald-700">
                    <Smartphone size={18} /> Add Device
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {devices.map(device => (
                    <div key={device.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-slate-100 rounded-lg">
                                <Server size={24} className="text-slate-600" />
                            </div>
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${device.status === 'Online' ? 'bg-green-100 text-green-700' :
                                    device.status === 'Offline' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                }`}>{device.status}</span>
                        </div>
                        <h3 className="font-bold text-lg text-slate-800">{device.id}</h3>
                        <p className="text-slate-500 text-sm mb-4">Assigned to: <span className="font-medium text-slate-700">{device.assignedTo}</span></p>

                        <div className="flex gap-2 text-sm pt-4 border-t border-slate-100">
                            <button className="flex-1 text-blue-600 font-medium hover:bg-blue-50 py-1.5 rounded text-center">Configure</button>
                            <button className="flex-1 text-red-600 font-medium hover:bg-red-50 py-1.5 rounded text-center">Block</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AdminLogs = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6">System Logs</h2>
        <div className="space-y-0">
            {[1, 2, 3, 4, 5].map((_, i) => (
                <div key={i} className="flex gap-4 py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 px-2 rounded-lg transition-colors">
                    <div className="text-slate-400 font-mono text-sm w-32">2023-10-2{i} 14:30</div>
                    <div className="flex-1">
                        <p className="text-slate-800 font-medium">System Update Check</p>
                        <p className="text-slate-500 text-sm">Routine verification completed successfully.</p>
                    </div>
                    <div className="text-slate-400 text-sm">Info</div>
                </div>
            ))}
        </div>
    </div>
);

const AdminSettings = () => (
    <div className="max-w-2xl">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Admin Settings</h2>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Profile Information</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Admin Name</label>
                        <input type="text" className="w-full px-4 py-2 border rounded-lg bg-slate-50" defaultValue="Tharindu" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input type="email" className="w-full px-4 py-2 border rounded-lg bg-slate-50" defaultValue="admin@smartgas.com" />
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Security</h3>
                <button className="text-blue-600 font-medium hover:underline">Change Password</button>
            </div>

            <div className="pt-6 border-t border-slate-100">
                <button className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition-colors">
                    Save Changes
                </button>
            </div>
        </div>
    </div>
);

const Admin = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <AdminOverview />;
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
                    <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
                    <p className="text-slate-500">Control panel and system management</p>
                </div>

                {/* Navigation Tabs */}
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                    {[
                        { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
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

export default Admin;
