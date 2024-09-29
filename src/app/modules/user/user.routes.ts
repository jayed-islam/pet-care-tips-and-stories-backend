import express, { NextFunction, Request, Response } from 'express';
import { UserController } from './user.controller';
import authAdmin from '../../middlewares/auth';
import { USER_ROLE } from './user.constants';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.get(
  '/me',
  authAdmin(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  UserController.getCurrentUser,
);

router.put(
  '/me/update/:id',
  authAdmin(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  UserController.updateUserData,
);

router.get(
  '/get-list',
  authAdmin(USER_ROLE.admin),
  UserController.getCurrentUser,
);

router.post(
  '/toggle-follow',
  authAdmin(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  UserController.toggleFollowUser,
);

export const UserRoutes = router;
