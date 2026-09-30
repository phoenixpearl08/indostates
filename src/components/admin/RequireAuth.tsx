import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RefreshCw } from 'lucide-react';

interface RequireAuthProps {
  children: React.ReactNode;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <RefreshCw size={36} className="spin" color="var(--color-primary)" style={{ margin: '0 auto 1rem auto' }} />
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary-dark)' }}>
            Verifying Administrative Session...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated user to admin login
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
