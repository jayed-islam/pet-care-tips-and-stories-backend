/* eslint-disable no-console */
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TAuthAdmin, TAuthUser } from '../user/user.constants';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import config from '../../config';
import { createToken } from './auth-utils';
import { User } from '../user/user.model';
import bcrypt from 'bcrypt';
import { sendEmail } from '../../utils/sendEmail';

const registerUserIntoDB = async ({ email, password }: TAuthUser) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exists');
  }

  const newUser = new User({ email, password });
  const result = await newUser.save();

  // const jwtPayload = {
  //   _id: result._id,
  //   email: result.email,
  //   role: result.role,
  // };

  // const verificationToken = createToken(
  //   jwtPayload,
  //   config.jwt_verification_secret as string,
  //   '10m',
  // );

  // const verificationLink = `${config.verify_user_ui_link}?id=${result._id}&token=${verificationToken} `;

  // // Send verification email
  // await sendEmail(
  //   newUser.email,
  //   `Please verify your email by clicking on the following link: ${verificationLink}`,
  //   'Verify your email!',
  // );

  return result;
};

const registerAdminIntoDB = async ({ email, password, key }: TAuthAdmin) => {
  if (key !== config.admin_register_key) {
    throw new AppError(httpStatus.FORBIDDEN, 'Unautorized');
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exists');
  }

  const newUser = new User({ email, password, role: 'admin' });
  const result = await newUser.save();
  return result;
};

// const verifyEmail = async (token: string, id: string) => {
//   let decoded: JwtPayload;
//   try {
//     decoded = jwt.verify(
//       token,
//       config.jwt_verification_secret as string,
//     ) as JwtPayload;
//   } catch (error) {
//     throw new AppError(
//       httpStatus.UNAUTHORIZED,
//       'Invalid or expired verification token',
//     );
//   }

//   const user = await User.findOne({ email: decoded.email });
//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//   }

//   user.isVerified = true;
//   await user.save();

//   return user;
// };

const verifyEmail = async (token: string, id: string) => {
  if (!token || !id) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Token and ID are required');
  }

  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(
      token,
      config.jwt_verification_secret as string,
    ) as JwtPayload;
  } catch (error) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Invalid or expired verification token',
    );
  }

  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.email !== decoded.email) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Token does not match the provided user ID',
    );
  }

  user.isVerified = true;
  await user.save();

  return user;
};

const loginUserFromDB = async ({ email, password }: TAuthUser) => {
  const user = await User.isUserExistsByEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // if (!user.isVerified) {
  //   throw new AppError(httpStatus.UNAUTHORIZED, 'User is not verified');
  // }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
  }

  if (user.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
  }

  const isPasswordMatched = await User.isPasswordMatched(
    password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password does not match');
  }

  // Create tokens and send to the client
  const jwtPayload = {
    _id: user._id,
    email: user.email,
    role: user.role,
  };

  // jwtPayload: {
  //   email: string;
  //   role: string;
  //   id: string;
  // },

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    user,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  console.log('payload', payload);

  // checking if the user exists
  const user = await User.isUserExistsByEmail(userData.email);

  console.log('user', user);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // checking if the old password is correct
  const isPasswordMatched = await User.isPasswordMatched(
    payload.oldPassword,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password does not match');
  }

  // hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  // update user password
  const res = await User.findOneAndUpdate(
    {
      email: userData.email,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
    { new: true },
  );

  return res;
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { iat, email } = decoded;

  // checking if the user is exist
  const user = await User.isUserExistsByEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  // checking if the user is verified
  const isVerified = user?.isVerified;

  if (!isVerified) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'This user is not verified!');
  }

  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  if (
    user.passwordChangedAt &&
    (await User.isJWTIssuedBeforePasswordChanged(
      user.passwordChangedAt,
      iat as number,
    ))
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload = {
    email: user.email,
    id: user._id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (email: string) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  const jwtPayload = {
    email: user.email,
    userId: user._id,
    role: user.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '5m',
  );

  const resetUILink = `${config.reset_pass_ui_link}?id=${user._id}&token=${resetToken} `;

  sendEmail(user.email, resetUILink, 'Reset your password!');

  console.log(resetUILink);

  return null;
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string,
) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(payload?.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  //localhost:3000?id=A-0001&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBLTAwMDEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDI4NTA2MTcsImV4cCI6MTcwMjg1MTIxN30.-T90nRaz8-KouKki1DkCSMAbsHyb9yDi0djZU3D6QO4

  if (payload.id !== decoded.userId) {
    console.log(payload.id, decoded.userId);
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      id: decoded.userId,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );
};

export const AuthServices = {
  registerUserIntoDB,
  loginUserFromDB,
  changePassword,
  refreshToken,
  resetPassword,
  forgetPassword,
  registerAdminIntoDB,
  verifyEmail,
};
