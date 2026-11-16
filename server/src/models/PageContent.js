import mongoose from 'mongoose';

const pageContentSchema = new mongoose.Schema(
  {
    pageSlug: {
      type: String,
      required: [true, 'Page slug is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Page title is required'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Page content is required']
    },
    metaDescription: {
      type: String,
      default: ''
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);



export const PageContent = mongoose.model('PageContent', pageContentSchema);

