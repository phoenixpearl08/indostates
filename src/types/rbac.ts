/**
 * Centralized RBAC Definitions for IndoStates Hospital Frontend
 * Matches backend canonical roles, permissions, and matrix.
 */

export type RoleType = 
  | 'SUPER_ADMIN' 
  | 'APPOINTMENT_MANAGER' 
  | 'CONTENT_MANAGER' 
  | 'HOSPITAL_ADMIN';

export type PermissionType =
  | 'SYSTEM_ADMIN'
  | 'DASHBOARD_VIEW'
  | 'USER_VIEW'
  | 'USER_CREATE'
  | 'USER_UPDATE'
  | 'USER_DELETE'
  | 'ROLE_VIEW'
  | 'ROLE_ASSIGN'
  | 'HOSPITAL_VIEW'
  | 'HOSPITAL_CREATE'
  | 'HOSPITAL_UPDATE'
  | 'HOSPITAL_DELETE'
  | 'APPOINTMENT_VIEW'
  | 'APPOINTMENT_CREATE'
  | 'APPOINTMENT_UPDATE'
  | 'APPOINTMENT_CANCEL'
  | 'APPOINTMENT_MANAGE'
  | 'CONTENT_VIEW'
  | 'CONTENT_CREATE'
  | 'CONTENT_UPDATE'
  | 'CONTENT_DELETE'
  | 'REPORT_VIEW'
  | 'AUDIT_LOG_VIEW'
  | 'SETTINGS_VIEW'
  | 'SETTINGS_UPDATE';

export const ALL_PERMISSIONS: PermissionType[] = [
  'SYSTEM_ADMIN',
  'DASHBOARD_VIEW',
  'USER_VIEW',
  'USER_CREATE',
  'USER_UPDATE',
  'USER_DELETE',
  'ROLE_VIEW',
  'ROLE_ASSIGN',
  'HOSPITAL_VIEW',
  'HOSPITAL_CREATE',
  'HOSPITAL_UPDATE',
  'HOSPITAL_DELETE',
  'APPOINTMENT_VIEW',
  'APPOINTMENT_CREATE',
  'APPOINTMENT_UPDATE',
  'APPOINTMENT_CANCEL',
  'APPOINTMENT_MANAGE',
  'CONTENT_VIEW',
  'CONTENT_CREATE',
  'CONTENT_UPDATE',
  'CONTENT_DELETE',
  'REPORT_VIEW',
  'AUDIT_LOG_VIEW',
  'SETTINGS_VIEW',
  'SETTINGS_UPDATE',
];

export const ROLE_PERMISSIONS: Record<RoleType, PermissionType[]> = {
  SUPER_ADMIN: [...ALL_PERMISSIONS],

  APPOINTMENT_MANAGER: [
    'DASHBOARD_VIEW',
    'APPOINTMENT_VIEW',
    'APPOINTMENT_CREATE',
    'APPOINTMENT_UPDATE',
    'APPOINTMENT_CANCEL',
    'APPOINTMENT_MANAGE',
    'HOSPITAL_VIEW',
  ],

  CONTENT_MANAGER: [
    'DASHBOARD_VIEW',
    'CONTENT_VIEW',
    'CONTENT_CREATE',
    'CONTENT_UPDATE',
    'CONTENT_DELETE',
    'HOSPITAL_VIEW',
  ],

  HOSPITAL_ADMIN: [
    'DASHBOARD_VIEW',
    'HOSPITAL_VIEW',
    'HOSPITAL_UPDATE',
    'APPOINTMENT_VIEW',
    'APPOINTMENT_UPDATE',
    'CONTENT_VIEW',
    'CONTENT_UPDATE',
    'REPORT_VIEW',
  ],
};

export const roleHasPermission = (role: string, permission: PermissionType): boolean => {
  if (role === 'SUPER_ADMIN') return true;
  const permissions = ROLE_PERMISSIONS[role as RoleType] || [];
  return permissions.includes(permission) || permissions.includes('SYSTEM_ADMIN');
};

export const getPermissionsForRole = (role: string): PermissionType[] => {
  if (role === 'SUPER_ADMIN') return [...ALL_PERMISSIONS];
  return ROLE_PERMISSIONS[role as RoleType] || [];
};
