import express from 'express';

import { applySecurityMiddleware } from '#middleware/security.js';
import { requestLogger } from '#middleware/requestLogger.js';
import { apiRateLimiter } from '#utils/rateLimiter.js';
import { errorHandler } from '#middleware/errorHandler.js';
import todosRouter from '#routes/todos.routes.js';
import uploadRouter from '#routes/upload.routes.js';
import visaApplicationRouter from '#routes/visa-application.routes.js';

const app = express();

// Increase body parser limit for image uploads (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

applySecurityMiddleware(app);
app.use(requestLogger);
app.use(apiRateLimiter);
app.use('/api/v1/todos', todosRouter);
app.use('/api/v1/upload', uploadRouter);
app.use('/api/v1/visa-applications', visaApplicationRouter);

app.get('/', (req, res) => {
  res.send('Hello World');
});

// Payment success and cancel routes
app.get('/payment/success', (req, res) => {
  res.json({
    success: true,
    message: 'Payment successful. You will be redirected to the app.',
  });
});

app.get('/payment/cancel', (req, res) => {
  res.json({
    success: false,
    message: 'Payment cancelled.',
  });
});

app.use((req, res) => res.status(404).json({ message: 'Not found' }));
app.use(errorHandler);

export default app;
