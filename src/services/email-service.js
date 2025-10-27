import { getResendClient } from '#config/resend.js';
import { ENV } from '#config/env.js';
import { logger } from '#config/logger.js';

/**
 * Send application confirmation email
 */
export const sendApplicationConfirmationEmail = async ({
  email,
  applicationId,
  firstName,
  lastName,
  destination,
  visaType,
  totalAmount,
  paymentMethod,
}) => {
  try {
    const resend = getResendClient();

    if (!resend) {
      logger.warn('Resend client not available, skipping email');
      return { success: false, message: 'Email service not configured' };
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: #1a73e8;
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border: 1px solid #ddd;
              border-radius: 0 0 8px 8px;
            }
            .success-icon {
              width: 60px;
              height: 60px;
              background: #34c759;
              border-radius: 50%;
              display: inline-block;
              text-align: center;
              line-height: 60px;
              font-size: 30px;
              color: white;
              margin-bottom: 20px;
            }
            .order-details {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #eee;
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .detail-label {
              font-weight: 600;
              color: #666;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Application Submitted Successfully!</h1>
          </div>

          <div class="content">
            <div style="text-align: center;">
              <div class="success-icon">✓</div>
            </div>

            <p>Dear ${firstName} ${lastName},</p>

            <p>Thank you for submitting your visa application. Your application has been received and is now being processed.</p>

            <div class="order-details">
              <h2 style="margin-top: 0;">Order Details</h2>

              <div class="detail-row">
                <span class="detail-label">Application ID:</span>
                <span>${applicationId}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Destination:</span>
                <span>${destination}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Visa Type:</span>
                <span>${visaType}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Payment Method:</span>
                <span>${paymentMethod}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Total Amount:</span>
                <span style="font-size: 18px; font-weight: bold; color: #1a73e8;">$${totalAmount}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span style="color: #34c759;">✓ Paid & Submitted</span>
              </div>
            </div>

            <p>You will receive further updates about your application via email. Please keep this Application ID for your records.</p>

            <div class="footer">
              <p>Best regards,<br>The VisaCollect Team</p>
              <p style="font-size: 12px; color: #999;">This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: ENV.RESEND_FROM_EMAIL,
      to: [email],
      subject: 'Visa Application Submitted Successfully',
      html,
    });

    if (error) {
      logger.error('Failed to send confirmation email:', error);
      return { success: false, error };
    }

    logger.info('Confirmation email sent successfully', { email, applicationId });
    return { success: true, data };

  } catch (error) {
    logger.error('Error sending confirmation email:', error);
    return { success: false, error: error.message };
  }
};

