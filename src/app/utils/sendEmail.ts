import nodemailer from 'nodemailer';
import config from '../config';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';

export const sendEmail = async (to: string, html: string, subject: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com.',
      port: 587,
      secure: config.NODE_ENV === 'production',
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: config.NODEMAILER_ID,
        pass: config.NODEMAILER_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: 'jayedbagerhat@gmail.com', // sender address
      to, // list of receivers
      subject: subject, // Subject line
      text: html, // plain text body
      html, // html body
    });

    // console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Error sending email');
  }
};
