import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true
    },
    answer: {
      type: String,
      required: [true, 'Answer is required']
    },
    category: {
      type: String,
      default: 'General',
      trim: true
    },
    order: {
      type: Number,
      default: 0
    },
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

faqSchema.index({ isPublished: 1, order: 1 });

export const FAQ = mongoose.model('FAQ', faqSchema);

