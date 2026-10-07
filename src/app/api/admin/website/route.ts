import { NextRequest, NextResponse } from "next/server";
import { HOSPITAL_INFO, HEALTH_PACKAGES, HealthPackage } from "@/data/hospitalData";
import { HMSService } from "@/lib/hmsService";

export const dynamic = "force-dynamic";

let websiteContent = {
  hero: {
    badge: "Super-Specialty Hospital & Research Institute",
    title: "World-Class Neurovascular & Multi-Specialty Care",
    subtitle: "Combining US Board-Certified neuroradiology, 128-slice CT, 1.5 Tesla MRI, and 24/7 acute trauma stabilization for Coimbatore and Western Tamil Nadu.",
    ctaPrimaryText: "Book Appointment",
    ctaPrimaryLink: "/book-appointment",
    ctaSecondaryText: "Emergency Care 24/7",
    ctaSecondaryLink: "/emergency",
    emergencyBanner: "24/7 Acute Stroke & Trauma Emergency Response Active: +91 422 249 9999",
  },
  about: {
    hospitalName: HOSPITAL_INFO.name,
    tagline: HOSPITAL_INFO.tagline,
    vision: "To become Western Tamil Nadu's benchmark clinical institution delivering uncompromising clinical quality, early disease interception, and compassionate patient care.",
    mission: "Democratize world-class sub-specialized medicine through advanced diagnostic characterization, certified physicians, ethical practices, and rapid emergency intervention.",
    accreditations: ["NABH Accredited Hospital", "NABL Certified Diagnostic Laboratory", "ISO 9001:2015 Quality Management"],
    facilityHighlights: [
      "Dedicated Acute Neurovascular Biplane Suite",
      "High-Field 1.5 Tesla Ultra-Short Bore MRI",
      "128-Slice Low-Dose CT Scanner with Spectral Analysis",
      "Fully Automated 24/7 Diagnostic Pathology Laboratory",
      "Modern Modular Laminar Flow Operating Theatres",
    ],
  },
  packages: [...HEALTH_PACKAGES],
  contact: {
    address: HOSPITAL_INFO.address,
    emergencyHotline: HOSPITAL_INFO.emergencyPhone,
    generalPhone: HOSPITAL_INFO.primaryPhone,
    email: HOSPITAL_INFO.emails.support,
    weekdayHours: HOSPITAL_INFO.hours.weekdays,
    weekendHours: HOSPITAL_INFO.hours.weekends,
    emergencyHours: HOSPITAL_INFO.hours.emergency,
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.488349283737!2d77.0142!3d11.0028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDAwJzEwLjEiTiA3N8KwMDAnNTEuMSJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin",
  },
};

export async function GET() {
  try {
    return NextResponse.json({ success: true, content: websiteContent });
  } catch (error: any) {
    console.error("API GET /api/admin/website error:", error);
    return NextResponse.json({ error: "Failed to fetch website CMS content." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { section, data } = body;

    if (!section || !data) {
      return NextResponse.json({ error: "section and data are required." }, { status: 400 });
    }

    if (section === "hero") {
      websiteContent.hero = { ...websiteContent.hero, ...data };
    } else if (section === "about") {
      websiteContent.about = { ...websiteContent.about, ...data };
    } else if (section === "contact") {
      websiteContent.contact = { ...websiteContent.contact, ...data };
    } else if (section === "packages") {
      websiteContent.packages = data;
    } else {
      return NextResponse.json({ error: "Invalid section." }, { status: 400 });
    }

    HMSService.recordAuditLog(
      "admin",
      "Hospital Administrator",
      "HOSPITAL_ADMIN",
      "website.content_update",
      `website/${section}`,
      { section }
    );

    return NextResponse.json({
      success: true,
      message: `Website section "${section}" updated successfully.`,
      content: websiteContent,
    });
  } catch (error: any) {
    console.error("API PUT /api/admin/website error:", error);
    return NextResponse.json({ error: "Failed to update website content." }, { status: 500 });
  }
}
