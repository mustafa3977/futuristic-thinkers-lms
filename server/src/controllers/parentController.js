import crypto from 'crypto';
import {
  ChildProfile,
  Enrollment,
  Course,
  Lesson,
  Progress,
  Order,
  User
} from '../models/index.js';
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError
} from '../utils/errors.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { clearAuthCookies } from '../utils/token.js';

// -------------------------------------------------------------
// Child Profiles
// -------------------------------------------------------------

export const getChildren = async (req, res, next) => {
  try {
    const children = await ChildProfile.find({
      parentId: req.user._id,
      isActive: true
    }).sort({ createdAt: 1 });

    res.status(200).json({
      status: 'success',
      data: { children }
    });
  } catch (error) {
    next(error);
  }
};

export const createChild = async (req, res, next) => {
  try {
    const { nickname, avatar, age, pin } = req.body;

    let pinHash = null;
    if (pin && pin.trim().length === 4) {
      pinHash = await hashPassword(pin.trim());
    }

    const child = await ChildProfile.create({
      parentId: req.user._id,
      nickname,
      avatar: avatar || 'avatar-zara',
      age: parseInt(age, 10),
      pinHash,
      isActive: true
    });

    res.status(201).json({
      status: 'success',
      message: 'Child learner profile created safely',
      data: {
        child: {
          id: child._id,
          nickname: child.nickname,
          avatar: child.avatar,
          age: child.age,
          hasPin: !!pinHash
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateChild = async (req, res, next) => {
  try {
    const { nickname, avatar, age, pin } = req.body;
    const child = await ChildProfile.findOne({
      _id: req.params.id,
      parentId: req.user._id,
      isActive: true
    });

    if (!child) {
      throw new NotFoundError('Child profile not found');
    }

    if (nickname) child.nickname = nickname;
    if (avatar) child.avatar = avatar;
    if (age) child.age = parseInt(age, 10);
    if (pin !== undefined) {
      child.pinHash = pin && pin.trim().length === 4 ? await hashPassword(pin.trim()) : null;
    }

    await child.save();

    res.status(200).json({
      status: 'success',
      message: 'Child profile updated',
      data: {
        child: {
          id: child._id,
          nickname: child.nickname,
          avatar: child.avatar,
          age: child.age,
          hasPin: !!child.pinHash
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteChild = async (req, res, next) => {
  try {
    const child = await ChildProfile.findOne({
      _id: req.params.id,
      parentId: req.user._id
    });

    if (!child) {
      throw new NotFoundError('Child profile not found');
    }

    // Soft delete profile and purge learning progress
    child.isActive = false;
    await child.save();
    await Progress.deleteMany({ childId: child._id });

    res.status(200).json({
      status: 'success',
      message: 'Child profile and progress records removed'
    });
  } catch (error) {
    next(error);
  }
};

export const verifyChildPin = async (req, res, next) => {
  try {
    const { pin } = req.body;
    const child = await ChildProfile.findOne({
      _id: req.params.id,
      parentId: req.user._id,
      isActive: true
    }).select('+pinHash');

    if (!child) {
      throw new NotFoundError('Child profile not found');
    }

    if (!child.pinHash) {
      return res.status(200).json({ status: 'success', verified: true });
    }

    const isMatch = await comparePassword(pin, child.pinHash);
    if (!isMatch) {
      throw new BadRequestError('Incorrect PIN');
    }

    res.status(200).json({
      status: 'success',
      verified: true
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------------
// Enrollments & Learning
// -------------------------------------------------------------

export const getMyEnrollments = async (req, res, next) => {
  try {
    const { childId } = req.query;

    const enrollments = await Enrollment.find({
      parentId: req.user._id,
      status: 'active',
      accessExpiresAt: { $gt: new Date() }
    }).populate('courseId');

    // Attach progress per child
    const results = await Promise.all(
      enrollments.map(async (enr) => {
        let progress = null;
        if (childId) {
          progress = await Progress.findOne({
            childId,
            courseId: enr.courseId._id
          });
        }
        return {
          enrollmentId: enr._id,
          course: enr.courseId,
          enrolledAt: enr.enrolledAt,
          accessExpiresAt: enr.accessExpiresAt,
          progress: progress || {
            percent: 0,
            completedLessons: [],
            passportStamps: [],
            badges: []
          }
        };
      })
    );

    res.status(200).json({
      status: 'success',
      data: { enrollments: results }
    });
  } catch (error) {
    next(error);
  }
};

export const enrollFreeCourse = async (req, res, next) => {
  try {
    const { courseId, childId } = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    if (course.price > 0) {
      throw new BadRequestError('This course requires purchase via Stripe Checkout.');
    }

    // Check existing
    const existing = await Enrollment.findOne({
      parentId: req.user._id,
      courseId: course._id,
      status: 'active'
    });

    if (existing) {
      return res.status(200).json({
        status: 'success',
        message: 'Already enrolled in this course',
        data: { enrollment: existing }
      });
    }

    const accessExpiresAt = new Date();
    accessExpiresAt.setFullYear(accessExpiresAt.getFullYear() + 1);

    const enrollment = await Enrollment.create({
      parentId: req.user._id,
      childId: childId || null,
      courseId: course._id,
      status: 'active',
      accessExpiresAt,
      source: 'free',
      enrolledAt: new Date()
    });

    if (childId) {
      await Progress.findOneAndUpdate(
        { childId, courseId: course._id },
        { $setOnInsert: { percent: 0, completedLessons: [], passportStamps: [], badges: [] } },
        { upsert: true }
      );
    }

    res.status(201).json({
      status: 'success',
      message: `Enrolled successfully in ${course.title}`,
      data: { enrollment }
    });
  } catch (error) {
    next(error);
  }
};

export const getLessonPlayerContent = async (req, res, next) => {
  try {
    const { courseSlug, order } = req.params;
    const { childId } = req.query;

    const course = await Course.findOne({ slug: courseSlug, status: 'published' });
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Check enrollment permission unless user is Admin
    if (req.user.role !== 'admin') {
      const enrollment = await Enrollment.findOne({
        parentId: req.user._id,
        courseId: course._id,
        status: 'active',
        accessExpiresAt: { $gt: new Date() }
      });

      // Allow preview lesson access even if not enrolled
      const isTargetPreview = parseInt(order, 10) === 1;
      if (!enrollment && !isTargetPreview) {
        throw new ForbiddenError(
          'You are not enrolled in this course. Please enroll to access full lessons and materials.'
        );
      }
    }

    const currentOrder = parseInt(order, 10);
    const lesson = await Lesson.findOne({
      courseId: course._id,
      order: currentOrder
    });

    if (!lesson) {
      throw new NotFoundError(`Lesson ${order} not found`);
    }

    // Fetch all lessons overview for course navigation sidebar
    const allLessons = await Lesson.find({ courseId: course._id })
      .sort({ order: 1 })
      .select('order title isPreview videoDuration characterFocus passportStamp milestoneBadge');

    // Fetch progress if childId is provided
    let childProgress = null;
    let isLocked = false;

    if (childId) {
      childProgress = await Progress.findOne({
        childId,
        courseId: course._id
      });

      // Sequential lock enforcement: Lesson N requires Lesson N-1 complete
      if (
        lesson.unlockRule === 'sequential' &&
        currentOrder > 1 &&
        req.user.role !== 'admin'
      ) {
        const completedIds = (childProgress?.completedLessons || []).map((cl) =>
          cl.lessonId.toString()
        );
        const previousLesson = allLessons.find((l) => l.order === currentOrder - 1);
        if (previousLesson && !completedIds.includes(previousLesson._id.toString())) {
          isLocked = true;
        }
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        course: {
          id: course._id,
          title: course.title,
          slug: course.slug,
          ageRange: course.ageRange
        },
        lesson: isLocked
          ? {
              id: lesson._id,
              order: lesson.order,
              title: lesson.title,
              isLocked: true,
              message: `Lesson ${lesson.order} is locked. Please complete Lesson ${currentOrder - 1} first!`
            }
          : lesson,
        allLessons,
        progress: childProgress || {
          percent: 0,
          completedLessons: [],
          passportStamps: [],
          badges: []
        },
        isLocked
      }
    });
  } catch (error) {
    next(error);
  }
};

export const completeLesson = async (req, res, next) => {
  try {
    const { courseId, lessonId, childId } = req.body;

    const [child, course, lesson] = await Promise.all([
      ChildProfile.findOne({ _id: childId, parentId: req.user._id, isActive: true }),
      Course.findById(courseId),
      Lesson.findById(lessonId)
    ]);

    if (!child) throw new NotFoundError('Child profile not found');
    if (!course) throw new NotFoundError('Course not found');
    if (!lesson) throw new NotFoundError('Lesson not found');

    let progress = await Progress.findOne({ childId: child._id, courseId: course._id });
    if (!progress) {
      progress = await Progress.create({
        childId: child._id,
        courseId: course._id,
        completedLessons: [],
        passportStamps: [],
        badges: []
      });
    }

    // Check if lesson was already completed
    const alreadyCompleted = progress.completedLessons.some(
      (cl) => cl.lessonId.toString() === lesson._id.toString()
    );

    let newlyAwardedStamp = null;
    let newlyAwardedBadge = null;

    if (!alreadyCompleted) {
      progress.completedLessons.push({
        lessonId: lesson._id,
        completedAt: new Date()
      });

      // Award Passport Stamp
      if (lesson.passportStamp) {
        const stampExists = progress.passportStamps.some(
          (s) => s.lessonOrder === lesson.order
        );
        if (!stampExists) {
          const stamp = {
            lessonOrder: lesson.order,
            stampCode: lesson.passportStamp.stampCode || `STAMP_${lesson.order}`,
            title: lesson.passportStamp.title || `Lesson ${lesson.order} Explorer Stamp`,
            earnedAt: new Date()
          };
          progress.passportStamps.push(stamp);
          newlyAwardedStamp = stamp;
        }
      }

      // Check Milestone Badges
      if (lesson.milestoneBadge && lesson.milestoneBadge.badgeId) {
        const badgeExists = progress.badges.some(
          (b) => b.badgeId === lesson.milestoneBadge.badgeId
        );
        if (!badgeExists) {
          const badge = {
            badgeId: lesson.milestoneBadge.badgeId,
            title: lesson.milestoneBadge.title,
            description: lesson.milestoneBadge.description || '',
            icon: lesson.milestoneBadge.icon || 'Award',
            earnedAt: new Date()
          };
          progress.badges.push(badge);
          newlyAwardedBadge = badge;
        }
      }

      // Update percent
      const totalLessonsCount = await Lesson.countDocuments({ courseId: course._id });
      progress.percent = Math.min(
        100,
        Math.round((progress.completedLessons.length / (totalLessonsCount || 10)) * 100)
      );

      // Check Course Completion (all 10 lessons completed)
      if (progress.completedLessons.length >= totalLessonsCount && !progress.certificateIssued) {
        progress.completedAt = new Date();
        progress.certificateIssued = true;
        progress.certificateCode = `FT-CERT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
      }

      await progress.save();
    }

    res.status(200).json({
      status: 'success',
      message: `Lesson ${lesson.order} marked as completed!`,
      data: {
        progress,
        newlyAwardedStamp,
        newlyAwardedBadge,
        certificateCode: progress.certificateCode || null
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getChildCourseProgress = async (req, res, next) => {
  try {
    const { courseId, childId } = req.params;

    const child = await ChildProfile.findOne({
      _id: childId,
      parentId: req.user._id,
      isActive: true
    });
    if (!child) {
      throw new NotFoundError('Child profile not found');
    }

    const progress = await Progress.findOne({ childId, courseId }).populate(
      'completedLessons.lessonId',
      'order title'
    );

    res.status(200).json({
      status: 'success',
      data: {
        child: { id: child._id, nickname: child.nickname, avatar: child.avatar },
        progress: progress || {
          percent: 0,
          completedLessons: [],
          passportStamps: [],
          badges: [],
          certificateIssued: false
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------------
// Orders / Receipts & Account Privacy Management
// -------------------------------------------------------------

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ parentId: req.user._id })
      .populate('courseId', 'title slug price currency')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: { orders }
    });
  } catch (error) {
    next(error);
  }
};

export const exportUserData = async (req, res, next) => {
  try {
    const parentId = req.user._id;

    const [user, children, enrollments, orders] = await Promise.all([
      User.findById(parentId).select('-passwordHash'),
      ChildProfile.find({ parentId }),
      Enrollment.find({ parentId }).populate('courseId', 'title slug'),
      Order.find({ parentId })
    ]);

    const childIds = children.map((c) => c._id);
    const progressList = await Progress.find({ childId: { $in: childIds } }).populate(
      'courseId',
      'title'
    );

    const exportPackage = {
      exportedAt: new Date().toISOString(),
      parentAccount: user,
      childProfiles: children,
      enrollments,
      orders,
      learningProgress: progressList,
      coppaComplianceNote:
        'Futuristic Thinkers stores only parent credentials and child nicknames/avatars. No personal child data is retained.'
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="futuristic-thinkers-data-${req.user._id}.json"`
    );
    res.status(200).send(JSON.stringify(exportPackage, null, 2));
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const parentId = req.user._id;
    const children = await ChildProfile.find({ parentId });
    const childIds = children.map((c) => c._id);

    // Delete all child data, progress, enrollments, and parent user
    await Promise.all([
      ChildProfile.deleteMany({ parentId }),
      Progress.deleteMany({ childId: { $in: childIds } }),
      Enrollment.deleteMany({ parentId }),
      User.findByIdAndDelete(parentId)
    ]);

    clearAuthCookies(res);

    res.status(200).json({
      status: 'success',
      message: 'Your account and all associated child profiles and learning progress have been permanently deleted.'
    });
  } catch (error) {
    next(error);
  }
};

