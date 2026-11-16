import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Course slug is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    tagline: {
      type: String,
      default: "Inspiring Tomorrow's Innovators"
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required']
    },
    ageRange: {
      type: String,
      default: '7-10 years'
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: 300
    },
    fullDescription: {
      type: String,
      required: [true, 'Full description is required']
    },
    learningOutcomes: [
      {
        type: String,
        trim: true
      }
    ],
    whoIsItFor: {
      type: String,
      default: 'Curious children aged 7-10 who love asking "How does this work?", exploring technology, and solving real-world puzzles. No prior coding or computer science experience needed.'
    },
    howItWorks: {
      type: String,
      default: 'Self-paced, bite-sized lessons guided by animated story characters Zara, Zahran, and Luna. Each lesson features an engaging video, hands-on offline mission, detective challenge, and family conversation cards.'
    },
    whatChildSeesDoes: {
      type: String,
      default: 'Watch animated story adventures, identify AI in everyday life, complete printable detective missions, earn AI Passport stamps, collect achievement badges, and receive an official completion certificate.'
    },
    materialsIncluded: [
      {
        type: String,
        trim: true
      }
    ],
    thumbnail: {
      type: String,
      default: '/images/courses/ai-explorers-thumbnail.jpg'
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      default: 0
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true
    },
    duration: {
      type: String,
      default: '10 story-driven lessons (~30-45 mins each)'
    },
    deviceRequirements: {
      type: String,
      default: 'Any modern desktop, laptop, or tablet (iPad/Android) with an updated web browser and internet connection. Optional home printer for activity sheets.'
    },
    support: {
      type: String,
      default: 'Dedicated parent email support & printable parent discussion guides.'
    },
    accessPeriod: {
      type: String,
      default: '1 Year Full Access'
    },
    refundText: {
      type: String,
      default: '14-Day 100% Money-Back Guarantee. If your child is not captivated, email us for a full refund.'
    },
    seoTitle: {
      type: String,
      default: 'AI Explorers Academy (Ages 7-10) | Futuristic Thinkers'
    },
    seoDescription: {
      type: String,
      default: 'Inspire tomorrow\'s innovators with our flagship AI Explorers Academy. 10 story-driven, interactive lessons for kids aged 7 to 10.'
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

courseSchema.index({ status: 1, isFeatured: 1 });
courseSchema.index({ category: 1 });

export const Course = mongoose.model('Course', courseSchema);

