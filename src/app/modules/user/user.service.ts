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
  return User.find();
};

// const getUserByIdFromDB = async (userId: string) => {
//   return User.findById(userId).select('email role');
// };

const getUserProfile = async (userId: string): Promise<any> => {
  const user = await User.findById(userId)
    .populate({
      path: 'purchasedPosts',
      populate: [{ path: 'author', select: '-password' }, { path: 'category' }],
    })
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
// const toggleFollowUser = async (
//   currentUserId: string,
//   targetUserId: string,
// ): Promise<any> => {
//   if (currentUserId === targetUserId) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'You cannot follow yourself.');
//   }

//   // Start a session for the transaction
//   const session = await startSession();
//   await session.startTransaction();

//   try {
//     // Fetch both users within the transaction session
//     const [targetUser, currentUser] = await Promise.all([
//       User.findById(targetUserId).session(session),
//       User.findById(currentUserId).session(session),
//     ]);

//     if (!targetUser || !currentUser) {
//       throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
//     }

//     // Ensure following is always an array
//     const following = currentUser.following || [];
//     const targetedID = new Types.ObjectId(targetUserId);
//     const isFollowing = following.includes(targetedID);

//     if (isFollowing) {
//       // Unfollow logic
//       await Promise.all([
//         User.updateOne(
//           { _id: currentUserId },
//           { $pull: { following: targetUserId } },
//           { session },
//         ),
//         User.updateOne(
//           { _id: targetUserId },
//           { $pull: { followers: currentUserId } },
//           { session },
//         ),
//       ]);
//       await session.commitTransaction();
//       return { message: 'User unfollowed successfully.' };
//     } else {
//       // Follow logic
//       await Promise.all([
//         User.updateOne(
//           { _id: currentUserId },
//           { $addToSet: { following: targetUserId } },
//           { session },
//         ),
//         User.updateOne(
//           { _id: targetUserId },
//           { $addToSet: { followers: currentUserId } },
//           { session },
//         ),
//       ]);
//       await session.commitTransaction();
//       return { message: 'User followed successfully.' };
//     }
//   } catch (error: any) {
//     // Roll back the transaction in case of error
//     await session.abortTransaction();
//     throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
//   } finally {
//     // End the session
//     session.endSession();
//   }
// };

// const toggleFollowUser = async (
//   currentUserId: string,
//   targetUserId: string,
// ): Promise<any> => {
//   if (currentUserId === targetUserId) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'You cannot follow yourself.');
//   }

//   // Start a session for the transaction
//   const session = await startSession();
//   try {
//     await session.startTransaction();

//     // Fetch both users within the transaction session
//     const [targetUser, currentUser] = await Promise.all([
//       User.findById(targetUserId).session(session),
//       User.findById(currentUserId).session(session),
//     ]);

//     if (!targetUser || !currentUser) {
//       throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
//     }

//     // Ensure following is always an array
//     const following = currentUser.following || [];
//     const targetedID = new Types.ObjectId(targetUserId);
//     const isFollowing = following.includes(targetedID);

//     if (isFollowing) {
//       // Unfollow logic
//       await Promise.all([
//         User.updateOne(
//           { _id: currentUserId },
//           { $pull: { following: targetUserId } },
//           { session },
//         ),
//         User.updateOne(
//           { _id: targetUserId },
//           { $pull: { followers: currentUserId } },
//           { session },
//         ),
//       ]);
//       await session.commitTransaction();
//       await session.endSession();
//       return { message: 'User unfollowed successfully.' };
//     } else {
//       // Follow logic
//       await Promise.all([
//         User.updateOne(
//           { _id: currentUserId },
//           { $addToSet: { following: targetUserId } },
//           { session },
//         ),
//         User.updateOne(
//           { _id: targetUserId },
//           { $addToSet: { followers: currentUserId } },
//           { session },
//         ),
//       ]);
//       await session.commitTransaction();
//       await session.endSession();
//       return { message: 'User followed successfully.' };
//     }
//   } catch (error: any) {
//     // Log the error for debugging
//     console.error('Error in toggleFollowUser:', error);
//     // Roll back the transaction in case of error
//     await session.abortTransaction();
//     throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
//   } finally {
//     // End the session
//     await session.endSession();
//   }
// };

export const UserService = {
  getUserProfile,
  getAllUsers,
  updateUserDataIntoDB,
  toggleFollowUser,
  updateUserProfilePicture,
};
