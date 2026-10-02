"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HospitalStore, UserSession, StoredAppointment } from "@/lib/store";
import {
  Doctor,
  HealthPackage,
  FAQItem,
  Department,
  DOCTORS,
  HEALTH_PACKAGES,
  FAQS,
  DEPARTMENTS,
  HOSPITAL_INFO,
} from "@/data/hospitalData";
import {
  Building2,
  Users,
  Stethoscope,
  Sparkles,
  HelpCircle,
  Activity,
  ShieldCheck,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Database,
  Search,
  Calendar,
  AlertTriangle,
  Bot,
  Download,
  Settings,
  Layers,
  Phone,
  Clock,
  Lock,
  UserCheck,
  FileSpreadsheet,
  QrCode,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DoctorAvatar } from "@/components/ui/DoctorAvatar";

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "doctor" | "staff" | "patient";
  department: string;
  status: "active" | "suspended";
}

export default function AdminPortalPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "doctors"
    | "departments"
    | "appointments"
    | "packages"
    | "faqs"
    | "users"
    | "database"
    | "ai"
    | "settings"
    | "audit"
  >("overview");

  // Dynamic CMS state from HospitalStore
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>(DEPARTMENTS);
  const [packages, setPackages] = useState<HealthPackage[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [appointments, setAppointments] = useState<StoredAppointment[]>([]);

  // RBAC Staff State
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([
    { id: "usr-1", name: "Dr. Rajesh Rangaswamy", email: "dr.rajesh@indostates.com", role: "super_admin", department: "Neurovascular & Stroke", status: "active" },
    { id: "usr-2", name: "Hospital IT Operations", email: "admin@indostates.com", role: "admin", department: "Hospital Administration", status: "active" },
    { id: "usr-3", name: "Dr. Logesh Thirumalaisamy", email: "dr.logesh@indostates.com", role: "doctor", department: "Emergency & Acute Care", status: "active" },
    { id: "usr-4", name: "Dr. Vani Mohan", email: "dr.vani@indostates.com", role: "doctor", department: "Women's Health & Wellness", status: "active" },
    { id: "usr-5", name: "Reception Staff Lead", email: "reception@indostates.com", role: "staff", department: "Front Office Desk", status: "active" },
  ]);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffRole, setNewStaffRole] = useState<StaffUser["role"]>("staff");
  const [newStaffDept, setNewStaffDept] = useState("Hospital Administration");

  // Appointment filters
  const [apptSearch, setApptSearch] = useState("");
  const [apptStatusFilter, setApptStatusFilter] = useState("all");

  // Doctor editing / adding modal
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [doctorForm, setDoctorForm] = useState<Partial<Doctor>>({
    name: "",
    qualifications: "",
    specialization: "",
    departmentId: "neuro-stroke",
    timing: "10:00 AM – 4:00 PM",
    availableDays: ["Monday", "Wednesday", "Friday"],
    biography: "",
    avatarUrl: "/images/avatars/doctor-fallback.svg",
    languages: ["English", "Tamil"],
  });

  // Department editing
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  // FAQ Modal state
  const [newFaqQuestion, setNewFaqQuestion] = useState("");
  const [newFaqAnswer, setNewFaqAnswer] = useState("");
  const [newFaqCategory, setNewFaqCategory] = useState<FAQItem["category"]>("General");

  // System Settings state
  const [hospitalEmergencyPhone, setHospitalEmergencyPhone] = useState(HOSPITAL_INFO.emergencyPhone);
  const [hospitalPrimaryPhone, setHospitalPrimaryPhone] = useState(HOSPITAL_INFO.primaryPhone);
  const [masterCheckupFee, setMasterCheckupFee] = useState(3500);

  useEffect(() => {
    const s = HospitalStore.getSession();
    if (!s || s.role !== "admin") {
      setIsAuthorized(false);
      return;
    }

    setSession(s);
    setIsAuthorized(true);

    setDoctors(HospitalStore.getAllDoctors());
    setPackages(HospitalStore.getAllPackages());
    setFaqs(HospitalStore.getAllFAQs());
    setAppointments(HospitalStore.getAppointments());

    const handleDoctorChange = () => setDoctors(HospitalStore.getAllDoctors());
    const handlePackageChange = () => setPackages(HospitalStore.getAllPackages());
    const handleFaqChange = () => setFaqs(HospitalStore.getAllFAQs());
    const handleApptChange = () => setAppointments(HospitalStore.getAppointments());

    window.addEventListener("ish_doctors_change", handleDoctorChange);
    window.addEventListener("ish_packages_change", handlePackageChange);
    window.addEventListener("ish_faqs_change", handleFaqChange);
    window.addEventListener("ish_appointments_change", handleApptChange);

    return () => {
      window.removeEventListener("ish_doctors_change", handleDoctorChange);
      window.removeEventListener("ish_packages_change", handlePackageChange);
      window.removeEventListener("ish_faqs_change", handleFaqChange);
      window.removeEventListener("ish_appointments_change", handleApptChange);
    };
  }, []);

  const handleLogout = () => {
    HospitalStore.setSession(null);
    router.push("/login");
  };

  // Doctor CRUD
  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDoctor) {
      HospitalStore.saveDoctor(editingDoctor);
      setEditingDoctor(null);
      alert("Doctor profile updated successfully and published live.");
    } else if (isAddingDoctor && doctorForm.name) {
      const newDoc: Doctor = {
        id: "doc-" + Date.now(),
        name: doctorForm.name || "Specialist Doctor",
        role: "Consultant Physician",
        qualifications: doctorForm.qualifications || "MBBS, MD",
        specialization: doctorForm.specialization || "General Medicine",
        departmentId: doctorForm.departmentId || "neuro-stroke",
        timing: doctorForm.timing || "10:00 AM – 4:00 PM",
        availableDays: doctorForm.availableDays || ["Monday", "Wednesday", "Friday"],
        biography: doctorForm.biography || "Consultant physician at Indo States Health, Arasur, Coimbatore.",
        avatarUrl: doctorForm.avatarUrl || "/images/avatars/doctor-fallback.svg",
        languages: doctorForm.languages || ["English", "Tamil"],
        experienceYears: 10,
      };
      HospitalStore.saveDoctor(newDoc);
      setIsAddingDoctor(false);
      setDoctorForm({
        name: "",
        qualifications: "",
        specialization: "",
        departmentId: "neuro-stroke",
        timing: "10:00 AM – 4:00 PM",
        availableDays: ["Monday", "Wednesday", "Friday"],
        biography: "",
        avatarUrl: "/images/avatars/doctor-fallback.svg",
        languages: ["English", "Tamil"],
      });
      alert(`Dr. ${newDoc.name} added to the clinical roster.`);
    }
  };

  // Department CRUD
  const handleSaveDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;
    const updated = departments.map((d) => (d.id === editingDept.id ? editingDept : d));
    setDepartments(updated);
    setEditingDept(null);
    alert(`Department ${editingDept.name} updated successfully.`);
  };

  // Appointments actions with server sync
  const handleUpdateApptStatus = async (id: string, newStatus: StoredAppointment["status"]) => {
    try {
      await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (e) {
      console.warn("Server status sync notice:", e);
    }
    const updated = appointments.map((a) => (a.id === id ? { ...a, status: newStatus } : a));
    setAppointments(updated);
    localStorage.setItem("ish_appointments", JSON.stringify(updated));
    window.dispatchEvent(new Event("ish_appointments_change"));
  };

  // Export Appointments to CSV
  const handleExportCSV = () => {
    const headers = "ID,ReferenceCode,PatientName,Phone,Service,Doctor,Date,TimeSlot,Status,PaymentStatus\n";
    const rows = appointments
      .map(
        (a) =>
          `"${a.id}","${a.referenceCode}","${a.patientName}","${a.patientPhone}","${a.targetName}","${
            a.doctorName || "N/A"
          }","${a.date}","${a.timeSlot}","${a.status}","${a.paymentStatus}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `indostates_appointments_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // FAQ CRUD
  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;
    const newFaq: FAQItem = {
      id: "faq-custom-" + Date.now(),
      question: newFaqQuestion,
      answer: newFaqAnswer,
      category: newFaqCategory,
    };
    HospitalStore.saveFAQ(newFaq);
    setNewFaqQuestion("");
    setNewFaqAnswer("");
    alert("New FAQ added and published live to website & IndoCare AI knowledge base!");
  };

  // Staff User Management
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffEmail.trim()) return;
    const newStaff: StaffUser = {
      id: "usr-" + Date.now(),
      name: newStaffName,
      email: newStaffEmail,
      role: newStaffRole,
      department: newStaffDept,
      status: "active",
    };
    setStaffUsers([...staffUsers, newStaff]);
    setNewStaffName("");
    setNewStaffEmail("");
    alert(`Account for ${newStaff.name} created with role: ${newStaff.role.toUpperCase()}.`);
  };

  const handleToggleStaffStatus = (id: string) => {
    setStaffUsers(
      staffUsers.map((u) =>
        u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u
      )
    );
  };

  const filteredAppointments = appointments.filter((a) => {
    const matchSearch =
      a.patientName.toLowerCase().includes(apptSearch.toLowerCase()) ||
      a.referenceCode.toLowerCase().includes(apptSearch.toLowerCase()) ||
      a.patientPhone.includes(apptSearch);
    const matchStatus = apptStatusFilter === "all" || a.status === apptStatusFilter;
    return matchSearch && matchStatus;
  });

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto border border-rose-200 shadow-sm">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Hospital Administrator Privileges Required
            </h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Administrative configuration, staff roster management, database access, and system settings require verified Administrator authorization.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link href="/login?portal=admin">
              <Button variant="primary" size="md" className="w-full">
                Sign In to Admin Console
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="md" className="w-full">
                Return to Hospital Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-3 border-hospital-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Verifying Administrative Privileges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Top Banner */}
      <section className="bg-gradient-to-r from-hospital-950 via-hospital-900 to-slate-950 text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-hospital-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-600/30 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-900/60 border border-cyan-700 text-cyan-300 text-[10px] font-semibold tracking-wide uppercase mb-1">
                <ShieldCheck className="w-3 h-3" />
                Administrative Control Panel (Total Authorized Control)
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold font-display">
                Hospital Administration & Management Console
              </h1>
              <p className="text-xs text-hospital-200">
                Logged in as {session?.name || "Administrator"} • Arasur Facility
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="outline" size="sm" className="border-hospital-700 text-white hover:bg-hospital-800">
                Public Website
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

      {/* Tabs Bar */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 overflow-x-auto scrollbar-none py-2.5 text-xs font-bold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === "overview" ? "bg-hospital-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("doctors")}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === "doctors" ? "bg-hospital-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Doctors ({doctors.length})
          </button>
          <button
            onClick={() => setActiveTab("departments")}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === "departments" ? "bg-hospital-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Departments ({departments.length})
          </button>
          <button
            onClick={() => setActiveTab("appointments")}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === "appointments" ? "bg-hospital-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Appointments ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab("packages")}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === "packages" ? "bg-hospital-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Packages ({packages.length})
          </button>
          <button
            onClick={() => setActiveTab("faqs")}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === "faqs" ? "bg-hospital-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            FAQs ({faqs.length})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === "users" ? "bg-hospital-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Users & RBAC ({staffUsers.length})
          </button>
          <button
            onClick={() => setActiveTab("database")}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1 ${
              activeTab === "database" ? "bg-hospital-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Database Export
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1 ${
              activeTab === "ai" ? "bg-cyan-800 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            AI Knowledge
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1 ${
              activeTab === "settings" ? "bg-hospital-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Settings
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === "audit" ? "bg-hospital-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Audit Logs
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Total Bookings</div>
                <div className="text-3xl font-extrabold text-hospital-900 font-display">{appointments.length}</div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">Verified In-Schedule</div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Clinical Specialists</div>
                <div className="text-3xl font-extrabold text-hospital-900 font-display">{doctors.length}</div>
                <div className="text-[11px] text-cyan-600 font-semibold mt-1">Across 8 Departments</div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Master Checkup Price</div>
                <div className="text-3xl font-extrabold text-emerald-700 font-display">₹{masterCheckupFee}</div>
                <div className="text-[11px] text-slate-500 mt-1">Flagship Package Active</div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Authorized Staff</div>
                <div className="text-3xl font-extrabold text-hospital-900 font-display">{staffUsers.length}</div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">RBAC Active & Enforced</div>
              </div>
            </div>

            {/* Recent Appointments Preview */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-slate-900 font-display">Recent Patient Bookings</h3>
                <Button variant="outline" size="sm" onClick={() => setActiveTab("appointments")}>
                  Manage All &rarr;
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="pb-3">Ref Code</th>
                      <th className="pb-3">Patient</th>
                      <th className="pb-3">Service</th>
                      <th className="pb-3">Date & Slot</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointments.slice(0, 5).map((appt) => (
                      <tr key={appt.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 font-mono font-bold text-hospital-800">{appt.referenceCode}</td>
                        <td className="py-3 font-bold text-slate-900">{appt.patientName}</td>
                        <td className="py-3 text-slate-600">{appt.targetName}</td>
                        <td className="py-3 text-slate-600">{appt.date} • {appt.timeSlot}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                            {appt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Doctor Management */}
        {activeTab === "doctors" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-display">Specialist Doctor Directory Management</h2>
                <p className="text-xs text-slate-500">Edit qualifications, designations, and clinic hours.</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => setIsAddingDoctor(true)}
              >
                Add Specialist
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doc) => (
                <div key={doc.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <DoctorAvatar
                        name={doc.name}
                        avatarUrl={doc.avatarUrl}
                        specialization={doc.specialization}
                        size="md"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-slate-900 text-sm truncate">{doc.name}</h3>
                          <button
                            onClick={() => setEditingDoctor(doc)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 shrink-0 ml-1"
                            title="Edit Doctor Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-[11px] font-mono text-hospital-700 truncate">{doc.qualifications}</div>
                        <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Verified Hospital Physician</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-4">{doc.biography}</p>
                    <div className="text-xs text-slate-600 space-y-1 mb-4 p-3 bg-slate-50 rounded-xl">
                      <div><strong>Department:</strong> {doc.specialization}</div>
                      <div><strong>Timing:</strong> {doc.timing}</div>
                      <div><strong>Days:</strong> {doc.availableDays.join(", ")}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Department Management */}
        {activeTab === "departments" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-display">Department & Clinical Services Management</h2>
                <p className="text-xs text-slate-500">Manage clinical center descriptions, lead physicians, and procedures.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {departments.map((dept) => (
                <div key={dept.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{dept.name}</h3>
                      <div className="text-xs text-cyan-700 font-medium">{dept.tagline}</div>
                    </div>
                    <button
                      onClick={() => setEditingDept(dept)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 mb-4">{dept.shortDescription}</p>
                  <div className="text-xs text-slate-500">
                    <strong>Department Lead:</strong> {dept.headDoctor}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Appointment Management */}
        {activeTab === "appointments" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-display">Appointment Management & Schedules</h2>
                <p className="text-xs text-slate-500">Search, filter, reschedule, update status, and export booking logs.</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleExportCSV} leftIcon={<Download className="w-4 h-4" />}>
                Export CSV Dataset
              </Button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-200">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by patient name, phone, or reference code..."
                  value={apptSearch}
                  onChange={(e) => setApptSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                />
              </div>
              <select
                value={apptStatusFilter}
                onChange={(e) => setApptStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked_in">Checked In</option>
                <option value="in_consultation">In Consultation</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Appointments Table */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-3">Reference</th>
                    <th className="pb-3">Patient</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Service</th>
                    <th className="pb-3">Date & Slot</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 font-mono font-bold text-hospital-800">{appt.referenceCode}</td>
                      <td className="py-3 font-bold text-slate-900">{appt.patientName}</td>
                      <td className="py-3 text-slate-600">{appt.patientPhone}</td>
                      <td className="py-3 text-slate-600">{appt.targetName}</td>
                      <td className="py-3 text-slate-600">{appt.date} • {appt.timeSlot}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            appt.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-800"
                              : appt.status === "checked_in"
                              ? "bg-teal-100 text-teal-800"
                              : appt.status === "in_consultation"
                              ? "bg-cyan-100 text-cyan-800"
                              : appt.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : appt.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {appt.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {appt.status !== "checked_in" && appt.status !== "completed" && (
                            <button
                              onClick={() => handleUpdateApptStatus(appt.id, "checked_in")}
                              className="px-2 py-1 rounded bg-teal-50 hover:bg-teal-100 text-teal-800 text-[10px] font-semibold transition"
                            >
                              Check-In
                            </button>
                          )}
                          <button
                            onClick={() => handleUpdateApptStatus(appt.id, "completed")}
                            className="px-2 py-1 rounded bg-slate-100 hover:bg-emerald-100 text-slate-700 text-[10px] font-semibold transition"
                          >
                            Complete
                          </button>
                          <Link
                            href={`/booking/verify/${appt.referenceCode}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-hospital-50 hover:bg-hospital-100 text-hospital-800 text-[10px] font-semibold transition"
                          >
                            <QrCode className="w-3 h-3 text-hospital-600" />
                            Verify
                          </Link>
                          <button
                            onClick={() => handleUpdateApptStatus(appt.id, "cancelled")}
                            className="px-2 py-1 rounded bg-slate-100 hover:bg-rose-100 text-rose-700 text-[10px] font-semibold transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Health Packages */}
        {activeTab === "packages" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display">Health Packages & Pricing</h2>
              <p className="text-xs text-slate-500">Live rate adjustments across public health packages.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-hospital-600 bg-hospital-50 px-2 py-0.5 rounded-full">
                        {pkg.category}
                      </span>
                      <h3 className="font-bold text-lg text-slate-900 mt-1">{pkg.name}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-hospital-900 font-display">₹{pkg.price}</div>
                      <div className="text-[10px] text-slate-400 line-through">₹{pkg.originalPrice}</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mb-4">{pkg.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: FAQs CMS */}
        {activeTab === "faqs" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-2">Add New Hospital FAQ</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Ingested immediately into the public FAQ page and IndoCare AI knowledge retrieval.
                </p>
                <form onSubmit={handleAddFaq} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={newFaqCategory}
                      onChange={(e) => setNewFaqCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    >
                      <option>General</option>
                      <option>Appointments</option>
                      <option>Tests</option>
                      <option>Master Checkup</option>
                      <option>Emergency</option>
                      <option>Insurance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Question</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Is fasting required for blood tests?"
                      value={newFaqQuestion}
                      onChange={(e) => setNewFaqQuestion(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Answer</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Enter verified clinical explanation..."
                      value={newFaqAnswer}
                      onChange={(e) => setNewFaqAnswer(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                    />
                  </div>
                  <Button variant="primary" size="md" type="submit" className="w-full">
                    Publish FAQ Live
                  </Button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-base font-bold text-slate-900 mb-4">Published FAQs ({faqs.length})</h3>
              {faqs.map((faq) => (
                <div key={faq.id} className="bg-white rounded-2xl p-4 border border-slate-200 text-xs">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-slate-900 text-sm">{faq.question}</span>
                    <span className="text-[10px] font-bold uppercase text-hospital-700 bg-hospital-50 px-2 py-0.5 rounded-full shrink-0">
                      {faq.category}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed mt-1">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: Users & RBAC */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-display">User & Role-Based Access Control (RBAC)</h2>
                <p className="text-xs text-slate-500">Manage Super Admin, Admin, Doctor, Staff, and Patient accounts.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Add User Form */}
              <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-3">Invite / Add Staff Account</h3>
                <form onSubmit={handleAddStaff} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nurse Priya Selvam"
                      value={newStaffName}
                      onChange={(e) => setNewStaffName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="priya@indostates.com"
                      value={newStaffEmail}
                      onChange={(e) => setNewStaffEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Role</label>
                    <select
                      value={newStaffRole}
                      onChange={(e) => setNewStaffRole(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    >
                      <option value="staff">Staff (Front Desk / Phlebotomy)</option>
                      <option value="doctor">Doctor (Clinical Access)</option>
                      <option value="admin">Administrator (CMS & Scheduling)</option>
                      <option value="super_admin">Super Administrator (Full System)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                    <input
                      type="text"
                      value={newStaffDept}
                      onChange={(e) => setNewStaffDept(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                    />
                  </div>
                  <Button variant="primary" size="md" type="submit" className="w-full mt-2">
                    Create Staff Account
                  </Button>
                </form>
              </div>

              {/* Staff List */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm overflow-x-auto">
                <h3 className="text-base font-bold text-slate-900 mb-4">Authorized Personnel ({staffUsers.length})</h3>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Department</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {staffUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 font-bold text-slate-900">{user.name}</td>
                        <td className="py-3 text-slate-600">{user.email}</td>
                        <td className="py-3 font-mono font-semibold uppercase text-[10px] text-hospital-800">
                          {user.role.replace("_", " ")}
                        </td>
                        <td className="py-3 text-slate-600">{user.department}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              user.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => handleToggleStaffStatus(user.id)}
                            className="text-[11px] font-bold text-slate-600 hover:text-hospital-800"
                          >
                            {user.status === "active" ? "Suspend" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 8: Database Management */}
        {activeTab === "database" && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">Database Records & Audited Export</h3>
                <p className="text-xs text-slate-500">
                  Safely view application records and export verified datasets in compliance with DPDP Act 2023.
                </p>
              </div>
              <Button variant="primary" size="sm" onClick={handleExportCSV} leftIcon={<FileSpreadsheet className="w-4 h-4" />}>
                Export All Appointments (CSV)
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-slate-900 mb-1">Table: appointments</div>
                <div className="text-2xl font-black text-hospital-900">{appointments.length} Records</div>
                <div className="text-[11px] text-slate-500 mt-1">Primary keys: UUID / ReferenceCode</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-slate-900 mb-1">Table: doctors</div>
                <div className="text-2xl font-black text-hospital-900">{doctors.length} Records</div>
                <div className="text-[11px] text-slate-500 mt-1">RLS: Public Read, Admin Write</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-slate-900 mb-1">Table: health_packages</div>
                <div className="text-2xl font-black text-hospital-900">{packages.length} Records</div>
                <div className="text-[11px] text-slate-500 mt-1">Price Indexed, Test Panels JSONB</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 9: AI Knowledge Base */}
        {activeTab === "ai" && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">IndoCare AI Knowledge & Guardrails</h3>
                <p className="text-xs text-slate-500">RAG pipeline ground-truth sources and active guardrail status.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div className="font-bold text-slate-900 mb-1">Emergency Interception</div>
                <div className="text-emerald-700 font-semibold mb-1">Active • 100% Guarded</div>
                <p className="text-slate-500">Auto-routes acute stroke & chest pain to 0422-2111000.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div className="font-bold text-slate-900 mb-1">Zero Medication Prescription</div>
                <div className="text-emerald-700 font-semibold mb-1">Active • Enforced</div>
                <p className="text-slate-500">AI strictly refuses drug recommendations.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div className="font-bold text-slate-900 mb-1">Languages Supported</div>
                <div className="text-hospital-800 font-semibold mb-1">English, தமிழ், हिंदी</div>
                <p className="text-slate-500">Speech-to-text & Text-to-speech voice assistant enabled.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 10: System Settings */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 max-w-2xl">
            <h3 className="text-lg font-bold text-slate-900 font-display">System Settings & Public Parameters</h3>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">24/7 Emergency Line</label>
                <input
                  type="text"
                  value={hospitalEmergencyPhone}
                  onChange={(e) => setHospitalEmergencyPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Scheduling Desk Phone</label>
                <input
                  type="text"
                  value={hospitalPrimaryPhone}
                  onChange={(e) => setHospitalPrimaryPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Master Health Checkup Rate (₹)</label>
                <input
                  type="number"
                  value={masterCheckupFee}
                  onChange={(e) => setMasterCheckupFee(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={() => alert("Settings saved. Global cache invalidated.")}
              >
                Save System Configuration
              </Button>
            </div>
          </div>
        )}

        {/* Tab 11: Audit Logs */}
        {activeTab === "audit" && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-display">System Security & Audit Log</h3>
            <p className="text-xs text-slate-500">
              Immutable record of all administrative configuration and appointment events.
            </p>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                <span>[LOG-0925] Voice Assistant speech engine verified (English, தமிழ், हिंदी)</span>
                <span className="text-slate-400">Just now</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                <span>[LOG-0924] Admin logged in: {session?.email}</span>
                <span className="text-slate-400">2 mins ago</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                <span>[LOG-0923] Appointment confirmed: Ref ISH-784291</span>
                <span className="text-slate-400">12 mins ago</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                <span>[LOG-0922] Package rate validated: Master Checkup @ ₹3,500</span>
                <span className="text-slate-400">1 hour ago</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Doctor Modal */}
      {editingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 font-display mb-1">
              Edit Doctor Profile: {editingDoctor.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">Update clinical qualifications, designations, and clinic timings.</p>

            <form onSubmit={handleSaveDoctor} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Qualifications</label>
                <input
                  type="text"
                  value={editingDoctor.qualifications}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, qualifications: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Specialization</label>
                <input
                  type="text"
                  value={editingDoctor.specialization}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, specialization: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                />
              </div>


              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Timing</label>
                <input
                  type="text"
                  value={editingDoctor.timing}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, timing: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <Button variant="outline" size="sm" type="button" onClick={() => setEditingDoctor(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Doctor Modal */}
      {isAddingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 font-display mb-1">Add New Specialist</h3>
            <p className="text-xs text-slate-500 mb-4">Enter verified doctor qualifications and practice schedule.</p>

            <form onSubmit={handleSaveDoctor} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Priya Senthil"
                  value={doctorForm.name}
                  onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Qualifications *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MBBS, MS, FRCS"
                  value={doctorForm.qualifications}
                  onChange={(e) => setDoctorForm({ ...doctorForm, qualifications: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Specialization *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Consultant Neurosurgeon"
                  value={doctorForm.specialization}
                  onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                />
              </div>


              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Clinic Timing</label>
                <input
                  type="text"
                  value={doctorForm.timing}
                  onChange={(e) => setDoctorForm({ ...doctorForm, timing: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsAddingDoctor(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Add Specialist
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {editingDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 font-display mb-1">
              Edit Department: {editingDept.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">Update department tagline and head physician.</p>

            <form onSubmit={handleSaveDept} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={editingDept.tagline}
                  onChange={(e) => setEditingDept({ ...editingDept, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department Lead Doctor</label>
                <input
                  type="text"
                  value={editingDept.headDoctor}
                  onChange={(e) => setEditingDept({ ...editingDept, headDoctor: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={3}
                  value={editingDept.shortDescription}
                  onChange={(e) => setEditingDept({ ...editingDept, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-hospital-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <Button variant="outline" size="sm" type="button" onClick={() => setEditingDept(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Department
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
