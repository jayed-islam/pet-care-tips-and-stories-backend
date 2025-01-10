import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { PageServices } from './page.service';

const createPage = catchAsync(async (req: Request, res: Response) => {
  const pageData = req.body;
  const file = req.file;

  const newPage = await PageServices.createPage(pageData, req.user._id, file);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Page created successfully!',
    data: newPage,
  });
});

// Get all pages
const getAllPages = catchAsync(async (req: Request, res: Response) => {
  const pages = await PageServices.getAllPages();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Pages retrieved successfully!',
    data: pages,
  });
});

// Get a single page by ID
const getPageById = catchAsync(async (req: Request, res: Response) => {
  const pageId = req.params.id;

  const page = await PageServices.getPageById(pageId);

  if (!page || page.isDeleted) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Page not found',
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Page retrieved successfully!',
    data: page,
  });
});

// Update a page
const updatePage = catchAsync(async (req: Request, res: Response) => {
  const pageId = req.params.id;
  const updateData = req.body;

  const updatedPage = await PageServices.updatePage(pageId, updateData);

  if (!updatedPage || updatedPage.isDeleted) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Page not found',
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Page updated successfully!',
    data: updatedPage,
  });
});

// Soft delete a page
const deletePage = catchAsync(async (req: Request, res: Response) => {
  const pageId = req.params.id;

  const deletedPage = await PageServices.deletePage(pageId);

  if (!deletedPage) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Page not found',
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Page deleted successfully!',
    data: null,
  });
});

// Toggle like for a page (like or unlike)
const toggleLike = catchAsync(async (req: Request, res: Response) => {
  const pageId = req.params.id;
  const userId = req.user.id; // assuming user is logged in and `id` is available

  const updatedPage = await PageServices.toggleLike(pageId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Like toggled successfully!',
    data: updatedPage,
  });
});

// Toggle follow for a page (follow or unfollow)
const toggleFollow = catchAsync(async (req: Request, res: Response) => {
  const pageId = req.params.id;
  const userId = req.user.id; // assuming user is logged in and `id` is available

  const updatedPage = await PageServices.toggleFollow(pageId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Follow toggled successfully!',
    data: updatedPage,
  });
});

// Toggle moderator for a page (add/remove moderator)
const toggleModerator = catchAsync(async (req: Request, res: Response) => {
  const pageId = req.params.id;
  const userId = req.body.userId; // assuming moderator userId is passed in the request body
  const action: 'add' | 'remove' = req.body.action;

  const updatedPage = await PageServices.toggleModerator(
    pageId,
    userId,
    action,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      action === 'add'
        ? 'Moderator added successfully!'
        : 'Moderator removed successfully!',
    data: updatedPage,
  });
});

export const PageControllers = {
  createPage,
  getAllPages,
  getPageById,
  updatePage,
  deletePage,
  toggleLike,
  toggleFollow,
  toggleModerator,
};
