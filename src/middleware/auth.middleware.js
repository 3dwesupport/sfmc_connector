const config = require('../config/app.config');

/**
 * Auth middleware — checks x-api-key header.
 * Only active if MIDDLEWARE_API_KEY is set in .env
 * This protects your middleware so only Salesforce (with the key) can call it.
 */
function authMiddleware(req, res, next) {
  // If no key configured, skip auth (dev mode)
  if (!config.middlewareApiKey) {
    return next();
  }

  const providedKey = req.header('x-api-key');

  if (!providedKey) {
    return res.status(401).json({ error: 'Missing x-api-key header' });
  }

  if (providedKey !== config.middlewareApiKey) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  next();
}

module.exports = authMiddleware;
