/**
 * routes/index.js - Defines all API endpoints for the ALX Files Manager
 * 
 * Endpoints:
 * - GET /status: Returns Redis and DB status
 * - GET /stats: Returns user and file counts
 * - POST /users: Creates a new user
 * - GET /users/me: Gets current user profile
 * - GET /connect: Authenticates user and returns token
 * - GET /disconnect: Signs out user by invalidating token
 */

const express = require('express');
const router = express.Router();
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');

// Middleware to log the time of each request
const timeLog = (req, res, next) => {
  console.log('Time: ', new Date().toISOString());
  next();
};
router.use(timeLog);

// GET /status - Returns Redis and DB status
router.get('/status', (req, res) => {
  AppController.getStatus(req, res);
});

// GET /stats - Returns number of users and files in the database
router.get('/stats', (req, res) => {
  AppController.getStats(req, res);
});

// POST /users - Creates a new user
router.post('/users', (req, res) => {
  UsersController.postNew(req, res);
});

// GET /connect - Authenticates user and returns token
router.get('/connect', (req, res) => {
  AuthController.getConnect(req, res);
});

// GET /disconnect - Signs out user by invalidating token
router.get('/disconnect', (req, res) => {
  AuthController.getDisconnect(req, res);
});

// GET /users/me - Gets current user profile
router.get('/users/me', (req, res) => {
  UsersController.getMe(req, res);
});

module.exports = { router };
