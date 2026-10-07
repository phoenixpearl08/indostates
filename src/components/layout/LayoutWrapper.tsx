"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AccessibilityBar } from "@/components/ui/AccessibilityBar";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { IndoCareChatbot } from "@/components/ai/IndoCareChatbot";
import { OmniSearchModal } from "@/components/search/OmniSearchModal";

export const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Register PWA Service Worker (safe offline cache only in production)
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      if (process.env.NODE_ENV === "production") {
        window.addEventListener("load", () => {
          navigator.serviceWorker
            .register("/sw.js")
            .then((registration) => {
              console.log("IndoStates PWA ServiceWorker registered with scope:", registration.scope);
            })
            .catch((error) => {
              console.log("ServiceWorker registration failed:", error);
            });
        });
      } else {
        // In development, proactively unregister any service worker & clear cache to prevent stale chunk hydration mismatches
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const reg of registrations) {
            reg.unregister();
          }
        });
        if ("caches" in window) {
          caches.keys().then((names) => {
            for (const name of names) {
              caches.delete(name);
            }
          });
        }
      }
    }
  }, []);

  // Safe path extraction - guaranteed deterministic on both SSR and client hydration
  const activePath = (pathname || "").toLowerCase();

  // Determine if the current route is an internal staff portal, clinical dashboard, or patient area
  const isStaffOrDashboardRoute =
    activePath.startsWith("/doctor") ||
    activePath.startsWith("/admin") ||
    activePath.startsWith("/staff") ||
    activePath.startsWith("/patient") ||
    activePath.startsWith("/reception") ||
    activePath.startsWith("/nurse") ||
    activePath.startsWith("/lab") ||
    activePath.startsWith("/pharmacy") ||
    activePath.startsWith("/billing") ||
    activePath.startsWith("/security") ||
    activePath.startsWith("/ipd") ||
    activePath.startsWith("/portal") ||
    activePath === "/emergency/dashboard";

  // On staff & dashboard routes: render pure dashboard shell with zero public header/footer contamination
  if (isStaffOrDashboardRoute) {
    return <main className="flex-1 w-full min-h-screen">{children}</main>;
  }

  // On public citizen/patient pages: render public header, footer, accessibility bar & chatbot
  return (
    <div className="public-site-wrapper flex flex-col min-h-screen w-full">
      <AccessibilityBar />
      <EmergencyBanner />
      <Header onOpenSearch={() => setIsSearchOpen(true)} />
      {/* Add bottom padding on mobile so content clears the fixed bottom nav */}
      <main className="flex-1 w-full pb-16 lg:pb-0">{children}</main>
      <Footer />

      {/* Mobile Dedicated Quick Navigation Bar */}
      <MobileBottomNav />

      {/* Global Interactive Assistants */}
      <IndoCareChatbot />
      <OmniSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};
