import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from '../shared/errors';

export function validate(schema: Joi.ObjectSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const message = error.details.map((d) => d.message).join(', ');
      return next(new ValidationError(message));
    }
    next();
  };
}
