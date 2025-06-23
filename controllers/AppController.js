// controllers/AppController.js
// Controller for application-level endpoints for the ALX Files Manager API
// - Provides status and statistics endpoints

import redis from '../utils/redis'; // Redis utility for checking Redis status
import db from '../utils/db'; // DB utility for checking MongoDB status and stats

/**
 * Returns the status of Redis and the database.
 * @returns {Object} An object with keys 'redis' and 'db' indicating their status (true/false)
 */
const getStatus = async () => {
  let statusUtility = {
    'redis': false,
    'db': false
  };
  if (redis.isAlive()) {
    statusUtility.redis = true;
  }
  if (db.isAlive()) {
    statusUtility.db = true;
  }

  return statusUtility;
};

/**
 * Returns statistics about the database.
 * @returns {Promise<Object>} An object with keys 'users' and 'files' containing their respective counts
 */
const getStats = async () => {
  const users = await db.nbUsers();
  const files = await db.nbFiles();
  return {'users': users, 'files': files};
};

// Export controller functions for use in routes
module.exports = {
  getStatus,
  getStats
};
