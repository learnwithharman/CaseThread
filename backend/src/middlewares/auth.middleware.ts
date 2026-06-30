import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError';

/**
 * authMiddleware
 *
 * Protects private routes by verifying the JWT access token.
 *
 * Expects the header:
 *   Authorization: Bearer <access_token>
 *
 * On success, attaches the decoded payload to `req.user`:
 *   { id: number, email: string, role: string }
 *
 * On failure, passes an AppError to the global error handler (401).
 */
export const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    // 1. Extract the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Authentication required. Please provide a valid Bearer token.', 401));
    }

    // 2. Extract the token string
    const token = authHeader.split(' ')[1];
    if (!token) {
      return next(new AppError('Authentication token is missing', 401));
    }

    // 3. Verify the token signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      email: string;
      role: string;
    };

    // 4. Attach the user payload to req.user for downstream handlers
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Your session has expired. Please refresh your token.', 401));
    }
    if (err.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid authentication token', 401));
    }
    next(err);
  }
};

/**
 * restrictTo
 *
 * Role-based access control middleware factory.
 * Usage: router.delete('/user/:id', authMiddleware, restrictTo('admin'), handler)
 */
export const restrictTo = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
