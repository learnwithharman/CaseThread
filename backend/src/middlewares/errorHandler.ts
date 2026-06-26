import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

// Format error responses for development
const sendErrorDev = (err: any, res: Response) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

// Format error responses for production
const sendErrorProd = (err: any, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak details
    console.error('ERROR 💥:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong on the server',
    });
  }
};

// Handle Prisma Unique Constraint Errors (P2002)
const handlePrismaUniqueConstraintError = (err: any): AppError => {
  const target = err.meta?.target ? ` (${err.meta.target.join(', ')})` : '';
  const message = `Duplicate field value${target}. Please use another value!`;
  return new AppError(message, 400);
};

// Handle Prisma Validation Errors or Not Found Errors
const handlePrismaValidationError = (err: any): AppError => {
  const message = `Database operation failed: ${err.message}`;
  return new AppError(message, 400);
};

const handlePrismaRecordNotFoundError = (): AppError => {
  return new AppError('The requested database record could not be found', 404);
};

// Centralized Global Error Handler Middleware
export const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;
    error.stack = err.stack;

    // Map database engine errors from Prisma
    if (err.code === 'P2002') error = handlePrismaUniqueConstraintError(err);
    if (err.code === 'P2001' || err.code === 'P2025') error = handlePrismaRecordNotFoundError();
    if (err.name === 'PrismaClientValidationError') error = handlePrismaValidationError(err);

    sendErrorProd(error, res);
  }
};
