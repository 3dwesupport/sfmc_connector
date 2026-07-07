/**
 * Global error handler middleware.
 * Catches any error thrown with next(err) from controllers/services.
 */
function errorMiddleware(err, req, res, next) {
  console.error('[ERROR]', err.message || err);

  // Handle JSON parse errors from body-parser
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }

  return res.status(500).json({ error: 'Internal server error' });
}

module.exports = errorMiddleware;
