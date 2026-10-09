require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('Testing with API key:', apiKey ? apiKey.substring(0, 10) + '...' : 'NONE');
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const candidateModels = ['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-1.5-flash-8b'];

  for (const modelName of candidateModels) {
    try {
      console.log(`Testing model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const res = await model.generateContent('Hello, reply with "OK".');
      console.log(`✅ SUCCESS with ${modelName}:`, res.response.text());
      return modelName;
    } catch (err) {
      console.error(`❌ FAILED ${modelName}:`, err.message);
    }
  }
}

testModels();
