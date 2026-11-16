import { ActivityLog } from '../models/ActivityLog.js';
import { logger } from './logger.js';

export const logActivity = async ({ adminId, action, targetType, targetId = null, details = {}, req = null }) => {
  try {
    const ipAddress = req
      ? req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1'
      : '127.0.0.1';

    await ActivityLog.create({
      adminId,
      action,
      targetType,
      targetId: targetId ? targetId.toString() : null,
      details,
      ipAddress
    });
  } catch (error) {
    logger.error(`Failed to record admin activity log: ${error.message}`);
  }
};

