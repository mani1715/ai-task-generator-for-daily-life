// models/planModel.js
// Small wrapper to insert and fetch plans

const { getDb } = require('../db/connect');

const COLLECTION = 'plans';

async function savePlan(planObj) {
  const db = getDb();
  const result = await db.collection(COLLECTION).insertOne(planObj);
  return result;
}

async function fetchPlans(limit = 50) {
  const db = getDb();
  const rows = await db
    .collection(COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  return rows;
}

module.exports = { savePlan, fetchPlans };
