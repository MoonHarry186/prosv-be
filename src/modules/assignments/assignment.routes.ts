import { Router } from 'express';
import * as assignmentController from './assignment.controller';
import { createAssignmentSchema, updateAssignmentSchema } from './assignment.validator';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/',               validate(createAssignmentSchema), assignmentController.createAssignment);
router.get('/',                                                  assignmentController.listAssignments);
router.get('/:id',                                               assignmentController.getAssignment);
router.patch('/:id',           validate(updateAssignmentSchema), assignmentController.updateAssignment);
router.patch('/:id/complete',                                    assignmentController.completeAssignment);
router.delete('/:id',                                            assignmentController.deleteAssignment);

export default router;
