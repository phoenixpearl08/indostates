import { Request, Response } from 'express';
import { z } from 'zod';
import { dataStore } from '../services/dataStore';
import { comparePassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { getPermissionsForRole } from '../config/rbac';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = dataStore.adminUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.status === 'ACTIVE'
  );

  if (!user) {
    res.status(401).json({
      success: false,
      message: 'Invalid administrative email or password credentials.',
    });
    return;
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    res.status(401).json({
      success: false,
      message: 'Invalid administrative email or password credentials.',
    });
    return;
  }

  // Update last login timestamp
  user.lastLoginAt = new Date().toISOString();

  // Generate JWT token
  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  dataStore.recordAuditLog(user.id, user.name, 'LOGIN', 'AdminUser', user.id, {
    ip: req.ip,
  });

  const permissions = getPermissionsForRole(user.role);

  res.status(200).json({
    success: true,
    message: 'Administrative login successful.',
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions,
        lastLoginAt: user.lastLoginAt,
      },
    },
  });
};

export const getMe = (req: AuthenticatedRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }

  const user = dataStore.adminUsers.find((u) => u.id === req.user?.userId);

  if (!user || user.status !== 'ACTIVE') {
    res.status(401).json({ success: false, message: 'User account invalid or inactive.' });
    return;
  }

  const permissions = getPermissionsForRole(user.role);

  res.status(200).json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions,
      lastLoginAt: user.lastLoginAt,
    },
  });
};

export const logout = (req: AuthenticatedRequest, res: Response): void => {
  if (req.user) {
    dataStore.recordAuditLog(req.user.userId, req.user.name, 'LOGOUT', 'AdminUser', req.user.userId);
  }

  res.status(200).json({
    success: true,
    message: 'Successfully logged out.',
  });
};
