"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { authApi } from "@/lib/api/auth.api";
import { getErrorMessage } from "@/lib/api/client";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const roleParam = (searchParams.get("role") || "STUDENT").toUpperCase();

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // 60-second countdown for Resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      setCanResend(false);
      timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, "").slice(0, 6).split("");
      const newOtp = [...otp];
      digits.forEach((digit, idx) => {
        if (index + idx < 6) newOtp[index + idx] = digit;
      });
      setOtp(newOtp);
      const nextFocus = Math.min(index + digits.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const clean = value.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[index] = clean;
    setOtp(newOtp);

    // Auto-advance
    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      setError("Please enter the complete 6-digit OTP code.");
      return;
    }
    if (!email) {
      setError("Please provide your registered email address.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await authApi.verifyEmail({ email, otp: fullOtp });
      setIsVerified(true);
      if (roleParam === "HR") {
        setSuccessMessage("Email verified! Your account is waiting for admin approval before you can sign in.");
        setTimeout(() => {
          router.push("/hr/login?status=pending_approval");
        }, 2500);
      } else {
        setSuccessMessage(res.message || "Email verified successfully! You can now sign in.");
        setTimeout(() => {
          router.push("/student/login");
        }, 2000);
      }
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      if (msg.includes("INVALID_OTP") || msg.toLowerCase().includes("incorrect")) {
        setError("The OTP code you entered is incorrect. Please check and try again.");
      } else if (msg.includes("OTP_EXPIRED") || msg.toLowerCase().includes("expired")) {
        setError("This OTP code has expired. Please request a new one below.");
      } else if (msg.includes("OTP_MAX_ATTEMPTS") || msg.toLowerCase().includes("attempts")) {
        setError("Too many invalid attempts. Please request a new OTP code.");
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;
    if (!email) {
      setError("Please enter your registered email address to receive an OTP.");
      return;
    }

    setIsResending(true);
    setError("");

    try {
      const res = await authApi.resendVerification({ email });
      setSuccessMessage(res.message || "A new 6-digit verification code has been dispatched.");
      setCooldown(60);
      setCanResend(false);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8">
      {/* Brand Top Header */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between pb-6">
        <Link href="/" className="inline-block group" aria-label="WeGrow Skill Campus Home">
          <div className="bg-white/95 px-3.5 py-2 rounded-xl inline-flex items-center shadow-xs border border-slate-200">
            <div className="relative w-36 h-9">
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
          href={roleParam === "HR" ? "/hr/login" : "/student/login"}
          className="text-xs font-semibold text-slate-500 hover:text-[#014E9C]"
        >
          ← Back to Login
        </Link>
      </div>

      {/* Main Card Container */}
      <div className="max-w-md w-full mx-auto bg-white rounded-3xl p-7 sm:p-9 shadow-xl shadow-slate-200/50 border border-slate-200">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#014E9C] flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-xs">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#014E9C] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Two-Factor Verification
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Verify Your Email Address
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
            We sent a secure 6-digit verification code to your email. Enter it below to activate your account.
          </p>
        </div>

        {/* Email Context Field */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Registered Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
              className="block w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-[#014E9C] focus:outline-none focus:ring-2 focus:ring-[#014E9C]/15"
            />
          </div>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 text-rose-700 text-xs rounded-xl font-medium border border-rose-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-3.5 bg-emerald-50 text-emerald-800 text-xs rounded-xl font-medium border border-emerald-200 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* OTP Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 text-center mb-3">
              Enter 6-Digit OTP Code
            </label>
            <div className="flex items-center justify-between gap-2 sm:gap-2.5">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  disabled={isVerified}
                  className="w-11 sm:w-12 h-12 sm:h-14 text-center font-bold text-lg sm:text-xl text-slate-900 rounded-xl border border-slate-200 bg-white focus:border-[#014E9C] focus:ring-2 focus:ring-[#014E9C]/20 focus:outline-none transition shadow-xs"
                />
              ))}
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full font-bold bg-[#014E9C] hover:bg-[#013d7a] text-white py-3 rounded-xl shadow-md shadow-[#014E9C]/20 flex items-center justify-center gap-2"
            isLoading={isLoading}
            disabled={isVerified}
          >
            <span>{isVerified ? "Account Verified!" : "Verify & Activate Account"}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        {/* Resend Cooldown Section */}
        <div className="mt-6 pt-5 border-t border-slate-200/80 text-center">
          <p className="text-xs text-slate-500 mb-2">
            Didn&apos;t receive the code or expired? Check spam or request a new one.
          </p>

          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend || isResending || isVerified}
            className={`inline-flex items-center gap-1.5 text-xs font-bold transition ${
              canResend && !isVerified
                ? "text-[#014E9C] hover:underline cursor-pointer"
                : "text-slate-400 cursor-not-allowed"
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
            {canResend
              ? isResending
                ? "Sending new OTP..."
                : "Resend Verification OTP"
              : `Resend available in ${cooldown}s`}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-6 text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} WeGrow Skill Campus. Secure Authentication System.</p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-slate-500">Loading verification...</div>}>
      <VerifyEmailContent />
    </React.Suspense>
  );
}
