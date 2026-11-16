import crypto from 'crypto';
import { User } from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  sendAuthCookies,
  clearAuthCookies
} from '../utils/token.js';
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError
} from '../utils/errors.js';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../utils/email.js';
import { logger } from '../utils/logger.js';

// Format user response payload (strips sensitive fields)
const sanitizeUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    parentalConsent: user.parentalConsent?.accepted || false,
    createdAt: user.createdAt
  };
};

/**
 * @desc   Register parent account
 * @route  POST /api/v1/auth/register
 * @access Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, parentalConsent } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError('An account with this email address already exists.');
    }

    const passwordHash = await hashPassword(password);
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: 'parent',
      parentalConsent: {
        accepted: parentalConsent === true,
        acceptedAt: new Date(),
        ipAddress: clientIp
      }
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refreshToken hash or token
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    sendAuthCookies(res, accessToken, refreshToken);

    // Send welcome email asynchronously (non-blocking)
    sendWelcomeEmail(user).catch((err) =>
      logger.error(`Failed to send welcome email to ${user.email}: ${err.message}`)
    );

    res.status(201).json({
      status: 'success',
      message: 'Account registered successfully',
      data: {
        user: sanitizeUser(user),
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Login user
 * @route  POST /api/v1/auth/login
 * @access Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+passwordHash +refreshToken');
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('This account has been deactivated. Please contact support.');
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    sendAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({
      status: 'success',
      message: 'Logged in successfully',
      data: {
        user: sanitizeUser(user),
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Refresh access token using refreshToken cookie or payload
 * @route  POST /api/v1/auth/refresh
 * @access Public
 */
export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token missing');
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      clearAuthCookies(res);
      throw new UnauthorizedError('Refresh token expired or invalid. Please log in again.');
    }

    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || !user.isActive) {
      clearAuthCookies(res);
      throw new UnauthorizedError('User account not found or deactivated');
    }

    // Refresh token rotation
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    sendAuthCookies(res, newAccessToken, newRefreshToken);

    res.status(200).json({
      status: 'success',
      message: 'Token refreshed successfully',
      data: {
        user: sanitizeUser(user),
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Logout user & clear cookies
 * @route  POST /api/v1/auth/logout
 * @access Public / Authenticated
 */
export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (refreshToken) {
      try {
        const decoded = verifyRefreshToken(refreshToken);
        await User.findByIdAndUpdate(decoded.id, { $unset: { refreshToken: 1 } });
      } catch (err) {
        // Continue logout even if token expired
      }
    }

    clearAuthCookies(res);

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get current authenticated user
 * @route  GET /api/v1/auth/me
 * @access Protected
 */
export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
      data: {
        user: sanitizeUser(req.user)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Initiate forgot password flow
 * @route  POST /api/v1/auth/forgot-password
 * @access Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always respond with success to prevent email enumeration
    if (!user || !user.isActive) {
      return res.status(200).json({
        status: 'success',
        message: 'If an account exists with that email, a password reset link has been sent.'
      });
    }

    // Generate random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour validity
    await user.save({ validateBeforeSave: false });

    // Send reset email
    sendPasswordResetEmail(user, resetToken).catch((err) =>
      logger.error(`Failed to send password reset email to ${user.email}: ${err.message}`)
    );

    res.status(200).json({
      status: 'success',
      message: 'If an account exists with that email, a password reset link has been sent.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Reset password using token
 * @route  POST /api/v1/auth/reset-password
 * @access Public
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { token, email, password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      email,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() }
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      throw new BadRequestError('Invalid or expired password reset token.');
    }

    // Set new password
    user.passwordHash = await hashPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.refreshToken = undefined; // Force re-login on all devices
    await user.save();

    clearAuthCookies(res);

    res.status(200).json({
      status: 'success',
      message: 'Password has been reset successfully. Please log in with your new password.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update parent profile
 * @route  PATCH /api/v1/auth/update-profile
 * @access Protected
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (name) user.name = name;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user: sanitizeUser(user)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update password (when logged in)
 * @route  PATCH /api/v1/auth/update-password
 * @access Protected
 */
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+passwordHash');
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isMatch = await comparePassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new BadRequestError('Current password is incorrect');
    }

    user.passwordHash = await hashPassword(newPassword);
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

