// src/category/category.controller.ts
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { CategoryServices } from './category.service';

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const categoryData = req.body;

  const newCategory = await CategoryServices.createCategory(categoryData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Category created successfully!',
    data: newCategory,
  });
});

// Get all categories
const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const categories = await CategoryServices.getAllCategories();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Categories retrieved successfully!',
    data: categories,
  });
});

// Get a single category by ID
const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const categoryId = req.params.id;

  const category = await CategoryServices.getCategoryById(categoryId);

  if (!category || category.isDeleted) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Category not found',
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category retrieved successfully!',
    data: category,
  });
});

// Update a category
const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const categoryId = req.params.id;
  const updateData = req.body;

  const updatedCategory = await CategoryServices.updateCategory(
    categoryId,
    updateData,
  );

  if (!updatedCategory || updatedCategory.isDeleted) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Category not found',
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category updated successfully!',
    data: updatedCategory,
  });
});

// Soft delete a category
const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const categoryId = req.params.id;

  const deletedCategory = await CategoryServices.deleteCategory(categoryId);

  if (!deletedCategory) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Category not found',
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category deleted successfully!',
    data: null,
  });
});

// Exporting all the category controller functions
export const CategoryControllers = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
