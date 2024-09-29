import httpStatus from 'http-status';
import { ILecturer } from './lecturer.interface';
import AppError from '../../errors/AppError';
import Lecturer from './lecturer.model';

const createLecturer = async (lecturerData: ILecturer): Promise<ILecturer> => {
  const existingLecturer = await Lecturer.findOne({ name: lecturerData.name });

  if (existingLecturer) {
    throw new AppError(httpStatus.CONFLICT, 'Lecturer already exists');
  }

  const lecturer = await Lecturer.create(lecturerData);

  return lecturer;
};

const getAllLecturers = async (): Promise<ILecturer[]> => {
  return await Lecturer.find({ isDeleted: false }).sort({ priority: 1 });
};

const updateLecturer = async (
  id: string,
  lecturerData: Partial<ILecturer>,
): Promise<ILecturer | null> => {
  const updatedLecturer = await Lecturer.findByIdAndUpdate(id, lecturerData, {
    new: true,
  });

  if (!updatedLecturer) {
    throw new AppError(httpStatus.NOT_FOUND, 'Lecturer not found');
  }

  return updatedLecturer;
};

const deleteLecturer = async (id: string): Promise<ILecturer | null> => {
  const deletedLecturer = await Lecturer.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!deletedLecturer) {
    throw new AppError(httpStatus.NOT_FOUND, 'Lecturer not found');
  }

  return deletedLecturer;
};

export const LecturerServices = {
  createLecturer,
  getAllLecturers,
  updateLecturer,
  deleteLecturer,
};
