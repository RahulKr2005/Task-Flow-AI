const Task = require('../models/Task');
const geminiService = require('../services/geminiService');

// Prioritize tasks using AI
exports.prioritizeTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id, status: { $ne: 'Completed' } });

    if (tasks.length === 0) {
      return res.status(400).json({ message: 'No pending tasks available to prioritize.' });
    }

    const aiResults = await geminiService.prioritizeTasksWithAI(tasks);

    // Update DB with AI returned priorities & reasons
    const updatedTasks = [];
    for (const result of aiResults) {
      if (result.id) {
        const updated = await Task.findOneAndUpdate(
          { _id: result.id, userId: req.user.id },
          {
            priority: result.priority || 'Medium',
            aiPriorityReason: result.aiPriorityReason || 'AI prioritized based on task deadline and importance.',
          },
          { new: true }
        );
        if (updated) updatedTasks.push(updated);
      }
    }

    res.json({
      message: 'Tasks successfully prioritized with AI',
      tasks: updatedTasks.length > 0 ? updatedTasks : tasks,
    });
  } catch (error) {
    console.error('AI Prioritization Controller Error:', error);
    res.status(500).json({ message: error.message || 'AI Prioritization failed' });
  }
};

// Generate AI Daily Planner
exports.dailyPlan = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        message: 'Authentication required. Please log in again.',
        code: 'AUTH_REQUIRED',
      });
    }

    // Check Gemini API key existence
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
      console.warn('[AI Daily Planner] Request aborted: GEMINI_API_KEY is not configured on the backend.');
      return res.status(500).json({
        message: 'Gemini API key is not configured. Please set GEMINI_API_KEY in the server/.env file.',
        code: 'MISSING_API_KEY',
      });
    }

    const tasks = await Task.find({ userId, status: { $ne: 'Completed' } });

    if (!tasks || tasks.length === 0) {
      return res.status(400).json({
        message: 'No pending tasks found. Please add or restore pending tasks to generate a daily plan.',
        code: 'NO_TASKS',
      });
    }

    console.log(`[AI Daily Planner] Generating plan for user ${userId} with ${tasks.length} pending task(s)...`);

    const schedule = await geminiService.generateDailyPlanWithAI(tasks);

    if (!schedule || !Array.isArray(schedule) || schedule.length === 0) {
      return res.status(502).json({
        message: 'Invalid AI response: The AI service returned an empty or unparseable schedule.',
        code: 'INVALID_AI_RESPONSE',
      });
    }

    console.log(`[AI Daily Planner] Successfully generated schedule with ${schedule.length} time block(s).`);
    res.json({ schedule });
  } catch (error) {
    const errorMsg = error.message || 'AI Daily Planner failed';
    console.error('[AI Daily Planner Controller Error]:', errorMsg);

    if (errorMsg.includes('API key') || errorMsg.includes('GEMINI_API_KEY')) {
      return res.status(500).json({
        message: 'Gemini API key is missing or invalid on the server.',
        code: 'MISSING_API_KEY',
      });
    }

    if (errorMsg.includes('503') || errorMsg.includes('high demand') || errorMsg.includes('overloaded')) {
      return res.status(503).json({
        message: 'Gemini AI is currently experiencing high demand. Please try again in a few moments.',
        code: 'AI_OVERLOADED',
      });
    }

    if (errorMsg.includes('validation failed') || errorMsg.includes('unparseable')) {
      return res.status(502).json({
        message: 'Failed to generate a valid daily plan schedule from AI. Please try again.',
        code: 'INVALID_AI_RESPONSE',
      });
    }

    res.status(500).json({
      message: errorMsg,
      code: 'AI_PLANNER_FAILED',
    });
  }
};

// Generate AI Productivity Summary
exports.productivitySummary = async (req, res) => {
  try {
    const allTasks = await Task.find({ userId: req.user.id });

    if (allTasks.length === 0) {
      return res.status(400).json({ message: 'No tasks available to generate productivity summary.' });
    }

    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter((t) => t.status === 'Completed').length;
    const pendingTasks = allTasks.filter((t) => t.status !== 'Completed').length;
    const highPriorityPending = allTasks.filter((t) => t.status !== 'Completed' && t.priority === 'High').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const categoryBreakdown = {};
    allTasks.forEach((t) => {
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + 1;
    });

    const stats = {
      totalTasks,
      completedTasks,
      pendingTasks,
      highPriorityPending,
      completionRate,
      categoryBreakdown,
    };

    const summary = await geminiService.generateProductivitySummaryWithAI(stats);
    res.json({ summary, stats });
  } catch (error) {
    console.error('AI Productivity Summary Controller Error:', error);
    res.status(500).json({ message: error.message || 'AI Productivity Summary failed' });
  }
};
