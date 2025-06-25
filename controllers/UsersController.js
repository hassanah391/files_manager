/**
 * UsersController - Handles user-related operations
 * Manages user creation, authentication, and profile retrieval
 * Uses Bull queue for background job processing
 */

import { ObjectId } from 'mongodb';
import sha1 from 'sha1';
import Queue from 'bull';
import dbClient from '../utils/db';
import userUtils from '../utils/user';

// Initialize Bull queue for user-related background jobs
const userQueue = new Queue('userQueue');

class UsersController {
  /**
   * POST /users - Creates a new user in the database
   * 
   * Validates email and password, checks for existing users,
   * hashes the password using SHA1, and stores the user in MongoDB.
   * Also adds a background job to the user queue for additional processing.
   * 
   * @param {Object} request - Express request object containing email and password in body
   * @param {Object} response - Express response object
   * @returns {Object} Success: User object with id and email | Error: Error message with appropriate status code
   * 
   * Request body:
   * {
   *   "email": "user@example.com",
   *   "password": "password123"
   * }
   * 
   * Success response (201):
   * {
   *   "id": "5f1e7cda04a394508232559d",
   *   "email": "user@example.com"
   * }
   * 
   * Error responses:
   * - 400: Missing email/password or user already exists
   * - 500: Database error during user creation
   */
  static async postNew(request, response) {
    // Extract email and password from request body
    const { email, password } = request.body;

    // Validate email parameter
    if (!email) return response.status(400).send({ error: 'Missing email' });

    // Validate password parameter
    if (!password) { return response.status(400).send({ error: 'Missing password' }); }

    // Check if user with this email already exists
    const emailExists = await dbClient.usersCollection.findOne({ email });

    if (emailExists) { return response.status(400).send({ error: 'Already exist' }); }

    // Hash password using SHA1 for secure storage
    const sha1Password = sha1(password);

    // Insert new user into database
    let result;
    try {
      result = await dbClient.usersCollection.insertOne({
        email,
        password: sha1Password,
      });
    } catch (err) {
      // If database insertion fails, add empty job to queue and return error
      await userQueue.add({});
      return response.status(500).send({ error: 'Error creating user.' });
    }

    // Prepare user object for response (excluding password)
    const user = {
      id: result.insertedId,
      email,
    };

    // Add background job to user queue with user ID for additional processing
    await userQueue.add({
      userId: result.insertedId.toString(),
    });

    // Return success response with user data
    return response.status(201).send(user);
  }

  /**
   * GET /users/me - Retrieves the current user's profile
   * 
   * Validates the authentication token from request headers,
   * retrieves user data from MongoDB, and returns user profile.
   * Uses userUtils helper functions for token validation and user retrieval.
   * 
   * @param {Object} request - Express request object (must contain valid authentication token)
   * @param {Object} response - Express response object
   * @returns {Object} Success: User profile object | Error: Unauthorized error
   * 
   * Required headers:
   * - X-Token: Authentication token from /connect endpoint
   * 
   * Success response (200):
   * {
   *   "id": "5f1e7cda04a394508232559d",
   *   "email": "user@example.com"
   * }
   * 
   * Error response (401):
   * {
   *   "error": "Unauthorized"
   * }
   */
  static async getMe(request, response) {
    // Extract user ID and Redis key from authentication token
    const { userId } = await userUtils.getUserIdAndKey(request);

    // Retrieve user from database using ObjectId
    const user = await userUtils.getUser({
      _id: ObjectId(userId),
    });

    // Return unauthorized if user not found
    if (!user) return response.status(401).send({ error: 'Unauthorized' });

    // Process user object: include all properties but remove sensitive data
    const processedUser = { id: user._id, ...user };
    delete processedUser._id;      // Remove MongoDB _id field
    delete processedUser.password; // Remove password for security

    // Return user profile
    return response.status(200).send(processedUser);
  }
}

export default UsersController;