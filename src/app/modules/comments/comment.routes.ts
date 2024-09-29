import express from 'express';
import { CommentControllers } from './comment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constants';
const router = express.Router();

// Routes for comments
router.post(
  '/:postId',
  auth(USER_ROLE.user, USER_ROLE.admin),
  CommentControllers.createComment,
);

router.get('/:postId', CommentControllers.getCommentsForPost);

router.delete(
  '/:commentId',
  auth(USER_ROLE.user, USER_ROLE.admin),
  CommentControllers.deleteComment,
);

export const CommentRoutes = router;
