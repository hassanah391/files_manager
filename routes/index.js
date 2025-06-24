// routes/index.js
// Defines all API endpoints for the ALX Files Manager
// - GET /status: Returns Redis and DB status
// - GET /stats: Returns user and file counts

const express = require('express');
const router = express.Router();
const { getStatus, getStats } = require('../controllers/AppController');
const { postNew, getMe } = require('../controllers/UsersController');
const { getConnect, getDisconnect } = require('../controllers/AuthController');


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


router.post('/users/', async (req, res) => {
  const { email, password } = req.body;
  const result = await postNew(email, password);
  if (result && result.error) {
    return res.status(400).json({ error: result.error });
  }
  return res.status(201).json(result);
});


router.get('/connect', async (req, res) => {
  await getConnect(req, res);
});


router.get('/disconnect', async (req, res) => {
  await getDisconnect(req, res);
});


router.get('/users/me', async (req, res) => {
  await getMe(req, res);
});

module.exports = { router };
