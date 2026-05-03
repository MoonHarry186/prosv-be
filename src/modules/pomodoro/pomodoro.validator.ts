import Joi from "joi";

export const createSessionSchema = Joi.object({
  course_id: Joi.string().hex().length(24),
  assignment_id: Joi.string().hex().length(24),
  work_minutes: Joi.number().integer().min(1).max(120),
  break_minutes: Joi.number().integer().min(1).max(60),
  status: Joi.string().valid("active", "paused", "cancelled"),
});

export const updateSessionSchema = Joi.object({
  status: Joi.string().valid("active", "paused", "cancelled"),
  completed_cycles: Joi.number().integer().min(0),
}).min(1);

