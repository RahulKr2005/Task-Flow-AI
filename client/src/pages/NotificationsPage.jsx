import React from 'react';
import { Bell, AlertTriangle, Clock, CalendarCheck, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationsPage = ({ tasks = [] }) => {
  const navigate = useNavigate();

  const generated = [];
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  tasks.forEach((t) => {
    if (t.status === 'Completed') return;

    const deadlineDate = new Date(t.deadline);

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
    } else if (deadlineDate >= startOfToday && deadlineDate <= endOfToday) {
      generated.push({
        id: `today-${t._id}`,
        type: 'today',
        title: 'Due Today',
        message: `"${t.title}" is due today (${t.estimatedTime || '30 mins'})`,
        icon: Clock,
        color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
        taskId: t._id,
      });
    } else if (t.priority === 'High') {
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

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-6 h-6 text-sky-600 dark:text-sky-400" />
          Notifications & Alerts
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Automatic alerts generated for due today, overdue, and high priority tasks
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs">
        {generated.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No active notifications
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              You are all caught up on your deadlines and priority tasks!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {generated.map((n) => {
              const Icon = n.icon;
              return (
                <div
                  key={n.id}
                  onClick={() => navigate('/tasks')}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-sky-400 transition-colors cursor-pointer flex items-start gap-4"
                >
                  <div className={`p-2.5 rounded-xl border shrink-0 ${n.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {n.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      {n.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
