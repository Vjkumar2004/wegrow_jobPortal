"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Activity,
  Users,
  Building2,
  GraduationCap,
  FileSpreadsheet,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { authService } from "@/services/auth.service";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await authService.login({
        email: email.trim(),
        password,
      });

      const userRole = res.data?.user?.role;
      if (userRole === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (userRole === "HR") {
        router.push("/hr/dashboard");
      } else if (userRole === "STUDENT") {
        router.push("/student/dashboard");
      } else {
        router.push("/admin/dashboard");
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { status?: number; data?: { error?: { code?: string; details?: any }; message?: string } } };
      const status = errorObj?.response?.status;
      const code = errorObj?.response?.data?.error?.code;
      const message = errorObj?.response?.data?.message;

      if (status === 403 && (code === "ACCOUNT_SUSPENDED" || message?.toLowerCase().includes("suspended"))) {
        authService.logout();
        setError("Your account has been suspended. Please contact platform support.");
      } else if (status === 401 || code === "INVALID_CREDENTIALS") {
        setError("Invalid email or password.");
      } else if (status === 403 && (code === "EMAIL_NOT_VERIFIED" || message?.includes("verify your email"))) {
        setError("Please verify your email address to continue.");
      } else if (status === 400) {
        setError(message || "Invalid login request. Please check your credentials.");
      } else {
        setError(message || "Failed to authenticate. Please check your email and password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex">
      {/* ================= LEFT SIDE: VISUAL BRAND SHOWCASE ================= */}
      <div className="hidden lg:relative lg:flex lg:w-1/2 flex-col justify-between overflow-hidden bg-[#0A1A2F] text-white p-12 xl:p-16">
        {/* Background Image with layered gradient overlays */}
        <div className="absolute inset-0">
          <Image
            src="/student-login-bg.jpg"
            alt="Campus Administration & Control Center"
            fill
            priority
            className="object-cover object-center opacity-30 transform scale-105 transition-transform duration-1000 ease-out hover:scale-100"
          />
          {/* Subtle gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#051124] via-[#0756A8]/75 to-[#051329]/90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(247,148,0,0.22),transparent_55%)]" />
        </div>

        {/* Top Header / Branding */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="inline-block group" aria-label="WeGrow Skill Campus Home">
            <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl inline-flex items-center shadow-md shadow-black/15 transition-transform duration-200 group-hover:scale-105">
              <div className="relative w-36 sm:w-40 h-9 sm:h-10">
                <Image
                  src="/image.png"
                  alt="WeGrow Skill Campus"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
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
            <Sparkles className="w-3.5 h-3.5 text-[#F79400]" /> Security & Platform Governance
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight tracking-tight mb-4">
            Unified Campus Command & Moderation Hub.
          </h1>

          <p className="text-sm xl:text-base text-slate-200/90 leading-relaxed mb-8">
            Oversee company onboarding approvals, verify student placement registries, monitor real-time audit logs, and trigger mass campus communication alerts.
          </p>

          {/* Value props */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <div className="w-6 h-6 rounded-full bg-[#F79400]/20 text-[#F79400] flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>HR Partner verification & KYC compliance control</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <div className="w-6 h-6 rounded-full bg-[#F79400]/20 text-[#F79400] flex items-center justify-center flex-shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <span>Real-time audit log tracking across all campus actions</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <div className="w-6 h-6 rounded-full bg-[#F79400]/20 text-[#F79400] flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>End-to-end recruitment cycle moderation & dispatch metrics</span>
            </div>
          </div>
        </div>

        {/* Bottom Metrics Pill */}
        <div className="relative z-10 grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl">
          <div className="text-center">
            <div className="text-xl xl:text-2xl font-black text-white">50K+</div>
            <div className="text-[11px] text-slate-300 font-medium">Students Verified</div>
          </div>
          <div className="text-center border-x border-white/15">
            <div className="text-xl xl:text-2xl font-black text-[#F79400]">500+</div>
            <div className="text-[11px] text-slate-300 font-medium">Corporate HRs</div>
          </div>
          <div className="text-center">
            <div className="text-xl xl:text-2xl font-black text-white">99.9%</div>
            <div className="text-[11px] text-slate-300 font-medium">Uptime & Audit</div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE: PROPER MODERN LOGIN FORM ================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between py-10 px-6 sm:px-12 xl:px-20 overflow-y-auto">
        {/* Mobile Header */}
        <div className="flex lg:hidden items-center justify-between pb-6 border-b border-slate-200/80 mb-6">
          <Link href="/" className="inline-block" aria-label="WeGrow Skill Campus Home">
            <div className="relative w-36 h-9">
              <Image
                src="/image.png"
                alt="WeGrow Skill Campus"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>
          <Link
            href="/"
            className="text-xs font-semibold text-slate-500 hover:text-[#0756A8]"
          >
            ← Home
          </Link>
        </div>

        {/* Center Container */}
        <div className="max-w-md w-full mx-auto my-auto py-4">
          {/* Header */}
          <div className="mb-8">
            <div className="hidden lg:block mb-6">
              <Link href="/" className="inline-block" aria-label="WeGrow Skill Campus Home">
                <div className="relative w-40 h-10">
                  <Image
                    src="/image.png"
                    alt="WeGrow Skill Campus"
                    fill
                    className="object-contain object-left"
                    priority
                  />
                </div>
              </Link>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0756A8] text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-4 h-4 text-[#0756A8]" />
              Platform Administration
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign In to Control Center
            </h2>
            <p className="text-sm text-slate-500 mt-1.5">
              Authorized campus and system administrators access only. Authenticate to manage the portal.
            </p>
          </div>

          {/* Idle Timeout Notification Banner */}
          {reason === "idle_timeout" && (
            <div className="mb-4 p-3.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <span>⏱️ You were automatically logged out due to 10 minutes of inactivity for security.</span>
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
            {/* Email Field */}
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Administrator Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  required
                  placeholder="Enter administrator email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-[#0756A8] focus:outline-none focus:ring-2 focus:ring-[#0756A8]/15"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Master Security Key / Password
                </label>
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-amber-500" /> 256-bit AES
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-11 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-[#0756A8] focus:outline-none focus:ring-2 focus:ring-[#0756A8]/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
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

            {/* Remember Session */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#0756A8] focus:ring-[#0756A8] cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-600">
                  Keep admin session active on this workstation
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2 font-bold bg-[#0756A8] hover:bg-[#06468a] text-white py-3 rounded-xl shadow-md shadow-[#0756A8]/20 flex items-center justify-center gap-2 group transition-all"
              isLoading={isLoading}
            >
              <span>Authenticate & Enter Control Center</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </form>

          {/* Security Compliance Notice */}
          <div className="mt-8 pt-6 border-t border-slate-200/80">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                🔒 Restricted Area: All login attempts and IP addresses are recorded in encrypted audit logs for platform security compliance.
              </p>
            </div>
          </div>
        </div>

        {/* Footer / Copyright */}
        <div className="pt-6 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} WeGrow Skill Campus. Platform Administration System.</p>
        </div>
      </div>
    </div>
  );
}
