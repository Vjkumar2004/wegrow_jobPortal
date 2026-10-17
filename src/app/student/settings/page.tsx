"use client";

import React, { useState, useEffect } from "react";
import { Shield, Eye, EyeOff, CheckCircle2, AlertCircle, Mail, KeyRound } from "lucide-react";
import { authApi } from "@/lib/api/auth.api";
import { studentService } from "@/services/student.service";

type PwStep = "idle" | "request_otp" | "verify_otp" | "set_password" | "done";

export default function StudentSettingsPage() {
  const [email, setEmail] = useState("");
  const [degree, setDegree] = useState("");
  const [pwStep, setPwStep] = useState<PwStep>("idle");
  const [otpInput, setOtpInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    studentService.getProfile().then((p) => {
      setEmail(p.email || "");
      setDegree(p.degreeName || "");
    }).catch(() => {});
  }, []);

  const showMsg = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4500);
  };

  const handleRequestOtp = async () => {
    if (!email) { showMsg("Could not determine your email. Please refresh.", "error"); return; }
    setIsLoading(true);
    try {
      await authApi.forgotPassword(email);
      setPwStep("verify_otp");
      showMsg("A reset code has been sent to your email address.");
    } catch (err: any) {
      showMsg(err?.response?.data?.message || "Failed to send reset code. Please try again.", "error");
    } finally { setIsLoading(false); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput.trim()) { showMsg("Please enter the OTP.", "error"); return; }
    setIsLoading(true);
    try {
      await authApi.verifyResetCode(email, otpInput);
      setPwStep("set_password");
    } catch (err: any) {
      showMsg(err?.response?.data?.message || "Invalid or expired OTP.", "error");
    } finally { setIsLoading(false); }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) { showMsg("Password must be at least 8 characters.", "error"); return; }
    if (newPassword !== confirmPassword) { showMsg("Passwords do not match.", "error"); return; }
    setIsLoading(true);
    try {
      await authApi.resetPassword(email, otpInput, newPassword);
      setPwStep("done");
      setOtpInput(""); setNewPassword(""); setConfirmPassword("");
      showMsg("Password updated successfully!");
    } catch (err: any) {
      showMsg(err?.response?.data?.message || "Failed to reset password.", "error");
    } finally { setIsLoading(false); }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${toast.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {toast.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {toast.msg}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-black text-[#0B1F4B] tracking-tight">Account Settings</h1>
        <p className="text-xs text-[#6B7694] mt-1">Manage your student profile preferences and password credentials.</p>
      </div>

      <div className="bg-white rounded-[14px] border border-[#EEF1F7] p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#EEF1F7]">
          <div className="w-10 h-10 rounded-xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0B1F4B]">Security & Login</h3>
            <p className="text-xs text-[#6B7694]">Update your registered password</p>
          </div>
        </div>

        {/* Read-only account info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">Registered Email</label>
            <input type="email" disabled value={email}
              className="w-full bg-[#F1F4F9] text-xs text-slate-500 px-3.5 py-2.5 rounded-xl border border-slate-200" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">Current Degree Program</label>
            <input type="text" disabled value={degree}
              className="w-full bg-[#F1F4F9] text-xs text-slate-500 px-3.5 py-2.5 rounded-xl border border-slate-200" />
          </div>
        </div>

        {/* Change password section */}
        <div className="pt-2 border-t border-[#EEF1F7]">
          <h4 className="text-xs font-bold text-[#0B1F4B] pt-2 mb-4 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#1E5BE0]" />
            Change Password
          </h4>

          {pwStep === "idle" || pwStep === "done" ? (
            <div>
              {pwStep === "done" && (
                <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-4">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  Password updated successfully.
                </div>
              )}
              <p className="text-xs text-slate-500 mb-4">
                To change your password, we'll send a one-time code to your registered email <span className="font-semibold text-[#014E9C]">{email}</span>.
              </p>
              <button type="button" onClick={handleRequestOtp} disabled={isLoading}
                className="flex items-center gap-2 bg-[#1E5BE0] hover:bg-[#1548b8] disabled:opacity-60 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer">
                <Mail className="w-3.5 h-3.5" />
                {isLoading ? "Sending…" : "Send Reset Code to Email"}
              </button>
            </div>
          ) : pwStep === "verify_otp" ? (
            <form onSubmit={handleVerifyOtp} className="space-y-4 max-w-sm">
              <p className="text-xs text-slate-500">Enter the 6-digit code sent to <span className="font-semibold text-[#014E9C]">{email}</span>.</p>
              <input type="text" required maxLength={6} value={otpInput} onChange={(e) => setOtpInput(e.target.value)}
                placeholder="Enter OTP"
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 tracking-widest text-center font-bold focus:border-[#1E5BE0] focus:ring-2 focus:ring-[#1E5BE0]/15 outline-none transition-all" />
              <div className="flex gap-2">
                <button type="submit" disabled={isLoading}
                  className="bg-[#1E5BE0] hover:bg-[#1548b8] disabled:opacity-60 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer">
                  {isLoading ? "Verifying…" : "Verify Code"}
                </button>
                <button type="button" onClick={() => { setPwStep("idle"); setOtpInput(""); }}
                  className="text-xs text-slate-500 hover:text-[#0B1F4B] px-3 py-2.5 rounded-xl transition cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSetPassword} className="space-y-4 max-w-sm">
              <p className="text-xs text-slate-500">OTP verified. Set your new password below.</p>
              <div>
                <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">New Password</label>
                <div className="relative">
                  <input type={showNew ? "text" : "password"} required minLength={8} value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 8 characters"
                    className="w-full text-xs text-slate-800 px-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-[#1E5BE0] focus:ring-2 focus:ring-[#1E5BE0]/15 outline-none transition-all" />
                  <button type="button" onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0B1F4B] mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <input type={showConfirm ? "text" : "password"} required minLength={8} value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat new password"
                    className="w-full text-xs text-slate-800 px-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-[#1E5BE0] focus:ring-2 focus:ring-[#1E5BE0]/15 outline-none transition-all" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={isLoading}
                  className="bg-[#1E5BE0] hover:bg-[#1548b8] disabled:opacity-60 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer">
                  {isLoading ? "Updating…" : "Update Password"}
                </button>
                <button type="button" onClick={() => { setPwStep("idle"); setOtpInput(""); setNewPassword(""); setConfirmPassword(""); }}
                  className="text-xs text-slate-500 hover:text-[#0B1F4B] px-3 py-2.5 rounded-xl transition cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
