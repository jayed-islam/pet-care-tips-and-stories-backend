/* eslint-disable @typescript-eslint/no-explicit-any */
// controllers/post.controller.ts
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PostServices } from './post.service';
import { IPost } from './post.interface';

// Create a new post
const createPost = catchAsync(async (req: Request, res: Response) => {
  const postData: IPost = req.body;
  const author = req.user._id;
  const files = req.files as any[];

  const post = await PostServices.createPost(postData, author, files);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Post Created Successfully!',
    data: post,
  });
});

// Get all home posts with optional filtering, sorting, and search
const getHomePosts = catchAsync(async (req: Request, res: Response) => {
  const filterOptions = req.query;

  const posts = await PostServices.getHomePosts(filterOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Home Posts Fetched Successfully!',
    data: posts,
  });
});

// Get all posts with optional filtering, sorting, and search
const getAllPosts = catchAsync(async (req: Request, res: Response) => {
  const filterOptions = req.query;

  const posts = await PostServices.getAllPosts(filterOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Posts Fetched Successfully!',
    data: posts,
  });
});

// Get all posts with optional filtering, sorting, and search
const getSinglePost = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.id;

  const posts = await PostServices.getSinglePost(postId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Posts Fetched Successfully!',
    data: posts,
  });
});

// Get posts by a specific user
const getUserPosts = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const filterOptions = req.body;

  const userPosts = await PostServices.getUserPosts(userId, filterOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Posts Fetched Successfully!',
    data: userPosts,
  });
});

// Update a post by ID
const updatePost = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.id;
  const updateData: Partial<IPost> = req.body;
  const user = req.user;
  const files = req.files;

  const updatedPost = await PostServices.updatePost(
    postId,
    updateData,
    user,
    files as any[],
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post Updated Successfully!',
    data: updatedPost,
  });
});

// Delete a post by ID (soft delete)
const deletePost = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.id;
  const userId = req.user._id;

  await PostServices.deletePost(postId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post Deleted Successfully!',
    data: null,
  });
});

// Vote (upvote or downvote) on a post
const votePost = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.id;
  const userId = req.user._id;
  const { voteType } = req.body; // Vote type should be 'upvote' or 'downvote'

  const updatedPost = await PostServices.votePost(postId, userId, voteType);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Post ${voteType}d Successfully!`,
    data: updatedPost,
  });
});

export const PostControllers = {
  createPost,
  getAllPosts,
  getUserPosts,
  updatePost,
  deletePost,
  votePost,
  getHomePosts,
  getSinglePost,
};
