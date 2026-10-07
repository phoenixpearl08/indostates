"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  MapPin,
  Building2,
  Navigation,
  Layers,
  ArrowRight,
  Accessibility,
  Info,
  Clock,
  Search,
  CheckCircle2,
} from "lucide-react";
import { HospitalStore } from "@/lib/store";

interface DepartmentLocation {
  id: string;
  name: string;
  floor: "Ground Floor" | "1st Floor" | "2nd Floor" | "3rd Floor";
  block: "Block A (Main)" | "Block B (OPD Wing)" | "Block C (Diagnostic)";
  roomNumber: string;
  directions: string[];
  wheelchairAccessible: boolean;
}

const LOCATIONS: DepartmentLocation[] = [
  {
    id: "loc-01",
    name: "Trauma, Resuscitation & Emergency Center",
    floor: "Ground Floor",
    block: "Block A (Main)",
    roomNumber: "Red & Yellow Bay",
    directions: [
      "Enter via the 24/7 dedicated Emergency Ambulance Ramp",
      "Immediate left through automated sliding hermetic doors",
      "Triage desk is directly facing the entrance",
    ],
    wheelchairAccessible: true,
  },
  {
    id: "loc-02",
    name: "Central OPD Registration & Billing Counters",
    floor: "Ground Floor",
    block: "Block A (Main)",
    roomNumber: "Counters 1 - 12",
    directions: [
      "Enter through the Main Hospital Atrium",
      "Walk straight 25 meters past the Helpdesk Information Kiosk",
      "Token kiosks and queues are located on the left atrium concourse",
    ],
    wheelchairAccessible: true,
  },
  {
    id: "loc-03",
    name: "Diagnostic Imaging (1.5T MRI & 128-Slice CT)",
    floor: "Ground Floor",
    block: "Block C (Diagnostic)",
    roomNumber: "Rooms 014 - 018",
    directions: [
      "From Main Atrium, follow the Blue Line on the floor towards Block C",
      "Pass the Blood Bank corridor",
      "MRI suite is Room 016 on the right side",
    ],
    wheelchairAccessible: true,
  },
  {
    id: "loc-04",
    name: "Neurovascular & Stroke OPD (Dr. Rajesh Rangaswamy)",
    floor: "2nd Floor",
    block: "Block A (Main)",
    roomNumber: "OPD Room 204",
    directions: [
      "From Main Atrium, take Elevator Bank A or Central Glass Escalator to 2nd Floor",
      "Turn right towards Neuro Sciences Pavilion",
      "Room 204 is the third consultation chamber on the left",
    ],
    wheelchairAccessible: true,
  },
  {
    id: "loc-05",
    name: "Interventional Cardiology OPD (Dr. Saravanan)",
    floor: "1st Floor",
    block: "Block B (OPD Wing)",
    roomNumber: "OPD Room 102",
    directions: [
      "Take Elevator Bank B to 1st Floor",
      "Follow Green Line to Heart & Vascular Sciences Pavilion",
      "Consultation Room 102 is adjacent to ECG / ECHO Lab 1",
    ],
    wheelchairAccessible: true,
  },
  {
    id: "loc-06",
    name: "Central 24/7 Pharmacy Counter",
    floor: "Ground Floor",
    block: "Block B (OPD Wing)",
    roomNumber: "Counters 1 - 6",
    directions: [
      "Located directly opposite the OPD exit",
      "Follow the Orange signage for Pharmacy Dispensing",
      "Dedicated senior citizen counter at Counter #1",
    ],
    wheelchairAccessible: true,
  },
];

export default function PatientNavigationPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<string>("All Floors");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLocation, setActiveLocation] = useState<DepartmentLocation>(LOCATIONS[3]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const floors = ["All Floors", "Ground Floor", "1st Floor", "2nd Floor", "3rd Floor"];

  const filteredLocations = LOCATIONS.filter((l) => {
    const matchesFloor = selectedFloor === "All Floors" || l.floor === selectedFloor;
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.block.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFloor && matchesSearch;
  });

  if (!isMounted) return null;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-blue-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-400/20 border border-sky-400/30 text-sky-200 text-xs font-semibold mb-3">
              <Compass className="w-3.5 h-3.5" /> Indoor Hospital Wayfinding
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Hospital Navigation &amp; Campus Map</h1>
            <p className="text-sky-100/90 text-sm mt-1 max-w-2xl leading-relaxed">
              Find OPD chambers, blood sample collection rooms, advanced imaging scanners, elevators, and pharmacy counters with step-by-step turn directions.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-xs shrink-0">
            <Accessibility className="w-4 h-4 text-sky-300" />
            <span>100% Wheelchair Accessible • Braille Lifts</span>
          </div>
        </div>
      </div>

      {/* Main Layout: Directory & Step-by-Step Wayfinder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Department Search & Floor Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search department, room or doctor..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Floor Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {floors.map((fl) => (
                <button
                  key={fl}
                  onClick={() => setSelectedFloor(fl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    selectedFloor === fl
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {fl}
                </button>
              ))}
            </div>
          </div>

          {/* List of Locations */}
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {filteredLocations.map((loc) => (
              <div
                key={loc.id}
                onClick={() => setActiveLocation(loc)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  activeLocation.id === loc.id
                    ? "bg-sky-50/60 border-sky-400 ring-1 ring-sky-300 shadow-sm"
                    : "bg-white border-slate-200/80 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-xs text-slate-900">{loc.name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 font-mono shrink-0">
                    {loc.roomNumber}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                  <span className="font-medium text-sky-700">{loc.floor}</span> • <span>{loc.block}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Interactive Route Card & Visual Guide (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-sky-600 tracking-wider">
                  Target Destination
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">{activeLocation.name}</h2>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="font-semibold text-slate-800">{activeLocation.block}</span> •{" "}
                  <span className="font-semibold text-sky-700">{activeLocation.floor}</span> •{" "}
                  <span className="font-mono font-bold text-slate-700">{activeLocation.roomNumber}</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                <Navigation className="w-6 h-6" />
              </div>
            </div>

            {/* Turn-by-Turn Wayfinding Steps */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-900 block uppercase tracking-wide">
                Step-by-Step Directions from Main Entrance:
              </span>
              <div className="space-y-3">
                {activeLocation.directions.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium pt-0.5">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Campus Map Visual Placeholder Blueprint */}
            <div className="p-6 rounded-2xl bg-slate-950 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between text-xs text-sky-300 font-mono">
                  <span>CAMPUS MAP 2D GRID • {activeLocation.floor.toUpperCase()}</span>
                  <span>{activeLocation.roomNumber}</span>
                </div>
                <div className="h-32 border border-sky-500/30 rounded-xl flex items-center justify-center p-4 text-center">
                  <div>
                    <MapPin className="w-8 h-8 text-sky-400 mx-auto animate-bounce mb-1" />
                    <span className="text-xs font-bold text-white block">{activeLocation.name}</span>
                    <span className="text-[11px] text-sky-300 font-mono">{activeLocation.block}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
