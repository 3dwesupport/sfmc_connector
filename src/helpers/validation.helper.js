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

  // Validate each member
  for (let i = 0; i < campaignMembers.length; i++) {
    const member = campaignMembers[i];
    if (!member.phone) {
      return `campaignMembers[${i}].phone is required`;
    }
    if (!member.campaignMemberId) {
      return `campaignMembers[${i}].campaignMemberId is required`;
    }
  }

  return null; // valid
}

module.exports = { validateRequest };
