const express = require('express');
const router = express.Router();
const { getStatus, getStats } = require('../controllers/AppController');

const timeLog = (req, res, next) => {
  console.log('Time: ', new Date().toISOString());
  next();
};
router.use(timeLog)

router.get('/status', (req, res) => {
  res.send(getStatus());
});

router.get('/stats', (req, res) => {
  res.send(getStats());
});

module.exports = {  router };
