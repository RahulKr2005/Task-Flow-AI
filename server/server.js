require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');

const User = require('./models/User');
const Task = require('./models/Task');
const bcrypt = require('bcryptjs');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const aiRoutes = require('./routes/aiRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskflow';

// Robust CORS configuration supporting localhost & deployed environments
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, curl, health checks)
    if (!origin) return callback(null, true);

    const isExplicitlyAllowed = allowedOrigins.includes(origin);
    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    const isDeployPreview = origin.endsWith('.netlify.app') || origin.endsWith('.vercel.app');

    if (isExplicitlyAllowed || isLocalhost || isDeployPreview || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// Database readiness middleware for auth & API routes
const checkDbConnected = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database is still initializing. Please wait a few seconds and try again.',
    });
  }
  next();
};

// API Routes
app.use('/api/auth', checkDbConnected, authRoutes);
app.use('/api/tasks', checkDbConnected, taskRoutes);
app.use('/api/ai', checkDbConnected, aiRoutes);
app.use('/api/analytics', checkDbConnected, analyticsRoutes);

// Root & Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'connecting',
    geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `API endpoint ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    message: err.message || 'An unexpected internal server error occurred',
  });
});

// Seed Initial Demo Data helper
const seedDemoData = async () => {
  try {
    const demoEmail = 'demo@taskflow.ai';
    const existing = await User.findOne({ email: demoEmail });
    if (!existing) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('demo123456', salt);
      const demoUser = await User.create({
        name: 'Alex Rivera',
        email: demoEmail,
        password: hashedPassword,
      });

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0);
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 14, 0, 0);
      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 12, 0, 0);

      await Task.insertMany([
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
      ]);
      console.log('🌱 Demo account (demo@taskflow.ai / demo123456) seeded successfully');
    }
  } catch (err) {
    console.error('Demo seeding error:', err.message);
  }
};

// Start Server immediately, then connect database
app.listen(PORT, () => {
  console.log(`🚀 TaskFlow AI Server running on port ${PORT}`);
});

const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
    console.log('✅ Connected to MongoDB successfully');
  } catch (err) {
    console.log('⚠️ Local MongoDB service not detected. Starting embedded in-memory MongoDB server...');
    try {
      const mongod = await MongoMemoryServer.create({
        binary: { version: '6.0.5' }
      });
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('⚡ Connected to Embedded In-Memory MongoDB Server successfully');
      await seedDemoData();
    } catch (memErr) {
      console.error('❌ Failed to start embedded MongoDB server:', memErr.message);
    }
  }
};

connectDatabase();
