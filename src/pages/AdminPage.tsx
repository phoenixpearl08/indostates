import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  AlertTriangle, 
  ArrowLeft,
  CheckCircle2,
  Clock,
  Building,
  PhoneCall,
  Search,
  Filter,
  Plus,
  RefreshCw,
  LogOut,
  Eye,
  Check,
  X,
  Lock,
  Mail,
  UserCheck,
  Layers,
  Activity,
  CalendarCheck,
  AlertCircle,
  BarChart3,
  Sliders,
  Trash2
} from 'lucide-react';
import { 
  adminApi, 
  appointmentApi, 
  contactApi, 
  doctorApi,
  AppointmentRecord,
  ContactEnquiryRecord,
  DashboardMetrics,
  AuditLogItem,
  AdminUser,
  SystemSettings,
  ReportsSummary
} from '../services/api';
import { Doctor } from '../types';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { masterHospitalData } from '../data';
import { PermissionType, RoleType } from '../types/rbac';
import { AccessDeniedPage } from './admin/AccessDeniedPage';
import { AdminLoginPage } from './admin/AdminLoginPage';

/**
 * ==============================================================================
 * ARCHITECTURALLY ISOLATED ADMIN PORTAL (/admin & /admin/:tab)
 * ==============================================================================
 * Connects directly to Node.js + Express + Prisma REST APIs.
 * Enforces RBAC permissions across Frontend Views, Routes & Backend Endpoints.
 * Strictly isolated from public patient pages.
 * ==============================================================================
 */

type TabType = 
  | 'dashboard' 
  | 'appointments' 
  | 'doctors' 
  | 'enquiries' 
  | 'content' 
  | 'reports'
  | 'users'
  | 'roles'
  | 'settings'
  | 'audit-logs';

const TAB_PERMISSIONS: Record<TabType, PermissionType> = {
  dashboard: 'DASHBOARD_VIEW',
  appointments: 'APPOINTMENT_VIEW',
  doctors: 'HOSPITAL_VIEW',
  enquiries: 'CONTENT_VIEW',
  content: 'CONTENT_VIEW',
  reports: 'REPORT_VIEW',
  users: 'USER_VIEW',
  roles: 'ROLE_VIEW',
  settings: 'SETTINGS_VIEW',
  'audit-logs': 'AUDIT_LOG_VIEW',
};

