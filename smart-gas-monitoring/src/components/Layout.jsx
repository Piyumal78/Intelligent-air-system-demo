import React from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { Outlet } from 'react-router-dom';
import AlertBanner from './AlertBanner';

const Layout = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />
            <TopNav />
            <AlertBanner />

            <main className="pl-64 pt-16 min-h-screen transition-all duration-300">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
