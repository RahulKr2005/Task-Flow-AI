const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/prioritize', aiController.prioritizeTasks);
router.post('/daily-plan', aiController.dailyPlan);
router.post('/productivity-summary', aiController.productivitySummary);

module.exports = router;
