import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
  {
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Parent ID is required'],
      index: true
    },
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChildProfile',
      default: null,
      index: true
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course ID is required'],
      index: true
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'revoked'],
      default: 'active'
    },
    accessExpiresAt: {
      type: Date,
      required: true
    },
    source: {
      type: String,
      enum: ['stripe', 'manual', 'free'],
      default: 'stripe'
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

enrollmentSchema.index({ parentId: 1, courseId: 1, childId: 1 });
enrollmentSchema.index({ status: 1, accessExpiresAt: 1 });

export const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

