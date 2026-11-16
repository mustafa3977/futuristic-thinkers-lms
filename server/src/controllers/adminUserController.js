import {
  User,
  ChildProfile,
  Enrollment,
  Order,
  Progress
} from '../models/index.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import { hashPassword } from '../utils/password.js';
import { logActivity } from '../utils/auditLogger.js';

export const getUsers = async (req, res, next) => {
  try {
    const { role, isActive, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-passwordHash')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      User.countDocuments(filter)
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        users,
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

export const getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const [children, enrollments, orders] = await Promise.all([
      ChildProfile.find({ parentId: user._id }),
      Enrollment.find({ parentId: user._id })
        .populate('courseId', 'title slug price')
        .populate('childId', 'nickname avatar'),
      Order.find({ parentId: user._id }).populate('courseId', 'title price')
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        user,
        children,
        enrollments,
        orders
      }
    });
  } catch (error) {
    next(error);
  }
};

export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Protect against self-deactivation
    if (user._id.toString() === req.user._id.toString()) {
      throw new BadRequestError('You cannot deactivate your own administrative account.');
    }

    user.isActive = !user.isActive;
    await user.save();

    await logActivity({
      adminId: req.user._id,
      action: user.isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
      targetType: 'User',
      targetId: user._id,
      details: { email: user.email, newStatus: user.isActive },
      req
    });

    res.status(200).json({
      status: 'success',
      message: `User account has been ${user.isActive ? 'activated' : 'deactivated'}`,
      data: { user: { id: user._id, email: user.email, isActive: user.isActive } }
    });
  } catch (error) {
    next(error);
  }
};

export const changeUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['parent', 'admin'].includes(role)) {
      throw new BadRequestError('Role must be either parent or admin');
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user._id.toString() === req.user._id.toString() && role !== 'admin') {
      throw new BadRequestError('You cannot remove administrative privileges from yourself.');
    }

    user.role = role;
    await user.save();

    await logActivity({
      adminId: req.user._id,
      action: 'USER_ROLE_CHANGED',
      targetType: 'User',
      targetId: user._id,
      details: { email: user.email, newRole: role },
      req
    });

    res.status(200).json({
      status: 'success',
      message: `User role updated to ${role}`,
      data: { user: { id: user._id, email: user.email, role: user.role } }
    });
  } catch (error) {
    next(error);
  }
};

export const adminResetPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) {
      throw new BadRequestError('New password must be at least 8 characters');
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    user.passwordHash = await hashPassword(newPassword);
    user.refreshToken = undefined; // Force logout
    await user.save();

    await logActivity({
      adminId: req.user._id,
      action: 'USER_PASSWORD_RESET_BY_ADMIN',
      targetType: 'User',
      targetId: user._id,
      details: { email: user.email },
      req
    });

    res.status(200).json({
      status: 'success',
      message: `Password for ${user.email} was successfully reset`
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user._id.toString() === req.user._id.toString()) {
      throw new BadRequestError('You cannot delete your own administrative account.');
    }

    // Complete data deletion for COPPA / GDPR compliance
    const children = await ChildProfile.find({ parentId: user._id });
    const childIds = children.map((c) => c._id);

    await Promise.all([
      ChildProfile.deleteMany({ parentId: user._id }),
      Enrollment.deleteMany({ parentId: user._id }),
      Progress.deleteMany({ childId: { $in: childIds } }),
      user.deleteOne()
    ]);

    await logActivity({
      adminId: req.user._id,
      action: 'USER_DELETED_FULL_PURGE',
      targetType: 'User',
      targetId: req.params.id,
      details: { email: user.email },
      req
    });

    res.status(200).json({
      status: 'success',
      message: 'User and all associated child profiles and progress records permanently deleted.'
    });
  } catch (error) {
    next(error);
  }
};

