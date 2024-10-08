/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IUser } from './user.interface';
import { User } from './user.model';
import { Types } from 'mongoose';

const updateUserDataIntoDB = async (
  userId: string,
  userData: Partial<IUser>,
  user: any,
) => {
  console.log('user', userData);
  if (userId !== user._id) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  const existingUser = await User.findById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found');
  }

  // Only allow updating selected field
  const allowedUpdates = ['phone', 'name', 'bio', 'address'];
  const updates = Object.keys(userData);

  for (const update of updates) {
    if (!allowedUpdates.includes(update)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid field');
    }
  }

  const userUpdatedData = await User.findByIdAndUpdate(userId, userData, {
    new: true,
  });

  return userUpdatedData;
};

const updateUserByAdmin = async (userId: string, userData: Partial<IUser>) => {
  const existingUser = await User.findById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found');
  }

  const userUpdatedData = await User.findByIdAndUpdate(userId, userData, {
    new: true,
  });

  return userUpdatedData;
};

const updateUserProfilePicture = async (
  userId: string,
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

  // Check if the file is provided
  if (file) {
    const profilePicturePath = file.path;

    // Check if the file path exists
    if (!profilePicturePath) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Profile picture cannot update',
      );
    }

    // Update the user's profile picture in the database
    const userUpdatedData = await User.findByIdAndUpdate(
      userId,
      { profilePicture: profilePicturePath }, // Set the new profile picture path
      { new: true }, // Return the updated document
    );

    return userUpdatedData;
  }

  throw new AppError(httpStatus.BAD_REQUEST, 'No file provided');
};

const getAllUsers = async () => {
  return User.find().select('-password');
};

const getUserProfile = async (userId: string): Promise<any> => {
  const user = await User.findById(userId)
    .populate({
      path: 'followers',
      select: '-password',
    })
    .populate({
      path: 'following',
      select: '-password',
    })
    .populate({
      path: 'purchasedPosts',
      populate: [{ path: 'author', select: '-password' }, { path: 'category' }],
    })
    .sort({ createdAt: -1 })
    .exec();

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
  }

  return user;
};

const toggleFollowUser = async (
  currentUserId: string,
  targetUserId: string,
): Promise<any> => {
  if (currentUserId === targetUserId) {
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

  const targetedID = new Types.ObjectId(targetUserId);

  const isFollowing = following.includes(targetedID);

  // Check if currentUser is already following targetUser
  // const isFollowing = currentUser.following?.includes(targetUserId);

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
  updateUserProfilePicture,
  updateUserByAdmin,
};
