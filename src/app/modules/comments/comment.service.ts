/* eslint-disable @typescript-eslint/no-explicit-any */
import { startSession, Types } from 'mongoose';
import httpStatus from 'http-status';
import { Comment } from './comment.model';
import AppError from '../../errors/AppError';
import { Post } from '../posts/post.model';

// Create a new comment
const createComment = async (
  postId: Types.ObjectId,
  userId: Types.ObjectId,
  content: string,
) => {
  // Start a Mongoose session for transaction
  const session = await startSession();
  session.startTransaction();

  try {
    // Find the post to ensure it exists before creating a comment
    const post = await Post.findById(postId).session(session);
    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, 'Post not found.');
    }

    // Create the comment
    const comment = new Comment({
      post: postId,
      author: userId,
      content,
    });

    // Save the comment within the transaction
    const savedComment = await comment.save({ session });

    // Optionally, add the comment ID to the post's comments array
    post.comments.push(savedComment._id);

    // Update the post with the new comment reference within the transaction
    await post.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    return savedComment; // Return the saved comment
  } catch (error) {
    // Rollback the transaction in case of an error
    await session.abortTransaction();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create comment.',
    );
  } finally {
    // End the session
    session.endSession();
  }
};

// Get comments for a post
const getCommentsForPost = async (postId: string) => {
  return await Comment.find({ post: postId })
    .populate('author', 'name profilePicture')
    .exec();
};

// Delete a comment
const deleteComment = async (commentId: string, userId: Types.ObjectId) => {
  // Start a Mongoose session for transaction
  const session = await startSession();
  session.startTransaction();

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found.');
  }

  try {
    // Find the comment to ensure it exists

    // Check if the user is the author of the comment
    if (comment.author.toString() !== userId.toString()) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You do not have permission to delete this comment.',
      );
    }

    // Find the associated post and pull the comment ID from the comments array
    const post = await Post.findByIdAndUpdate(
      comment.post,
      { $pull: { comments: commentId } },
      { new: true, session },
    );

    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, 'Post not found.');
    }

    // Delete the comment using findByIdAndDelete
    const reault = await Comment.findByIdAndDelete(commentId, { session });

    // Commit the transaction
    await session.commitTransaction();

    return reault;
  } catch (error: any) {
    // Rollback the transaction in case of an error
    // console.log('error', error, error.message);
    await session.abortTransaction();
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  } finally {
    // End the session
    session.endSession();
  }
};

// Export functions
export const CommentServices = {
  createComment,
  getCommentsForPost,
  deleteComment,
};
