"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Clock,
  MapPin,
  Stethoscope,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Search,
  Users,
} from "lucide-react";
import { DEPARTMENTS, DOCTORS } from "@/data/hospitalData";

export default function PatientDepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDepts = DEPARTMENTS.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.keyServices.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-hospital-600 bg-hospital-50 px-2.5 py-1 rounded-full border border-hospital-100">
            Clinical Centers of Excellence
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display mt-2">
            Hospital Departments &amp; Specialties
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Multidisciplinary medical wings staffed with dedicated consultants, state-of-the-art diagnostic suites, and OPD units.
          </p>
        </div>

        <Link
          href="/book-appointment"
          className="px-5 py-2.5 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white font-bold text-xs transition flex items-center gap-2 shadow-sm"
        >
          <Building2 className="w-4 h-4" />
          <span>Book Consultation</span>
        </Link>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search departments or clinical services (e.g. Stroke, Joint, Maternity)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none bg-slate-50/50"
          />
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDepts.map((dept) => {
          const deptDoctors = DOCTORS.filter((doc) => doc.departmentId === dept.id);

          return (
            <div
              key={dept.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 hover:shadow-card hover:border-hospital-300 transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-hospital-700 bg-hospital-50 px-2.5 py-0.5 rounded-full border border-hospital-100 uppercase tracking-wider">
                      Center of Excellence
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 font-display mt-1.5">
                      {dept.name}
                    </h3>
                    <p className="text-xs font-semibold text-hospital-800 mt-0.5">{dept.tagline}</p>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-hospital-100/70 text-hospital-700 flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {dept.shortDescription}
                </p>

                {/* Key Services */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Core Clinical Services
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {dept.keyServices.slice(0, 4).map((service, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg"
                      >
                        ✓ {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Working hours & Location */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-hospital-600 shrink-0" />
                    <span>08:00 AM - 08:00 PM (24/7 Trauma)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-hospital-600 shrink-0" />
                    <span>Level 1 &amp; 2, Main Hospital Block</span>
                  </div>
                </div>

                {/* Faculty count */}
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    <strong>{deptDoctors.length} Senior Specialist{deptDoctors.length !== 1 ? "s" : ""}</strong> on OPD schedule
                  </span>
                  {deptDoctors.length > 0 && (
                    <span className="text-slate-400">
                      (Lead: {deptDoctors[0].name})
                    </span>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <Link
                  href={`/patient/doctors?dept=${dept.id}`}
                  className="text-xs font-bold text-hospital-700 hover:underline"
                >
                  View Active Doctors &rarr;
                </Link>

                <Link
                  href={`/book-appointment?departmentId=${dept.id}`}
                  className="px-4 py-2 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
                >
                  <span>Book Consultation</span>
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
