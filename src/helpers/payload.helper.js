const config = require('../config/app.config');

/**
 * Builds the exact JSON payload that Karix API expects.
 * Keeping this in a helper means if Karix changes their format,
 * you only update one place.
 *
 * @param {Object} params
 * @returns {Object} Karix API payload
 */
function buildKarixPayload({
                             channel,
                             templateId,
                             templateParams,
                             phone,
                             campaignMemberId,
                             campaignMemberName,
                             senderFrom,
                             name,
                           }) {
  return {
    message: {
      channel: channel || 'WABA',
      content: {
        preview_url: false,
        shorten_url: true,
        template: {
          parameterValues: templateParams || {},
          templateId
        },
        type: 'TEMPLATE'
      },
      preferences: {
        webHookDNId: '1001'
      },
      recipient: {
        recipient_type: 'individual',
        reference: {
          messageTag1: campaignMemberId,  // Salesforce ID for tracking
          messageTag2: campaignMemberName || undefined  // New: campaign member name, additive only
        },
        to: phone
      },
      sender: {
        from: senderFrom,
        name: senderFrom
      }
    },
    metaData: {
      originator: 'API',
      version: 'v1.0.9'
    },
    priority: 0
  };
}

module.exports = { buildKarixPayload };