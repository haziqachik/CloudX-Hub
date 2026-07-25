const express = require('express');
const { getDashboardPage } = require('../controllers/dashboard.controller');
const { requireAuth } = require('../middleware/auth.middleware');

// Create a router for authenticated dashboard pages.
const router = express.Router();

// Serve the dashboard page only to authenticated users.
router.get('/dashboard', requireAuth, getDashboardPage);

module.exports = router;
