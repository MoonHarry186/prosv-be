import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  full_name: Joi.string().min(2).max(100),
  notifications_enabled: Joi.boolean(),
}).min(1);

export const updatePasswordSchema = Joi.object({
  current_password: Joi.string().required(),
  new_password: Joi.string().min(8).required(),
});

export const updateFcmTokenSchema = Joi.object({
  fcm_token: Joi.string().required(),
});
