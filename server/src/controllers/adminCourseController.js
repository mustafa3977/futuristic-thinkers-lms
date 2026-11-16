import { Course, Lesson } from '../models/index.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import { logActivity } from '../utils/auditLogger.js';

export const getCourses = async (req, res, next) => {
  try {
    const { status, category, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [courses, total] = await Promise.all([
      Course.find(filter)
        .populate('category', 'name slug')
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Course.countDocuments(filter)
    ]);

    // Attach lesson counts to each course
    const courseIds = courses.map((c) => c._id);
    const lessonCounts = await Lesson.aggregate([
      { $match: { courseId: { $in: courseIds } } },
      { $group: { _id: '$courseId', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    lessonCounts.forEach((lc) => {
      countMap[lc._id.toString()] = lc.count;
    });

    const coursesWithCount = courses.map((c) => ({
      ...c.toObject(),
      lessonsCount: countMap[c._id.toString()] || 0
    }));

    res.status(200).json({
      status: 'success',
      data: {
        courses: coursesWithCount,
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

export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('category', 'name slug');
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    const lessons = await Lesson.find({ courseId: course._id }).sort({ order: 1 });

    res.status(200).json({
      status: 'success',
      data: {
        course,
        lessons
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (req, res, next) => {
  try {
    const { slug } = req.body;
    const existing = await Course.findOne({ slug });
    if (existing) {
      throw new ConflictError('A course with this slug already exists.');
    }

    const course = await Course.create(req.body);

    await logActivity({
      adminId: req.user._id,
      action: 'COURSE_CREATED',
      targetType: 'Course',
      targetId: course._id,
      details: { title: course.title, slug: course.slug },
      req
    });

    res.status(201).json({
      status: 'success',
      message: 'Course created successfully',
      data: { course }
    });
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    if (req.body.slug && req.body.slug !== course.slug) {
      const existing = await Course.findOne({ slug: req.body.slug });
      if (existing) {
        throw new ConflictError('A course with this slug already exists.');
      }
    }

    Object.assign(course, req.body);
    await course.save();

    await logActivity({
      adminId: req.user._id,
      action: 'COURSE_UPDATED',
      targetType: 'Course',
      targetId: course._id,
      details: { title: course.title },
      req
    });

    res.status(200).json({
      status: 'success',
      message: 'Course updated successfully',
      data: { course }
    });
  } catch (error) {
    next(error);
  }
};

export const toggleCoursePublish = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    course.status = course.status === 'published' ? 'draft' : 'published';
    await course.save();

    await logActivity({
      adminId: req.user._id,
      action: 'COURSE_STATUS_TOGGLED',
      targetType: 'Course',
      targetId: course._id,
      details: { newStatus: course.status },
      req
    });

    res.status(200).json({
      status: 'success',
      message: `Course status changed to ${course.status}`,
      data: { course }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Delete associated lessons
    await Lesson.deleteMany({ courseId: course._id });
    await course.deleteOne();

    await logActivity({
      adminId: req.user._id,
      action: 'COURSE_DELETED',
      targetType: 'Course',
      targetId: req.params.id,
      details: { title: course.title },
      req
    });

    res.status(200).json({
      status: 'success',
      message: 'Course and its lessons were successfully deleted'
    });
  } catch (error) {
    next(error);
  }
};

