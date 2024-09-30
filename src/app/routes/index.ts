import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.routes';
import { UserRoutes } from '../modules/user/user.routes';
import { PostRoutes } from '../modules/posts/post.routes';
import { CategoryRoutes } from '../modules/category/category.routes';

const router = Router();

const modulesRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/post',
    route: PostRoutes,
  },
  {
    path: '/category',
    route: CategoryRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
