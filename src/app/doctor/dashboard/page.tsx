"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HospitalStore, UserSession } from "@/lib/store";
import { DOCTORS, Doctor } from "@/data/hospitalData";
import { QueueEntry } from "@/types/hms";
import { DoctorOverviewStats } from "@/lib/doctorService";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";

// Doctor Shell Components
import { DoctorSidebar, DoctorTabId } from "@/components/doctor/DoctorSidebar";
import { DoctorHeader } from "@/components/doctor/DoctorHeader";

// Views
import { DoctorOverviewView } from "@/components/doctor/views/DoctorOverviewView";
import { DoctorQueueView } from "@/components/doctor/views/DoctorQueueView";
import { DoctorPatientSearchView } from "@/components/doctor/views/DoctorPatientSearchView";
import { DoctorConsultationsHistoryView } from "@/components/doctor/views/DoctorConsultationsHistoryView";
import { DoctorAppointmentsView } from "@/components/doctor/views/DoctorAppointmentsView";
import { DoctorScheduleView } from "@/components/doctor/views/DoctorScheduleView";
import { DoctorConsultationWorkspaceView } from "@/components/doctor/views/DoctorConsultationWorkspaceView";
import { DoctorPrescriptionsView } from "@/components/doctor/views/DoctorPrescriptionsView";
import { DoctorLabOrdersView } from "@/components/doctor/views/DoctorLabOrdersView";
import { DoctorReportsView } from "@/components/doctor/views/DoctorReportsView";
import { DoctorFollowUpsView } from "@/components/doctor/views/DoctorFollowUpsView";
import { DoctorNotificationsView } from "@/components/doctor/views/DoctorNotificationsView";
import { DoctorProfileView } from "@/components/doctor/views/DoctorProfileView";
import { DoctorSettingsView } from "@/components/doctor/views/DoctorSettingsView";

// Modals
import { DoctorClinicalProfileModal } from "@/components/doctor/views/DoctorClinicalProfileModal";
import { DoctorPrintPrescriptionModal } from "@/components/doctor/views/DoctorPrintPrescriptionModal";

function DoctorDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Authentication & session
  const [session, setSession] = useState<UserSession | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Active doctor
  const [doctor, setDoctor] = useState<Doctor>(DOCTORS[0]);
  const [isOnDuty, setIsOnDuty] = useState(true);

  // Active tab state
  const tabParam = searchParams.get("tab") as DoctorTabId | null;
  const [activeTab, setActiveTab] = useState<DoctorTabId>(tabParam || "overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Real Database Overview Stats & Queue
  const [stats, setStats] = useState<DoctorOverviewStats | null>(null);
  const [queues, setQueues] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Consultation state
  const [activeConsultationPatient, setActiveConsultationPatient] = useState<QueueEntry | null>(null);

  // Modals
  const [profileModalUhid, setProfileModalUhid] = useState<string | null>(null);
  const [printablePrescription, setPrintablePrescription] = useState<any | null>(null);

  // Update tab when URL param changes
  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Auth verification
  useEffect(() => {
    const currentSession = HospitalStore.getCurrentSession();
    if (!currentSession) {
      // Check cookies for ish_auth_role
      const match = document.cookie.match(/ish_auth_role=([^;]+)/);
      const cookieRole = match ? match[1].toUpperCase() : null;
      if (cookieRole && ["DOCTOR", "DEPARTMENT_HEAD", "MEDICAL_DIRECTOR", "SUPER_ADMIN", "HOSPITAL_ADMIN", "ADMIN"].includes(cookieRole)) {
        const doc = DOCTORS[0];
        setDoctor(doc);
        setIsAuthChecking(false);
        return;
      }
      router.replace("/login?role=doctor");
      return;
    }

    const normalizedRole = (currentSession.role || "").toUpperCase();
    if (!["DOCTOR", "DEPARTMENT_HEAD", "MEDICAL_DIRECTOR", "SUPER_ADMIN", "HOSPITAL_ADMIN", "ADMIN"].includes(normalizedRole)) {
      router.replace("/login?role=doctor");
      return;
    }

    setSession(currentSession);
    const matchedDoctor = DOCTORS.find(
      (d) => d.id === currentSession.id || (d.email && d.email.toLowerCase() === (currentSession.email || "").toLowerCase())
    );
    if (matchedDoctor) {
      setDoctor(matchedDoctor);
    } else {
      setDoctor(DOCTORS[0]);
    }
    setIsAuthChecking(false);
  }, [router]);

  // Fetch real overview stats and queue
  const loadDashboardData = async () => {
    if (!doctor) return;
    try {
      const [statsRes, queueRes] = await Promise.all([
        fetch(`/api/doctor/overview?doctorId=${doctor.id}`),
        fetch(`/api/doctor/queue?doctorId=${doctor.id}`),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      if (queueRes.ok) {
        const queueData = await queueRes.json();
        setQueues(queueData.queue || []);

        // If an in-consultation patient exists and we don't have one active, set it
        const inConsult = (queueData.queue || []).find((q: QueueEntry) => q.status === "in_consultation");
        if (inConsult && !activeConsultationPatient) {
          setActiveConsultationPatient(inConsult);
        }
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthChecking) {
      loadDashboardData();
    }
  }, [isAuthChecking, doctor?.id]);

  // Change tab handler
  const handleSelectTab = (tab: DoctorTabId) => {
    setActiveTab(tab);
    // update URL parameter shallowly
    router.replace(`/doctor/dashboard?tab=${tab}`, { scroll: false });
  };

  // Queue actions
  const handleCallPatient = async (entry: QueueEntry) => {
    try {
      const res = await fetch("/api/doctor/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "call", queueEntryId: entry.id }),
      });
      if (res.ok) {
        loadDashboardData();
      }
    } catch (e) {
      console.error("Call patient error:", e);
    }
  };

  const handleStartConsultation = async (entry: QueueEntry) => {
    setActiveConsultationPatient(entry);
    setActiveTab("consultation");
    router.replace(`/doctor/dashboard?tab=consultation`, { scroll: false });

    try {
      await fetch("/api/doctor/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start", queueEntryId: entry.id }),
      });
      loadDashboardData();
    } catch (e) {
      console.error("Start consult error:", e);
    }
  };

  const handleCompleteQueue = async (entry: QueueEntry) => {
    try {
      const res = await fetch("/api/doctor/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete", queueEntryId: entry.id }),
      });
      if (res.ok) {
        if (activeConsultationPatient?.id === entry.id) {
          setActiveConsultationPatient(null);
        }
        loadDashboardData();
      }
    } catch (e) {
      console.error("Complete queue error:", e);
    }
  };

  const handleLogout = () => {
    HospitalStore.clearSession();
    document.cookie = "ish_auth_role=; path=/; max-age=0";
    document.cookie = "ish_auth_token=; path=/; max-age=0";
    router.push("/login");
  };

  if (isAuthChecking || loading) {
    return <DashboardSkeleton />;
  }

  const defaultStats: DoctorOverviewStats = stats || {
    todayAppointmentsCount: queues.length,
    waitingPatientsCount: queues.filter((q) => q.status === "waiting" || q.status === "called").length,
    inConsultationCount: queues.filter((q) => q.status === "in_consultation").length,
    completedConsultationsCount: queues.filter((q) => q.status === "completed").length,
    remainingPatientsCount: queues.filter((q) => q.status !== "completed").length,
    emergencyPriorityCount: queues.filter((q) => q.priority === "urgent" || q.priority === "senior").length,
    priorityEmergencyCount: queues.filter((q) => q.priority === "urgent" || q.priority === "senior").length,
    followUpsTodayCount: 0,
    pendingLabReportsCount: 0,
    pendingPrescriptionsCount: 0,
    opdRoom: doctor.opdRoom || "OPD-104",
    isOnDuty: isOnDuty,
    statusNotice: isOnDuty ? "On Duty — Active OPD" : "Off Duty",
    nextPatient: queues.find((q) => q.status === "waiting" || q.status === "called") || null,
    currentPatient: activeConsultationPatient,
    currentInConsultationPatient: activeConsultationPatient,
    recentQueue: queues.slice(0, 5),
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {/* Top Clinical Header */}
      <DoctorHeader
        doctor={doctor}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onLogout={handleLogout}
        unreadCount={3}
        opdRoom={doctor.opdRoom || "OPD-104"}
        isOnDuty={isOnDuty}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Responsive Doctor Navigation Sidebar */}
        <DoctorSidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onLogout={handleLogout}
          waitingCount={defaultStats.waitingPatientsCount}
          pendingReportsCount={defaultStats.pendingLabReportsCount}
          unreadNotifsCount={3}
        />

        {/* Main Clinical Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* View 1: Main Overview Dashboard */}
            {activeTab === "overview" && (
              <DoctorOverviewView
                stats={defaultStats}
                doctor={doctor}
                onSelectTab={handleSelectTab}
                onStartConsultationForPatient={handleStartConsultation}
              />
            )}

            {/* View 2: Today's Patient Queue */}
            {activeTab === "queue" && (
              <DoctorQueueView
                queues={queues}
                onRefresh={loadDashboardData}
                onCallPatient={handleCallPatient}
                onStartConsultation={handleStartConsultation}
                onViewPatientSummary={(uhid) => setProfileModalUhid(uhid)}
                onCompleteQueue={handleCompleteQueue}
              />
            )}

            {/* View 3: Patient Records & Search */}
            {activeTab === "search" && (
              <DoctorPatientSearchView
                onOpenPatientProfile={(uhidOrId) => setProfileModalUhid(uhidOrId)}
                onStartConsultationForPatient={handleStartConsultation}
              />
            )}

            {/* View 4: Consultation History */}
            {activeTab === "consultation-history" && (
              <DoctorConsultationsHistoryView
                doctor={doctor}
                onOpenPatientProfile={(uhidOrId) => setProfileModalUhid(uhidOrId)}
                onOpenPrintPrescription={(rxData) => setPrintablePrescription(rxData)}
              />
            )}

            {/* View 5: Appointments List */}
            {activeTab === "appointments" && (
              <DoctorAppointmentsView
                doctor={doctor}
                onOpenPatientProfile={(uhidOrId) => setProfileModalUhid(uhidOrId)}
                onStartConsultationForPatient={handleStartConsultation}
              />
            )}

            {/* View 6: Doctor Schedule & OPD Timings */}
            {activeTab === "schedule" && (
              <DoctorScheduleView
                doctor={doctor}
                onDutyStatusChanged={(duty) => setIsOnDuty(duty)}
              />
            )}

            {/* View 7: Core Consultation Workspace */}
            {activeTab === "consultation" && (
              <DoctorConsultationWorkspaceView
                doctor={doctor}
                activePatient={activeConsultationPatient || defaultStats.nextPatient}
                onClose={() => handleSelectTab("queue")}
                onConsultationCompleted={() => {
                  loadDashboardData();
                  handleSelectTab("queue");
                }}
                onOpenPatientDossier={(uhidOrId) => setProfileModalUhid(uhidOrId)}
                onOpenPrintPrescription={(rxData) => setPrintablePrescription(rxData)}
              />
            )}

            {/* View 8: Digital Prescriptions */}
            {activeTab === "prescriptions" && (
              <DoctorPrescriptionsView
                doctor={doctor}
                onOpenPatientProfile={(uhidOrId) => setProfileModalUhid(uhidOrId)}
                onOpenPrintPrescription={(rxData) => setPrintablePrescription(rxData)}
              />
            )}

            {/* View 9: Lab Orders */}
            {activeTab === "lab-orders" && (
              <DoctorLabOrdersView
                doctor={doctor}
                onOpenPatientProfile={(uhidOrId) => setProfileModalUhid(uhidOrId)}
                onViewReportsTab={() => handleSelectTab("reports")}
              />
            )}

            {/* View 10: Diagnostic Reports */}
            {activeTab === "reports" && (
              <DoctorReportsView
                doctor={doctor}
                onOpenPatientProfile={(uhidOrId) => setProfileModalUhid(uhidOrId)}
              />
            )}

            {/* View 11: Patient Follow-ups */}
            {activeTab === "follow-ups" && (
              <DoctorFollowUpsView
                doctor={doctor}
                onOpenPatientProfile={(uhidOrId) => setProfileModalUhid(uhidOrId)}
              />
            )}

            {/* View 12: Notifications */}
            {activeTab === "notifications" && (
              <DoctorNotificationsView
                doctor={doctor}
                onSelectNotificationAction={(actionUrl) => {
                  if (actionUrl) router.push(actionUrl);
                }}
              />
            )}

            {/* View 13: Doctor Profile */}
            {activeTab === "profile" && (
              <DoctorProfileView
                doctor={doctor}
                onProfileUpdated={(updated) => setDoctor(updated)}
              />
            )}

            {/* View 14: Doctor Settings */}
            {activeTab === "settings" && <DoctorSettingsView doctor={doctor} />}
          </div>
        </main>
      </div>

      {/* Patient Clinical Profile Dossier Modal */}
      {profileModalUhid && (
        <DoctorClinicalProfileModal
          patientUhid={profileModalUhid}
          onClose={() => setProfileModalUhid(null)}
          onStartConsultationWithPatient={(patient) => {
            setProfileModalUhid(null);
            // If patient has active queue entry, start consult
            const entry = queues.find(
              (q) => q.patientId === patient.id || q.patientUhid === patient.uhid
            );
            if (entry) {
              handleStartConsultation(entry);
            } else {
              handleSelectTab("consultation");
            }
          }}
        />
      )}

      {/* Printable Digital Prescription Modal */}
      {printablePrescription && (
        <DoctorPrintPrescriptionModal
          prescription={printablePrescription}
          onClose={() => setPrintablePrescription(null)}
        />
      )}
    </div>
  );
}

export default function DoctorDashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DoctorDashboardContent />
    </Suspense>
  );
}
