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
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth.api";
import { authService } from "@/services/auth.service";
import { studentService } from "@/services/student.service";

type PwStep = "idle" | "verify_otp" | "set_password" | "done";

export default function StudentSettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pwStep, setPwStep] = useState<PwStep>("idle");
  const [otpInput, setOtpInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Danger zone account deletion state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteAccount = async () => {
    if (deleteConfirmInput.trim().toUpperCase() !== "DELETE") {
      showMsg('Please type "DELETE" into the confirmation box.', "error");
      return;
    }
    setIsDeleting(true);
    try {
      await studentService.deleteAccount();
      await authService.logout();
      showMsg("Your account and all associated data have been permanently deleted.");
      setTimeout(() => {
        router.push("/?deleted=true");
      }, 1500);
    } catch (err: any) {
      showMsg(
        err?.response?.data?.message || "Failed to delete account. Please try again or contact support.",
        "error"
      );
      setIsDeleting(false);
    }
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

      {/* Danger Zone: Account Deletion */}
      <div className="bg-white rounded-2xl border border-rose-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3.5 pb-5 border-b border-rose-100">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 shadow-inner">
            <AlertCircle className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-rose-950">Danger Zone: Account Deletion</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Permanently erase your student profile, uploaded resumes, and application records
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100 text-xs text-rose-900 space-y-2">
          <p className="font-bold">What happens when you delete your account:</p>
          <ul className="list-disc pl-5 space-y-1 text-rose-800">
            <li>Your candidate profile, educational history, skills, and projects will be permanently wiped.</li>
            <li>All uploaded PDF resumes and profile pictures stored in cloud storage will be permanently purged.</li>
            <li>All active job applications, interview schedules, and saved jobs will be cancelled and deleted.</li>
            <li>This action is irreversible and your account cannot be recovered.</li>
          </ul>
        </div>

        {!showDeleteModal ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div className="text-xs text-slate-500">
              Need more details on data retention or external deletion? Read our{" "}
              <a href="/delete-account" target="_blank" className="text-[#0756A8] font-bold hover:underline">
                Account Deletion Guide
              </a>
              .
            </div>
            <button
              type="button"
              onClick={() => {
                setDeleteConfirmInput("");
                setShowDeleteModal(true);
              }}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs active:scale-95 shrink-0"
            >
              Delete My Account
            </button>
          </div>
        ) : (
          <div className="p-5 bg-slate-50 rounded-2xl border border-rose-200 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                To confirm permanent deletion, type <span className="text-rose-600 font-mono">DELETE</span> below:
              </label>
              <input
                type="text"
                placeholder="Type DELETE"
                value={deleteConfirmInput}
                onChange={(e) => setDeleteConfirmInput(e.target.value)}
                className="w-full h-11 text-xs text-slate-900 px-3.5 rounded-xl border border-rose-300 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-mono"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmInput.trim().toUpperCase() !== "DELETE" || isDeleting}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
              >
                {isDeleting ? "Deleting Account…" : "Permanently Delete Account"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmInput("");
                }}
                disabled={isDeleting}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
