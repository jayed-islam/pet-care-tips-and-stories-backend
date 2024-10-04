import { z } from 'zod';

const paymentValidation = z.object({
  body: z.object({
    postId: z.string({ required_error: 'Post Id is required.' }),
    amount: z.number(),
  }),
});

export const PaymentValidation = {
  paymentValidation,
};
