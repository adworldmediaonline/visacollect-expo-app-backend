import prisma from '#config/prisma.js';
import { logger } from '#config/logger.js';
import { ENV } from '#config/env.js';
import { getPayPalAccessToken, PAYPAL_API_BASE } from '#config/paypal.js';

/**
 * Create PayPal Order
 */
export const createPayPalOrder = async (req, res) => {
  try {
    const { amount, currency = 'USD', description } = req.body;

    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
          description: description || 'Visa Application Fee',
        }],
        application_context: {
          return_url: `${ENV.APP_URL}/payment/success`,
          cancel_url: `${ENV.APP_URL}/payment/cancel`,
        },
      }),
    });

    const order = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create PayPal order',
        error: order,
      });
    }

    // Save payment record
    const payment = await prisma.payment.create({
      data: {
        paypalOrderId: order.id,
        amount,
        currency,
        status: 'created',
        description,
      },
    });

    logger.info('PayPal order created', { orderId: order.id });

    res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        paymentId: payment.id,
        approvalUrl: order.links.find(link => link.rel === 'approve')?.href,
      },
    });
  } catch (error) {
    logger.error('Error creating PayPal order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: ENV.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Capture PayPal Payment
 */
export const capturePayPalPayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    const captureData = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        success: false,
        message: 'Failed to capture payment',
        error: captureData,
      });
    }

    // Update payment record
    await prisma.payment.updateMany({
      where: { paypalOrderId: orderId },
      data: {
        status: 'captured',
        paypalPayerId: captureData.payer?.payer_id,
        paypalPaymentId: captureData.purchase_units[0]?.payments?.captures[0]?.id,
      },
    });

    logger.info('Payment captured', { orderId });

    res.status(200).json({
      success: true,
      data: captureData,
    });
  } catch (error) {
    logger.error('Error capturing payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to capture payment',
      error: ENV.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Submit Visa Application
 */
export const submitVisaApplication = async (req, res) => {
  try {
    const applicationData = req.body;

    // Create visa application
    const application = await prisma.visaApplication.create({
      data: {
        // Step 1
        nationalityCode: applicationData.step1Data.nationality.cca2,
        nationalityName: applicationData.step1Data.nationality.name,
        nationalityFlag: applicationData.step1Data.nationality.flag,
        destinationCode: applicationData.step1Data.destination.cca2,
        destinationName: applicationData.step1Data.destination.name,
        destinationFlag: applicationData.step1Data.destination.flag,

        // Step 2
        visaType: applicationData.step2Data.selectedVisa,
        entryType: applicationData.step2Data.entryType,
        governmentFee: applicationData.governmentFee,
        visaValidity: applicationData.visaValidity,

        // Step 3
        firstName: applicationData.step3Data.firstName,
        lastName: applicationData.step3Data.lastName,
        dateOfBirth: applicationData.step3Data.dateOfBirth,
        countryOfBirthCode: applicationData.step3Data.countryOfBirth.cca2,
        countryOfBirthName: applicationData.step3Data.countryOfBirth.name,
        countryOfBirthFlag: applicationData.step3Data.countryOfBirth.flag,

        // Step 4
        passportNumber: applicationData.step4Data.passportNumber,
        passportIssueDate: applicationData.step4Data.passportIssueDate,
        passportExpiryDate: applicationData.step4Data.passportExpiryDate,
        residenceCountryCode: applicationData.step4Data.countryOfResidence.cca2,
        residenceCountryName: applicationData.step4Data.countryOfResidence.name,
        residenceCountryFlag: applicationData.step4Data.countryOfResidence.flag,
        employmentStatus: applicationData.step4Data.employmentStatus,
        ownsAssets: applicationData.step4Data.ownsAssetsInHomeCountry,
        travelHistory: applicationData.step4Data.travelledToOtherCountries,
        previousVisaApp: applicationData.step4Data.appliedForVisaBefore,

        // Passport Upload
        passportImageUrl: applicationData.passportUploadData?.passportImageUrl,
        passportImagePublicId: applicationData.passportUploadData?.passportImagePublicId,

        // Step 5
        travelers: applicationData.step5Data.travelers,

        // Payment
        paymentId: applicationData.paymentId,
        totalAmount: applicationData.totalAmount,
        currency: applicationData.currency || 'USD',
        paymentStatus: 'completed',
        status: 'submitted',
        submittedAt: new Date(),
      },
    });

    logger.info('Visa application submitted', { applicationId: application.id });

    res.status(201).json({
      success: true,
      data: {
        applicationId: application.id,
        status: application.status,
      },
    });
  } catch (error) {
    logger.error('Error submitting visa application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit visa application',
      error: ENV.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Get Application by ID
 */
export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await prisma.visaApplication.findUnique({
      where: { id },
      include: { payment: true },
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    logger.error('Error fetching application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application',
      error: ENV.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

