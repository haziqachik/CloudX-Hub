const express = require('express');
const {
  getRegisterPage,
  getLoginPage,
  register,
  login,
  logout,
} = require('../controllers/auth.controller');

// Create a dedicated router for authentication page and action routes.
const router = express.Router();

// Render the login form.
router.get('/login', getLoginPage);

// Process login form submissions.
router.post('/login', login);

// Render the registration form.
router.get('/register', getRegisterPage);

// Process registration form submissions.
router.post('/register', register);

// Process logout requests and clear session state.
router.get('/logout', logout);

module.exports = router;
