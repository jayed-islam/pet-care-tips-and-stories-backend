// src/category/category.routes.ts
import { Router } from 'express';
import { CategoryControllers } from './category.controller';

const router = Router();

// Define your routes
router.post('/', CategoryControllers.createCategory);
router.get('/', CategoryControllers.getAllCategories);
router.get('/:id', CategoryControllers.getCategoryById);
router.put('/:id', CategoryControllers.updateCategory);
router.delete('/:id', CategoryControllers.deleteCategory);

export default router;
