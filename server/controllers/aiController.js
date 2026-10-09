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
    const tasks = await Task.find({ userId: req.user.id, status: { $ne: 'Completed' } });

    if (tasks.length === 0) {
      return res.status(400).json({ message: 'No pending tasks found to generate daily plan.' });
    }

    const schedule = await geminiService.generateDailyPlanWithAI(tasks);
    res.json({ schedule });
  } catch (error) {
    console.error('AI Daily Planner Controller Error:', error);
    res.status(500).json({ message: error.message || 'AI Daily Planner failed' });
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
