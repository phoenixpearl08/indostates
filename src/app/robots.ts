import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/portal/patient/", "/portal/doctor/", "/portal/admin/", "/api/"],
    },
    sitemap: "https://indostates.com/sitemap.xml",
  };
}
