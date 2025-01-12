import { NextFunction, Request, Response, Router } from 'express';
import { PageControllers } from './page.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constants';
import { multerUpload } from '../../config/multer.config';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.user, USER_ROLE.admin),
  multerUpload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  //   validateRequest(PageValidations.createPageSchema),
  PageControllers.createPage,
);

router.get('/', PageControllers.getAllPages);
router.get('/:id', PageControllers.getPageById);

router.put(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),
  PageControllers.updatePage,
);

router.post(
  '/:id/toggle-like',
  auth(USER_ROLE.user),
  PageControllers.toggleLike,
);

// Toggle follow on a page
router.post(
  '/:id/toggle-follow',
  auth(USER_ROLE.user, USER_ROLE.admin),
  PageControllers.toggleFollow,
);

router.post(
  '/:id/toggle-moderator',
  auth(USER_ROLE.admin),
  PageControllers.toggleModerator,
);

router.delete('/:id', auth(USER_ROLE.admin), PageControllers.deletePage);

export const PageRoutes = router;
