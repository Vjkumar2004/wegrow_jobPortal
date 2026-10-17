import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  CheckCircle2,
  Database,
  UserCheck,
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  Shield,
  KeyRound,
  FileCheck2,
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy | WeGrow Skill Campus",
  description:
    "Official Privacy Policy for WeGrow Skill Campus Job Portal. Learn how we protect student resumes, academic data, employer records, and adhere to data protection standards.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 font-['Poppins',sans-serif]">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Header Card */}
        <div className="bg-gradient-to-br from-[#01264C] via-[#0756A8] to-[#014E9C] text-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-[#0756A8]/15 relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#F79400]" /> Legal & Compliance
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
              WeGrow Skill Campus is committed to safeguarding the privacy and integrity of student candidates, academic institutions, and corporate hiring partners.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-blue-200/90 pt-2 border-t border-white/10">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#F79400]" /> Last Updated: October 2026
              </span>
              <span>•</span>
              <span>WeGrow Skill Campus Private Limited</span>
              <span>•</span>
              <span>DPDPA 2023 Compliant</span>
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
                <Lock className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900">Zero Data Selling</p>
                <p className="text-slate-500 mt-0.5">We never sell, rent, or monetize student resumes to marketing brokers.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-[#F79400] flex items-center justify-center shrink-0 mt-0.5">
                <Shield className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900">Cloudflare R2 Storage</p>
                <p className="text-slate-500 mt-0.5">Resumes and avatars secured with encrypted, time-limited pre-signed links.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900">Candidate Control</p>
                <p className="text-slate-500 mt-0.5">Access, edit, or request complete deletion of your profile anytime.</p>
              </div>
            </div>
          </div>

          {/* Detailed Policy Sections */}
          <div className="text-slate-700 text-xs sm:text-sm leading-relaxed space-y-8">
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">1</span>
                Introduction & Overview
              </h2>
              <p>
                Welcome to <strong>WeGrow Skill Campus</strong> (&quot;WeGrow&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). We operate the digital campus placement and skill development portal accessible via <strong>wegrowcampus.in</strong> and associated subdomains. This Privacy Policy outlines our procedures regarding the collection, handling, storage, and sharing of personal data when you use our job portal, assessment engine, and recruiter screening tools.
              </p>
              <p>
                By registering as a Student or Corporate Recruiter (HR), you consent to the data practices described in this document in accordance with the <strong>Digital Personal Data Protection Act, 2023 (DPDPA)</strong> and the <strong>Information Technology Act, 2000 (India)</strong>.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">2</span>
                Information We Collect
              </h2>
              <p>We collect information directly provided by you, as well as data generated automatically during portal interactions:</p>
              <div className="space-y-3 pl-2 sm:pl-4">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-[#0756A8]" /> A. Student & Job Seeker Profile Data
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li><strong>Identity & Contact:</strong> Full name, verified email address, phone number, date of birth, gender, and profile photo/avatar.</li>
                    <li><strong>Academic Records:</strong> College/institution name, degree program, department, graduation year, marks/CGPA, certifications, and academic backlogs history.</li>
                    <li><strong>Career Documents:</strong> Uploaded resumes (PDF/DOCX), project portfolios, GitHub/LinkedIn links, career headline, and skill self-ratings.</li>
                    <li><strong>Application History:</strong> Positions applied for, screening status, technical assessment results, and interview feedback notes.</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#F79400]" /> B. Corporate Employer & HR Recruiter Data
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li><strong>Company Identifiers:</strong> Registered corporate legal name, industry domain, company website, GSTIN/CIN, registered office address, and verified corporate logo.</li>
                    <li><strong>Recruiter Credentials:</strong> Authorized recruiter name, official business email, mobile number, and designation.</li>
                    <li><strong>Hiring Requisitions:</strong> Job titles, compensation CTC/stipends, job locations, required technical competencies, application deadlines, and interview schedule configurations.</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-emerald-600" /> C. Technical & System Logs
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li>IP address, device type, operating system, browser specifications, session timestamps, and encrypted JWT authentication tokens.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">3</span>
                Resume Storage & Cloudflare R2 Media Security
              </h2>
              <p>
                Student resumes and corporate verification credentials are stored in high-durability, object-storage powered by <strong>Cloudflare R2</strong>.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Resumes are never stored on public unauthenticated buckets.</li>
                <li>Access to download candidate CVs is strictly limited to authenticated corporate recruiters reviewing genuine campus job applications.</li>
                <li>All direct downloads utilize cryptographically signed, expiring presigned URLs (HMAC SHA-256) ensuring links cannot be shared or scraped publicly.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">4</span>
                How We Use Your Data
              </h2>
              <p>We process your data strictly for legitimate educational, recruitment, and placement services:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Matching qualified student profiles with verified corporate campus vacancies.</li>
                <li>Facilitating HR candidate screening, shortlisting, technical video assessments, and final offer letters.</li>
                <li>Sending timely transactional notifications regarding interview invites, application updates, and deadline reminders.</li>
                <li>Preventing fraudulent registrations, fake job postings, and unauthorized account access.</li>
                <li>Verifying corporate legitimacy via our administrative compliance team before permitting job publication.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">5</span>
                Data Sharing & Third Parties
              </h2>
              <p>
                We maintain a strict <strong>Zero Third-Party Commercial Sale</strong> standard. We do not sell, rent, or lease candidate data. We share information only under these specific parameters:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>With Prospective Employers:</strong> When a student applies for a job, their profile, CV, and test credentials are shared with that authorized recruiter.</li>
                <li><strong>Partner Colleges & Universities:</strong> Aggregate placement reports and verified student offer statistics are shared with affiliated academic institutions.</li>
                <li><strong>Infrastructure Providers:</strong> Essential service infrastructure including database hosting (PostgreSQL), secure storage (Cloudflare R2), and transactional email delivery.</li>
                <li><strong>Legal & Regulatory Authorities:</strong> Only when strictly mandated by court order or applicable law enforcement under Indian jurisdiction.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">6</span>
                Your Rights as a Data Principal
              </h2>
              <p>Under Indian data protection laws, you retain complete rights regarding your data:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Right to Access:</strong> You can review all personal data and uploaded resumes through your student portal profile at any time.</li>
                <li><strong>Right to Rectification:</strong> You can update academic scores, modify phone numbers, or upload revised resumes.</li>
                <li><strong>Right to Erasure (Account Deletion):</strong> You may request complete account deactivation and removal of uploaded CVs by emailing our grievance officer.</li>
                <li><strong>Right to Withdraw Consent:</strong> You may withdraw permission for recruitment notifications by adjusting your notification settings.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">7</span>
                Cookies & Local Storage
              </h2>
              <p>
                We use secure, HTTP-only authentication tokens and minimal local storage to keep you logged in safely across browser sessions. We do not use third-party invasive cross-site tracking cookies.
              </p>
            </section>

            {/* Section 8 */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">8</span>
                Grievance Officer & Support Contact
              </h2>
              <p>
                In compliance with the Information Technology Act, 2000 and Digital Personal Data Protection Act, 2023, the details of our designated Grievance Officer are:
              </p>
              <div className="p-4 sm:p-5 bg-[#F8FAFD] rounded-2xl border border-slate-200 text-xs space-y-2">
                <p className="font-bold text-slate-900 text-sm">Grievance Redressal Officer — WeGrow Skill Campus</p>
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-4 h-4 text-[#0756A8]" />
                  <span>Email:</span>
                  <a href="mailto:privacy@wegrowcampus.in" className="font-bold text-[#0756A8] hover:underline">
                    privacy@wegrowcampus.in
                  </a>
                  <span className="text-slate-400">/</span>
                  <a href="mailto:support@wegrowcampus.in" className="font-bold text-[#0756A8] hover:underline">
                    support@wegrowcampus.in
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
                  <span>Corporate Office: 100A/5, 1st Floor, Thiruthangal Road, Opposite Bell Hotel, Sivakasi – 626123, Tamil Nadu, India.</span>
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
                href="/terms"
                className="font-bold text-slate-700 hover:text-[#0756A8] transition"
              >
                Terms & Conditions →
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
