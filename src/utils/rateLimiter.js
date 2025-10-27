import rateLimit from 'express-rate-limit';

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min window
  limit: 100, // max 100 requests per IP
  message: 'Too many requests, try again later.',
});
