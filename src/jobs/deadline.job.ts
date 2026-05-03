import cron from 'node-cron';
import { Notification } from '../models/Notification';
import { Assignment } from '../models/Assignment';
import { Course } from '../models/Course';
import { User } from '../models/User';
import { sendPushNotification } from '../services/push.service';
import logger from '../shared/logger';

async function processDeadlineNotifications(): Promise<void> {
  const now = new Date();

  const pendingNotifs = await Notification.find({ is_enabled: true, sent_at: null });
  if (pendingNotifs.length === 0) return;

  for (const notif of pendingNotifs) {
    try {
      const assignment = await Assignment.findById(notif.assignment_id);
      if (!assignment || assignment.status === 'completed') {
        notif.is_enabled = false;
        await notif.save();
        continue;
      }

      const sendAt = new Date(assignment.deadline.getTime() - notif.notify_before * 60 * 1000);

      // Skip if not yet time
      if (sendAt > now) continue;

      // Skip if deadline passed more than 2 hours ago (missed window)
      const twoHoursAfterDeadline = new Date(assignment.deadline.getTime() + 2 * 60 * 60 * 1000);
      if (now > twoHoursAfterDeadline) {
        notif.sent_at = now;
        await notif.save();
        continue;
      }

      const course = await Course.findById(assignment.course_id);
      if (!course) continue;

      const user = await User.findById(course.user_id);
      if (!user?.fcm_token || !user.notifications_enabled) {
        notif.sent_at = now;
        await notif.save();
        continue;
      }

      const hoursLeft = notif.notify_before >= 60
        ? `${notif.notify_before / 60} giờ`
        : `${notif.notify_before} phút`;

      await sendPushNotification(user.fcm_token, {
        title: `⏰ Deadline còn ${hoursLeft}`,
        body: `${assignment.title} (${course.course_name})`,
        data: { assignment_id: String(assignment._id) },
      });

      notif.sent_at = now;
      await notif.save();

      logger.info(`Push sent: assignment=${assignment._id} notify_before=${notif.notify_before}min`);
    } catch (err) {
      logger.error(`Failed to process notification ${notif._id}`, err);
    }
  }
}

export function startDeadlineJob(): void {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      await processDeadlineNotifications();
    } catch (err) {
      logger.error('Deadline job error', err);
    }
  });

  logger.info('Deadline notification job started (every 5 minutes)');
}
