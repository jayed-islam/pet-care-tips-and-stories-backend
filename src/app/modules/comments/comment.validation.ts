import { z } from 'zod';
import { CommentType } from './comment.interface';

const commentSchema = z.object({
  body: z.object({
    post: z.string({ required_error: 'Post ID is required' }),
    author: z.string({ required_error: 'Author ID is required' }),
    content: z.string().min(1, 'Content cannot be empty'),
    type: z.nativeEnum(CommentType).default(CommentType.TEXT),
  }),
});

export const CommentValidations = { commentSchema };
