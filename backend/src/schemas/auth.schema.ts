import { z } from 'zod';

/**
 * Schema for POST /api/auth/register
 * Validates name, email format, and a minimum 8-character password.
 */
export const RegisterSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be at most 100 characters')
      .trim(),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Please provide a valid email address')
      .toLowerCase()
      .trim(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters'),
  }),
});

/**
 * Schema for POST /api/auth/login
 * Validates email format and non-empty password.
 */
export const LoginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Please provide a valid email address')
      .toLowerCase()
      .trim(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password is required'),
  }),
});

/**
 * Schema for POST /api/auth/refresh-token
 */
export const RefreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z
      .string({ required_error: 'Refresh token is required' })
      .min(1, 'Refresh token is required'),
  }),
});

// Inferred TypeScript types from the schemas
export type RegisterInput = z.infer<typeof RegisterSchema>['body'];
export type LoginInput = z.infer<typeof LoginSchema>['body'];
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>['body'];
