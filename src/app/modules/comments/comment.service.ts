import { Types } from 'mongoose';
import httpStatus from 'http-status';
import { Comment } from './comment.model';
import AppError from '../../errors/AppError';

// Create a new comment
const createComment = async (
  postId: Types.ObjectId,
  userId: Types.ObjectId,
  content: string,
) => {
  const comment = new Comment({
    post: postId,
    author: userId,
    content,
  });

  return await comment.save();
};

// Get comments for a post
const getCommentsForPost = async (postId: string) => {
  return await Comment.find({ post: postId })
    .populate('author', 'username profilePicture') // Populate username and profilePicture
    .exec(); // Ensures the query is executed and returns a promise
};

// Delete a comment
const deleteComment = async (commentId: string, userId: Types.ObjectId) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found.');
  }

  if (comment.author.toString() !== userId.toString()) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You do not have permission to delete this comment.',
    );
  }

  const result = await Comment.deleteOne({ _id: commentId });
  return result;
};

// Export functions
export const CommentServices = {
  createComment,
  getCommentsForPost,
  deleteComment,
};
