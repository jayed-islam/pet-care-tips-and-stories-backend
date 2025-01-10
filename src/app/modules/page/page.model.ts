import { model, Schema } from 'mongoose';
import { IPage } from './page.interface';

const pageSchema = new Schema<IPage>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    coverPhoto: {
      type: String,
    },
    logo: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    admins: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    moderators: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isPrivate: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Page = model<IPage>('Page', pageSchema);
