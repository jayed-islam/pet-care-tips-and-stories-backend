import { model, Schema } from 'mongoose';
import { IPost } from './post.interface';

// Schema definition for Post
const PostSchema = new Schema<IPost>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    title: {
      type: String,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    upvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    downvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    imageUrls: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Create Post model
const Post = model<IPost>('Post', PostSchema);

export { Post };
