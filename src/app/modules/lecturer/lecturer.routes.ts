import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { LecturerValidations } from './lecturer.validation';
import { LecturerControllers } from './lecturer.controller';

const router = Router();

router.post(
  '/',
  validateRequest(LecturerValidations.lecturerCreateSchema),
  LecturerControllers.createLecturer,
);
router.get('/', LecturerControllers.getAllLecturers);

router.put(
  '/:id',
  validateRequest(LecturerValidations.lecturerUpdateSchema),
  LecturerControllers.updateLecturer,
);
router.delete('/:id', LecturerControllers.deleteLecturer);

export const LecturerRoutes = router;
