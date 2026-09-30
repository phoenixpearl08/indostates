import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  AlertCircle, 
  RefreshCw, 
  CalendarCheck, 
  Layers, 
  CheckCircle2, 
  ShieldAlert,
  Info
} from 'lucide-react';
import { RoleType } from '../../types/rbac';

interface AdminLoginPageProps {
  onLogin: (credentials: { email: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  isLoggingIn: boolean;
  loginError: string;
  setLoginError: (error: string) => void;
  sessionExpired?: boolean;
}

interface RoleOption {
  role: RoleType;
  title: string;
  description: string;
  defaultEmail: string;
  defaultPass: string;
  accentColor: string;
  badgeBg: string;
  icon: React.ReactNode;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: 'SUPER_ADMIN',
    title: 'Super Administrator',
    description: 'Full administrative access based on assigned permissions.',
    defaultEmail: 'admin@indostates.example',
    defaultPass: 'AdminPassword@2026',
    accentColor: '#38bdf8',
    badgeBg: 'rgba(56, 189, 248, 0.15)',
    icon: <ShieldCheck size={20} color="#38bdf8" />
  },
  {
    role: 'APPOINTMENT_MANAGER',
    title: 'Appointment Manager',
    description: 'Manage appointments and appointment-related operations.',
    defaultEmail: 'appointments@indostates.example',
    defaultPass: 'ApptPassword@2026',
    accentColor: '#4ade80',
    badgeBg: 'rgba(74, 222, 128, 0.15)',
    icon: <CalendarCheck size={20} color="#4ade80" />
  },
  {
    role: 'CONTENT_MANAGER',
    title: 'Content Manager',
    description: 'Manage approved content and inquiries.',
    defaultEmail: 'content@indostates.example',
    defaultPass: 'ContentPassword@2026',
    accentColor: '#c084fc',
    badgeBg: 'rgba(192, 132, 252, 0.15)',
    icon: <Layers size={20} color="#c084fc" />
  }
];

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLogin,
  isLoggingIn,
  loginError,
  setLoginError,
  sessionExpired
}) => {
  const [selectedRole, setSelectedRole] = useState<RoleType>('SUPER_ADMIN');
  const [email, setEmail] = useState<string>('admin@indostates.example');
  const [password, setPassword] = useState<string>('AdminPassword@2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberSession, setRememberSession] = useState<boolean>(true);

  // Handle Role Selection (Informational UX Helper)
  const handleSelectRole = (opt: RoleOption) => {
    setSelectedRole(opt.role);
    setEmail(opt.defaultEmail);
    setPassword(opt.defaultPass);
    setLoginError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setLoginError('Please provide both administrative email and password.');
      return;
    }
    await onLogin({ email: email.trim(), password });
  };

  return (
    <div 
      style={{ 
        minHeight: '90vh', 
        backgroundColor: '#0b1329', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '2.5rem 1rem',
        color: '#f8fafc'
      }}
    >
      {/* Return to Public Website link */}
      <div style={{ width: '100%', maxWidth: '820px', marginBottom: '1.25rem' }}>
        <Link 
          to="/" 
          style={{ 
            color: '#94a3b8', 
            fontSize: '0.86rem', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.45rem', 
            textDecoration: 'none',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
        >
          <ArrowLeft size={16} />
          <span>Return to Public Hospital Website</span>
        </Link>
      </div>

      <div 
        style={{ 
          width: '100%', 
          maxWidth: '820px', 
          backgroundColor: '#131e3a', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid #1e2e54', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden'
        }}
      >
        {/* Top Header Banner */}
        <div 
          style={{ 
            backgroundColor: '#0f172a', 
            padding: '1.5rem 2rem', 
            borderBottom: '1px solid #1e2e54',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div 
              style={{ 
                width: 44, 
                height: 44, 
                borderRadius: '10px', 
                backgroundColor: 'rgba(56, 189, 248, 0.15)', 
                color: '#38bdf8', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(56, 189, 248, 0.2)'
              }}
            >
              <ShieldCheck size={26} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
                IndoStates Hospital
              </div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 500 }}>
                Administrative Portal • Role-Based Access Control (RBAC)
              </div>
            </div>
          </div>

          <div 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              padding: '4px 10px', 
              borderRadius: 'var(--radius-full)', 
              backgroundColor: 'rgba(239, 68, 68, 0.12)', 
              border: '1px solid rgba(239, 68, 68, 0.3)',
              fontSize: '0.74rem',
              color: '#f87171',
              fontWeight: 600
            }}
          >
            <ShieldAlert size={13} />
            <span>Restricted Access • Audited System</span>
          </div>
        </div>

        {/* Security / Session Expired Notification */}
        {sessionExpired && (
          <div 
            style={{ 
              backgroundColor: 'rgba(234, 179, 8, 0.15)', 
              borderBottom: '1px solid rgba(234, 179, 8, 0.3)', 
              padding: '0.75rem 2rem', 
              color: '#fde047', 
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>Your administrative session has expired or requires authentication. Please sign in again.</span>
          </div>
        )}

        <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Left Column: RBAC Informational Role Options */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.75rem' }}>
              <Info size={16} color="#38bdf8" />
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Administrative Roles
              </h2>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
              Select a role card to explore designated capabilities or load corresponding demo credentials. 
              <strong style={{ color: '#cbd5e1' }}> Actual access is strictly governed by server-side verification.</strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {ROLE_OPTIONS.map((opt) => {
                const isSelected = selectedRole === opt.role;
                return (
                  <div
                    key={opt.role}
                    onClick={() => handleSelectRole(opt)}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'rgba(30, 46, 84, 0.9)' : '#0d162e',
                      border: isSelected ? `2px solid ${opt.accentColor}` : '1px solid #1e2e54',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? `0 0 15px -3px ${opt.accentColor}33` : 'none',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {opt.icon}
                        <span style={{ fontWeight: 700, fontSize: '0.92rem', color: isSelected ? opt.accentColor : '#ffffff' }}>
                          {opt.title}
                        </span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 size={16} color={opt.accentColor} />
                      )}
                    </div>

                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 0.5rem 0', lineHeight: 1.45 }}>
                      {opt.description}
                    </p>

                    <div style={{ fontSize: '0.74rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ color: '#94a3b8' }}>Demo User:</span>
                      <code>{opt.defaultEmail}</code>
                    </div>
                  </div>
                );
              })}
            </div>

            <div 
              style={{ 
                marginTop: '1.25rem', 
                padding: '0.75rem', 
                backgroundColor: 'rgba(15, 23, 42, 0.6)', 
                borderRadius: 'var(--radius-sm)',
                border: '1px dashed #334155',
                fontSize: '0.76rem',
                color: '#64748b',
                lineHeight: 1.4
              }}
            >
              🔒 <strong>RBAC Security Policy:</strong> Role options provide informational guidance. Entering credentials for an account will grant only the exact permissions authorized by the server, regardless of the selected card.
            </div>
          </div>

          {/* Right Column: Secure Login Form */}
          <div 
            style={{ 
              backgroundColor: '#0d162e', 
              padding: '1.75rem', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid #1e2e54',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.35rem 0', color: '#ffffff' }}>
                  Sign In to Console
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
                  Enter your verified administrative credentials
                </p>
              </div>

              {loginError && (
                <div 
                  style={{ 
                    backgroundColor: 'rgba(239, 68, 68, 0.15)', 
                    border: '1px solid rgba(239, 68, 68, 0.4)', 
                    borderRadius: 'var(--radius-sm)', 
                    padding: '0.75rem 1rem', 
                    color: '#fca5a5', 
                    fontSize: '0.84rem', 
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} id="admin-login-form">
                {/* Email Field */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label 
                    htmlFor="admin-email"
                    style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}
                  >
                    Administrative Email / Username
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      id="admin-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setLoginError('');
                      }}
                      placeholder="admin@indostates.example"
                      required
                      autoComplete="username"
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                        backgroundColor: '#070d1d',
                        border: '1px solid #1e2e54',
                        borderRadius: 'var(--radius-sm)',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                    />
                  </div>
                </div>

                {/* Password Field with Show/Hide */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label 
                    htmlFor="admin-password"
                    style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}
                  >
                    Secure Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setLoginError('');
                      }}
                      placeholder="••••••••••••"
                      required
                      autoComplete="current-password"
                      style={{
                        width: '100%',
                        padding: '0.65rem 2.5rem 0.65rem 2.4rem',
                        backgroundColor: '#070d1d',
                        border: '1px solid #1e2e54',
                        borderRadius: 'var(--radius-sm)',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title={showPassword ? 'Hide password' : 'Show password'}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember Session Option */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.82rem', color: '#94a3b8' }}>
                    <input 
                      type="checkbox"
                      checked={rememberSession}
                      onChange={(e) => setRememberSession(e.target.checked)}
                      style={{ accentColor: 'var(--color-primary)' }}
                    />
                    <span>Remember session on this device</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 600,
                    fontSize: '0.92rem',
                    cursor: isLoggingIn ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'background-color 0.2s',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {isLoggingIn ? (
                    <>
                      <RefreshCw size={16} className="spin" />
                      <span>Verifying Credentials & Permissions...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} />
                      <span>Sign In to Administrative Console</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Footer Support Info */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #1e2e54', fontSize: '0.76rem', color: '#64748b', textAlign: 'center' }}>
              Need assistance or password reset? Contact IndoStates Hospital IT Desk.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
