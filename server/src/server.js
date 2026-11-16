import app from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';

let server;

const startServer = async () => {
  try {
    // 1. Connect Database
    await connectDB();

    // 2. Start Listening
    server = app.listen(config.port, () => {
      logger.info(`====================================================`);
      logger.info(`🚀 Futuristic Thinkers LMS Server is running`);
      logger.info(`🌐 Environment: ${config.env}`);
      logger.info(`📡 Port: ${config.port}`);
      logger.info(`🔗 API Health: http://localhost:${config.port}/api/v1/health`);
      logger.info(`====================================================`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

// Handle unhandled Promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`UNHANDLED REJECTION! Shutting down... ${err.name}: ${err.message}`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`UNCAUGHT EXCEPTION! Shutting down... ${err.name}: ${err.message}`);
  process.exit(1);
});

// Handle graceful termination
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM received. Shutting down gracefully.');
  if (server) {
    server.close(() => {
      logger.info('💥 Process terminated.');
    });
  }
});

