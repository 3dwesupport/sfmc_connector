/**
 * Strips all non-digit characters from a phone number.
 * "+91 98765-43210" → "919876543210"
 *
 * @param {string} phone
 * @returns {string}
 */
function normalizePhone(phone) {
  return String(phone).replace(/[^\d]/g, '');
}

/**
 * Checks if a phone number looks valid (10-15 digits)
 *
 * @param {string} phone
 * @returns {boolean}
 */
function isValidPhone(phone) {
  const normalized = normalizePhone(phone);
  return normalized.length >= 10 && normalized.length <= 15;
}

module.exports = { normalizePhone, isValidPhone };
