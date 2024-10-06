import mongoose from 'mongoose';
import { User } from '../user/user.model';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { initiatePayment, verifyPayment } from './payment.utils';

import {
  htmlPaymentFailContent,
  htmlPaymentSuccessContent,
} from './payment.response';
import { Payment } from './payment.model';
import { Post } from '../posts/post.model';
import { PaymentInfo } from './payment.interface';

// Payment confirmation function (after payment gateway verification)
const PaymentConfirmation = async (transactionId: string) => {
  const verifyResponse = await verifyPayment(transactionId);
  const session = await mongoose.startSession();

  if (verifyResponse.pay_status === 'Successful') {
    try {
      session.startTransaction();

      // Update the payment record (marking it as completed)
      const payment = await Payment.findOneAndUpdate(
        { transactionId },
        { paymentStatus: 'COMPLETED' },
        { new: true, session },
      );

      if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, 'Payment record not found');
      }

      const post = await Post.findById(payment.post);
      if (!post) {
        throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
      }

      // Optionally, update any necessary user data, e.g., granting access to the premium post
      await User.findByIdAndUpdate(payment.user, {
        $push: { purchasedPosts: post._id },
      });

      await session.commitTransaction();
      await session.endSession();

      return htmlPaymentSuccessContent;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw new AppError(
        httpStatus.CONFLICT,
        error instanceof Error ? error.message : 'Something went wrong',
      );
    }
  } else {
    return PaymentFailure(transactionId);
  }
};

// Payment failure function
const PaymentFailure = async (transactionId: string) => {
  const verifyResponse = await verifyPayment(transactionId); // Verify payment

  if (verifyResponse.pay_status !== 'Successful') {
    // Optionally, mark payment as failed
    await Payment.findOneAndUpdate(
      { transactionId },
      { paymentStatus: 'FAILED' },
    );
    return htmlPaymentFailContent; // Failure response content
  }
};

const getAllPayments = async () => {
  try {
    const payments = await Payment.find()
      .populate('user', '-password')
      .populate('post');

    return payments;
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error fetching payments',
    ); // Handle errors
  }
};

// Function to initiate a payment for a premium post
const makePayment = async (userId: string, postId: string, amount: number) => {
  const session = await mongoose.startSession();

  const user = await User.findById(userId);
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  try {
    session.startTransaction();

    const transactionId = `TXN-${Date.now()}`; // Unique transaction ID

    const paymentInfo: PaymentInfo = {
      transactionId,
      amount: amount ?? 51,
      customerName: user?.name ?? 'N/A',
      customerEmail: user?.email ?? 'N/A',
      customerAddress: user?.address ?? 'address',
      customerPhone: user?.phone ?? '01309090909',
    };

    // Initiate payment via the payment gateway
    const paymentSession = await initiatePayment(
      paymentInfo,
      user?._id as string,
    );

    console.log('session', paymentSession);

    // Create a payment record in the database
    await Payment.create(
      [
        {
          user: userId,
          post: postId,
          amount,
          transactionId,
          paymentStatus: 'PENDING',
        },
      ],
      { session },
    );

    await session.commitTransaction();
    await session.endSession();

    return paymentSession; // Return session for frontend to handle payment redirection

    await session.commitTransaction();
    await session.endSession();

    return paymentSession; // Return session for frontend to handle payment redirection
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.CONFLICT,
      error instanceof Error ? error.message : 'Something went wrong',
    );
  }
};

// Exporting the payment service
export const PaymentService = {
  PaymentConfirmation,
  makePayment,
  PaymentFailure,
  getAllPayments,
};
