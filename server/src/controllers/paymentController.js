import Stripe from 'stripe';
import {
  Course,
  Coupon,
  Order,
  Enrollment,
  Progress,
  User,
  ChildProfile
} from '../models/index.js';
import { config } from '../config/env.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

let stripe = null;
if (config.stripe.secretKey && !config.stripe.secretKey.includes('placeholder')) {
  stripe = new Stripe(config.stripe.secretKey);
}

/**
 * @desc   Create Stripe Checkout Session (or simulated test session)
 * @route  POST /api/v1/payments/create-checkout-session
 * @access Protected
 */
export const createCheckoutSession = async (req, res, next) => {
  try {
    const { courseId, childId, couponCode, country = 'US' } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    let finalAmount = course.price;
    let appliedCoupon = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.trim().toUpperCase(),
        isActive: true
      });

      if (coupon) {
        if (!coupon.expiresAt || new Date(coupon.expiresAt) > new Date()) {
          if (coupon.usedCount < coupon.maxUses) {
            appliedCoupon = coupon;
            if (coupon.discountType === 'percentage') {
              finalAmount = Math.max(0, finalAmount * (1 - coupon.discountValue / 100));
            } else {
              finalAmount = Math.max(0, finalAmount - coupon.discountValue);
            }
          }
        }
      }
    }

    // Check if Stripe is configured for live/test checkout
    if (stripe) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: req.user.email,
        line_items: [
          {
            price_data: {
              currency: course.currency.toLowerCase(),
              product_data: {
                name: course.title,
                description: course.shortDescription,
                images: [
                  course.thumbnail?.startsWith('http')
                    ? course.thumbnail
                    : `${config.clientUrl}/images/courses/ai-explorers-thumbnail.jpg`
                ]
              },
              unit_amount: Math.round(finalAmount * 100) // cents
            },
            quantity: 1
          }
        ],
        metadata: {
          courseId: course._id.toString(),
          parentId: req.user._id.toString(),
          childId: childId ? childId.toString() : '',
          couponCode: appliedCoupon ? appliedCoupon.code : '',
          country
        },
        success_url: `${config.clientUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.clientUrl}/courses/${course.slug}?canceled=true`
      });

      return res.status(200).json({
        status: 'success',
        data: {
          sessionId: session.id,
          url: session.url,
          mode: 'stripe'
        }
      });
    }

    // Seamless Dev / Test-Mode Fallback:
    // When Stripe live credentials are not provided, generates simulated session ID
    // and returns test completion URL so development and verification flows complete cleanly!
    const mockSessionId = `test_session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Create pending order
    const order = await Order.create({
      parentId: req.user._id,
      courseId: course._id,
      amount: finalAmount,
      currency: course.currency,
      stripeSessionId: mockSessionId,
      status: 'pending',
      customerDetails: {
        name: req.user.name,
        email: req.user.email,
        country
      },
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      discountAmount: course.price - finalAmount
    });

    res.status(200).json({
      status: 'success',
      data: {
        sessionId: mockSessionId,
        orderId: order._id,
        amount: finalAmount,
        currency: course.currency,
        url: `${config.clientUrl}/payment/success?session_id=${mockSessionId}&test_mode=true`,
        mode: 'test_simulation'
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Confirm simulated test payment (for test mode)
 * @route  POST /api/v1/payments/confirm-test-payment
 * @access Protected
 */
export const confirmTestPayment = async (req, res, next) => {
  try {
    const { sessionId } = req.body;

    const order = await Order.findOne({ stripeSessionId: sessionId });
    if (!order) {
      throw new NotFoundError('Session order not found');
    }

    if (order.status !== 'completed') {
      order.status = 'completed';
      await order.save();

      // Check access period
      const course = await Course.findById(order.courseId);
      const accessExpiresAt = new Date();
      accessExpiresAt.setFullYear(accessExpiresAt.getFullYear() + 1);

      // Create enrollment
      let assignedChildId = null;
      const child = await ChildProfile.findOne({ parentId: order.parentId, isActive: true });
      if (child) assignedChildId = child._id;

      await Enrollment.findOneAndUpdate(
        { parentId: order.parentId, courseId: order.courseId },
        {
          $set: {
            parentId: order.parentId,
            childId: assignedChildId,
            courseId: order.courseId,
            orderId: order._id,
            status: 'active',
            accessExpiresAt,
            source: 'stripe',
            enrolledAt: new Date()
          }
        },
        { upsert: true, new: true }
      );

      // Initialize progress
      if (assignedChildId) {
        await Progress.findOneAndUpdate(
          { childId: assignedChildId, courseId: order.courseId },
          { $setOnInsert: { percent: 0, completedLessons: [], passportStamps: [], badges: [] } },
          { upsert: true }
        );
      }

      // Increment coupon usage
      if (order.couponCode) {
        await Coupon.findOneAndUpdate(
          { code: order.couponCode },
          { $inc: { usedCount: 1 } }
        );
      }
    }

    res.status(200).json({
      status: 'success',
      message: 'Payment confirmed and enrollment activated!',
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Handle Stripe Webhook
 * @route  POST /api/v1/payments/webhook
 * @access Public (Stripe Signature Verified)
 */
export const handleWebhook = async (req, res, next) => {
  try {
    let event;

    if (stripe && config.stripe.webhookSecret && !config.stripe.webhookSecret.includes('placeholder')) {
      const sig = req.headers['stripe-signature'];
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, config.stripe.webhookSecret);
      } catch (err) {
        logger.error(`Stripe Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    } else {
      // In dev fallback, parse json
      event = req.body;
    }

    if (event?.type === 'checkout.session.completed') {
      const session = event.data.object;
      const metadata = session.metadata || {};

      const courseId = metadata.courseId;
      const parentId = metadata.parentId;
      const childId = metadata.childId || null;

      if (courseId && parentId) {
        // Create or update Order
        const order = await Order.findOneAndUpdate(
          { stripeSessionId: session.id },
          {
            $set: {
              parentId,
              courseId,
              amount: session.amount_total ? session.amount_total / 100 : 0,
              currency: (session.currency || 'USD').toUpperCase(),
              stripePaymentIntentId: session.payment_intent || '',
              status: 'completed',
              couponCode: metadata.couponCode || null
            }
          },
          { upsert: true, new: true }
        );

        // Calculate 1 year access
        const accessExpiresAt = new Date();
        accessExpiresAt.setFullYear(accessExpiresAt.getFullYear() + 1);

        // Create Enrollment
        await Enrollment.findOneAndUpdate(
          { parentId, courseId },
          {
            $set: {
              parentId,
              childId: childId || null,
              courseId,
              orderId: order._id,
              status: 'active',
              accessExpiresAt,
              source: 'stripe',
              enrolledAt: new Date()
            }
          },
          { upsert: true }
        );

        // Initialize progress for child
        if (childId) {
          await Progress.findOneAndUpdate(
            { childId, courseId },
            { $setOnInsert: { percent: 0, completedLessons: [], passportStamps: [], badges: [] } },
            { upsert: true }
          );
        }

        // Increment coupon count if applied
        if (metadata.couponCode) {
          await Coupon.findOneAndUpdate(
            { code: metadata.couponCode },
            { $inc: { usedCount: 1 } }
          );
        }

        logger.info(`Stripe webhook confirmed enrollment for parent: ${parentId} in course: ${courseId}`);
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    logger.error(`Stripe Webhook handler error: ${error.message}`);
    next(error);
  }
};

