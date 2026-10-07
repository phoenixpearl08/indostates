"use client";

import { Language } from "@/data/translations";
import { Doctor, Department, HealthPackage, DOCTORS, DEPARTMENTS, HEALTH_PACKAGES, FAQS, FAQItem } from "@/data/hospitalData";

export interface StoredAppointment {
  id: string;
  referenceCode: string;
  patientId?: string;
  verificationToken?: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientAge: number;
  patientGender: string;
  serviceType: "package" | "department" | "doctor";
  targetId: string;
  targetName: string;
  doctorName?: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: "confirmed" | "completed" | "cancelled" | "pending" | "checked_in" | "in_consultation" | "expired";
  createdAt: string;
  qrCodeDataUrl?: string;
  paymentStatus: "pay_on_arrival" | "paid_online";
}

import { UserRole } from "@/types/hms";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole | "patient" | "doctor" | "admin";
  uhid?: string;
  department?: string;
  employee_id?: string;
  token?: string;
}

const STORAGE_KEYS = {
  LANGUAGE: "ish_language",
  ACCESSIBILITY: "ish_a11y",
  APPOINTMENTS: "ish_appointments",
  USER_SESSION: "ish_session",
  CUSTOM_DOCTORS: "ish_custom_doctors",
  CUSTOM_PACKAGES: "ish_custom_packages",
  CUSTOM_FAQS: "ish_custom_faqs",
};

export class HospitalStore {
  // 1. Language
  static getLanguage(): Language {
    if (typeof window === "undefined") return "en";
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language | null;
    if (saved && ["en", "ta", "hi", "ml", "te", "kn"].includes(saved)) return saved;
    return "en";
  }

