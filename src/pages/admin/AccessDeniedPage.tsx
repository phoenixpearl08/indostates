import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PermissionType } from '../../types/rbac';

interface AccessDeniedPageProps {
  requiredPermission?: PermissionType | PermissionType[];
}

export const AccessDeniedPage: React.FC<AccessDeniedPageProps> = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin', { replace: true });
  };

  return (
    <div 
      style={{ 
        minHeight: '70vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '2rem 1rem',
        backgroundColor: '#f8fafc' 
      }}
    >
      <div 
        className="card" 
        style={{ 
          maxWidth: '520px', 
          width: '100%', 
          padding: '2.5rem 2rem', 
          textAlign: 'center',
          boxShadow: 'var(--shadow-md)',
          borderTop: '4px solid #ef4444'
        }}
      >
        <div 
          style={{ 
            width: 64, 
            height: 64, 
            borderRadius: '50%', 
            backgroundColor: '#fee2e2', 
            color: '#dc2626', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 1.25rem auto' 
          }}
        >
          <ShieldAlert size={36} />
        </div>

        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
          Error 403 • Forbidden
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: '0 0 0.5rem 0' }}>
          Access Denied
        </h2>

        <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          You do not have permission to access this administrative section.
        </p>

        {user && (
          <div 
            style={{ 
              backgroundColor: '#f1f5f9', 
              padding: '0.75rem 1rem', 
              borderRadius: 'var(--radius-sm)', 
              fontSize: '0.82rem', 
              color: 'var(--color-text-secondary)',
              marginBottom: '2rem',
              textAlign: 'left'
            }}
          >
            <div><strong>Active User:</strong> {user.name} ({user.email})</div>
            <div><strong>Assigned Role:</strong> <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>{role}</span></div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigate('/admin/dashboard')} 
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <LayoutDashboard size={15} />
            <span>Return to Dashboard</span>
          </button>

          <button
            onClick={handleLogout}
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#dc2626', borderColor: '#fca5a5' }}
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
