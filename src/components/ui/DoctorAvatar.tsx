"use client";

import React, { useState } from "react";
import Image from "next/image";

interface DoctorAvatarProps {
  name: string;
  avatarUrl?: string;
  specialization?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  priority?: boolean;
}

const SIZE_MAP = {
  sm: "w-10 h-10 text-xs",
  md: "w-16 h-16 text-base",
  lg: "w-24 h-24 text-xl",
  xl: "w-32 h-32 sm:w-40 sm:h-40 text-2xl",
};

const PIXEL_MAP = {
  sm: 40,
  md: 64,
  lg: 96,
  xl: 160,
};

export const DoctorAvatar: React.FC<DoctorAvatarProps> = ({
  name,
  avatarUrl,
  specialization,
  size = "md",
  className = "",
  priority = false,
}) => {
  const [hasError, setHasError] = useState(false);

  // Determine appropriate avatar path if missing or Unsplash stock photo
  const getAvatarPath = (): string => {
    if (avatarUrl && !avatarUrl.includes("unsplash.com") && !hasError) {
      return avatarUrl;
    }

    const n = name.toLowerCase();
    if (n.includes("rajesh")) return "/images/avatars/doctor-rajesh.svg";
    if (n.includes("logesh")) return "/images/avatars/doctor-logesh.svg";
    if (n.includes("vani")) return "/images/avatars/doctor-vani.svg";
    if (n.includes("v. mohan") || (n.includes("mohan") && !n.includes("vani"))) return "/images/avatars/doctor-mohan.svg";
    if (n.includes("sundaram") || n.includes("cardiac")) return "/images/avatars/doctor-sundaram.svg";
    if (n.includes("kavitha") || n.includes("radiology")) return "/images/avatars/doctor-kavitha.svg";
    if (n.includes("rajendran")) return "/images/avatars/doctor-rajendran.svg";
    if (n.includes("rangaswamy") && !n.includes("rajesh")) return "/images/avatars/leader-rangaswamy.svg";
    if (n.includes("vijayalakshmi")) return "/images/avatars/leader-vijayalakshmi.svg";
    if (n.includes("ayyappan")) return "/images/avatars/leader-ayyappan.svg";

    return "/images/avatars/doctor-fallback.svg";
  };

  const imageSrc = getAvatarPath();
  const dimension = PIXEL_MAP[size];

  // Initials generator
  const getInitials = (doctorName: string) => {
    const clean = doctorName.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s+/i, "");
    const parts = clean.split(" ").filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0] ? parts[0].substring(0, 2).toUpperCase() : "MD";
  };

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center rounded-2xl overflow-hidden bg-gradient-to-br from-hospital-800 to-navy-950 border border-hospital-700/50 shadow-sm select-none ${SIZE_MAP[size]} ${className}`}
    >
      <Image
        src={imageSrc}
        alt={`Official Avatar for ${name}`}
        width={dimension}
        height={dimension}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        priority={priority}
        onError={() => setHasError(true)}
        unoptimized={imageSrc.endsWith(".svg")}
      />

      {/* Subtle Clinical Badge Overlay on large avatars */}
      {(size === "lg" || size === "xl") && (
        <span
          className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-navy-950/90 text-cyan-400 font-bold text-[9px] tracking-wider border border-cyan-500/40 uppercase shadow-2xs"
          title={specialization || "Clinical Specialist"}
        >
          Verified
        </span>
      )}
    </div>
  );
};
