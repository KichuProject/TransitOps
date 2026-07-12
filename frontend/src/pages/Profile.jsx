import React from 'react';
import { useMockData } from '../context/MockDataContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export const Profile = () => {
  const { currentUser, addToast } = useMockData();

  const handleSave = () => {
    addToast('Profile regional preferences updated.', 'success');
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Operator Profile</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Manage account information, active view, and regional preferences</p>
      </div>

      <Card className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-slate-100 dark:border-slate-800/80 pb-6">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt={currentUser?.name}
            className="w-16 h-16 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
          />
          <div className="flex flex-col text-center sm:text-left gap-1">
            <h3 className="text-base font-bold text-slate-850 dark:text-white">{currentUser?.name}</h3>
            <span className="text-xs text-slate-550 dark:text-slate-400">{currentUser?.email}</span>
            <div className="mt-2 flex items-center justify-center sm:justify-start gap-1.5">
              <Badge variant="primary">{currentUser?.role}</Badge>
              <Badge variant="secondary">Active operator</Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">Regional Parameters</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Operating Language</span>
              <select className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none">
                <option>English (United States)</option>
                <option>Spanish (ES)</option>
                <option>German (DE)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Primary Hub Region</span>
              <select className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none">
                <option>North Hub (Main terminal)</option>
                <option>South Hub</option>
                <option>East Hub</option>
                <option>West Hub</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" size="sm">
            Reset Preferences
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave}>
            Save Configuration
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
