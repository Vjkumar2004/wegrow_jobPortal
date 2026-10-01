"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  School,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Building2,
  Award,
  Phone,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { authService } from "@/services/auth.service";

export default function StudentRegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [degree, setDegree] = useState("B.E / B.Tech");
  const [graduationYear, setGraduationYear] = useState("2026");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify your password.");
      setIsLoading(false);
      return;
    }

    if (!termsAccepted) {
      setError("Please agree to the Terms of Service & Privacy Policy.");
      setIsLoading(false);
      return;
    }

    try {
      await authService.register({
        name,
        email,
        collegeName,
        password,
        role: "STUDENT",
      });
      router.push("/student/dashboard");
    } catch {
      setError("Registration failed. Email might already be registered.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setName("Vijayakumar M");
    setEmail("vijayakumar.m@example.com");
    setPhone("+91 98765 43210");
    setCollegeName("National Institute of Technology (NIT), Trichy");
    setDegree("B.E Computer Science");
    setGraduationYear("2025");
    setPassword("password123");
    setConfirmPassword("password123");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex font-['Poppins',sans-serif]">
      {/* ================= LEFT SIDE: VISUAL BRAND SHOWCASE (Same as Login) ================= */}
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
            <Sparkles className="w-3.5 h-3.5 text-[#F79400]" /> Student Onboarding
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight tracking-tight mb-4">
            Join 50,000+ Students Launching Dream Careers.
          </h1>

          <p className="text-sm xl:text-base text-slate-200/90 leading-relaxed mb-8">
            Create your verified student profile, showcase tech projects, unlock exclusive campus hiring drives, and connect with top recruiters.
          </p>

          {/* Value props */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <div className="w-6 h-6 rounded-full bg-[#F79400]/20 text-[#F79400] flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>100% Free student registration with verified college tag</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <div className="w-6 h-6 rounded-full bg-[#F79400]/20 text-[#F79400] flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span>Direct interview shortlists with ₹4 - ₹15+ LPA salary packages</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <div className="w-6 h-6 rounded-full bg-[#F79400]/20 text-[#F79400] flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>ATS Resume optimization & real-time application tracker</span>
            </div>
          </div>
        </div>

        {/* Bottom Floating Testimonial Card */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 xl:p-5 shadow-2xl">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1E5BE0] to-blue-400 flex items-center justify-center text-white font-bold text-sm shadow">
              VM
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Vijayakumar M</p>
              <p className="text-[11px] text-slate-300">Software Developer Intern @ Bluestock Fintech</p>
            </div>
            <div className="ml-auto flex items-center gap-1 text-[#22B573] text-xs font-semibold">
              <Award className="w-4 h-4" />
              <span>Campus Placed</span>
            </div>
          </div>
          <p className="text-xs text-slate-200/90 mt-2.5 italic">
            &ldquo;WeGrow streamlined my whole campus placement journey — from resume ATS scoring to my final offer.&rdquo;
          </p>
        </div>
      </div>

      {/* ================= RIGHT SIDE: MODERN REGISTRATION FORM ================= */}
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
        <div className="max-w-lg w-full mx-auto my-auto py-4">
          {/* Header */}
          <div className="mb-6">
            <div className="hidden lg:block mb-5">
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#014E9C] text-xs font-bold uppercase tracking-wider mb-2">
              <GraduationCap className="w-4 h-4 text-[#014E9C]" />
              New Student Registration
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Create your Student Account
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Start applying to 500+ verified corporate job openings and internships.
            </p>
          </div>

          {/* Quick Demo Fill Helper */}
          <div className="mb-5 p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
            <div className="text-slate-700">
              <span className="font-semibold text-[#014E9C]">Quick Demo Fill:</span>{" "}
              <span className="text-slate-600">Pre-fill sample NIT student info</span>
            </div>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="px-2.5 py-1 text-xs font-bold text-[#014E9C] bg-white rounded-md shadow-sm border border-blue-200 hover:bg-blue-50 transition cursor-pointer"
            >
              Fill Sample
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
            {/* Full Name */}
            <div>
              <label htmlFor="reg-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="reg-name"
                  type="text"
                  required
                  placeholder="e.g. Vijayakumar M"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-[#014E9C] focus:outline-none focus:ring-2 focus:ring-[#014E9C]/15"
                />
              </div>
            </div>

            {/* Email and Phone in 2 Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-[#014E9C] focus:outline-none focus:ring-2 focus:ring-[#014E9C]/15"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-[#014E9C] focus:outline-none focus:ring-2 focus:ring-[#014E9C]/15"
                  />
                </div>
              </div>
            </div>

            {/* College / Institution Name */}
            <div>
              <label htmlFor="reg-college" className="block text-xs font-semibold text-slate-700 mb-1.5">
                College / University Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <School className="w-4 h-4" />
                </div>
                <input
                  id="reg-college"
                  type="text"
                  required
                  placeholder="e.g. National Institute of Technology (NIT), Trichy"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-[#014E9C] focus:outline-none focus:ring-2 focus:ring-[#014E9C]/15"
                />
              </div>
            </div>

            {/* Degree & Graduation Year in 2 Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="reg-degree" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Course / Degree
                </label>
                <div className="relative">
                  <select
                    id="reg-degree"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-all focus:border-[#014E9C] focus:outline-none focus:ring-2 focus:ring-[#014E9C]/15"
                  >
                    <option value="B.E / B.Tech">B.E / B.Tech</option>
                    <option value="B.E Computer Science">B.E Computer Science</option>
                    <option value="BCA / MCA">BCA / MCA</option>
                    <option value="B.Sc / M.Sc IT">B.Sc / M.Sc IT</option>
                    <option value="M.E / M.Tech">M.E / M.Tech</option>
                    <option value="MBA">MBA</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="reg-grad-year" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Year of Graduation
                </label>
                <select
                  id="reg-grad-year"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-all focus:border-[#014E9C] focus:outline-none focus:ring-2 focus:ring-[#014E9C]/15"
                >
                  <option value="2027">2027 (Pre-final Year)</option>
                  <option value="2026">2026 (Final Year)</option>
                  <option value="2025">2025 (Recent Graduate)</option>
                  <option value="2024">2024 (Experienced)</option>
                </select>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="reg-pass" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-pass"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Min 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-9 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-[#014E9C] focus:outline-none focus:ring-2 focus:ring-[#014E9C]/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="reg-confirm-pass" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-confirm-pass"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-[#014E9C] focus:outline-none focus:ring-2 focus:ring-[#014E9C]/15"
                  />
                </div>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#014E9C] focus:ring-[#014E9C] cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-600 leading-snug">
                  I agree to the{" "}
                  <a href="#" className="text-[#014E9C] hover:underline font-semibold">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-[#014E9C] hover:underline font-semibold">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-3 font-bold bg-[#014E9C] hover:bg-[#013d7a] text-white py-3 rounded-xl shadow-md shadow-[#014E9C]/20 flex items-center justify-center gap-2 group transition-all cursor-pointer"
              isLoading={isLoading}
            >
              <span>Create Free Student Account</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </form>

          {/* Alternate Link to Login */}
          <div className="mt-7 pt-5 border-t border-slate-200/80">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Already registered as a student?</span>
              <Link
                href="/student/login"
                className="font-bold text-[#014E9C] hover:underline transition"
              >
                Sign In to Dashboard →
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
                Recruiter Portal →
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
