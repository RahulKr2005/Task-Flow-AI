import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import {
  Search,
  Filter,
  Plus,
  Sparkles,
  RefreshCw,
  AlertCircle,
  ListTodo,
} from 'lucide-react';

const TasksPage = ({ setAppTasks }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiMessage, setAiMessage] = useState('');

  // Filters state
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (search) params.search = search;
      if (activeFilter !== 'All') params.filter = activeFilter;
      if (categoryFilter !== 'All') params.category = categoryFilter;

      const res = await api.get('/tasks', { params });
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
  }, [search, activeFilter, categoryFilter]);

  const handleToggleStatus = async (id, newStatus) => {
    try {
      const res = await api.patch(`/tasks/${id}/status`, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
      if (setAppTasks) setAppTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      setError(err.message || 'Failed to update task status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      if (setAppTasks) setAppTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete task');
    }
  };

  const handleSaveTask = async (taskData) => {
    if (taskToEdit) {
      await api.put(`/tasks/${taskToEdit._id}`, taskData);
    } else {
      await api.post('/tasks', taskData);
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

  const filterTabs = ['All', 'Today', 'Pending', 'Completed', 'High Priority', 'Overdue'];
  const categories = ['All', 'Work', 'Study', 'Personal', 'Development', 'Meeting', 'Other'];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Task Management</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Organize, search, and automatically prioritize your work
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleAiPrioritize}
            disabled={aiLoading}
            className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-sky-950 dark:text-sky-100 bg-sky-100 dark:bg-sky-950/80 hover:bg-sky-200 dark:hover:bg-sky-900 border border-sky-300 dark:border-sky-800 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>{aiLoading ? 'AI Prioritizing...' : 'Prioritize with AI'}</span>
          </button>

          <button
            onClick={() => {
              setTaskToEdit(null);
              setIsModalOpen(true);
            }}
            className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
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

      {/* Search & Filter Bar */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks by title or keyword..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none dark:text-white"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none dark:text-white font-medium"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeFilter === tab
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-16 text-center text-slate-400">Loading your task list...</div>
        ) : tasks.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
            <ListTodo className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No tasks found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              There are no tasks matching your selected filters. Create a new task to get started!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-5 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors shadow-sm"
            >
              + Create Task
            </button>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onToggleStatus={handleToggleStatus}
              onEdit={(t) => {
                setTaskToEdit(t);
                setIsModalOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))
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

export default TasksPage;
