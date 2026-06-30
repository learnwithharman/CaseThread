import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import { AppError } from '../utils/appError';

// ─── Token Helpers ────────────────────────────────────────────────────────────

/**
 * Signs a short-lived access JWT (default 15m) containing user id, email, role.
 */
const signAccessToken = (payload: { id: number; email: string; role: string }): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_ACCESS_EXPIRATION || '15m') as any,
  });
};

/**
 * Signs a long-lived refresh JWT (default 7d) and stores it in the DB.
 */
const signRefreshToken = (payload: { id: number }): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: (process.env.JWT_REFRESH_EXPIRATION || '7d') as any,
  });
};

/**
 * Calculates the expiry Date for a refresh token string (e.g. "7d" → 7 days from now).
 */
const calcRefreshExpiry = (expiration: string): Date => {
  const now = Date.now();
  const match = expiration.match(/^(\d+)([smhd])$/);
  if (!match) return new Date(now + 7 * 24 * 60 * 60 * 1000); // default 7 days

  const value = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return new Date(now + value * multipliers[unit]);
};

/**
 * Issues a fresh access + refresh token pair for the given user,
 * persisting the refresh token to the database.
 */
const issueTokenPair = async (user: { id: number; email: string; role: string }) => {
  const accessToken = signAccessToken({ id: user.id, email: user.email, role: user.role });
  const refreshToken = signRefreshToken({ id: user.id });

  const expiresAt = calcRefreshExpiry(process.env.JWT_REFRESH_EXPIRATION || '7d');

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt,
    },
  });

  return { accessToken, refreshToken };
};

// ─── Controller Functions ─────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Creates a new user account with a hashed password, then issues tokens.
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return next(new AppError('An account with this email already exists', 409));
    }

    // Hash password with bcrypt (salt rounds: 12)
    const passwordHash = await bcrypt.hash(password, 12);

    // Create the user record
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        settings: {
          theme: 'default',
          shortcutsEnabled: true,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profilePicUrl: true,
        settings: true,
        createdAt: true,
      },
    });

    // Log registration activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        type: 'created',
        details: `Account created for ${user.name}`,
      },
    });

    // Issue token pair
    const { accessToken, refreshToken } = await issueTokenPair(user);

    res.status(201).json({
      status: 'success',
      message: 'Account created successfully',
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 * Verifies credentials and issues a new token pair.
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    // Fetch user (include passwordHash for comparison)
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        passwordHash: true,
        profilePicUrl: true,
        settings: true,
        createdAt: true,
      },
    });

    // Generic message to avoid user-enumeration attacks
    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Compare supplied password against stored hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Strip passwordHash before sending to client
    const { passwordHash: _hash, ...safeUser } = user;

    // Log login activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        type: 'updated',
        details: `User ${user.name} logged in`,
      },
    });

    // Issue token pair
    const { accessToken, refreshToken } = await issueTokenPair({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      status: 'success',
      message: 'Logged in successfully',
      data: {
        user: safeUser,
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/refresh-token
 * Validates the incoming refresh token, rotates it, and issues a fresh pair.
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken: incomingToken } = req.body as { refreshToken: string };

    // Verify JWT signature and expiry
    let decoded: { id: number };
    try {
      decoded = jwt.verify(incomingToken, process.env.JWT_REFRESH_SECRET as string) as {
        id: number;
      };
    } catch {
      return next(new AppError('Invalid or expired refresh token', 401));
    }

    // Check token exists in the database (not yet rotated/revoked)
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: incomingToken },
      include: { user: { select: { id: true, email: true, role: true, name: true } } },
    });

    if (!storedToken || storedToken.userId !== decoded.id) {
      return next(new AppError('Refresh token not recognised. Please log in again.', 401));
    }

    // Check stored expiry (belt-and-suspenders check alongside JWT expiry)
    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      return next(new AppError('Refresh token has expired. Please log in again.', 401));
    }

    // Rotate: delete the old token
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    // Issue fresh token pair
    const { accessToken, refreshToken: newRefreshToken } = await issueTokenPair({
      id: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    });

    res.status(200).json({
      status: 'success',
      message: 'Tokens refreshed successfully',
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/logout
 * Revokes the supplied refresh token from the database.
 * The access token is stateless and will expire naturally.
 */
export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken: tokenToRevoke } = req.body as { refreshToken: string };

    if (!tokenToRevoke) {
      return next(new AppError('Refresh token is required to logout', 400));
    }

    // Attempt to delete; ignore if it doesn't exist (already revoked / already expired)
    await prisma.refreshToken.deleteMany({ where: { token: tokenToRevoke } });

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (err) {
    next(err);
  }
};
