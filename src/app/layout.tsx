import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#082949",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Indo States Health | State-of-the-Art Preventive & Diagnostic Care",
  description:
    "Indo States Health (Coimbatore, India) — Founded by dual US & Indian board-certified specialists. Offering 1.5 Tesla MRI, 128-slice CT calcium score, 3D Mammography, DEXA scans, and comprehensive Master Health Checkup (₹3,500).",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Indo States Health",
  },
  keywords: [
    "Indo States Health",
    "Coimbatore Hospital",
    "Dr. Rajesh Rangaswamy",
    "1.5 Tesla MRI Coimbatore",
    "128 Slice CT Scan",
    "Coronary Calcium Score",
    "Master Health Checkup Coimbatore",
    "Preventive Health Center",
    "ARDOR Care Foundation",
    "Arasur Hospital",
  ],
  authors: [{ name: "Indo States Health" }],
  openGraph: {
    title: "Indo States Health | Prevent • Screen • Treat",
    description:
      "State-of-the-art healthcare to the people of India. 1.5T MRI, 128-slice CT, and holistic preventive medicine founded by US & Indian dual board-certified physicians.",
    url: "https://indostates.com",
    siteName: "Indo States Health",
    images: [
      {
        url: "https://indostates.com/wp-content/uploads/2025/04/Hos-01-1024x548.png",
        width: 1024,
        height: 548,
        alt: "Indo States Health Medical Center, Arasur, Coimbatore",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: "https://indostates.com/wp-content/uploads/2025/04/fav-02-150x150.png",
    apple: "https://indostates.com/wp-content/uploads/2025/04/fav-02-300x300.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen flex flex-col antialiased selection:bg-hospital-100 selection:text-hospital-900">
        <div id="root-portal" className="flex flex-col min-h-screen">
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </div>
      </body>
    </html>
  );
}
