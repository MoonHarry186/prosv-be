import Joi from 'joi';

export const createAssignmentSchema = Joi.object({
  course_id: Joi.string().hex().length(24).required(),
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(2000).allow(''),
  deadline: Joi.string().isoDate().required(),
  status: Joi.string().valid('pending', 'in_progress', 'completed', 'overdue'),
  priority: Joi.string().valid('low', 'medium', 'high'),
  notes: Joi.string().max(2000).allow(''),
});

export const updateAssignmentSchema = Joi.object({
  course_id: Joi.string().hex().length(24),
  title: Joi.string().min(1).max(200),
  description: Joi.string().max(2000).allow(''),
  deadline: Joi.string().isoDate(),
  priority: Joi.string().valid('low', 'medium', 'high'),
  status: Joi.string().valid('pending', 'in_progress', 'completed', 'overdue'),
  notes: Joi.string().max(2000).allow(''),
  completed_at: Joi.string().isoDate(),
}).min(1);
