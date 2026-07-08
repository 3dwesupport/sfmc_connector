const pLimit = require('p-limit');
const config = require('../config/app.config');
const karixService = require('../services/karix.service');
const messageMapper = require('../models/message.model');
const { validateRequest } = require('../helpers/validation.helper');

/**
 * POST /api/send-messages
 *
 * Request body:
 * {
 *   "channel": "WABA",
 *   "templateId": "adobe_text",
 *   "senderFrom": "919152877509",
 *   "campaignMembers": [
 *     {
 *       "campaignMemberId": "a03Bh00000JHkfDIAT",
 *       "campaignMemberName" : "John",
 *       "phone": "919876543210",
 *       "templateParams": { "1": "John", "2": "ORDER123" }
 *     }
 *   ]
 * }
 */
async function sendMessages(req, res, next) {
    try {

          // Step 0: Normalize campaignMembers — each element may be a JSON string
    // instead of an object, so parse it here before validation.
    if (Array.isArray(req.body?.campaignMembers)) {
      req.body.campaignMembers = req.body.campaignMembers.map((member) => {
        if (typeof member === 'string') {
          try {
            return JSON.parse(member);
          } catch (e) {
            const err = new Error(`Invalid JSON in campaignMembers entry: ${member}`);
            err.statusCode = 400;
            throw err;
          }
        }
        return member; // already an object
      });
    }
    console.log(req.body);
        // Step 1: Validate incoming request
        const validationError = validateRequest(req.body);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        // Step 2: Map/normalize request body into clean model
        const normalized = messageMapper.normalize(req.body);
        const { channel, templateId, senderFrom, campaignMembers } = normalized;

        // Step 3: Limit parallel API calls (avoid hitting Karix rate limits)
        const limit = pLimit(config.concurrency);

        const tasks = campaignMembers.map((member) =>
            limit(() =>
                karixService.sendMessage({
                    channel,
                    templateId,
                    templateParams: member.templateParams,
                    phone: member.phone,
                    campaignMemberId: member.campaignMemberId,
                    campaignMemberName: member.campaignMemberName,
                    senderFrom})
            )
        );

        // Step 4: Run all tasks in parallel (with concurrency cap)
        const results = await Promise.all(tasks);

        // Step 5: Build summary
        const summary = {
            total: results.length,
            success: results.filter((r) => r.status === 'SUCCESS').length,
            failed: results.filter((r) => r.status === 'FAILED').length
        };

        console.log(`[sendMessages] Done — ${summary.success}/${summary.total} sent`);

        return res.status(200).json({ summary, results });

    } catch (err) {
        next(err); // passes to error middleware
    }
}

module.exports = { sendMessages };