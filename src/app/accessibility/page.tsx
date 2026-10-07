import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Eye, ArrowLeft, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Accessibility Statement | Indo States Health",
  description:
    "Accessibility features, WCAG 2.1 AA conformity, screen-reader support, contrast adjustments, and multilingual options at Indo States Health.",
};

export default function AccessibilityStatementPage() {
  return (
    <div className="bg-slate-50/60 min-h-screen pb-20">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
          <Link href="/" className="text-slate-600 hover:text-hospital-800 flex items-center gap-1.5 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <span className="text-slate-400">Universal Access</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-semibold mb-3">
              <Eye className="w-3.5 h-3.5" /> WCAG 2.1 AA Conformance
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 font-display mb-2">Accessibility Statement</h1>
            <p className="text-xs text-slate-500">Committed to barrier-free digital healthcare access for all</p>
          </div>

          <div className="space-y-6 text-xs text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">Our Accessibility Standards</h2>
              <p>
                Indo States Health is committed to ensuring digital accessibility for patients of all abilities, including individuals with visual, auditory, motor, or cognitive impairments. We continuously optimize our website according to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">Built-in Accessibility Tools</h2>
              <p className="mb-3">Our platform includes assistive tools located in the accessibility ribbon at the top of every page:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">High Contrast Mode</div>
                  <div>Enhances foreground-to-background contrast ratios exceeding 7:1 for enhanced visual clarity.</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">Text Scaling (A+)</div>
                  <div>Increases font sizes across all headings, cards, and labels without breaking layout responsiveness.</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">Reduced Motion</div>
                  <div>Suppresses high-speed transitions and parallax effects for patients prone to vestibular discomfort.</div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">Screen Reader & Keyboard Compatibility</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Logical semantic HTML hierarchy with proper landmark regions (header, main, footer).</li>
                <li>Descriptive aria-labels on all interactive buttons, modal triggers, and form fields.</li>
                <li>Full keyboard navigation capability with visible focus rings across all links and inputs.</li>
                <li>Instant quick search accessible via <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[11px]">Cmd/Ctrl + K</code>.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">Multilingual Support</h2>
              <p>
                To serve regional patients effectively, our entire core user interface, doctor profiles, and IndoStates Help Desk assistant can be toggled between <strong>English</strong>, <strong>தமிழ் (Tamil)</strong>, <strong>हिंदी (Hindi)</strong>, <strong>മലയാളം (Malayalam)</strong>, <strong>తెలుగు (Telugu)</strong>, and <strong>ಕನ್ನಡ (Kannada)</strong>.
              </p>
            </section>

            <section className="pt-4 border-t border-slate-100">
              <h2 className="text-base font-bold text-slate-900 mb-2">Feedback & Assistance</h2>
              <p>
                If you encounter any accessibility barrier or require assistance booking an appointment with assistive devices, please contact our accessibility coordinator at <a href="mailto:contact@indostates.com" className="text-hospital-700 underline">contact@indostates.com</a> or phone 04 222 111 000.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
