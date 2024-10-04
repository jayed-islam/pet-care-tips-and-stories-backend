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
  try {
    // Check if there are files and map the 'path' values to the imageUrls array
    let imageUrls: string[] | undefined = undefined;

    if (files && files.length > 0) {
      imageUrls = files.map((file) => file.path);
    }

    // Create the post with the imageUrls field only if it exists and is not empty
    const postDataWithImages = imageUrls
      ? { ...postData, author, imageUrls }
      : { ...postData, author };

    const post = await Post.create(postDataWithImages);

    return post;
  } catch (error) {
    console.error(error);
    throw new AppError(httpStatus.CONFLICT, 'Server error');
  }
};

// // Get all posts with optional filtering, sorting, and search
// const getAllPosts = async (
//   filterOptions: {
//     category?: string;
//     search?: string;
//     sortBy?: 'upvotes' | 'newest';
//     page?: number;
//     limit?: number;
//   } = {},
// ) => {
//   const {
//     category,
//     search,
//     sortBy = 'upvotes',
//     page = 1,
//     limit = 10,
//   } = filterOptions;

//   const query: any = { isDeleted: false, isPublished: true };

//   // Apply filtering by category if provided
//   if (category) {
//     query.category = category;
//   }

//   // Apply searching by content if provided
//   if (search) {
//     query.$or = [
//       { title: { $regex: search, $options: 'i' } },
//       { content: { $regex: search, $options: 'i' } },
//     ];
//   }

//   // Calculate the number of documents to skip for pagination
//   const skip = (page - 1) * limit;

//   // Correct sorting options
//   const sortOptions: { [key: string]: SortOrder } =
//     sortBy === 'upvotes' ? { upvotes: -1 } : { createdAt: 1 };

//   // Get posts with sorting by upvotes or createdAt date, apply pagination
//   const posts = await Post.find(query)
//     .populate('author', 'name profilePicture')
//     .populate('category', 'name description')
//     .sort(sortOptions)
//     .skip(skip)
//     .limit(limit);

//   // Get the total number of posts for pagination
//   const totalCount = await Post.countDocuments(query);

//   const meta = {
//     currentPage: page,
//     totalPages: Math.ceil(totalCount / limit),
//     totalPosts: totalCount,
//   };

//   return {
//     posts,
//     meta,
//   };
// };

// Get all posts with optional filtering, sorting, and search

const getHomePosts = async (
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

  // Correct sorting options based on 'sortBy' option
  const sortOptions: { [key: string]: SortOrder } =
    sortBy === 'upvotes' ? { upvotes: -1 } : { createdAt: -1 };

  // Using Promise.all to fetch posts, latestPosts, and totalCount simultaneously
  const [posts, latestPosts, totalCount] = await Promise.all([
    Post.find(query)
      .populate('author', 'name profilePicture')
      .populate('category', 'name description')
      .sort({ createdAt: -1 })
      .limit(6),

    Post.find(query)
      .populate('author', 'name profilePicture')
      .populate('category', 'name description')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit),

    Post.countDocuments(query),
  ]);

  const meta = {
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
    totalPosts: totalCount,
    hasNextPage: page * limit < totalCount,
    hasPrevPage: page > 1,
  };

  return {
    posts,
    latestPosts,
    meta,
  };
};

// const getAllPosts = async (
//   filterOptions: {
//     category?: string;
//     search?: string;
//     sortBy?: 'upvotes' | 'newest';
//     page?: number;
//     limit?: number;
//   } = {},
// ) => {
//   const {
//     category,
//     search,
//     sortBy = 'upvotes',
//     page = 1,
//     limit = 10,
//   } = filterOptions;

//   const query: any = { isDeleted: false, isPublished: true };

//   // Apply filtering by category if provided
//   // Normalize category input
//   if (category) {
//     // Split by comma and trim whitespace
//     const categoryArray = category.split(',').map((cat) => cat.trim());
//     // Convert the array of category strings to ObjectId
//     query.category = {
//       $in: categoryArray,
//     };
//   }

