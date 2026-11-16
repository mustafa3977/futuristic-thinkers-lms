import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import { config } from '../config/env.js';

// Helmet Security Headers
export const configureHelmet = () => {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://js.stripe.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
        connectSrc: ["'self'", config.clientUrl, 'https://api.stripe.com'],
        frameSrc: [
          "'self'",
          'https://js.stripe.com',
          'https://www.youtube.com',
          'https://www.youtube-nocookie.com',
          'https://player.vimeo.com',
          'https://iframe.mediadelivery.net' // Bunny Stream
        ],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: config.env === 'production' ? [] : null
      }
    },
    crossOriginEmbedderPolicy: false
  });
};

// CORS configuration
export const configureCors = () => {
  const allowedOrigins = [
    config.clientUrl,
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ].filter(Boolean);

  return cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);

      // In production, strictly allow process.env.CLIENT_URL
      if (config.env === 'production') {
        const normalizedOrigin = origin.replace(/\/$/, '');
        const normalizedClient = (config.clientUrl || '').replace(/\/$/, '');
        if (normalizedClient && normalizedOrigin === normalizedClient) {
          return callback(null, true);
        }
        return callback(new Error(`CORS blocked for origin: ${origin}`));
      }

      // In development, allow local dev servers
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS policy'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  });
};

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many requests from this IP address, please try again in 15 minutes'
  }
});

// Stricter rate limiter for sensitive authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 auth attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  }
});

// Sanitization & Pollution Protection
export const configureDataSanitizers = (app) => {
  // Prevent NoSQL query injection
  app.use(mongoSanitize());
  // Prevent HTTP Parameter Pollution
  app.use(hpp());
};

