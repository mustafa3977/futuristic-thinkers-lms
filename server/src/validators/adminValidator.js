import { z } from 'zod';

export const courseSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  slug: z.string().trim().min(3).toLowerCase(),
  tagline: z.string().trim().optional(),
  category: z.string().min(1, 'Category ID is required'),
  ageRange: z.string().default('7-10 years'),
  shortDescription: z.string().trim().min(10).max(300),
  fullDescription: z.string().trim().min(20),
  learningOutcomes: z.array(z.string()).default([]),
  whoIsItFor: z.string().optional(),
  howItWorks: z.string().optional(),
  whatChildSeesDoes: z.string().optional(),
  materialsIncluded: z.array(z.string()).default([]),
  thumbnail: z.string().optional(),
  price: z.number().min(0, 'Price must be non-negative'),
  currency: z.string().default('USD'),
  duration: z.string().optional(),
  deviceRequirements: z.string().optional(),
  accessPeriod: z.string().default('1 Year Full Access'),
  refundText: z.string().default('14-Day 100% Money-Back Guarantee'),
  support: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  status: z.enum(['draft', 'published']).default('draft'),
  isFeatured: z.boolean().default(false)
});

export const lessonSchema = z.object({
  order: z.number().int().min(1),
  title: z.string().trim().min(3),
  videoUrl: z.string().default(''),
  videoDuration: z.string().default('12:00'),
  content: z.string().min(10),
  characterFocus: z.array(z.string()).default([]),
  materials: z
    .array(
      z.object({
        title: z.string().min(1),
        type: z.enum([
          'notebook',
          'mission',
          'challenge',
          'myth_buster',
          'hero_spotlight',
          'talk_cards',
          'worksheet',
          'other'
        ]),
        fileUrl: z.string(),
        downloadName: z.string(),
        description: z.string().optional()
      })
    )
    .default([]),
  isPreview: z.boolean().default(false),
  unlockRule: z.enum(['sequential', 'immediate']).default('sequential'),
  passportStamp: z
    .object({
      stampCode: z.string(),
      title: z.string(),
      icon: z.string()
    })
    .optional(),
  milestoneBadge: z
    .object({
      badgeId: z.string().nullable().optional(),
      title: z.string().nullable().optional(),
      description: z.string().nullable().optional(),
      icon: z.string().nullable().optional()
    })
    .optional()
});

export const categorySchema = z.object({
  name: z.string().trim().min(2),
  slug: z.string().trim().min(2).toLowerCase(),
  description: z.string().default(''),
  icon: z.string().default('Sparkles'),
  order: z.number().default(0),
  isActive: z.boolean().default(true)
});

export const couponSchema = z.object({
  code: z.string().trim().min(2).toUpperCase(),
  discountType: z.enum(['percentage', 'fixed']).default('percentage'),
  discountValue: z.number().min(1),
  maxUses: z.number().default(100),
  expiresAt: z.string().nullable().optional(),
  isActive: z.boolean().default(true)
});

export const articleSchema = z.object({
  title: z.string().trim().min(3),
  slug: z.string().trim().min(3).toLowerCase(),
  excerpt: z.string().trim().min(10).max(300),
  content: z.string().min(20),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published']).default('draft'),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional()
});

export const faqSchema = z.object({
  question: z.string().trim().min(5),
  answer: z.string().trim().min(10),
  category: z.string().default('General'),
  order: z.number().default(0),
  isPublished: z.boolean().default(true)
});

export const manualEnrollSchema = z.object({
  parentEmail: z.string().email(),
  courseId: z.string().min(1),
  accessDays: z.number().min(1).default(365),
  childId: z.string().optional()
});

