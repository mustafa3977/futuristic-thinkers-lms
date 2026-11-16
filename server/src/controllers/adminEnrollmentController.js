import {
  Enrollment,
  User,
  Course,
  ChildProfile,
  Progress
} from '../models/index.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import { logActivity } from '../utils/auditLogger.js';

export const getEnrollments = async (req, res, next) => {
  try {
    const { courseId, status, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (courseId) filter.courseId = courseId;
    if (status) filter.status = status;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [enrollments, total] = await Promise.all([
      Enrollment.find(filter)
        .populate('parentId', 'name email')
        .populate('courseId', 'title slug price')
        .populate('childId', 'nickname avatar age')
        .sort({ enrolledAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Enrollment.countDocuments(filter)
    ]);

    // Attach student progress stats to each enrollment
    const enrollmentData = await Promise.all(
      enrollments.map(async (enr) => {
        let progress = null;
        if (enr.childId) {
          progress = await Progress.findOne({
            childId: enr.childId._id,
            courseId: enr.courseId._id
          }).select('percent completedLessons passportStamps badges');
        }
        return {
          ...enr.toObject(),
          progress: progress || { percent: 0, completedLessons: [], passportStamps: [], badges: [] }
        };
      })
    );

    res.status(200).json({
      status: 'success',
      data: {
        enrollments: enrollmentData,
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

export const manualEnroll = async (req, res, next) => {
  try {
    const { parentEmail, courseId, accessDays = 365, childId } = req.body;

    const [user, course] = await Promise.all([
      User.findOne({ email: parentEmail.toLowerCase().trim() }),
      Course.findById(courseId)
    ]);

    if (!user) {
      throw new NotFoundError(`Parent with email '${parentEmail}' was not found. Please ask them to register first.`);
    }

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Check if already actively enrolled
    const existing = await Enrollment.findOne({
      parentId: user._id,
      courseId: course._id,
      status: 'active'
    });

    if (existing) {
      throw new BadRequestError('User already has an active enrollment in this course.');
    }

    const accessExpiresAt = new Date();
    accessExpiresAt.setDate(accessExpiresAt.getDate() + parseInt(accessDays, 10));

    let assignedChildId = childId;
    if (!assignedChildId) {
      // Pick the first child profile under this parent if available
      const child = await ChildProfile.findOne({ parentId: user._id, isActive: true });
      if (child) assignedChildId = child._id;
    }

    const enrollment = await Enrollment.create({
      parentId: user._id,
      childId: assignedChildId || null,
      courseId: course._id,
      status: 'active',
      accessExpiresAt,
      source: 'manual',
      enrolledAt: new Date()
    });

    // If a child is assigned, initialize progress
    if (assignedChildId) {
      await Progress.findOneAndUpdate(
        { childId: assignedChildId, courseId: course._id },
        { $setOnInsert: { percent: 0, completedLessons: [], passportStamps: [], badges: [] } },
        { upsert: true, new: true }
      );
    }

    await logActivity({
      adminId: req.user._id,
      action: 'MANUAL_ENROLLMENT_CREATED',
      targetType: 'Enrollment',
      targetId: enrollment._id,
      details: {
        parentEmail: user.email,
        courseTitle: course.title,
        accessDays
      },
      req
    });

    res.status(201).json({
      status: 'success',
      message: `Successfully enrolled ${user.email} into ${course.title}`,
      data: { enrollment }
    });
  } catch (error) {
    next(error);
  }
};

export const updateEnrollmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['active', 'expired', 'revoked'].includes(status)) {
      throw new BadRequestError('Invalid status value');
    }

    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }

    enrollment.status = status;
    await enrollment.save();

    await logActivity({
      adminId: req.user._id,
      action: 'ENROLLMENT_STATUS_CHANGED',
      targetType: 'Enrollment',
      targetId: enrollment._id,
      details: { newStatus: status },
      req
    });

    res.status(200).json({
      status: 'success',
      message: `Enrollment status updated to ${status}`,
      data: { enrollment }
    });
  } catch (error) {
    next(error);
  }
};

export const extendEnrollmentAccess = async (req, res, next) => {
  try {
    const { additionalDays = 30 } = req.body;
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }

    const currentExpiry = new Date(enrollment.accessExpiresAt > new Date() ? enrollment.accessExpiresAt : new Date());
    currentExpiry.setDate(currentExpiry.getDate() + parseInt(additionalDays, 10));

    enrollment.accessExpiresAt = currentExpiry;
    enrollment.status = 'active';
    await enrollment.save();

    await logActivity({
      adminId: req.user._id,
      action: 'ENROLLMENT_ACCESS_EXTENDED',
      targetType: 'Enrollment',
      targetId: enrollment._id,
      details: { addedDays: additionalDays, newExpiry: currentExpiry },
      req
    });

    res.status(200).json({
      status: 'success',
      message: `Access extended by ${additionalDays} days`,
      data: { enrollment }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }

    await enrollment.deleteOne();

    await logActivity({
      adminId: req.user._id,
      action: 'ENROLLMENT_DELETED',
      targetType: 'Enrollment',
      targetId: req.params.id,
      details: {},
      req
    });

    res.status(200).json({
      status: 'success',
      message: 'Enrollment revoked and deleted'
    });
  } catch (error) {
    next(error);
  }
};

