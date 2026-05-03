import { Router } from 'express';
import * as pomodoroController from './pomodoro.controller';
import { createSessionSchema, updateSessionSchema } from './pomodoro.validator';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/sessions',               validate(createSessionSchema), pomodoroController.createSession);
router.get('/sessions',                                               pomodoroController.listSessions);
router.get('/sessions/:id',                                           pomodoroController.getSession);
router.patch('/sessions/:id',          validate(updateSessionSchema), pomodoroController.updateSession);
router.patch('/sessions/:id/complete',                                pomodoroController.completeSession);

export default router;
