import { MetadataRoute } from "next";
import { DOCTORS, DEPARTMENTS, DIAGNOSTIC_MODALITIES } from "@/data/hospitalData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://indostates.com";

  const staticRoutes = [
    "",
    "/about",
    "/vision-mission",
    "/leadership",
    "/charity",
    "/career",
    "/doctors",
    "/departments",
    "/preventive-health",
    "/health-packages",
    "/diagnostic-center",
    "/patient-info",
    "/emergency",
    "/contact",
    "/find-us",
    "/faq",
    "/assistant",
    "/book-appointment",
    "/privacy-policy",
    "/terms",
    "/accessibility",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const doctorRoutes = DOCTORS.map((doc) => ({
    url: `${baseUrl}/doctors/${doc.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const departmentRoutes = DEPARTMENTS.map((dept) => ({
    url: `${baseUrl}/departments/${dept.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const diagnosticRoutes = DIAGNOSTIC_MODALITIES.map((mod) => ({
    url: `${baseUrl}/diagnostic-center/${mod.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...doctorRoutes, ...departmentRoutes, ...diagnosticRoutes];
}
