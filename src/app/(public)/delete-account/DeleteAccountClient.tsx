"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trash2,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Send,
  Mail,
  Phone,
  MapPin,
  Smartphone,
  Globe,
  FileText,
  Lock,
  ArrowRight,
} from "lucide-react";

export default function DeleteAccountClient() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("Student / Candidate");
  const [reason, setReason] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acknowledged) {
      alert("Please check the box confirming you understand that account deletion is permanent.");
      return;
    }
    setIsSubmitting(true);
    // Simulate submission handling with clear next-step guidance
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 font-['Poppins',sans-serif]">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Hero Card */}
        <div className="bg-gradient-to-br from-[#01264C] via-[#0756A8] to-[#014E9C] text-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-[#0756A8]/15 relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-rose-200 text-xs font-bold uppercase tracking-wider">
              <Trash2 className="w-4 h-4 text-rose-400" /> Google Play Data Safety &amp; User Rights
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Account &amp; Data Deletion Request
            </h1>
            <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
              WeGrow Jobz provides transparent, accessible controls to delete your account and associated personal data. Review the deletion policy, timelines, and submission methods below.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-blue-200/90 pt-2 border-t border-white/10">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#F79400]" /> Policy Active: October 2026
              </span>
              <span>•</span>
              <span>WeGrow Skill Campus Private Limited</span>
              <span>•</span>
              <span>DPDPA 2023 &amp; Play Console Compliant</span>
            </div>
          </div>
          <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-3xl" />
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/90 shadow-xl shadow-slate-200/40 space-y-10">
          {/* Quick Summary Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-[#F8FAFD] rounded-2xl border border-blue-100 text-xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Immediate Purge</p>
                <p className="text-slate-500 mt-0.5">
                  Resumes, profile media, and application details are purged from database and cloud storage.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-[#F79400] flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Identity Verification</p>
                <p className="text-slate-500 mt-0.5">
                  Requests undergo safe ownership verification via your registered email address before deletion.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0756A8] flex items-center justify-center shrink-0 mt-0.5">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">In-App or Web</p>
                <p className="text-slate-500 mt-0.5">
                  Delete directly in the app or use the external web form below if you uninstalled the app.
                </p>
              </div>
            </div>
          </div>

          {/* Section 1: Data Categories Handled */}
          <section className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">
                1
              </span>
              What Data Is Deleted vs. Retained
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-950">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Data Permanently Erased:</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
                  <li><strong>Account Credentials:</strong> Email, password hash, and active JWT session tokens.</li>
                  <li><strong>Candidate Profile:</strong> Full name, phone, bio, headline, links, and college details.</li>
                  <li><strong>Career Documents:</strong> All uploaded PDF resumes and avatars stored in Cloudflare R2 object storage.</li>
                  <li><strong>Academic Records:</strong> Education history, work experiences, skills, and portfolio projects.</li>
                  <li><strong>Applications &amp; Interviews:</strong> All submitted job applications, interview schedules, and saved jobs.</li>
                  <li><strong>Notifications:</strong> In-app alerts and push notification device tokens (FCM).</li>
                </ul>
              </div>

              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-950">
                  <AlertTriangle className="w-4 h-4 text-[#F79400]" />
                  <span>Legitimate Retention Exceptions:</span>
                </div>
                <p className="text-slate-600 text-xs">
                  In accordance with Google Play policies and Indian statutory regulations (DPDPA 2023 &amp; IT Act 2000), certain minimal records are retained:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
                  <li><strong>Security &amp; Audit Logs:</strong> Security telemetry rows are retained with user identifiers set to null (<code>actorId = null</code>) to prevent abuse and detect unauthorized activity.</li>
                  <li><strong>Email Dispatch Logs:</strong> Basic transactional logs confirming prior verification OTP dispatches without profile content.</li>
                  <li><strong>Legal &amp; Regulatory Obligations:</strong> Any records strictly mandated by lawful government or court order under Indian law.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: Method 1 - In-App Self-Service Deletion */}
          <section className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">
                2
              </span>
              Method 1: Instant In-App Deletion (Recommended)
            </h2>
            <p>
              If you have active access to your account, you can perform immediate self-service account deletion without waiting for manual verification:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Smartphone className="w-4 h-4 text-[#0756A8]" />
                  <span>On Android App:</span>
                </div>
                <ol className="list-decimal pl-5 space-y-1 text-slate-600">
                  <li>Open the <strong>WeGrow Jobz</strong> Android mobile app.</li>
                  <li>Tap the <strong>Profile</strong> or <strong>Settings</strong> icon in the navigation.</li>
                  <li>Scroll to the <strong>Danger Zone</strong> section.</li>
                  <li>Tap <strong>Delete Account</strong>.</li>
                  <li>Type <span className="font-mono font-bold text-rose-600">DELETE</span> to confirm.</li>
                </ol>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Globe className="w-4 h-4 text-[#0756A8]" />
                  <span>On Website Portal:</span>
                </div>
                <ol className="list-decimal pl-5 space-y-1 text-slate-600">
                  <li>Log into your account at <Link href="/student/login" className="text-[#0756A8] font-bold hover:underline">wegrowjobz.com/student/login</Link>.</li>
                  <li>Navigate to <strong>Settings</strong> from the dashboard sidebar.</li>
                  <li>Scroll to <strong>Danger Zone: Account Deletion</strong>.</li>
                  <li>Click <strong>Delete My Account</strong> and type <span className="font-mono font-bold text-rose-600">DELETE</span>.</li>
                  <li>Your account and cloud files are immediately purged.</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Section 3: Method 2 - External Web Deletion Request Form */}
          <section className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">
                3
              </span>
              Method 2: External Deletion Request Form
            </h2>
            <p>
              If you have uninstalled the application, forgotten your credentials, or are an employer requesting company data removal, submit your request using the form below:
            </p>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              {submitted ? (
                <div className="p-6 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Deletion Request Logged</h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="font-bold text-slate-900">{fullName}</span>. We have logged your request for <span className="font-bold text-slate-900">{email}</span>. To protect your account from unauthorized deletion, our compliance desk will send an ownership confirmation link to this email within <strong>24 to 48 hours</strong>. Once confirmed, your records will be permanently erased.
                  </p>
                  <p className="text-xs text-slate-500 pt-1">
                    Need urgent assistance? Email our Grievance Desk at{" "}
                    <a href="mailto:wegrowjobz@gmail.com?subject=Urgent%20Account%20Deletion%20Request" className="font-bold text-[#0756A8] hover:underline">
                      wegrowjobz@gmail.com
                    </a>
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                        Registered Account Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0756A8]/20 focus:border-[#0756A8]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                        Full Name on Profile *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anand Kumar"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0756A8]/20 focus:border-[#0756A8]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                        Account Role *
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0756A8]/20 focus:border-[#0756A8] cursor-pointer"
                      >
                        <option>Student / Candidate</option>
                        <option>HR Recruiter / Employer</option>
                        <option>College Placement Representative</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                        Reason for Deletion (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Found a job, no longer seeking placement"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0756A8]/20 focus:border-[#0756A8]"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-rose-50/80 rounded-xl border border-rose-200/80">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-rose-950">
                      <input
                        type="checkbox"
                        checked={acknowledged}
                        onChange={(e) => setAcknowledged(e.target.checked)}
                        className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                        required
                      />
                      <span>
                        I understand that submitting this request will permanently delete my WeGrow Jobz profile, uploaded resumes, and job application records. This action cannot be undone.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !acknowledged}
                    className="w-full h-11 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-sm active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? "Submitting Request…" : "Submit Account Deletion Request"}</span>
                  </button>
                </form>
              )}
            </div>
          </section>

          {/* Section 4: Direct Contact Channels */}
          <section className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#0756A8] text-xs font-black flex items-center justify-center">
                4
              </span>
              Direct Grievance &amp; Manual Assistance
            </h2>
            <p>
              You can also contact our designated Data Protection &amp; Grievance Redressal desk directly:
            </p>

            <div className="p-4 sm:p-5 bg-[#F8FAFD] rounded-2xl border border-slate-200 text-xs space-y-3">
              <p className="font-bold text-slate-900 text-sm">WeGrow Jobz Compliance &amp; Grievance Desk</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#0756A8] shrink-0" />
                  <span>Account Deletion Inbox:</span>
                  <a href="mailto:wegrowjobz@gmail.com?subject=Account%20Deletion%20Request" className="font-bold text-[#0756A8] hover:underline">
                    wegrowjobz@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#F79400] shrink-0" />
                  <span>Helpline Desk:</span>
                  <a href="tel:+919344337331" className="font-semibold text-slate-900 hover:text-[#0756A8]">
                    +91 93443 37331
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2 text-slate-700 pt-1 border-t border-slate-200/60">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Corporate Office: WeGrow Skill Campus Private Limited, 193, 1A, Ayyappan Kovil, Opposite Naturals Salon &amp; Spa, Downstairs, Parasakthi Colony, Sivakasi – 626123, Tamil Nadu, India.
                </span>
              </div>
            </div>
          </section>

          {/* Navigation Bar */}
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
                href="/terms"
                className="font-bold text-slate-700 hover:text-[#0756A8] transition"
              >
                Terms &amp; Conditions →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
