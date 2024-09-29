// src/category/category.model.ts
import { model, Schema } from 'mongoose';
import { ICategory } from './category.interface';

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Create Category model
const Category = model<ICategory>('Category', CategorySchema);

export { Category };
