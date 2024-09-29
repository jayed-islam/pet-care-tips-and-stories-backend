import { model, Schema } from 'mongoose';
import { CommentType, IComment } from './comment.interface';

// Comment Schema
const commentSchema = new Schema<IComment>({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: Object.values(CommentType),
    default: CommentType.TEXT,
  },
});

// Export the Comment model
const Comment = model<IComment>('Comment', commentSchema);

export { Comment };
