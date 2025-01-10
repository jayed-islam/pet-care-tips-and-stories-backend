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

router.get(
  '/single-user/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  UserController.getSingleUser,
);

router.put(
  '/me/update/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  UserController.updateUserData,
);

router.put(
  '/admin/update/:id',
  auth(USER_ROLE.admin),
  UserController.updateUserByAdmin,
);

router.put(
  '/me/update/profile-picture/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  multerUpload.single('file'),
  UserController.updateUserProfilePicture,
);

router.get('/get-list', auth(USER_ROLE.admin), UserController.getAllUsers);

router.post(
  '/get-user-list',
  auth(USER_ROLE.user, USER_ROLE.admin),
  UserController.getUserListForUser,
);

router.post(
  '/toggle-follow',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  UserController.toggleFollowUser,
);

router.post(
  '/toggle-request',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  UserController.handleFriendRequest,
);

export const UserRoutes = router;
