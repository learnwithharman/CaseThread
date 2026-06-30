// Extend Express Request to include the authenticated user payload
// This is injected by the authMiddleware after verifying the JWT

declare namespace Express {
  export interface Request {
    user?: {
      id: number;
      email: string;
      role: string;
    };
  }
}
