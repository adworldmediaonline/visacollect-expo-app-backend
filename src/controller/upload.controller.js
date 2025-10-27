import cloudinary from '#config/cloudinary.js';
import { logger } from '#config/logger.js';
import { ENV } from '#config/env.js';

/**
 * Upload passport image to Cloudinary
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const uploadPassport = async (req, res) => {
  try {
    const { image } = req.body;

    // Validate that image data is provided
    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'Image data is required',
      });
    }

    // Upload to Cloudinary using upload_stream for better memory handling
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        image,
        {
          folder: 'visa-applications/passports',
          resource_type: 'image',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
          transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    logger.info('Passport image uploaded successfully', {
      publicId: result.public_id,
      url: result.secure_url,
    });

    // Return the uploaded image details
    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes,
        uploadedAt: result.created_at,
      },
    });
  } catch (error) {
    logger.error('Error uploading passport image:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to upload passport image',
      error: ENV.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Delete passport image from Cloudinary
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deletePassport = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required',
      });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    logger.info('Passport image deleted successfully', {
      publicId,
      result,
    });

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      data: result,
    });
  } catch (error) {
    logger.error('Error deleting passport image:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to delete passport image',
      error: ENV.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

