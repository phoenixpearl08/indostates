"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HospitalStore, StoredAppointment, UserSession } from "@/lib/store";
import { DigitalPass } from "@/components/booking/DigitalPass";
import {
  Calendar,
  Clock,
  User,
  FileText,
  ShieldCheck,
  LogOut,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Download,
  Plus,
  ExternalLink,
  QrCode,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function PatientPortalPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [appointments, setAppointments] = useState<StoredAppointment[]>([]);
  const [selectedPass, setSelectedPass] = useState<StoredAppointment | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState<StoredAppointment | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newSlot, setNewSlot] = useState("10:00 AM – 11:00 AM");

  const [familyMembers, setFamilyMembers] = useState([
    { id: "fam-1", name: "Ananya Kumar", relation: "Spouse", age: 34 },
    { id: "fam-2", name: "Siddharth Kumar", relation: "Son", age: 8 },
  ]);
  const [newFamName, setNewFamName] = useState("");
  const [newFamRelation, setNewFamRelation] = useState("Parent");

  useEffect(() => {
    const s = HospitalStore.getSession();
    if (!s) {
      // Default to guest/demo patient session if not logged in
      const demoSession: UserSession = {
        id: "demo-pat-1",
        name: "Rajesh Kumar",
        email: "rajesh.kumar@example.com",
        role: "patient",
      };
      HospitalStore.setSession(demoSession);
      setSession(demoSession);
    } else {
      setSession(s);
    }

    const loadAppointments = () => {
      let appts = HospitalStore.getAppointments();
      if (appts.length === 0) {
        // Seed an initial demo confirmed appointment so the portal looks alive!
        const initialAppt: StoredAppointment = {
          id: "appt-demo-seed",
          referenceCode: "ISH-784291",
          patientName: s ? s.name : "Rajesh Kumar",
          patientPhone: "+91 98421 11000",
          patientEmail: s ? s.email : "rajesh.kumar@example.com",
          patientAge: 42,
          patientGender: "Male",
          serviceType: "package",
          targetId: "master-health-checkup",
          targetName: "Master Health Check-up (Comprehensive)",
          doctorName: "Dr. Logesh Thirumalaisamy",
          date: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
          timeSlot: "08:30 AM – 09:30 AM",
          status: "confirmed",
          createdAt: new Date().toISOString(),
          paymentStatus: "pay_on_arrival",
        };
        HospitalStore.saveAppointment(initialAppt);
        appts = [initialAppt];
      }
      setAppointments(appts);
    };

    loadAppointments();

    const handleUpdate = () => {
      setAppointments(HospitalStore.getAppointments());
    };
    window.addEventListener("ish_appointments_change", handleUpdate);
    return () => window.removeEventListener("ish_appointments_change", handleUpdate);
  }, []);

  const handleLogout = () => {
    HospitalStore.setSession(null);
    router.push("/login");
  };

  const handleCancel = (id: string) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      HospitalStore.cancelAppointment(id);
    }
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showRescheduleModal || !newDate) return;
    HospitalStore.rescheduleAppointment(showRescheduleModal.id, newDate, newSlot);
    setShowRescheduleModal(null);
  };

  const handleAddFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFamName.trim()) return;
    setFamilyMembers([
      ...familyMembers,
      { id: "fam-" + Date.now(), name: newFamName, relation: newFamRelation, age: 30 },
    ]);
    setNewFamName("");
  };

  const upcomingAppointments = appointments.filter((a) => a.status === "confirmed" || a.status === "pending");
  const pastAppointments = appointments.filter((a) => a.status === "completed" || a.status === "cancelled");
  const nextAppointment = upcomingAppointments[0];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Top Banner */}
      <section className="bg-gradient-to-r from-hospital-950 via-hospital-900 to-cyan-950 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-hospital-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-600/30 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-md">
              <User className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-900/60 border border-cyan-700 text-cyan-300 text-[11px] font-semibold tracking-wide uppercase mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Patient Dashboard
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
                Welcome, {session?.name || "Patient"}
              </h1>
              <p className="text-xs text-hospital-200">
                Medical Record & Scheduling Hub • Indo States Health
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/book-appointment">
              <Button variant="secondary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                New Appointment
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-hospital-700 text-hospital-200 hover:bg-hospital-800"
              leftIcon={<LogOut className="w-4 h-4" />}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* "What do I need to do next?" Priority Action Hero */}
        {nextAppointment ? (
          <div className="bg-gradient-to-r from-cyan-900 to-hospital-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 border border-cyan-400/30 text-xs font-bold uppercase mb-2">
                  <Clock className="w-3.5 h-3.5 text-cyan-300" />
                  What You Need to Do Next
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white mb-1">
                  Upcoming: {nextAppointment.targetName}
                </h2>
                <div className="text-xs text-cyan-100 flex flex-wrap gap-4 mt-2">
                  <span>📅 Date: <strong>{nextAppointment.date}</strong></span>
                  <span>⏰ Time: <strong>{nextAppointment.timeSlot}</strong></span>
                  <span>Ref: <strong className="font-mono">{nextAppointment.referenceCode}</strong></span>
                </div>
                <p className="text-xs text-slate-300 mt-3 max-w-xl">
                  Please arrive 15 minutes before your time slot. If you selected Master Health Checkup, remember 10-12 hours of overnight fasting.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setSelectedPass(nextAppointment)}
                  leftIcon={<QrCode className="w-4 h-4" />}
                >
                  Digital Pass & QR
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setShowRescheduleModal(nextAppointment)}
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Reschedule
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Upcoming Appointments</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              Stay ahead with proactive health screening. Schedule a Master Health Checkup or specialist consultation today.
            </p>
            <Button href="/book-appointment" variant="primary" size="md">
              Book Master Checkup (₹3,500)
            </Button>
          </div>
        )}

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: All Appointments */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 font-display mb-4 flex items-center justify-between">
                <span>Appointment History & Status</span>
                <span className="text-xs font-normal text-slate-500">
                  Total: {appointments.length}
                </span>
              </h3>

              <div className="space-y-4">
                {appointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-hospital-300 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            appt.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-800"
                              : appt.status === "cancelled"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {appt.status}
                        </span>
                        <span className="text-xs font-mono font-semibold text-slate-700">
                          {appt.referenceCode}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">{appt.targetName}</h4>
                      <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-x-4">
                        <span>📅 {appt.date}</span>
                        <span>⏰ {appt.timeSlot}</span>
                        {appt.doctorName && <span>👨‍⚕️ {appt.doctorName}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {appt.status === "confirmed" && (
                        <>
                          <button
                            onClick={() => setSelectedPass(appt)}
                            className="p-2 rounded-xl bg-white border border-slate-200 text-hospital-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1 shadow-sm"
                            title="View QR Digital Pass"
                          >
                            <QrCode className="w-4 h-4 text-cyan-600" />
                            Pass
                          </button>
                          <button
                            onClick={() => setShowRescheduleModal(appt)}
                            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleCancel(appt.id)}
                            className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-semibold"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnostic Documents & Lab Reports */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 font-display">Diagnostic Reports & Documents</h3>
                <a
                  href="https://indo.provalan.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-hospital-700 hover:underline flex items-center gap-1"
                >
                  Hospital EHR System <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs text-slate-600 mb-6">
                Laboratory results, 1.5T MRI / 128-slice CT radiology study PDFs, and discharge summaries are archived here securely.
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-hospital-700" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Master Health Checkup Lab Panel.pdf</div>
                      <div className="text-[11px] text-slate-500">28 Vital Biochemistry Tests • Certified by Dr. Anita Chandrasekhar</div>
                    </div>
                  </div>
                  <a
                    href="#download"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Downloading verified computerized diagnostic PDF report from Indo States Health.");
                    }}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-hospital-700 text-xs font-semibold flex items-center gap-1 hover:bg-slate-100"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-hospital-700" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Coronary Calcium Score Report.pdf</div>
                      <div className="text-[11px] text-slate-500">128-Slice Low Dose CT • Read by Dr. Rajesh Rangaswamy</div>
                    </div>
                  </div>
                  <a
                    href="#download"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Downloading CT Calcium Score diagnostic report from Indo States Health.");
                    }}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-hospital-700 text-xs font-semibold flex items-center gap-1 hover:bg-slate-100"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Family Profiles & Account */}
          <div className="lg:col-span-1 space-y-6">
            {/* Family Members Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 font-display mb-1">Family Health Profiles</h3>
              <p className="text-xs text-slate-500 mb-4">
                Schedule and manage appointments for dependents.
              </p>

              <div className="space-y-3 mb-6">
                {familyMembers.map((fam) => (
                  <div key={fam.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900">{fam.name}</div>
                      <div className="text-[11px] text-slate-500">{fam.relation} • Age {fam.age}</div>
                    </div>
                    <Link href={`/book-appointment?patientName=${encodeURIComponent(fam.name)}`}>
                      <span className="text-[11px] font-semibold text-hospital-700 hover:underline">
                        Book &rarr;
                      </span>
                    </Link>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddFamily} className="space-y-2 pt-3 border-t border-slate-100">
                <input
                  type="text"
                  placeholder="Family member full name"
                  value={newFamName}
                  onChange={(e) => setNewFamName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                />
                <div className="flex gap-2">
                  <select
                    value={newFamRelation}
                    onChange={(e) => setNewFamRelation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option>Parent</option>
                    <option>Spouse</option>
                    <option>Child</option>
                    <option>Sibling</option>
                  </select>
                  <Button variant="outline" size="sm" type="submit" className="shrink-0 text-xs">
                    Add
                  </Button>
                </div>
              </form>
            </div>

            {/* Quick Contact & Helpline */}
            <div className="bg-hospital-900 text-white rounded-3xl p-6 shadow-md">
              <h3 className="text-sm font-bold font-display text-white mb-1">Direct Patient Desk</h3>
              <p className="text-xs text-hospital-200 mb-4 leading-relaxed">
                Need to arrange home sample collection or request imaging discs?
              </p>
              <a
                href="tel:04222111000"
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                Call 0422-2111000
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Pass Modal */}
      {selectedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <DigitalPass
              appointment={selectedPass}
              onClose={() => setSelectedPass(null)}
            />
          </div>
        </div>
      )}


      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 font-display mb-1">
              Reschedule Appointment
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select a new date and time for {showRescheduleModal.targetName}.
            </p>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select New Date *</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select New Time Slot</label>
                <select
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500 bg-white"
                >
                  <option>08:30 AM – 09:30 AM (Fasting blood tests)</option>
                  <option>10:00 AM – 11:00 AM</option>
                  <option>11:30 AM – 12:30 PM</option>
                  <option>02:00 PM – 03:00 PM</option>
                  <option>04:00 PM – 05:00 PM</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <Button variant="outline" size="sm" type="button" onClick={() => setShowRescheduleModal(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Confirm Reschedule
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
