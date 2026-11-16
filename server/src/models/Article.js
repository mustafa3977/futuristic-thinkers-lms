import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      maxlength: 300
    },
    content: {
      type: String,
      required: [true, 'Content is required']
    },
    coverImage: {
      type: String,
      default: '/images/blog/default-hub-cover.jpg'
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    },
    publishedAt: {
      type: Date,
      default: null
    },
    seoTitle: {
      type: String,
      default: ''
    },
    seoDescription: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

articleSchema.index({ status: 1, publishedAt: -1 });

export const Article = mongoose.model('Article', articleSchema);

