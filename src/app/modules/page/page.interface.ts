import { Types } from 'mongoose';

export interface IPage extends Document {
  name: string;
  description: string;
  coverPhoto?: string;
  logo: string;
  createdBy: Types.ObjectId;
  admins: Types.ObjectId[];
  moderators: Types.ObjectId[];
  members: Types.ObjectId[];
  posts: Types.ObjectId[];
  followers: Types.ObjectId[];
  likes: Types.ObjectId[];
  isPrivate: boolean;
  isDeleted: boolean;
}
