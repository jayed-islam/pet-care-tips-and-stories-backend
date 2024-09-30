/* eslint-disable no-unused-vars */
import { Document, Types } from 'mongoose';

export interface IPost extends Document {
  author: Types.ObjectId;
  title: string;
  content: string;
  isPremium: boolean;
  category: Types.ObjectId;
  upvotes: Types.ObjectId[];
  downvotes: Types.ObjectId[];
  comments: Types.ObjectId[];
  isDeleted: boolean;
  isPublished: boolean;
  imageUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}
