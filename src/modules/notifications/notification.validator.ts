import Joi from 'joi';

export const createNotificationSchema = Joi.object({
  assignment_id: Joi.string().hex().length(24).required(),
  notify_before: Joi.number().integer().min(1).required(),
});
