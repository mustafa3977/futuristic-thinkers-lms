import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address'
      ]
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false // never return passwordHash in standard queries
    },
    role: {
      type: String,
      enum: ['parent', 'admin'],
      default: 'parent'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    parentalConsent: {
      accepted: {
        type: Boolean,
        default: false
      },
      acceptedAt: {
        type: Date
      },
      statement: {
        type: String,
        default: 'I confirm that I am a parent or legal guardian over 18 years of age and consent to my child accessing the learning platform.'
      },
      ipAddress: {
        type: String
      }
    },
    refreshToken: {
      type: String,
      select: false
    },
    resetPasswordToken: {
      type: String,
      select: false
    },
    resetPasswordExpires: {
      type: Date,
      select: false
    }
  },
  {
    timestamps: true
  }
);

userSchema.index({ role: 1 });

export const User = mongoose.model('User', userSchema);

