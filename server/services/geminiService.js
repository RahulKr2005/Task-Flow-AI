const { GoogleGenerativeAI } = require('@google/generative-ai');

const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in server/.env file.');
  }
  return new GoogleGenerativeAI(apiKey);
};

const generateWithFallback = async (prompt) => {
  const genAI = getGenAI();
  const modelsToTry = ['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-1.5-flash-8b'];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text() || '';
    } catch (err) {
      lastError = err;
      if (err.message && err.message.includes('404')) {
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('All candidate Gemini models failed.');
};

/**
 * AI Task Prioritization
 * Classifies tasks into High, Medium, Low and provides a short reason.
 */
exports.prioritizeTasksWithAI = async (tasks) => {
  const tasksSummary = tasks.map((t, idx) => ({
    index: idx,
    id: t._id || t.id,
    title: t.title,
    description: t.description,
    category: t.category,
    deadline: t.deadline,
    estimatedTime: t.estimatedTime,
    currentPriority: t.priority,
    status: t.status,
  }));

  const prompt = `
You are an expert AI productivity assistant. Analyze the following list of tasks and evaluate their priority.
For each task, analyze the deadline, importance, estimated time, category, and status.
Classify each task's priority as exactly one of: "High", "Medium", or "Low".
Also generate a SHORT, 1-sentence concise reason explaining why you assigned this priority.

Return ONLY a valid JSON array of objects with the following schema:
[
  {
    "id": "task_id_here",
    "priority": "High" | "Medium" | "Low",
    "aiPriorityReason": "Short 1-sentence reason here."
  }
]

Do not include markdown code block markers or any commentary outside the JSON array.

Tasks:
${JSON.stringify(tasksSummary, null, 2)}
`;

  try {
    let responseText = await generateWithFallback(prompt);
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsedResults = JSON.parse(responseText);
    return parsedResults;
  } catch (error) {
    console.error('Gemini Prioritization Error:', error);
    throw new Error(`AI Prioritization failed: ${error.message}`);
  }
};

/**
 * AI Daily Planner
 * Generates a practical chronological daily schedule for today's tasks.
 */
exports.generateDailyPlanWithAI = async (tasks, userTime = '09:00 AM') => {
  const tasksSummary = tasks.map((t) => ({
    id: t._id || t.id,
    title: t.title,
    description: t.description,
    category: t.category,
    priority: t.priority,
    estimatedTime: t.estimatedTime,
    deadline: t.deadline,
  }));

  const prompt = `
You are an intelligent daily planner AI assistant. 
Given the user's tasks for today (starting around ${userTime}), generate a structured, realistic chronological daily schedule.
Include necessary breaks (e.g. Lunch/Break) where appropriate.

Return ONLY a valid JSON array of objects with this schema:
[
  {
    "time": "09:00 AM - 10:30 AM",
    "task": "Task Title or Break Description",
    "priority": "High" | "Medium" | "Low" | "Break",
    "estimatedDuration": "1h 30m",
    "taskId": "task_id_if_matching_otherwise_null"
  }
]

Do not include markdown formatting or extra text.

Today's Tasks:
${JSON.stringify(tasksSummary, null, 2)}
`;

  try {
    let responseText = await generateWithFallback(prompt);
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    const schedule = JSON.parse(responseText);
    return schedule;
  } catch (error) {
    console.error('Gemini Daily Planner Error:', error);
    throw new Error(`AI Daily Planner failed: ${error.message}`);
  }
};

/**
 * AI Productivity Summary
 * Analyzes completed/pending statistics and generates a short actionable summary.
 */
exports.generateProductivitySummaryWithAI = async (stats) => {
  const prompt = `
You are a high-performance productivity coach. Review the following task completion statistics for the user:
- Total Tasks: ${stats.totalTasks}
- Completed Tasks: ${stats.completedTasks}
- Pending Tasks: ${stats.pendingTasks}
- High Priority Tasks Pending: ${stats.highPriorityPending}
- Completion Rate: ${stats.completionRate}%
- Top Categories: ${JSON.stringify(stats.categoryBreakdown || {})}

Write a short, engaging, 3 to 4 sentence productivity analysis summary and recommendation.
Example format:
"You completed X out of Y tasks this week. Most of your completed tasks were development-related. Z high-priority tasks are still pending. Consider completing them first tomorrow."

Return ONLY plain text text without markdown formatting or bullet points.
`;

  try {
    const text = await generateWithFallback(prompt);
    return text.trim();
  } catch (error) {
    console.error('Gemini Productivity Summary Error:', error);
    throw new Error(`AI Productivity Summary failed: ${error.message}`);
  }
};
