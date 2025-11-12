// routes/tasks.js
const express = require('express');
const router = express.Router();

const { generatePlan } = require('../utils/ai');
const { savePlan, fetchPlans } = require('../models/planModel');

// POST /api/generate-plan
router.post('/generate-plan', async (req, res) => {
  try {
    const { goal, days } = req.body;
    if (!goal || typeof goal !== 'string') {
      return res.status(400).json({ error: 'Goal text is required in the body as "goal"' });
    }

    const options = {};
    if (days && Number.isInteger(days)) options.days = days;

    const aiResp = await generatePlan(goal, options);
    const planToSave = {
      goal,
      days: options.days || 14,
      aiResp,
      createdAt: new Date()
    };

    await savePlan(planToSave);

    return res.json({ success: true, plan: planToSave });
  } catch (err) {
    console.error('generate-plan error', err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// GET /api/plans
router.get('/plans', async (req, res) => {
  try {
    const rows = await fetchPlans(50);
    res.json({ success: true, plans: rows });
  } catch (err) {
    console.error('fetch plans error', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
