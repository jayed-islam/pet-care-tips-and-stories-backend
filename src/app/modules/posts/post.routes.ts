/* eslint-disable @typescript-eslint/no-explicit-any */
// routes/post.routes.ts
import express, { NextFunction, Request, Response } from 'express';
import { PostControllers } from './post.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constants';
import { multerUpload } from '../../config/multer.config';
import validateRequest from '../../middlewares/validateRequest';
import { PostValidations } from './post.validation';
const router = express.Router();

// Route for creating a new post
router.post(
  '/',
  multerUpload.array('files'),
  // (req: Request, res: Response, next: NextFunction) => {
  //   // Check if files were uploaded
  //   if (!req.files || (req.files as any[]).length === 0) {
  //     return res
  //       .status(400)
  //       .json({ message: 'At least one file is required.' });
  //   }

  //   next(); // Proceed if files are provided
  // },
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(PostValidations.createPostSchema),
  PostControllers.createPost,
);

// Route for fetching all posts
router.get('/', PostControllers.getAllPosts);

// Route for fetching all posts
router.get('/home-items', PostControllers.getHomePosts);

// Route for fetching posts by a specific user
router.post(
  '/user/:userId',
  auth(USER_ROLE.admin, USER_ROLE.user),
  PostControllers.getUserPosts,
);

// Route for updating a post by ID
router.put(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(PostValidations.updatePostSchema),
  PostControllers.updatePost,
);

// Route for updating a post by ID
router.get('/get-single/:id', PostControllers.getSinglePost);

// Route for deleting a post by ID
router.delete(
  '/delete/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),
  PostControllers.deletePost,
);

// Route for voting on a post
router.post(
  '/:id/vote',
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(PostValidations.voteAPostSchema),
  PostControllers.votePost,
);

export const PostRoutes = router;
