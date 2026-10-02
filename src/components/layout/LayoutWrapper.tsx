"use client";

import React, { useState, useEffect } from "react";
import { AccessibilityBar } from "@/components/ui/AccessibilityBar";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { IndoCareChatbot } from "@/components/ai/IndoCareChatbot";
import { OmniSearchModal } from "@/components/search/OmniSearchModal";

export const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Register PWA Service Worker (safe offline cache)
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
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
    }
  }, []);

  return (
    <>
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
    </>
  );
};
