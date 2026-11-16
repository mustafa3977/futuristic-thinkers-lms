import { Coupon } from '../models/index.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import { logActivity } from '../utils/auditLogger.js';

export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: { coupons }
    });
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (req, res, next) => {
  try {
    const { code, discountType, discountValue, maxUses, expiresAt } = req.body;
    const formattedCode = code.trim().toUpperCase();

    const existing = await Coupon.findOne({ code: formattedCode });
    if (existing) {
      throw new ConflictError('A coupon with this code already exists.');
    }

    const coupon = await Coupon.create({
      code: formattedCode,
      discountType,
      discountValue,
      maxUses: maxUses || 100,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isActive: true
    });

    await logActivity({
      adminId: req.user._id,
      action: 'COUPON_CREATED',
      targetType: 'Coupon',
      targetId: coupon._id,
      details: { code: coupon.code, discountValue: coupon.discountValue },
      req
    });

    res.status(201).json({
      status: 'success',
      message: 'Coupon code created successfully',
      data: { coupon }
    });
  } catch (error) {
    next(error);
  }
};

export const toggleCouponActive = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      throw new NotFoundError('Coupon not found');
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    await logActivity({
      adminId: req.user._id,
      action: 'COUPON_STATUS_TOGGLED',
      targetType: 'Coupon',
      targetId: coupon._id,
      details: { code: coupon.code, isActive: coupon.isActive },
      req
    });

    res.status(200).json({
      status: 'success',
      message: `Coupon is now ${coupon.isActive ? 'active' : 'inactive'}`,
      data: { coupon }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      throw new NotFoundError('Coupon not found');
    }

    await coupon.deleteOne();

    await logActivity({
      adminId: req.user._id,
      action: 'COUPON_DELETED',
      targetType: 'Coupon',
      targetId: req.params.id,
      details: { code: coupon.code },
      req
    });

    res.status(200).json({
      status: 'success',
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

