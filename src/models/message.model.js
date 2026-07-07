const { normalizePhone } = require('../helpers/phone.helper');

/**
 * Normalizes the raw request body into a clean, consistent shape.
 * This is the single source of truth for what the data looks like internally.
 *
 * @param {Object} body - Raw request body from Express
 * @returns {Object} Normalized message request
 */
function normalize(body) {
  const {
    channel,
    templateId,
    senderFrom,
    webHookDNId,
    campaignMembers
  } = body;

  return {
    channel: channel,
    templateId,
    senderFrom: normalizePhone(senderFrom),   // Remove + and spaces
    webHookDNId: webHookDNId || null,
    campaignMembers: campaignMembers.map(normalizeMember)
  };
}

/**
 * Normalizes a single campaign member record
 */
function normalizeMember(member, index) {
  return {
    campaignMemberId: member.campaignMemberId,
    campaignMemberName: member.campaignMemberName || null,  // New: optional display name
    phone: normalizePhone(member.phone),      // Remove + and non-digits
    templateParams: member.templateParams || {},
  };
}

module.exports = { normalize };