import { Router } from 'express';
import * as courseController from './course.controller';
import { createCourseSchema, updateCourseSchema } from './course.validator';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/',     validate(createCourseSchema), courseController.createCourse);
router.get('/',                                    courseController.listCourses);
router.get('/:id',                                 courseController.getCourse);
router.patch('/:id', validate(updateCourseSchema), courseController.updateCourse);
router.delete('/:id',                              courseController.deleteCourse);

export default router;
