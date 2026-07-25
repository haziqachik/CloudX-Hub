// Import Express Rate Limit.
const rateLimit = require("express-rate-limit");

// Limit repeated login attempts.
const loginLimiter = rateLimit({
  // 15-minute time window.
  windowMs: 15 * 60 * 1000,

  // Allow a maximum of 5 requests per IP.
  max: 5,

  // Return rate limit information in the response headers.
  standardHeaders: true,

  // Disable the legacy X-RateLimit-* headers.
  legacyHeaders: false,

  // Message returned when the limit is exceeded.
  message: "Too many login attempts. Please try again after 15 minutes.",
});

// Export the middleware.
module.exports = {
  loginLimiter,
};
