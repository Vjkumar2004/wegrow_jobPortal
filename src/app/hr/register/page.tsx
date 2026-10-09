"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Building2,
  Mail,
  Lock,
  User,
  Phone,
  Globe,
  MapPin,
  Users,
  Camera,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  FileText,
  Clock,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { authService } from "@/services/auth.service";
import { adminService } from "@/services/admin.service";

export default function HRRegisterPage() {
  const router = useRouter();

  // Step 1: Corporate Identity & Recruiter Details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Step 2: Company Profile & Branding (identical to HR Dashboard Company Profile fields)
  const [companyName, setCompanyName] = useState("");
  const [tagline, setTagline] = useState("");
  const [industry, setIndustry] = useState("Information Technology & Services");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [size, setSize] = useState("10 - 20 employees");
  const [hrEmail, setHrEmail] = useState("");
  const [hrPhone, setHrPhone] = useState("");
  const [description, setDescription] = useState("");
  const [culture, setCulture] = useState("");

  // Upload previews
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(null);
  const [recruiterAvatarUrl, setRecruiterAvatarUrl] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Form progression state
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Please select a valid image file (PNG, JPEG, WebP, or SVG).");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("Company logo must be under 2MB in size.");
      return;
    }

    setErrorMessage("");
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) setCompanyLogoUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) setRecruiterAvatarUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [errorMessage, setErrorMessage] = useState("");

  const handleProceedToProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!hrEmail) setHrEmail(email);
    if (!hrPhone) setHrPhone(phone);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const mappedSize =
        size === "100,000+ employees" || size === "10,000+ employees" || size === "1,000 - 10,000 employees"
          ? "SIZE_500_PLUS"
          : size === "200 - 1,000 employees"
          ? "SIZE_201_500"
          : size === "50 - 200 employees"
          ? "SIZE_51_200"
          : "SIZE_11_50";

      // 1. Register corporate HR user account with backend including logo & company profile
      await authService.register({
        name: name.trim(),
        email: email.trim(),
        companyName: companyName.trim(),
        phone: hrPhone.trim() || phone.trim(),
        password,
        role: "HR",
        companyWebsite: website.trim() || undefined,
        companyIndustry: industry.trim() || undefined,
        companyLocation: location.trim() || undefined,
        designation: "Hiring Lead",
        companyLogo: companyLogoUrl || undefined,
        companySize: mappedSize,
        about: description.trim() || undefined,
        tagline: tagline.trim() || undefined,
        culture: culture.trim() || undefined,
      });

      // 2. Temporarily keep company profile in sessionStorage for onboarding right after verification
      const companyOnboardingData = {
        companyName: companyName.trim(),
        tagline: tagline.trim() || undefined,
        culture: culture.trim() || undefined,
        logoUrl: companyLogoUrl || undefined,
        website: website.trim() || undefined,
        industry: industry.trim() || undefined,
        companySize: mappedSize,
        location: location.trim() || undefined,
        about: description.trim() || undefined,
        fullName: name.trim() || undefined,
        designation: "Hiring Lead",
        phone: hrPhone.trim() || phone.trim() || undefined,
      };

      try {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("wegrow_hr_onboarding_" + email.trim().toLowerCase(), JSON.stringify(companyOnboardingData));
        }
      } catch (storageErr) {
        console.warn("Could not save onboarding data to sessionStorage:", storageErr);
      }

      // Navigate to email verification for HR
      router.push(`/verify-email?email=${encodeURIComponent(email)}&role=HR`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Registration failed. Please check your credentials.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 px-4 sm:px-6 lg:px-8">
      {/* Top Navbar / Branding */}
      <div className="max-w-4xl mx-auto flex items-center justify-between pb-8">
        <Link href="/" className="inline-block group" aria-label="WeGrow Skill Campus Home">
          <div className="bg-white/95 px-3.5 py-2 rounded-xl inline-flex items-center shadow-sm border border-slate-200/80 transition-transform duration-200 group-hover:scale-105">
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
          href="/hr/login"
          className="text-xs font-semibold text-slate-600 hover:text-[#0756A8] bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs transition"
        >
          Already registered? <span className="font-bold text-[#0756A8]">Sign In</span>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        {submittedSuccess ? (
          /* ================= SUCCESS SUBMISSION STATE (PENDING ADMIN APPROVAL) ================= */
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-slate-200/50 border border-slate-200/90 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#FF6B00] flex items-center justify-center mx-auto mb-5 border border-amber-200">
              <Clock className="w-8 h-8" />
            </div>

            <span className="inline-block px-3 py-1 bg-amber-50 text-[#FF6B00] rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              Application Under Review • Approval Pending
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Company Profile Submitted for Moderation!
            </h1>

            <p className="text-sm text-slate-600 max-w-lg mx-auto mt-3 leading-relaxed">
              Thank you, <span className="font-bold text-slate-900">{name}</span>. Your employer account and full corporate profile setup for <span className="font-bold text-slate-900">{companyName}</span> has been dispatched to the <span className="font-semibold text-[#0756A8]">WeGrow Admin Dashboard</span> for moderation and verification.
            </p>

            <div className="my-8 max-w-md mx-auto bg-slate-50 rounded-2xl p-5 border border-slate-200/80 text-left space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Company Name:</span>
                <span className="font-bold text-slate-900">{companyName}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">HR Official Email:</span>
                <span className="font-semibold text-slate-800">{email}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Moderation Status:</span>
                <span className="px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 text-[11px]">
                  Pending Admin Approval
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Estimated Review Time:</span>
                <span className="font-semibold text-emerald-600">Within 24 business hours</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="primary"
                size="md"
                className="w-full sm:w-auto font-bold bg-[#0756A8] hover:bg-[#06478a]"
                onClick={() => router.push("/admin/hr-management")}
              >
                Go to Admin Dashboard to Review & Approve →
              </Button>
              <Button
                variant="outline"
                size="md"
                className="w-full sm:w-auto font-bold text-slate-700"
                onClick={() => router.push("/hr/login")}
              >
                Return to HR Sign In
              </Button>
            </div>
          </div>
        ) : (
          /* ================= MULTI-STEP FULL PROFILE REGISTRATION FORM ================= */
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/90 overflow-hidden">
            {/* Header Banner */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-[#FFF5EE] via-[#F4F8FF] to-[#E9F2FF] border-b border-slate-100">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0756A8] text-xs font-bold uppercase tracking-wider mb-2">
                <Building2 className="w-3.5 h-3.5" /> Corporate Partner Setup
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Register Your Company Profile
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                Set up your official corporate entity, upload company branding, and complete your recruiter profile to hire 50,000+ top graduates.
              </p>

              {/* Step indicator */}
              <div className="flex items-center gap-3 mt-6">
                <div
                  onClick={() => setStep(1)}
                  className={`flex items-center gap-2 cursor-pointer transition ${
                    step === 1 ? "text-[#0756A8] font-bold" : "text-slate-500 font-medium"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      step === 1
                        ? "bg-[#0756A8] text-white"
                        : "bg-emerald-100 text-emerald-700 font-bold"
                    }`}
                  >
                    1
                  </span>
                  <span className="text-xs">Recruiter Credentials</span>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300" />

                <div
                  className={`flex items-center gap-2 ${
                    step === 2 ? "text-[#0756A8] font-bold" : "text-slate-400 font-medium"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      step === 2 ? "bg-[#0756A8] text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    2
                  </span>
                  <span className="text-xs">Company Profile & Branding</span>
                </div>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="mt-4 p-3.5 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* Hidden File Inputs */}
            <input
              type="file"
              ref={logoInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
            <input
              type="file"
              ref={avatarInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />

            {/* STEP 1: Recruiter & Account Setup */}
            {step === 1 && (
              <form className="p-6 sm:p-8 space-y-6" onSubmit={handleProceedToProfile}>
                <div className="space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#0756A8] pb-1 border-b border-slate-100">
                    Step 1: Recruiter & Login Information
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                        Recruiter Full Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sneha Roy"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-[#F8FAFD] border border-slate-200 text-slate-900 text-xs pl-10 pr-3.5 py-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0756A8]/20 focus:border-[#0756A8]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                        Official Entity / Company Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Infosys Technologies"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full bg-[#F8FAFD] border border-slate-200 text-slate-900 text-xs pl-10 pr-3.5 py-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0756A8]/20 focus:border-[#0756A8]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                        Corporate Work Email *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          required
                          placeholder="sneha@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#F8FAFD] border border-slate-200 text-slate-900 text-xs pl-10 pr-3.5 py-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0756A8]/20 focus:border-[#0756A8]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                        Contact Desk / Mobile Phone *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 00000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-[#F8FAFD] border border-slate-200 text-slate-900 text-xs pl-10 pr-3.5 py-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0756A8]/20 focus:border-[#0756A8]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                      Create Secure Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        required
                        minLength={6}
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#F8FAFD] border border-slate-200 text-slate-900 text-xs pl-10 pr-3.5 py-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0756A8]/20 focus:border-[#0756A8]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <span className="text-xs text-slate-500">
                    Next: Set up your company logo & public profile
                  </span>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="font-bold bg-[#0756A8] hover:bg-[#06478a] flex items-center gap-2"
                  >
                    <span>Continue to Company Profile Setup</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            )}

            {/* STEP 2: Full Company Profile Setup (Mirroring HR Dashboard fields) */}
            {step === 2 && (
              <form className="p-6 sm:p-8 space-y-7" onSubmit={handleFinalSubmit}>
                {/* Visual Brand Showcase Card (Logo & Recruiter Avatar Upload) */}
                <div className="bg-[#F8FAFD] rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                    {/* Company Logo Upload */}
                    <div className="relative group">
                      <div
                        onClick={() => logoInputRef.current?.click()}
                        className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#0756A8] to-blue-500 text-white font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-md cursor-pointer overflow-hidden border-2 border-white hover:opacity-90 transition"
                        title="Upload official company logo"
                      >
                        {companyLogoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={companyLogoUrl} alt="Company Logo" className="w-full h-full object-cover" />
                        ) : (
                          <span>{companyName ? companyName.slice(0, 3).toUpperCase() : "LOGO"}</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0756A8] text-white flex items-center justify-center shadow-md hover:scale-110 transition border-2 border-white cursor-pointer"
                        title="Upload Logo"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <h3 className="text-base font-bold text-slate-900">{companyName || "Your Company"}</h3>
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          Pending Approval
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{tagline || "Add your corporate motto or tagline"}</p>
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="text-xs text-[#0756A8] font-bold hover:underline cursor-pointer mt-2 inline-block"
                      >
                        {companyLogoUrl ? "Replace Logo" : "Upload Official Company Logo (PNG / JPG)"} ↗
                      </button>
                    </div>
                  </div>

                  {/* Recruiter Avatar Upload */}
                  <div className="flex items-center gap-3.5 bg-white p-3 rounded-xl border border-slate-200 shrink-0 shadow-xs">
                    <div className="relative">
                      <div
                        onClick={() => avatarInputRef.current?.click()}
                        className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-tr from-[#F79400] to-amber-400 text-white font-bold text-sm flex items-center justify-center shadow-sm shrink-0 cursor-pointer border-2 border-white hover:opacity-90 transition"
                      >
                        {recruiterAvatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={recruiterAvatarUrl} alt="Recruiter Photo" className="w-full h-full object-cover" />
                        ) : (
                          <span>{name ? name.slice(0, 2).toUpperCase() : "HR"}</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#F79400] text-white flex items-center justify-center shadow-sm border border-white cursor-pointer"
                      >
                        <Camera className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <div className="text-left text-xs">
                      <div className="font-bold text-slate-900">{name || "Recruiter"}</div>
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="text-[11px] text-[#F79400] font-semibold hover:underline block cursor-pointer mt-0.5"
                      >
                        Upload Photo →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section 1: Detailed Identifiers */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0756A8] pb-1 border-b border-slate-100 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" /> Corporate Identifiers & Contact Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                        Official Entity Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full bg-[#F8FAFD] border border-slate-200 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0756A8]/20 focus:border-[#0756A8]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                        Corporate Tagline / Motto
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Navigate Your Next — Enterprise Digital Consulting"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        className="w-full bg-[#F8FAFD] border border-slate-200 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0756A8]/20 focus:border-[#0756A8]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                        Industry Sector *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Information Technology & Services"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full bg-[#F8FAFD] border border-slate-200 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0756A8]/20 focus:border-[#0756A8]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                        Official Website *
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://company.com"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="w-full bg-[#F8FAFD] border border-slate-200 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0756A8]/20 focus:border-[#0756A8]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                        Workforce Scale *
                      </label>
                      <select
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="w-full bg-[#F8FAFD] border border-slate-200 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0756A8]/20 focus:border-[#0756A8] cursor-pointer"
                      >
                        <option value="10 - 20 employees">10 - 20 employees</option>
                        <option value="20 - 50 employees">20 - 50 employees</option>
                        <option value="50 - 200 employees">50 - 200 employees</option>
                        <option value="200 - 1,000 employees">200 - 1,000 employees</option>
                        <option value="1,000 - 10,000 employees">1,000 - 10,000 employees</option>
                        <option value="10,000+ employees">10,000+ employees</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                        Headquarters Address / City *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bengaluru, Karnataka"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-[#F8FAFD] border border-slate-200 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0756A8]/20 focus:border-[#0756A8]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                        Campus HR Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="campus.recruitment@company.com"
                        value={hrEmail}
                        onChange={(e) => setHrEmail(e.target.value)}
                        className="w-full bg-[#F8FAFD] border border-slate-200 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0756A8]/20 focus:border-[#0756A8]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                        Campus Desk Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 80 2852 0000"
                        value={hrPhone}
                        onChange={(e) => setHrPhone(e.target.value)}
                        className="w-full bg-[#F8FAFD] border border-slate-200 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0756A8]/20 focus:border-[#0756A8]"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Narrative & Work Culture */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0756A8] pb-1 border-b border-slate-100 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" /> About Organization & Campus Culture
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                      About the Organization *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Give students a summary of your company, mission, core domain, and innovations..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-[#F8FAFD] border border-slate-200 text-slate-900 text-xs p-3.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0756A8]/20 focus:border-[#0756A8] resize-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                      Campus Work Culture & Fresher Onboarding
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe mentor programs, learning stipends, campus hackathons, work flexibility..."
                      value={culture}
                      onChange={(e) => setCulture(e.target.value)}
                      className="w-full bg-[#F8FAFD] border border-slate-200 text-slate-900 text-xs p-3.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0756A8]/20 focus:border-[#0756A8] resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Moderation Notice Pill */}
                <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
                  <ShieldCheck className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Moderation Notice:</span> Upon submission, your company profile will be routed to the WeGrow Admin Dashboard under the <span className="font-bold underline">Pending Moderation</span> queue. The administration team will verify corporate legitimacy before publishing active job slots.
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    ← Back to Step 1
                  </button>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="font-bold bg-[#0756A8] hover:bg-[#06478a] shadow-md shadow-[#0756A8]/20 px-8"
                    isLoading={isLoading}
                  >
                    Send for Admin Approval →
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
