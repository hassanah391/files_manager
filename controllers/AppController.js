/**
 * AppController - Handles application-wide endpoints
 * Provides status and statistics endpoints for the ALX Files Manager API
 */

const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AppController {
  /**
   * GET /status - Returns the status of Redis and MongoDB connections
   * 
   * @param {Object} request - Express request object
   * @param {Object} response - Express response object
   * @returns {Object} JSON response with redis and db connection status
   * 
   * Example response:
   * {
   *   "redis": true,
   *   "db": true
   * }
   */
  static getStatus(request, response) {
    const status = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    response.status(200).send(status);
  }

  /**
   * GET /stats - Returns the number of users and files in the database
   * 
   * @param {Object} request - Express request object
   * @param {Object} response - Express response object
   * @returns {Object} JSON response with user and file counts
   * 
   * Example response:
   * {
   *   "users": 5,
   *   "files": 12
   * }
   */
  static async getStats(request, response) {
    const stats = {
      users: await dbClient.nbUsers(),
      files: await dbClient.nbFiles(),
    };
    response.status(200).send(stats);
  }
}

module.exports = AppController;