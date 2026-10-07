"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Award,
  Video,
  UserCheck,
  CheckCircle2,
  ChevronRight,
  Stethoscope,
  Building2,
} from "lucide-react";
import { DOCTORS, DEPARTMENTS, Doctor } from "@/data/hospitalData";
import { DoctorAvatar } from "@/components/ui/DoctorAvatar";

export default function PatientDoctorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [consultType, setConsultType] = useState<"all" | "in_person" | "video">("all");

  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter((doc) => {
      const matchSearch =
        searchQuery.trim() === "" ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.qualifications.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDept = selectedDept === "all" || doc.departmentId === selectedDept;

      const matchLang =
        selectedLanguage === "all" ||
        (doc.languages && doc.languages.some((l) => l.toLowerCase() === selectedLanguage.toLowerCase()));

      return matchSearch && matchDept && matchLang;
    });
  }, [searchQuery, selectedDept, selectedLanguage, consultType]);

  const allLanguages = useMemo(() => {
    const set = new Set<string>();
    DOCTORS.forEach((d) => d.languages?.forEach((l) => set.add(l)));
    return Array.from(set);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-hospital-600 bg-hospital-50 px-2.5 py-1 rounded-full border border-hospital-100">
            Specialist Directory
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display mt-2">
            Find an IndoStates Specialist
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Discover board-certified clinicians, sub-specialists, and surgical leaders across departments.
          </p>
        </div>

        <Link
          href="/book-appointment"
          className="px-5 py-2.5 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white font-bold text-xs transition flex items-center gap-2 shadow-sm"
        >
          <Calendar className="w-4 h-4" />
          <span>Quick Book OPD</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Text Search */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by doctor name, specialty, or qualifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none bg-slate-50/50"
            />
          </div>

          {/* Department Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none bg-white font-medium text-slate-700"
            >
              <option value="all">All Clinical Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div className="sm:col-span-2">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none bg-white font-medium text-slate-700"
            >
              <option value="all">All Languages</option>
              {allLanguages.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          <div className="sm:col-span-2 flex items-center justify-end">
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedDept("all");
                setSelectedLanguage("all");
                setConsultType("all");
              }}
              className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition text-center"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Consultation Type Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs font-semibold">
          <span className="text-slate-400 text-[11px] mr-1">Consultation Mode:</span>
          <button
            type="button"
            onClick={() => setConsultType("all")}
            className={`px-3 py-1 rounded-lg transition ${
              consultType === "all"
                ? "bg-hospital-700 text-white font-bold"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Modes
          </button>
          <button
            type="button"
            onClick={() => setConsultType("in_person")}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1 ${
              consultType === "in_person"
                ? "bg-hospital-700 text-white font-bold"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>In-Person OPD</span>
          </button>
          <button
            type="button"
            onClick={() => setConsultType("video")}
            className={`px-3 py-1 rounded-lg transition flex items-center gap-1 ${
              consultType === "video"
                ? "bg-hospital-700 text-white font-bold"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Tele-Video Consult</span>
          </button>

          <span className="ml-auto text-[11px] text-slate-400 font-mono">
            Showing {filteredDoctors.length} verified physicians
          </span>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredDoctors.map((doc) => {
          const dept = DEPARTMENTS.find((d) => d.id === doc.departmentId);

          return (
            <div
              key={doc.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 hover:shadow-card hover:border-hospital-300 transition-all space-y-4 flex flex-col justify-between"
            >
              {/* Doctor Head */}
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <DoctorAvatar
                    name={doc.name}
                    specialization={doc.specialization}
                    avatarUrl={doc.avatarUrl}
                    className="w-16 h-16 rounded-2xl shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-hospital-700 bg-hospital-50 px-2 py-0.5 rounded-md inline-block uppercase">
                      {dept?.name || "Specialist"}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base mt-1 truncate">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">{doc.specialization}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{doc.qualifications}</p>
                  </div>
                </div>

                {/* Experience & OPD Info */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Award className="w-3.5 h-3.5 text-hospital-600 shrink-0" />
                    <span><strong>{doc.experienceYears}+ Yrs</strong> Experience</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-hospital-600 shrink-0" />
                    <span>Room {doc.opdRoom || "102"} OPD Block</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 col-span-2">
                    <Clock className="w-3.5 h-3.5 text-hospital-600 shrink-0" />
                    <span>{doc.timing || "09:00 AM - 05:00 PM"} ({doc.availableDays.join(", ")})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 col-span-2 text-[11px]">
                    <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Speaks: {doc.languages.join(", ")}</span>
                  </div>
                </div>

                {/* Bio snippet */}
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {doc.biography}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Slots Open This Week</span>
                </span>

                <Link
                  href={`/book-appointment?doctorId=${doc.id}`}
                  className="px-4 py-2 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
                >
                  <span>Book Appointment</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
