"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home, LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-200">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
          Access Restricted
        </span>

        <h1 className="text-2xl font-extrabold text-slate-900 mt-4 mb-2">
          Role Permission Required
        </h1>

        <p className="text-sm text-slate-600 mb-8 leading-relaxed">
          You do not have the required clinical or administrative role permissions to view this department dashboard. Please switch to your authorized account or return to the main portal.
        </p>

        <div className="space-y-3">
          <Link href="/login" className="block w-full">
            <Button className="w-full bg-hospital-700 hover:bg-hospital-800 text-white flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4" />
              Sign in with Different Account
            </Button>
          </Link>

          <Link href="/" className="block w-full">
            <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              Return to IndoStates Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
