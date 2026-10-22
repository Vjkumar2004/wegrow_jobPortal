"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Mail,
  KeyRound,
  Lock,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { authApi } from "@/lib/api/auth.api";
import { studentService } from "@/services/student.service";

type PwStep = "idle" | "verify_otp" | "set_password" | "done";

export default function StudentSettingsPage() {
  const [email, setEmail] = useState("");
  const [pwStep, setPwStep] = useState<PwStep>("idle");
  const [otpInput, setOtpInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    studentService
      .getProfile()
      .then((p) => {
        setEmail(p.email || "");
      })
      .catch(() => {});
  }, []);

  const showMsg = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4500);
  };

  const handleRequestOtp = async () => {
    if (!email) {
      showMsg("Could not retrieve your registered email. Please refresh the page.", "error");
      return;
    }
    setIsLoading(true);
    try {
      await authApi.forgotPassword(email);
      setPwStep("verify_otp");
      showMsg("A 6-digit reset code has been sent to your registered email.");
    } catch (err: any) {
      showMsg(
        err?.response?.data?.message || "Failed to send reset code. Please try again.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput.trim()) {
      showMsg("Please enter the 6-digit OTP code.", "error");
      return;
    }
    setIsLoading(true);
    try {
      await authApi.verifyResetCode(email, otpInput.trim());
      setPwStep("set_password");
    } catch (err: any) {
      showMsg(err?.response?.data?.message || "Invalid or expired OTP code.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      showMsg("Password must be at least 8 characters long.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showMsg("Passwords do not match.", "error");
      return;
    }
    setIsLoading(true);
    try {
      await authApi.resetPassword(email, otpInput.trim(), newPassword);
      setPwStep("done");
      setOtpInput("");
      setNewPassword("");
      setConfirmPassword("");
      showMsg("Password reset successfully!");
    } catch (err: any) {
      showMsg(err?.response?.data?.message || "Failed to reset password.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-3xl mx-auto w-full">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-top-2 duration-200 ${
            toast.type === "success"
              ? "bg-[#0B1F4B] text-white border-blue-400/20"
              : "bg-rose-600 text-white border-rose-300/30"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-[#22B573] shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-white shrink-0" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FF] text-[#1E5BE0] text-xs font-bold uppercase tracking-wider mb-2">
          <Shield className="w-3.5 h-3.5" /> Security &amp; Credentials
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4B] tracking-tight">
          Password Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7694] mt-1">
          Update and manage your candidate portal login password credentials.
        </p>
      </div>

      {/* Main Password Management Card */}
      <div className="bg-white rounded-2xl border border-[#EEF1F7] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3.5 pb-5 border-b border-[#EEF1F7]">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center shrink-0 shadow-inner">
            <Lock className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0B1F4B]">Reset Login Password</h2>
            <p className="text-xs text-[#6B7694] mt-0.5">
              Secure authentication via registered email OTP verification
            </p>
          </div>
        </div>

        {/* Multi-step Reset Workflow */}
        {pwStep === "idle" || pwStep === "done" ? (
          <div className="space-y-5">
            {pwStep === "done" && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Your password has been changed successfully. You can now use your new password for future logins.</span>
              </div>
            )}

            <div className="p-4 rounded-xl bg-[#F7F9FD] border border-[#EEF1F7] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0B1F4B]">
                <KeyRound className="w-4 h-4 text-[#1E5BE0]" />
                <span>How password reset works</span>
              </div>
              <p className="text-xs text-[#6B7694] leading-relaxed">
                Clicking the button below will immediately send a secure 6-digit verification code to your registered account email. Once verified, you can set a new password.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRequestOtp}
              disabled={isLoading}
              className="w-full sm:w-auto h-11 px-6 bg-[#1E5BE0] hover:bg-[#1548b8] disabled:opacity-60 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sending Reset Code…</span>
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  <span>Send Reset Code to Email</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        ) : pwStep === "verify_otp" ? (
          <form onSubmit={handleVerifyOtp} className="space-y-5 max-w-md">
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-[#014E9C]">
              We have sent a 6-digit verification code to your registered email address. Please enter it below.
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B1F4B] uppercase tracking-wider mb-2">
                Enter 6-Digit OTP Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                autoFocus
                className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-center text-lg font-mono font-bold tracking-[0.4em] text-slate-900 focus:border-[#1E5BE0] focus:ring-2 focus:ring-[#1E5BE0]/15 outline-none transition-all placeholder:tracking-normal placeholder:font-normal placeholder:text-sm"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isLoading || otpInput.trim().length !== 6}
                className="flex-1 h-11 bg-[#1E5BE0] hover:bg-[#1548b8] disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Code…</span>
                  </>
                ) : (
                  <>
                    <span>Verify Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPwStep("idle");
                  setOtpInput("");
                }}
                className="h-11 px-4 text-xs font-semibold text-slate-500 hover:text-slate-800 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSetPassword} className="space-y-4 max-w-md">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>OTP verified. Please choose your new password.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B1F4B] mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full h-11 text-xs text-slate-800 px-3.5 pr-10 rounded-xl border border-slate-200 focus:border-[#1E5BE0] focus:ring-2 focus:ring-[#1E5BE0]/15 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B1F4B] mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full h-11 text-xs text-slate-800 px-3.5 pr-10 rounded-xl border border-slate-200 focus:border-[#1E5BE0] focus:ring-2 focus:ring-[#1E5BE0]/15 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-11 bg-[#1E5BE0] hover:bg-[#1548b8] disabled:opacity-60 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Updating Password…</span>
                  </>
                ) : (
                  <>
                    <span>Save New Password</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPwStep("idle");
                  setOtpInput("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="h-11 px-4 text-xs font-semibold text-slate-500 hover:text-slate-800 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
