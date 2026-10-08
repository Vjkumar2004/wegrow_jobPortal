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
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Building2,
  Award,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { authService } from "@/services/auth.service";
import { PageLoader } from "@/components/common/PageLoader";

function StudentLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/student/dashboard";

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
      } else {
        router.push(redirectUrl);
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
        (code === "APPLICATION_REJECTED" ||
          code === "REJECTED" ||
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
      } else if (status === 401 || code === "INVALID_CREDENTIALS") {
        setError("Invalid email or password.");
      } else if (
        status === 403 &&
        (code === "EMAIL_NOT_VERIFIED" || message?.includes("verify your email"))
      ) {
        router.push(
          `/verify-email?email=${encodeURIComponent(email)}&role=STUDENT`
        );
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
            src="/student-login-bg.jpg"
            alt="Student Career Success"
            fill
            priority
            className="object-cover object-center opacity-45 transform scale-105 transition-transform duration-1000 ease-out hover:scale-100"
          />
          {/* Subtle gradient scrim for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#051124] via-[#014E9C]/60 to-[#051329]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(247,148,0,0.18),transparent_50%)]" />
        </div>

        {/* Top Header / Branding */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/"
            className="inline-block group focus:outline-none"
            aria-label="WeGrow Skill Campus Home"
          >
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
            <Sparkles className="w-3.5 h-3.5 text-[#F79400]" /> Empowering 50,000+ Students
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight tracking-tight mb-4">
            Accelerate your career with verified opportunities.
          </h1>

          <p className="text-sm xl:text-base text-slate-200/90 leading-relaxed mb-8">
            Access exclusive campus hiring drives, verified internships, direct company evaluations, and live interview schedules designed for students.
          </p>

          {/* Value props */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <div className="w-6 h-6 rounded-full bg-[#F79400]/20 text-[#F79400] flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>Exclusive verified campus placement opportunities</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <div className="w-6 h-6 rounded-full bg-[#F79400]/20 text-[#F79400] flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span>Real-time application status & screening updates</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <div className="w-6 h-6 rounded-full bg-[#F79400]/20 text-[#F79400] flex items-center justify-center flex-shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <span>Direct interview schedules with top corporate recruiters</span>
            </div>
          </div>
        </div>

        {/* Bottom Testimonial Banner */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#F79400] to-amber-300 text-slate-900 font-bold text-xs flex items-center justify-center shrink-0">
              AS
            </div>
            <div>
              <div className="text-xs font-bold text-white">Ananya Sharma</div>
              <div className="text-[11px] text-slate-300">Software Engineer Intern • Placed 2026</div>
            </div>
            <div className="ml-auto flex items-center gap-1 text-[#F79400] text-xs font-semibold">
              <Award className="w-4 h-4" />
              <span>Campus Placed</span>
            </div>
          </div>
          <p className="text-xs text-slate-200/90 mt-2.5 italic">
            &ldquo;WeGrow helped me land my dream internship in tech within 2 weeks of applying through our college placement drive.&rdquo;
          </p>
        </div>
      </div>

      {/* ================= RIGHT SIDE: DUAL ADAPTIVE FORM AREA ================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between py-8 sm:py-10 px-4 sm:px-12 xl:px-20 overflow-y-auto">
        {/* --- MOBILE-ONLY TOP HEADER (Brand Logo + Home Link) --- */}
        <div className="flex lg:hidden items-center justify-between pb-4 border-b border-slate-200/80 mb-6">
          <Link href="/" className="inline-block focus:outline-none" aria-label="WeGrow Skill Campus Home">
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
            className="text-xs font-semibold text-slate-500 hover:text-[#014E9C]"
          >
            ← Home
          </Link>
        </div>

        {/* --- FORM WRAPPER: Responsive (Elevated Card on Mobile, Classic Spacious on Desktop) --- */}
        <div className="max-w-md w-full mx-auto my-auto py-2 lg:py-4">
          {/* MOBILE ONLY: Role Switcher Pill */}
          <div className="lg:hidden bg-slate-200/70 p-1 rounded-xl mb-5 flex items-center">
            <button
              type="button"
              className="flex-1 py-2 px-3 text-xs font-bold rounded-lg bg-white text-[#014E9C] shadow-sm flex items-center justify-center gap-1.5"
            >
              <GraduationCap className="w-4 h-4 text-[#014E9C]" />
              <span>Student Login</span>
            </button>
            <Link
              href="/hr/login"
              className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5"
            >
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>Recruiter / HR</span>
            </Link>
          </div>

          {/* Form Container: Card on mobile (bg-white rounded-3xl p-6 shadow-sm), Seamless on desktop */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(1,78,156,0.06)] border border-slate-100 lg:bg-transparent lg:rounded-none lg:p-0 lg:shadow-none lg:border-none">
            {/* --- DESKTOP HEADER (Classic Left-aligned) --- */}
            <div className="hidden lg:block mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#014E9C] text-xs font-bold uppercase tracking-wider mb-3">
                <GraduationCap className="w-4 h-4 text-[#014E9C]" />
                Student Portal
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, Student
              </h2>
              <p className="text-sm text-slate-500 mt-1.5">
                Sign in to manage your job applications, view shortlisted status, and attend upcoming interviews.
              </p>
            </div>

            {/* --- MOBILE HEADER (Centered with Emoji) --- */}
            <div className="lg:hidden mb-6 text-center">
              <h2 className="text-2xl font-bold text-[#0B1F4B] tracking-tight">
                Welcome back 👋
              </h2>
              <p className="text-xs text-[#6B7694] mt-1.5 leading-relaxed max-w-xs mx-auto">
                Sign in with your student credentials to access jobs and interviews.
              </p>
            </div>

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
                  htmlFor="student-email"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Registered Student Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="student-email"
                    type="email"
                    required
                    placeholder="Enter your student email"
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
                    htmlFor="student-password"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs font-semibold text-[#014E9C] hover:text-[#F79400] transition"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="student-password"
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

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#014E9C] focus:ring-[#014E9C] cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-600">
                    Keep me logged in on this browser
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
                <span>Sign In to Student Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </form>

            {/* Alternate Role Redirection */}
            <div className="mt-8 pt-6 border-t border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Don&apos;t have a student account?</span>
                <Link
                  href="/student/register"
                  className="font-bold text-[#F79400] hover:text-[#d47f00] hover:underline transition"
                >
                  Register Free
                </Link>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span className="text-xs text-slate-600 font-medium">Are you an Employer or HR?</span>
                </div>
                <Link
                  href="/hr/login"
                  className="text-xs font-bold text-[#014E9C] hover:underline"
                >
                  Recruiter Login →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer / Copyright */}
        <div className="pt-6 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} WeGrow Skill Campus. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default function StudentLoginPage() {
  return (
    <React.Suspense
      fallback={
        <PageLoader
          label="WeGrow Skill Campus"
          subLabel="Loading student portal..."
          fullScreen={true}
        />
      }
    >
      <StudentLoginContent />
    </React.Suspense>
  );
}
