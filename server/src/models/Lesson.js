import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: [
      'notebook',         // AI Notebook Page
      'mission',          // AI Detective Mission
      'challenge',        // AI Around You Challenge
      'myth_buster',      // AI Myth Buster
      'hero_spotlight',   // AI Hero Spotlight
      'talk_cards',       // Family AI Talk Cards
      'worksheet',
      'other'
    ],
    default: 'notebook'
  },
  fileUrl: {
    type: String,
    required: true
  },
  downloadName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
});

const lessonSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course ID is required'],
      index: true
    },
    order: {
      type: Number,
      required: [true, 'Lesson order/number is required']
    },
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true
    },
    videoUrl: {
      type: String,
      default: '' // YouTube unlisted / Vimeo / Bunny embed URL
    },
    videoDuration: {
      type: String,
      default: '12:30'
    },
    content: {
      type: String,
      required: [true, 'Lesson narrative content is required']
    },
    characterFocus: [
      {
        type: String,
        enum: ['Zara (9)', 'Zahran (8)', 'Luna (9)', 'The Explorer Team']
      }
    ],
    materials: [materialSchema],
    isPreview: {
      type: Boolean,
      default: false
    },
    unlockRule: {
      type: String,
      enum: ['sequential', 'immediate'],
      default: 'sequential'
    },
    passportStamp: {
      stampCode: { type: String, default: 'STAMP_01' },
      title: { type: String, default: 'Explorer Badge' },
      icon: { type: String, default: 'Compass' }
    },
    milestoneBadge: {
      badgeId: { type: String, default: null },
      title: { type: String, default: null },
      description: { type: String, default: null },
      icon: { type: String, default: null }
    }
  },
  {
    timestamps: true
  }
);

lessonSchema.index({ courseId: 1, order: 1 }, { unique: true });

export const Lesson = mongoose.model('Lesson', lessonSchema);

