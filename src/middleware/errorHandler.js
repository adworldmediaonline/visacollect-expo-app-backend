import { logger } from '#config/logger.js';

export const errorHandler = (err, req, res) => {
  logger.error(`${err.message} - ${req.method} ${req.url}`);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};
