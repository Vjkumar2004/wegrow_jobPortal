import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | WeGrow Skill Campus",
  description: "Read the Privacy Policy for WeGrow Skill Campus. Learn how we safeguard student resumes, corporate partner data, and portal security.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xl shadow-slate-200/40 space-y-8">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Security & Trust
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Last Updated: January 2026 • WeGrow Skill Campus (wegrowcampus.in)
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
            <p>
              When you register as a student or corporate employer on WeGrow Skill Campus, we collect personal and professional information necessary to facilitate placement and training opportunities:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>Student Profiles:</strong> Full name, email address, contact number, educational qualifications, GPA/marks, resumes, technical skill assessments, and career preferences.</li>
              <li><strong>Employer & HR Data:</strong> Official entity name, recruiter name, corporate email address, contact phone, company registration details, website, and job posting specifications.</li>
              <li><strong>Usage Data:</strong> Application statuses, interview schedules, test assessments, and portal interaction logs to enhance security and user experience.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. How We Use Your Information</h2>
            <p>
              We use the collected information exclusively to connect candidate talent with certified corporate job openings:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Matching candidate resumes with verified job and internship openings.</li>
              <li>Facilitating direct communication between campus recruiters and shortlisted students.</li>
              <li>Scheduling technical interviews, coding assessments, and campus placement drives.</li>
              <li>Issuing verified course certificates and academic credentials.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Data Protection & Security</h2>
            <p>
              We implement industry-standard encryption and security protocols to ensure candidate resumes and corporate records remain strictly confidential. We do not sell, rent, or monetize personal student data to any unauthorized third-party marketing entities.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. Contact Information</h2>
            <p>
              If you have any questions regarding your personal information, resume privacy, or account deletion, reach out to our grievance officer at{" "}
              <a href="mailto:privacy@wegrowcampus.in" className="text-[#0756A8] font-bold hover:underline">
                privacy@wegrowcampus.in
              </a>{" "}
              or write to our Sivakasi headquarters.
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <Link href="/" className="font-bold text-[#0756A8] hover:underline">
            ← Return to Home
          </Link>
          <Link href="/terms" className="hover:underline">
            View Terms & Conditions →
          </Link>
        </div>
      </div>
    </div>
  );
}
