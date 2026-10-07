"use client";

import React, { useState } from "react";
import {
  Shield,
  CheckCircle2,
  Lock,
  Save,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface RolesViewProps {
  rolesData: any;
  onRefresh: () => void;
  onSetFeedback: (fb: { type: "success" | "error"; message: string }) => void;
}

export function RolesView({ rolesData, onRefresh, onSetFeedback }: RolesViewProps) {
  const [selectedRole, setSelectedRole] = useState("DOCTOR");
  const [permissions, setPermissions] = useState<any[]>(rolesData?.permissions || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = rolesData?.roles || [
    "SUPER_ADMIN",
    "HOSPITAL_ADMIN",
    "MEDICAL_DIRECTOR",
    "DOCTOR",
    "NURSE",
    "RECEPTIONIST",
    "LAB_TECHNICIAN",
    "PHARMACY_STAFF",
    "BILLING_STAFF",
    "SECURITY_STAFF",
    "PATIENT",
  ];

  const modules = rolesData?.modules || [
    { id: "ALL", name: "Global Hospital System" },
    { id: "CLINICAL", name: "Clinical & Consultation Suite" },
    { id: "PATIENTS", name: "Patient Registry & Demographics" },
    { id: "APPOINTMENTS", name: "Appointment Scheduling & Check-In" },
    { id: "IPD", name: "Inpatient Bed & Ward Control" },
    { id: "EMERGENCY", name: "Emergency Trauma & Ambulance" },
    { id: "LAB", name: "Automated Diagnostic Laboratory" },
    { id: "PHARMACY", name: "Pharmacy Inventory & Dispensing" },
    { id: "BILLING", name: "Patient Accounts & TPA Billing" },
    { id: "SECURITY", name: "Campus Security & Turnstiles" },
    { id: "REPORTS", name: "Executive Reports & Analytics" },
  ];

  const handleToggle = (module: string, field: "canRead" | "canCreate" | "canEdit" | "canDelete" | "canExport") => {
    setPermissions((prev) => {
      const existing = prev.find((p) => p.role === selectedRole && p.module === module);
      if (existing) {
        return prev.map((p) =>
          p.role === selectedRole && p.module === module ? { ...p, [field]: !p[field] } : p
        );
      } else {
        return [
          ...prev,
          {
            role: selectedRole,
            module,
            canRead: field === "canRead",
            canCreate: field === "canCreate",
            canEdit: field === "canEdit",
            canDelete: field === "canDelete",
            canExport: field === "canExport",
          },
        ];
      }
    });
  };

  const handleSaveModule = async (module: string) => {
    const item = permissions.find((p) => p.role === selectedRole && p.module === module) || {
      canRead: true,
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canExport: false,
    };

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: selectedRole,
          module,
          permissions: {
            canRead: item.canRead,
            canCreate: item.canCreate,
            canEdit: item.canEdit,
            canDelete: item.canDelete,
            canExport: item.canExport,
          },
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSetFeedback({ type: "success", message: data.message });
        onRefresh();
      } else {
        onSetFeedback({ type: "error", message: data.error || "Failed to update permissions." });
      }
    } catch {
      onSetFeedback({ type: "error", message: "Network error saving RBAC policies." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Role-Based Access Control (RBAC) Matrix</h2>
          <p className="text-xs text-slate-500">
            Define granular permissions across clinical, administrative, financial, and diagnostic modules
          </p>
        </div>
      </div>

      {/* Role Picker Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {roles.map((r: string) => (
          <button
            key={r}
            onClick={() => setSelectedRole(r)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedRole === r
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-600" />
            <span className="font-bold text-xs text-slate-800">Active Permissions for: {selectedRole}</span>
          </div>
          <span className="text-[11px] text-slate-500 font-semibold">11 Hospital Functional Modules</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] uppercase font-bold text-slate-500 bg-slate-50/60 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Hospital Functional Module</th>
                <th className="py-3 px-3 text-center">Read / View</th>
                <th className="py-3 px-3 text-center">Create</th>
                <th className="py-3 px-3 text-center">Edit / Modify</th>
                <th className="py-3 px-3 text-center">Delete</th>
                <th className="py-3 px-3 text-center">Export / Report</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {modules.map((mod: any) => {
                const perm = permissions.find((p) => p.role === selectedRole && p.module === mod.id) || {
                  canRead: selectedRole === "SUPER_ADMIN",
                  canCreate: selectedRole === "SUPER_ADMIN",
                  canEdit: selectedRole === "SUPER_ADMIN",
                  canDelete: selectedRole === "SUPER_ADMIN",
                  canExport: selectedRole === "SUPER_ADMIN",
                };

                return (
                  <tr key={mod.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{mod.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{mod.id}</div>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={!!perm.canRead}
                        onChange={() => handleToggle(mod.id, "canRead")}
                        className="rounded text-hospital-600 focus:ring-hospital-500"
                      />
                    </td>

                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={!!perm.canCreate}
                        onChange={() => handleToggle(mod.id, "canCreate")}
                        className="rounded text-hospital-600 focus:ring-hospital-500"
                      />
                    </td>

                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={!!perm.canEdit}
                        onChange={() => handleToggle(mod.id, "canEdit")}
                        className="rounded text-hospital-600 focus:ring-hospital-500"
                      />
                    </td>

                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={!!perm.canDelete}
                        onChange={() => handleToggle(mod.id, "canDelete")}
                        className="rounded text-rose-600 focus:ring-rose-500"
                      />
                    </td>

                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={!!perm.canExport}
                        onChange={() => handleToggle(mod.id, "canExport")}
                        className="rounded text-hospital-600 focus:ring-hospital-500"
                      />
                    </td>

                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSaveModule(mod.id)}
                        disabled={isSubmitting}
                        className="text-[11px] h-7 px-2"
                      >
                        <Save className="w-3 h-3 mr-1" />
                        <span>Save</span>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
