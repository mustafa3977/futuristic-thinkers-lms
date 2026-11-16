import { ContactMessage } from '../models/index.js';
import { NotFoundError } from '../utils/errors.js';
import { logActivity } from '../utils/auditLogger.js';

export const getContactMessages = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [messages, total, unreadCount] = await Promise.all([
      ContactMessage.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      ContactMessage.countDocuments(filter),
      ContactMessage.countDocuments({ status: 'unread' })
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        messages,
        unreadCount,
        pagination: {
          total,
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          pages: Math.ceil(total / parseInt(limit, 10))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const markMessageAsRead = async (req, res, next) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      throw new NotFoundError('Contact message not found');
    }

    if (message.status === 'unread') {
      message.status = 'read';
      await message.save();
    }

    res.status(200).json({
      status: 'success',
      data: { message }
    });
  } catch (error) {
    next(error);
  }
};

export const replyToContactMessage = async (req, res, next) => {
  try {
    const { replyNotes } = req.body;
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      throw new NotFoundError('Contact message not found');
    }

    message.status = 'replied';
    message.repliedAt = new Date();
    message.replyNotes = replyNotes || 'Replied via email';
    await message.save();

    await logActivity({
      adminId: req.user._id,
      action: 'CONTACT_MESSAGE_REPLIED',
      targetType: 'ContactMessage',
      targetId: message._id,
      details: { email: message.email, subject: message.subject },
      req
    });

    res.status(200).json({
      status: 'success',
      message: 'Message marked as replied',
      data: { message }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactMessage = async (req, res, next) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      throw new NotFoundError('Contact message not found');
    }

    await message.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Contact message deleted'
    });
  } catch (error) {
    next(error);
  }
};