export const AdminPage: React.FC = () => {
  const { showNotification } = useNotification();
  const { user: currentUser, role: userRole, hasPermission, login, logout, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { tab: routeTab } = useParams<{ tab?: string }>();

  // Determine active tab from URL with friendly aliases (inquiries -> enquiries, audit -> audit-logs, permissions -> roles)
  const normalizedTab = ((): TabType => {
    if (!routeTab) return 'dashboard';
    if (routeTab === 'inquiries') return 'enquiries';
    if (routeTab === 'audit') return 'audit-logs';
    if (routeTab === 'permissions') return 'roles';
    if (routeTab === 'hospitals' || routeTab === 'departments') return 'doctors';
    return routeTab as TabType;
  })();

  const activeTab: TabType = normalizedTab;

  // Login Form Error & Status State
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Data States
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [apptFilter, setApptFilter] = useState<string>('ALL');
  const [apptSearch, setApptSearch] = useState<string>('');
  const [selectedAppt, setSelectedAppt] = useState<AppointmentRecord | null>(null);
  const [actionNotes, setActionNotes] = useState<string>('');
  const [isUpdatingAppt, setIsUpdatingAppt] = useState<boolean>(false);

  // Doctors
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [docSearch, setDocSearch] = useState<string>('');
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState<boolean>(false);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    designation: '',
    department: 'Cardiology & Vascular Sciences',
    qualification: '[QUALIFICATION TO BE PROVIDED]',
    experience: '[EXPERIENCE TO BE PROVIDED]',
    opdTimings: 'Mon - Fri (09:00 AM - 01:00 PM)',
    opdRoom: 'Room [HOSPITAL TO PROVIDE]'
  });

  // Enquiries
  const [enquiries, setEnquiries] = useState<ContactEnquiryRecord[]>([]);
  const [enquiryFilter, setEnquiryFilter] = useState<string>('ALL');

  // Users & Roles
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState<boolean>(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'APPOINTMENT_MANAGER' as RoleType });
  const [rolesList, setRolesList] = useState<any[]>([]);

  // Settings
  const [settingsData, setSettingsData] = useState<SystemSettings | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false);

  // Reports
  const [reportsData, setReportsData] = useState<ReportsSummary | null>(null);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);

  // Refresh Loader
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  useEffect(() => {
    document.title = 'Administrative Portal | IndoStates Hospital';
  }, []);

  // Load Data for authorized sections
  const loadPortalData = async () => {
    if (!currentUser) return;
    setIsLoadingData(true);
    try {
      // 1. Dashboard Metrics (if DASHBOARD_VIEW)
      if (hasPermission('DASHBOARD_VIEW')) {
        const mRes = await adminApi.getDashboardMetrics();
        if (mRes.success && mRes.data) {
          setMetrics(mRes.data);
        }
      }

      // 2. Appointments (if APPOINTMENT_VIEW)
      if (hasPermission('APPOINTMENT_VIEW')) {
        const aRes = await appointmentApi.getAppointments();
        if (aRes.success && aRes.data) {
          setAppointments(aRes.data);
        }
      }

      // 3. Doctors (if HOSPITAL_VIEW)
      if (hasPermission('HOSPITAL_VIEW')) {
        const dRes = await doctorApi.getDoctors({ limit: 50 });
        if (dRes.success && dRes.data) {
          setDoctors(dRes.data);
        } else {
          setDoctors(masterHospitalData.doctors as unknown as Doctor[]);
        }
      }

      // 4. Enquiries (if CONTENT_VIEW)
      if (hasPermission('CONTENT_VIEW')) {
        const eRes = await contactApi.getEnquiries();
        if (eRes.success && eRes.data) {
          setEnquiries(eRes.data);
        }
      }

      // 5. Users & Roles (if USER_VIEW or ROLE_VIEW)
      if (hasPermission('USER_VIEW')) {
        const uRes = await adminApi.getUsers();
        if (uRes.success && uRes.data) {
          setAdminUsers(uRes.data);
        }
      }
      if (hasPermission('ROLE_VIEW')) {
        const rRes = await adminApi.getRoles();
        if (rRes.success && rRes.data) {
          setRolesList(rRes.data.roles);
        }
      }

      // 6. Settings (if SETTINGS_VIEW)
      if (hasPermission('SETTINGS_VIEW')) {
        const sRes = await adminApi.getSettings();
        if (sRes.success && sRes.data) {
          setSettingsData(sRes.data);
        }
      }

      // 7. Reports (if REPORT_VIEW)
      if (hasPermission('REPORT_VIEW')) {
        const repRes = await adminApi.getReports();
        if (repRes.success && repRes.data) {
          setReportsData(repRes.data);
        }
      }

      // 8. Audit Logs (if AUDIT_LOG_VIEW)
      if (hasPermission('AUDIT_LOG_VIEW')) {
        const logRes = await adminApi.getAuditLogs({ limit: 30 });
        if (logRes.success && logRes.data) {
          setAuditLogs(logRes.data);
        }
      }
    } catch (err) {
      console.warn('Error loading portal data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadPortalData();
    }
  }, [currentUser, activeTab]);

  // Handle Login
  const handleLoginSubmit = async (credentials: { email: string; password: string }): Promise<{ success: boolean; message?: string }> => {
    setLoginError('');
    setIsLoggingIn(true);

    const res = await login({
      email: credentials.email.trim(),
      password: credentials.password
    });

    setIsLoggingIn(false);

    if (res.success) {
      showNotification('success', 'Authentication Successful', `Welcome to IndoStates Hospital Administrative Console.`);
      navigate('/admin/dashboard', { replace: true });
      return { success: true };
    } else {
      const msg = res.message || 'Invalid administrative credentials.';
      setLoginError(msg);
      return { success: false, message: msg };
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await logout();
    navigate('/admin');
    showNotification('info', 'Logged Out', 'Administrative session securely terminated.');
  };

  // Switch Tab / Navigate URL
  const switchTab = (tab: TabType) => {
    navigate(`/admin/${tab}`);
  };

  // Appointment Status Modification
  const handleUpdateApptStatus = async (
    id: string,
    status: 'PENDING' | 'CONFIRMED' | 'RESCHEDULED' | 'CANCELLED' | 'COMPLETED'
  ) => {
    if (!hasPermission('APPOINTMENT_UPDATE')) {
      showNotification('error', 'Access Denied', 'You do not have permission to update appointments.');
      return;
    }

    setIsUpdatingAppt(true);
    try {
      const res = await appointmentApi.updateAppointmentStatus(id, status, actionNotes || undefined);
      if (res.success) {
        showNotification('success', 'Status Updated', `Appointment set to ${status}.`);
        setSelectedAppt(null);
        setActionNotes('');
        await loadPortalData();
      } else {
        showNotification('error', 'Update Failed', res.message || 'Could not update appointment.');
      }
    } catch {
      showNotification('error', 'Error', 'Failed to communicate with appointment service.');
    } finally {
      setIsUpdatingAppt(false);
    }
  };

  // Handle Enquiry Status
  const handleUpdateEnquiryStatus = async (id: string, status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED') => {
    if (!hasPermission('CONTENT_UPDATE')) {
      showNotification('error', 'Access Denied', 'You do not have permission to update enquiries.');
      return;
    }
    try {
      const res = await contactApi.updateEnquiryStatus(id, status);
      if (res.success) {
        showNotification('success', 'Enquiry Updated', `Enquiry marked as ${status}.`);
        await loadPortalData();
      }
    } catch {
      showNotification('error', 'Error', 'Failed to update enquiry.');
    }
  };

  // Handle Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('USER_CREATE')) {
      showNotification('error', 'Access Denied', 'You lack permission to create administrative users.');
      return;
    }

    try {
      const res = await adminApi.createUser(newUser);
      if (res.success) {
        showNotification('success', 'User Created', `${newUser.name} registered as ${newUser.role}.`);
        setIsAddUserOpen(false);
        setNewUser({ name: '', email: '', password: '', role: 'APPOINTMENT_MANAGER' });
        await loadPortalData();
      } else {
        showNotification('error', 'Creation Failed', res.message || 'Could not create user.');
      }
    } catch {
      showNotification('error', 'Error', 'Failed to communicate with user service.');
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (id: string) => {
    if (!hasPermission('USER_DELETE')) {
      showNotification('error', 'Access Denied', 'You lack permission to delete administrative users.');
      return;
    }
    if (!window.confirm('Are you sure you want to remove this administrative user?')) return;

    try {
      const res = await adminApi.deleteUser(id);
      if (res.success) {
        showNotification('success', 'User Removed', 'User account deactivated.');
        await loadPortalData();
      } else {
        showNotification('error', 'Delete Failed', res.message || 'Could not delete user.');
      }
    } catch {
      showNotification('error', 'Error', 'Failed to delete user.');
    }
  };

  // Handle Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('SETTINGS_UPDATE') || !settingsData) return;

    setIsSavingSettings(true);
    try {
      const res = await adminApi.updateSettings(settingsData);
      if (res.success) {
        showNotification('success', 'Settings Saved', 'Hospital system settings updated.');
      } else {
        showNotification('error', 'Save Failed', res.message || 'Could not save settings.');
      }
    } catch {
      showNotification('error', 'Error', 'Failed to save settings.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // --------------------------------------------------------------------------
  // RENDER 1: AUTH LOADING STATE
  // --------------------------------------------------------------------------
  if (isAuthLoading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <RefreshCw size={36} className="spin" color="var(--color-primary)" style={{ margin: '0 auto 1rem auto' }} />
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary-dark)' }}>
            Verifying Administrative Session & Permissions...
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER 2: UNAUTHENTICATED ACCESS
  // --------------------------------------------------------------------------
  if (!currentUser) {
    // CASE 2: If unauthenticated user navigates to /admin/dashboard or any deep tab, redirect to /admin
    if (routeTab) {
      return <Navigate to="/admin" replace />;
    }

    // CASE 1: Unauthenticated user on /admin -> Show the professional Admin Login Page
    return (
      <AdminLoginPage 
        onLogin={handleLoginSubmit}
        isLoggingIn={isLoggingIn}
        loginError={loginError}
        setLoginError={setLoginError}
        sessionExpired={location.state?.sessionExpired}
      />
    );
  }

  // --------------------------------------------------------------------------
  // RENDER 3: AUTHENTICATED ACCESS TO /admin ROOT
  // --------------------------------------------------------------------------
  // CASE 1 (authenticated): When an authenticated user accesses /admin, redirect to authorized dashboard
  if (!routeTab) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // --------------------------------------------------------------------------
  // RENDER 3: PERMISSION CHECK FOR CURRENT TAB
  // --------------------------------------------------------------------------
  const requiredPermissionForTab = TAB_PERMISSIONS[activeTab] || 'DASHBOARD_VIEW';
  const hasAccessToCurrentTab = hasPermission(requiredPermissionForTab);

  return (
    <div style={{ minHeight: '90vh', backgroundColor: '#f8fafc', paddingBottom: '4rem' }}>
      {/* Top Banner & User Profile */}
      <div 
        style={{ 
          backgroundColor: '#0f172a', 
          color: '#ffffff', 
          padding: '0.75rem 1.5rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1rem',
          borderBottom: '1px solid #1e293b'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div 
            style={{ 
              width: 32, 
              height: 32, 
              borderRadius: '6px', 
              backgroundColor: 'rgba(56, 189, 248, 0.2)', 
              color: '#38bdf8', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em' }}>
              IndoStates Hospital <span style={{ color: '#94a3b8', fontWeight: 400 }}>| Administration</span>
            </div>
          </div>
          <span 
            style={{ 
              fontSize: '0.7rem', 
              backgroundColor: '#1e293b', 
              color: '#38bdf8', 
              padding: '0.2rem 0.55rem', 
              borderRadius: '4px', 
              textTransform: 'uppercase', 
              fontWeight: 700,
              letterSpacing: '0.05em' 
            }}
          >
            {userRole}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <UserCheck size={14} color="#4ade80" />
            <span>{currentUser.name}</span>
          </div>

          <button
            onClick={() => loadPortalData()}
            title="Refresh Server Data"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <RefreshCw size={15} className={isLoadingData ? 'spin' : ''} />
          </button>

          <Link 
            to="/" 
            style={{ 
              color: '#94a3b8', 
              fontSize: '0.82rem', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.3rem', 
              textDecoration: 'none',
              backgroundColor: '#1e293b',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <ArrowLeft size={13} />
            <span>Hospital Site</span>
          </Link>

          <button
            onClick={handleLogout}
            style={{
              color: '#f87171',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              fontSize: '0.82rem',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '1.75rem' }}>
        {/* Role-Aware Tab Navigation Bar */}
        <div 
          style={{ 
            display: 'flex', 
            gap: '0.4rem', 
            borderBottom: '1px solid var(--color-border-medium)', 
            marginBottom: '2rem',
            overflowX: 'auto',
            paddingBottom: '2px'
          }}
        >
          {hasPermission('DASHBOARD_VIEW') && (
            <button
              onClick={() => switchTab('dashboard')}
              style={{
                padding: '0.75rem 1.15rem',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                border: 'none',
                backgroundColor: 'transparent',
                borderBottom: activeTab === 'dashboard' ? '3px solid var(--color-primary)' : '3px solid transparent',
                color: activeTab === 'dashboard' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                whiteSpace: 'nowrap'
              }}
            >
              <Activity size={16} />
              <span>Dashboard</span>
            </button>
          )}

          {hasPermission('APPOINTMENT_VIEW') && (
            <button
              onClick={() => switchTab('appointments')}
              style={{
                padding: '0.75rem 1.15rem',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                border: 'none',
                backgroundColor: 'transparent',
                borderBottom: activeTab === 'appointments' ? '3px solid var(--color-primary)' : '3px solid transparent',
                color: activeTab === 'appointments' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                whiteSpace: 'nowrap'
              }}
            >
              <Calendar size={16} />
              <span>Appointments</span>
              {appointments.filter(a => a.status === 'PENDING').length > 0 && (
                <span style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff', fontSize: '0.7rem', padding: '0.1rem 0.45rem', borderRadius: '10px' }}>
                  {appointments.filter(a => a.status === 'PENDING').length}
                </span>
              )}
            </button>
          )}

          {hasPermission('HOSPITAL_VIEW') && (
            <button
              onClick={() => switchTab('doctors')}
              style={{
                padding: '0.75rem 1.15rem',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                border: 'none',
                backgroundColor: 'transparent',
                borderBottom: activeTab === 'doctors' ? '3px solid var(--color-primary)' : '3px solid transparent',
                color: activeTab === 'doctors' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                whiteSpace: 'nowrap'
              }}
            >
              <Users size={16} />
              <span>Doctor Roster</span>
            </button>
          )}

          {hasPermission('CONTENT_VIEW') && (
            <>
              <button
                onClick={() => switchTab('enquiries')}
                style={{
                  padding: '0.75rem 1.15rem',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: 'transparent',
                  borderBottom: activeTab === 'enquiries' ? '3px solid var(--color-primary)' : '3px solid transparent',
                  color: activeTab === 'enquiries' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  whiteSpace: 'nowrap'
                }}
              >
                <PhoneCall size={16} />
                <span>Inquiries</span>
                {enquiries.filter(e => e.status === 'NEW').length > 0 && (
                  <span style={{ backgroundColor: '#ea580c', color: '#ffffff', fontSize: '0.7rem', padding: '0.1rem 0.45rem', borderRadius: '10px' }}>
                    {enquiries.filter(e => e.status === 'NEW').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => switchTab('content')}
                style={{
                  padding: '0.75rem 1.15rem',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: 'transparent',
                  borderBottom: activeTab === 'content' ? '3px solid var(--color-primary)' : '3px solid transparent',
                  color: activeTab === 'content' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  whiteSpace: 'nowrap'
                }}
              >
                <Layers size={16} />
                <span>Content</span>
              </button>
            </>
          )}

          {hasPermission('REPORT_VIEW') && (
            <button
              onClick={() => switchTab('reports')}
              style={{
                padding: '0.75rem 1.15rem',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                border: 'none',
                backgroundColor: 'transparent',
                borderBottom: activeTab === 'reports' ? '3px solid var(--color-primary)' : '3px solid transparent',
                color: activeTab === 'reports' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                whiteSpace: 'nowrap'
              }}
            >
              <BarChart3 size={16} />
              <span>Reports</span>
            </button>
          )}

          {hasPermission('USER_VIEW') && (
            <button
              onClick={() => switchTab('users')}
              style={{
                padding: '0.75rem 1.15rem',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                border: 'none',
                backgroundColor: 'transparent',
                borderBottom: activeTab === 'users' ? '3px solid var(--color-primary)' : '3px solid transparent',
                color: activeTab === 'users' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                whiteSpace: 'nowrap'
              }}
            >
              <ShieldCheck size={16} />
              <span>Users</span>
            </button>
          )}

          {hasPermission('ROLE_VIEW') && (
            <button
              onClick={() => switchTab('roles')}
              style={{
                padding: '0.75rem 1.15rem',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                border: 'none',
                backgroundColor: 'transparent',
                borderBottom: activeTab === 'roles' ? '3px solid var(--color-primary)' : '3px solid transparent',
                color: activeTab === 'roles' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                whiteSpace: 'nowrap'
              }}
            >
              <Sliders size={16} />
              <span>Roles</span>
            </button>
          )}

          {hasPermission('SETTINGS_VIEW') && (
            <button
              onClick={() => switchTab('settings')}
              style={{
                padding: '0.75rem 1.15rem',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                border: 'none',
                backgroundColor: 'transparent',
                borderBottom: activeTab === 'settings' ? '3px solid var(--color-primary)' : '3px solid transparent',
                color: activeTab === 'settings' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                whiteSpace: 'nowrap'
              }}
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>
          )}

          {hasPermission('AUDIT_LOG_VIEW') && (
            <button
              onClick={() => switchTab('audit-logs')}
              style={{
                padding: '0.75rem 1.15rem',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                border: 'none',
                backgroundColor: 'transparent',
                borderBottom: activeTab === 'audit-logs' ? '3px solid var(--color-primary)' : '3px solid transparent',
                color: activeTab === 'audit-logs' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                whiteSpace: 'nowrap'
              }}
            >
              <FileText size={16} />
              <span>Audit Trail</span>
            </button>
          )}
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* ACCESS DENIED CHECK: IF TAB IS UNAUTHORIZED FOR USER */}
        {/* ------------------------------------------------------------------ */}
        {!hasAccessToCurrentTab ? (
          <AccessDeniedPage requiredPermission={requiredPermissionForTab} />
        ) : (
          <>
            {/* -------------------------------------------------------------- */}
            {/* TAB: DASHBOARD */}
            {/* -------------------------------------------------------------- */}
            {activeTab === 'dashboard' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                  {hasPermission('HOSPITAL_VIEW') && (
                    <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-primary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Active Doctors</span>
                        <Users size={18} color="var(--color-primary)" />
                      </div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                        {metrics?.totalDoctors ?? doctors.length}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Registered medical consultants</div>
                    </div>
                  )}

                  {hasPermission('APPOINTMENT_VIEW') && (
                    <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #ea580c' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Pending Consultations</span>
                        <Calendar size={18} color="#ea580c" />
                      </div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#c2410c' }}>
                        {metrics?.pendingAppointments ?? appointments.filter(a => a.status === 'PENDING').length}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Awaiting desk verification</div>
                    </div>
                  )}

                  {hasPermission('CONTENT_VIEW') && (
                    <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #16a34a' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>New Inquiries</span>
                        <PhoneCall size={18} color="#16a34a" />
                      </div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#15803d' }}>
                        {metrics?.newEnquiries ?? enquiries.filter(e => e.status === 'NEW').length}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Submissions awaiting response</div>
                    </div>
                  )}

                  {hasPermission('HOSPITAL_VIEW') && (
                    <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #0284c7' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Clinical Departments</span>
                        <Building size={18} color="#0284c7" />
                      </div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0369a1' }}>
                        {metrics?.totalDepartments ?? 12}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Specialties configured in database</div>
                    </div>
                  )}
                </div>

                {/* Role welcome overview */}
                <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', margin: '0 0 0.5rem 0' }}>
                    Active Role: {userRole}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', margin: '0 0 1.25rem 0' }}>
                    You are logged in with role-based privileges. Only modules and actions authorized for your role are accessible.
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {hasPermission('APPOINTMENT_VIEW') && (
                      <button onClick={() => switchTab('appointments')} className="btn btn-outline btn-sm">
                        Manage Appointments
                      </button>
                    )}
                    {hasPermission('CONTENT_VIEW') && (
                      <button onClick={() => switchTab('content')} className="btn btn-outline btn-sm">
                        Manage Content
                      </button>
                    )}
                    {hasPermission('USER_VIEW') && (
                      <button onClick={() => switchTab('users')} className="btn btn-outline btn-sm">
                        Manage Users
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* TAB: APPOINTMENTS */}
            {/* -------------------------------------------------------------- */}
            {activeTab === 'appointments' && hasPermission('APPOINTMENT_VIEW') && (
              <div className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', margin: '0 0 0.25rem 0' }}>
                      Patient Consultation Requests Queue
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                      Verify and manage hospital appointment tokens.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      value={apptSearch}
                      onChange={(e) => setApptSearch(e.target.value)}
                      placeholder="Search patient, token, phone..."
                      style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', border: '1px solid var(--color-border-medium)', borderRadius: 'var(--radius-sm)' }}
                    />
                    <select
                      value={apptFilter}
                      onChange={(e) => setApptFilter(e.target.value)}
                      style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', border: '1px solid var(--color-border-medium)', borderRadius: 'var(--radius-sm)' }}
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="PENDING">Pending Only</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="RESCHEDULED">Rescheduled</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                </div>

                <div style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Token</th>
                        <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Patient</th>
                        <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Phone</th>
                        <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Department</th>
                        <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Doctor</th>
                        <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Date & Slot</th>
                        <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Status</th>
                        <th style={{ padding: '0.85rem 1rem', fontWeight: 600, textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments
                        .filter(a => (apptFilter === 'ALL' || a.status === apptFilter) && (!apptSearch || a.patientName.toLowerCase().includes(apptSearch.toLowerCase()) || a.appointmentNumber.toLowerCase().includes(apptSearch.toLowerCase())))
                        .map((a) => (
                          <tr key={a.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                            <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--color-primary)' }}>{a.appointmentNumber}</td>
                            <td style={{ padding: '1rem', fontWeight: 600 }}>{a.patientName}</td>
                            <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>{a.phone}</td>
                            <td style={{ padding: '1rem' }}>{a.departmentName || 'General OPD'}</td>
                            <td style={{ padding: '1rem' }}>{a.doctorName || 'Assigned Consultant'}</td>
                            <td style={{ padding: '1rem', fontSize: '0.82rem' }}>
                              <div><strong>{a.preferredDate}</strong></div>
                              <div style={{ color: 'var(--color-text-muted)' }}>{a.preferredTime}</div>
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <span className={`badge ${a.status === 'CONFIRMED' ? 'badge-primary' : 'badge-secondary'}`}>
                                {a.status}
                              </span>
                            </td>
                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                              <button onClick={() => setSelectedAppt(a)} className="btn btn-outline btn-sm" style={{ padding: '0.25rem 0.5rem' }}>
                                <Eye size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Appointment Modal */}
                {selectedAppt && (
                  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '540px', padding: '2rem', boxShadow: 'var(--shadow-xl)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-primary-dark)' }}>
                          Token: {selectedAppt.appointmentNumber}
                        </h4>
                        <button onClick={() => setSelectedAppt(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                          <X size={20} />
                        </button>
                      </div>

                      <div style={{ fontSize: '0.88rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                        <div><strong>Patient:</strong> {selectedAppt.patientName} ({selectedAppt.phone})</div>
                        <div><strong>Department:</strong> {selectedAppt.departmentName}</div>
                        <div><strong>Doctor:</strong> {selectedAppt.doctorName}</div>
                        <div><strong>Preferred Schedule:</strong> {selectedAppt.preferredDate} ({selectedAppt.preferredTime})</div>
                        <div style={{ marginTop: '0.5rem', backgroundColor: '#f8fafc', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                          <strong>Reason:</strong> {selectedAppt.reason}
                        </div>
                      </div>

                      {hasPermission('APPOINTMENT_UPDATE') && (
                        <div style={{ marginBottom: '1.25rem' }}>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                            Private Desk Notes:
                          </label>
                          <textarea
                            rows={2}
                            value={actionNotes}
                            onChange={(e) => setActionNotes(e.target.value)}
                            placeholder="Add private note for medical desk staff..."
                            className="form-control"
                          />
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        {hasPermission('APPOINTMENT_UPDATE') && (
                          <>
                            <button
                              disabled={isUpdatingAppt}
                              onClick={() => handleUpdateApptStatus(selectedAppt.id, 'CONFIRMED')}
                              style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.45rem 0.85rem', fontSize: '0.84rem', cursor: 'pointer' }}
                            >
                              Confirm
                            </button>
                            <button
                              disabled={isUpdatingAppt}
                              onClick={() => handleUpdateApptStatus(selectedAppt.id, 'RESCHEDULED')}
                              style={{ backgroundColor: '#d97706', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.45rem 0.85rem', fontSize: '0.84rem', cursor: 'pointer' }}
                            >
                              Reschedule
                            </button>
                            <button
                              disabled={isUpdatingAppt}
                              onClick={() => handleUpdateApptStatus(selectedAppt.id, 'CANCELLED')}
                              style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.45rem 0.85rem', fontSize: '0.84rem', cursor: 'pointer' }}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        <button onClick={() => setSelectedAppt(null)} className="btn btn-outline btn-sm">Close</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* TAB: DOCTORS */}
            {/* -------------------------------------------------------------- */}
            {activeTab === 'doctors' && hasPermission('HOSPITAL_VIEW') && (
              <div className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', margin: 0 }}>
                      Medical Consultants Roster
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                      Hospital clinical faculty schedules.
                    </p>
                  </div>
                  <input
                    type="text"
                    value={docSearch}
                    onChange={(e) => setDocSearch(e.target.value)}
                    placeholder="Search doctor..."
                    style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', border: '1px solid var(--color-border-medium)', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                  {doctors
                    .filter(d => !docSearch || d.name.toLowerCase().includes(docSearch.toLowerCase()))
                    .map((doc) => (
                      <div key={doc.id} style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem', backgroundColor: '#ffffff' }}>
                        <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)', fontSize: '0.98rem' }}>{doc.name}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--color-secondary)', fontWeight: 600 }}>{doc.department || doc.departmentName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                          <div>OPD: {doc.opdTimings || 'Consultation by appointment'}</div>
                          <div>Room: {doc.opdRoom || doc.location || 'OPD Wing'}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* TAB: ENQUIRIES */}
            {/* -------------------------------------------------------------- */}
            {activeTab === 'enquiries' && hasPermission('CONTENT_VIEW') && (
              <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', marginBottom: '1.25rem' }}>
                  Public Patient & Visitor Inquiries
                </h3>
                <div style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <th style={{ padding: '0.85rem 1rem' }}>Name</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Contact</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Subject</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Message</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                        <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enquiries.map((enq) => (
                        <tr key={enq.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                          <td style={{ padding: '1rem', fontWeight: 600 }}>{enq.name}</td>
                          <td style={{ padding: '1rem', fontSize: '0.82rem' }}>{enq.phone}<br/>{enq.email}</td>
                          <td style={{ padding: '1rem' }}>{enq.subject}</td>
                          <td style={{ padding: '1rem', maxWidth: '280px', fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>{enq.message}</td>
                          <td style={{ padding: '1rem' }}><span className="badge badge-primary">{enq.status}</span></td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>
                            {hasPermission('CONTENT_UPDATE') && enq.status !== 'RESOLVED' && (
                              <button onClick={() => handleUpdateEnquiryStatus(enq.id, 'RESOLVED')} className="btn btn-primary btn-sm" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
                                Resolve
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* TAB: CONTENT */}
            {/* -------------------------------------------------------------- */}
            {activeTab === 'content' && hasPermission('CONTENT_VIEW') && (
              <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', marginBottom: '1.5rem' }}>
                  Hospital Content & Media Management
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                  <div style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>Health Articles</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '0.5rem 0' }}>
                      {metrics?.publishedArticles ?? 4} Articles Published
                    </div>
                    <span className="badge badge-primary">Active</span>
                  </div>
                  <div style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>Hospital Events</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '0.5rem 0' }}>
                      {metrics?.upcomingEvents ?? 3} Upcoming Camps
                    </div>
                    <span className="badge badge-primary">Active</span>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* TAB: USERS */}
            {/* -------------------------------------------------------------- */}
            {activeTab === 'users' && hasPermission('USER_VIEW') && (
              <div className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', margin: 0 }}>
                      Administrative Users Management
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                      Accounts authorized to access the IndoStates management console.
                    </p>
                  </div>
                  {hasPermission('USER_CREATE') && (
                    <button onClick={() => setIsAddUserOpen(true)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Plus size={15} />
                      <span>Add User</span>
                    </button>
                  )}
                </div>

                <div style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <th style={{ padding: '0.85rem 1rem' }}>Name</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Email</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Role</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                        <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminUsers.map((u) => (
                        <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                          <td style={{ padding: '1rem', fontWeight: 600 }}>{u.name}</td>
                          <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>{u.email}</td>
                          <td style={{ padding: '1rem' }}><span className="badge badge-primary">{u.role}</span></td>
                          <td style={{ padding: '1rem' }}><span className="badge badge-neutral">{u.status || 'ACTIVE'}</span></td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>
                            {hasPermission('USER_DELETE') && u.id !== currentUser.id && (
                              <button onClick={() => handleDeleteUser(u.id)} className="btn btn-outline btn-sm" style={{ color: '#ef4444', borderColor: '#fca5a5', padding: '0.25rem 0.5rem' }}>
                                <Trash2 size={14} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add User Modal */}
                {isAddUserOpen && (
                  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '480px', padding: '2rem', boxShadow: 'var(--shadow-xl)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-primary-dark)' }}>Create Administrator</h4>
                        <button onClick={() => setIsAddUserOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
                      </div>

                      <form onSubmit={handleCreateUser}>
                        <div style={{ marginBottom: '1rem' }}>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.25rem' }}>Full Name</label>
                          <input type="text" value={newUser.name} onChange={(e) => setNewUser(p => ({ ...p, name: e.target.value }))} required className="form-control" />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.25rem' }}>Email Address</label>
                          <input type="email" value={newUser.email} onChange={(e) => setNewUser(p => ({ ...p, email: e.target.value }))} required className="form-control" />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.25rem' }}>Password</label>
                          <input type="password" value={newUser.password} onChange={(e) => setNewUser(p => ({ ...p, password: e.target.value }))} required className="form-control" />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.25rem' }}>RBAC Role</label>
                          <select value={newUser.role} onChange={(e) => setNewUser(p => ({ ...p, role: e.target.value as RoleType }))} className="form-control">
                            <option value="APPOINTMENT_MANAGER">Appointment Desk Manager</option>
                            <option value="CONTENT_MANAGER">Content Manager</option>
                            <option value="SUPER_ADMIN">Super Administrator</option>
                          </select>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button type="button" onClick={() => setIsAddUserOpen(false)} className="btn btn-outline btn-sm">Cancel</button>
                          <button type="submit" className="btn btn-primary btn-sm">Save User</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* TAB: ROLES */}
            {/* -------------------------------------------------------------- */}
            {activeTab === 'roles' && hasPermission('ROLE_VIEW') && (
              <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
                  RBAC Role & Permission Matrix
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                  Canonical privileges defined in the IndoStates Hospital security architecture.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                  {rolesList.map((r) => (
                    <div key={r.name} style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem', backgroundColor: '#ffffff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>{r.name}</span>
                        <span className="badge badge-secondary">{r.userCount} Users</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', maxHeight: '180px', overflowY: 'auto' }}>
                        <strong>Permissions Granted ({r.permissions.length}):</strong>
                        <ul style={{ paddingLeft: '1.2rem', margin: '0.35rem 0' }}>
                          {r.permissions.slice(0, 10).map((p: string) => (
                            <li key={p}><code>{p}</code></li>
                          ))}
                          {r.permissions.length > 10 && <li>...and {r.permissions.length - 10} more</li>}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* TAB: SETTINGS */}
            {/* -------------------------------------------------------------- */}
            {activeTab === 'settings' && hasPermission('SETTINGS_VIEW') && (
              <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
                  Hospital System Settings
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                  Global configuration and management switches.
                </p>

                {settingsData && (
                  <form onSubmit={handleSaveSettings} style={{ maxWidth: '540px' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.25rem' }}>Hospital Name</label>
                      <input 
                        type="text" 
                        value={settingsData.hospitalName} 
                        onChange={(e) => setSettingsData(p => p ? ({ ...p, hospitalName: e.target.value }) : null)} 
                        disabled={!hasPermission('SETTINGS_UPDATE')}
                        className="form-control" 
                      />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.25rem' }}>Helpdesk Notification Email</label>
                      <input 
                        type="email" 
                        value={settingsData.contactNotificationEmail} 
                        onChange={(e) => setSettingsData(p => p ? ({ ...p, contactNotificationEmail: e.target.value }) : null)} 
                        disabled={!hasPermission('SETTINGS_UPDATE')}
                        className="form-control" 
                      />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={settingsData.appointmentAutoAcknowledge} 
                          onChange={(e) => setSettingsData(p => p ? ({ ...p, appointmentAutoAcknowledge: e.target.checked }) : null)} 
                          disabled={!hasPermission('SETTINGS_UPDATE')}
                        />
                        <span>Automatically issue acknowledgement token on online appointment booking</span>
                      </label>
                    </div>

                    {hasPermission('SETTINGS_UPDATE') && (
                      <button type="submit" disabled={isSavingSettings} className="btn btn-primary btn-sm">
                        {isSavingSettings ? 'Saving...' : 'Save System Settings'}
                      </button>
                    )}
                  </form>
                )}
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* TAB: REPORTS */}
            {/* -------------------------------------------------------------- */}
            {activeTab === 'reports' && hasPermission('REPORT_VIEW') && (
              <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
                  Consultation & Operational Reports
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                  Operational summary across outpatient appointments and patient relations.
                </p>

                {reportsData && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ backgroundColor: '#f1f5f9', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>Total Consultation Requests</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>{reportsData.summary.totalAppointments}</div>
                    </div>
                    <div style={{ backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '0.82rem', color: '#166534' }}>Confirmed Consultations</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803d' }}>{reportsData.summary.confirmed}</div>
                    </div>
                    <div style={{ backgroundColor: '#fffbeb', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '0.82rem', color: '#92400e' }}>Pending Consultations</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b45309' }}>{reportsData.summary.pending}</div>
                    </div>
                    <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>Total Enquiries Resolved</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>{reportsData.summary.resolvedEnquiries}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* TAB: AUDIT LOGS */}
            {/* -------------------------------------------------------------- */}
            {activeTab === 'audit-logs' && hasPermission('AUDIT_LOG_VIEW') && (
              <div className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', margin: 0 }}>
                      Administrative Security Audit Trail
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                      Immutable ledger of administrative actions and permission usage.
                    </p>
                  </div>
                  <span className="badge badge-primary">Auditing Active</span>
                </div>

                <div style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <th style={{ padding: '0.75rem 1rem' }}>Timestamp</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Actor</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Action</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Entity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                          <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted)' }}>{new Date(log.timestamp).toLocaleString()}</td>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{log.adminUserName || log.adminUserId}</td>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--color-primary)' }}>{log.action}</td>
                          <td style={{ padding: '0.85rem 1rem' }}><code>{log.entity}#{log.entityId}</code></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
