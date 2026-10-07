"use client";

import React, { Suspense } from "react";
import AdminDashboardPage from "@/app/admin/dashboard/page";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeleton";

export default function AdminPortalRoute() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AdminDashboardPage />
    </Suspense>
  );
}
