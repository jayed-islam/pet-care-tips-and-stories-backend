/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IPage } from './page.interface';
import { Page } from './page.model';
import { User } from '../user/user.model';
import mongoose from 'mongoose';

// const createPage = async (
//   pageData: IPage,
//   userId: string,
//   file: any,
// ): Promise<IPage> => {
//   try {
//     // First, check if the user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//     }

//     // Check if the page with the same name already exists
//     const existingPage = await Page.findOne({ name: pageData.name });

//     // Define the logo path
//     const logo = file.path;

//     // If the page already exists, throw an error
//     if (existingPage) {
//       throw new AppError(
//         httpStatus.CONFLICT,
//         'Page with this name already exists',
//       );
//     }

//     // Create the new page
//     const page = await Page.create({ ...pageData, logo });

//     // Add the created page ID to the user's pages array
//     user.pages.push(page._id);
//     await user.save();

//     return page;
//   } catch (error) {
//     throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Server error');
//   }
// };

const createPage = async (
  pageData: IPage,
  userId: string,
  file: any,
): Promise<IPage> => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // First, check if the user exists within the session
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Check if the page with the same name already exists within the session
    const existingPage = await Page.findOne({ name: pageData.name }).session(
      session,
    );
    if (existingPage) {
      throw new AppError(
        httpStatus.CONFLICT,
        'Page with this name already exists',
      );
    }

    // Define the logo path
    const logo = file.path;

    // Create the new page within the session
    const page = await Page.create(
      [{ ...pageData, logo, createdBy: user._id }],
      { session },
    );
    const createdPage = page[0];

    // Add the created page ID to the user's pages array within the session
    user.pages.push(createdPage._id);
    await user.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return createdPage;
  } catch (error: any) {
    // Abort the transaction on error
    await session.abortTransaction();
    session.endSession();

    // Re-throw the error to be handled by the caller
    if (error) {
      throw error;
    } else {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

// Get all pages
const getAllPages = async (): Promise<IPage[]> => {
  try {
    const pages = await Page.find({ isDeleted: false })
      .populate('posts')
      .populate('followers')
      .populate('createdBy');
    return pages;
  } catch (error) {
    throw new AppError(httpStatus.CONFLICT, 'Server error');
  }
};

// Get a single page by ID
const getPageById = async (pageId: string): Promise<IPage | null> => {
  const page = await Page.findOne({ _id: pageId, isDeleted: false })
    .populate('posts')
    .populate('followers')
    .populate('createdBy');

  if (!page) {
    throw new AppError(httpStatus.NOT_FOUND, 'Page not found');
  }

  return page;
};

// Update a page by ID
const updatePage = async (
  pageId: string,
  updateData: Partial<IPage>,
): Promise<IPage | null> => {
  const updatedPage = await Page.findOneAndUpdate(
    { _id: pageId, isDeleted: false },
    updateData,
    { new: true, runValidators: true },
  );

  if (!updatedPage) {
    throw new AppError(httpStatus.NOT_FOUND, 'Page not found');
  }

  return updatedPage;
};

// Soft delete a page by ID
const deletePage = async (pageId: string): Promise<IPage | null> => {
  const deletedPage = await Page.findOneAndUpdate(
    { _id: pageId },
    { isDeleted: true },
    { new: true },
  );

  if (!deletedPage) {
    throw new AppError(httpStatus.NOT_FOUND, 'Page not found');
  }

  return deletedPage;
};

const toggleLike = async (pageId: string, userId: any) => {
  const page = await Page.findById(pageId);

  if (!page) {
    throw new AppError(httpStatus.NOT_FOUND, 'Page not found');
  }

  // If the user has already liked the page, unlike it
  if (page.likes.includes(userId)) {
    page.likes = page.likes.filter((like) => !like.equals(userId));
  } else {
    // Otherwise, like the page
    page.likes.push(userId);
  }

  await page.save();
  return page;
};

// Toggle follow (follow or unfollow based on current state)
const toggleFollow = async (pageId: string, userId: any) => {
  const page = await Page.findById(pageId);

  if (!page) {
    throw new AppError(httpStatus.NOT_FOUND, 'Page not found');
  }

  // If the user is already following the page, unfollow it
  if (page.followers.includes(userId)) {
    page.followers = page.followers.filter(
      (follower) => !follower.equals(userId),
    );
  } else {
    // Otherwise, follow the page
    page.followers.push(userId);
  }

  await page.save();
  return page;
};

// Add or remove a moderator (toggle based on current state)
const toggleModerator = async (
  pageId: string,
  userId: any,
  action: 'add' | 'remove',
) => {
  const page = await Page.findById(pageId);

  if (!page) {
    throw new AppError(httpStatus.NOT_FOUND, 'Page not found');
  }

  // Add moderator if action is 'add' and user is not already a moderator
  if (action === 'add' && !page.moderators.includes(userId)) {
    page.moderators.push(userId);
  }

  // Remove moderator if action is 'remove' and user is a moderator
  if (action === 'remove' && page.moderators.includes(userId)) {
    page.moderators = page.moderators.filter(
      (moderator) => !moderator.equals(userId),
    );
  }

  await page.save();
  return page;
};

export const PageServices = {
  createPage,
  getAllPages,
  getPageById,
  updatePage,
  deletePage,
  toggleLike,
  toggleFollow,
  toggleModerator,
};
