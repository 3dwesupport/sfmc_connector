const axios = require('axios');
const config = require('../config/app.config');
const { buildKarixPayload } = require('../helpers/payload.helper');

/**
 * Sends a single message to one recipient via Karix API.
 *
 * @param {Object} params
 * @param {string} params.channel           e.g. "WABA"
 * @param {string} params.templateId        Karix template ID e.g. "adobe_text"
 * @param {Object} params.templateParams    Template placeholder values
 * @param {string} params.phone             Recipient phone (digits only, no +)
 * @param {string} params.campaignMemberId  Salesforce Campaign Member ID
 * @param {string} params.senderFrom        Karix sender number
 * @returns {Promise<Object>} Result object with status, messageId, etc.
 */
async function sendMessage(params) {
  const { phone, campaignMemberId, campaignMemberName } = params;

  if (!phone) {
    console.error(`[karixService] SKIPPED for ${campaignMemberName} (member: ${campaignMemberId}) — phone is missing`);

    return {
      campaignMemberId,
      campaignMemberName,
      status: 'FAILED',
      httpStatus: null,
      error: 'phone is required'
    };
  }

  // Build the Karix payload using helper
  const payload = buildKarixPayload(params);

  try {
    console.log(`[karixService] Sending to ${campaignMemberName} (member: ${campaignMemberId})`);

    const response = await axios.post(config.karix.apiUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authentication: `Bearer ${config.karix.authToken}`
      },
      timeout: config.karix.requestTimeoutMs
    });

    console.log(`[karixService] SUCCESS for campaignId : ${campaignMemberId} and Name : ${campaignMemberName} — HTTP ${response.status}`);

    return {
      campaignMemberId,
      campaignMemberName,
      phone,
      status: 'SUCCESS',
      httpStatus: response.status,
      messageId: extractMessageId(response.data),
      karixApiResponse: response.data
    };

  } catch (err) {
    console.error(`[karixService] FAILED for ${campaignMemberName} — ${err.message}`);

    return {
      campaignMemberId,
      campaignMemberName,
      phone,
      status: 'FAILED',
      httpStatus: (err.response && err.response.status) || null,
      error: (err.response && err.response.data) || err.message
    };
  }
}

/**
 * Extracts messageId from Karix response (handles different response shapes)
 */
function extractMessageId(data) {
  if (!data) return null;
  return data.messageId || (data.data && data.data.messageId) || null;
}

module.exports = { sendMessage };