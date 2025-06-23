const express = require('express');
const router = express.Router();
const { getStatus, getStats } = require('../controllers/AppController');

const timeLog = (req, res, next) => {
  console.log('Time: ', new Date().toISOString());
  next();
};
router.use(timeLog)

router.get('/status', async (req, res) => {
  res.send(await getStatus());
});

router.get('/stats', async (req, res) => {
  res.send(await getStats());
});

module.exports = {  router };
