import { Category, Course } from '../models/index.js';
import { NotFoundError, ConflictError, BadRequestError } from '../utils/errors.js';
import { logActivity } from '../utils/auditLogger.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 });
    
    // Attach course count
    const counts = await Course.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const countMap = {};
    counts.forEach((c) => {
      countMap[c._id.toString()] = c.count;
    });

    const categoriesWithCount = categories.map((cat) => ({
      ...cat.toObject(),
      courseCount: countMap[cat._id.toString()] || 0
    }));

    res.status(200).json({
      status: 'success',
      data: { categories: categoriesWithCount }
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, slug } = req.body;
    const existing = await Category.findOne({ $or: [{ name }, { slug }] });
    if (existing) {
      throw new ConflictError('A category with this name or slug already exists.');
    }

    const category = await Category.create(req.body);

    await logActivity({
      adminId: req.user._id,
      action: 'CATEGORY_CREATED',
      targetType: 'Category',
      targetId: category._id,
      details: { name: category.name, slug: category.slug },
      req
    });

    res.status(201).json({
      status: 'success',
      message: 'Category created successfully',
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    Object.assign(category, req.body);
    await category.save();

    await logActivity({
      adminId: req.user._id,
      action: 'CATEGORY_UPDATED',
      targetType: 'Category',
      targetId: category._id,
      details: { name: category.name },
      req
    });

    res.status(200).json({
      status: 'success',
      message: 'Category updated successfully',
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    const linkedCourses = await Course.countDocuments({ category: category._id });
    if (linkedCourses > 0) {
      throw new BadRequestError(
        `Cannot delete category '${category.name}' because it contains ${linkedCourses} active courses. Move or delete those courses first.`
      );
    }

    await category.deleteOne();

    await logActivity({
      adminId: req.user._id,
      action: 'CATEGORY_DELETED',
      targetType: 'Category',
      targetId: req.params.id,
      details: { name: category.name },
      req
    });

    res.status(200).json({
      status: 'success',
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