  static setLanguage(lang: Language): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    window.dispatchEvent(new Event("ish_language_change"));
  }

  // 2. Accessibility
  static getA11ySettings(): { highContrast: boolean; largeFont: boolean; reducedMotion: boolean } {
    if (typeof window === "undefined") {
      return { highContrast: false, largeFont: false, reducedMotion: false };
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACCESSIBILITY);
      return saved ? JSON.parse(saved) : { highContrast: false, largeFont: false, reducedMotion: false };
    } catch {
      return { highContrast: false, largeFont: false, reducedMotion: false };
    }
  }

  static setA11ySettings(settings: { highContrast: boolean; largeFont: boolean; reducedMotion: boolean }): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.ACCESSIBILITY, JSON.stringify(settings));
    window.dispatchEvent(new Event("ish_a11y_change"));
  }

  // 3. Appointments
  static getAppointments(): StoredAppointment[] {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  static saveAppointment(appointment: StoredAppointment): void {
    if (typeof window === "undefined") return;
    const current = this.getAppointments();
    // Prepend new appointment
    const updated = [appointment, ...current.filter((a) => a.id !== appointment.id)];
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
    window.dispatchEvent(new Event("ish_appointments_change"));
  }

  static cancelAppointment(id: string): boolean {
    if (typeof window === "undefined") return false;
    const current = this.getAppointments();
    const updated = current.map((a) => (a.id === id ? { ...a, status: "cancelled" as const } : a));
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
    window.dispatchEvent(new Event("ish_appointments_change"));
    return true;
  }

  static rescheduleAppointment(id: string, newDate: string, newSlot: string): boolean {
    if (typeof window === "undefined") return false;
    const current = this.getAppointments();
    const updated = current.map((a) =>
      a.id === id ? { ...a, date: newDate, timeSlot: newSlot, status: "confirmed" as const } : a
    );
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
    window.dispatchEvent(new Event("ish_appointments_change"));
    return true;
  }

  // 4. Session
  static getSession(): UserSession | null {
    if (typeof window === "undefined") return null;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
      if (saved) return JSON.parse(saved);

      // Fallback: Reconstitute session from cookies if browser cleared localStorage
      const cookies = document.cookie.split(";").reduce((acc, c) => {
        const [k, v] = c.trim().split("=");
        if (k && v) {
          try {
            acc[k] = decodeURIComponent(v);
          } catch {
            acc[k] = v;
          }
        }
        return acc;
      }, {} as Record<string, string>);

      if (cookies["ish_auth_user"]) {
        try {
          const userObj = JSON.parse(cookies["ish_auth_user"]);
          if (userObj && userObj.role) {
            localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(userObj));
            return userObj;
          }
        } catch {}
      }

      if (cookies["ish_auth_role"]) {
        const role = cookies["ish_auth_role"].toUpperCase();
        const roleName = role === "DOCTOR" ? "Dr. Rajesh Rangaswamy" : role === "PATIENT" ? "Patient" : "Administrator";
        const session: UserSession = {
          id: `usr-${role.toLowerCase()}`,
          name: roleName,
          email: `${role.toLowerCase()}@indostates.com`,
          role: role as any,
        };
        localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(session));
        return session;
      }

      return null;
    } catch {
      return null;
    }
  }

  static setSession(session: UserSession | null): void {
    if (typeof window === "undefined") return;
    if (session) {
      localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(session));
      const maxAge = 60 * 60 * 24 * 7;
      document.cookie = `ish_auth_role=${encodeURIComponent(session.role.toUpperCase())}; path=/; max-age=${maxAge}; SameSite=Lax`;
      document.cookie = `ish_auth_user=${encodeURIComponent(JSON.stringify(session))}; path=/; max-age=${maxAge}; SameSite=Lax`;
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
      document.cookie = "ish_auth_role=; path=/; max-age=0; SameSite=Lax";
      document.cookie = "ish_auth_user=; path=/; max-age=0; SameSite=Lax";
      try {
        fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
      } catch {}
    }
    window.dispatchEvent(new Event("ish_session_change"));
  }

  static getCurrentSession(): UserSession | null {
    return this.getSession();
  }

  static clearSession(): void {
    this.setSession(null);
  }

  static async logout(): Promise<void> {
    this.setSession(null);
    if (typeof window !== "undefined") {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch {}
    }
  }

  // 5. Dynamic Data Providers (with initial seed from hospitalData)
  static getAllDoctors(): Doctor[] {
    if (typeof window === "undefined") return DOCTORS;
    try {
      const custom = localStorage.getItem(STORAGE_KEYS.CUSTOM_DOCTORS);
      return custom ? JSON.parse(custom) : DOCTORS;
    } catch {
      return DOCTORS;
    }
  }

  static saveDoctor(doctor: Doctor): void {
    if (typeof window === "undefined") return;
    const doctors = this.getAllDoctors();
    const index = doctors.findIndex((d) => d.id === doctor.id);
    let updated: Doctor[];
    if (index >= 0) {
      updated = [...doctors];
      updated[index] = doctor;
    } else {
      updated = [doctor, ...doctors];
    }
    localStorage.setItem(STORAGE_KEYS.CUSTOM_DOCTORS, JSON.stringify(updated));
    window.dispatchEvent(new Event("ish_doctors_change"));
  }

  static getAllPackages(): HealthPackage[] {
    if (typeof window === "undefined") return HEALTH_PACKAGES;
    try {
      const custom = localStorage.getItem(STORAGE_KEYS.CUSTOM_PACKAGES);
      return custom ? JSON.parse(custom) : HEALTH_PACKAGES;
    } catch {
      return HEALTH_PACKAGES;
    }
  }

  static savePackage(pkg: HealthPackage): void {
    if (typeof window === "undefined") return;
    const packages = this.getAllPackages();
    const index = packages.findIndex((p) => p.id === pkg.id);
    let updated: HealthPackage[];
    if (index >= 0) {
      updated = [...packages];
      updated[index] = pkg;
    } else {
      updated = [pkg, ...packages];
    }
    localStorage.setItem(STORAGE_KEYS.CUSTOM_PACKAGES, JSON.stringify(updated));
    window.dispatchEvent(new Event("ish_packages_change"));
  }

  static getAllFAQs(): FAQItem[] {
    if (typeof window === "undefined") return FAQS;
    try {
      const custom = localStorage.getItem(STORAGE_KEYS.CUSTOM_FAQS);
      return custom ? JSON.parse(custom) : FAQS;
    } catch {
      return FAQS;
    }
  }

  static saveFAQ(faq: FAQItem): void {
    if (typeof window === "undefined") return;
    const faqs = this.getAllFAQs();
    const index = faqs.findIndex((f) => f.id === faq.id);
    let updated: FAQItem[];
    if (index >= 0) {
      updated = [...faqs];
      updated[index] = faq;
    } else {
      updated = [faq, ...faqs];
    }
    localStorage.setItem(STORAGE_KEYS.CUSTOM_FAQS, JSON.stringify(updated));
    window.dispatchEvent(new Event("ish_faqs_change"));
  }
}
