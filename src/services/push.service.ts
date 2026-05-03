import admin from '../config/firebase';
import logger from '../shared/logger';

export interface PushPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

export async function sendPushNotification(fcmToken: string, payload: PushPayload): Promise<void> {
  try {
    await admin.messaging().send({
      token: fcmToken,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data,
      android: {
        priority: 'high',
        notification: {
          channelId: 'deadline_channel',
          sound: 'default',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    });
  } catch (err) {
    logger.error(`FCM send failed for token ${fcmToken.slice(0, 20)}...`, err);
    throw err;
  }
}
