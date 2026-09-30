import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { PermissionType, RoleType, roleHasPermission } from '../config/rbac';

export { RoleType, PermissionType };

/**
 * Enforces that an authenticated user has the specified permission(s).
 * Returns HTTP 401 if unauthenticated, HTTP 403 if unauthorized.
 */
export const requirePermission = (required: PermissionType | PermissionType[]) => {
  const permissions = Array.isArray(required) ? required : [required];

  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    // Super Admin has unrestricted access
    if (req.user.role === 'SUPER_ADMIN' || req.user.permissions?.includes('SYSTEM_ADMIN')) {
      next();
      return;
    }

    const hasRequired = permissions.some((p) => req.user?.permissions?.includes(p));

    if (hasRequired) {
      next();
      return;
    }

    res.status(403).json({
      success: false,
      message: 'You do not have permission to perform this action',
      requiredPermission: permissions.length === 1 ? permissions[0] : permissions,
    });
  };
};

/**
 * Enforces that an authenticated user has one of the specified roles.
 * Returns HTTP 401 if unauthenticated, HTTP 403 if unauthorized.
 */
export const requireRole = (allowedRoles: RoleType[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    if (req.user.role === 'SUPER_ADMIN' || allowedRoles.includes(req.user.role as RoleType)) {
      next();
      return;
    }

    res.status(403).json({
      success: false,
      message: 'You do not have permission to perform this action',
      requiredRoles: allowedRoles,
    });
  };
};

// Backward-compatible alias for existing route definitions
export const authorize = (allowedRoles: RoleType[]) => requireRole(allowedRoles);
