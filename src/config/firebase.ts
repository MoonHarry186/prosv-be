import admin from 'firebase-admin';
import path from 'path';
import logger from '../shared/logger';

let serviceAccount;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    serviceAccount = require(path.resolve(__dirname, '../../firebase-service-account.json'));
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    logger.info('Firebase Admin initialized');
  }
} catch (error) {
  logger.error('Failed to initialize Firebase Admin', error);
}

export default admin;
