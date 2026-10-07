"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HospitalStore, UserSession } from "@/lib/store";
import { AdminSidebar, AdminTabId } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OverviewView } from "@/components/admin/views/OverviewView";
import { PatientsView } from "@/components/admin/views/PatientsView";
import { DoctorsView } from "@/components/admin/views/DoctorsView";
import { StaffView } from "@/components/admin/views/StaffView";
import { DepartmentsView } from "@/components/admin/views/DepartmentsView";
import { AppointmentsView } from "@/components/admin/views/AppointmentsView";
import { BedsView } from "@/components/admin/views/BedsView";
import { EmergencyView } from "@/components/admin/views/EmergencyView";
import { LaboratoryView } from "@/components/admin/views/LaboratoryView";
import { PharmacyView } from "@/components/admin/views/PharmacyView";
import { BillingView } from "@/components/admin/views/BillingView";
import { RolesView } from "@/components/admin/views/RolesView";
import { NotificationsView } from "@/components/admin/views/NotificationsView";
import { AnnouncementsView } from "@/components/admin/views/AnnouncementsView";
import { ReportsView } from "@/components/admin/views/ReportsView";
import { WebsiteView } from "@/components/admin/views/WebsiteView";
import { HelpDeskView } from "@/components/admin/views/HelpDeskView";
import { LanguagesView } from "@/components/admin/views/LanguagesView";
import { SearchView } from "@/components/admin/views/SearchView";
import { SecurityView } from "@/components/admin/views/SecurityView";
import { AuditLogsView } from "@/components/admin/views/AuditLogsView";
import { IntegrationsView } from "@/components/admin/views/IntegrationsView";
import { SystemHealthView } from "@/components/admin/views/SystemHealthView";
import { SettingsView } from "@/components/admin/views/SettingsView";
import { ProfileView } from "@/components/admin/views/ProfileView";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [session, setSession] = useState<UserSession | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Active Tab State
  const initialTab = (searchParams.get("tab") as AdminTabId) || "overview";
  const [activeTab, setActiveTab] = useState<AdminTabId>(initialTab);

  // Operational Data States from Real APIs
  const [overviewData, setOverviewData] = useState<any | null>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [beds, setBeds] = useState<any[]>([]);
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [emergencyData, setEmergencyData] = useState<any | null>(null);
  const [labData, setLabData] = useState<any | null>(null);
  const [pharmacyData, setPharmacyData] = useState<any | null>(null);
  const [billingData, setBillingData] = useState<any | null>(null);
  const [rolesData, setRolesData] = useState<any | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Hydration safety check and Auth Guard
  useEffect(() => {
    setIsMounted(true);
    const s = HospitalStore.getSession();
    const adminRoles = [
      "SUPER_ADMIN",
      "HOSPITAL_ADMIN",
      "MEDICAL_DIRECTOR",
      "OPERATIONS_MANAGER",
      "HR_MANAGER",
      "FINANCE_MANAGER",
    ];

    if (!s) {
      window.location.href = "/login?portal=admin&redirect=/admin/dashboard";
      return;
    }

    if (!adminRoles.includes((s.role || "").toUpperCase())) {
      window.location.href = "/patient/dashboard?error=unauthorized_access";
      return;
    }

    setSession(s);
    setIsAuthChecking(false);
    fetchAllAdminData();
  }, []);

  // Update tab in URL without full reload
  const handleSelectTab = (tab: AdminTabId) => {
    setActiveTab(tab);
    window.history.replaceState(null, "", `/admin/dashboard?tab=${tab}`);
  };

  const fetchAllAdminData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [
        overviewRes,
        patientsRes,
        doctorsRes,
        staffRes,
        deptRes,
        apptsRes,
        ipdRes,
        emgRes,
        labRes,
        pharmRes,
        billRes,
        rolesRes,
        notifRes,
        annRes,
        auditRes,
      ] = await Promise.all([
        fetch("/api/admin/overview").catch(() => null),
        fetch("/api/admin/patients").catch(() => null),
        fetch("/api/admin/doctors").catch(() => null),
        fetch("/api/admin/staff").catch(() => null),
        fetch("/api/admin/departments").catch(() => null),
        fetch("/api/admin/appointments").catch(() => null),
        fetch("/api/admin/ipd").catch(() => null),
        fetch("/api/admin/emergency").catch(() => null),
        fetch("/api/admin/lab").catch(() => null),
        fetch("/api/admin/pharmacy").catch(() => null),
        fetch("/api/admin/billing").catch(() => null),
        fetch("/api/admin/roles").catch(() => null),
        fetch("/api/admin/notifications").catch(() => null),
        fetch("/api/admin/announcements").catch(() => null),
        fetch("/api/admin/audit").catch(() => null),
      ]);

      if (overviewRes && overviewRes.ok) {
        const d = await overviewRes.json();
        if (d.success) setOverviewData(d);
      }
      if (patientsRes && patientsRes.ok) {
        const d = await patientsRes.json();
        if (d.success) setPatients(d.patients || []);
      }
      if (doctorsRes && doctorsRes.ok) {
        const d = await doctorsRes.json();
        if (d.success) setDoctors(d.doctors || []);
      }
      if (staffRes && staffRes.ok) {
        const d = await staffRes.json();
        if (d.success) setStaffList(d.staff || []);
      }
      if (deptRes && deptRes.ok) {
        const d = await deptRes.json();
        if (d.success) setDepartments(d.departments || []);
      }
      if (apptsRes && apptsRes.ok) {
        const d = await apptsRes.json();
        if (d.success) setAppointments(d.appointments || []);
      }
      if (ipdRes && ipdRes.ok) {
        const d = await ipdRes.json();
        if (d.success) {
          setBeds(d.beds || []);
          setAdmissions(d.admissions || []);
          setWards(d.wards || []);
        }
      }
      if (emgRes && emgRes.ok) {
        const d = await emgRes.json();
        if (d.success) setEmergencyData(d);
      }
      if (labRes && labRes.ok) {
        const d = await labRes.json();
        if (d.success) setLabData(d);
      }
      if (pharmRes && pharmRes.ok) {
        const d = await pharmRes.json();
        if (d.success) setPharmacyData(d);
      }
      if (billRes && billRes.ok) {
        const d = await billRes.json();
        if (d.success) setBillingData(d);
      }
      if (rolesRes && rolesRes.ok) {
        const d = await rolesRes.json();
        if (d.success) setRolesData(d);
      }
      if (notifRes && notifRes.ok) {
        const d = await notifRes.json();
        if (d.success) setNotifications(d.notifications || []);
      }
      if (annRes && annRes.ok) {
        const d = await annRes.json();
        if (d.success) setAnnouncements(d.announcements || []);
      }
      if (auditRes && auditRes.ok) {
        const d = await auditRes.json();
        if (d.success) setAuditLogs(d.logs || []);
      }
    } catch (err) {
      console.error("Admin dashboard data fetch error:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const handleLogout = async () => {
    await HospitalStore.logout();
    window.location.href = "/login?portal=admin";
  };

  const handleQuickAction = (action: "add_patient" | "broadcast_alert" | "emergency") => {
    if (action === "add_patient") {
      handleSelectTab("patients");
    } else if (action === "broadcast_alert") {
      handleSelectTab("notifications");
    } else if (action === "emergency") {
      handleSelectTab("emergency");
    }
  };

  if (!isMounted || isAuthChecking || isLoading) {
    return <DashboardSkeleton title="IndoStates Hospital Command Center &amp; Governance Center..." />;
  }

  // Sidebar live badge counts
  const badgeCounts = {
    patients: patients.length,
    appointments: appointments.length,
    emergency: emergencyData?.summary?.totalActive || 0,
    lab: labData?.summary?.pendingReports || 0,
    pharmacy: pharmacyData?.summary?.lowStockItemsCount || 0,
    alerts: overviewData?.alerts?.length || 0,
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header Command Ribbon */}
      <AdminHeader
        userRole={session?.role || "SUPER_ADMIN"}
        userName={session?.name || "Administrator"}
        alerts={overviewData?.alerts || []}
        onRefresh={fetchAllAdminData}
        onLogout={handleLogout}
        onQuickAction={handleQuickAction}
        isRefreshing={isRefreshing}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex max-w-[1680px] w-full mx-auto">
        {/* Left Sticky/Responsive Sidebar matching Section 28 */}
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          onLogout={handleLogout}
          userRole={session?.role || "ADMIN"}
          counts={badgeCounts}
        />

        {/* Right Active View Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 space-y-6">
          {/* Feedback Toast */}
          {feedback && (
            <div
              className={`p-3.5 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-xs ${
                feedback.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              <div className="flex items-center gap-2">
                {feedback.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
              <button
                onClick={() => setFeedback(null)}
                className="p-1 rounded-lg hover:bg-black/5 text-slate-500 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Tab 1: Executive Overview */}
          {activeTab === "overview" && (
            <OverviewView overviewData={overviewData} onNavigateTab={handleSelectTab} />
          )}

          {/* Tab 2: Patients Management */}
          {activeTab === "patients" && (
            <PatientsView
              patients={patients}
              onRefresh={fetchAllAdminData}
              onSetFeedback={setFeedback}
            />
          )}

          {/* Tab 3: Doctors Management */}
          {activeTab === "doctors" && (
            <DoctorsView
              doctors={doctors}
              onRefresh={fetchAllAdminData}
              onSetFeedback={setFeedback}
            />
          )}

          {/* Tab 4: Staff Directory */}
          {activeTab === "staff" && (
            <StaffView
              staffList={staffList}
              onRefresh={fetchAllAdminData}
              onSetFeedback={setFeedback}
            />
          )}

          {/* Tab 5: Departments */}
          {activeTab === "departments" && (
            <DepartmentsView
              departments={departments}
              onRefresh={fetchAllAdminData}
              onSetFeedback={setFeedback}
            />
          )}

          {/* Tab 6: Appointments */}
          {activeTab === "appointments" && (
            <AppointmentsView
              appointments={appointments}
              onRefresh={fetchAllAdminData}
              onSetFeedback={setFeedback}
            />
          )}

          {/* Tab 7: Admissions & Beds */}
          {activeTab === "beds" && (
            <BedsView
              beds={beds}
              admissions={admissions}
              wards={wards}
              onRefresh={fetchAllAdminData}
              onSetFeedback={setFeedback}
            />
          )}

          {/* Tab 8: Emergency & Trauma */}
          {activeTab === "emergency" && (
            <EmergencyView
              emergencyData={emergencyData}
              onRefresh={fetchAllAdminData}
              onSetFeedback={setFeedback}
            />
          )}

          {/* Tab 9: Diagnostic Laboratory */}
          {activeTab === "laboratory" && (
            <LaboratoryView
              labData={labData}
              onRefresh={fetchAllAdminData}
              onSetFeedback={setFeedback}
            />
          )}

          {/* Tab 10: Pharmacy & Formulary */}
          {activeTab === "pharmacy" && (
            <PharmacyView
              pharmacyData={pharmacyData}
              onRefresh={fetchAllAdminData}
              onSetFeedback={setFeedback}
            />
          )}

          {/* Tab 11: Billing & Finance */}
          {activeTab === "billing" && (
            <BillingView
              billingData={billingData}
              onRefresh={fetchAllAdminData}
              onSetFeedback={setFeedback}
            />
          )}

          {/* Tab 12: Roles & Permissions (RBAC) */}
          {activeTab === "roles" && (
            <RolesView
              rolesData={rolesData}
              onRefresh={fetchAllAdminData}
              onSetFeedback={setFeedback}
            />
          )}

          {/* Tab 13: Notification Center */}
          {activeTab === "notifications" && (
            <NotificationsView
              notifications={notifications}
              onRefresh={fetchAllAdminData}
              onSetFeedback={setFeedback}
            />
          )}

          {/* Tab 14: Announcements CMS */}
          {activeTab === "announcements" && (
            <AnnouncementsView
              announcements={announcements}
              onRefresh={fetchAllAdminData}
              onSetFeedback={setFeedback}
            />
          )}

          {/* Tab 15: Reports & Analytics */}
          {activeTab === "reports" && <ReportsView onSetFeedback={setFeedback} />}

          {/* Tab 16: Website CMS */}
          {activeTab === "website" && <WebsiteView onSetFeedback={setFeedback} />}

          {/* Tab 17: IndoStates Help Desk AI */}
          {activeTab === "helpdesk" && <HelpDeskView onSetFeedback={setFeedback} />}

          {/* Tab 18: Multilingual Management */}
          {activeTab === "languages" && <LanguagesView onSetFeedback={setFeedback} />}

          {/* Tab 19: Search Management */}
          {activeTab === "search" && <SearchView onSetFeedback={setFeedback} />}

          {/* Tab 20: Security Center */}
          {activeTab === "security" && <SecurityView onSetFeedback={setFeedback} />}

          {/* Tab 21: Audit Logs */}
          {activeTab === "audit" && (
            <AuditLogsView
              auditLogs={auditLogs}
              onRefresh={fetchAllAdminData}
              onSetFeedback={setFeedback}
            />
          )}

          {/* Tab 22: Integrations Center */}
          {activeTab === "integrations" && <IntegrationsView onSetFeedback={setFeedback} />}

          {/* Tab 23: System Health */}
          {activeTab === "health" && <SystemHealthView onSetFeedback={setFeedback} />}

          {/* Tab 24: System Settings */}
          {activeTab === "settings" && <SettingsView onSetFeedback={setFeedback} />}

          {/* Tab 25: Admin Profile */}
          {activeTab === "profile" && (
            <ProfileView session={session} onSetFeedback={setFeedback} />
          )}
        </main>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AdminDashboardContent />
    </Suspense>
  );
}
