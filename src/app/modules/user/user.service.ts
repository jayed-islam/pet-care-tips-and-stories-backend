/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IUser } from './user.interface';
import { User } from './user.model';
import mongoose, { Types } from 'mongoose';
import { Payment } from '../payment/payment.model';
import { Page } from '../page/page.model';
import { Post } from '../posts/post.model';
import { Category } from '../category/category.model';

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

const getUserListForUser = async (
  search: string,
  userType: string,
  page: number,
  limit: number,
  userId: string,
) => {
  try {
    const filter: any = { status: 'active' };

    if (userId) {
      filter._id = { $ne: userId };
    }

    // Add search filter for name, email, or phone
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    // Add userType filter if provided
    if (userType) {
      filter.userType = userType;
    }

    // Count total matching users
    const totalCount = await User.countDocuments(filter);

    // Fetch filtered users with pagination
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const pagination = {
      itemsPerPage: limit,
      pageIndex: page,
      totalPages: Math.ceil(totalCount / limit),
      totalItems: totalCount,
    };

    return { users, pagination };
  } catch (error) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
  }
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
      path: 'sentFriendRequests',
      select: '-password',
    })
    .populate({
      path: 'receivedFriendRequests',
      select: '-password',
    })
    .populate({
      path: 'friends',
      select: '-password',
    })
    .populate({
      path: 'pages',
      populate: [
        { path: 'followers', select: '-password' },
        { path: 'createdBy' },
      ],
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

const handleFriendRequest = async (
  userId: Types.ObjectId,
  targetUserId: Types.ObjectId,
  action: 'send' | 'cancel' | 'accept',
) => {
  const user = await User.findById(userId);
  const targetUser = await User.findById(targetUserId);

  if (!user || !targetUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User or Target User not found');
  }

  switch (action) {
    case 'send':
      // Check if the user has already sent a request or if they are already friends
      if (user.sentFriendRequests.includes(targetUserId)) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Friend request already sent',
        );
      }
      if (user.friends.includes(targetUserId)) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Already friends');
      }

      // Add to sent friend requests
      user.sentFriendRequests.push(targetUserId);
      targetUser.receivedFriendRequests.push(userId);
      await user.save();
      await targetUser.save();

      return { message: 'Friend request sent successfully', data: user };

    case 'cancel':
      // Check if the user has sent a request
      if (!user.sentFriendRequests.includes(targetUserId)) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'No friend request to cancel',
        );
      }

      // Remove from sent friend requests and target user received requests
      user.sentFriendRequests = user.sentFriendRequests.filter(
        (request) => !request.equals(targetUserId),
      );
      targetUser.receivedFriendRequests =
        targetUser.receivedFriendRequests.filter(
          (request) => !request.equals(userId),
        );
      await user.save();
      await targetUser.save();

      return { message: 'Friend request canceled', data: user };

    case 'accept':
      // Check if the user has received a friend request
      if (!user.receivedFriendRequests.includes(targetUserId)) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'No friend request to accept',
        );
      }

      // Add both users as friends
      user.friends.push(targetUserId);
      targetUser.friends.push(userId);

      // Remove the friend request from both users
      user.receivedFriendRequests = user.receivedFriendRequests.filter(
        (request) => !request.equals(targetUserId),
      );
      targetUser.sentFriendRequests = targetUser.sentFriendRequests.filter(
        (request) => !request.equals(userId),
      );

      await user.save();
      await targetUser.save();

      return { message: 'Friend request accepted successfully', data: user };

    default:
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid action');
  }
};

const removeFriend = async (userId: string, targetUserId: string) => {
  const user = await User.findById(userId);
  const targetUser = await User.findById(targetUserId);

  if (!user || !targetUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User or Target User not found');
  }

  // Remove the target user from both users' friends lists
  user.friends = user.friends.filter((friend) => !friend.equals(targetUserId));
  targetUser.friends = targetUser.friends.filter(
    (friend) => !friend.equals(userId),
  );

  await user.save();
  await targetUser.save();

  return { message: 'Friend removed successfully', data: null };
};
const getSummary = async () => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const today = new Date();
    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(today.getDate() - 7);

    const users = await User.find({
      createdAt: { $gte: lastWeekStart, $lt: today },
    })
      .sort({ createdAt: -1 })
      .limit(15)
      .session(session);

    // Revenue in the last week (Payment Revenue)
    const lastWeekRevenue = await Payment.aggregate([
      {
        $match: {
          status: 'COMPLETED',
          createdAt: { $gte: lastWeekStart, $lt: today },
        },
      },
      {
        $group: { _id: null, total: { $sum: '$amount' } }, // assuming 'amount' is the payment field
      },
    ]).session(session);

    // User count
    const usersCount = await User.countDocuments().session(session);

    // Pages count (pages are assumed to be a model like 'Page')
    const pagesCount = await Page.countDocuments().session(session);

    const postCount = await Post.countDocuments().session(session);

    // Category distribution (for pages or posts)
    const categoryDistributionRaw = await Post.aggregate([
      // assuming posts are categorized
      {
        $match: {
          createdAt: { $gte: lastWeekStart, $lt: today }, // filter for the last week if required
        },
      },
      {
        $group: {
          _id: '$category', // assuming 'category' is a field in your Post model
          count: { $sum: 1 },
        },
      },
    ]).session(session);

    const categories = await Category.find({
      _id: { $in: categoryDistributionRaw.map((item: any) => item._id) },
    }).session(session);

    const categoryDistribution = categoryDistributionRaw.map((item: any) => {
      const category = categories.find(
        (cat: any) => cat._id.toString() === item._id.toString(),
      );
      return {
        category: category ? category.name : 'Unknown',
        count: item.count,
      };
    });

    // Weekly revenue data
    const revenueOverviewRaw = await Payment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: '$createdAt' },
          totalRevenue: { $sum: '$amount' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]).session(session);

    const revenueOverview = Array.from({ length: 7 }, (_, i) => {
      const day = i + 1; // Day of week (1=Sunday, 7=Saturday)
      const data = revenueOverviewRaw.find((item: any) => item._id === day);
      return {
        day,
        totalRevenue: data ? data.totalRevenue : 0,
      };
    });

    // Prepare summary and chart data
    const summary = {
      revenue: lastWeekRevenue[0]?.total || 0,
      users: usersCount,
      pages: pagesCount,
      posts: postCount,
    };

    const chartData = {
      revenueOverview,
      categoryDistribution,
    };

    await session.commitTransaction();
    session.endSession();

    return {
      summary,
      chartData,
      users,
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to retrieve summary data',
    );
  }
};

export const UserService = {
  getUserProfile,
  getAllUsers,
  updateUserDataIntoDB,
  toggleFollowUser,
  updateUserProfilePicture,
  updateUserByAdmin,
  handleFriendRequest,
  removeFriend,
  getUserListForUser,
  getSummary,
};
