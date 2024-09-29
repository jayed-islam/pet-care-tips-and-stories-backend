import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { CommentServices } from './comment.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

// Create a comment
const createComment = catchAsync(async (req: Request, res: Response) => {
  const { postId, content } = req.body;
  const userId = req.user.id; // Assuming req.user contains authenticated user data

  const comment = await CommentServices.createComment(postId, userId, content);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment created successfully.',
    data: comment,
  });
});

// Get comments for a post
const getCommentsForPost = catchAsync(async (req, res) => {
  const postId = req.params.postId;

  const comments = await CommentServices.getCommentsForPost(postId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comments retrived successfully.',
    data: comments,
  });
});

// Delete a comment
const deleteComment = catchAsync(async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.user.id;

  const result = await CommentServices.deleteComment(commentId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment deleted successfully.',
    data: result,
  });
});

// Export controller functions
export const CommentControllers = {
  createComment,
  getCommentsForPost,
  deleteComment,
};
