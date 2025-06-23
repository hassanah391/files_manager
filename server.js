// server.js
// Entry point for the Express server for the ALX Files Manager API
// - Loads all API routes from routes/index.js
// - Listens on the port specified by the PORT environment variable or defaults to 5000

const express = require('express');
const { router } = require('./routes/index');

const app = express(); // Create Express app instance
const port = process.env.PORT || 5000; // Set port

// Add middleware to parse JSON request bodies
app.use(express.json());

// Mount all API routes
app.use('/', router);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
