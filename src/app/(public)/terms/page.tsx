import React from "react";
import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Building2,
  GraduationCap,
  Briefcase,
  Clock,
  Mail,
  Phone,
  MapPin,
  XCircle,
} from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | WeGrow Skill Campus",
  description:
    "Official Terms and Conditions for WeGrow Skill Campus Job Portal. Guidelines, rights, and responsibilities for students, colleges, and corporate recruiters.",
};

export default function TermsPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 font-['Poppins',sans-serif]">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Header Card */}
        <div className="bg-gradient-to-br from-[#01264C] via-[#0756A8] to-[#014E9C] text-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-[#0756A8]/15 relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-xs font-bold uppercase tracking-wider">
              <Scale className="w-4 h-4 text-[#F79400]" /> User Agreement & Policy
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
              Please review the terms of service governing access to and usage of the WeGrow Skill Campus recruitment engine, corporate openings, and academic modules.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-blue-200/90 pt-2 border-t border-white/10">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#F79400]" /> Effective Date: October 2026
              </span>
              <span>•</span>
              <span>WeGrow Skill Campus</span>
              <span>•</span>
              <span>Applicable to Students & Corporate HR</span>
            </div>
          </div>
          {/* Ambient blur */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-3xl" />
        </div>

        {/* Content Body Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/90 shadow-xl shadow-slate-200/40 space-y-10">
          {/* Quick Summary Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-[#F8FAFD] rounded-2xl border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0756A8] flex items-center justify-center shrink-0 mt-0.5">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900">Student Integrity</p>
                <p className="text-slate-500 mt-0.5">100% free for students. Strictly authentic marks and valid CVs required.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-[#F79400] flex items-center justify-center shrink-0 mt-0.5">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900">Verified Hiring</p>
                <p className="text-slate-500 mt-0.5">Zero tolerance for paid recruitment or fraudulent job listings.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900">Admin Moderation</p>
                <p className="text-slate-500 mt-0.5">Every employer account undergoes administrative vetting before job publish.</p>
              </div>
            </div>
          </div>

          {/* Detailed Terms Sections */}
          <div className="text-slate-700 text-xs sm:text-sm leading-relaxed space-y-8">
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">1</span>
                Acceptance of Terms & Eligibility
              </h2>
              <p>
                By creating an account, browsing job listings, or submitting applications through <strong>WeGrow Skill Campus</strong> (the &quot;Portal&quot;), you acknowledge that you have read, understood, and agreed to be legally bound by these Terms &amp; Conditions.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Students / Job Seekers:</strong> Must be at least 18 years of age or enrolled in a recognized university, college, diploma, or technical training program.</li>
                <li><strong>Corporate Employers &amp; HR Recruiters:</strong> Must be legally authorized representatives of registered entities holding legitimate hiring requirements.</li>
                <li>If you do not agree with any part of these terms, you must discontinue using the Portal immediately.</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">2</span>
                Student Code of Conduct & Academic Integrity
              </h2>
              <p>WeGrow is dedicated to building trusted talent pipelines for premier employers. Registered students agree to:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Provide accurate, verifiable information regarding educational qualifications, degree, branch, graduation year, and GPA/marks.</li>
                <li>Upload only genuine resumes, project documentation, and credentials belonging strictly to themselves.</li>
                <li>Attend scheduled technical assessments, interviews, and campus recruitment drives punctually once an invite is accepted.</li>
                <li>Refrain from engaging in any form of cheating, proxy interviewing, automated bot applications, or sharing malicious code.</li>
                <li><strong>Disciplinary Action:</strong> Falsification of resume marks or proxy interviewing will lead to immediate deactivation of the candidate profile and blacklisting from all campus placement drives.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">3</span>
                Employer & Recruiter Standards (Zero-Fee Policy)
              </h2>
              <p>All corporate employers, HR managers, and hiring agencies operating on WeGrow must adhere to strict ethical recruitment standards:</p>
              <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-950">
                  <AlertTriangle className="w-4 h-4 text-[#F79400]" /> Mandatory Zero Candidate-Fee Standard:
                </div>
                <p>
                  Employers are strictly prohibited from demanding registration fees, training deposits, security payments, or &quot;laptop/material charges&quot; from candidates at any stage of the recruitment process. Demanding fees will trigger permanent criminal reporting and corporate blacklisting.
                </p>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 pt-2">
                <li>Employers must post bona fide vacancies with genuine role descriptions, accurate work locations, and transparent salary/stipend structures.</li>
                <li>All corporate profiles undergo administrative verification. Unverified accounts cannot publish active openings until reviewed.</li>
                <li>Recruiters must respect candidate confidentiality and use downloaded resumes solely for internal evaluation of the specific role applied for.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">4</span>
                Interview Scheduling & Cancellation Protocols
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Recruiters may schedule online or offline interview rounds directly through the HR console. Candidates receive automated calendar notifications and email invites.</li>
                <li>If an interview must be cancelled or rescheduled, recruiters must provide a professional, valid explanation through the portal, which is automatically communicated to the candidate.</li>
                <li>Candidates unable to attend due to academic exams or emergencies must communicate through the portal in advance.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">5</span>
                Intellectual Property Rights
              </h2>
              <p>
                All software code, database architecture, designs, visual assets, trademarks, and educational content on WeGrow Skill Campus are the proprietary property of <strong>WeGrow Skill Campus Private Limited</strong>.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Users may not scrape, copy, reverse engineer, or redistribute our software, candidate database, or job postings without prior written authorization.</li>
                <li>Candidate resumes remain the property of the student; by uploading, students grant WeGrow a non-exclusive license to transmit their profile to authorized employers.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">6</span>
                Disclaimers & Limitation of Liability
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>No Employment Guarantee:</strong> WeGrow provides placement enablement tools and bridges talent with hiring partners. We do not guarantee job offers, specific salary packages, or interview shortlisting.</li>
                <li><strong>Employer Independence:</strong> Final hiring decisions, background checks, and offer letters rest entirely at the discretion of the respective hiring partner.</li>
                <li><strong>System Availability:</strong> While we maintain 99.9% uptime via modern cloud infrastructure, WeGrow is not liable for temporary service interruptions due to maintenance or force majeure events.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">7</span>
                Account Termination & Suspension
              </h2>
              <p>
                WeGrow reserves the absolute right to suspend or permanently terminate accounts without prior notice if a user engages in:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Falsification of academic records or impersonation during interviews.</li>
                <li>Spamming, harassment, abusive communication with recruiters or students.</li>
                <li>Posting deceptive or exploitative job offers.</li>
                <li>Attempting to breach, probe, or vulnerability-scan the Portal&apos;s infrastructure.</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">8</span>
                Governing Law & Legal Jurisdiction
              </h2>
              <p>
                These Terms and Conditions shall be governed by, construed, and enforced in accordance with the laws of <strong>India</strong>. Any disputes arising out of or related to portal utilization shall fall under the exclusive jurisdiction of the competent courts in <strong>Sivakasi / Madurai, Tamil Nadu, India</strong>.
              </p>
            </section>

            {/* Section 9 */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">9</span>
                Contact Information
              </h2>
              <p>For questions or assistance regarding these terms, reach our compliance team:</p>
              <div className="p-4 sm:p-5 bg-[#F8FAFD] rounded-2xl border border-slate-200 text-xs space-y-2">
                <p className="font-bold text-slate-900 text-sm">WeGrow Legal &amp; Compliance Cell</p>
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-4 h-4 text-[#0756A8]" />
                  <span>Email:</span>
                  <a href="mailto:support@wegrowcampus.in" className="font-bold text-[#0756A8] hover:underline">
                    support@wegrowcampus.in
                  </a>
                  <span className="text-slate-400">/</span>
                  <a href="mailto:legal@wegrowcampus.in" className="font-bold text-[#0756A8] hover:underline">
                    legal@wegrowcampus.in
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-4 h-4 text-[#F79400]" />
                  <span>Phone:</span>
                  <a href="tel:+919344337331" className="font-semibold text-slate-900 hover:text-[#0756A8]">
                    +91 93443 37331
                  </a>
                </div>
                <div className="flex items-start gap-2 text-slate-700 pt-1">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>WeGrow Skill Campus, 100A/5, 1st Floor, Thiruthangal Road, Opposite Bell Hotel, Sivakasi – 626123, Tamil Nadu, India.</span>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Navigation Bar */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <Link
              href="/"
              className="font-bold text-[#0756A8] hover:text-[#01264C] flex items-center gap-1.5 transition"
            >
              ← Return to Home Page
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/privacy-policy"
                className="font-bold text-slate-700 hover:text-[#0756A8] transition"
              >
                Privacy Policy →
              </Link>
              <Link
                href="/contact"
                className="font-bold text-slate-700 hover:text-[#0756A8] transition"
              >
                Contact Support →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
