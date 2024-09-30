import { z } from 'zod';
import { Types } from 'mongoose';
import { CommentType } from './comment.interface';
const commentSchema = z.object({
  body: z.object({
    post: z
      .instanceof(Types.ObjectId)
      .refine((val) => val instanceof Types.ObjectId, {
        message: 'Invalid post ID',
      }),
    author: z
      .instanceof(Types.ObjectId)
      .refine((val) => val instanceof Types.ObjectId, {
        message: 'Invalid author ID',
      }),
    content: z.string().min(1, 'Content cannot be empty'),
    type: z.nativeEnum(CommentType).default(CommentType.TEXT),
  }),
});

export const CommentValidations = { commentSchema };
