import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PermissionType } from '../../types/rbac';
import { AccessDeniedPage } from '../../pages/admin/AccessDeniedPage';
import { RefreshCw } from 'lucide-react';

interface RequirePermissionProps {
  permission: PermissionType | PermissionType[];
  children: React.ReactNode;
}

export const RequirePermission: React.FC<RequirePermissionProps> = ({ permission, children }) => {
  const { isAuthenticated, isLoading, hasPermission, hasAnyPermission } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <RefreshCw size={36} className="spin" color="var(--color-primary)" style={{ margin: '0 auto 1rem auto' }} />
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary-dark)' }}>
            Verifying Access Privileges...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  const isAllowed = Array.isArray(permission)
    ? hasAnyPermission(permission)
    : hasPermission(permission);

  if (!isAllowed) {
    return <AccessDeniedPage requiredPermission={permission} />;
  }

  return <>{children}</>;
};
