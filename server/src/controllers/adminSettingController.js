import { Setting } from '../models/index.js';
import { logActivity } from '../utils/auditLogger.js';

export const getSettings = async (req, res, next) => {
  try {
    const settings = await Setting.find().sort({ group: 1, key: 1 });

    const settingsMap = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    res.status(200).json({
      status: 'success',
      data: {
        settings,
        settingsMap
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const { settings } = req.body; // Key-value object, e.g. { site_name: '...', support_email: '...' }

    const updates = Object.entries(settings).map(([key, value]) => {
      return Setting.findOneAndUpdate(
        { key },
        { $set: { value } },
        { upsert: true, new: true }
      );
    });

    await Promise.all(updates);

    await logActivity({
      adminId: req.user._id,
      action: 'SETTINGS_UPDATED',
      targetType: 'Setting',
      details: { updatedKeys: Object.keys(settings) },
      req
    });

    res.status(200).json({
      status: 'success',
      message: 'Platform settings updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

