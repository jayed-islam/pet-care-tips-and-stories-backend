/* eslint-disable no-unused-vars */

import { Types } from 'mongoose';

export enum CommentType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
}

export interface IComment extends Document {
  post: Types.ObjectId;
  author: Types.ObjectId;
  content: string;
  type: CommentType;
  createdAt: Date;
  updatedAt: Date;
}
