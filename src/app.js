import express from 'express';

import { applySecurityMiddleware } from '#middleware/security.js';
import { requestLogger } from '#middleware/requestLogger.js';
import { apiRateLimiter } from '#utils/rateLimiter.js';
import { errorHandler } from '#middleware/errorHandler.js';
import todosRouter from '#routes/todos.routes.js';

const app = express();

app.use(express.json());

applySecurityMiddleware(app);
app.use(requestLogger);
app.use(apiRateLimiter);
app.use('/api/v1/todos', todosRouter);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use((req, res) => res.status(404).json({ message: 'Not found' }));
app.use(errorHandler);

export default app;
