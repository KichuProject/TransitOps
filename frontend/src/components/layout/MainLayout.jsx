import React from 'react';
import { Outlet, Navigate, useLocation, Link } from 'react-router-dom';
import { useMockData } from '../../context/MockDataContext';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import Breadcrumb from './Breadcrumb';
import { FiAlertTriangle } from 'react-icons/fi';
import BlurText from '../reactbits/BlurText';
import Button from '../ui/Button';
import DarkVeil from '../reactbits/DarkVeil';
import Iridescence from '../reactbits/Iridescence';
import { motion } from 'framer-motion';

export const MainLayout = () => {
  const { currentUser, darkMode } = useMockData();
  const location = useLocation();
  const path = location.pathname;

  // Redirect to login page if no active mock profile is loaded
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Authorization check
  const isAllowed = (role, pathname) => {
    if (!role) return true;
    if (role === 'Fleet Manager') {
      return ['/', '/vehicles', '/drivers', '/maintenance', '/reports', '/profile'].includes(pathname);
    }
    if (role === 'Dispatcher') {
      return ['/', '/vehicles', '/trips', '/profile'].includes(pathname);
    }
    if (role === 'Safety Officer') {
      return ['/', '/drivers', '/trips', '/profile'].includes(pathname);
    }
    if (role === 'Financial Analyst') {
      return ['/', '/vehicles', '/fuel', '/expenses', '/reports', '/profile'].includes(pathname);
    }
    return true;
  };

  const roleAllowed = isAllowed(currentUser?.role, path);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-light dark:bg-bg-dark font-sans relative z-0">
      {/* Background canvas WebGL shader backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-15 dark:opacity-35">
        {darkMode ? (
          <DarkVeil speed={0.25} warpAmount={0.03} resolutionScale={0.7} />
        ) : (
          <Iridescence color={[0.9, 0.93, 0.98]} speed={0.3} amplitude={0.05} mouseReact={true} />
        )}
      </div>

      {/* Sidebar panel */}
      <Sidebar className="relative z-10" />

      {/* Content panel */}
      <div className="flex flex-col flex-1 h-full overflow-hidden relative z-10">
        {/* Top Navbar panel */}
        <TopNavbar />

        {/* Page panel */}
        <main className="flex-1 overflow-y-auto px-8 py-6 flex flex-col">
          {/* Breadcrumb path */}
          <Breadcrumb />

          {/* Routed page outlet or Access Denied screen */}
          <div className="flex-1 flex flex-col">
            {roleAllowed ? (
              <motion.div
                key={path}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex-1 flex flex-col"
              >
                <Outlet />
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-12">
                <div className="max-w-md w-full p-8 border border-red-500/20 dark:border-red-500/10 bg-white dark:bg-slate-900/40 shadow-xl rounded-2xl flex flex-col items-center text-center gap-4 backdrop-blur-xl animate-fade-in">
                  <div className="h-14 w-14 bg-red-50 dark:bg-red-955/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center shrink-0">
                    <FiAlertTriangle size={28} />
                  </div>
                  <BlurText text="Access Restricted" className="text-base font-black text-slate-800 dark:text-white" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Your role <strong className="text-blue-500 font-bold">{currentUser?.role}</strong> does not possess the credentials to access this dashboard section.
                  </p>
                  <Link to="/">
                    <Button variant="primary" size="sm" className="mt-2 font-bold shadow-md shadow-blue-500/10">
                      Return to Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

