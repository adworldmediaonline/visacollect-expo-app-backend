import cloudinary from 'cloudinary';
import { ENV } from './env.js';
import { logger } from './logger.js';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

// Verify configuration
if (ENV.CLOUDINARY_CLOUD_NAME && ENV.CLOUDINARY_API_KEY && ENV.CLOUDINARY_API_SECRET) {
  logger.info('Cloudinary configured successfully');
} else {
  logger.warn('Cloudinary credentials not fully configured');
}

export default cloudinary.v2;

