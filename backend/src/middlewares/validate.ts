import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        // Let our centralized handler process this as a clean validation error
        const validationError: any = new Error('Validation failed');
        validationError.statusCode = 400;
        validationError.status = 'fail';
        validationError.isOperational = true;
        (validationError as any).errors = errors;
        
        // Overwrite standard sendErrorDev/Prod response formatting for validation specifically
        _res.status(400).json({
          status: 'fail',
          message: 'Validation failed',
          errors,
        });
        return;
      }
      next(error);
    }
  };
};
