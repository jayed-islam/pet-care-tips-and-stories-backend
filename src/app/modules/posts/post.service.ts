/* eslint-disable @typescript-eslint/no-explicit-any */
// services/post.service.ts
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IPost } from './post.interface';
import { Post } from './post.model';
import { Types } from 'mongoose';

import { SortOrder } from 'mongoose';

// Create a new post
const createPost = async (postData: IPost, author: string, files: any[]) => {
  console.log('files', files);
  try {
    // if (files && files.length > 0) {
    //   const imageNames = files.map(
    //     (_, index) =>
    //       `${postData.title.replace(/\s+/g, '-')}-${author}-${Date.now()}-${index}`,
    //   );
    //   const paths = files.map((file) => file.path);
    //   const results = await sendMultipleImagesToCloudinary(imageNames, paths);
    //   postData.imageUrls = results.map((result: any) => result.secure_url);
    // }
    // const post = await Post.create({ ...postData, author });
    // return post;
    // return post;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    throw new AppError(httpStatus.CONFLICT, 'Server error');
  }
};

// Get all posts with optional filtering, sorting, and search
const getAllPosts = async (
  filterOptions: {
    category?: string;
    search?: string;
    sortBy?: 'upvotes' | 'newest';
    page?: number;
    limit?: number;
  } = {},
) => {
  const {
    category,
    search,
    sortBy = 'upvotes',
    page = 1,
    limit = 10,
  } = filterOptions;

  const query: any = { isDeleted: false, isPublished: true };

  // Apply filtering by category if provided
  if (category) {
    query.category = category;
  }

  // Apply searching by content if provided
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  // Calculate the number of documents to skip for pagination
  const skip = (page - 1) * limit;

  // Correct sorting options
  const sortOptions: { [key: string]: SortOrder } =
    sortBy === 'upvotes' ? { upvotes: -1 } : { createdAt: -1 };

  // Get posts with sorting by upvotes or createdAt date, apply pagination
  const posts = await Post.find(query)
    .populate('author', 'name profilePicture')
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  // Get the total number of posts for pagination
  const totalCount = await Post.countDocuments(query);

  const meta = {
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
    totalPosts: totalCount,
  };

  return {
    posts,
    meta,
  };
};

// Get posts by a specific user with optional filtering, sorting, and search
const getUserPosts = async (
  userId: string,
  filterOptions: {
    category?: string;
    search?: string;
    sortBy?: 'upvotes' | 'newest';
    page?: number;
    limit?: number;
  } = {},
) => {
  const {
    category,
    search,
    sortBy = 'newest',
    page = 1,
    limit = 10,
  } = filterOptions;

  const query: any = { isDeleted: false, isPublished: true, author: userId }; // Filter by userId and isDeleted

  // Apply filtering by category if provided
  if (category) {
    query.category = category;
  }

  // Apply searching by content if provided
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  // Calculate the number of documents to skip for pagination
  const skip = (page - 1) * limit;

  // Correct sorting options
  const sortOptions: { [key: string]: SortOrder } =
    sortBy === 'upvotes' ? { upvotes: -1 } : { createdAt: -1 };

  // Get posts made by the specific user, applying filters, sorting, and pagination
  const posts = await Post.find(query)
    .populate('author', 'name profilePicture')
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  // Get the total number of posts for pagination
  const totalCount = await Post.countDocuments(query);

  const meta = {
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
    totalPosts: totalCount,
  };

  return {
    posts,
    meta,
  };
};

// Update a post by ID with author check
const updatePost = async (
  postId: string,
  updateData: Partial<IPost>,
  userId: string,
): Promise<IPost | null> => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  // Check if the user is the author
  if (!post.author.equals(userId)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not authorized to update this post',
    );
  }

  const updatedPost = await Post.findByIdAndUpdate(postId, updateData, {
    new: true,
  });

  return updatedPost;
};

// Delete a post by ID (soft delete) with author check
const deletePost = async (
  postId: string,
  userId: string,
): Promise<IPost | null> => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  // Check if the user is the author
  if (!post.author.equals(userId)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not authorized to delete this post',
    );
  }

  const deletedPost = await Post.findByIdAndUpdate(
    postId,
    { isDeleted: true },
    { new: true },
  );

  return deletedPost;
};

const votePost = async (
  postId: string,
  userId: Types.ObjectId,
  voteType: 'upvote' | 'downvote',
): Promise<IPost | null> => {
  // Find the post
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  // Define the update query logic
  let update = {};

  if (voteType === 'upvote') {
    // Toggle upvote: Remove upvote if already present, or add upvote and remove downvote
    if (post.upvotes.includes(userId)) {
      update = { $pull: { upvotes: userId } }; // Remove the upvote
    } else {
      update = {
        $addToSet: { upvotes: userId }, // Add to upvotes if not already present
        $pull: { downvotes: userId }, // Remove from downvotes if present
      };
    }
  } else if (voteType === 'downvote') {
    // Toggle downvote: Remove downvote if already present, or add downvote and remove upvote
    if (post.downvotes.includes(userId)) {
      update = { $pull: { downvotes: userId } }; // Remove the downvote
    } else {
      update = {
        $addToSet: { downvotes: userId }, // Add to downvotes if not already present
        $pull: { upvotes: userId }, // Remove from upvotes if present
      };
    }
  }

  const updatedPost = await Post.findOneAndUpdate({ _id: postId }, update, {
    new: true,
  });

  return updatedPost;
};

export const PostServices = {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
  votePost,
  getUserPosts,
};
