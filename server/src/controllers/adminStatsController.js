import {
  User,
  ChildProfile,
  Course,
  Enrollment,
  Order,
  ActivityLog
} from '../models/index.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalParents,
      totalChildren,
      totalCourses,
      totalEnrollments,
      revenueResult,
      recentOrders,
      popularCourses,
      recentActivity
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'parent' }),
      ChildProfile.countDocuments({ isActive: true }),
      Course.countDocuments(),
      Enrollment.countDocuments({ status: 'active' }),
      Order.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Order.find({ status: 'completed' })
        .populate('parentId', 'name email')
        .populate('courseId', 'title slug price')
        .sort({ createdAt: -1 })
        .limit(5),
      Enrollment.aggregate([
        { $group: { _id: '$courseId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 4 },
        {
          $lookup: {
            from: 'courses',
            localField: '_id',
            foreignField: '_id',
            as: 'course'
          }
        },
        { $unwind: '$course' }
      ]),
      ActivityLog.find()
        .populate('adminId', 'name email')
        .sort({ createdAt: -1 })
        .limit(8)
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    res.status(200).json({
      status: 'success',
      data: {
        metrics: {
          totalUsers,
          totalParents,
          totalChildren,
          totalCourses,
          totalEnrollments,
          totalRevenue
        },
        recentOrders,
        popularCourses: popularCourses.map((pc) => ({
          courseId: pc._id,
          title: pc.course.title,
          slug: pc.course.slug,
          enrollmentCount: pc.count
        })),
        recentActivity
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getActivityLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      ActivityLog.find()
        .populate('adminId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ActivityLog.countDocuments()
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

