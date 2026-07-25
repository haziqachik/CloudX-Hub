// Import Express so this file explicitly uses the framework.
const express = require('express');

// Load environment variables from a .env file into process.env.
require('dotenv').config();

// Import the configured Express app from the local app module.
const app = require('./app');

// Read the server port from environment variables, or default to 3000.
const PORT = process.env.PORT || 3000;

// Start the HTTP server and listen for incoming requests.
const server = app.listen(PORT, () => {
	// Log a startup message so developers know the server is running.
	console.log('CloudX Hub running on http://localhost:3000');
});

// Export server-related items using CommonJS for reuse in tests or tooling.
module.exports = server;
