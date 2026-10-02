import { NextRequest, NextResponse } from "next/server";
import { DOCTORS, DEPARTMENTS, HEALTH_PACKAGES, DIAGNOSTIC_MODALITIES, FAQS } from "@/data/hospitalData";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase().trim();

  if (!q) {
    return NextResponse.json({
      doctors: [],
      departments: [],
      packages: [],
      diagnostics: [],
      faqs: [],
    });
  }

  const matchedDoctors = DOCTORS.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.specialization.toLowerCase().includes(q) ||
      d.qualifications.toLowerCase().includes(q)
  );

  const matchedDepartments = DEPARTMENTS.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.tagline.toLowerCase().includes(q) ||
      d.shortDescription.toLowerCase().includes(q)
  );

  const matchedPackages = HEALTH_PACKAGES.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q)
  );

  const matchedDiagnostics = DIAGNOSTIC_MODALITIES.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.subtitle.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q)
  );

  const matchedFaqs = FAQS.filter(
    (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
  );

  return NextResponse.json({
    doctors: matchedDoctors,
    departments: matchedDepartments,
    packages: matchedPackages,
    diagnostics: matchedDiagnostics,
    faqs: matchedFaqs,
  });
}
