import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import { connectDatabase } from './config/database';
import './config/firebase';
import { startDeadlineJob } from './jobs/deadline.job';
import { errorHandler } from './middleware/error.middleware';
import { swaggerSpec } from './config/swagger';
import authRouter from './modules/auth/auth.routes';
import userRouter from './modules/users/user.routes';
import courseRouter from './modules/courses/course.routes';
import assignmentRouter from './modules/assignments/assignment.routes';
import pomodoroRouter from './modules/pomodoro/pomodoro.routes';
import statisticsRouter from './modules/statistics/statistics.routes';
import notificationRouter from './modules/notifications/notification.routes';
import logger from './shared/logger';

const app = express();

// Bật trust proxy để express-rate-limit hoạt động chính xác trên Render/Heroku
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN ?? '*' }));
app.use(express.json());
app.use(morgan('dev'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX ?? 100),
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec));

app.use('/api/v1/auth',          authRouter);
app.use('/api/v1/users',         userRouter);
app.use('/api/v1/courses',       courseRouter);
app.use('/api/v1/assignments',   assignmentRouter);
app.use('/api/v1/pomodoro',      pomodoroRouter);
app.use('/api/v1/statistics',    statisticsRouter);
app.use('/api/v1/notifications', notificationRouter);

app.use(errorHandler);

const PORT = Number(process.env.PORT ?? 3000);

async function start(): Promise<void> {
  await connectDatabase();
  startDeadlineJob();
  app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
}

start().catch((err) => {
  logger.error('Failed to start server', err);
  process.exit(1);
});

export default app;
