import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Mail, Calendar, Sun, Moon, ShieldCheck, Zap } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-6 h-6 text-sky-600 dark:text-sky-400" />
          User Profile & Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your account preferences and view system settings
        </p>
      </div>

      {/* Account Info Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-700">
          <div className="w-16 h-16 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {user?.name || 'User'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <Mail className="w-3.5 h-3.5" /> {user?.email || 'N/A'}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-slate-700/60">
            <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-500" /> Member Since
            </span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-slate-700/60">
            <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Account Status
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
              Active / JWT Authenticated
            </span>
          </div>

          <div className="flex items-center justify-between text-xs py-2">
            <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
              Appearance Theme
            </span>
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Toggle to {darkMode ? 'Light' : 'Dark'} Mode
            </button>
          </div>
        </div>
      </div>

      {/* App Info Footer Card */}
      <div className="p-5 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-600 text-white">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              TaskFlow AI v1.0.0
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Future of Work & Automation Hackathon Project
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
