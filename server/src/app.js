import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import {
  configureHelmet,
  configureCors,
  apiLimiter,
  configureDataSanitizers
} from './middleware/security.js';
import { errorHandler } from './middleware/errorHandler.js';
import { NotFoundError } from './utils/errors.js';
import v1Routes from './routes/v1/index.js';
import { config } from './config/env.js';

const app = express();

// Trust reverse proxy (e.g. Render, Railway, Nginx)
app.set('trust proxy', 1);

// Security Headers
app.use(configureHelmet());

// CORS Whitelist
app.use(configureCors());

// HTTP Request Logger
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsers
// NOTE: For Stripe Webhook in Phase 5, raw body is required, so standard json parser ignores /webhook
app.use((req, res, next) => {
  if (req.originalUrl === '/api/v1/payments/webhook') {
    next();
  } else {
    express.json({ limit: '10mb' })(req, res, next);
  }
});
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Sanitize inputs & prevent HTTP parameter pollution
configureDataSanitizers(app);

// Apply rate limiter to API routes
app.use('/api', apiLimiter);

// Mount API v1
app.use('/api/v1', v1Routes);

// Root greeting
app.get('/', (req, res) => {
  res.json({
    name: 'Futuristic Thinkers LMS API',
    tagline: "Inspiring Tomorrow's Innovators",
    version: '1.0.0',
    documentation: '/api/v1/health'
  });
});

// Handle unhandled 404 routes
app.all('*', (req, res, next) => {
  next(new NotFoundError(`Cannot find ${req.method} ${req.originalUrl} on this server`));
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;

