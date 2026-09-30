import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { dataStore } from '../services/dataStore';
import { getPermissionsForRole, PermissionType } from '../config/rbac';

// Extend Express Request type with authoritative user identity & permissions
export interface AuthenticatedUser extends TokenPayload {
  permissions: PermissionType[];
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);

    // Authoritative lookup against server-side dataStore
    const user = dataStore.adminUsers.find(
      (u) => u.id === decoded.userId && u.status === 'ACTIVE'
    );

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required: User account invalid or inactive.',
      });
      return;
    }

    // Attach verified server-side identity & permissions to request
    req.user = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: getPermissionsForRole(user.role),
    };

    next();
  } catch (err: any) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token. Please login again.',
    });
  }
};
