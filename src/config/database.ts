import mongoose from 'mongoose';
import logger from '../shared/logger';

export async function connectDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not defined');

  await mongoose.connect(uri, { maxPoolSize: 10 });
  logger.info('MongoDB connected');
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
}

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error', err);
});
