// routes/index.js
// Defines all API endpoints for the ALX Files Manager
// - GET /status: Returns Redis and DB status
// - GET /stats: Returns user and file counts

const express = require('express');
const router = express.Router();
const { getStatus, getStats } = require('../controllers/AppController');

// Middleware to log the time of each request
const timeLog = (req, res, next) => {
  console.log('Time: ', new Date().toISOString());
  next();
};
router.use(timeLog);

// GET /status - Returns Redis and DB status
router.get('/status', async (req, res) => {
  res.send(await getStatus());
});

// GET /stats - Returns number of users and files in the database
router.get('/stats', async (req, res) => {
  res.send(await getStats());
});

module.exports = { router };
