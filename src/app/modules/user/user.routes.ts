import express from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constants';
import { multerUpload } from '../../config/multer.config';

const router = express.Router();

router.get(
  '/me',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  UserController.getCurrentUser,
);

router.put(
  '/me/update/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  UserController.updateUserData,
);

router.put(
  '/me/update/profile-picture/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  multerUpload.single('file'),
  UserController.updateUserProfilePicture,
);

router.get('/get-list', auth(USER_ROLE.admin), UserController.getCurrentUser);

router.post(
  '/toggle-follow',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  UserController.toggleFollowUser,
);

export const UserRoutes = router;
