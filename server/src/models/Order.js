import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Parent ID is required'],
      index: true
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course ID is required'],
      index: true
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true
    },
    stripeSessionId: {
      type: String,
      index: true
    },
    stripePaymentIntentId: {
      type: String,
      index: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'refunded', 'failed'],
      default: 'pending'
    },
    customerDetails: {
      name: String,
      email: String,
      country: {
        type: String,
        enum: ['US', 'CA', 'GB', 'AU', 'OTHER'],
        default: 'US'
      }
    },
    couponCode: {
      type: String,
      default: null
    },
    discountAmount: {
      type: Number,
      default: 0
    },
    refundReason: {
      type: String,
      default: null
    },
    refundedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

orderSchema.index({ status: 1, createdAt: -1 });

export const Order = mongoose.model('Order', orderSchema);