//   // Apply searching by content if provided
//   if (search) {
//     query.$or = [
//       { title: { $regex: search, $options: 'i' } },
//       { content: { $regex: search, $options: 'i' } },
//     ];
//   }

//   // Calculate the number of documents to skip for pagination
//   const skip = (page - 1) * limit;

//   // Correct sorting options based on 'sortBy' option
//   const sortOptions: { [key: string]: SortOrder } =
//     sortBy === 'upvotes' ? { upvotes: -1 } : { createdAt: -1 };

//   // Using Promise.all to fetch posts, latestPosts, and totalCount simultaneously
//   const [posts, totalCount] = await Promise.all([
//     Post.find(query)
//       .populate('author', 'name profilePicture')
//       .populate('category', 'name description')
//       .sort(sortOptions)
//       .skip(skip)
//       .limit(limit),

//     Post.countDocuments(query),
//   ]);

//   const meta = {
//     currentPage: page,
//     totalPages: Math.ceil(totalCount / limit),
//     totalPosts: totalCount,
//     hasNextPage: page * limit < totalCount,
//     hasPrevPage: page > 1,
//   };

//   return {
//     posts,
//     meta,
//   };
// };

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
    const categoryArray = category.split(',').map((cat) => cat.trim());
    query.category = {
      $in: categoryArray,
    };
  }

  // Apply searching by title or content if provided
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  // Calculate the number of documents to skip for pagination
  const skip = (page - 1) * limit;

  // Fetch posts from the database
  const posts = await Post.find(query)
    .populate('author', '') // Populating all fields of the User model
    .populate('category', 'name description')
    .skip(skip)
    .limit(limit);

  // Sort posts based on the specified criteria
  const sortedPosts =
    sortBy === 'upvotes'
      ? posts.sort((a, b) => b.upvotes.length - a.upvotes.length) // Sort by upvotes count
      : posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by createdAt date

  // Get the total count of documents
  const totalCount = await Post.countDocuments(query);

  // Prepare pagination meta information
  const meta = {
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
    totalPosts: totalCount,
    hasNextPage: page * limit < totalCount,
    hasPrevPage: page > 1,
  };

  return {
    posts: sortedPosts,
    meta,
  };
};

// const getAllPosts = async (
//   filterOptions: {
//     category?: string;
//     search?: string;
//     sortBy?: 'upvotes' | 'newest';
//     page?: number;
//     limit?: number;
//   } = {},
// ) => {
//   const {
//     category,
//     search,
//     sortBy = 'upvotes',
//     page = 1,
//     limit = 10,
//   } = filterOptions;

//   const query: any = { isDeleted: false, isPublished: true };

//   // Apply filtering by category if provided
//   if (category) {
//     const categoryArray = category.split(',').map((cat) => cat.trim());
//     query.category = {
//       $in: categoryArray,
//     };
//   }

//   // Apply searching by title or content if provided
//   if (search) {
//     query.$or = [
//       { title: { $regex: search, $options: 'i' } },
//       { content: { $regex: search, $options: 'i' } },
//     ];
//   }

//   // Calculate pagination
//   const skip = (page - 1) * limit;

//   // Set correct sorting options based on upvotes or newest
//   const sortOptions: Record<string, 1 | -1> =
//     sortBy === 'upvotes' ? { upvotesCount: -1 } : { createdAt: -1 };

//   // Fetch posts with dynamic sorting based on upvotes count
//   const [posts, totalCount] = await Promise.all([
//     Post.aggregate([
//       { $match: query }, // Match based on query filters
//       {
//         $addFields: {
//           upvotesCount: { $size: '$upvotes' }, // Dynamically calculate upvotes count
//         },
//       },
//       { $sort: sortOptions }, // Sort by upvotesCount or createdAt
//       { $skip: skip }, // Apply pagination
//       { $limit: limit },
//       {
//         $lookup: {
//           from: 'users',
//           localField: 'author',
//           foreignField: '_id',
//           as: 'author',
//         },
//       },
//       {
//         $lookup: {
//           from: 'categories',
//           localField: 'category',
//           foreignField: '_id',
//           as: 'category',
//         },
//       },
//       {
//         // Exclude the 'password' field from the populated 'author' field
//         $project: {
//           'author.password': 0,
//         },
//       },
//     ]).exec(),

