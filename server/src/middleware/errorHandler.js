import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../utils/errors.js';

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    error = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    error = new AppError(`A record with ${field} '${value}' already exists.`, 409);
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const formattedErrors = Object.values(err.errors).map((el) => ({
      field: el.path,
      message: el.message
    }));
    error = new AppError('Validation Error', 400, formattedErrors);
  }

  // Handle JWT Errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please authenticate again.', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError('Your token has expired. Please log in again.', 401);
  }

  const statusCode = error.statusCode || 500;
  const status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

  if (statusCode >= 500) {
    logger.error(`[Unhandled Error] ${err.message}`, {
      stack: err.stack,
      url: req.originalUrl,
      method: req.method
    });
  }

  res.status(statusCode).json({
    status,
    message: error.message || 'An unexpected error occurred',
    errors: error.errors || null,
    ...(config.env === 'development' && { stack: err.stack })
  });
};

