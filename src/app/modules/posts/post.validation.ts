import { z } from 'zod';

// Create validation schema
const createPostSchema = z.object({
  body: z.object({
    author: z
      .string({ required_error: 'Author is required' })
      .nonempty({ message: 'Author is required' }),
    content: z.string({ required_error: 'Content is required' }),
    category: z.string({ required_error: 'Category is required' }),
  }),
});

// vote validation schema
const voteAPostSchema = z.object({
  body: z.object({
    voteType: z.enum(['upvote', 'downvote']),
  }),
});

// Update validation schema (partial allows optional fields)
const updatePostSchema = z
  .object({
    body: z.object({
      author: z.string({ required_error: 'Author is required' }),
      title: z.string().optional(),
      content: z.string().optional(),
      category: z.string().optional(),
      isPremium: z.boolean().optional(),
      isDeleted: z.boolean().optional(),
      isPublished: z.boolean().optional(),
      upvotes: z.array(z.string()).optional(),
      downvotes: z.array(z.string()).optional(),
    }),
  })
  .partial();

export const PostValidations = {
  createPostSchema,
  updatePostSchema,
  voteAPostSchema,
};
