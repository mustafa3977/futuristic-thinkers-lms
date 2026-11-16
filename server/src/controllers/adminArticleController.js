import { Article } from '../models/index.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import { logActivity } from '../utils/auditLogger.js';

export const getArticles = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [articles, total] = await Promise.all([
      Article.find(filter)
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
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

export const createArticle = async (req, res, next) => {
  try {
    const { slug } = req.body;
    const existing = await Article.findOne({ slug });
    if (existing) {
      throw new ConflictError('An article with this slug already exists.');
    }

    const article = await Article.create({
      ...req.body,
      author: req.user._id,
      publishedAt: req.body.status === 'published' ? new Date() : null
    });

    await logActivity({
      adminId: req.user._id,
      action: 'ARTICLE_CREATED',
      targetType: 'Article',
      targetId: article._id,
      details: { title: article.title, slug: article.slug },
      req
    });

    res.status(201).json({
      status: 'success',
      message: 'Article created successfully',
      data: { article }
    });
  } catch (error) {
    next(error);
  }
};

export const updateArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      throw new NotFoundError('Article not found');
    }

    if (req.body.slug && req.body.slug !== article.slug) {
      const existing = await Article.findOne({ slug: req.body.slug });
      if (existing) {
        throw new ConflictError('An article with this slug already exists.');
      }
    }

    if (req.body.status === 'published' && article.status !== 'published' && !article.publishedAt) {
      req.body.publishedAt = new Date();
    }

    Object.assign(article, req.body);
    await article.save();

    await logActivity({
      adminId: req.user._id,
      action: 'ARTICLE_UPDATED',
      targetType: 'Article',
      targetId: article._id,
      details: { title: article.title },
      req
    });

    res.status(200).json({
      status: 'success',
      message: 'Article updated successfully',
      data: { article }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      throw new NotFoundError('Article not found');
    }

    await article.deleteOne();

    await logActivity({
      adminId: req.user._id,
      action: 'ARTICLE_DELETED',
      targetType: 'Article',
      targetId: req.params.id,
      details: { title: article.title },
      req
    });

    res.status(200).json({
      status: 'success',
      message: 'Article deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

