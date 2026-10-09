import React from 'react';
import {
  CheckCircle,
  Circle,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  Sparkles,
  Tag,
} from 'lucide-react';

const priorityColors = {
  High: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200 dark:border-rose-900',
  Medium: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-amber-900',
  Low: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
};

const categoryColors = {
  Work: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
  Study: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300',
  Personal: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
  Development: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',
  Meeting: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300',
  Other: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

const TaskCard = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const isCompleted = task.status === 'Completed';
  const deadlineFormatted = new Date(task.deadline).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className={`p-4 rounded-xl border transition-all duration-200 bg-white dark:bg-slate-800 hover:shadow-md ${
        isCompleted
          ? 'border-slate-200 dark:border-slate-700/60 opacity-75'
          : 'border-slate-200 dark:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Toggle Status Checkbox */}
        <button
          onClick={() => onToggleStatus(task._id, isCompleted ? 'Pending' : 'Completed')}
          className="mt-0.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shrink-0"
          aria-label={isCompleted ? 'Mark task pending' : 'Mark task completed'}
        >
          {isCompleted ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3
              className={`text-sm font-semibold text-slate-900 dark:text-slate-100 ${
                isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
              }`}
            >
              {task.title}
            </h3>

            {/* Category Badge */}
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                categoryColors[task.category] || categoryColors.Other
              }`}
            >
              <Tag className="w-3 h-3" />
              {task.category}
            </span>

            {/* Priority Badge */}
            <span
              className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                priorityColors[task.priority] || priorityColors.Medium
              }`}
            >
              {task.priority} Priority
            </span>
          </div>

          {task.description && (
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* AI Priority Reason Callout */}
          {task.aiPriorityReason && (
            <div className="my-2 p-2 rounded-lg bg-sky-50/70 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50 flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-sky-800 dark:text-sky-300 font-medium leading-relaxed">
                <span className="font-bold">AI Insight:</span> {task.aiPriorityReason}
              </p>
            </div>
          )}

          {/* Metadata Footer */}
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Due: {deadlineFormatted}</span>
            </div>
            {task.estimatedTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{task.estimatedTime}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Edit Task"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
