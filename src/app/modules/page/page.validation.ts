import { z } from 'zod';

// Zod schema for page creation
const createPageSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Page name is required' }),
  }),
});

// Zod schema for page update
const updatePageSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, { message: 'Page title is required' })
      .max(150, { message: 'Page title must be less than 150 characters' })
      .optional(),
    content: z
      .string()
      .min(1, { message: 'Page content is required' })
      .max(5000, { message: 'Page content must be less than 5000 characters' })
      .optional(),
    isPublished: z.boolean().optional(),
  }),
});

// Usage of Zod schemas for creating and updating pages
export const PageValidations = {
  createPageSchema,
  updatePageSchema,
};
