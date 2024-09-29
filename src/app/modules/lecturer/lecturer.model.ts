import { Schema, model } from 'mongoose';
import { ILecturer } from './lecturer.interface';

const lecturerSchema = new Schema<ILecturer>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    priority: {
      type: Number,
      required: true,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Lecturer = model<ILecturer>('Lecturer', lecturerSchema);

export default Lecturer;
