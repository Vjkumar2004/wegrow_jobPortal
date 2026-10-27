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
  Trash2,
  ExternalLink,
  Smartphone,
  Server,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Official Privacy Policy for WeGrow Jobz (Web & Android). Learn how candidate resumes, personal information, employer records, and recruitment data are handled and protected.",
  alternates: {
    canonical: "https://www.wegrowjobz.com/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | WeGrow Jobz",
    description:
      "Official Privacy Policy for WeGrow Jobz. Transparent disclosure of student data, Cloudflare R2 resume security, recruiter access, and account deletion.",
    url: "https://www.wegrowjobz.com/privacy-policy",
    siteName: "WeGrow Jobz",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "WeGrow Jobz Privacy Policy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | WeGrow Jobz",
    description: "Learn how candidate resumes, personal data, and employer records are safeguarded on WeGrow Jobz.",
    images: ["/og-image.png"],
  },
};

export default function PrivacyPolicyPage() {
  const sections = [
    { id: "intro", title: "1. Introduction & Developer Identity" },
    { id: "scope", title: "2. Scope of Policy (Web & Android)" },
    { id: "info-collected", title: "3. Information We Collect" },
    { id: "how-collected", title: "4. How Data Is Collected" },
    { id: "how-used", title: "5. How We Use Your Information" },
    { id: "resume-security", title: "6. Resume Storage & Cloudflare R2 Media Security" },
    { id: "sharing", title: "7. Recruiter Access & Third-Party Disclosure" },
    { id: "third-parties", title: "8. Third-Party Service Providers" },
    { id: "retention-deletion", title: "9. Data Retention & Account Deletion" },
    { id: "security-measures", title: "10. Security Controls & Limitations" },
    { id: "user-rights", title: "11. Your Rights as a Data Principal" },
    { id: "cookies-storage", title: "12. Cookies & Local Session Storage" },
    { id: "children-age", title: "13. Children & Minimum Age Eligibility" },
    { id: "policy-updates", title: "14. Policy Updates & Revision History" },
    { id: "grievance-contact", title: "15. Grievance Officer & Contact Directory" },
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 font-['Poppins',sans-serif]">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Header Card */}
        <div className="bg-gradient-to-br from-[#01264C] via-[#0756A8] to-[#014E9C] text-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-[#0756A8]/15 relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#F79400]" /> Legal, Privacy &amp; Data Safety
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
              WeGrow Jobz (operated by WeGrow Skill Campus Private Limited) is committed to safeguarding candidate resumes, educational credentials, and corporate recruitment data with transparent, verified practices.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-blue-200/90 pt-2 border-t border-white/10">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#F79400]" /> Effective Date: October 2026
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#22B573]" /> Last Updated: October 2026
              </span>
              <span>•</span>
              <span>DPDPA 2023 &amp; Google Play Compliant</span>
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
                <p className="text-slate-500 mt-0.5">We strictly never sell, rent, or monetize candidate resumes to third-party marketing brokers.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-[#F79400] flex items-center justify-center shrink-0 mt-0.5">
                <Shield className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900">Cloudflare R2 Media</p>
                <p className="text-slate-500 mt-0.5">Resumes are stored on private buckets and accessed only via short-lived 10-minute expiring signed URLs.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Trash2 className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900">Full Account Deletion</p>
                <p className="text-slate-500 mt-0.5">Self-service in-app deletion and external request resource with complete cloud file purging.</p>
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200 text-xs space-y-3">
            <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0756A8]" /> Table of Contents
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
              {sections.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="hover:text-[#0756A8] hover:underline transition truncate"
                >
                  {sec.title}
                </a>
              ))}
            </div>
          </div>

          {/* Detailed Policy Sections */}
          <div className="text-slate-700 text-xs sm:text-sm leading-relaxed space-y-10">
            {/* Section 1 */}
            <section id="intro" className="space-y-3 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">1</span>
                Introduction &amp; Developer Identity
              </h2>
              <p>
                Welcome to <strong>WeGrow Jobz</strong> (&quot;the Service&quot;, &quot;the Platform&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). WeGrow Jobz is developed and operated by <strong>WeGrow Skill Campus Private Limited</strong>, an educational and career enablement enterprise headquartered in Sivakasi, Tamil Nadu, India.
              </p>
              <p>
                This Privacy Policy sets out how we collect, process, store, disclose, and delete personal data when you use our job discovery platform, candidate profile services, recruiter screening console, and related mobile software applications. We are committed to processing personal data responsibly in alignment with the <strong>Digital Personal Data Protection Act, 2023 (DPDPA, India)</strong>, the <strong>Information Technology Act, 2000 (India)</strong>, and applicable international application store privacy requirements including the <strong>Google Play User Data &amp; Data Safety policies</strong>.
              </p>
              <p className="text-xs text-slate-500 italic">
                Notice: This policy is a factual technical disclosure of our platform architecture, authentication systems, data pipelines, and third-party integrations. It does not replace independent legal advice.
              </p>
            </section>

            {/* Section 2 */}
            <section id="scope" className="space-y-3 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">2</span>
                Scope of Policy (Web &amp; Android App)
              </h2>
              <p>This Privacy Policy applies universally to all end users interacting with WeGrow Jobz across:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>The Public &amp; Portal Website:</strong> Accessible via <a href="https://www.wegrowjobz.com" className="text-[#0756A8] font-bold hover:underline">https://www.wegrowjobz.com</a> and associated application subdomains.</li>
                <li><strong>The Android Mobile Application:</strong> The official &quot;WeGrow Jobz&quot; Android mobile client distributed via Google Play Store.</li>
                <li><strong>Corporate &amp; Recruiter Consoles:</strong> Employer portal interfaces for job posting, application screening, and interview scheduling.</li>
              </ul>
              <p>
                Both web and mobile platforms connect to the same unified REST API backend (<code>wegrow-jobportal-backend</code>) and share identical data handling, encryption, and storage mechanisms.
              </p>
            </section>

            {/* Section 3 */}
            <section id="info-collected" className="space-y-4 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">3</span>
                Information We Collect
              </h2>
              <p>We collect information directly provided by users and minimal technical telemetry generated during application usage:</p>

              <div className="space-y-3 pl-1 sm:pl-2">
                {/* 3A */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2 text-xs sm:text-sm">
                    <UserCheck className="w-4 h-4 text-[#0756A8]" /> A. Student &amp; Candidate Profile Information
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li><strong>Account Credentials:</strong> Full name, verified email address, and encrypted password hash (stored via bcrypt).</li>
                    <li><strong>Contact &amp; Personal Identifiers:</strong> Mobile phone number, professional headline, brief biography, current city/location, and profile avatar image.</li>
                    <li><strong>Academic History:</strong> Current institution/college name, degree program, field of study, enrollment dates, graduation year, and GPA/CGPA.</li>
                    <li><strong>Professional Portfolios &amp; Links:</strong> Personal portfolio URL, GitHub profile link, and LinkedIn profile URL.</li>
                    <li><strong>Career Preferences:</strong> Work preferences (job types, preferred locations, target industries) and self-assessed technical skills with proficiency ratings.</li>
                    <li><strong>Uploaded Resumes:</strong> Curriculum Vitae files uploaded in PDF format, including file metadata (filename, MIME type, file size).</li>
                    <li><strong>Application History:</strong> Job vacancies applied to, cover letter text, submission timestamps, application progress status, and interview records.</li>
                    <li><strong>Saved Jobs:</strong> Bookmarked job vacancies saved for future reference.</li>
                    <li><strong>Mobile Device Push Token:</strong> Firebase Cloud Messaging (FCM) registration token collected on the Android app to deliver application status alerts and interview updates.</li>
                  </ul>
                  <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100 text-[11px] text-[#014E9C]">
                    <strong>Explicit Exclusions:</strong> WeGrow Jobz does <em>not</em> mandate or collect date of birth, gender, caste/religion, biometric identifiers, academic backlog penalty records, or financial banking details from candidate job seekers. Student access to job discovery and applications is 100% free of charge.
                  </div>
                </div>

                {/* 3B */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2 text-xs sm:text-sm">
                    <Building2 className="w-4 h-4 text-[#F79400]" /> B. Corporate Employer &amp; HR Recruiter Information
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li><strong>Recruiter Identifiers:</strong> Authorized recruiter name, official business email, mobile phone number, job designation, and account avatar.</li>
                    <li><strong>Company Profile:</strong> Corporate trading name, brand slug, corporate logo image, official website URL, industry sector, company size bracket, office location, tagline, about narrative, and workplace culture notes.</li>
                    <li><strong>Hiring Requisitions:</strong> Job titles, role descriptions, responsibilities, eligibility criteria, employment types, work modes (On-site, Remote, Hybrid), openings count, experience requirements, compensation brackets (salary minimum/maximum, currency, period), disclosed flags, benefits, and hiring stage workflows.</li>
                    <li><strong>Interview Configurations:</strong> Interview titles, categories (Screening, Technical, Managerial, HR Discussion), scheduled start and end times, video meeting URLs, physical locations, and recruiter evaluation notes.</li>
                  </ul>
                </div>

                {/* 3C */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2 text-xs sm:text-sm">
                    <Database className="w-4 h-4 text-emerald-600" /> C. Technical Logs &amp; Security Telemetry
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li><strong>Audit Logs:</strong> When administrative or critical security actions occur, our system logs the action type, entity identifier, client IP address, and browser User-Agent string.</li>
                    <li><strong>Transactional Email Logs:</strong> Recipient email address, subject line, template identifier, delivery status, and timestamp recorded to confirm notification dispatch and diagnose delivery failures.</li>
                    <li><strong>Session Identifiers:</strong> Encrypted JSON Web Tokens (JWT) used to maintain authenticated sessions across requests.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="how-collected" className="space-y-3 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">4</span>
                How Data Is Collected
              </h2>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Direct Voluntary Input:</strong> When you register an account, fill out profile forms, upload your resume, bookmark a job, or apply for an opening.</li>
                <li><strong>Verification Interactions:</strong> When you request and enter 6-digit email One-Time Passwords (OTPs) during account registration or password reset workflows.</li>
                <li><strong>Employer Screening:</strong> When corporate recruiters review submitted applications, assign screening ratings, record interview feedback, or update candidate hiring stages.</li>
                <li><strong>Automated Device Telemetry:</strong> When the Android app or web client communicates with our backend API, standard HTTP request headers, IP address, and session tokens are transmitted.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="how-used" className="space-y-3 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">5</span>
                How We Use Your Information
              </h2>
              <p>We process your personal information strictly for legitimate recruitment and educational enablement purposes:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Account Authentication:</strong> Verifying user identity, issuing secure session tokens, and preventing unauthorized account access.</li>
                <li><strong>Job Application Processing:</strong> Transmitting your profile, skills, education, and resume to the specific corporate employer whose vacancy you voluntarily applied for.</li>
                <li><strong>Interview Coordination:</strong> Facilitating scheduled interview rounds, distributing virtual meeting links, and sending calendar reminders.</li>
                <li><strong>Notification Delivery:</strong> Sending transactional alerts regarding application status changes, shortlisting decisions, interview updates, and password resets via email (Resend) and mobile push (FCM).</li>
                <li><strong>Corporate Account Moderation:</strong> Reviewing employer credentials to verify legitimacy and prevent fraudulent or deceptive job postings.</li>
                <li><strong>Security &amp; Fraud Prevention:</strong> Enforcing rate-limiting on login endpoints, detecting automated scraping bots, and investigating suspicious activities.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="resume-security" className="space-y-4 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">6</span>
                Resume Storage &amp; Cloudflare R2 Media Security
              </h2>
              <p>
                Candidate resumes represent sensitive professional documentation. WeGrow Jobz employs specialized object storage architecture to safeguard them:
              </p>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                  <li><strong>Cloudflare R2 Object Storage:</strong> All uploaded candidate resumes (PDFs) and avatars are stored in high-durability, private Cloudflare R2 buckets.</li>
                  <li><strong>Zero Public Buckets:</strong> Resumes are never placed in publicly accessible URLs or open directories. Direct unauthenticated access to storage keys is permanently blocked.</li>
                  <li><strong>Strict IDOR Access Control:</strong> A recruiter cannot view or download arbitrary candidate resumes. The backend strictly validates that the requesting recruiter belongs to the company that published the job to which the student applied (<code>app.job.companyId === hrCompanyId</code>). If no genuine application exists, access is rejected with a <code>403 ACCESS_DENIED</code> error.</li>
                  <li><strong>10-Minute Expiring Presigned URLs:</strong> When an authorized candidate or recruiter requests a resume download, the server generates a cryptographically signed HMAC-SHA256 URL that is valid for strictly <strong>10 minutes (600 seconds)</strong>. Once expired, the link becomes permanently invalid.</li>
                </ul>
              </div>
            </section>

            {/* Section 7 */}
            <section id="sharing" className="space-y-3 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">7</span>
                Recruiter Access &amp; Third-Party Disclosure
              </h2>
              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-emerald-950 font-semibold flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Zero Commercial Sale Commitment: WeGrow Jobz does not sell, rent, monetize, or trade student resumes, contact numbers, or academic data to marketing brokers, ad networks, or commercial telemarketers under any circumstances.
                </span>
              </div>
              <p>We share information only under these specific parameters:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>With Prospective Employers:</strong> When a candidate voluntarily applies for a job, that specific corporate employer receives access to the candidate&apos;s submitted resume, contact details, academic scores, and experience details solely for evaluating that vacancy.</li>
                <li><strong>Partner Colleges &amp; Placement Cells:</strong> Verified academic placement departments may receive aggregated placement reports and offer statistics for students affiliated with their institution.</li>
                <li><strong>Legal &amp; Regulatory Authorities:</strong> We disclose personal data only when strictly mandated by a valid court order, governmental inquiry, or applicable Indian law enforcement process.</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section id="third-parties" className="space-y-3 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">8</span>
                Third-Party Service Providers
              </h2>
              <p>To operate our cloud infrastructure reliably, WeGrow Jobz utilizes the following verified third-party technical service providers:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900 text-xs">Cloudflare R2 (Cloudflare, Inc.)</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Secure, encrypted cloud object storage for resumes, company logos, and profile avatars.</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900 text-xs">Supabase (PostgreSQL Database)</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Managed relational database hosting for user accounts, applications, and job records.</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900 text-xs">Resend (Resend Inc.)</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Transactional email delivery for verification OTPs, password reset links, and interview alerts.</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900 text-xs">Firebase Cloud Messaging (Google LLC)</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Delivery of real-time push notifications to candidate Android mobile devices.</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 pt-1">
                Notice on AI Services: WeGrow Jobz does not integrate Google Gemini, OpenAI, or other generative AI APIs for processing or scoring candidate resumes.
              </p>
            </section>

            {/* Section 9 */}
            <section id="retention-deletion" className="space-y-4 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">9</span>
                Data Retention &amp; Account Deletion (Google Play Compliant)
              </h2>
              <p>
                In compliance with Google Play Data Safety requirements and the DPDPA 2023, WeGrow Jobz provides clear data retention criteria and complete self-service account deletion capabilities:
              </p>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Account Deletion Workflow:</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                  <li><strong>In-App Deletion:</strong> Any student can permanently delete their account at any time directly through the Android app (<strong>Settings &gt; Danger Zone &gt; Delete Account</strong>) or on the Web Portal (<strong>Settings &gt; Danger Zone</strong>) by entering &quot;DELETE&quot; to confirm.</li>
                  <li><strong>External Request Resource:</strong> Users who have uninstalled the app or lost login access can initiate an external deletion request via our public portal at <Link href="/delete-account" className="text-[#0756A8] font-bold hover:underline">/delete-account</Link> or by emailing <a href="mailto:wegrowjobz@gmail.com?subject=Account%20Deletion%20Request" className="text-[#0756A8] font-bold hover:underline">wegrowjobz@gmail.com</a>.</li>
                  <li><strong>What Gets Permanently Deleted:</strong> Candidate profile details, educational history, work experiences, skills, projects, all uploaded PDF resumes and avatars in Cloudflare R2, active job applications, interview schedules, saved jobs, and notification device tokens.</li>
                  <li><strong>Legitimate Retention Exceptions:</strong>
                    <ul className="list-disc pl-5 space-y-1 mt-1 text-slate-500 text-xs">
                      <li>Security Audit Logs: Audit log records survive account deletion with user foreign keys set to null (<code>actorId = null</code>) to preserve system integrity and detect fraudulent patterns without retaining personal identities.</li>
                      <li>Transactional Email Logs: Delivery timestamps are maintained to demonstrate compliance with prior verification dispatches.</li>
                      <li>Statutory Records: Data strictly required by law, taxation, or official investigation is preserved for the legally prescribed statutory duration.</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 10 */}
            <section id="security-measures" className="space-y-3 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">10</span>
                Security Controls &amp; Limitations
              </h2>
              <p>We implement technical and organizational controls designed to protect personal data:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Encryption in Transit:</strong> All web, mobile, and API network communications are encrypted using Transport Layer Security (TLS 1.2 / TLS 1.3 / HTTPS).</li>
                <li><strong>Password Protection:</strong> User passwords are never stored in plaintext; passwords are salted and hashed using the bcrypt algorithm.</li>
                <li><strong>API Rate Limiting:</strong> Automated rate-limiting guards all authentication routes (login, registration, OTP requests) against brute-force attacks.</li>
                <li><strong>Limitations of Guarantees:</strong> While WeGrow Jobz employs industry-standard safeguards, no digital platform or electronic transmission over the internet can guarantee absolute, impenetrable security against all hypothetical zero-day exploits. Users are responsible for safeguarding their login credentials.</li>
              </ul>
            </section>

            {/* Section 11 */}
            <section id="user-rights" className="space-y-3 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">11</span>
                Your Rights as a Data Principal
              </h2>
              <p>Under the Digital Personal Data Protection Act, 2023 and applicable privacy frameworks, you have the following rights:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Right to Access:</strong> You can view all personal details, uploaded resumes, and application records directly in your student or recruiter dashboard.</li>
                <li><strong>Right to Correction &amp; Updating:</strong> You can edit phone numbers, graduation scores, skills, experiences, and replace resumes at any time.</li>
                <li><strong>Right to Erasure:</strong> You can permanently delete your account and personal data via in-app settings or our <Link href="/delete-account" className="text-[#0756A8] font-bold hover:underline">/delete-account</Link> resource.</li>
                <li><strong>Right to Grievance Redressal:</strong> You have the right to register concerns or complaints regarding your personal data with our designated Grievance Officer.</li>
              </ul>
            </section>

            {/* Section 12 */}
            <section id="cookies-storage" className="space-y-3 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">12</span>
                Cookies &amp; Local Session Storage
              </h2>
              <p>
                WeGrow Jobz uses essential local storage and HTTP-only session tokens strictly to authenticate logged-in sessions and preserve user UI preferences (such as notification preferences and dashboard layout state). We do <strong>not</strong> deploy third-party advertising cookies, cross-site behavior trackers, or commercial fingerprinting scripts.
              </p>
            </section>

            {/* Section 13 */}
            <section id="children-age" className="space-y-3 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">13</span>
                Children &amp; Minimum Age Eligibility
              </h2>
              <p>
                WeGrow Jobz is designed exclusively for college students, technical training candidates, university graduates, and corporate recruiters (individuals at least 18 years of age or enrolled in higher technical education). We do not knowingly market to or collect personal data from children under the age of 18. If we become aware that an account belongs to an ineligible minor without lawful educational authorization, we will promptly delete the account.
              </p>
            </section>

            {/* Section 14 */}
            <section id="policy-updates" className="space-y-3 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">14</span>
                Policy Updates &amp; Revision History
              </h2>
              <p>
                We may periodically update this Privacy Policy to reflect technical architecture improvements, new portal features, or legal updates. When significant changes occur, we will update the &quot;Last Updated&quot; timestamp at the top of this document and notify active users via in-app announcements or registered email. Continued use of WeGrow Jobz after changes take effect indicates your acknowledgment of the updated policy.
              </p>
            </section>

            {/* Section 15 */}
            <section id="grievance-contact" className="space-y-4 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">15</span>
                Grievance Officer &amp; Contact Directory
              </h2>
              <p>
                In accordance with the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023, the designated Grievance Officer details for WeGrow Jobz are provided below:
              </p>

              <div className="p-5 sm:p-6 bg-[#F8FAFD] rounded-2xl border border-slate-200 text-xs space-y-4">
                <div>
                  <p className="font-bold text-slate-900 text-sm">WeGrow Skill Campus Private Limited</p>
                  <p className="text-slate-500 text-xs">Operator of WeGrow Jobz Web Portal &amp; Android Application</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-bold text-[#0756A8] uppercase tracking-wider block">
                      General Platform Support
                    </span>
                    <a href="mailto:wegrowjobz@gmail.com" className="font-bold text-slate-900 hover:text-[#0756A8] hover:underline block break-all">
                      wegrowjobz@gmail.com
                    </a>
                    <span className="text-[10px] text-slate-400">Response within 24-48 business hours</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-bold text-[#0756A8] uppercase tracking-wider block">
                      Privacy &amp; Data Protection Officer
                    </span>
                    <a href="mailto:wegrowjobz@gmail.com?subject=Privacy%20Grievance%20Enquiry" className="font-bold text-slate-900 hover:text-[#0756A8] hover:underline block break-all">
                      wegrowjobz@gmail.com
                    </a>
                    <span className="text-[10px] text-slate-500">Domain routing: privacy@wegrowcampus.in</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block">
                      Account Deletion Requests
                    </span>
                    <Link href="/delete-account" className="font-bold text-slate-900 hover:text-rose-600 hover:underline block">
                      wegrowjobz.com/delete-account
                    </Link>
                    <span className="text-[10px] text-slate-400">Automated or verified manual deletion</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-bold text-[#0756A8] uppercase tracking-wider block">
                      Legal &amp; Terms Enquiries
                    </span>
                    <a href="mailto:wegrowjobz@gmail.com?subject=Legal%20Enquiry" className="font-bold text-slate-900 hover:text-[#0756A8] hover:underline block break-all">
                      wegrowjobz@gmail.com
                    </a>
                    <span className="text-[10px] text-slate-500">Domain routing: legal@wegrowcampus.in</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-700 pt-1">
                  <Phone className="w-4 h-4 text-[#F79400] shrink-0" />
                  <span>Telephone Helpline:</span>
                  <a href="tel:+919344337331" className="font-semibold text-slate-900 hover:text-[#0756A8]">
                    +91 93443 37331
                  </a>
                  <span className="text-slate-400 text-[11px]">(Mon – Sat: 9:00 AM – 6:30 PM IST)</span>
                </div>

                <div className="flex items-start gap-2 text-slate-700 pt-1 border-t border-slate-200">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Corporate Headquarters:</strong> 193, 1A, Ayyappan Kovil, Opposite Naturals Salon &amp; Spa, Downstairs, Parasakthi Colony, Sivakasi – 626123, Virudhunagar District, Tamil Nadu, India.
                  </span>
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
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/terms"
                className="font-bold text-slate-700 hover:text-[#0756A8] transition"
              >
                Terms &amp; Conditions →
              </Link>
              <Link
                href="/delete-account"
                className="font-bold text-rose-600 hover:text-rose-700 transition"
              >
                Account Deletion →
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
