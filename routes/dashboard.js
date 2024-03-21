// dashboard.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/panel', dashboardController.panel);

module.exports = router;
