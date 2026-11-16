import {
  Course,
  Lesson,
  Category,
  Article,
  FAQ,
  PageContent,
  ContactMessage,
  Setting
} from '../models/index.js';
import { NotFoundError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export const getPublicCourses = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = { status: 'published' };

    if (category) {
      const cat = await Category.findOne({ slug: category, isActive: true });
      if (cat) filter.category = cat._id;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(filter)
      .populate('category', 'name slug icon')
      .sort({ isFeatured: -1, order: 1, createdAt: -1 });

    const courseIds = courses.map((c) => c._id);
    const lessonCounts = await Lesson.aggregate([
      { $match: { courseId: { $in: courseIds } } },
      { $group: { _id: '$courseId', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    lessonCounts.forEach((lc) => {
      countMap[lc._id.toString()] = lc.count;
    });

    const enriched = courses.map((c) => ({
      ...c.toObject(),
      lessonsCount: countMap[c._id.toString()] || 0
    }));

    res.status(200).json({
      status: 'success',
      data: { courses: enriched }
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicCourseBySlug = async (req, res, next) => {
  try {
    const course = await Course.findOne({
      slug: req.params.slug,
      status: 'published'
    }).populate('category', 'name slug icon');

    if (!course) {
      throw new NotFoundError('Course not found or is not currently published.');
    }

    // Public curriculum list (omits full protected material downloads and private video URLs unless isPreview=true)
    const lessons = await Lesson.find({ courseId: course._id })
      .sort({ order: 1 })
      .select('order title isPreview videoDuration characterFocus materials.title materials.type');

    // If there is a free preview lesson, include its embed URL for public inspection
    const previewLesson = await Lesson.findOne({
      courseId: course._id,
      isPreview: true
    }).select('order title videoUrl content materials isPreview');

    res.status(200).json({
      status: 'success',
      data: {
        course,
        lessons,
        previewLesson
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });

    res.status(200).json({
      status: 'success',
      data: { categories }
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicArticles = async (req, res, next) => {
  try {
    const { tag, search, page = 1, limit = 12 } = req.query;
    const filter = { status: 'published' };

    if (tag) filter.tags = tag;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [articles, total] = await Promise.all([
      Article.find(filter)
        .populate('author', 'name')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Article.countDocuments(filter)
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        articles,
        pagination: {
          total,
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          pages: Math.ceil(total / parseInt(limit, 10))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicArticleBySlug = async (req, res, next) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
      status: 'published'
    }).populate('author', 'name');

    if (!article) {
      throw new NotFoundError('Article not found.');
    }

    res.status(200).json({
      status: 'success',
      data: { article }
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicFaqs = async (req, res, next) => {
  try {
    const faqs = await FAQ.find({ isPublished: true }).sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      status: 'success',
      data: { faqs }
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicPageContent = async (req, res, next) => {
  try {
    const page = await PageContent.findOne({ pageSlug: req.params.slug });
    if (!page) {
      throw new NotFoundError('Page content not found.');
    }

    res.status(200).json({
      status: 'success',
      data: { page }
    });
  } catch (error) {
    next(error);
  }
};

export const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    const contact = await ContactMessage.create({
      name,
      email,
      subject,
      message,
      status: 'unread'
    });

    logger.info(`New contact message received from: ${email} (${name})`);

    res.status(201).json({
      status: 'success',
      message: 'Thank you for contacting us! Our team will get back to you shortly.',
      data: { contactId: contact._id }
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicSettings = async (req, res, next) => {
  try {
    const settings = await Setting.find();
    const settingsMap = {};
    settings.forEach((s) => {
      // Exclude any internal keys
      if (!s.key.includes('secret') && !s.key.includes('key')) {
        settingsMap[s.key] = s.value;
      }
    });

    res.status(200).json({
      status: 'success',
      data: { settings: settingsMap }
    });
  } catch (error) {
    next(error);
  }
};

