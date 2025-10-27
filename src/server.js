import app from './app.js';
import { ENV } from '#config/env.js';
import { logger } from '#config/logger.js';

const port = ENV.PORT || 3001;

app.listen(port, () => {
  logger.info(
    `🚀 Server running on port http://localhost:${ENV.PORT} (${ENV.NODE_ENV})`
  );
});
