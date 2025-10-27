import { Resend } from 'resend';
import { ENV } from './env.js';
import { logger } from './logger.js';

let resendClient = null;

export const getResendClient = () => {
  if (!resendClient) {
    if (!ENV.RESEND_API_KEY) {
      logger.warn('Resend API key not configured. Emails will not be sent.');
      return null;
    }
    resendClient = new Resend(ENV.RESEND_API_KEY);
  }
  return resendClient;
};

export { ENV };

