// db/connect.js
const { MongoClient } = require('mongodb');

let dbClient;

async function connect(uri) {
  if (!uri) throw new Error('MONGODB_URI not provided');
  if (dbClient) return dbClient;
  const client = new MongoClient(uri);
  await client.connect();
  dbClient = client.db(); // default DB from URI
  console.log('Connected to MongoDB');
  return dbClient;
}

function getDb() {
  if (!dbClient) throw new Error('Database not initialized. Call connect first.');
  return dbClient;
}

module.exports = connect;
module.exports.getDb = getDb;
