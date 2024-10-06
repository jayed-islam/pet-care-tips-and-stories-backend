import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PaymentService } from './payment.service';

const ConfirmPayment = catchAsync(async (req, res) => {
  const { tnxId } = req.query;
  const result = await PaymentService.PaymentConfirmation(tnxId as string);

  res.setHeader('Content-Type', 'text/html');
  res.send(result);
});

const FailPayment = catchAsync(async (req, res) => {
  const { tnxId } = req.query;
  const result = await PaymentService.PaymentFailure(tnxId as string);

  res.setHeader('Content-Type', 'text/html');
  res.send(result);
});

const MakePayemnt = catchAsync(async (req, res) => {
  const { postId, amount } = req.body;
  const paymentSession = await PaymentService.makePayment(
    req.user._id,
    postId,
    amount,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Make your payment',
    data: paymentSession,
  });
});

const getPaymentList = catchAsync(async (req, res) => {
  const result = await PaymentService.getAllPayments();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment list retrived',
    data: result,
  });
});

export const PaymentController = {
  ConfirmPayment,
  MakePayemnt,
  FailPayment,
  getPaymentList,
};
