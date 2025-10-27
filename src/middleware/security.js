import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';

import { ENV } from '#config/env.js';

export const applySecurityMiddleware = app => {
  app.use(helmet());
  app.use(
    cors({
      origin: ENV.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(compression());
};
