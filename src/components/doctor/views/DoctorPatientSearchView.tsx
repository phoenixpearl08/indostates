"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  Phone,
  Calendar,
  AlertCircle,
  FileText,
  Stethoscope,
  ChevronRight,
  Clock,
  ShieldCheck,
  UserCheck,
  RefreshCw,
} from "lucide-react";
import { PatientDossier } from "@/lib/doctorService";
import { QueueEntry } from "@/types/hms";

interface DoctorPatientSearchViewProps {
  onOpenPatientProfile: (patientId: string) => void;
  onStartConsultationForPatient: (patient: QueueEntry) => void;
}

export function DoctorPatientSearchView({
  onOpenPatientProfile,
  onStartConsultationForPatient,
}: DoctorPatientSearchViewProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<PatientDossier[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial load: show recent patients seen by this doctor / OPD
  useEffect(() => {
    loadPatients("");
  }, []);

  const loadPatients = async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/doctor/patients?q=${encodeURIComponent(searchTerm)}`);
      if (!res.ok) throw new Error("Failed to search patients");
      const data = await res.json();
      setPatients(data.patients || []);
      setHasSearched(searchTerm.trim().length > 0);
    } catch (err: any) {
      console.error("Patient search error:", err);
      setError(err.message || "Failed to search patient records");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadPatients(query);
  };

  return (
    <div className="space-y-6">
      {/* Header & Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="max-w-2xl">
          <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
            <Search className="w-5 h-5 text-hospital-600" />
            Patient Records & Clinical Search
          </h2>
          <p className="text-xs text-slate-700 mt-1">
            Search authorized patients across your department by Patient Name, UHID, Phone number, or Registration ID.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by UHID (e.g. ISH-...), Patient Name, or Phone..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-hospital-500 focus:border-transparent transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-hospital-700 hover:bg-hospital-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-2xs transition-colors shrink-0"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-700 font-semibold px-1">
        <span>
          {hasSearched ? `Search Results (${patients.length})` : `Recent Department Patients (${patients.length})`}
        </span>
        <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          Authorized Clinical Access Only
        </span>
      </div>

      {/* Patients Grid */}
      {patients.length === 0 && !loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-600">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Patient Records Found</h3>
          <p className="text-xs text-slate-700 max-w-sm mx-auto mt-1">
            {hasSearched
              ? `No patient matched query "${query}". Try searching by complete UHID or full mobile number.`
              : "No recent patients registered under this department yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((p) => {
            const hasActiveQueue = !!p.activeQueueToken;
            return (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-slate-200/80 p-4 hover:border-hospital-300 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-hospital-50 border border-hospital-100 flex items-center justify-center font-bold text-hospital-700 text-sm">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 leading-tight">
                          {p.name}
                        </h4>
                        <span className="font-mono text-[11px] font-bold text-hospital-700 bg-hospital-50 px-1.5 py-0.5 rounded border border-hospital-100 mt-1 inline-block">
                          {p.uhid}
                        </span>
                      </div>
                    </div>

                    {hasActiveQueue ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" />
                        Queue #{p.activeQueueToken?.tokenNumber}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 shrink-0">
                        {p.gender}, {p.age}y
                      </span>
                    )}
                  </div>

                  {/* Details grid */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Demographics:</span>
                      <span className="font-medium text-slate-800">
                        {p.gender} • {p.age} Years • Blood: {p.bloodGroup || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Contact:</span>
                      <span className="font-medium text-slate-800 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-600" />
                        {p.phone || "Not recorded"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Last Encounter:</span>
                      <span className="font-medium text-slate-800">
                        {p.lastVisitDate ? new Date(p.lastVisitDate).toLocaleDateString() : "First Visit"}
                      </span>
                    </div>

                    {p.allergies && p.allergies.length > 0 && (
                      <div className="pt-1">
                        <div className="text-[11px] text-rose-600 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>Allergies: {p.allergies.join(", ")}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onOpenPatientProfile(p.id)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-600" />
                    <span>Clinical Profile</span>
                  </button>

                  {hasActiveQueue ? (
                    <button
                      onClick={() => onStartConsultationForPatient(p.activeQueueToken!)}
                      className="py-1.5 px-3 rounded-lg bg-hospital-700 hover:bg-hospital-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors shrink-0"
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>Consult</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenPatientProfile(p.id)}
                      className="py-1.5 px-2 rounded-lg text-slate-600 hover:text-hospital-600 hover:bg-hospital-50 transition-colors"
                      title="View Medical Records"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
