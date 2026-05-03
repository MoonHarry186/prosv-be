import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  full_name: Joi.string().min(2).max(100).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const refreshSchema = Joi.object({
  refresh_token: Joi.string().required(),
});

export const googleLoginSchema = Joi.object({
  id_token: Joi.string().required(),
});

export const facebookLoginSchema = Joi.object({
  access_token: Joi.string().required(),
});
