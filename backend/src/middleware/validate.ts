import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

const validate = (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          status: false,
          message: 'Validation failed',
          errors: error.flatten().fieldErrors,
        });
        return;
      }
      next(error);
    }
  };

export default validate;
