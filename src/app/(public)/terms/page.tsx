import React from "react";
import Link from "next/link";
import { FileText, ShieldAlert, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | WeGrow Skill Campus",
  description: "Terms and conditions for utilizing the WeGrow Skill Campus job portal, training modules, and placement drives.",
};

export default function TermsPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xl shadow-slate-200/40 space-y-8">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 text-[#0756A8] text-xs font-bold uppercase tracking-wider mb-3">
            <FileText className="w-3.5 h-3.5" /> Portal Agreement
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Effective Date: January 1, 2026 • WeGrow Skill Campus
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing and utilizing the WeGrow Skill Campus portal (including student applications, employer recruiter suite, and course modules), you agree to comply with and be bound by these Terms and Conditions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Student Responsibilities</h2>
            <p>
              Registered students agree to provide authentic educational marks, valid resumes, and accurate contact details. Falsification of degree credentials, interview impersonation, or academic misconduct will result in immediate suspension and blacklisting from campus placement drives.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Employer & Recruiter Standards</h2>
            <p>
              Corporate employers registering on the portal agree to provide legitimate job vacancies with fair compensation. All recruiter accounts undergo mandatory admin moderation before publication. We strictly prohibit unpaid non-educational exploitation or deceptive hiring practices.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. Intellectual Property</h2>
            <p>
              All proprietary training materials, interview assessment questionnaires, logos, and portal architecture remain the intellectual property of WeGrow Skill Campus and may not be reproduced without written consent.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">5. Termination & Modifications</h2>
            <p>
              WeGrow Skill Campus reserves the right to suspend accounts violating code-of-conduct standards or modify terms periodically to align with regulatory standards.
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <Link href="/" className="font-bold text-[#0756A8] hover:underline">
            ← Return to Home
          </Link>
          <Link href="/privacy-policy" className="hover:underline">
            View Privacy Policy →
          </Link>
        </div>
      </div>
    </div>
  );
}
