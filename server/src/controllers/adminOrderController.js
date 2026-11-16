import { Order, Enrollment } from '../models/index.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import { logActivity } from '../utils/auditLogger.js';

export const getOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [orders, total, totalRevenue] = await Promise.all([
      Order.find(filter)
        .populate('parentId', 'name email')
        .populate('courseId', 'title slug price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Order.countDocuments(filter),
      Order.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, sum: { $sum: '$amount' } } }
      ])
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        orders,
        metrics: {
          totalRevenue: totalRevenue[0]?.sum || 0
        },
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

export const getOrderDetails = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('parentId', 'name email createdAt')
      .populate('courseId', 'title slug price currency');

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    res.status(200).json({
      status: 'success',
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

export const markOrderRefunded = async (req, res, next) => {
  try {
    const { refundReason = 'Customer request under 14-day policy' } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    if (order.status === 'refunded') {
      throw new BadRequestError('This order is already marked as refunded.');
    }

    order.status = 'refunded';
    order.refundReason = refundReason;
    order.refundedAt = new Date();
    await order.save();

    // Revoke associated enrollment
    await Enrollment.updateMany(
      { parentId: order.parentId, courseId: order.courseId },
      { $set: { status: 'revoked' } }
    );

    await logActivity({
      adminId: req.user._id,
      action: 'ORDER_MARKED_REFUNDED',
      targetType: 'Order',
      targetId: order._id,
      details: {
        amount: order.amount,
        currency: order.currency,
        reason: refundReason
      },
      req
    });

    res.status(200).json({
      status: 'success',
      message: 'Order marked as refunded and associated course enrollment revoked.',
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

