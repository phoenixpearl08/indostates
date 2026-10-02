import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Scan,
  Zap,
  Activity,
  UserCheck,
  FlaskConical,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Phone,
  Home,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HOSPITAL_INFO } from "@/data/hospitalData";

export const metadata: Metadata = {
  title: "Hospital Facilities & Diagnostic Infrastructure | Indo States Health",
  description:
    "Explore state-of-the-art medical facilities at Indo States Health, Arasur, Coimbatore: 1.5T MRI suite, 128-slice CT room, automated laboratory, 3D mammography, and 24/7 emergency bay.",
};

export default function FacilitiesPage() {
  const facilities = [
    {
      id: "mri-suite",
      name: "1.5 Tesla High-Field MRI Suite",
      category: "Diagnostic Imaging",
      tagline: "Dedicated neurovascular and musculoskeletal imaging room",
      icon: Scan,
      description:
        "Equipped with wide-bore geometry to reduce patient claustrophobia, our 1.5T MRI suite features dedicated high-density matrix coils for intracranial, spine, and cranial nerve imaging with zero ionizing radiation.",
      specs: [
        "1.5 Tesla High-Field Magnet",
        "Dedicated Multi-Channel Matrix Coils",
        "Fast Stroke DWI Protocols (<3 Minutes)",
        "Zero Ionizing Radiation Exposure",
      ],
      link: "/diagnostic-center/mri",
      actionText: "View MRI Protocols",
    },
    {
      id: "ct-suite",
      name: "128-Slice Volumetric CT Suite",
      category: "Cardiac & Cross-Sectional Imaging",
      tagline: "Sub-second coronary calcium scoring and low-dose scans",
      icon: Zap,
      description:
        "Sub-millimeter volumetric CT capable of capturing beating coronary arteries in a fraction of a heartbeat. Iterative reconstruction technology cuts radiation exposure by up to 80% compared to legacy scanners.",
      specs: [
        "128-Slice Sub-Second Rotation",
        "Low-Dose ASiR-V Reconstruction",
        "Non-Invasive Agatston Calcium Score",
        "Virtual CT Colonography Capability",
      ],
      link: "/diagnostic-center/ct",
      actionText: "View CT Specifications",
    },
    {
      id: "central-lab",
      name: "Central Automated Clinical Laboratory",
      category: "Pathology & Biochemistry",
      tagline: "High-throughput robotic analyzers and molecular diagnostics",
      icon: FlaskConical,
      description:
        "Hospital-grade automated laboratory operating strict internal and external quality control cycles. Direct physician access ensures same-day diagnostic turnaround for critical panels and tumor markers.",
      specs: [
        "Bi-Directional Barcoded Sample Tracking",
        "Tumor Markers: Serum PSA & CA-125",
        "5-Part Differential Hematology Analyzers",
        "4 to 8 Hour Digital Report Archival",
      ],
      link: "/diagnostic-center/laboratory",
      actionText: "Explore Laboratory Panels",
    },
    {
      id: "mammography-suite",
      name: "3D Full-Field Digital Mammography Suite",
      category: "Women's Wellness",
      tagline: "Ergonomic comfort paddles and high-resolution breast screening",
      icon: UserCheck,
      description:
        "Designed for gentle, private breast cancer detection. Our digital mammography system visualizes subtle microcalcifications smaller than 0.1mm, accompanied by dedicated private consultation rooms.",
      specs: [
        "Full-Field Digital Sensor System",
        "Ergonomic Low-Pressure Compression",
        "Complete Lady Radiographer Team",
        "Microcalcification Detection Algorithm",
      ],
      link: "/diagnostic-center/mammography",
      actionText: "Mammography Details",
    },
    {
      id: "dexa-suite",
      name: "Lunar DEXA Bone Densitometry Suite",
      category: "Bone & Body Composition",
      tagline: "Gold-standard osteoporosis screening and FRAX risk calculation",
      icon: Activity,
      description:
        "The Lunar fan-beam DEXA unit measures precise bone mineral density across the femoral neck, spine, and forearm. Crucial for menopausal women, seniors, and long-term steroid users.",
      specs: [
        "Fan-Beam Dual-Energy X-Ray Absorptiometry",
        "Total Body Fat & Muscle Composition",
        "10-Year FRAX Fracture Probability",
        "10-Minute Comfortable Non-Invasive Scan",
      ],
      link: "/diagnostic-center/dexa",
      actionText: "View DEXA Bone Scan",
    },
    {
      id: "emergency-bay",
      name: "24/7 Ground-Floor Emergency & Trauma Bay",
      category: "Acute Emergency Care",
      tagline: "Barrier-free highway ambulance drop-off off NH 544",
      icon: AlertCircle,
      description:
        "Directly connected to the ground-floor diagnostic imaging corridor. Acute stroke and chest pain patients are moved directly onto imaging tables without stairs or delay.",
      specs: [
        "Direct Highway Corridor Drop-Off",
        "Dedicated Code Stroke Resuscitation Bed",
        "Advanced Cardiac Life Support (ACLS) Ready",
        "Direct Line: 0422-2111000",
      ],
      link: "/emergency",
      actionText: "Emergency Protocols",
    },
    {
      id: "home-phlebotomy-hub",
      name: "Home Sample Collection Dispatch Center",
      category: "Preventive Outreach",
      tagline: "Zero-cost doorstep blood collection across Coimbatore",
      icon: Home,
      description:
        "Certified hospital phlebotomists equipped with temperature-controlled cold-chain transport boxes visit patient residences for fasting blood draws, saving travel time for seniors.",
      specs: [
        "Zero Surcharge within Coimbatore Limits",
        "Pre-Scheduled Morning Fasting Slots",
        "Cold-Chain Bio-Specimen Preservation",
        "Automated Barcoded Sample Handover",
      ],
      link: "/preventive-health",
      actionText: "Learn About Home Collection",
    },
    {
      id: "reception-billing",
      name: "Computerized Patient Relations & Billing Desk",
      category: "Hospital Administration",
      tagline: "Upfront pricing, insurance assistance, and instant digital check-in",
      icon: CreditCard,
      description:
        "Warm, patient-first reception lounge with barcode/QR appointment scanners for zero-wait registration, transparent diagnostic pricing, and computerized reimbursement bills.",
      specs: [
        "QR Code Digital Pass Scanner",
        "Transparent Itemized Billing",
        "Health Insurance Reimbursement Desk",
        "Multi-Lingual Patient Service Officers",
      ],
      link: "/patient-info",
      actionText: "Visitor & Billing Guide",
    },
  ];

  return (
    <div className="bg-slate-50/60 min-h-screen pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-hospital-950 via-hospital-900 to-hospital-800 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hospital-800/80 border border-hospital-700/80 text-hospital-200 text-xs font-semibold tracking-wide uppercase mb-4">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            Infrastructure & Clinical Environments
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display mb-4 text-white">
            Hospital Facilities & Technology
          </h1>
          <p className="text-base sm:text-lg text-hospital-200 max-w-2xl mx-auto leading-relaxed">
            Engineered to American clinical standards in Arasur, Coimbatore. High-resolution cross-sectional imaging, automated laboratories, and barrier-free acute emergency care.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/book-appointment">
              <Button variant="secondary" size="lg">
                Schedule a Visit or Scan
              </Button>
            </Link>
            <Link href="/find-us">
              <Button variant="outline" size="lg" className="border-hospital-700 text-white hover:bg-hospital-800">
                Directions & Facility Map
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {facilities.map((facility) => {
            const IconComponent = facility.icon;
            return (
              <div
                key={facility.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-hospital-700 bg-hospital-50 px-2.5 py-0.5 rounded-full">
                      {facility.category}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 text-hospital-700 group-hover:bg-hospital-900 group-hover:text-white flex items-center justify-center transition duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 font-display mb-1 group-hover:text-hospital-700 transition">
                    <Link href={facility.link}>{facility.name}</Link>
                  </h2>
                  <p className="text-xs font-semibold text-cyan-700 mb-3">{facility.tagline}</p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {facility.description}
                  </p>

                  <div className="mb-6">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                      Technical Highlights & Capabilities
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {facility.specs.map((spec, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-1.5 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <Link href={facility.link}>
                    <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      {facility.actionText}
                    </Button>
                  </Link>
                  <Link href="/book-appointment">
                    <Button variant="primary" size="sm">
                      Book Facility
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Safety & Radiation Assurance */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center">
        <div className="bg-hospital-900 text-white rounded-3xl p-8 shadow-xl">
          <ShieldCheck className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
          <h2 className="text-2xl font-bold font-display mb-2">AERB Compliant & Patient-Centric</h2>
          <p className="text-xs text-hospital-200 leading-relaxed max-w-2xl mx-auto mb-6">
            All diagnostic suites adhere to Atomic Energy Regulatory Board (AERB) radiation shielding standards. Our imaging protocols prioritize ALARA (As Low As Reasonably Achievable) radiation principles, under the direct supervision of US dual board-certified neuroradiologist Dr. Rajesh Rangaswamy.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/book-appointment">
              <Button variant="secondary" size="md">
                Schedule Diagnostic Visit
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="md" className="border-hospital-700 text-white hover:bg-hospital-800">
                Facility Inquiries
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
