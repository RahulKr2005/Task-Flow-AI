import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Calendar,
  Sparkles,
  Clock,
  CheckCircle2,
  Circle,
  RefreshCw,
  AlertCircle,
  Coffee,
  PlusCircle,
  LogIn,
} from 'lucide-react';

const PlannerPage = () => {
  const [schedule, setSchedule] = useState(() => {
    try {
      const saved = localStorage.getItem('taskflow_daily_schedule');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [completedItems, setCompletedItems] = useState(() => {
    try {
      const saved = localStorage.getItem('taskflow_completed_planner_items');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorCode, setErrorCode] = useState('');

  const generatePlan = async () => {
    if (loading) return; // Prevent duplicate requests
    try {
      setLoading(true);
      setError('');
      setErrorCode('');
      const res = await api.post('/ai/daily-plan');
      const newSchedule = res.data?.schedule || [];
      setSchedule(newSchedule);
      localStorage.setItem('taskflow_daily_schedule', JSON.stringify(newSchedule));
    } catch (err) {
      console.error('[AI Planner Frontend Error]:', err);
      setError(err.message || 'Failed to generate AI Daily Plan.');
      setErrorCode(err.code || '');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If no plan is cached, auto-generate on page load
    const saved = localStorage.getItem('taskflow_daily_schedule');
    if (!saved || JSON.parse(saved || '[]').length === 0) {
      generatePlan();
    }
  }, []);

  const toggleItemCompletion = async (index, taskId) => {
    const isDone = !completedItems[index];
    const updated = { ...completedItems, [index]: isDone };
    setCompletedItems(updated);
    try {
      localStorage.setItem('taskflow_completed_planner_items', JSON.stringify(updated));
    } catch (e) {
      // Ignore localStorage errors
    }

    // If item links to a real task in DB, update status
    if (taskId && taskId !== 'null') {
      try {
        await api.patch(`/tasks/${taskId}/status`, {
          status: isDone ? 'Completed' : 'Pending',
        });
      } catch (err) {
        console.error('Failed to sync completion with DB task:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            AI Daily Planner
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Smart time-blocked daily schedule optimized by Gemini AI
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={generatePlan}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Schedule...</span>
              </>
            ) : schedule.length > 0 ? (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Regenerate Plan</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate My Plan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-sm rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {errorCode === 'NO_TASKS' && (
              <Link
                to="/tasks"
                className="text-xs font-semibold px-3 py-1.5 bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-200 rounded-lg hover:bg-rose-200 dark:hover:bg-rose-900 flex items-center gap-1.5 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Go to Tasks
              </Link>
            )}
            {errorCode === 'AUTH_EXPIRED' && (
              <Link
                to="/login"
                className="text-xs font-semibold px-3 py-1.5 bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-200 rounded-lg hover:bg-rose-200 dark:hover:bg-rose-900 flex items-center gap-1.5 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" /> Log In
              </Link>
            )}
            <button
              onClick={generatePlan}
              disabled={loading}
              className="text-xs font-semibold hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Try Again
            </button>
          </div>
        </div>
      )}

      {/* Schedule Container */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs">
        {loading ? (
          <div className="py-20 text-center">
            <Sparkles className="w-10 h-10 text-sky-500 animate-bounce mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Generating your AI-powered daily plan...
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Gemini AI is calculating task duration, priority, and break intervals.
            </p>
          </div>
        ) : schedule.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No daily schedule generated yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Click "Generate My Plan" to let AI construct a personalized time-blocked plan for today.
            </p>
            <button
              onClick={generatePlan}
              disabled={loading}
              className="mt-4 px-5 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Generate My Plan
            </button>
          </div>
        ) : (
          <div className="relative border-l-2 border-sky-100 dark:border-sky-950 ml-4 space-y-6 py-2">
            {schedule.map((item, idx) => {
              const isDone = !!completedItems[idx];
              const isBreak = item.priority === 'Break' || item.task.toLowerCase().includes('break') || item.task.toLowerCase().includes('lunch');

              return (
                <div key={idx} className="relative pl-6">
                  {/* Timeline Node Icon */}
                  <button
                    onClick={() => toggleItemCompletion(idx, item.taskId)}
                    className="absolute -left-3 top-1 bg-white dark:bg-slate-800 rounded-full transition-transform hover:scale-110 focus:outline-none"
                    aria-label="Toggle completion"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
                    ) : isBreak ? (
                      <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-300 dark:border-amber-800">
                        <Coffee className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <Circle className="w-6 h-6 text-sky-500 fill-white dark:fill-slate-800" />
                    )}
                  </button>

                  <div
                    className={`p-4 rounded-xl border transition-all ${
                      isDone
                        ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-70'
                        : isBreak
                        ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
                        : 'bg-slate-50/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {item.time}
                        </span>
                        {item.estimatedDuration && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                            {item.estimatedDuration}
                          </span>
                        )}
                      </div>

                      {item.priority && item.priority !== 'Break' && (
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full w-fit ${
                            item.priority === 'High'
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                              : item.priority === 'Medium'
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                              : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          }`}
                        >
                          {item.priority} Priority
                        </span>
                      )}
                    </div>

                    <h4
                      className={`text-sm font-semibold text-slate-900 dark:text-slate-100 ${
                        isDone ? 'line-through text-slate-400 dark:text-slate-500' : ''
                      }`}
                    >
                      {item.task}
                    </h4>
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

export default PlannerPage;
