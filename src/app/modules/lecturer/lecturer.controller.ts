import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { ILecturer } from './lecturer.interface';
import sendResponse from '../../utils/sendResponse';
import { LecturerServices } from './lecturer.service';

const createLecturer = catchAsync(async (req, res) => {
  const postData: ILecturer = req.body;
  const lecturer = await LecturerServices.createLecturer(postData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Lecturer Created Successfully!',
    data: lecturer,
  });
});

const getAllLecturers = catchAsync(async (req: Request, res: Response) => {
  const lecturers = await LecturerServices.getAllLecturers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Lecturers Fetched Successfully!',
    data: lecturers,
  });
});

const updateLecturer = catchAsync(async (req: Request, res: Response) => {
  const lecturerId = req.params.id;
  const updateData: Partial<ILecturer> = req.body;
  const updatedLecturer = await LecturerServices.updateLecturer(
    lecturerId,
    updateData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Lecturer Updated Successfully!',
    data: updatedLecturer,
  });
});

const deleteLecturer = catchAsync(async (req: Request, res: Response) => {
  const lecturerId = req.params.id;
  const deletedLecturer = await LecturerServices.deleteLecturer(lecturerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Lecturer Deleted Successfully!',
    data: deletedLecturer,
  });
});

export const LecturerControllers = {
  createLecturer,
  getAllLecturers,
  updateLecturer,
  deleteLecturer,
};
