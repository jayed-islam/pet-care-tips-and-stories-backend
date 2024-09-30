// src/category/category.routes.ts
import { Router } from 'express';
import { CategoryControllers } from './category.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constants';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryValidations } from './category.validation';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(CategoryValidations.createCategorySchema),
  CategoryControllers.createCategory,
);
router.get('/', CategoryControllers.getAllCategories);
router.get('/:id', auth(USER_ROLE.admin), CategoryControllers.getCategoryById);
router.put(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(CategoryValidations.updateCategorySchema),
  CategoryControllers.updateCategory,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin),
  CategoryControllers.deleteCategory,
);

export const CategoryRoutes = router;
