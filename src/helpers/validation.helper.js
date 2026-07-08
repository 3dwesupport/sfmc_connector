/**
 * Validates the incoming request body for /api/send-messages
 * Returns an error string if invalid, or null if valid.
 *
 * @param {Object} body - Raw request body
 * @returns {string|null} Error message or null
 */
function validateRequest(body) {
  if (!body) return 'Request body is required';

  const { channel, templateId, senderFrom, campaignMembers } = body;

  if (!channel)     return 'channel is required (e.g. "WABA")';
  if (!templateId)  return 'templateId is required (e.g. "adobe_text")';
  if (!senderFrom)  return 'senderFrom is required';

  if (!Array.isArray(campaignMembers) || campaignMembers.length === 0) {
    return 'campaignMembers must be a non-empty array';
  }
  return null; // valid
}

module.exports = { validateRequest };
