require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  concurrency: parseInt(process.env.CONCURRENCY || '5', 10),
  middlewareApiKey: process.env.MIDDLEWARE_API_KEY || null,

  karix: {
    apiUrl: process.env.KARIX_API_URL,
    authToken: process.env.KARIX_AUTH_TOKEN,
    requestTimeoutMs: parseInt(process.env.KARIX_TIMEOUT_MS || '10000', 10)
  }
};
