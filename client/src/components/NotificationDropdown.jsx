import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Clock, CalendarCheck, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown = ({ tasks = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const generated = [];
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    tasks.forEach((t) => {
      if (t.status === 'Completed') return;

      const deadlineDate = new Date(t.deadline);

      // Overdue
      if (deadlineDate < startOfToday) {
        generated.push({
          id: `overdue-${t._id}`,
          type: 'overdue',
          title: 'Task Overdue',
          message: `"${t.title}" was due on ${deadlineDate.toLocaleDateString()}`,
          icon: AlertTriangle,
          color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900',
          taskId: t._id,
        });
      }
      // Due Today
      else if (deadlineDate >= startOfToday && deadlineDate <= endOfToday) {
        generated.push({
          id: `today-${t._id}`,
          type: 'today',
          title: 'Due Today',
          message: `"${t.title}" is due today`,
          icon: Clock,
          color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
          taskId: t._id,
        });
      }
      // High Priority Approaching
      else if (t.priority === 'High') {
        generated.push({
          id: `high-${t._id}`,
          type: 'high',
          title: 'High Priority Task',
          message: `"${t.title}" is high priority (due ${deadlineDate.toLocaleDateString()})`,
          icon: CalendarCheck,
          color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-900',
          taskId: t._id,
        });
      }
    });

    setNotifications(generated);
  }, [tasks]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {notifications.length > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-800 animate-pulse" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Bell className="w-4 h-4 text-sky-500" /> Notifications
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                {notifications.length} Alerts
              </span>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-80" />
                  <p className="text-sm font-medium">All caught up!</p>
                  <p className="text-xs">No urgent notifications right now.</p>
                </div>
              ) : (
                notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/tasks');
                      }}
                      className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors cursor-pointer flex gap-3 items-start"
                    >
                      <div className={`p-2 rounded-lg border shrink-0 ${n.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {n.title}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-2 border-t border-slate-100 dark:border-slate-700/60 text-center bg-slate-50 dark:bg-slate-800/80">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/notifications');
                }}
                className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline"
              >
                View all notification details
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;
