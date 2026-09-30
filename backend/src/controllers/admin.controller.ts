import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { dataStore } from '../services/dataStore';
import { ROLE_PERMISSIONS, ALL_PERMISSIONS, RoleType } from '../config/rbac';

export const getDashboardStats = (req: AuthenticatedRequest, res: Response): void => {
  const stats = dataStore.getDashboardStats();
  res.status(200).json({
    success: true,
    data: stats,
  });
};

export const getAuditLogs = (req: AuthenticatedRequest, res: Response): void => {
  res.status(200).json({
    success: true,
    count: dataStore.auditLogs.length,
    data: dataStore.auditLogs.slice(0, 50),
  });
};

export const uploadFile = (req: AuthenticatedRequest, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ success: false, message: 'No file uploaded.' });
    return;
  }

  // Construct URL
  const fileUrl = `/uploads/${req.file.filename}`;

  if (req.user) {
    dataStore.recordAuditLog(req.user.userId, req.user.name, 'UPLOAD_FILE', 'File', req.file.filename, {
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
    });
  }

  res.status(200).json({
    success: true,
    message: 'File uploaded successfully.',
    data: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: fileUrl,
    },
  });
};

// --- User Administration (USER_VIEW, USER_CREATE, USER_UPDATE, USER_DELETE) ---

export const getUsers = (req: AuthenticatedRequest, res: Response): void => {
  const users = dataStore.adminUsers.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    lastLoginAt: u.lastLoginAt,
    createdAt: u.createdAt,
  }));

  res.status(200).json({
    success: true,
    data: users,
  });
};

export const createUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400).json({ success: false, message: 'Name, email, password, and role are required.' });
    return;
  }

  const existing = dataStore.adminUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    res.status(409).json({ success: false, message: 'User with this email already exists.' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: `admin-${Date.now()}`,
    name,
    email,
    passwordHash,
    role: role as RoleType,
    status: 'ACTIVE' as const,
    createdAt: new Date().toISOString(),
  };

  dataStore.adminUsers.push(newUser);

  if (req.user) {
    dataStore.recordAuditLog(req.user.userId, req.user.name, 'USER_CREATE', 'AdminUser', newUser.id, {
      email: newUser.email,
      role: newUser.role,
    });
  }

  res.status(201).json({
    success: true,
    message: 'User created successfully.',
    data: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      createdAt: newUser.createdAt,
    },
  });
};

export const updateUser = (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const { name, role, status } = req.body;

  const user = dataStore.adminUsers.find((u) => u.id === id);
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found.' });
    return;
  }

  if (name) user.name = name;
  if (role) user.role = role as RoleType;
  if (status) user.status = status;

  if (req.user) {
    dataStore.recordAuditLog(req.user.userId, req.user.name, 'USER_UPDATE', 'AdminUser', user.id, {
      name: user.name,
      role: user.role,
      status: user.status,
    });
  }

  res.status(200).json({
    success: true,
    message: 'User updated successfully.',
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });
};

export const deleteUser = (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;

  if (req.user?.userId === id) {
    res.status(400).json({ success: false, message: 'Cannot delete current active session administrator.' });
    return;
  }

  const index = dataStore.adminUsers.findIndex((u) => u.id === id);
  if (index === -1) {
    res.status(404).json({ success: false, message: 'User not found.' });
    return;
  }

  const deleted = dataStore.adminUsers.splice(index, 1)[0];

  if (req.user) {
    dataStore.recordAuditLog(req.user.userId, req.user.name, 'USER_DELETE', 'AdminUser', deleted.id, {
      email: deleted.email,
    });
  }

  res.status(200).json({
    success: true,
    message: 'User removed successfully.',
  });
};

// --- Roles & Permissions (ROLE_VIEW, ROLE_ASSIGN) ---

export const getRoles = (req: AuthenticatedRequest, res: Response): void => {
  const roles = Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => ({
    name: role,
    permissions,
    userCount: dataStore.adminUsers.filter((u) => u.role === role).length,
  }));

  res.status(200).json({
    success: true,
    data: {
      roles,
      allPermissions: ALL_PERMISSIONS,
    },
  });
};

export const assignRole = (req: AuthenticatedRequest, res: Response): void => {
  const { userId, role } = req.body;

  const user = dataStore.adminUsers.find((u) => u.id === userId);
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found.' });
    return;
  }

  const oldRole = user.role;
  user.role = role as RoleType;

  if (req.user) {
    dataStore.recordAuditLog(req.user.userId, req.user.name, 'ROLE_ASSIGN', 'AdminUser', user.id, {
      oldRole,
      newRole: role,
    });
  }

  res.status(200).json({
    success: true,
    message: `Role ${role} assigned successfully.`,
    data: {
      id: user.id,
      name: user.name,
      role: user.role,
    },
  });
};

// --- System Settings (SETTINGS_VIEW, SETTINGS_UPDATE) ---

interface SystemSettings {
  hospitalName: string;
  maintenanceMode: boolean;
  appointmentAutoAcknowledge: boolean;
  maxDailyAppointments: number;
  contactNotificationEmail: string;
  sessionTimeoutMinutes: number;
}

let systemSettings: SystemSettings = {
  hospitalName: 'IndoStates Hospital',
  maintenanceMode: false,
  appointmentAutoAcknowledge: true,
  maxDailyAppointments: 200,
  contactNotificationEmail: 'helpdesk@indostates.example',
  sessionTimeoutMinutes: 1440,
};

export const getSettings = (req: AuthenticatedRequest, res: Response): void => {
  res.status(200).json({
    success: true,
    data: systemSettings,
  });
};

export const updateSettings = (req: AuthenticatedRequest, res: Response): void => {
  systemSettings = {
    ...systemSettings,
    ...req.body,
  };

  if (req.user) {
    dataStore.recordAuditLog(req.user.userId, req.user.name, 'SETTINGS_UPDATE', 'SystemSettings', 'global', req.body);
  }

  res.status(200).json({
    success: true,
    message: 'System settings updated successfully.',
    data: systemSettings,
  });
};

// --- Reports (REPORT_VIEW) ---

export const getReports = (req: AuthenticatedRequest, res: Response): void => {
  const totalAppointments = dataStore.appointments.length;
  const confirmed = dataStore.appointments.filter((a) => a.status === 'CONFIRMED').length;
  const pending = dataStore.appointments.filter((a) => a.status === 'PENDING').length;
  const cancelled = dataStore.appointments.filter((a) => a.status === 'CANCELLED').length;
  const completed = dataStore.appointments.filter((a) => a.status === 'COMPLETED').length;

  const departmentCounts: Record<string, number> = {};
  dataStore.appointments.forEach((a) => {
    const dept = a.departmentName || 'General OPD';
    departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
  });

  res.status(200).json({
    success: true,
    data: {
      summary: {
        totalAppointments,
        confirmed,
        pending,
        cancelled,
        completed,
        totalEnquiries: dataStore.enquiries.length,
        resolvedEnquiries: dataStore.enquiries.filter((e) => e.status === 'RESOLVED').length,
      },
      departmentDistribution: departmentCounts,
      generatedAt: new Date().toISOString(),
    },
  });
};
