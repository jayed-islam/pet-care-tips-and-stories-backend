import nodemailer from 'nodemailer';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';

export const sendEmail = async (to: string, html: string, subject: string) => {
  // const transporter = nodemailer.createTransport({
  //   host: 'smtp.gmail.com.',
  //   port: 587,
  //   secure: config.NODE_ENV === 'production',
  //   auth: {
  //     // TODO: replace `user` and `pass` values from <https://forwardemail.net>
  //     user: 'jayedbagerhat@gmail.com',
  //     pass: 'mnns zphg gzoq xnca',
  //   },
  // });

  // await transporter.sendMail({
  //   from: 'jayedbagerhat@gmail.com', // sender address
  //   to, // list of receivers
  //   subject: subject, // Subject line
  //   text: html, // plain text body
  //   html, // html body
  // });

  try {
    // const transporter = nodemailer.createTransport({
    //   host: config.email_host, // e.g., smtp.gmail.com
    //   port: 587, // or 465 for SSL
    //   secure: false, // true for 465, false for other ports
    //   auth: {
    //     user: config.email_user, // your email
    //     pass: config.email_password, // your email password
    //   },
    //   tls: {
    //     rejectUnauthorized: false, // this may help with some SSL issues
    //   },
    // });

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com.',
      port: 587,
      secure: true,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: 'jayedbagerhat@gmail.com',
        pass: 'mnns zphg gzoq xnca',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // const info = await transporter.sendMail({
    //   from: config.email_from, // sender address
    //   to, // list of receivers
    //   subject, // Subject line
    //   text, // plain text body
    // });

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
