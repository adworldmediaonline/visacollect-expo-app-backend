import winston from 'winston';
import { ENV } from '#config/env.js';

const { combine, timestamp, printf, colorize } = winston.format;
const logFormat = printf(
  ({ level, message, timestamp }) => `[${timestamp}] ${level}: ${message}`
);

export const logger = winston.createLogger({
  level: ENV.LOG_LEVEL,
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), logFormat),
    }),
    new winston.transports.File({ filename: 'logs/app.log' }),
  ],
});

export default logger;
