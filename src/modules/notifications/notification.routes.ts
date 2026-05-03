import { Router } from 'express';
import * as notificationController from './notification.controller';
import { createNotificationSchema } from './notification.validator';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/schedule',       validate(createNotificationSchema), notificationController.createNotification);
router.get('/',                                                     notificationController.listNotifications);
router.patch('/:id/toggle',                                        notificationController.toggleNotification);
router.delete('/:id',                                              notificationController.deleteNotification);

export default router;
