import { z } from 'zod';

const UserValidationSchema = z.object({
  body: z.object({
    user: z.object({
      fullname: z
        .string({
          required_error: 'Name is required',
        })
        .trim(),
      email: z
        .string({
          required_error: 'Email is required',
        })
        .email('Invalid email address')
        .trim(),
      password: z
        .string({
          required_error: 'Password is required',
        })
        .min(8, 'Password must be at least 8 characters long'),
      role: z.enum(['user', 'admin', 'superAdmin']).optional().default('user'),
      phone: z.string().trim().optional(),
      profileImage: z.string().optional(),
      resetPasswordToken: z.string().optional(),
      resetPasswordExpires: z.date().optional(),
    }),
  }),
});

export { UserValidationSchema };
