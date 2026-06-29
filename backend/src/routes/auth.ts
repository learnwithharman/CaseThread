import { Router } from 'express';
import { register, login, refreshToken, logout } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { authMiddleware } from '../middlewares/auth.middleware';
import { RegisterSchema, LoginSchema, RefreshTokenSchema } from '../schemas/auth.schema';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Create a new user account and return tokens
 * @access  Public
 */
router.post('/register', validate(RegisterSchema), register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user credentials and return tokens
 * @access  Public
 */
router.post('/login', validate(LoginSchema), login);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Rotate refresh token and issue new access + refresh pair
 * @access  Public (requires valid refresh token in body)
 */
router.post('/refresh-token', validate(RefreshTokenSchema), refreshToken);

/**
 * @route   POST /api/auth/logout
 * @desc    Revoke the supplied refresh token from the database
 * @access  Private (requires valid access token, but also tolerates missing — soft logout)
 */
router.post('/logout', authMiddleware, logout);

export default router;
