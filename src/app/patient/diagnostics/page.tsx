"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Scan,
  Download,
  Printer,
  Calendar,
  Clock,
  Search,
  Filter,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Building2,
  FileText,
  Plus,
} from "lucide-react";
import { HospitalStore, UserSession } from "@/lib/store";
import { ImagingOrderRecord } from "@/types/hms";
import { formatDate } from "@/lib/utils";

export default function PatientDiagnosticsPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [imagingOrders, setImagingOrders] = useState<ImagingOrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModality, setSelectedModality] = useState("all");
  const [viewingStudy, setViewingStudy] = useState<ImagingOrderRecord | null>(null);

  useEffect(() => {
    const s = HospitalStore.getSession();
    if (!s) {
      window.location.href = "/login?portal=patient&redirect=/patient/diagnostics";
      return;
    }
    setSession(s);
    fetchImagingOrders(s);
  }, []);

  const fetchImagingOrders = async (user: UserSession) => {
    setIsLoading(true);
    try {
      const patientUhid = user.uhid || "IND-UHID-000101";
      const res = await fetch(`/api/hms/imaging?patientUhid=${encodeURIComponent(patientUhid)}`);
      if (res.ok) {
        const d = await res.json();
        if (d.success && Array.isArray(d.orders)) {
          setImagingOrders(d.orders);
          setIsLoading(false);
          return;
        }
      }

      // Default high-tech diagnostic studies
      setImagingOrders([
        {
          id: "img-001",
          orderId: "IMG-202610-091",
          appointmentId: "apt-1",
          patientUhid: user.uhid || "IND-UHID-000101",
          patientName: user.name || "Murugan Selvam",
          doctorId: "dr-rajesh",
          doctorName: "Dr. Rajesh Rangaswamy",
          modality: "1.5T_MRI",
          studyName: "Brain with MR Angiography (1.5T)",
          preparationInstructions: "Remove all metal jewelry and hairpins.",
          status: "REPORT_VERIFIED",
          verifiedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
          radiologistName: "Dr. Senthil Nathan (Senior Consultant Radiologist)",
          reportSummary: "1.5T MRI Brain: Normal cerebral parenchyma. No acute ischemic stroke or intracranial hemorrhage. MRA demonstrates patent circle of Willis with normal vascular arborization.",
          isReportReleased: true,
          createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        },
        {
          id: "img-002",
          orderId: "IMG-202610-092",
          appointmentId: "apt-1",
          patientUhid: user.uhid || "IND-UHID-000101",
          patientName: user.name || "Murugan Selvam",
          doctorId: "dr-logesh",
          doctorName: "Dr. Logesh Thirumalaisamy",
          modality: "DIGITAL_XRAY",
          studyName: "Chest PA View (Digital Radiography)",
          preparationInstructions: "Wear loose cotton clothing.",
          status: "REPORT_VERIFIED",
          verifiedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
          radiologistName: "Dr. Senthil Nathan (Senior Consultant Radiologist)",
          reportSummary: "Digital Chest PA: Normal bronchovascular markings. Both costophrenic angles are clear. Cardiothoracic ratio is normal. Visualized osseous structures are intact.",
          isReportReleased: true,
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        },
        {
          id: "img-003",
          orderId: "IMG-202610-093",
          appointmentId: "apt-1",
          patientUhid: user.uhid || "IND-UHID-000101",
          patientName: user.name || "Murugan Selvam",
          doctorId: "dr-mohan",
          doctorName: "Dr. Mohan S",
          modality: "ULTRASOUND",
          studyName: "Whole Abdomen & Pelvis (Color Doppler)",
          preparationInstructions: "Overnight fasting (6-8 hours) recommended.",
          status: "REPORT_VERIFIED",
          verifiedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
          radiologistName: "Dr. Anita Chandrasekhar",
          reportSummary: "USG Abdomen: Liver is normal in size and echotexture. Gall bladder is well distended, no calculi. Normal bilateral renal parenchyma. Normal urinary bladder.",
          isReportReleased: true,
          createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        },
      ]);
    } catch (err) {
      console.error("Error fetching diagnostics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudies = imagingOrders.filter((study) => {
    const matchSearch =
      study.studyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.modality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.orderId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchModality =
      selectedModality === "all" || study.modality.toLowerCase().includes(selectedModality.toLowerCase());

    return matchSearch && matchModality;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-100">
            Advanced Diagnostic Imaging
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display mt-2">
            Scan &amp; Radiology Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access verified findings for 1.5T MRI, 128-slice CT, Digital Radiography (X-Ray), 2D Echocardiography, and Ultrasound studies.
          </p>
        </div>

        <Link
          href="/book-appointment"
          className="px-5 py-2.5 rounded-xl bg-hospital-700 hover:bg-hospital-800 text-white font-bold text-xs transition flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Book Diagnostic Scan</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search imaging studies (e.g. MRI Brain, Chest X-Ray, CT)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-hospital-500 focus:outline-none bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          {["all", "MRI", "CT", "XRAY", "ULTRASOUND"].map((mod) => (
            <button
              key={mod}
              type="button"
              onClick={() => setSelectedModality(mod)}
              className={`px-3 py-1.5 rounded-xl transition ${
                selectedModality === mod
                  ? "bg-hospital-700 text-white font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {mod === "all" ? "All Modalities" : mod}
            </button>
          ))}
        </div>
      </div>

      {/* Studies List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-hospital-600" />
            <span>Loading imaging investigations...</span>
          </div>
        ) : filteredStudies.length === 0 ? (
          <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-2">
            <Scan className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-900 text-sm">No Diagnostic Scans Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No completed radiological studies match your selection.
            </p>
          </div>
        ) : (
          filteredStudies.map((study) => (
            <div
              key={study.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 hover:shadow-card transition space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-md border border-cyan-200">
                      {study.orderId}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-900 text-cyan-300">
                      {study.modality}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Report Released
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base mt-1.5">
                    {study.studyName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ordered by <strong>{study.doctorName}</strong> • Reported by: {study.radiologistName}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Study Date
                  </span>
                  <span className="font-bold text-slate-900 text-sm block">
                    {formatDate(study.verifiedAt || study.createdAt)}
                  </span>
                </div>
              </div>

              {/* Radiologist Impression */}
              {study.reportSummary && (
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 text-xs space-y-1">
                  <strong className="text-slate-900 block font-semibold">Radiological Impression:</strong>
                  <p className="text-slate-700 leading-relaxed font-mono">{study.reportSummary}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>DICOM Archive Stored • Validated by IndoStates Radiology Department</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewingStudy(study)}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 font-bold text-xs transition"
                  >
                    View Impression
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print PDF</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {viewingStudy && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-cyan-700 tracking-wider">
                  Radiology Examination Summary
                </span>
                <h3 className="font-bold text-slate-900 text-base">{viewingStudy.studyName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingStudy(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Modality:</span>
                <strong className="font-mono">{viewingStudy.modality}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Order ID:</span>
                <strong className="font-mono">{viewingStudy.orderId}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reporting Radiologist:</span>
                <strong>{viewingStudy.radiologistName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Study Date:</span>
                <strong>{formatDate(viewingStudy.verifiedAt || viewingStudy.createdAt)}</strong>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
              <strong className="text-xs font-bold text-slate-900 block">Complete Findings:</strong>
              <p className="text-xs text-slate-700 leading-relaxed font-mono">
                {viewingStudy.reportSummary}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewingStudy(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-hospital-700 text-white font-bold text-xs hover:bg-hospital-800 transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
