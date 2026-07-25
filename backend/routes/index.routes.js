// Import Express to create a modular router for page routes.
const express = require('express');

// Create a new router instance to define route handlers.
const router = express.Router();

// Render the landing page when users visit the home route.
router.get('/', (req, res) => {
  res.render('index');
});

// Export the router so it can be mounted in the Express app.
module.exports = router;
