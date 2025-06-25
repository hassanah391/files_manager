/**
 * AuthController - Handles user authentication operations
 * Manages user sign-in (connect) and sign-out (disconnect) functionality
 * Uses Redis for token storage and userUtils for helper functions
 */

import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';
import redisClient from '../utils/redis';
import userUtils from '../utils/user';

class AuthController {
  /**
   * GET /connect - Authenticates a user and generates an authentication token
   * 
   * Implements Basic Authentication using Base64 encoded credentials.
   * Validates email and password against the database, generates a UUID token,
   * stores the user ID in Redis with a 24-hour expiration, and returns the token.
   * 
   * @param {Object} request - Express request object with Authorization header
   * @param {Object} response - Express response object
   * @returns {Object} Success: Token object | Error: Unauthorized error
   * 
   * Required headers:
   * - Authorization: "Basic <base64-encoded-email:password>"
   * 
   * Example Authorization header:
   * Authorization: Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE=
   * (where Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE= is base64 for "bob@dylan.com:toto1234!")
   * 
   * Success response (200):
   * {
   *   "token": "031bffac-3edc-4e51-aaae-1c121317da8a"
   * }
   * 
   * Error response (401):
   * {
   *   "error": "Unauthorized"
   * }
   */
  static async getConnect(request, response) {
    // Extract Authorization header from request
    const Authorization = request.header('Authorization') || '';

    // Extract Base64 credentials from "Basic <credentials>" format
    const credentials = Authorization.split(' ')[1];

    // Return unauthorized if no credentials provided
    if (!credentials) { return response.status(401).send({ error: 'Unauthorized' }); }

    // Decode Base64 credentials to get email and password
    const decodedCredentials = Buffer.from(credentials, 'base64').toString('utf-8');

    // Split decoded credentials into email and password
    const [email, password] = decodedCredentials.split(':');

    // Validate that both email and password are present
    if (!email || !password) { return response.status(401).send({ error: 'Unauthorized' }); }

    // Hash the password using SHA1 for comparison with stored hash
    const sha1Password = sha1(password);

    // Find user in database with matching email and password hash
    const user = await userUtils.getUser({
      email,
      password: sha1Password,
    });

    // Return unauthorized if user not found or password doesn't match
    if (!user) return response.status(401).send({ error: 'Unauthorized' });

    // Generate a unique UUID token for authentication
    const token = uuidv4();
    const key = `auth_${token}`;
    const hoursForExpiration = 24;

    // Store user ID in Redis with 24-hour expiration
    await redisClient.set(key, user._id.toString(), hoursForExpiration * 3600);

    // Return the authentication token
    return response.status(200).send({ token });
  }

  /**
   * GET /disconnect - Signs out a user by invalidating their authentication token
   * 
   * Extracts the authentication token from the X-Token header,
   * validates the token exists in Redis, and deletes it to sign out the user.
   * 
   * @param {Object} request - Express request object with X-Token header
   * @param {Object} response - Express response object
   * @returns {Object} Success: Empty response with 204 status | Error: Unauthorized error
   * 
   * Required headers:
   * - X-Token: Authentication token from /connect endpoint
   * 
   * Success response (204):
   * (Empty response body)
   * 
   * Error response (401):
   * {
   *   "error": "Unauthorized"
   * }
   */
  static async getDisconnect(request, response) {
    // Extract user ID and Redis key from authentication token using userUtils
    const { userId, key } = await userUtils.getUserIdAndKey(request);

    // Return unauthorized if no valid user ID found
    if (!userId) return response.status(401).send({ error: 'Unauthorized' });

    // Delete the authentication token from Redis
    await redisClient.del(key);

    // Return success response with no content
    return response.status(204).send();
  }
}

export default AuthController;