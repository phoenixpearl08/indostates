import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { HOSPITAL_INFO } from "@/data/hospitalData";
import { MapPin, Navigation, Compass, Plane, Car, Bus, Phone, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Find Us & Directions | Indo States Health Arasur Coimbatore",
  description:
    "Directions, map location, and transit guide for Indo States Health in Arasur, Coimbatore on NH 544 Salem-Kochi Highway corridor near A2B. 15 mins from Coimbatore Airport.",
};

export default function FindUsPage() {
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${HOSPITAL_INFO.coordinates.lat},${HOSPITAL_INFO.coordinates.lng}`;
  const embedMapsUrl = `https://maps.google.com/maps?q=${HOSPITAL_INFO.coordinates.lat},${HOSPITAL_INFO.coordinates.lng}&hl=en&z=15&output=embed`;

  return (
    <div className="bg-slate-50/60 min-h-screen pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-hospital-950 via-hospital-900 to-hospital-800 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hospital-800/80 border border-hospital-700/80 text-hospital-200 text-xs font-semibold tracking-wide uppercase mb-4">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            Transit & Wayfinding
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display mb-4 text-white">
            Find Us / Directions
          </h1>
          <p className="text-base sm:text-lg text-hospital-200 max-w-2xl mx-auto leading-relaxed">
            Conveniently situated along the Salem-Kochi Highway (NH 544) in Arasur, Coimbatore.
          </p>
          <div className="mt-8">
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="lg" leftIcon={<Navigation className="w-4 h-4" />}>
                Open Live GPS Navigation
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Main Map & Transit Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Address & Landmark Info */}
            <div className="p-8 lg:border-r border-slate-200 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full uppercase mb-4">
                  <MapPin className="w-3.5 h-3.5" />
                  Primary Facility
                </div>
                <h2 className="text-2xl font-bold text-slate-900 font-display mb-3">
                  {HOSPITAL_INFO.name}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {HOSPITAL_INFO.address}
                </p>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 mb-6 space-y-1.5">
                  <div><strong>Key Landmark:</strong> {HOSPITAL_INFO.landmark}</div>
                  <div><strong>GPS Coordinates:</strong> {HOSPITAL_INFO.coordinates.lat} N, {HOSPITAL_INFO.coordinates.lng} E</div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <a
                  href={`tel:${HOSPITAL_INFO.primaryPhoneRaw}`}
                  className="flex items-center gap-2 text-xs font-semibold text-hospital-800 hover:underline"
                >
                  <Phone className="w-4 h-4 text-hospital-600" />
                  Desk: {HOSPITAL_INFO.primaryPhone}
                </a>
                <a
                  href={`tel:${HOSPITAL_INFO.emergencyPhone}`}
                  className="flex items-center gap-2 text-xs font-bold text-rose-600 hover:underline"
                >
                  <Phone className="w-4 h-4 text-rose-600" />
                  Emergency: {HOSPITAL_INFO.emergencyPhone}
                </a>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="lg:col-span-2 min-h-[380px] bg-slate-100 relative">
              <iframe
                title="Indo States Health Location Map"
                src={embedMapsUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "380px" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Transportation Modalities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4">
              <Car className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">By Road / Car</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-2">
              Directly accessible from National Highway 544 (Salem-Kochi Highway). Ample, dedicated on-site patient parking with barrier-free wheelchair ramps.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-hospital-50 text-hospital-600 flex items-center justify-center mb-4">
              <Plane className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">From Airport (CJB)</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-2">
              Coimbatore International Airport is approximately 12 km (15-20 minutes by cab) along the Avinashi Road and NH 544 corridor.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Bus className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">By Public Transit</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-2">
              Buses running along the Coimbatore-Tirupur / Salem corridor stop at Arasur bus stop, within a short 5-minute walk or auto-rickshaw connection.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
