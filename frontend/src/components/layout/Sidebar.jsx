import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useMockData } from '../../context/MockDataContext';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid,
  FiTruck,
  FiUsers,
  FiMapPin,
  FiTool,
  FiDroplet,
  FiDollarSign,
  FiPieChart,
  FiUser,
  FiLogOut
} from 'react-icons/fi';
import ShinyText from '../reactbits/ShinyText';

export const Sidebar = ({ className = '' }) => {
  const { currentUser, addToast } = useMockData();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: FiGrid },
    { name: 'Vehicles', path: '/vehicles', icon: FiTruck },
    { name: 'Drivers', path: '/drivers', icon: FiUsers },
    { name: 'Trips', path: '/trips', icon: FiMapPin },
    { name: 'Maintenance', path: '/maintenance', icon: FiTool },
    { name: 'Fuel Logs', path: '/fuel', icon: FiDroplet },
    { name: 'Expenses', path: '/expenses', icon: FiDollarSign },
    { name: 'Reports', path: '/reports', icon: FiPieChart },
    { name: 'Profile', path: '/profile', icon: FiUser },
  ];

  const getFilteredNavItems = () => {
    const role = currentUser?.role;
    if (role === 'Fleet Manager') {
      return navItems.filter(item => 
        ['/', '/vehicles', '/drivers', '/maintenance', '/reports', '/profile'].includes(item.path)
      );
    }
    if (role === 'Dispatcher') {
      return navItems.filter(item => 
        ['/', '/vehicles', '/trips', '/profile'].includes(item.path)
      );
    }
    if (role === 'Safety Officer') {
      return navItems.filter(item => 
        ['/', '/drivers', '/trips', '/profile'].includes(item.path)
      );
    }
    if (role === 'Financial Analyst') {
      return navItems.filter(item => 
        ['/', '/vehicles', '/fuel', '/expenses', '/reports', '/profile'].includes(item.path)
      );
    }
    return navItems;
  };

  return (
    <aside className={`w-64 border-r border-slate-200/60 bg-white/70 dark:border-slate-800/80 dark:bg-slate-950/40 backdrop-blur-md flex flex-col h-screen shrink-0 ${className}`}>
      {/* Brand Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-slate-100 dark:border-slate-900">
        <div className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20 shrink-0">
          TO
        </div>
        <div className="flex flex-col min-w-0">
          <ShinyText text="TransitOps" speed={5} className="font-extrabold text-sm tracking-tight leading-none" />
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold tracking-wider uppercase mt-1">
            Operations Portal
          </span>
        </div>
      </div>
 
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-1.5">
        {getFilteredNavItems().map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/10'
                    : 'text-slate-550 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-900/60 dark:hover:text-slate-200'
                }`
              }
            >
              <Icon size={15} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer User Details */}
      {currentUser && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/15 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80'}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-750 shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-none">
                {currentUser.name}
              </span>
              <span className="text-[9px] text-blue-605 dark:text-blue-400 font-bold uppercase tracking-wider mt-1 truncate">
                {currentUser.role}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
          >
            <FiLogOut size={13} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
