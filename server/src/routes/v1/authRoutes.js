import { Router } from 'express';
import {
  register,
  login,
  refresh,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateProfile,
  updatePassword
} from '../../controllers/authController.js';
import { protect } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { authLimiter } from '../../middleware/security.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  updatePasswordSchema
} from '../../validators/authValidator.js';

const router = Router();

// Public routes with rate limiting and Zod validation
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.patch('/update-profile', protect, validate(updateProfileSchema), updateProfile);
router.patch('/update-password', protect, validate(updatePasswordSchema), updatePassword);

export default router;

