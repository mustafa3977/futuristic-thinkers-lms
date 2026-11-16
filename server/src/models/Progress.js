import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChildProfile',
      required: [true, 'Child profile is required'],
      index: true
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
      index: true
    },
    completedLessons: [
      {
        lessonId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Lesson',
          required: true
        },
        completedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    percent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    passportStamps: [
      {
        lessonOrder: { type: Number, required: true },
        stampCode: { type: String, required: true },
        title: { type: String, required: true },
        earnedAt: { type: Date, default: Date.now }
      }
    ],
    badges: [
      {
        badgeId: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, default: '' },
        icon: { type: String, default: 'Award' },
        earnedAt: { type: Date, default: Date.now }
      }
    ],
    completedAt: {
      type: Date,
      default: null
    },
    certificateIssued: {
      type: Boolean,
      default: false
    },
    certificateCode: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

progressSchema.index({ childId: 1, courseId: 1 }, { unique: true });

export const Progress = mongoose.model('Progress', progressSchema);

