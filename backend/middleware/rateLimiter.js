// Import Express Rate Limit.
const rateLimit = require("express-rate-limit");

// Limit repeated login attempts.
const loginLimiter = rateLimit({
  // 15-minute time window.
  windowMs: 15 * 60 * 1000,

  // Allow only 5 login attempts per IP.
  max: 5,

  // Return standard rate limit headers.
  standardHeaders: true,

  // Disable legacy rate limit headers.
  legacyHeaders: false,

  // Message returned when the limit is exceeded.
  message: "Too many login attempts. Please try again after 15 minutes.",
});

// Export the middleware.
module.exports = {
  loginLimiter,
};
