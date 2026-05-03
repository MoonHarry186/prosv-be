import admin from 'firebase-admin';
import path from 'path';
import logger from '../shared/logger';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const serviceAccount = require(path.resolve(__dirname, '../../firebase-service-account.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  logger.info('Firebase Admin initialized');
}

export default admin;
