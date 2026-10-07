"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Calendar,
  Clock,
  QrCode,
  FileText,
  Pill,
  FlaskConical,
  Receipt,
  Settings,
  Lock,
  LogOut,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  RefreshCw,
  Printer,
  ShieldCheck,
  Building2,
  Activity,
  History,
  Radio,
  Users,
  ShieldAlert,
  Copy,
  Check,
  Edit3,
  Phone,
  Mail,
  MapPin,
  HeartPulse,
  Bell,
  X,
  CalendarDays,
  UserPlus,
  AlertTriangle,
  Download,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";
import {
  AppointmentRecord,
  BillingInvoice,
  CaregiverConsent,
  ImagingOrderRecord,
  LabOrderRecord,
  PrescriptionRecord,
  PrescriptionItem,
  TimelineEvent,
  PatientProfile,
  NotificationRecord,
} from "@/types/hms";
import { DigitalPass } from "@/components/booking/DigitalPass";
import { Button } from "@/components/ui/Button";
import { HOSPITAL_INFO } from "@/data/hospitalData";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";
import { formatDate, formatTime } from "@/lib/utils";

export default function PatientDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<
    | "upcoming"
    | "history"
    | "timeline"
    | "reports"
    | "prescriptions"
    | "billing"
    | "notifications"
    | "profile"
    | "family"
    | "settings"
  >("upcoming");

  // Data
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>([]);
  const [labReports, setLabReports] = useState<LabOrderRecord[]>([]);
  const [imagingOrders, setImagingOrders] = useState<ImagingOrderRecord[]>([]);
  const [caregiverConsents, setCaregiverConsents] = useState<CaregiverConsent[]>([]);
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [selectedPass, setSelectedPass] = useState<any | null>(null);

  // Patient Profile & Demographics Form
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [editFullName, setEditFullName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editDob, setEditDob] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editGender, setEditGender] = useState("Male");
  const [editBloodGroup, setEditBloodGroup] = useState("O+");
  const [editAddress, setEditAddress] = useState("");
  const [editEmergencyName, setEditEmergencyName] = useState("");
  const [editEmergencyPhone, setEditEmergencyPhone] = useState("");
  const [editEmergencyRelation, setEditEmergencyRelation] = useState("Spouse");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [copiedUhid, setCopiedUhid] = useState(false);

  // Family Member Creation Form
  const [famName, setFamName] = useState("");
  const [famRelation, setFamRelation] = useState("Spouse");
  const [famAge, setFamAge] = useState("");
  const [famGender, setFamGender] = useState("Female");
  const [famPhone, setFamPhone] = useState("");
  const [famNotes, setFamNotes] = useState("");
  const [isSubmittingFamily, setIsSubmittingFamily] = useState(false);
  const [familyFeedback, setFamilyFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Caregiver Consent Form
  const [cgName, setCgName] = useState("");
  const [cgPhone, setCgPhone] = useState("");
  const [cgEmail, setCgEmail] = useState("");
  const [cgRelation, setCgRelation] = useState<"Spouse" | "Child" | "Parent" | "Sibling" | "Guardian" | "Other">("Spouse");
  const [cgScope, setCgScope] = useState<"APPOINTMENTS_ONLY" | "FULL_CARE" | "BILLING_ONLY">("FULL_CARE");
  const [isSubmittingConsent, setIsSubmittingConsent] = useState(false);
  const [consentFeedback, setConsentFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Password Change Form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passFeedback, setPassFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Reschedule Modal State
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleTargetAppt, setRescheduleTargetAppt] = useState<any | null>(null);
  const [rescheduleNewDate, setRescheduleNewDate] = useState("");
  const [rescheduleNewSlot, setRescheduleNewSlot] = useState("10:00 AM");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [rescheduleSlots, setRescheduleSlots] = useState<string[]>([]);
  const [isLoadingRescheduleSlots, setIsLoadingRescheduleSlots] = useState(false);
  const [isSubmittingReschedule, setIsSubmittingReschedule] = useState(false);
  const [rescheduleFeedback, setRescheduleFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Cancel Modal State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelTargetAppt, setCancelTargetAppt] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);
  const [cancelFeedback, setCancelFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const s = HospitalStore.getSession();
    if (!s) {
      window.location.href = "/login?portal=patient&redirect=/patient/dashboard";
      return;
    }
    const role = (s.role || "").toUpperCase();
    if (role === "DOCTOR" || role === "DEPARTMENT_HEAD") {
      window.location.href = "/doctor/dashboard";
      return;
    }
    if (["SUPER_ADMIN", "HOSPITAL_ADMIN", "MEDICAL_DIRECTOR", "OPERATIONS_MANAGER", "HR_MANAGER"].includes(role)) {
      window.location.href = "/admin/dashboard";
      return;
    }
    setSession(s);
    setIsAuthChecking(false);
    fetchPatientData(s);
  }, []);

  const fetchPatientData = async (user: UserSession) => {
    try {
      const patientId = user.id;
      const patientUhid = user.uhid || "IND-UHID-000101";

      // 1. Appointments (query by uhid, phone, or email)
      const apptRes = await fetch(
        `/api/appointments?uhid=${encodeURIComponent(patientUhid)}&phone=${encodeURIComponent(user.phone || "")}&email=${encodeURIComponent(user.email || "")}`
      );
      if (apptRes.ok) {
        const d = await apptRes.json();
        if (d.success && Array.isArray(d.appointments)) {
          setAppointments(d.appointments);
          if (d.appointments.length > 0 && !selectedPass) {
            setSelectedPass(d.appointments[0]);
          }
        }
      }

      // Also read local appointments fallback
      const local = HospitalStore.getAppointments();
      if (local.length > 0 && appointments.length === 0) {
        setSelectedPass(local[0]);
      }

      // 2. Prescriptions
      const rxRes = await fetch(`/api/hms/prescriptions?patientId=${patientId}`);
      if (rxRes.ok) {
        const rd = await rxRes.json();
        if (rd.success && Array.isArray(rd.prescriptions)) {
          setPrescriptions(rd.prescriptions);
        }
      }

      // 3. Lab Reports
      const labRes = await fetch(`/api/hms/lab?patientId=${patientId}`);
      if (labRes.ok) {
        const ld = await labRes.json();
        if (ld.success && Array.isArray(ld.labOrders)) {
          setLabReports(ld.labOrders.filter((l: any) => l.isReportReleased));
        }
      }

      // 4. Invoices
      const invRes = await fetch(`/api/hms/billing?patientId=${patientId}`);
      if (invRes.ok) {
        const idata = await invRes.json();
        if (idata.success && Array.isArray(idata.invoices)) {
          setInvoices(idata.invoices);
        }
      }

      // 5. Imaging Orders & Reports
      const imgRes = await fetch(`/api/hms/imaging?patientUhid=${patientUhid}`);
      if (imgRes.ok) {
        const imData = await imgRes.json();
        if (imData.success && Array.isArray(imData.orders)) {
          setImagingOrders(imData.orders.filter((o: any) => o.isReportReleased));
        }
      }

      // 6. Caregiver Consents
      const cgRes = await fetch(`/api/hms/caregivers?patientUhid=${patientUhid}`);
      if (cgRes.ok) {
        const cgData = await cgRes.json();
        if (cgData.success && Array.isArray(cgData.consents)) {
          setCaregiverConsents(cgData.consents);
        }
      }

      // 7. Family Members & Dependents
      const famRes = await fetch(`/api/patient/family?uhid=${encodeURIComponent(patientUhid)}`);
      if (famRes.ok) {
        const famData = await famRes.json();
        if (famData.success && Array.isArray(famData.familyMembers)) {
          setFamilyMembers(famData.familyMembers);
        }
      }

      // 8. Notifications
      const notifRes = await fetch(`/api/patient/notifications?uhid=${encodeURIComponent(patientUhid)}`);
      if (notifRes.ok) {
        const nData = await notifRes.json();
        if (nData.success && Array.isArray(nData.notifications)) {
          setNotifications(nData.notifications);
        }
      }

      // 9. Unified Timeline
      const tlRes = await fetch(`/api/hms/timeline?uhid=${patientUhid}`);
      if (tlRes.ok) {
        const tlData = await tlRes.json();
        if (tlData.success && Array.isArray(tlData.timeline)) {
          setTimelineEvents(tlData.timeline);
        }
      }

      // 10. Patient Profile & Demographics
      const profRes = await fetch(`/api/patient/profile?uhid=${patientUhid}`);
      if (profRes.ok) {
        const profData = await profRes.json();
        if (profData.success && profData.patient) {
          const p = profData.patient;
          setPatientProfile(p);
          setEditFullName(p.fullName || "");
          setEditPhone(p.phone || "");
          setEditDob(p.dateOfBirth || "");
          setEditAge(p.age ? String(p.age) : "");
          setEditGender(p.gender || "Male");
          setEditBloodGroup(p.bloodGroup || "O+");
          setEditAddress(p.address || "");
          setEditEmergencyName(p.emergencyContactName || "");
          setEditEmergencyPhone(p.emergencyContactPhone || "");
          setEditEmergencyRelation(p.emergencyContactRelation || "Spouse");
        }
      }
    } catch (err) {
      console.error("Patient data fetch error:", err);
    }
  };

  // Split appointments into Upcoming vs History
  const upcomingAppointments = appointments.filter(
    (a) => a.status !== "CANCELLED" && a.status !== "COMPLETED"
  );
  const pastAppointments = appointments.filter(
    (a) => a.status === "CANCELLED" || a.status === "COMPLETED"
  );

  // Top Most Imminent Upcoming Appointment
  const nextUpcomingAppointment = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;

  // Open Reschedule Modal
  const handleOpenReschedule = (appt: any) => {
    setRescheduleTargetAppt(appt);
    setRescheduleFeedback(null);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDateStr = tomorrow.toISOString().split("T")[0];
    setRescheduleNewDate(defaultDateStr);
    setIsRescheduleModalOpen(true);
    fetchRescheduleSlots(appt.doctorId || appt.targetId, defaultDateStr);
  };

  const fetchRescheduleSlots = async (docId: string, dateStr: string) => {
    setIsLoadingRescheduleSlots(true);
    try {
      const res = await fetch(`/api/appointments/slots?doctorId=${encodeURIComponent(docId || "dr-rajesh-rangaswamy")}&date=${encodeURIComponent(dateStr)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.availableSlots)) {
        setRescheduleSlots(data.availableSlots);
        if (data.availableSlots.length > 0) {
          setRescheduleNewSlot(data.availableSlots[0]);
        }
      }
    } catch (err) {
      console.warn("Notice fetching reschedule slots:", err);
    } finally {
      setIsLoadingRescheduleSlots(false);
    }
  };

  // Submit Atomic Reschedule
  const handleSubmitReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleTargetAppt || !rescheduleNewDate || !rescheduleNewSlot) return;

    setIsSubmittingReschedule(true);
    setRescheduleFeedback(null);

    try {
      const res = await fetch("/api/appointments/reschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: rescheduleTargetAppt.id,
          newDate: rescheduleNewDate,
          newTimeSlot: rescheduleNewSlot,
          reason: rescheduleReason.trim() || "Patient requested reschedule",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setRescheduleFeedback({
          type: "error",
          message: data.error || "Sorry, this slot is no longer available. Please select another time.",
        });
      } else {
        setRescheduleFeedback({
          type: "success",
          message: data.message || `Appointment successfully rescheduled to ${rescheduleNewDate} at ${rescheduleNewSlot}.`,
        });

        // Update local state and refresh
        if (session) fetchPatientData(session);
        setTimeout(() => {
          setIsRescheduleModalOpen(false);
        }, 1200);
      }
    } catch {
      setRescheduleFeedback({ type: "error", message: "Network error during rescheduling." });
    } finally {
      setIsSubmittingReschedule(false);
    }
  };

  // Open Cancel Modal
  const handleOpenCancel = (appt: any) => {
    setCancelTargetAppt(appt);
    setCancelFeedback(null);
    setCancelReason("");
    setIsCancelModalOpen(true);
  };

  // Submit Atomic Cancellation
  const handleSubmitCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelTargetAppt) return;

    setIsSubmittingCancel(true);
    setCancelFeedback(null);

    try {
      const res = await fetch("/api/appointments/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: cancelTargetAppt.id,
          reason: cancelReason.trim() || "Patient self-cancellation",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setCancelFeedback({
          type: "error",
          message: data.error || "Failed to cancel appointment.",
        });
      } else {
        setCancelFeedback({
          type: "success",
          message: data.message || "Appointment cancelled successfully. Slot has been released.",
        });

        if (session) fetchPatientData(session);
        setTimeout(() => {
          setIsCancelModalOpen(false);
        }, 1200);
      }
    } catch {
      setCancelFeedback({ type: "error", message: "Network error during cancellation." });
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  // Handle Add Family Dependent
  const handleAddFamilyMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!famName.trim()) {
      setFamilyFeedback({ type: "error", message: "Family member full legal name is required." });
      return;
    }

    setIsSubmittingFamily(true);
    setFamilyFeedback(null);

    try {
      const res = await fetch("/api/patient/family", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientUhid: session?.uhid || "IND-UHID-000101",
          fullName: famName.trim(),
          relationship: famRelation,
          age: famAge ? Number(famAge) : null,
          gender: famGender,
          phone: famPhone.trim() || null,
          notes: famNotes.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFamilyFeedback({ type: "error", message: data.error || "Failed to add family dependent." });
      } else {
        setFamilyFeedback({ type: "success", message: data.message });
        setFamName("");
        setFamAge("");
        setFamPhone("");
        setFamNotes("");
        if (data.familyMember) {
          setFamilyMembers((prev) => [data.familyMember, ...prev]);
        }
      }
    } catch {
      setFamilyFeedback({ type: "error", message: "Network communication error." });
    } finally {
      setIsSubmittingFamily(false);
    }
  };

  // Profile Update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileFeedback(null);

    try {
      const res = await fetch("/api/patient/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uhid: session?.uhid || "IND-UHID-000101",
          fullName: editFullName,
          phone: editPhone,
          dateOfBirth: editDob || undefined,
          age: editAge ? Number(editAge) : undefined,
          gender: editGender,
          bloodGroup: editBloodGroup,
          address: editAddress,
          emergencyContactName: editEmergencyName,
          emergencyContactPhone: editEmergencyPhone,
          emergencyContactRelation: editEmergencyRelation,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setProfileFeedback({ type: "error", message: data.error || "Failed to update profile." });
      } else {
        setProfileFeedback({ type: "success", message: "Patient profile updated successfully." });
        if (data.patient) {
          setPatientProfile(data.patient);
          if (session) {
            const updatedSession = { ...session, name: data.patient.fullName, phone: data.patient.phone };
            setSession(updatedSession);
            HospitalStore.setSession(updatedSession);
          }
        }
      }
    } catch {
      setProfileFeedback({ type: "error", message: "Network error saving profile." });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCopyUhid = () => {
    const uhid = session?.uhid || patientProfile?.uhid || "IND-UHID-000101";
    navigator.clipboard.writeText(uhid);
    setCopiedUhid(true);
    setTimeout(() => setCopiedUhid(false), 2000);
  };

  const handleGrantConsent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cgName || !cgPhone || !cgEmail) {
      setConsentFeedback({ type: "error", message: "Caregiver name, phone, and email are required." });
      return;
    }

    setIsSubmittingConsent(true);
    setConsentFeedback(null);

    try {
      const res = await fetch("/api/hms/caregivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientUhid: session?.uhid || "IND-UHID-000101",
          patientName: session?.name || "Patient",
          caregiverName: cgName,
          caregiverPhone: cgPhone,
          caregiverEmail: cgEmail,
          relationship: cgRelation,
          accessScope: cgScope,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setConsentFeedback({ type: "error", message: data.error || "Failed to grant consent." });
      } else {
        setConsentFeedback({ type: "success", message: `Caregiver consent successfully granted to ${cgName}.` });
        setCgName("");
        setCgPhone("");
        setCgEmail("");
        if (data.consent) {
          setCaregiverConsents((prev) => [data.consent, ...prev]);
        }
      }
    } catch {
      setConsentFeedback({ type: "error", message: "Network error while granting consent." });
    } finally {
      setIsSubmittingConsent(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPassFeedback({ type: "error", message: "Password must be at least 6 characters long." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassFeedback({ type: "error", message: "New passwords do not match." });
      return;
    }

    setIsChangingPass(true);
    setPassFeedback(null);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const d = await res.json();
      if (!res.ok) {
        setPassFeedback({ type: "error", message: d.error || "Failed to update password." });
      } else {
        setPassFeedback({ type: "success", message: "Password changed successfully." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setPassFeedback({ type: "error", message: "Network communication error." });
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleLogout = async () => {
    await HospitalStore.logout();
    window.location.href = "/login?portal=patient";
  };

  if (isAuthChecking) {
    return <DashboardSkeleton title="Patient Digital Medical Gateway..." />;
  }

  return (
    <div className="space-y-6">
        {/* Patient Profile Ribbon */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-hospital-100 text-hospital-800 flex items-center justify-center text-xl font-bold font-display shadow-xs">
              {session?.name ? session.name[0].toUpperCase() : "P"}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 font-display">
                Welcome back, {session?.name || "Patient Member"}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                <span className="font-mono font-bold text-hospital-700 bg-hospital-50 px-2 py-0.5 rounded-md">
                  {session?.uhid || "IND-UHID-000101"}
                </span>
                <span>•</span>
                <span>{session?.email}</span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Medical Identity Verified
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/book-appointment"
            className="px-5 py-2.5 rounded-xl bg-hospital-700 text-white font-bold text-xs hover:bg-hospital-800 transition flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Appointment</span>
          </Link>
        </div>

        {/* ======================================================== */}
        {/* PROMINENT TOP BANNER: NEXT UPCOMING APPOINTMENT SUMMARY   */}
        {/* ======================================================== */}
        {nextUpcomingAppointment && (
          <div className="bg-gradient-to-br from-hospital-900 via-hospital-800 to-navy-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-hospital-700 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-300 bg-cyan-900/50 px-2.5 py-1 rounded-full border border-cyan-500/30">
                    Next Upcoming Consultation
                  </span>
                  <span className="text-xs font-mono font-bold text-hospital-200">
                    Ref: {nextUpcomingAppointment.referenceCode || nextUpcomingAppointment.appointmentId}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                  {nextUpcomingAppointment.doctorName || nextUpcomingAppointment.targetName}
                </h3>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-hospital-100">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold">
                      {nextUpcomingAppointment.appointmentDate || (nextUpcomingAppointment as any).date}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold">{nextUpcomingAppointment.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>IndoStates Main Campus • OPD Suite 102</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Status: {nextUpcomingAppointment.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPass(nextUpcomingAppointment);
                    setActiveTab("upcoming");
                  }}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 text-navy-950 font-bold text-xs hover:bg-cyan-400 transition flex items-center gap-1.5 shadow-md"
                >
                  <QrCode className="w-4 h-4" />
                  <span>View Digital Pass / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenReschedule(nextUpcomingAppointment)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Reschedule</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenCancel(nextUpcomingAppointment)}
                  className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-bold text-xs border border-rose-500/30 transition flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5 text-rose-300" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty Upcoming Appointment State if none */}
        {!nextUpcomingAppointment && (
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-hospital-50 border border-hospital-100 text-hospital-700 flex items-center justify-center shrink-0">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">No Upcoming Consultations Scheduled</h3>
                <p className="text-xs text-slate-500 mt-0.5">Need medical guidance? Consult our specialists or book a preventive health package.</p>
              </div>
            </div>
            <Link
              href="/book-appointment"
              className="px-4 py-2.5 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white font-bold text-xs transition shrink-0"
            >
              Book Consultation Now
            </Link>
          </div>
        )}

        {/* 4 PROMINENT QUICK ACTIONS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Link
            href="/book-appointment"
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-soft hover:shadow-card hover:border-hospital-300 transition-all flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-hospital-50 border border-hospital-100 text-hospital-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Book Appointment</span>
              <span className="text-[11px] text-slate-500">OPD &amp; Packages</span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => {
              if (nextUpcomingAppointment) {
                setSelectedPass(nextUpcomingAppointment);
              }
              setActiveTab("upcoming");
            }}
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-soft hover:shadow-card hover:border-cyan-300 transition-all flex items-center gap-3 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Digital QR Pass</span>
              <span className="text-[11px] text-slate-500">Contactless Entry</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("prescriptions")}
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-soft hover:shadow-card hover:border-emerald-300 transition-all flex items-center gap-3 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Prescriptions</span>
              <span className="text-[11px] text-slate-500">{prescriptions.length} Records</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reports")}
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-soft hover:shadow-card hover:border-purple-300 transition-all flex items-center gap-3 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Lab Reports</span>
              <span className="text-[11px] text-slate-500">{labReports.length} Available</span>
            </div>
          </button>
        </div>

        {/* ======================================================== */}
        {/* 10-SECTION TAB NAVIGATION                                */}
        {/* ======================================================== */}
        <div className="flex flex-wrap border-b border-slate-200 text-xs font-bold gap-2 sm:gap-4 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`pb-3 px-2 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "upcoming"
                ? "border-hospital-600 text-hospital-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>1. Upcoming Appointments ({upcomingAppointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`pb-3 px-2 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "history"
                ? "border-hospital-600 text-hospital-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>2. History ({pastAppointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("timeline")}
            className={`pb-3 px-2 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "timeline"
                ? "border-hospital-600 text-hospital-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>3. Medical Records ({timelineEvents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`pb-3 px-2 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "reports"
                ? "border-hospital-600 text-hospital-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>4. Lab Reports ({labReports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("prescriptions")}
            className={`pb-3 px-2 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "prescriptions"
                ? "border-hospital-600 text-hospital-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>5. Prescriptions ({prescriptions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("billing")}
            className={`pb-3 px-2 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "billing"
                ? "border-hospital-600 text-hospital-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>6. Bills / Payments ({invoices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`pb-3 px-2 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "notifications"
                ? "border-hospital-600 text-hospital-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>7. Notifications ({notifications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 px-2 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "profile"
                ? "border-hospital-600 text-hospital-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>8. Profile &amp; UHID</span>
          </button>

          <button
            onClick={() => setActiveTab("family")}
            className={`pb-3 px-2 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "family"
                ? "border-hospital-600 text-hospital-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>9. Family Members ({familyMembers.length + caregiverConsents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`pb-3 px-2 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "settings"
                ? "border-hospital-600 text-hospital-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>10. Security &amp; Logout</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: UPCOMING APPOINTMENTS & QR GATE PASS             */}
        {/* ======================================================== */}
        {activeTab === "upcoming" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Upcoming Consultations</h3>
                <span className="text-xs text-slate-500">{upcomingAppointments.length} Active</span>
              </div>

              <div className="space-y-3">
                {upcomingAppointments.length === 0 ? (
                  <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-slate-400 text-xs space-y-3">
                    <p>No active upcoming appointments scheduled.</p>
                    <Link
                      href="/book-appointment"
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-hospital-700 text-white font-bold text-xs hover:bg-hospital-800 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Book Appointment</span>
                    </Link>
                  </div>
                ) : (
                  upcomingAppointments.map((appt) => {
                    const isSelected = selectedPass?.id === appt.id;
                    return (
                      <div
                        key={appt.id}
                        onClick={() => setSelectedPass(appt)}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? "border-hospital-600 bg-hospital-50 shadow-sm"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono font-bold text-hospital-800 text-xs">
                            {appt.referenceCode || appt.appointmentId}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                              appt.status === "CONFIRMED"
                                ? "bg-emerald-100 text-emerald-800"
                                : appt.status === "CHECKED_IN"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-cyan-100 text-cyan-800"
                            }`}
                          >
                            {appt.status}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-sm">
                          {appt.doctorName || appt.targetName}
                        </h4>

                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{appt.appointmentDate || (appt as any).date} at {appt.timeSlot}</span>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-hospital-700 font-semibold">
                            Click to display QR Pass
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenReschedule(appt);
                              }}
                              className="text-[11px] font-bold text-hospital-700 hover:underline"
                            >
                              Reschedule
                            </button>
                            <span>•</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenCancel(appt);
                              }}
                              className="text-[11px] font-bold text-rose-600 hover:underline"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="lg:col-span-7">
              {selectedPass ? (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <span className="font-bold text-slate-900 text-sm">
                      Official Scannable Medical Pass
                    </span>
                    <Link
                      href={`/booking/verify/${selectedPass.referenceCode || selectedPass.id}`}
                      target="_blank"
                      className="text-xs font-bold text-hospital-700 hover:underline flex items-center gap-1"
                    >
                      <span>Public Gate Verification</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <DigitalPass appointment={selectedPass} />
                </div>
              ) : (
                <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center text-slate-400 text-xs">
                  Select an appointment on the left to view the verified QR pass.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: APPOINTMENT HISTORY                               */}
        {/* ======================================================== */}
        {activeTab === "history" && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Completed &amp; Past Appointment Records</h3>
              <p className="text-xs text-slate-500">
                Audited history of completed consultations and previous cancellations.
              </p>
            </div>

            <div className="space-y-3">
              {pastAppointments.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">
                  No completed or past appointments on file.
                </p>
              ) : (
                pastAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-800">
                          {appt.referenceCode || appt.appointmentId}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            appt.status === "COMPLETED"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {appt.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">
                        {appt.doctorName || appt.targetName}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Date: {appt.appointmentDate || (appt as any).date} at {appt.timeSlot}
                      </p>
                      {appt.notes && (
                        <p className="text-[11px] text-slate-600 mt-1 italic">
                          Notes: {appt.notes}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPass(appt);
                          setActiveTab("upcoming");
                        }}
                        className="text-xs font-bold text-hospital-700 hover:underline"
                      >
                        View Record Pass &rarr;
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: MEDICAL RECORDS & VISIT TIMELINE                  */}
        {/* ======================================================== */}
        {activeTab === "timeline" && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Connected Patient Visit Journey</h3>
                <p className="text-xs text-slate-500">
                  Chronological, authenticated history of all consultations, diagnostic findings, orders, and settlements.
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-hospital-50 text-hospital-700 border border-hospital-200">
                UHID: {session?.uhid || "IND-UHID-000101"}
              </span>
            </div>

            {timelineEvents.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No clinical or operational events recorded for this visit yet.
              </div>
            ) : (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {timelineEvents.map((ev) => (
                  <div key={ev.id} className="relative group">
                    <span className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-hospital-600 ring-4 ring-white" />
                    <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-xs transition space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 text-sm">{ev.title}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400">
                            {formatDate(ev.timestamp)} • {formatTime(ev.timestamp)}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                            {ev.eventType}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{ev.description}</p>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1 border-t border-slate-100">
                        <span>Staff: <strong className="text-slate-700">{ev.actorName}</strong> ({ev.actorRole})</span>
                        {ev.metadata?.encounterId && <span>• Encounter: {ev.metadata.encounterId}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: DIAGNOSTIC LAB REPORTS                            */}
        {/* ======================================================== */}
        {activeTab === "reports" && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Verified Diagnostic Laboratory Reports</h3>
            <p className="text-xs text-slate-500">
              Biochemically released and digitally signed diagnostic results.
            </p>

            <div className="space-y-3">
              {labReports.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">
                  No released laboratory investigations found for this patient record.
                </p>
              ) : (
                labReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <strong className="text-slate-900 text-sm block">{report.testName}</strong>
                        <span className="text-xs text-slate-500">Order ID: {report.orderId} • Sample: {report.sampleType}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Status: {report.sampleStatus}
                      </span>
                    </div>

                    {report.reportSummary && (
                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700">
                        <strong className="text-slate-900 block font-semibold mb-1">Pathologist Summary:</strong>
                        <p>{report.reportSummary}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: PRESCRIPTIONS                                     */}
        {/* ======================================================== */}
        {activeTab === "prescriptions" && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Official Digital Prescriptions</h3>
            <div className="space-y-3">
              {prescriptions.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">
                  No active medication regimens recorded.
                </p>
              ) : (
                prescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-xs text-hospital-800 font-bold block">
                          Prescribed by {rx.doctorName}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          Rx ID: {rx.prescriptionId}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Status: {rx.status}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {(rx.medications || []).map((it: PrescriptionItem, idx: number) => (
                        <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                          <div>
                            <strong className="text-slate-900 block font-semibold">{it.medicineName} ({it.dosage})</strong>
                            <span className="text-slate-500">{it.frequency} • {it.durationDays} days</span>
                          </div>
                          <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                            {it.instructions}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: BILLS / PAYMENTS                                  */}
        {/* ======================================================== */}
        {activeTab === "billing" && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Invoices &amp; Payment Receipts</h3>
            <div className="space-y-3">
              {invoices.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">
                  No billing history on file.
                </p>
              ) : (
                invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4"
                  >
                    <div>
                      <span className="font-mono font-bold text-slate-900 text-sm block">
                        Invoice ID: {inv.invoiceId}
                      </span>
                      <span className="text-xs text-slate-500 block">
                        Items: {inv.items.map((it) => it.description).join(", ")}
                      </span>
                      {inv.receiptNumber && (
                        <span className="text-xs text-emerald-700 font-bold block mt-1">
                          Official Receipt: {inv.receiptNumber}
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-black text-slate-900 block">
                        ₹{Number(inv.totalAmount).toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-0.5">
                        {inv.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: NOTIFICATIONS & SMS ALERTS                       */}
        {/* ======================================================== */}
        {activeTab === "notifications" && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Real-Time Patient Alerts &amp; Queue Updates</h3>
            <p className="text-xs text-slate-500">
              Live updates regarding appointment confirmations, tokens, and medical report availability.
            </p>

            <div className="space-y-3">
              {notifications.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">
                  No unread notifications at this time.
                </p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-hospital-100 text-hospital-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900 text-xs">{n.title}</strong>
                        <span className="text-[10px] text-slate-400">
                          {n.createdAt ? formatDate(n.createdAt) : ""}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 8: PROFILE & UHID                                    */}
        {/* ======================================================== */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Official Patient Identification Card</h3>

              <div className="bg-gradient-to-br from-hospital-900 via-hospital-850 to-hospital-950 text-white p-6 rounded-3xl border border-hospital-800 shadow-xl relative overflow-hidden space-y-5">
                <div className="absolute right-0 top-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-400 block">
                      IndoStates Health Hospital
                    </span>
                    <span className="text-xs text-hospital-200">Patient Identity Card</span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <ShieldCheck className="w-5 h-5 text-cyan-300" />
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] text-hospital-300 block">Unique Health Identifier (UHID)</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-2xl font-black font-mono tracking-wider text-white">
                      {session?.uhid || patientProfile?.uhid || "IND-UHID-000101"}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyUhid}
                      className="p-1 rounded-md bg-white/10 hover:bg-white/20 transition text-cyan-300"
                      title="Copy UHID"
                    >
                      {copiedUhid ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="border-t border-hospital-700/60 pt-4 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-hospital-300 block uppercase tracking-wider">Patient Name</span>
                    <strong className="text-white font-semibold text-sm truncate block">
                      {patientProfile?.fullName || session?.name || "Murugan Selvam"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-hospital-300 block uppercase tracking-wider">Blood Group</span>
                    <strong className="text-cyan-300 font-bold text-sm block">
                      {patientProfile?.bloodGroup || "O+"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-hospital-300 block uppercase tracking-wider">Contact Phone</span>
                    <span className="text-hospital-200 text-xs font-mono block">
                      {patientProfile?.phone || session?.phone || "+91 94432 11223"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-hospital-300 block uppercase tracking-wider">Account Status</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-hospital-400 flex items-center justify-between border-t border-hospital-800">
                  <span>Authorized Hospital Medical Pass</span>
                  <span className="font-mono">DPDP Act 2023 Compliant</span>
                </div>
              </div>

              <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5 text-slate-600">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Protected System Identifiers</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Your UHID, Internal Patient ID, and Account Verification Status are immutable system records. Permitted fields (demographics, contact, and address) can be updated on the right.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-base">Edit Patient Demographic Details</h3>
                <p className="text-xs text-slate-500">
                  Keep your official contact and emergency medical records accurate and up-to-date.
                </p>
              </div>

              {profileFeedback && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                    profileFeedback.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  {profileFeedback.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{profileFeedback.message}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editFullName}
                      onChange={(e) => setEditFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={editDob}
                      onChange={(e) => setEditDob(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={editGender}
                      onChange={(e) => setEditGender(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Blood Group
                    </label>
                    <select
                      value={editBloodGroup}
                      onChange={(e) => setEditBloodGroup(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none bg-white"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Residential Address
                  </label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    placeholder="e.g. 12/4 Gandhipuram 4th Cross, Coimbatore"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none"
                  />
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-hospital-600" />
                    <span>Emergency Contact Person</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Contact Name
                      </label>
                      <input
                        type="text"
                        value={editEmergencyName}
                        onChange={(e) => setEditEmergencyName(e.target.value)}
                        placeholder="e.g. Selvamani Murugan"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Emergency Phone
                      </label>
                      <input
                        type="tel"
                        value={editEmergencyPhone}
                        onChange={(e) => setEditEmergencyPhone(e.target.value)}
                        placeholder="+91 94432 11224"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Relationship
                      </label>
                      <select
                        value={editEmergencyRelation}
                        onChange={(e) => setEditEmergencyRelation(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none bg-white"
                      >
                        <option value="Spouse">Spouse</option>
                        <option value="Child">Son / Daughter</option>
                        <option value="Parent">Parent</option>
                        <option value="Sibling">Brother / Sister</option>
                        <option value="Guardian">Guardian</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    type="submit"
                    isLoading={isSavingProfile}
                  >
                    Save Demographic Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 9: FAMILY MEMBERS & DEPENDENTS                       */}
        {/* ======================================================== */}
        {activeTab === "family" && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Authorized Family Dependents</h3>
                  <p className="text-xs text-slate-500">
                    Manage appointments and health services on behalf of registered dependents under your supervision.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {familyMembers.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">
                    No family dependents registered yet. Add a family member below.
                  </p>
                ) : (
                  familyMembers.map((fam) => (
                    <div
                      key={fam.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4"
                    >
                      <div>
                        <strong className="text-slate-900 text-sm block">{fam.full_name || fam.fullName}</strong>
                        <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 mt-1">
                          <span>Relationship: <strong>{fam.relationship}</strong></span>
                          {fam.age && <span>Age: {fam.age} yrs</span>}
                          <span>Gender: {fam.gender}</span>
                          {fam.phone && <span>Contact: {fam.phone}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/book-appointment`}
                          className="px-3 py-1.5 rounded-xl bg-hospital-50 text-hospital-800 border border-hospital-200 text-xs font-bold hover:bg-hospital-100 transition"
                        >
                          Book Appointment &rarr;
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Add Dependent Form */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Add New Family Dependent</h4>
                <p className="text-xs text-slate-500">
                  Dependents share your booking supervision while maintaining individual medical records.
                </p>
              </div>

              {familyFeedback && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                    familyFeedback.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  {familyFeedback.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{familyFeedback.message}</span>
                </div>
              )}

              <form onSubmit={handleAddFamilyMember} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dependent Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priyadharshini Murugan"
                    value={famName}
                    onChange={(e) => setFamName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Relationship *
                  </label>
                  <select
                    value={famRelation}
                    onChange={(e) => setFamRelation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none bg-white"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Son / Daughter</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Brother / Sister</option>
                    <option value="Grandparent">Grandparent</option>
                    <option value="Other">Other Dependent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Age (Years)</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    placeholder="e.g. 14"
                    value={famAge}
                    onChange={(e) => setFamAge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={famGender}
                    onChange={(e) => setFamGender(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none bg-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="Optional phone number"
                    value={famPhone}
                    onChange={(e) => setFamPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    type="submit"
                    isLoading={isSubmittingFamily}
                  >
                    Add Family Dependent
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 10: ACCOUNT SECURITY & PASSWORD                      */}
        {/* ======================================================== */}
        {activeTab === "settings" && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-lg space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Account Security &amp; Password</h3>
              <p className="text-xs text-slate-500">
                Update your login password securely through Supabase Auth.
              </p>
            </div>

            {passFeedback && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                  passFeedback.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {passFeedback.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{passFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Password (Optional)
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Password (min 6 characters) *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                />
              </div>

              <Button
                variant="primary"
                size="md"
                type="submit"
                isLoading={isChangingPass}
                className="w-full mt-2"
              >
                Save New Password
              </Button>
            </form>
          </div>
        )}

      {/* ======================================================== */}
      {/* RESCHEDULE APPOINTMENT MODAL                             */}
      {/* ======================================================== */}
      {isRescheduleModalOpen && rescheduleTargetAppt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Reschedule Appointment</h3>
                <p className="text-xs text-slate-500">
                  Target: {rescheduleTargetAppt.doctorName || rescheduleTargetAppt.targetName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsRescheduleModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {rescheduleFeedback && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                  rescheduleFeedback.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {rescheduleFeedback.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{rescheduleFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmitReschedule} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Select New Consultation Date *
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={rescheduleNewDate}
                  onChange={(e) => {
                    setRescheduleNewDate(e.target.value);
                    fetchRescheduleSlots(
                      rescheduleTargetAppt.doctorId || rescheduleTargetAppt.targetId,
                      e.target.value
                    );
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-hospital-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-700">Select Available Slot *</label>
                  {isLoadingRescheduleSlots && (
                    <span className="text-[10px] text-hospital-700 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Checking slots...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {rescheduleSlots.length === 0 ? (
                    <p className="col-span-3 text-[11px] text-slate-400 py-2 text-center">
                      No open slots on this date. Please pick another date.
                    </p>
                  ) : (
                    rescheduleSlots.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRescheduleNewSlot(s)}
                        className={`p-2 rounded-xl border text-xs font-bold transition text-center ${
                          rescheduleNewSlot === s
                            ? "bg-hospital-700 border-hospital-700 text-white shadow-xs"
                            : "border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {s}
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Reason for Rescheduling (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Schedule clash, medical delay"
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRescheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  isLoading={isSubmittingReschedule}
                >
                  Confirm Reschedule
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CANCEL APPOINTMENT CONFIRMATION MODAL                    */}
      {/* ======================================================== */}
      {isCancelModalOpen && cancelTargetAppt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Cancel Appointment?</h3>
                <p className="text-xs text-slate-500">
                  Ref: {cancelTargetAppt.referenceCode || cancelTargetAppt.id}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to cancel your consultation with{" "}
              <strong>{cancelTargetAppt.doctorName || cancelTargetAppt.targetName}</strong> on{" "}
              <strong>{cancelTargetAppt.appointmentDate || (cancelTargetAppt as any).date}</strong> at{" "}
              <strong>{cancelTargetAppt.timeSlot}</strong>? The slot will be released back to the hospital schedule immediately.
            </p>

            {cancelFeedback && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  cancelFeedback.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                <span>{cancelFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmitCancel} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cancellation Reason (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Feeling better, personal emergency"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCancelModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
                >
                  Keep Appointment
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCancel}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition"
                >
                  {isSubmittingCancel ? "Cancelling..." : "Yes, Cancel Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
