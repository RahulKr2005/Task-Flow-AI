import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  Zap,
  CheckCircle2,
  Sparkles,
  Calendar,
  BarChart3,
  Clock,
  ShieldCheck,
  ArrowRight,
  Target,
  ListTodo,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Future of Work & Automation Hackathon Track</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Plan Smarter. <span className="text-sky-600 dark:text-sky-400">Work Better.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            AI-powered task planning and productivity automation that helps you focus on what matters most.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2"
              >
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2"
                >
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#features"
                  className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors"
                >
                  Explore Features
                </a>
              </>
            )}
          </div>

          {/* Visual Dashboard Preview Illustration */}
          <div className="mt-14 max-w-5xl mx-auto relative rounded-2xl p-3 bg-slate-200/60 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 shadow-2xl">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 sm:p-8 text-left border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs text-slate-400 font-mono">TaskFlow AI Dashboard</span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI Active
                </span>
              </div>

              {/* Preview Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Total Tasks</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">12</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Completed</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">8</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400">High Priority</p>
                  <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">3</p>
                </div>
              </div>

              {/* Preview Task Row */}
              <div className="p-3.5 rounded-xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/50 dark:bg-sky-950/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sky-600 text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      AI Prioritized: Finalize Hackathon Demo
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Reason: Deadline is today and this task has high importance.
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                  High Priority
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A. Problem Section */}
      <section className="py-16 bg-white dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              The Problem
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              Planning work manually takes away time from doing actual work.
            </p>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Students, developers, freelancers, and small teams often struggle with task prioritization, deadline management, daily planning, and decision fatigue. People spend too much time deciding what to work on, organizing deadlines, and manually planning their day.
            </p>
          </div>
        </div>
      </section>

      {/* B. Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Features
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              Everything you need to automate your daily productivity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Smart Task Management',
                desc: 'Create, edit, organize, search, and filter tasks with customizable categories and deadlines.',
                icon: ListTodo,
              },
              {
                title: 'AI Priority Detection',
                desc: 'Let Gemini AI analyze deadlines, estimated time, and task importance to auto-classify priorities.',
                icon: Sparkles,
              },
              {
                title: 'AI Daily Planner',
                desc: 'Automatically generate a chronological time-blocked daily schedule tailored to your pending tasks.',
                icon: Calendar,
              },
              {
                title: 'Deadline Tracking',
                desc: 'Never miss a due date with automated in-app alerts for due today and overdue tasks.',
                icon: Clock,
              },
              {
                title: 'Productivity Analytics',
                desc: 'Track completion rates, high-priority wins, and status trends with real database charts.',
                icon: BarChart3,
              },
              {
                title: 'AI Work Summary',
                desc: 'Receive short, actionable weekly feedback summaries powered by AI coaching logic.',
                icon: TrendingUp,
              },
            ].map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-sky-500/50 transition-all hover:shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{f.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* C. How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-100/70 dark:bg-slate-800/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Workflow
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              How TaskFlow AI Works
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { step: '01', title: 'Add Tasks', desc: 'Input your pending tasks, deadlines, and time estimates.' },
              { step: '02', title: 'AI Analyzes', desc: 'Gemini evaluates deadlines, difficulty, and priority rules.' },
              { step: '03', title: 'Smart Daily Plan', desc: 'Get a clear time-blocked daily schedule generated in seconds.' },
              { step: '04', title: 'Complete Tasks', desc: 'Work through prioritized tasks with zero decision fatigue.' },
              { step: '05', title: 'Track Productivity', desc: 'Monitor your completed wins and review AI productivity insights.' },
            ].map((s, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-2xl font-extrabold text-sky-600 dark:text-sky-400 block mb-2">
                  {s.step}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">{s.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* D. Benefits Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Why TaskFlow AI
              </h2>
              <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
                Engineered for focus, built for modern teams
              </p>
              <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
                TaskFlow AI removes manual scheduling overhead, giving you back hours of deep focus every week.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  'Save planning time every single morning',
                  'Focus on high-impact, important work first',
                  'Reduce missed deadlines with intelligent alerts',
                  'Gain actionable insights into your work habits',
                ].map((b, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-sky-600 to-indigo-700 text-white shadow-2xl">
              <h3 className="text-2xl font-bold mb-3">Ready to boost your output?</h3>
              <p className="text-sky-100 text-sm mb-6 leading-relaxed">
                Join thousands of students, developers, and professionals who automate their task planning with TaskFlow AI.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-6 py-3 font-semibold text-sky-900 bg-white hover:bg-sky-50 rounded-xl transition-colors shadow-md"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* E. Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-lg">
              <Zap className="w-5 h-5" />
              <span>TaskFlow AI</span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              TaskFlow AI &bull; Future of Work & Automation Hackathon Project &bull; &copy; {new Date().getFullYear()} All rights reserved.
            </p>

            <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <Link to="/login" className="hover:text-sky-600 transition-colors">Login</Link>
              <Link to="/register" className="hover:text-sky-600 transition-colors">Register</Link>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-sky-600 transition-colors">GitHub Repository</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
