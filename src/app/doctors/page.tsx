"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { DOCTORS, DEPARTMENTS, Doctor } from "@/data/hospitalData";
import { HospitalStore } from "@/lib/store";
import { Search, Filter, Stethoscope, Calendar, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DoctorAvatar } from "@/components/ui/DoctorAvatar";

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");

  const allDoctors = useMemo(() => {
    return HospitalStore.getAllDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    return allDoctors.filter((doc) => {
      const matchSearch =
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.qualifications.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDept = selectedDept === "all" || doc.departmentId === selectedDept;
      return matchSearch && matchDept;
    });
  }, [allDoctors, searchTerm, selectedDept]);

  return (
    <div className="bg-slate-50/60 min-h-screen pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-hospital-950 via-hospital-900 to-hospital-800 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hospital-800/80 border border-hospital-700/80 text-hospital-200 text-xs font-semibold tracking-wide uppercase mb-4">
            <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
            Verified Medical Specialists
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display mb-4 text-white">
            Find Your Doctor
          </h1>
          <p className="text-base sm:text-lg text-hospital-200 max-w-2xl mx-auto leading-relaxed">
            Consult with leaders in neuroradiology, cardiology, emergency care, women’s health, and advanced pathology.
          </p>

          {/* Search Bar in Header */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by doctor name, specialty, or condition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 text-sm shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-slate-200"
            />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Department Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
          <button
            onClick={() => setSelectedDept("all")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedDept === "all"
                ? "bg-hospital-900 text-white shadow-md"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            All Specialties ({allDoctors.length})
          </button>
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedDept === dept.id
                  ? "bg-hospital-900 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {dept.name}
            </button>
          ))}
        </div>

        {/* Doctor Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => {
              const dept = DEPARTMENTS.find((d) => d.id === doc.departmentId);
              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="relative h-64 w-full bg-slate-900 overflow-hidden flex items-center justify-center p-4">
                    <DoctorAvatar
                      name={doc.name}
                      avatarUrl={doc.avatarUrl}
                      specialization={doc.specialization}
                      size="xl"
                      className="w-44 h-44 shadow-lg border-2 border-slate-700/60"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full bg-navy-950/80 backdrop-blur-sm text-[11px] font-semibold text-cyan-300 border border-cyan-500/40 shadow-sm flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-cyan-400" />
                        Verified Specialist
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-hospital-600 font-semibold mb-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{dept ? dept.name : "Specialist"}</span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 font-display mb-1 group-hover:text-hospital-700 transition">
                        <Link href={`/doctors/${doc.id}`}>{doc.name}</Link>
                      </h3>
                      <div className="text-xs font-mono font-medium text-slate-500 mb-2">{doc.qualifications}</div>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                        {doc.biography}
                      </p>

                      <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 space-y-1.5 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{doc.availableDays.join(", ")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{doc.timing}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                      <Link href={`/doctors/${doc.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          Profile
                        </Button>
                      </Link>
                      <Link href={`/book-appointment?doctorId=${doc.id}`} className="flex-1">
                        <Button variant="primary" size="sm" className="w-full text-xs">
                          Book Slot
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Stethoscope className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Doctors Match Your Search</h3>
            <p className="text-xs text-slate-500 mb-6">
              Try adjusting your specialty filter or search keywords.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedDept("all");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
