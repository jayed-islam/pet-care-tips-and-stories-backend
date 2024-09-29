/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IUser } from './user.interface';
import { User } from './user.model';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const updateUserDataIntoDB = async (
  userId: string,
  userData: Partial<IUser>,
  file: any,
  user: any,
) => {
  if (userId !== user._id) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  const existingUser = await User.findById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found');
  }

  // Only allow updating phone and fullName
  const allowedUpdates = ['phone', 'fullName'];
  const updates = Object.keys(userData);

  for (const update of updates) {
    if (!allowedUpdates.includes(update)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid field');
    }
  }

  if (file) {
    if (!existingUser.profilePicture) {
      const imageName = `${existingUser._id}`;
      const path = file?.path;

      const { secure_url }: any = await sendImageToCloudinary(imageName, path);
      userData.profilePicture = secure_url; // Set.profilePicture only if it's not already set
    } else {
      // If.profilePicture is already set, ignore file input
      delete userData.profilePicture;
    }
  }

  const userUpdatedData = await User.findByIdAndUpdate(userId, userData, {
    new: true,
  });

  return userUpdatedData;
};

const getAllUsers = async () => {
  return User.find();
};

const getUserByIdFromDB = async (userId: string) => {
  return User.findById(userId).select('email role');
};

export const UserService = {
  getUserByIdFromDB,
  getAllUsers,
  updateUserDataIntoDB,
};
