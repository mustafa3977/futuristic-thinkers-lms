import { PageContent } from '../models/index.js';
import { NotFoundError } from '../utils/errors.js';
import { logActivity } from '../utils/auditLogger.js';

export const getPages = async (req, res, next) => {
  try {
    const pages = await PageContent.find().sort({ pageSlug: 1 });

    res.status(200).json({
      status: 'success',
      data: { pages }
    });
  } catch (error) {
    next(error);
  }
};

export const getPageBySlug = async (req, res, next) => {
  try {
    const page = await PageContent.findOne({ pageSlug: req.params.slug });
    if (!page) {
      throw new NotFoundError('Page not found');
    }

    res.status(200).json({
      status: 'success',
      data: { page }
    });
  } catch (error) {
    next(error);
  }
};

export const updatePage = async (req, res, next) => {
  try {
    const { title, content, metaDescription } = req.body;
    const page = await PageContent.findOne({ pageSlug: req.params.slug });

    if (!page) {
      throw new NotFoundError('Page not found');
    }

    if (title) page.title = title;
    if (content) page.content = content;
    if (metaDescription !== undefined) page.metaDescription = metaDescription;
    page.lastUpdated = new Date();
    await page.save();

    await logActivity({
      adminId: req.user._id,
      action: 'PAGE_CONTENT_UPDATED',
      targetType: 'PageContent',
      targetId: page._id,
      details: { pageSlug: page.pageSlug },
      req
    });

    res.status(200).json({
      status: 'success',
      message: `${page.title} updated successfully`,
      data: { page }
    });
  } catch (error) {
    next(error);
  }
};

