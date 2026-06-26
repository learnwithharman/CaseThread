import { Router, Request, Response } from 'express';

const router = Router();

/**
 * @route   GET /api/health
 * @desc    API Healthcheck endpoint
 * @access  Public
 */
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'CaseThread API is healthy and operational',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

export default router;
