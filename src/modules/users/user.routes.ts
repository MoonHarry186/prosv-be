import { Router } from 'express';
import * as userController from './user.controller';
import { updateProfileSchema, updatePasswordSchema, updateFcmTokenSchema } from './user.validator';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/profile',    userController.getProfile);
router.patch('/profile',  validate(updateProfileSchema),  userController.updateProfile);
router.patch('/password', validate(updatePasswordSchema), userController.updatePassword);
router.post('/fcm-token', validate(updateFcmTokenSchema), userController.updateFcmToken);

export default router;
