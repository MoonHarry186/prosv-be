import { Router } from 'express';
import * as authController from './auth.controller';
import { registerSchema, loginSchema, refreshSchema, googleLoginSchema, facebookLoginSchema, changePasswordSchema } from './auth.validator';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login',    validate(loginSchema),    authController.login);
router.post('/refresh',  validate(refreshSchema),  authController.refresh);
router.post('/logout',   authenticate,                        authController.logout);
router.get('/me',        authenticate,                        authController.me);
router.post('/google',   validate(googleLoginSchema),         authController.googleLogin);
router.post('/facebook', validate(facebookLoginSchema),       authController.facebookLogin);
router.patch('/change-password', authenticate, validate(changePasswordSchema), authController.changePassword);

export default router;
