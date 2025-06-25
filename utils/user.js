/**
 * Module with user utilities
 * Provides helper functions for user authentication and retrieval
 */

const redisClient = require('./redis');
const dbClient = require('./db');

/**
 * User utilities object containing helper functions
 */
const userUtils = {
  /**
   * Extracts user ID and Redis key from authentication token
   * 
   * @param {Object} request - Express request object
   * @returns {Object} Object containing userId and key, or null values if token invalid
   */
  async getUserIdAndKey(request) {
    const obj = { userId: null, key: null };

    const xToken = request.header('X-Token');

    if (!xToken) return obj;

    obj.key = `auth_${xToken}`;

    obj.userId = await redisClient.get(obj.key);

    return obj;
  },

  /**
   * Retrieves a user from the database based on query criteria
   * 
   * @param {Object} query - MongoDB query object
   * @returns {Object|null} User object if found, null otherwise
   */
  async getUser(query) {
    const user = await dbClient.usersCollection.findOne(query);
    return user;
  },
};

module.exports = userUtils;
