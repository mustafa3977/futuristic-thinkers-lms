import { Router } from 'express';
import { protect } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';
import { validate } from '../../middleware/validate.js';
import {
  getDashboardStats,
  getActivityLogs
} from '../../controllers/adminStatsController.js';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  toggleCoursePublish,
  deleteCourse
} from '../../controllers/adminCourseController.js';
import {
  getLessonsByCourse,
  createLesson,
  updateLesson,
  deleteLesson,
  reorderLessons
} from '../../controllers/adminLessonController.js';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../../controllers/adminCategoryController.js';
import {
  getUsers,
  getUserDetails,
  toggleUserStatus,
  changeUserRole,
  adminResetPassword,
  deleteUser
} from '../../controllers/adminUserController.js';
import {
  getEnrollments,
  manualEnroll,
  updateEnrollmentStatus,
  extendEnrollmentAccess,
  deleteEnrollment
} from '../../controllers/adminEnrollmentController.js';
import {
  getOrders,
  getOrderDetails,
  markOrderRefunded
} from '../../controllers/adminOrderController.js';
import {
  getCoupons,
  createCoupon,
  toggleCouponActive,
  deleteCoupon
} from '../../controllers/adminCouponController.js';
import {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle
} from '../../controllers/adminArticleController.js';
import {
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq
} from '../../controllers/adminFaqController.js';
import {
  getPages,
  getPageBySlug,
  updatePage
} from '../../controllers/adminPageController.js';
import {
  getContactMessages,
  markMessageAsRead,
  replyToContactMessage,
  deleteContactMessage
} from '../../controllers/adminContactController.js';
import {
  getSettings,
  updateSettings
} from '../../controllers/adminSettingController.js';
import {
  courseSchema,
  lessonSchema,
  categorySchema,
  couponSchema,
  articleSchema,
  faqSchema,
  manualEnrollSchema
} from '../../validators/adminValidator.js';

const router = Router();

// Protect all admin routes: role=admin only
router.use(protect, authorize('admin'));

// 1. Dashboard Stats & Activity
router.get('/stats', getDashboardStats);
router.get('/activity-logs', getActivityLogs);

// 2. Courses CRUD
router.get('/courses', getCourses);
router.post('/courses', validate(courseSchema), createCourse);
router.get('/courses/:id', getCourseById);
router.put('/courses/:id', validate(courseSchema.partial()), updateCourse);
router.patch('/courses/:id/publish', toggleCoursePublish);
router.delete('/courses/:id', deleteCourse);

// 3. Curriculum & Lessons CRUD
router.get('/courses/:courseId/lessons', getLessonsByCourse);
router.post('/courses/:courseId/lessons', validate(lessonSchema), createLesson);
router.put('/lessons/:id', validate(lessonSchema.partial()), updateLesson);
router.delete('/lessons/:id', deleteLesson);
router.patch('/courses/:courseId/lessons/reorder', reorderLessons);

// 4. Categories CRUD
router.get('/categories', getCategories);
router.post('/categories', validate(categorySchema), createCategory);
router.put('/categories/:id', validate(categorySchema.partial()), updateCategory);
router.delete('/categories/:id', deleteCategory);

// 5. Users Management
router.get('/users', getUsers);
router.get('/users/:id', getUserDetails);
router.patch('/users/:id/status', toggleUserStatus);
router.patch('/users/:id/role', changeUserRole);
router.post('/users/:id/reset-password', adminResetPassword);
router.delete('/users/:id', deleteUser);

// 6. Enrollments Management
router.get('/enrollments', getEnrollments);
router.post('/enrollments/manual', validate(manualEnrollSchema), manualEnroll);
router.patch('/enrollments/:id/status', updateEnrollmentStatus);
router.patch('/enrollments/:id/extend', extendEnrollmentAccess);
router.delete('/enrollments/:id', deleteEnrollment);

// 7. Orders & Payments
router.get('/orders', getOrders);
router.get('/orders/:id', getOrderDetails);
router.patch('/orders/:id/refund', markOrderRefunded);

// 8. Coupons CRUD
router.get('/coupons', getCoupons);
router.post('/coupons', validate(couponSchema), createCoupon);
router.patch('/coupons/:id/toggle', toggleCouponActive);
router.delete('/coupons/:id', deleteCoupon);

// 9. Blog Articles CRUD
router.get('/articles', getArticles);
router.post('/articles', validate(articleSchema), createArticle);
router.put('/articles/:id', validate(articleSchema.partial()), updateArticle);
router.delete('/articles/:id', deleteArticle);

// 10. FAQs CRUD
router.get('/faqs', getFaqs);
router.post('/faqs', validate(faqSchema), createFaq);
router.put('/faqs/:id', validate(faqSchema.partial()), updateFaq);
router.delete('/faqs/:id', deleteFaq);

// 11. Pages Content CRUD
router.get('/pages', getPages);
router.get('/pages/:slug', getPageBySlug);
router.put('/pages/:slug', updatePage);

// 12. Contact Messages
router.get('/contact-messages', getContactMessages);
router.patch('/contact-messages/:id/read', markMessageAsRead);
router.patch('/contact-messages/:id/reply', replyToContactMessage);
router.delete('/contact-messages/:id', deleteContactMessage);

// 13. Platform Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

export default router;

