"use client";

import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HospitalStore, UserSession } from "@/lib/store";
import { getRoleDashboard } from "@/lib/rbac";
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
import { CheckCircle2, AlertCircle, X, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Helper for safe fetch with timeout to prevent hanging requests
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

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

  // Loading and Error States
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [initialError, setInitialError] = useState<string | null>(null);
  const [tabLoading, setTabLoading] = useState<Record<string, boolean>>({});
  const [tabErrors, setTabErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Tab cache tracker using useRef to avoid re-render loops and callback instability
  const loadedTabsRef = useRef<Set<AdminTabId>>(new Set());
  const inFlightRequests = useRef<Set<string>>(new Set());

  // Logout handler
  const handleLogout = useCallback(async () => {
    await HospitalStore.logout();
    window.location.href = "/staff/login";
  }, []);

  // Fetch only the overview summary initially
  const fetchOverviewData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setInitialError(null);

    try {
      const res = await fetchWithTimeout("/api/admin/overview", {}, 8000);

      // Handle unauthenticated or expired staff session
      if (res.status === 401 || res.status === 403) {
        await HospitalStore.logout();
        window.location.href = "/staff/login?error=unauthorized_access&redirect=/admin/dashboard";
        return;
      }

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const d = await res.json();
      if (d.success) {
        setOverviewData(d);
        loadedTabsRef.current.add("overview");
      } else {
        throw new Error(d.error || "Failed to load dashboard overview.");
      }
    } catch (err: any) {
      console.error("Admin dashboard overview fetch error:", err);
      const msg = err.name === "AbortError"
        ? "Overview request timed out after 8s. Please click Retry below."
        : (err.message || "Unable to load dashboard overview.");

      if (!isRefresh) {
        setInitialError(msg);
      } else {
        setFeedback({ type: "error", message: `Overview refresh failed: ${msg}` });
      }
    } finally {
      if (!isRefresh) {
        setIsLoading(false);
      }
    }
  }, []);

  // Lazy-load data on demand for secondary tabs (Never toggles global isLoading)
  const loadTabData = useCallback(async (tab: AdminTabId, forceRefresh = false) => {
    // Overview tab is handled by fetchOverviewData
    if (tab === "overview") {
      if (forceRefresh) {
        return fetchOverviewData(true);
      }
      return;
    }

    // Tabs that self-fetch or use static content
    const selfManagedTabs: AdminTabId[] = [
      "reports",
      "website",
      "helpdesk",
      "languages",
      "search",
      "security",
      "integrations",
      "health",
      "settings",
      "profile",
    ];
    if (selfManagedTabs.includes(tab)) {
      loadedTabsRef.current.add(tab);
      return;
    }

    // Skip if already loaded and not force-refreshing
    if (loadedTabsRef.current.has(tab) && !forceRefresh) {
      return;
    }

    // Prevent duplicate concurrent requests for the same tab
    if (inFlightRequests.current.has(tab)) {
      return;
    }

    inFlightRequests.current.add(tab);
    setTabLoading((prev) => ({ ...prev, [tab]: true }));
    setTabErrors((prev) => ({ ...prev, [tab]: "" }));

    try {
      let endpoint = "";
      switch (tab) {
        case "patients": endpoint = "/api/admin/patients"; break;
        case "doctors": endpoint = "/api/admin/doctors"; break;
        case "staff": endpoint = "/api/admin/staff"; break;
        case "departments": endpoint = "/api/admin/departments"; break;
        case "appointments": endpoint = "/api/admin/appointments"; break;
        case "beds": endpoint = "/api/admin/ipd"; break;
        case "emergency": endpoint = "/api/admin/emergency"; break;
        case "laboratory": endpoint = "/api/admin/lab"; break;
        case "pharmacy": endpoint = "/api/admin/pharmacy"; break;
        case "billing": endpoint = "/api/admin/billing"; break;
        case "roles": endpoint = "/api/admin/roles"; break;
        case "notifications": endpoint = "/api/admin/notifications"; break;
        case "announcements": endpoint = "/api/admin/announcements"; break;
        case "audit": endpoint = "/api/admin/audit"; break;
        default: return;
      }

      const res = await fetchWithTimeout(endpoint, {}, 8000);

      if (res.status === 401 || res.status === 403) {
        await HospitalStore.logout();
        window.location.href = "/staff/login?error=session_expired&redirect=/admin/dashboard";
        return;
      }

      if (!res.ok) {
        throw new Error(`Section failed with HTTP ${res.status}`);
      }

      const d = await res.json();
      if (d.success) {
        switch (tab) {
          case "patients": setPatients(d.patients || []); break;
          case "doctors": setDoctors(d.doctors || []); break;
          case "staff": setStaffList(d.staff || []); break;
          case "departments": setDepartments(d.departments || []); break;
          case "appointments": setAppointments(d.appointments || []); break;
          case "beds":
            setBeds(d.beds || []);
            setAdmissions(d.admissions || []);
            setWards(d.wards || []);
            break;
          case "emergency": setEmergencyData(d); break;
          case "laboratory": setLabData(d); break;
          case "pharmacy": setPharmacyData(d); break;
          case "billing": setBillingData(d); break;
          case "roles": setRolesData(d); break;
          case "notifications": setNotifications(d.notifications || []); break;
          case "announcements": setAnnouncements(d.announcements || []); break;
          case "audit": setAuditLogs(d.logs || []); break;
        }
        loadedTabsRef.current.add(tab);
      } else {
        throw new Error(d.error || `Failed to load ${tab} data.`);
      }
    } catch (err: any) {
      console.error(`Admin dashboard ${tab} fetch error:`, err);
      const msg = err.name === "AbortError"
        ? "Request timed out after 8 seconds. Please click Retry."
        : (err.message || "Failed to load section data.");
      setTabErrors((prev) => ({ ...prev, [tab]: msg }));
    } finally {
      inFlightRequests.current.delete(tab);
      setTabLoading((prev) => ({ ...prev, [tab]: false }));
    }
  }, [fetchOverviewData]);

  // Hydration safety check and Auth Guard on mount (runs once)
  useEffect(() => {
    setIsMounted(true);
    const s = HospitalStore.getSession();
    const adminRoles = [
      "ADMIN",
      "SUPER_ADMIN",
      "HOSPITAL_ADMIN",
      "MEDICAL_DIRECTOR",
      "OPERATIONS_MANAGER",
      "HR_MANAGER",
      "FINANCE_MANAGER",
    ];

    if (!s) {
      window.location.href = "/staff/login?redirect=/admin/dashboard";
      return;
    }

    const userRole = (s.role || "").toUpperCase();
    if (!adminRoles.includes(userRole)) {
      const targetDashboard = getRoleDashboard(userRole);
      if (targetDashboard && targetDashboard !== "/admin/dashboard") {
        window.location.href = `${targetDashboard}?error=unauthorized_role`;
      } else {
        window.location.href = "/staff/login?error=unauthorized_access&redirect=/admin/dashboard";
      }
      return;
    }

    // Clean up any stale unauthorized error parameter if valid admin is authenticated
    if (typeof window !== "undefined" && window.location.search.includes("error=unauthorized_access")) {
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("error");
      window.history.replaceState(null, "", cleanUrl.pathname + (cleanUrl.search ? cleanUrl.search : ""));
    }

    setSession(s);
    setIsAuthChecking(false);

    // Initial load: Fetch overview metrics first
    fetchOverviewData(false);

    // If starting on a non-overview tab (e.g. from bookmark or URL param), load it in parallel
    if (initialTab !== "overview") {
      loadTabData(initialTab, false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Trigger lazy loading strictly when user switches tab
  useEffect(() => {
    if (activeTab !== "overview" && !loadedTabsRef.current.has(activeTab)) {
      loadTabData(activeTab, false);
    }
  }, [activeTab, loadTabData]);

  // Update tab in URL without full reload
  const handleSelectTab = (tab: AdminTabId) => {
    setActiveTab(tab);
    window.history.replaceState(null, "", `/admin/dashboard?tab=${tab}`);
  };

  // Header refresh: Refreshes overview and current active tab without unmounting the UI
  const handleGlobalRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const refreshPromises: Promise<any>[] = [fetchOverviewData(true)];
      if (activeTab !== "overview") {
        refreshPromises.push(loadTabData(activeTab, true));
      }
      await Promise.all(refreshPromises);
    } catch (err) {
      console.error("Dashboard refresh error:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [activeTab, fetchOverviewData, loadTabData]);

  const handleQuickAction = (action: "add_patient" | "broadcast_alert" | "emergency") => {
    if (action === "add_patient") {
      handleSelectTab("patients");
    } else if (action === "broadcast_alert") {
      handleSelectTab("notifications");
    } else if (action === "emergency") {
      handleSelectTab("emergency");
    }
  };

  // Auth checking skeleton
  if (!isMounted || isAuthChecking) {
    return <DashboardSkeleton title="Verifying Hospital Staff Session &amp; Credentials..." />;
  }

  // Initial dashboard overview failure state with Retry option
  if (initialError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100 shadow-xs">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Admin Dashboard Loading Notice</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">{initialError}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
            <Button
              onClick={() => fetchOverviewData(false)}
              variant="primary"
              className="text-xs py-2.5"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Retry Connection
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-xs py-2.5"
            >
              Back to Staff Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Initial loading skeleton (only while initial overview summary loads)
  if (isLoading) {
    return <DashboardSkeleton title="IndoStates Hospital Command Center &amp; Governance Center..." />;
  }

  // Sidebar live badge counts: Derived accurately from real overview stats or loaded arrays
  const badgeCounts = {
    patients: overviewData?.stats?.totalPatients ?? patients.length,
    appointments: overviewData?.stats?.todayAppointments ?? appointments.length,
    emergency: overviewData?.stats?.emergencyPatients ?? emergencyData?.summary?.totalActive ?? 0,
    lab: overviewData?.stats?.pendingLabOrders ?? labData?.summary?.pendingReports ?? 0,
    pharmacy: overviewData?.stats?.lowStockMedicines ?? pharmacyData?.summary?.lowStockItemsCount ?? 0,
    alerts: overviewData?.alerts?.length || 0,
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header Command Ribbon */}
      <AdminHeader
        userRole={session?.role || "SUPER_ADMIN"}
        userName={session?.name || "Administrator"}
        alerts={overviewData?.alerts || []}
        onRefresh={handleGlobalRefresh}
        onLogout={handleLogout}
        onQuickAction={handleQuickAction}
        isRefreshing={isRefreshing}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex max-w-[1680px] w-full mx-auto">
        {/* Left Sticky/Responsive Sidebar */}
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

          {/* Section Loading Skeleton (Only inside active tab while secondary tab loads) */}
          {tabLoading[activeTab] ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-28 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-center">
                <div className="h-6 w-1/3 bg-slate-200 rounded-lg mb-2" />
                <div className="h-4 w-1/2 bg-slate-100 rounded-lg" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-28 bg-white rounded-2xl border border-slate-200" />
                <div className="h-28 bg-white rounded-2xl border border-slate-200" />
                <div className="h-28 bg-white rounded-2xl border border-slate-200" />
              </div>
              <div className="h-80 bg-white rounded-2xl border border-slate-200" />
            </div>
          ) : tabErrors[activeTab] ? (
            /* Section Error State with Retry Button */
            <div className="p-8 rounded-2xl bg-white border border-rose-200 shadow-sm text-center max-w-lg mx-auto space-y-4 my-8">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Failed to Load Section Data</h3>
                <p className="text-xs text-slate-600 mt-1">{tabErrors[activeTab]}</p>
              </div>
              <div className="flex justify-center gap-2 pt-2">
                <Button
                  onClick={() => loadTabData(activeTab, true)}
                  variant="primary"
                  className="text-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Retry Loading
                </Button>
              </div>
            </div>
          ) : (
            /* Active Section Content */
            <>
              {/* Tab 1: Executive Overview */}
              {activeTab === "overview" && (
                <OverviewView overviewData={overviewData} onNavigateTab={handleSelectTab} />
              )}

              {/* Tab 2: Patients Management */}
              {activeTab === "patients" && (
                <PatientsView
                  patients={patients}
                  onRefresh={() => loadTabData("patients", true)}
                  onSetFeedback={setFeedback}
                />
              )}

              {/* Tab 3: Doctors Management */}
              {activeTab === "doctors" && (
                <DoctorsView
                  doctors={doctors}
                  onRefresh={() => loadTabData("doctors", true)}
                  onSetFeedback={setFeedback}
                />
              )}

              {/* Tab 4: Staff Directory */}
              {activeTab === "staff" && (
                <StaffView
                  staffList={staffList}
                  onRefresh={() => loadTabData("staff", true)}
                  onSetFeedback={setFeedback}
                />
              )}

              {/* Tab 5: Departments */}
              {activeTab === "departments" && (
                <DepartmentsView
                  departments={departments}
                  onRefresh={() => loadTabData("departments", true)}
                  onSetFeedback={setFeedback}
                />
              )}

              {/* Tab 6: Appointments */}
              {activeTab === "appointments" && (
                <AppointmentsView
                  appointments={appointments}
                  onRefresh={() => loadTabData("appointments", true)}
                  onSetFeedback={setFeedback}
                />
              )}

              {/* Tab 7: Admissions & Beds */}
              {activeTab === "beds" && (
                <BedsView
                  beds={beds}
                  admissions={admissions}
                  wards={wards}
                  onRefresh={() => loadTabData("beds", true)}
                  onSetFeedback={setFeedback}
                />
              )}

              {/* Tab 8: Emergency & Trauma */}
              {activeTab === "emergency" && (
                <EmergencyView
                  emergencyData={emergencyData}
                  onRefresh={() => loadTabData("emergency", true)}
                  onSetFeedback={setFeedback}
                />
              )}

              {/* Tab 9: Diagnostic Laboratory */}
              {activeTab === "laboratory" && (
                <LaboratoryView
                  labData={labData}
                  onRefresh={() => loadTabData("laboratory", true)}
                  onSetFeedback={setFeedback}
                />
              )}

              {/* Tab 10: Pharmacy & Formulary */}
              {activeTab === "pharmacy" && (
                <PharmacyView
                  pharmacyData={pharmacyData}
                  onRefresh={() => loadTabData("pharmacy", true)}
                  onSetFeedback={setFeedback}
                />
              )}

              {/* Tab 11: Billing & Finance */}
              {activeTab === "billing" && (
                <BillingView
                  billingData={billingData}
                  onRefresh={() => loadTabData("billing", true)}
                  onSetFeedback={setFeedback}
                />
              )}

              {/* Tab 12: Roles & Permissions (RBAC) */}
              {activeTab === "roles" && (
                <RolesView
                  rolesData={rolesData}
                  onRefresh={() => loadTabData("roles", true)}
                  onSetFeedback={setFeedback}
                />
              )}

              {/* Tab 13: Notification Center */}
              {activeTab === "notifications" && (
                <NotificationsView
                  notifications={notifications}
                  onRefresh={() => loadTabData("notifications", true)}
                  onSetFeedback={setFeedback}
                />
              )}

              {/* Tab 14: Announcements CMS */}
              {activeTab === "announcements" && (
                <AnnouncementsView
                  announcements={announcements}
                  onRefresh={() => loadTabData("announcements", true)}
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
                  onRefresh={() => loadTabData("audit", true)}
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
            </>
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
