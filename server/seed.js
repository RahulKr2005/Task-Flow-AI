require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskflow';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear demo user and tasks if exists
    const demoEmail = 'demo@taskflow.ai';
    const existingUser = await User.findOne({ email: demoEmail });

    if (existingUser) {
      await Task.deleteMany({ userId: existingUser._id });
      await User.deleteOne({ _id: existingUser._id });
      console.log('Cleared previous demo user data.');
    }

    // Create demo user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('demo123456', salt);

    const demoUser = await User.create({
      name: 'Alex Rivera',
      email: demoEmail,
      password: hashedPassword,
    });

    console.log(`Demo User created: ${demoEmail} / demo123456`);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0);
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 14, 0, 0);
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 12, 0, 0);

    const demoTasks = [
      {
        userId: demoUser._id,
        title: 'Complete Hackathon Submission Pitch Deck',
        description: 'Prepare slides for TaskFlow AI demo and summarize key architectural decisions.',
        category: 'Development',
        deadline: today,
        estimatedTime: '2 hours',
        priority: 'High',
        status: 'In Progress',
        aiPriorityReason: 'Deadline is today and crucial for presentation.',
      },
      {
        userId: demoUser._id,
        title: 'Practice 3 LeetCode DSA Problems',
        description: 'Focus on Graph Traversal and Dynamic Programming pattern questions.',
        category: 'Study',
        deadline: today,
        estimatedTime: '1.5 hours',
        priority: 'High',
        status: 'Pending',
        aiPriorityReason: 'Scheduled daily study milestone with strict deadline.',
      },
      {
        userId: demoUser._id,
        title: 'Client Weekly Sync & Sprint Review',
        description: 'Discuss Q4 product roadmap updates and backend API optimization progress.',
        category: 'Meeting',
        deadline: tomorrow,
        estimatedTime: '45 mins',
        priority: 'Medium',
        status: 'Pending',
        aiPriorityReason: 'Important client meeting scheduled for tomorrow afternoon.',
      },
      {
        userId: demoUser._id,
        title: 'Refactor Auth Token Verification Middleware',
        description: 'Ensure token expiration exceptions provide clean user-facing error messages.',
        category: 'Development',
        deadline: tomorrow,
        estimatedTime: '1 hour',
        priority: 'Medium',
        status: 'Completed',
        aiPriorityReason: 'Code refactoring completed ahead of deadline.',
      },
      {
        userId: demoUser._id,
        title: 'Quarterly Team Expense Audit Report',
        description: 'Review software subscriptions and cloud service usage logs.',
        category: 'Work',
        deadline: yesterday,
        estimatedTime: '3 hours',
        priority: 'High',
        status: 'Pending',
        aiPriorityReason: 'Overdue task requiring immediate attention.',
      },
    ];

    await Task.insertMany(demoTasks);
    console.log(`Successfully seeded ${demoTasks.length} demo tasks!`);
    console.log('\n--- DEMO CREDENTIALS ---');
    console.log('Email:    demo@taskflow.ai');
    console.log('Password: demo123456');
    console.log('------------------------\n');

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();
