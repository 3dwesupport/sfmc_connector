const express = require('express');
const sendMessagesRoute = require('./routes/sendMessages.route');
const errorMiddleware = require('./middleware/error.middleware');
const authMiddleware = require('./middleware/auth.middleware');

const app = express();

// Body parser
app.use(express.json({ limit: '2mb' }));

// // Auth middleware — checks x-api-key header on all /api routes
// app.use('/api', authMiddleware);

// Routes
app.use('/api', sendMessagesRoute);

// Global error handler (must be last)
app.use(errorMiddleware);

module.exports = app;
