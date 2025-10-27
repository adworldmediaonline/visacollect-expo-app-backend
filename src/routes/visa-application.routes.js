import express from 'express';
import {
  createPayPalOrder,
  capturePayPalPayment,
  submitVisaApplication,
  getApplicationById,
} from '#controllers/visa-application.controller.js';

const visaApplicationRouter = express.Router();

// Payment routes
visaApplicationRouter.post('/payment/create-order', createPayPalOrder);
visaApplicationRouter.post('/payment/capture/:orderId', capturePayPalPayment);

// Application routes
visaApplicationRouter.post('/submit', submitVisaApplication);
visaApplicationRouter.get('/:id', getApplicationById);

export default visaApplicationRouter;

