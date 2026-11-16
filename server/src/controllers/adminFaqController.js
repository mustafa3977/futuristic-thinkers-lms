import { FAQ } from '../models/index.js';
import { NotFoundError } from '../utils/errors.js';
import { logActivity } from '../utils/auditLogger.js';

export const getFaqs = async (req, res, next) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      status: 'success',
      data: { faqs }
    });
  } catch (error) {
    next(error);
  }
};

export const createFaq = async (req, res, next) => {
  try {
    const faq = await FAQ.create(req.body);

    await logActivity({
      adminId: req.user._id,
      action: 'FAQ_CREATED',
      targetType: 'FAQ',
      targetId: faq._id,
      details: { question: faq.question },
      req
    });

    res.status(201).json({
      status: 'success',
      message: 'FAQ item created successfully',
      data: { faq }
    });
  } catch (error) {
    next(error);
  }
};

export const updateFaq = async (req, res, next) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      throw new NotFoundError('FAQ item not found');
    }

    Object.assign(faq, req.body);
    await faq.save();

    await logActivity({
      adminId: req.user._id,
      action: 'FAQ_UPDATED',
      targetType: 'FAQ',
      targetId: faq._id,
      details: { question: faq.question },
      req
    });

    res.status(200).json({
      status: 'success',
      message: 'FAQ item updated successfully',
      data: { faq }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFaq = async (req, res, next) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      throw new NotFoundError('FAQ item not found');
    }

    await faq.deleteOne();

    await logActivity({
      adminId: req.user._id,
      action: 'FAQ_DELETED',
      targetType: 'FAQ',
      targetId: req.params.id,
      details: { question: faq.question },
      req
    });

    res.status(200).json({
      status: 'success',
      message: 'FAQ item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

