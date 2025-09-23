import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyAccessToken,
  hashPassword, 
  comparePassword,
  getRefreshTokenExpiry 
} from '../lib/auth.js';
import { requireAuth } from '../middleware/auth.js';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
  role: z.enum(['FARMER', 'BUYER', 'INSPECTOR', 'ADMIN']).default('FARMER')
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

const refreshSchema = z.object({
  refreshToken: z.string()
});

export function createAuthRoutes(prisma: PrismaClient) {
  const router = Router();

  /**
   * POST /api/auth/register
   * Register a new user
   */
  router.post('/register', async (req, res) => {
    try {
      const { email, name, password, role } = registerSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: role as any
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true
        }
      });

      // Generate tokens
      const accessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      const refreshToken = generateRefreshToken();
      const expiresAt = getRefreshTokenExpiry();

      // Save refresh token
      await prisma.session.create({
        data: {
          userId: user.id,
          refreshToken,
          expiresAt
        }
      });

      res.status(201).json({
        user,
        accessToken,
        refreshToken
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      console.error('Register error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * POST /api/auth/login
   * Login user
   */
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);

      // Find user
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate tokens
      const accessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      const refreshToken = generateRefreshToken();
      const expiresAt = getRefreshTokenExpiry();

      // Save refresh token
      await prisma.session.create({
        data: {
          userId: user.id,
          refreshToken,
          expiresAt
        }
      });

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt
        },
        accessToken,
        refreshToken
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * POST /api/auth/refresh
   * Refresh access token
   */
  router.post('/refresh', async (req, res) => {
    try {
      const { refreshToken } = refreshSchema.parse(req.body);

      // Find session
      const session = await prisma.session.findUnique({
        where: { refreshToken },
        include: { user: true }
      });

      if (!session) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      // Check if token is expired
      if (session.expiresAt < new Date()) {
        // Delete expired session
        await prisma.session.delete({
          where: { id: session.id }
        });
        return res.status(401).json({ error: 'Refresh token expired' });
      }

      // Generate new access token
      const accessToken = generateAccessToken({
        userId: session.user.id,
        email: session.user.email,
        role: session.user.role
      });

      // Optionally rotate refresh token
      const newRefreshToken = generateRefreshToken();
      const newExpiresAt = getRefreshTokenExpiry();

      await prisma.session.update({
        where: { id: session.id },
        data: {
          refreshToken: newRefreshToken,
          expiresAt: newExpiresAt
        }
      });

      res.json({
        accessToken,
        refreshToken: newRefreshToken
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      console.error('Refresh error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * POST /api/auth/logout
   * Logout user
   */
  router.post('/logout', async (req, res) => {
    try {
      const { refreshToken } = refreshSchema.parse(req.body);

      // Delete session
      await prisma.session.deleteMany({
        where: { refreshToken }
      });

      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * GET /api/auth/me
   * Get current user
   */
  router.get('/me', requireAuth(prisma), (req, res) => {
    res.json({ user: req.user });
  });

  return router;
}