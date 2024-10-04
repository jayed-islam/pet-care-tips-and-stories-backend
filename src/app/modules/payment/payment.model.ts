import { Schema, model } from 'mongoose';
import { IPayment } from './payment.interface';

// Create the Payment schema
const paymentSchema = new Schema<IPayment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'BDT',
    },
    paymentMethod: {
      type: String,
      default: 'AmarPay',
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'FAILED'],
      default: 'PENDING',
    },
    transactionId: {
      type: String,
      required: true,
    },
    additionalInfo: {
      type: String,
    },
  },
  { timestamps: true },
);

export const Payment = model<IPayment>('Payment', paymentSchema);
