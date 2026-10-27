import React from "react";
import Link from "next/link";
import {
  Scale,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building2,
  GraduationCap,
  Briefcase,
  Clock,
  Mail,
  Phone,
  MapPin,
  XCircle,
  FileText,
  UserCheck,
  Lock,
  ArrowRight,
  Trash2,
  AlertCircle,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Official Terms and Conditions for WeGrow Jobz (Web & Android). Rights, rules, acceptable use, and responsibilities for candidates, colleges, and corporate recruiters.",
  alternates: {
    canonical: "https://www.wegrowjobz.com/terms",
  },
  openGraph: {
    title: "Terms & Conditions | WeGrow Jobz",
    description:
      "Official Terms and Conditions governing usage of WeGrow Jobz. Guidelines on student integrity, zero candidate recruitment fees, and employer verification.",
    url: "https://www.wegrowjobz.com/terms",
    siteName: "WeGrow Jobz",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "WeGrow Jobz Terms & Conditions" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions | WeGrow Jobz",
    description: "Guidelines, rights, and responsibilities for candidates and employers on WeGrow Jobz.",
    images: ["/og-image.png"],
  },
};

export default function TermsPage() {
  const sections = [
    { id: "acceptance", title: "1. Acceptance of Terms & Eligibility" },
    { id: "platform-role", title: "2. Platform Role & No Employment Guarantee" },
    { id: "student-conduct", title: "3. Candidate Responsibilities & Academic Integrity" },
    { id: "employer-standards", title: "4. Employer Verification & Zero-Fee Policy" },
    { id: "resume-license", title: "5. Resume Ownership & Limited Platform License" },
    { id: "employer-use", title: "6. Employer Access & Permitted Use of Resumes" },
    { id: "interviews", title: "7. Applications, Interviews & Communications" },
    { id: "prohibited", title: "8. Prohibited Activities & Platform Misuse" },
    { id: "ip-rights", title: "9. Intellectual Property of WeGrow Jobz" },
    { id: "third-parties", title: "10. Third-Party Infrastructure & Links" },
    { id: "disclaimers", title: "11. Service Availability & Disclaimers" },
    { id: "liability", title: "12. Limitation of Liability" },
    { id: "termination", title: "13. Suspension, Termination & Account Deletion" },
    { id: "governing-law", title: "14. Governing Law & Dispute Jurisdiction" },
    { id: "changes", title: "15. Updates to Terms & Conditions" },
    { id: "contact", title: "16. Legal Contact & Grievance Directory" },
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 font-['Poppins',sans-serif]">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Header Card */}
        <div className="bg-gradient-to-br from-[#01264C] via-[#0756A8] to-[#014E9C] text-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-[#0756A8]/15 relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-xs font-bold uppercase tracking-wider">
              <Scale className="w-4 h-4 text-[#F79400]" /> Legal Agreement &amp; Acceptable Use
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Terms &amp; Conditions
            </h1>
            <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
              These terms govern access to and usage of the WeGrow Jobz portal and Android application by candidates, colleges, and corporate employers.
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
              <span>WeGrow Skill Campus Private Limited</span>
            </div>
          </div>
          {/* Ambient blur */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-3xl" />
        </div>

        {/* Content Body Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/90 shadow-xl shadow-slate-200/40 space-y-10">
          {/* Quick Summary Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-[#F8FAFD] rounded-2xl border border-blue-100 text-xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0756A8] flex items-center justify-center shrink-0 mt-0.5">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">100% Free for Students</p>
                <p className="text-slate-500 mt-0.5">Candidate registration, job browsing, and applications are completely free of charge.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-[#F79400] flex items-center justify-center shrink-0 mt-0.5">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Zero Candidate Fee Standard</p>
                <p className="text-slate-500 mt-0.5">Employers are strictly prohibited from demanding fees, deposits, or training charges from applicants.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Employer Verification</p>
                <p className="text-slate-500 mt-0.5">All corporate employer accounts undergo administrative review before job publication.</p>
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

          {/* Detailed Terms Sections */}
          <div className="text-slate-700 text-xs sm:text-sm leading-relaxed space-y-10">
            {/* Section 1 */}
            <section id="acceptance" className="space-y-3 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">1</span>
                Acceptance of Terms &amp; Eligibility
              </h2>
              <p>
                These Terms and Conditions constitute a legally binding agreement between you (&quot;User&quot;, &quot;you&quot;, or &quot;your&quot;) and <strong>WeGrow Skill Campus Private Limited</strong> (&quot;WeGrow Jobz&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
              </p>
              <p>
                By creating an account, browsing job vacancies, uploading career materials, publishing job listings, or using our Android application, you confirm that you have read, understood, and agreed to be bound by these Terms and our accompanying <Link href="/privacy-policy" className="text-[#0756A8] font-bold hover:underline">Privacy Policy</Link>.
              </p>
              <div className="space-y-2 pt-1 pl-2 border-l-2 border-[#0756A8]">
                <p><strong>Eligibility Requirements:</strong></p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li><strong>Candidates &amp; Job Seekers:</strong> Must be at least 18 years of age or actively enrolled in a recognized university, technical college, polytechnic, or approved training institute.</li>
                  <li><strong>Corporate Employers &amp; HR Recruiters:</strong> Must be authorized personnel representing a legally registered commercial company, institution, or hiring agency.</li>
                  <li>If you do not agree with any provision of these terms, you must immediately cease accessing and using the platform.</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section id="platform-role" className="space-y-3 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">2</span>
                Platform Role &amp; No Employment Guarantee
              </h2>
              <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-200 text-blue-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Briefcase className="w-4 h-4 text-[#0756A8]" /> Intermediary Role &amp; Clear Disclaimers:
                </div>
                <p className="text-xs leading-relaxed">
                  WeGrow Jobz operates strictly as a digital technology intermediary and recruitment enablement platform bridging candidate talent with prospective hiring employers.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-blue-900">
                  <li><strong>No Employment Guarantee:</strong> Creating an account, completing your profile, or applying for vacancies does not guarantee interview invitations, job placement, or any specific compensation package.</li>
                  <li><strong>Employer Discretion:</strong> All hiring decisions, candidate shortlisting, interview evaluations, background verifications, and final offer letters rest entirely at the independent discretion of the respective hiring partner.</li>
                  <li><strong>Employment Relationship:</strong> Any eventual employment or internship contract is strictly between the candidate and the hiring employer. WeGrow Jobz is not an employer, co-employer, or agent of either party.</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section id="student-conduct" className="space-y-3 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">3</span>
                Candidate Responsibilities &amp; Academic Integrity
              </h2>
              <p>Candidates agree to maintain high professional standards and honest academic representations:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Truthful Credentials:</strong> Provide truthful, verifiable information regarding your identity, educational institution, degree, branch, graduation year, and CGPA/marks.</li>
                <li><strong>Authentic Portfolios:</strong> Upload only genuine resumes, project links, and code repositories that accurately represent your individual work.</li>
                <li><strong>Interview Punctuality:</strong> Attend accepted technical assessments and interview rounds punctually. In case of academic emergencies or exams, communicate rescheduling needs in advance.</li>
                <li><strong>Prohibition of Proxy Interviews:</strong> Engaging in proxy interviewing, impersonation, automated mass-application scripts, or submitting fabricated credential certificates is strictly prohibited.</li>
                <li><strong>Consequences of Falsification:</strong> Intentional falsification of academic records or resume credentials will result in immediate profile deactivation, cancellation of all pending applications, and notification to affiliated campus placement officers.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section id="employer-standards" className="space-y-4 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">4</span>
                Employer Verification &amp; Zero-Fee Policy
              </h2>
              <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 text-amber-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
                  <AlertTriangle className="w-4 h-4 text-[#F79400]" /> Mandatory Zero Candidate-Fee Standard:
                </div>
                <p className="text-xs leading-relaxed">
                  Employers and recruiters operating on WeGrow Jobz are strictly prohibited from demanding any form of monetary payment, application fees, training deposits, security bonds, or &quot;laptop/material charges&quot; from candidates at any stage of the recruitment process. Demanding candidate fees will result in immediate termination of the employer account and formal reporting to legal authorities.
                </p>
              </div>

              <div className="space-y-2 text-slate-600">
                <p><strong>Employer Responsibilities:</strong></p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li><strong>Administrative Verification:</strong> All employer accounts undergo compliance review. Unapproved corporate accounts cannot publish active vacancies.</li>
                  <li><strong>Bona Fide Vacancies:</strong> Post genuine job openings with accurate role descriptions, real physical or remote work arrangements, and transparent compensation structures.</li>
                  <li><strong>Respectful Interaction:</strong> Treat candidate applications with professionalism, maintain confidentiality of candidate records, and respect interview schedules.</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section id="resume-license" className="space-y-3 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">5</span>
                Resume Ownership &amp; Limited Platform License
              </h2>
              <p>
                Candidates retain full intellectual property ownership of their uploaded resumes, project documentation, and portfolio content.
              </p>
              <p>
                By uploading a resume or submitting an application on WeGrow Jobz, you grant WeGrow Skill Campus Private Limited a limited, worldwide, non-exclusive, royalty-free license to store, format, display, and transmit your resume and profile data solely for facilitating your job applications to corporate employers you apply to. You can revoke this license at any time by deleting your uploaded resume or deleting your account.
              </p>
            </section>

            {/* Section 6 */}
            <section id="employer-use" className="space-y-3 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">6</span>
                Employer Access &amp; Permitted Use of Resumes
              </h2>
              <p>Corporate employers and recruiters granted access to candidate resumes agree to the following conditions:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Purpose Limitation:</strong> Resumes and candidate contact details accessed through WeGrow Jobz may be used solely for evaluating candidates for genuine job openings published on our platform.</li>
                <li><strong>No Commercial Resale or Harvesting:</strong> Employers may not scrape, harvest, bulk-export, resell, or distribute candidate resumes to third-party databases, staffing agencies, or telemarketing lists.</li>
                <li><strong>Data Security:</strong> Employers must treat candidate resumes as confidential business information and delete candidate files when hiring evaluations are complete or upon candidate request.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section id="interviews" className="space-y-3 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">7</span>
                Applications, Interviews &amp; Communications
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>When an interview is scheduled through the portal, candidates receive calendar details, interview type categories, and video meeting URLs via email and in-app alerts.</li>
                <li>Both recruiters and candidates must conduct themselves professionally during interviews. Harassment, abusive language, or inappropriate interview conduct will result in account suspension.</li>
                <li>WeGrow Jobz does not record live video interviews conducted on third-party video platforms (such as Google Meet, Zoom, or Microsoft Teams).</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section id="prohibited" className="space-y-3 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">8</span>
                Prohibited Activities &amp; Platform Misuse
              </h2>
              <p>Users shall not engage in any of the following activities on WeGrow Jobz:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Automated scraping, crawler access, or unauthorized harvesting of candidate resumes, company listings, or platform data.</li>
                <li>Reverse engineering, decompiling, or attempting to discover the source code of our web or mobile applications.</li>
                <li>Attempting to probe, scan, or breach authentication controls or Cloudflare R2 presigned storage mechanisms.</li>
                <li>Impersonating another person, company, recruiter, or academic institution.</li>
                <li>Posting misleading, discriminatory, or unlawful job listings.</li>
                <li>Transmitting malicious software, worms, viruses, or spam communications.</li>
              </ul>
            </section>

            {/* Section 9 */}
            <section id="ip-rights" className="space-y-3 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">9</span>
                Intellectual Property of WeGrow Jobz
              </h2>
              <p>
                All software code, user interface designs, database schemas, graphics, trademarks, logos, and portal features are the proprietary intellectual property of <strong>WeGrow Skill Campus Private Limited</strong> and are protected under Indian and international intellectual property laws. Users may not duplicate, redistribute, or create derivative works without prior written consent.
              </p>
            </section>

            {/* Section 10 */}
            <section id="third-parties" className="space-y-3 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">10</span>
                Third-Party Infrastructure &amp; External Links
              </h2>
              <p>
                The platform integrates with verified infrastructure partners (Cloudflare R2, Supabase, Resend, and Firebase) and may contain links to external employer websites or virtual meeting rooms. WeGrow Jobz is not responsible for the privacy practices, content, or availability of third-party external websites.
              </p>
            </section>

            {/* Section 11 */}
            <section id="disclaimers" className="space-y-3 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">11</span>
                Service Availability &amp; Disclaimers
              </h2>
              <p>
                WeGrow Jobz is provided on an &quot;as is&quot; and &quot;as available&quot; basis. While we strive for high uptime and smooth system operations, we do not warrant that platform operations will be uninterrupted, error-free, or completely immune to force majeure events, internet outages, or scheduled maintenance downtime.
              </p>
            </section>

            {/* Section 12 */}
            <section id="liability" className="space-y-3 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">12</span>
                Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted under applicable Indian law, WeGrow Skill Campus Private Limited and its directors, officers, and employees shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Hiring decisions, background checks, or employment conduct of third-party employers.</li>
                <li>Unauthorized access to or alteration of your communications resulting from user negligence in safeguarding login credentials.</li>
                <li>Temporary disruptions or service downtime due to cloud hosting or network carrier outages.</li>
              </ul>
              <p className="text-xs text-slate-500 italic">
                Nothing in these Terms limits or excludes liability that cannot be lawfully limited or excluded under applicable Indian consumer or civil law.
              </p>
            </section>

            {/* Section 13 */}
            <section id="termination" className="space-y-3 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">13</span>
                Suspension, Termination &amp; Account Deletion
              </h2>
              <p>
                WeGrow Jobz reserves the right to suspend or terminate accounts that violate these terms, falsify academic credentials, or demand recruitment fees from candidates. Users may appeal suspension decisions by contacting our legal desk.
              </p>
              <p>
                Users can permanently delete their account at any time through in-app settings or via our dedicated external deletion resource at <Link href="/delete-account" className="text-[#0756A8] font-bold hover:underline">/delete-account</Link>. Deletion and data handling are governed by Section 9 of our Privacy Policy.
              </p>
            </section>

            {/* Section 14 */}
            <section id="governing-law" className="space-y-3 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">14</span>
                Governing Law &amp; Dispute Jurisdiction
              </h2>
              <p>
                These Terms and Conditions shall be governed by and construed in accordance with the laws of <strong>India</strong>. Any legal dispute, controversy, or claim arising out of or related to these Terms or platform usage shall fall under the exclusive jurisdiction of the competent courts in <strong>Sivakasi / Virudhunagar / Madurai, Tamil Nadu, India</strong>.
              </p>
            </section>

            {/* Section 15 */}
            <section id="changes" className="space-y-3 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">15</span>
                Updates to Terms &amp; Conditions
              </h2>
              <p>
                We reserve the right to modify these Terms to reflect service enhancements, security standards, or regulatory updates. We will notify users of substantive updates by posting the revised version with an updated &quot;Last Updated&quot; timestamp and through in-app notices. Your continued use of WeGrow Jobz signifies your acceptance of the updated terms.
              </p>
            </section>

            {/* Section 16 */}
            <section id="contact" className="space-y-4 scroll-mt-20">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">16</span>
                Legal Contact &amp; Grievance Directory
              </h2>
              <p>
                For questions, clarifications, or formal communications regarding these Terms &amp; Conditions, reach our legal cell:
              </p>

              <div className="p-5 sm:p-6 bg-[#F8FAFD] rounded-2xl border border-slate-200 text-xs space-y-4">
                <div>
                  <p className="font-bold text-slate-900 text-sm">WeGrow Skill Campus Private Limited</p>
                  <p className="text-slate-500 text-xs">Legal &amp; Regulatory Compliance Cell</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-bold text-[#0756A8] uppercase tracking-wider block">
                      General Support Desk
                    </span>
                    <a href="mailto:wegrowjobz@gmail.com" className="font-bold text-slate-900 hover:text-[#0756A8] hover:underline block break-all">
                      wegrowjobz@gmail.com
                    </a>
                    <span className="text-[10px] text-slate-400">Candidate &amp; Recruiter Support</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-bold text-[#0756A8] uppercase tracking-wider block">
                      Legal &amp; Terms Enquiries
                    </span>
                    <a href="mailto:wegrowjobz@gmail.com?subject=Terms%20Enquiry" className="font-bold text-slate-900 hover:text-[#0756A8] hover:underline block break-all">
                      wegrowjobz@gmail.com
                    </a>
                    <span className="text-[10px] text-slate-500">Domain routing: legal@wegrowcampus.in</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block">
                      Account Deletion Desk
                    </span>
                    <Link href="/delete-account" className="font-bold text-slate-900 hover:text-rose-600 hover:underline block">
                      wegrowjobz.com/delete-account
                    </Link>
                    <span className="text-[10px] text-slate-400">Self-service or verified requests</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-bold text-[#0756A8] uppercase tracking-wider block">
                      Privacy &amp; Data Rights
                    </span>
                    <Link href="/privacy-policy" className="font-bold text-slate-900 hover:text-[#0756A8] hover:underline block">
                      wegrowjobz.com/privacy-policy
                    </Link>
                    <span className="text-[10px] text-slate-500">DPDPA 2023 &amp; Data Safety</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-700 pt-1">
                  <Phone className="w-4 h-4 text-[#F79400] shrink-0" />
                  <span>Helpline Desk:</span>
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
                href="/privacy-policy"
                className="font-bold text-slate-700 hover:text-[#0756A8] transition"
              >
                Privacy Policy →
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
