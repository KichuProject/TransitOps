import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useMockData } from '../../context/MockDataContext';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import Breadcrumb from './Breadcrumb';
import ToastContainer from '../ui/Toast';

export const MainLayout = () => {
  const { currentUser } = useMockData();

  // Redirect to login page if no active mock profile is loaded
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-light dark:bg-bg-dark font-sans">
      {/* Sidebar panel */}
      <Sidebar />

      {/* Content panel */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Top Navbar panel */}
        <TopNavbar />

        {/* Page panel */}
        <main className="flex-1 overflow-y-auto px-8 py-6 flex flex-col">
          {/* Breadcrumb path */}
          <Breadcrumb />

          {/* Routed page outlet */}
          <div className="flex-1 flex flex-col">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global toast notifications */}
      <ToastContainer />
    </div>
  );
};

export default MainLayout;
