import { z } from 'zod';

const lecturerCreateSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(1, 'Name is required'),
    image: z.string().url('Invalid image URL').min(1, 'Image is required'),
    priority: z
      .number()
      .int()
      .min(0, 'Priority must be a non-negative integer')
      .optional(),
  }),
});

const lecturerUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  image: z.string().url('Invalid image URL').min(1, 'Image is required'),
  priority: z.number().int().min(0, 'Priority must be a non-negative integer'),
  isDeleted: z.boolean().optional(),
});

export const LecturerValidations = {
  lecturerCreateSchema,
  lecturerUpdateSchema,
};
