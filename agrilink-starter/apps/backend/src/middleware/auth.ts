import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyAccessToken, extractTokenFromHeader } from '../lib/auth.js';

// Role constants
export const Role = {
  FARMER: 'FARMER',
  BUYER: 'BUYER',
  INSPECTOR: 'INSPECTOR',
  ADMIN: 'ADMIN'
} as const;

export type RoleType = typeof Role[keyof typeof Role];

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware to require authentication
 */
export function requireAuth(prisma: PrismaClient) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header required' });
      }

      const token = extractTokenFromHeader(authHeader);
      const payload = verifyAccessToken(token);

      // Fetch user from database to ensure they still exist
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, name: true, role: true }
      });

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}

/**
 * Middleware to require specific roles
 */
export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions', 
        required: roles,
        current: req.user.role
      });
    }

    next();
  };
}

/**
 * Middleware to allow access to own resources or admin
 */
export function requireOwnershipOrAdmin(getUserId: (req: Request) => string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const resourceUserId = getUserId(req);
    const isOwner = req.user.id === resourceUserId;
    const isAdmin = req.user.role === Role.ADMIN;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Access denied to this resource' });
    }

    next();
  };
}