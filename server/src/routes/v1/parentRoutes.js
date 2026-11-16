import { Router } from 'express';
import { z } from 'zod';
import { protect } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import {
  getChildren,
  createChild,
  updateChild,
  deleteChild,
  verifyChildPin,
  getMyEnrollments,
  enrollFreeCourse,
  getLessonPlayerContent,
  completeLesson,
  getChildCourseProgress,
  getMyOrders,
  exportUserData,
  deleteAccount
} from '../../controllers/parentController.js';

const childSchema = z.object({
  nickname: z
    .string({ required_error: 'Nickname is required' })
    .trim()
    .min(1, 'Nickname cannot be empty')
    .max(30, 'Nickname cannot exceed 30 characters'),
  avatar: z.string().default('avatar-zara'),
  age: z
    .number({ required_error: 'Age is required' })
    .int()
    .min(7, 'Course is tailored for ages 7-10')
    .max(10, 'Course is tailored for ages 7-10'),
  pin: z.string().regex(/^\d{4}$/, 'PIN must be exactly 4 digits').optional().or(z.literal(''))
});

const lessonCompleteSchema = z.object({
  courseId: z.string().min(1),
  lessonId: z.string().min(1),
  childId: z.string().min(1)
});

const router = Router();

// Protect all parent routes
router.use(protect);

// 1. Child Profiles (Safe: nickname + avatar, ages 7-10 only)
router.get('/children', getChildren);
router.post('/children', validate(childSchema), createChild);
router.put('/children/:id', validate(childSchema.partial()), updateChild);
router.delete('/children/:id', deleteChild);
router.post('/children/:id/verify-pin', verifyChildPin);

// 2. Enrollments & Course Selection
router.get('/enrollments', getMyEnrollments);
router.post('/enroll-free', enrollFreeCourse);

// 3. Lesson Player & Learning Experience
router.get('/courses/:courseSlug/lessons/:order', getLessonPlayerContent);
router.post('/progress/complete-lesson', validate(lessonCompleteSchema), completeLesson);
router.get('/progress/:courseId/:childId', getChildCourseProgress);

// 4. Orders & Receipts
router.get('/orders', getMyOrders);

// 5. Data Privacy & GDPR/COPPA Rights
router.get('/export-data', exportUserData);
router.delete('/delete-account', deleteAccount);

export default router;

