import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service'; // Assuming UserService is correctly implemented

const getCurrentUser = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const user = await UserService.getUserByIdFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Current User details retrieved successfully',
    data: user,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const results = await UserService.getAllUsers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All User retrieved successfully',
    data: results,
  });
});

const updateUserData = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userData = req.body;

  const file = req.file;

  const user = await UserService.updateUserDataIntoDB(
    id,
    userData,
    file,
    req.user,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User details updated successfully',
    data: user,
  });
});

export const UserController = {
  getCurrentUser,
  getAllUsers,
  updateUserData,
};