//     Post.countDocuments(query),
//   ]);

//   const meta = {
//     currentPage: page,
//     totalPages: Math.ceil(totalCount / limit),
//     totalPosts: totalCount,
//     hasNextPage: page * limit < totalCount,
//     hasPrevPage: page > 1,
//   };

//   return {
//     posts,
//     meta,
//   };
// };

const getSinglePost = async (postId: string) => {
  try {
    const post = await Post.findOne({
      _id: postId,
      isDeleted: false,
      isPublished: true,
    })
      .populate('author', 'name profilePicture')
      .populate('category', 'name description')
      .populate('comments', 'author content post createdAt');

    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
    }

    const relatedPosts = await Post.find({
      category: post.category._id,
      _id: { $ne: postId },
      isDeleted: false,
      isPublished: true,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    return {
      post,
      relatedPosts,
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};

// Get posts by a specific user with optional filtering, sorting, and search
const getUserPosts = async (
  userId: string,
  filterOptions: {
    category?: string[];
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

  const query: any = { isDeleted: false, isPublished: true, author: userId };

  // Apply filtering by category if provided
  if (category) {
    query.category = { $in: category };
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

  // Get posts made by the specific user, applying filters, sorting, and pagination
  const posts = await Post.find(query)
    .populate('author', 'name profilePicture')
    .populate('category', 'name description')
    .skip(skip)
    .limit(limit);

  const sortedPosts =
    sortBy === 'upvotes'
      ? posts.sort((a, b) => b.upvotes.length - a.upvotes.length) // Sort by upvotes count
      : posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Get the total number of posts for pagination
  const totalCount = await Post.countDocuments(query);

  const meta = {
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
    totalPosts: totalCount,
  };

  return {
    posts: sortedPosts,
    meta,
  };
};

// // Update a post by ID with author check
// const updatePost = async (
//   postId: string,
//   updateData: Partial<IPost>,
//   user: any,
//   files: any[],
// ): Promise<IPost | null> => {
//   const post = await Post.findById(postId);

//   if (!post) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
//   }

//   // Check if the user is the author or an admin
//   if (!post.author.equals(user._id) && user.role !== 'admin') {
//     throw new AppError(
//       httpStatus.FORBIDDEN,
//       'You are not authorized to update this post',
//     );
//   }

//   let imageUrls: string[] | undefined = undefined;

//   if (files && files.length > 0) {
//     imageUrls = files.map((file) => file.path);
//   }

//   // Define allowed fields for regular users
//   const allowedUpdates = [
//     'category',
//     'content',
//     'isPremium',
//     'imageUrls',
//     'price',
//   ];

//   // If the user is not an admin, filter the updateData to only include allowed fields
//   if (user.role !== 'admin') {
//     Object.keys(updateData).forEach((key) => {
//       if (!allowedUpdates.includes(key)) {
//         delete updateData[key as keyof IPost];
//       }
//     });
//   }

//   // Update the post with filtered updateData
//   const updatedPost = await Post.findByIdAndUpdate(postId, updateData, {
//     new: true,
//   });

//   return updatedPost;
// };

// Update a post by ID with author check
const updatePost = async (
  postId: string,
  updateData: Partial<IPost>,
  user: any,
  files: any[],
): Promise<IPost | null> => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  // Check if the user is the author or an admin
  if (!post.author.equals(user._id) && user.role !== 'admin') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not authorized to update this post',
    );
  }

  // Define allowed fields for regular users
  const allowedUpdates = [
    'category',
    'content',
    'isPremium',
    'imageUrls',
    'price',
  ];

  // If the user is not an admin, filter the updateData to only include allowed fields
  if (user.role !== 'admin') {
    Object.keys(updateData).forEach((key) => {
      if (!allowedUpdates.includes(key)) {
        delete updateData[key as keyof IPost];
      }
    });
  }

  // Handle image URLs
  let imageUrls: string[] = post.imageUrls || []; // Start with existing image URLs or an empty array

  // Check if there are new image files uploaded
  if (files && files.length > 0) {
    const newFilePaths = files.map((file) => file.path);
    // If updateData.imageUrls is provided, append new paths to it
    if (updateData.imageUrls && Array.isArray(updateData.imageUrls)) {
      imageUrls = [...updateData.imageUrls, ...newFilePaths]; // Combine existing and new image URLs
    } else {
      imageUrls = [...imageUrls, ...newFilePaths]; // Just add new image URLs if no existing ones
    }
  } else if (updateData.imageUrls && Array.isArray(updateData.imageUrls)) {
    // If no new files are uploaded but updateData has imageUrls, use them
    imageUrls = updateData.imageUrls;
  }

  // Add imageUrls to updateData if they exist
  if (imageUrls.length > 0) {
    updateData.imageUrls = imageUrls;
  }

  // Update the post with filtered updateData
  const updatedPost = await Post.findByIdAndUpdate(postId, updateData, {
    new: true,
    runValidators: true, // This ensures that the updated document is validated against the schema
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

// const votePost = async (
//   postId: string,
//   userId: Types.ObjectId,
//   voteType: 'upvote' | 'downvote',
// ): Promise<IPost | null> => {
//   // Find the post
//   const post = await Post.findById(postId);

//   if (!post) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
//   }

//   // Define the update query logic
//   let update = {};

//   if (voteType === 'upvote') {
//     // Toggle upvote: Remove upvote if already present, or add upvote and remove downvote
//     if (post.upvotes.includes(userId)) {
//       update = { $pull: { upvotes: userId } }; // Remove the upvote
//     } else {
//       update = {
//         $addToSet: { upvotes: userId }, // Add to upvotes if not already present
//         $pull: { downvotes: userId }, // Remove from downvotes if present
//       };
//     }
//   } else if (voteType === 'downvote') {
//     // Toggle downvote: Remove downvote if already present, or add downvote and remove upvote
//     if (post.downvotes.includes(userId)) {
//       update = { $pull: { downvotes: userId } }; // Remove the downvote
//     } else {
//       update = {
//         $addToSet: { downvotes: userId }, // Add to downvotes if not already present
//         $pull: { upvotes: userId }, // Remove from upvotes if present
//       };
//     }
//   }

//   const updatedPost = await Post.findOneAndUpdate({ _id: postId }, update, {
//     new: true,
//   });

//   return updatedPost;
// };
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
    // If the user has already upvoted, remove the upvote
    if (post.upvotes.includes(userId)) {
      update = { $pull: { upvotes: userId } }; // Remove the upvote
    } else {
      // If the user has downvoted, remove the downvote and add the upvote
      if (post.downvotes.includes(userId)) {
        update = {
          $pull: { downvotes: userId }, // Remove the downvote
          $addToSet: { upvotes: userId }, // Add to upvotes
        };
      } else {
        // Just add the upvote if there are no existing votes
        update = { $addToSet: { upvotes: userId } };
      }
    }
  } else if (voteType === 'downvote') {
    // If the user has already downvoted, remove the downvote
    if (post.downvotes.includes(userId)) {
      update = { $pull: { downvotes: userId } }; // Remove the downvote
    } else {
      // If the user has upvoted, remove the upvote and add the downvote
      if (post.upvotes.includes(userId)) {
        update = {
          $pull: { upvotes: userId }, // Remove the upvote
          $addToSet: { downvotes: userId }, // Add to downvotes
        };
      } else {
        // Just add the downvote if there are no existing votes
        update = { $addToSet: { downvotes: userId } };
      }
    }
  }

  // Update the post with the new vote state
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
  getHomePosts,
  getSinglePost,
};
