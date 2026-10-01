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
  ShieldCheck,
  Building2,
  Award,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { authService } from "@/services/auth.service";

function StudentLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/student/dashboard";

  const [email, setEmail] = useState("aarav.sharma@example.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await authService.login({
        email,
        password,
        role: "STUDENT",
      });
      router.push(redirectUrl);
    } catch {
      setError("Invalid student credentials. Please check your email and password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex">
      {/* ================= LEFT SIDE: VISUAL BRAND SHOWCASE ================= */}
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
              <span>Direct applications to 500+ verified corporate recruiters</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <div className="w-6 h-6 rounded-full bg-[#F79400]/20 text-[#F79400] flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span>Real-time status tracking for applied jobs and interviews</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <div className="w-6 h-6 rounded-full bg-[#F79400]/20 text-[#F79400] flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>Verified skill assessments & portfolio validation</span>
            </div>
          </div>
        </div>

        {/* Bottom Floating Testimonial Card */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 xl:p-5 shadow-2xl">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F79400] to-amber-300 flex items-center justify-center text-slate-900 font-bold text-sm shadow">
              AS
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Aarav Sharma</p>
              <p className="text-[11px] text-slate-300">Software Engineer Intern @ Infosys</p>
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
            className="text-xs font-semibold text-slate-500 hover:text-[#014E9C]"
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

          {/* Quick Demo Fill Helper */}
          <div className="mb-6 p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
            <div className="text-slate-700">
              <span className="font-semibold text-[#014E9C]">Demo Account:</span>{" "}
              <span className="font-mono text-slate-600">aarav.sharma@example.com</span>
            </div>
            <button
              type="button"
              onClick={() => handleQuickFill("aarav.sharma@example.com")}
              className="px-2.5 py-1 text-xs font-bold text-[#014E9C] bg-white rounded-md shadow-sm border border-blue-200 hover:bg-blue-50 transition"
            >
              Fill Demo
            </button>
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
                  placeholder="student@college.edu or email@example.com"
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
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-11 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-[#014E9C] focus:outline-none focus:ring-2 focus:ring-[#014E9C]/15"
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
              className="w-full mt-2 font-bold bg-[#014E9C] hover:bg-[#013d7a] text-white py-3 rounded-xl shadow-md shadow-[#014E9C]/20 flex items-center justify-center gap-2 group transition-all"
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
    <React.Suspense fallback={<div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center text-slate-500">Loading student portal...</div>}>
      <StudentLoginContent />
    </React.Suspense>
  );
}
