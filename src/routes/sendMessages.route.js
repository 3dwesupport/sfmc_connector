const express = require('express');
const router = express.Router();
const sendMessagesController = require('../controllers/sendMessages.controller');

/**
 * POST /api/send-messages
 * Sends bulk RCS/WABA messages to campaign members via Karix API
 */
router.post('/send-messages', sendMessagesController.sendMessages);

module.exports = router;
