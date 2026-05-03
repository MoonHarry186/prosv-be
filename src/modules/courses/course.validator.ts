import Joi from 'joi';

const scheduleSlot = Joi.object({
  day: Joi.string().valid('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun').required(),
  start_time: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
  end_time: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
});

export const createCourseSchema = Joi.object({
  course_name: Joi.string().min(1).max(200).required(),
  course_code: Joi.string().min(1).max(20).required(),
  instructor_name: Joi.string().max(100),
  credits: Joi.number().integer().min(1).max(10).required(),
  semester: Joi.string().required(),
  academic_year: Joi.string().required(),
  schedule: Joi.array().items(scheduleSlot),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
});

export const updateCourseSchema = Joi.object({
  course_name: Joi.string().min(1).max(200),
  course_code: Joi.string().min(1).max(20),
  instructor_name: Joi.string().max(100),
  credits: Joi.number().integer().min(1).max(10),
  semester: Joi.string(),
  academic_year: Joi.string(),
  schedule: Joi.array().items(scheduleSlot),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
  status: Joi.string().valid('active', 'completed', 'archived'),
}).min(1);
