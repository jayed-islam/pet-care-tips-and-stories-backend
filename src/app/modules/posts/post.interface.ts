/* eslint-disable no-unused-vars */
import { Document, Types } from 'mongoose';

export enum PostCategory {
  TIP = 'TIP',
  STORY = 'STORY',
}

export interface IPost extends Document {
  author: Types.ObjectId;
  title: string;
  content: string;
  category: PostCategory;
  isPremium: boolean;
  upvotes: Types.ObjectId[];
  downvotes: Types.ObjectId[];
  comments: Types.ObjectId[];
  imageUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}
