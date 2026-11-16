import mongoose from 'mongoose';

const childProfileSchema = new mongoose.Schema(
  {
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Parent ID is required'],
      index: true
    },
    nickname: {
      type: String,
      required: [true, 'Child nickname is required'],
      trim: true,
      maxlength: [30, 'Nickname cannot exceed 30 characters']
    },
    avatar: {
      type: String,
      default: 'avatar-zara',
      trim: true
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [7, 'Child age must be between 7 and 10'],
      max: [10, 'Child age must be between 7 and 10']
    },
    pinHash: {
      type: String,
      select: false,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

childProfileSchema.index({ parentId: 1, nickname: 1 });

export const ChildProfile = mongoose.model('ChildProfile', childProfileSchema);

