const Task = require('../models/Task');

// Get all tasks for current user
exports.getTasks = async (req, res) => {
  try {
    const { category, status, priority, search, filter } = req.query;
    let query = { userId: req.user.id };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Special quick filters
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (filter === 'Today') {
      query.deadline = { $gte: startOfToday, $lte: endOfToday };
    } else if (filter === 'Pending') {
      query.status = { $ne: 'Completed' };
    } else if (filter === 'Completed') {
      query.status = 'Completed';
    } else if (filter === 'High Priority') {
      query.priority = 'High';
    } else if (filter === 'Overdue') {
      query.deadline = { $lt: startOfToday };
      query.status = { $ne: 'Completed' };
    }

    const tasks = await Task.find(query).sort({ deadline: 1, createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Get Tasks Error:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, category, deadline, estimatedTime, priority, status } = req.body;

    if (!title || !deadline) {
      return res.status(400).json({ message: 'Task title and deadline are required' });
    }

    const task = new Task({
      userId: req.user.id,
      title,
      description: description || '',
      category: category || 'Work',
      deadline,
      estimatedTime: estimatedTime || '30 mins',
      priority: priority || 'Medium',
      status: status || 'Pending',
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Create Task Error:', error);
    res.status(500).json({ message: 'Error creating task' });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ _id: id, userId: req.user.id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const allowedUpdates = ['title', 'description', 'category', 'deadline', 'estimatedTime', 'priority', 'status', 'aiPriorityReason'];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    await task.save();
    res.json(task);
  } catch (error) {
    console.error('Update Task Error:', error);
    res.status(500).json({ message: 'Error updating task' });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully', id });
  } catch (error) {
    console.error('Delete Task Error:', error);
    res.status(500).json({ message: 'Error deleting task' });
  }
};

// Patch task status
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const task = await Task.findOne({ _id: id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = status;
    await task.save();

    res.json(task);
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ message: 'Error updating task status' });
  }
};
