import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';
import {
  getPublicCourses,
  getPublicCourseBySlug,
  getPublicCategories,
  getPublicArticles,
  getPublicArticleBySlug,
  getPublicFaqs,
  getPublicPageContent,
  submitContactMessage,
  getPublicSettings
} from '../../controllers/publicController.js';

const contactValidation = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Invalid email address'),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters')
});

const router = Router();

// Courses & Categories
router.get('/courses', getPublicCourses);
router.get('/courses/:slug', getPublicCourseBySlug);
router.get('/categories', getPublicCategories);

// Free Learning Hub (Blog)
router.get('/articles', getPublicArticles);
router.get('/articles/:slug', getPublicArticleBySlug);

// FAQ & Static Pages
router.get('/faqs', getPublicFaqs);
router.get('/pages/:slug', getPublicPageContent);

// Contact & Platform Info
router.post('/contact', validate(contactValidation), submitContactMessage);
router.get('/settings', getPublicSettings);

export default router;

