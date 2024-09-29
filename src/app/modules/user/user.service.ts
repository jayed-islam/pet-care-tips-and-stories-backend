/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IUser } from './user.interface';
import { User } from './user.model';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { Types } from 'mongoose';

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

// const getUserByIdFromDB = async (userId: string) => {
//   return User.findById(userId).select('email role');
// };

const getUserProfile = async (userId: string): Promise<any> => {
  const user = await User.findById(userId)
    .populate('followers', 'name profilePicture')
    .populate('following', 'name profilePicture')
    // .populate('posts')
    .exec();

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
  }

  return user;
};

const toggleFollowUser = async (
  currentUserId: Types.ObjectId,
  targetUserId: Types.ObjectId,
): Promise<any> => {
  if (currentUserId.equals(targetUserId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You cannot follow yourself.');
  }

  // Fetch both users
  const [targetUser, currentUser] = await Promise.all([
    User.findById(targetUserId),
    User.findById(currentUserId),
  ]);

  if (!targetUser || !currentUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
  }

  // // Ensure following is always an array
  const following = currentUser.following || [];

  const isFollowing = following.includes(targetUserId);

  // Check if currentUser is already following targetUser
  // const isFollowing = currentUser.following?.includes(targetUserId);

  // if (isFollowing) {
  //   // Unfollow
  //   await User.updateOne(
  //     { _id: currentUserId },
  //     { $pull: { following: targetUserId } },
  //   );
  //   await User.updateOne(
  //     { _id: targetUserId },
  //     { $pull: { followers: currentUserId } },
  //   );
  //   return { message: 'User unfollowed successfully.' };
  // } else {
  //   // Follow
  //   await User.updateOne(
  //     { _id: currentUserId },
  //     { $addToSet: { following: targetUserId } },
  //   );
  //   await User.updateOne(
  //     { _id: targetUserId },
  //     { $addToSet: { followers: currentUserId } },
  //   );
  //   return { message: 'User followed successfully.' };
  // }
  if (isFollowing) {
    // Unfollow logic
    await Promise.all([
      User.updateOne(
        { _id: currentUserId },
        { $pull: { following: targetUserId } },
      ),
      User.updateOne(
        { _id: targetUserId },
        { $pull: { followers: currentUserId } },
      ),
    ]);
    return { message: 'User unfollowed successfully.' };
  } else {
    // Follow logic
    await Promise.all([
      User.updateOne(
        { _id: currentUserId },
        { $addToSet: { following: targetUserId } },
      ),
      User.updateOne(
        { _id: targetUserId },
        { $addToSet: { followers: currentUserId } },
      ),
    ]);
    return { message: 'User followed successfully.' };
  }
};

export const UserService = {
  getUserProfile,
  getAllUsers,
  updateUserDataIntoDB,
  toggleFollowUser,
};
