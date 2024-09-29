/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { USER_ROLE } from '../user/user.constants';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  profilePicture?: string;
  bio?: string;
  role: 'admin' | 'user';
  status: 'active' | 'diactive' | 'blocked';
  userType: 'basic' | 'premium';
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  isDeleted: boolean;
  isVerified: boolean;
  passwordChangedAt?: Date;
  premiumStartDate?: Date; // Date when premium started
  premiumEndDate?: Date; // Date when premium will expire
  subscriptionPlan?: 'weekly' | 'monthly';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserModel extends Model<IUser> {
  isUserExistsByEmail(email: string): Promise<IUser | null>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
