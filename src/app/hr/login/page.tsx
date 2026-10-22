"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Users2,
  GraduationCap,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { authService } from "@/services/auth.service";
import { authApi } from "@/lib/api/auth.api";
import { hrService } from "@/services/hr.service";
import { PageLoader } from "@/components/common/PageLoader";

function HRLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(
    searchParams.get("error") === "suspended"
      ? "Your account has been suspended. Please contact platform support."
      : ""
  );

  const infoMessage = searchParams.get("message");

  // Forgot password modal state
  const [fpStep, setFpStep] = useState<"closed" | "email" | "otp" | "newpass">("closed");
  const [fpEmail, setFpEmail] = useState("");
  const [fpOtp, setFpOtp] = useState("");
  const [fpNewPass, setFpNewPass] = useState("");
  const [fpConfirmPass, setFpConfirmPass] = useState("");
  const [fpError, setFpError] = useState("");
  const [fpLoading, setFpLoading] = useState(false);
  const [fpSuccess, setFpSuccess] = useState("");

  const handleForgotRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fpEmail.trim()) { setFpError("Please enter your email address."); return; }
    setFpLoading(true); setFpError("");
    try {
      await authApi.forgotPassword(fpEmail, "HR");
      setFpStep("otp");
    } catch (err: any) {
      setFpError(err?.response?.data?.message || "Failed to send reset code. Please try again.");
    } finally { setFpLoading(false); }
  };

  const handleForgotVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fpOtp.trim()) { setFpError("Please enter the OTP sent to your email."); return; }
    setFpLoading(true); setFpError("");
    try {
      await authApi.verifyResetCode(fpEmail, fpOtp);
      setFpStep("newpass");
    } catch (err: any) {
      setFpError(err?.response?.data?.message || "Invalid or expired OTP. Please try again.");
    } finally { setFpLoading(false); }
  };

  const handleForgotReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fpNewPass !== fpConfirmPass) { setFpError("Passwords do not match."); return; }
    if (fpNewPass.length < 8) { setFpError("Password must be at least 8 characters."); return; }
    setFpLoading(true); setFpError("");
    try {
      await authApi.resetPassword(fpEmail, fpOtp, fpNewPass);
      setFpSuccess("Password reset successfully! You can now log in with your new password.");
      setTimeout(() => setFpStep("closed"), 2000);
    } catch (err: any) {
      setFpError(err?.response?.data?.message || "Failed to reset password. Please try again.");
    } finally { setFpLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await authService.login({
        email: email.trim(),
        password,
        role: "HR",
      });

      // Check if there is pending onboarding data from registration
      if (typeof window !== "undefined") {
        const onboardingDraftKey =
          "wegrow_hr_onboarding_" + email.trim().toLowerCase();
        const pendingDataStr = sessionStorage.getItem(onboardingDraftKey);
        if (pendingDataStr) {
          try {
            const pendingData = JSON.parse(pendingDataStr);
            await hrService.onboardCompany(pendingData);
            sessionStorage.removeItem(onboardingDraftKey);
          } catch (onboardingErr: any) {
            if (
              onboardingErr?.response?.status === 409 ||
              onboardingErr?.message?.includes("already")
            ) {
              sessionStorage.removeItem(onboardingDraftKey);
            }
          }
        }
      }

      const userRole = res.data?.user?.role;
      const hrCompany = (res.data?.user as any)?.hrProfile?.company;
      const approvalStatus = hrCompany?.approvalStatus?.toUpperCase?.();

      if (userRole === "HR" && approvalStatus === "REJECTED") {
        authService.logout();
        setError(
          "Your application has been rejected by the administrator. Please contact support for further details."
        );
        return;
      }

      if (userRole === "HR" && approvalStatus === "PENDING") {
        authService.logout();
        setError(
          "Your account is waiting for admin approval. You can sign in once an administrator approves your company registration."
        );
        return;
      }

      if (userRole === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (userRole === "STUDENT") {
        router.push("/student/dashboard");
      } else {
        router.push("/hr/dashboard");
      }
    } catch (err: unknown) {
      const errorObj = err as {
        response?: {
          status?: number;
          data?: { error?: { code?: string }; message?: string };
        };
      };
      const status = errorObj?.response?.status;
      const code = errorObj?.response?.data?.error?.code;
      const message = errorObj?.response?.data?.message;

      if (
        status === 403 &&
        (code === "ROLE_MISMATCH" || message?.includes("Student") || message?.includes("Recruiter"))
      ) {
        authService.logout();
        setError(
          message || "This account is registered as a Candidate. Please use the Candidate login portal."
        );
      } else if (
        status === 403 &&
        (code === "APPLICATION_REJECTED" ||
          code === "COMPANY_REJECTED" ||
          message?.toLowerCase().includes("reject"))
      ) {
        authService.logout();
        setError(
          "Your application has been rejected by the administrator. Please contact support for further details."
        );
      } else if (
        status === 403 &&
        (code === "ACCOUNT_SUSPENDED" ||
          message?.toLowerCase().includes("suspended"))
      ) {
        authService.logout();
        setError(
          "Your account has been suspended. Please contact platform support."
        );
      } else if (
        status === 403 &&
        (code === "PENDING_APPROVAL" ||
          code === "COMPANY_NOT_APPROVED" ||
          message?.toLowerCase().includes("pending") ||
          message?.toLowerCase().includes("approval") ||
          message?.toLowerCase().includes("approve"))
      ) {
        authService.logout();
        setError(
          "Your account is waiting for admin approval. You can sign in once an administrator approves your company registration."
        );
      } else if (status === 401 || code === "INVALID_CREDENTIALS") {
        setError("Invalid email or password.");
      } else if (
        status === 403 &&
        (code === "EMAIL_NOT_VERIFIED" || message?.includes("verify your email"))
      ) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}&role=HR`);
      } else if (status === 400) {
        setError(
          message || "Invalid login request. Please check your credentials."
        );
      } else {
        setError(message || "Invalid email or password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex">
      {/* ================= DESKTOP LEFT SIDE: CLASSIC VISUAL BRAND SHOWCASE ================= */}
      <div className="hidden lg:relative lg:flex lg:w-1/2 flex-col justify-between overflow-hidden bg-[#0A1A2F] text-white p-12 xl:p-16">
        {/* Background Image with layered gradient overlays */}
        <div className="absolute inset-0">
          <Image
            src="/hr-login-bg.webp"
            alt="HR and Corporate Talent Acquisition"
            fill
            priority
            className="object-cover object-center opacity-40 transform scale-105 transition-transform duration-1000 ease-out hover:scale-100"
          />
          {/* Subtle gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#061427] via-[#014E9C]/60 to-[#07162d]/85" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(247,148,0,0.16),transparent_50%)]" />
        </div>

        {/* Top Header / Branding */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/"
            className="inline-block group focus:outline-none transition-transform duration-200 hover:scale-105"
            aria-label="WeGrow Skill Campus Home"
          >
            <div className="relative w-40 sm:w-44 h-10 sm:h-11">
              <Image
                src="/wegrow-portal-logo.png"
                alt="WeGrow Skill Campus"
                fill
                className="object-contain object-left drop-shadow-[0_0_1px_rgba(255,255,255,0.85)] drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]"
                priority
              />
            </div>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-white/80 hover:text-white bg-white/10 backdrop-blur-sm border border-white/15 px-3.5 py-1.5 rounded-full transition-all hover:bg-white/20"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Center Content / Highlights */}
        <div className="relative z-10 my-auto py-8 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#F79400] text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#F79400]" /> Trusted by 500+ Corporate Recruiters
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight tracking-tight mb-4">
            Hire top pre-vetted campus talent effortlessly.
          </h1>

          <p className="text-sm xl:text-base text-slate-200/90 leading-relaxed mb-8">
            Post verified campus opportunities, screen validated technical skill profiles, schedule live interviews, and roll out job offers in one centralized dashboard.
          </p>

          {/* Value props */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <div className="w-6 h-6 rounded-full bg-[#F79400]/20 text-[#F79400] flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>Streamlined candidate filtering with skill assessment reports</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <div className="w-6 h-6 rounded-full bg-[#F79400]/20 text-[#F79400] flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span>Automated interview round scheduling & candidate reminders</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <div className="w-6 h-6 rounded-full bg-[#F79400]/20 text-[#F79400] flex items-center justify-center flex-shrink-0">
                <Users2 className="w-4 h-4" />
              </div>
              <span>Direct access to 50,000+ graduates across accredited partner campuses</span>
            </div>
          </div>
        </div>

        {/* Bottom Metrics Pill */}
        <div className="relative z-10 grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl">
          <div className="text-center">
            <div className="text-xl xl:text-2xl font-black text-white">4.2x</div>
            <div className="text-[11px] text-slate-300 font-medium">Faster Hiring Cycle</div>
          </div>
          <div className="text-center border-x border-white/15">
            <div className="text-xl xl:text-2xl font-black text-[#F79400]">94%</div>
            <div className="text-[11px] text-slate-300 font-medium">Candidate Match Rate</div>
          </div>
          <div className="text-center">
            <div className="text-xl xl:text-2xl font-black text-white">100%</div>
            <div className="text-[11px] text-slate-300 font-medium">Verified Profiles</div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE: DUAL ADAPTIVE FORM AREA ================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between py-8 sm:py-10 px-4 sm:px-12 xl:px-20 overflow-y-auto">
        {/* --- MOBILE-ONLY TOP HEADER (Brand Logo + Home Link) --- */}
        <div className="flex lg:hidden items-center justify-between pb-4 border-b border-slate-200/80 mb-6">
          <Link href="/" className="inline-block focus:outline-none" aria-label="WeGrow Skill Campus Home">
            <div className="relative w-36 h-9">
              <Image
                src="/wegrow-portal-logo.png"
                alt="WeGrow Skill Campus"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>
          <Link
            href="/"
            className="text-xs font-semibold text-slate-500 hover:text-[#014E9C]"
          >
            ← Home
          </Link>
        </div>

        {/* --- FORM WRAPPER: Responsive (Elevated Card on Mobile, Classic Spacious on Desktop) --- */}
        <div className="max-w-md w-full mx-auto my-auto py-2 lg:py-4">
          {/* MOBILE ONLY: Role Switcher Pill */}
          <div className="lg:hidden bg-slate-200/70 p-1 rounded-xl mb-5 flex items-center">
            <Link
              href="/student/login"
              className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5"
            >
              <GraduationCap className="w-4 h-4 text-slate-400" />
              <span>Student</span>
            </Link>
            <button
              type="button"
              className="flex-1 py-2 px-3 text-xs font-bold rounded-lg bg-white text-[#F79400] shadow-sm flex items-center justify-center gap-1.5"
            >
              <Building2 className="w-4 h-4 text-[#F79400]" />
              <span>Recruiter / HR</span>
            </button>
          </div>

          {/* Form Container: Card on mobile (bg-white rounded-3xl p-6 shadow-sm), Seamless on desktop */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(247,148,0,0.06)] border border-slate-100 lg:bg-transparent lg:rounded-none lg:p-0 lg:shadow-none lg:border-none">
            {/* --- DESKTOP HEADER (Classic Left-aligned) --- */}
            <div className="hidden lg:block mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-[#F79400] text-xs font-bold uppercase tracking-wider mb-3">
                <Building2 className="w-4 h-4 text-[#F79400]" />
                Employer & HR Portal
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Sign In to Recruiter Suite
              </h2>
              <p className="text-sm text-slate-500 mt-1.5">
                Access your corporate hiring workspace to post openings, shortlist talent, and evaluate applicants.
              </p>
            </div>

            {/* --- MOBILE HEADER (Centered with Emoji) --- */}
            <div className="lg:hidden mb-6 text-center">
              <h2 className="text-2xl font-bold text-[#0B1F4B] tracking-tight">
                Recruiter Suite 🏢
              </h2>
              <p className="text-xs text-[#6B7694] mt-1.5 leading-relaxed max-w-xs mx-auto">
                Sign in with your corporate credentials to manage hiring drives and candidate applications.
              </p>
            </div>

            {/* Info / Pending Approval Alert */}
            {infoMessage && (
              <div className="mb-5 p-3.5 bg-amber-50 text-amber-900 text-xs rounded-xl font-medium border border-amber-200 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center font-bold shrink-0 text-[11px] mt-0.5">
                  ⏳
                </span>
                <div className="leading-relaxed">
                  <span className="font-bold block text-amber-950 mb-0.5">
                    Waiting for Admin Approval:
                  </span>
                  <span>{infoMessage}</span>
                </div>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <div className="mb-5 p-3.5 bg-rose-50 text-rose-700 text-xs rounded-xl font-medium border border-rose-200 flex items-start gap-2.5">
                <span className="font-bold">Error:</span>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Work Email Field */}
              <div>
                <label
                  htmlFor="hr-email"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Official Work Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="hr-email"
                    type="email"
                    required
                    placeholder="Enter your work email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-[#014E9C] focus:outline-none focus:ring-2 focus:ring-[#014E9C]/15"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="hr-password"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setFpEmail(email); setFpStep("email"); setFpError(""); setFpSuccess(""); }}
                    className="text-xs font-semibold text-[#014E9C] hover:text-[#F79400] transition cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="hr-password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-11 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-[#014E9C] focus:outline-none focus:ring-2 focus:ring-[#014E9C]/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Device */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#014E9C] focus:ring-[#014E9C] cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-600">
                    Remember this corporate device
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2 font-bold bg-[#014E9C] hover:bg-[#013d7a] text-white py-3 rounded-xl shadow-md shadow-[#014E9C]/20 flex items-center justify-center gap-2 group transition-all cursor-pointer"
                isLoading={isLoading}
              >
                <span>Sign In to Recruiter Suite</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </form>

            {/* Alternate Role Redirection */}
            <div className="mt-8 pt-6 border-t border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>New corporate hiring partner?</span>
                <Link
                  href="/hr/register"
                  className="font-bold text-[#F79400] hover:text-[#d47f00] hover:underline transition"
                >
                  Register Company Free
                </Link>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-4 h-4 text-slate-500" />
                  <span className="text-xs text-slate-600 font-medium">Are you a Candidate looking for jobs?</span>
                </div>
                <Link
                  href="/student/login"
                  className="text-xs font-bold text-[#014E9C] hover:underline"
                >
                  Candidate Login →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer / Copyright & Legal Links */}
        <div className="pt-6 text-center text-xs text-slate-400 space-y-2">
          <p>© {new Date().getFullYear()} WeGrow Skill Campus. Enterprise Talent Portal.</p>
          <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500">
            <Link href="/privacy-policy" className="hover:text-[#014E9C] hover:underline transition">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-[#014E9C] hover:underline transition">
              Terms &amp; Conditions
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-[#014E9C] hover:underline transition">
              Contact Support
            </Link>
          </div>
        </div>
      </div>

      {/* ===== FORGOT PASSWORD MODAL ===== */}
      {fpStep !== "closed" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 relative">
            <button
              type="button"
              onClick={() => setFpStep("closed")}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {fpSuccess ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7 text-green-500" />
                </div>
                <p className="text-sm text-green-700 font-medium">{fpSuccess}</p>
              </div>
            ) : fpStep === "email" ? (
              <form onSubmit={handleForgotRequest}>
                <h3 className="text-lg font-bold text-[#0B1F4B] mb-1">Forgot Password</h3>
                <p className="text-xs text-slate-500 mb-5">Enter your registered email to receive a reset code.</p>
                {fpError && <p className="text-xs text-red-500 mb-3 bg-red-50 rounded-lg px-3 py-2">{fpError}</p>}
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative mb-5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" required value={fpEmail} onChange={(e) => setFpEmail(e.target.value)}
                    placeholder="your@company.com"
                    className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#014E9C] focus:outline-none focus:ring-2 focus:ring-[#014E9C]/15 transition-all" />
                </div>
                <Button type="submit" disabled={fpLoading} className="w-full">
                  {fpLoading ? "Sending…" : "Send Reset Code"}
                </Button>
              </form>
            ) : fpStep === "otp" ? (
              <form onSubmit={handleForgotVerify}>
                <h3 className="text-lg font-bold text-[#0B1F4B] mb-1">Enter Reset Code</h3>
                <p className="text-xs text-slate-500 mb-5">A 6-digit code was sent to <span className="font-semibold text-[#014E9C]">{fpEmail}</span>.</p>
                {fpError && <p className="text-xs text-red-500 mb-3 bg-red-50 rounded-lg px-3 py-2">{fpError}</p>}
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">OTP Code</label>
                <input type="text" required maxLength={6} value={fpOtp} onChange={(e) => setFpOtp(e.target.value)}
                  placeholder="123456"
                  className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#014E9C] focus:outline-none focus:ring-2 focus:ring-[#014E9C]/15 transition-all mb-5 tracking-widest text-center text-lg font-bold" />
                <Button type="submit" disabled={fpLoading} className="w-full">
                  {fpLoading ? "Verifying…" : "Verify Code"}
                </Button>
                <button type="button" onClick={() => setFpStep("email")} className="mt-3 w-full text-xs text-slate-500 hover:text-[#014E9C] transition cursor-pointer">
                  ← Back / Resend code
                </button>
              </form>
            ) : (
              <form onSubmit={handleForgotReset}>
                <h3 className="text-lg font-bold text-[#0B1F4B] mb-1">Set New Password</h3>
                <p className="text-xs text-slate-500 mb-5">Choose a strong password for your account.</p>
                {fpError && <p className="text-xs text-red-500 mb-3 bg-red-50 rounded-lg px-3 py-2">{fpError}</p>}
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">New Password</label>
                <div className="relative mb-3">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="password" required minLength={8} value={fpNewPass} onChange={(e) => setFpNewPass(e.target.value)}
                    placeholder="At least 8 characters"
                    className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#014E9C] focus:outline-none focus:ring-2 focus:ring-[#014E9C]/15 transition-all" />
                </div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm Password</label>
                <div className="relative mb-5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="password" required minLength={8} value={fpConfirmPass} onChange={(e) => setFpConfirmPass(e.target.value)}
                    placeholder="Repeat your new password"
                    className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#014E9C] focus:outline-none focus:ring-2 focus:ring-[#014E9C]/15 transition-all" />
                </div>
                <Button type="submit" disabled={fpLoading} className="w-full">
                  {fpLoading ? "Resetting…" : "Reset Password"}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HRLoginPage() {
  return (
    <React.Suspense
      fallback={
        <PageLoader
          label="WeGrow Skill Campus"
          subLabel="Loading recruiter portal..."
          fullScreen={true}
        />
      }
    >
      <HRLoginContent />
    </React.Suspense>
  );
}
