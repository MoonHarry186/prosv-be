import { Router } from 'express';
import * as statisticsController from './statistics.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/overview',   statisticsController.getOverview);
router.get('/by-course',  statisticsController.getByCourse);
router.get('/daily',      statisticsController.getDaily);
router.get('/streaks',    statisticsController.getStreaks);

export default router;
