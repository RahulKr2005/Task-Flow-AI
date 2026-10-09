import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import {
  ListTodo,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  Plus,
  Sparkles,
  Calendar,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = ({ setAppTasks }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiMessage, setAiMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/tasks');
      setTasks(res.data);
      if (setAppTasks) setAppTasks(res.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleStatus = async (id, newStatus) => {
    try {
      const res = await api.patch(`/tasks/${id}/status`, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
      if (setAppTasks) {
        setAppTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
      }
    } catch (err) {
      setError(err.message || 'Failed to update task status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      if (setAppTasks) {
        setAppTasks((prev) => prev.filter((t) => t._id !== id));
      }
    } catch (err) {
      setError(err.message || 'Failed to delete task');
    }
  };

  const handleSaveTask = async (taskData) => {
    if (taskToEdit) {
      const res = await api.put(`/tasks/${taskToEdit._id}`, taskData);
      setTasks((prev) => prev.map((t) => (t._id === taskToEdit._id ? res.data : t)));
    } else {
      const res = await api.post('/tasks', taskData);
      setTasks((prev) => [res.data, ...prev]);
    }
    fetchTasks();
  };

  const handleAiPrioritize = async () => {
    try {
      setAiLoading(true);
      setError('');
      setAiMessage('');
      const res = await api.post('/ai/prioritize');
      setAiMessage(res.data.message || 'Tasks prioritized with AI!');
      fetchTasks();
    } catch (err) {
      setError(err.message || 'AI Prioritization failed. Check your GEMINI_API_KEY.');
    } finally {
      setAiLoading(false);
    }
  };

  // Stats Calculations
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const pendingCount = tasks.filter((t) => t.status === 'Pending' || t.status === 'In Progress').length;
  const highPriorityCount = tasks.filter((t) => t.priority === 'High' && t.status !== 'Completed').length;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const overdueCount = tasks.filter((t) => {
    const d = new Date(t.deadline);
    return d < startOfToday && t.status !== 'Completed';
  }).length;

  const todayTasks = tasks.filter((t) => {
    const d = new Date(t.deadline);
    return d >= startOfToday && d <= endOfToday;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track your tasks, AI priority insights, and progress today
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleAiPrioritize}
            disabled={aiLoading || tasks.length === 0}
            className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-sky-950 dark:text-sky-100 bg-sky-100 dark:bg-sky-950/80 hover:bg-sky-200 dark:hover:bg-sky-900 border border-sky-300 dark:border-sky-800 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>{aiLoading ? 'AI Thinking...' : 'Prioritize with AI'}</span>
          </button>

          <button
            onClick={() => {
              setTaskToEdit(null);
              setIsModalOpen(true);
            }}
            className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-sm rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={fetchTasks} className="text-xs font-semibold hover:underline flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {aiMessage && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2 font-medium">
          <Sparkles className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{aiMessage}</span>
        </div>
      )}

      {/* 5 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Tasks</span>
            <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
              <ListTodo className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{totalCount}</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Completed</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">{completedCount}</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">{pendingCount}</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">High Priority</span>
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-2">{highPriorityCount}</p>
        </div>

        <div className="col-span-2 lg:col-span-1 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Overdue</span>
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">{overdueCount}</p>
        </div>
      </div>

      {/* Today's Tasks Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Today's Tasks</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tasks due today ({todayTasks.length})
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/tasks')}
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
          >
            View All Tasks &rarr;
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading tasks...</div>
        ) : todayTasks.length === 0 ? (
          <div className="py-10 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No tasks due today!
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Add a new task or check your upcoming schedule in My Tasks.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors"
            >
              + Create Today's Task
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {todayTasks.map((t) => (
              <TaskCard
                key={t._id}
                task={t}
                onToggleStatus={handleToggleStatus}
                onEdit={(task) => {
                  setTaskToEdit(task);
                  setIsModalOpen(true);
                }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};

export default DashboardPage;
