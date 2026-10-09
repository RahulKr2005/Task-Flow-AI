const Task = require('../models/Task');

exports.getOverview = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
    const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
    const highPriorityCompleted = tasks.filter((t) => t.status === 'Completed' && t.priority === 'High').length;
    const highPriorityTotal = tasks.filter((t) => t.priority === 'High').length;

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Status Distribution
    const statusDistribution = [
      { name: 'Completed', value: completedTasks, color: '#10B981' },
      { name: 'In Progress', value: inProgressTasks, color: '#3B82F6' },
      { name: 'Pending', value: pendingTasks, color: '#F59E0B' },
    ];

    // Last 7 days task completion trend
    const last7Days = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

      const dayLabel = dayStart.toLocaleDateString('en-US', { weekday: 'short' });

      // Tasks completed on or updated to completed on this day
      const completedOnDay = tasks.filter((t) => {
        if (t.status !== 'Completed') return false;
        const updatedAt = new Date(t.updatedAt || t.createdAt);
        return updatedAt >= dayStart && updatedAt <= dayEnd;
      }).length;

      const createdOnDay = tasks.filter((t) => {
        const createdAt = new Date(t.createdAt);
        return createdAt >= dayStart && createdAt <= dayEnd;
      }).length;

      last7Days.push({
        day: dayLabel,
        date: dayStart.toISOString().split('T')[0],
        completed: completedOnDay,
        created: createdOnDay,
      });
    }

    res.json({
      summary: {
        totalTasks,
        completedTasks,
        pendingTasks: pendingTasks + inProgressTasks,
        completionRate,
        highPriorityCompleted,
        highPriorityTotal,
      },
      statusDistribution,
      last7DaysTrend: last7Days,
    });
  } catch (error) {
    console.error('Analytics Overview Error:', error);
    res.status(500).json({ message: 'Error fetching analytics overview' });
  }
};
