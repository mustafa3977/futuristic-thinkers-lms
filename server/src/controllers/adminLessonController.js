import { Lesson, Course } from '../models/index.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import { logActivity } from '../utils/auditLogger.js';

export const getLessonsByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const lessons = await Lesson.find({ courseId }).sort({ order: 1 });

    res.status(200).json({
      status: 'success',
      data: { lessons }
    });
  } catch (error) {
    next(error);
  }
};

export const createLesson = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    let order = req.body.order;
    if (!order) {
      const lastLesson = await Lesson.findOne({ courseId }).sort({ order: -1 });
      order = lastLesson ? lastLesson.order + 1 : 1;
    }

    const lesson = await Lesson.create({
      ...req.body,
      courseId,
      order
    });

    await logActivity({
      adminId: req.user._id,
      action: 'LESSON_CREATED',
      targetType: 'Lesson',
      targetId: lesson._id,
      details: { courseTitle: course.title, lessonTitle: lesson.title, order: lesson.order },
      req
    });

    res.status(201).json({
      status: 'success',
      message: 'Lesson created successfully',
      data: { lesson }
    });
  } catch (error) {
    next(error);
  }
};

export const updateLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      throw new NotFoundError('Lesson not found');
    }

    Object.assign(lesson, req.body);
    await lesson.save();

    await logActivity({
      adminId: req.user._id,
      action: 'LESSON_UPDATED',
      targetType: 'Lesson',
      targetId: lesson._id,
      details: { title: lesson.title, order: lesson.order },
      req
    });

    res.status(200).json({
      status: 'success',
      message: 'Lesson updated successfully',
      data: { lesson }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      throw new NotFoundError('Lesson not found');
    }

    const courseId = lesson.courseId;
    await lesson.deleteOne();

    // Re-index remaining lessons
    const remaining = await Lesson.find({ courseId }).sort({ order: 1 });
    for (let i = 0; i < remaining.length; i++) {
      if (remaining[i].order !== i + 1) {
        remaining[i].order = i + 1;
        await remaining[i].save();
      }
    }

    await logActivity({
      adminId: req.user._id,
      action: 'LESSON_DELETED',
      targetType: 'Lesson',
      targetId: req.params.id,
      details: { title: lesson.title },
      req
    });

    res.status(200).json({
      status: 'success',
      message: 'Lesson deleted and order re-sequenced successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const reorderLessons = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { orders } = req.body; // array of { id, order }

    if (!Array.isArray(orders)) {
      throw new BadRequestError('orders must be an array of { id, order }');
    }

    const bulkOps = orders.map((item) => ({
      updateOne: {
        filter: { _id: item.id, courseId },
        update: { $set: { order: item.order } }
      }
    }));

    await Lesson.bulkWrite(bulkOps);

    await logActivity({
      adminId: req.user._id,
      action: 'LESSONS_REORDERED',
      targetType: 'Course',
      targetId: courseId,
      details: { reorderedCount: orders.length },
      req
    });

    const updatedLessons = await Lesson.find({ courseId }).sort({ order: 1 });

    res.status(200).json({
      status: 'success',
      message: 'Lessons reordered successfully',
      data: { lessons: updatedLessons }
    });
  } catch (error) {
    next(error);
  }
};

