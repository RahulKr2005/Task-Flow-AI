require('dotenv').config();
const geminiService = require('../services/geminiService');

async function testPlanner() {
  const dummyTasks = [
    { id: '1', title: 'Complete DSA Practice', description: 'Arrays & Strings', category: 'Study', priority: 'High', estimatedTime: '1.5 hours', deadline: new Date() },
    { id: '2', title: 'Work on TaskFlow AI Project', description: 'Backend integration', category: 'Development', priority: 'High', estimatedTime: '2 hours', deadline: new Date() }
  ];

  try {
    console.log('Testing generateDailyPlanWithAI...');
    const result = await geminiService.generateDailyPlanWithAI(dummyTasks);
    console.log('✅ Daily Planner Result:', JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('❌ Planner Test Error:', err);
  }
}

testPlanner();
