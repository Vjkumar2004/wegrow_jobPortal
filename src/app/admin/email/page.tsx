"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Users,
  Building2,
  GraduationCap,
  X,
  Plus,
} from "lucide-react";
import { adminService } from "@/services/admin.service";

interface EmailDraft {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  message: string;
}

const EMPTY_DRAFT: EmailDraft = {
  to: "",
  cc: "",
  bcc: "",
  subject: "",
  message: "",
};

const AUDIENCE_TEMPLATES = [
  {
    label: "All 2026 Students",
    value: "all-students-2026@wegrowcampus.com",
    icon: GraduationCap,
    color: "text-[#1E5BE0]",
    bg: "hover:bg-blue-50 hover:border-blue-200",
  },
  {
    label: "All Corporate Partners",
    value: "all-employers@wegrowcampus.com",
    icon: Building2,
    color: "text-[#FF6B00]",
    bg: "hover:bg-amber-50 hover:border-amber-200",
  },
  {
    label: "All Campus Users",
    value: "all-users@wegrowcampus.com",
    icon: Users,
    color: "text-[#22B573]",
    bg: "hover:bg-emerald-50 hover:border-emerald-200",
  },
];

export default function AdminEmailPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draft, setDraft] = useState<EmailDraft>(EMPTY_DRAFT);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const openModal = (preset?: Partial<EmailDraft>) => {
    setDraft({ ...EMPTY_DRAFT, ...preset });
    setResult(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (sending) return;
    setIsModalOpen(false);
    setDraft(EMPTY_DRAFT);
    setResult(null);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.to.trim() || !draft.subject.trim() || !draft.message.trim()) return;

    setSending(true);
    setResult(null);
    try {
      await adminService.sendEmail({
        to: draft.to.trim(),
        cc: draft.cc.trim() || undefined,
        bcc: draft.bcc.trim() || undefined,
        subject: draft.subject.trim(),
        message: draft.message.trim(),
      });
      setResult({ type: "success", message: "Email dispatched successfully to all recipients." });
      setDraft(EMPTY_DRAFT);
    } catch (err: any) {
      setResult({
        type: "error",
        message: err?.response?.data?.message || "Failed to send email. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  const set = (field: keyof EmailDraft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setDraft((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-7 space-y-6">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-[14px] p-4 sm:p-7 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] bg-gradient-to-r from-[#FFF5EE] via-[#F4F8FF] to-[#E9F2FF] flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0756A8] text-xs font-bold uppercase tracking-wider mb-2">
              <Mail className="w-3.5 h-3.5" /> Campus Communication Dispatcher
            </div>
            <h1 className="text-[20px] sm:text-[26px] font-bold text-[#0B1F4B] tracking-tight">
              Email Dispatcher & Mass Broadcast
            </h1>
            <p className="text-[12px] sm:text-[13px] text-[#6B7694] mt-1">
              Dispatch bulk placement announcements, emergency schedule alerts, and corporate updates across all campus cohorts.
            </p>
          </div>

          <button
            type="button"
            onClick={() => openModal()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1E5BE0] hover:bg-[#1548b8] text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            Compose Email
          </button>
        </div>

        {/* Quick Audience Shortcuts */}
        <div className="bg-white rounded-[14px] border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] p-4 sm:p-6 space-y-4">
          <h2 className="text-[14px] font-bold text-[#0B1F4B]">Quick Broadcast to Audience</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {AUDIENCE_TEMPLATES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => openModal({ to: t.value })}
                className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-100 text-left transition ${t.bg} group`}
              >
                <div className="min-w-0 pr-2">
                  <p className="text-sm font-bold text-[#0B1F4B] group-hover:text-[#0B1F4B] truncate">{t.label}</p>
                  <p className="text-[11px] text-[#6B7694] mt-0.5 truncate">{t.value}</p>
                </div>
                <t.icon className={`w-5 h-5 shrink-0 ${t.color}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Empty broadcast history */}
        <div className="bg-white rounded-[14px] border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] p-4 sm:p-6 space-y-3">
          <h2 className="text-[14px] font-bold text-[#0B1F4B]">Recent Broadcast Dispatches</h2>
          <div className="py-8 text-center text-[#6B7694] text-sm">
            <Mail className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            No emails sent yet this session.
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#EEF1F7] bg-[#F7F9FD]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E8F0FF] flex items-center justify-center">
                  <Mail className="w-4 h-4 text-[#1E5BE0]" />
                </div>
                <h3 className="text-[15px] font-bold text-[#0B1F4B]">Compose Broadcast Email</h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={sending}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-[#6B7694] hover:text-[#0B1F4B] transition disabled:opacity-40"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Result banner inside modal */}
            {result && (
              <div
                className={`mx-6 mt-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  result.type === "success"
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                    : "bg-rose-50 border border-rose-200 text-rose-700"
                }`}
              >
                {result.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-[#22B573] shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                )}
                {result.message}
              </div>
            )}

            {/* Audience Quick-select inside modal */}
            <div className="px-6 pt-4 pb-2 flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-[#6B7694] mr-1">Quick:</span>
              {AUDIENCE_TEMPLATES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setDraft((prev) => ({ ...prev, to: t.value }))}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F1F4F9] text-[#0B1F4B] hover:bg-[#E8F0FF] hover:text-[#1E5BE0] transition"
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSend} className="px-6 pb-6 pt-2 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  To (Recipient) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={draft.to}
                  onChange={set("to")}
                  placeholder="recipient@example.com"
                  className="w-full bg-[#F5F7FB] text-xs text-[#0B1F4B] px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#1E5BE0] focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">CC</label>
                  <input
                    type="text"
                    value={draft.cc}
                    onChange={set("cc")}
                    placeholder="cc@example.com"
                    className="w-full bg-[#F5F7FB] text-xs text-[#0B1F4B] px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#1E5BE0] focus:bg-white focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">BCC</label>
                  <input
                    type="text"
                    value={draft.bcc}
                    onChange={set("bcc")}
                    placeholder="bcc@example.com"
                    className="w-full bg-[#F5F7FB] text-xs text-[#0B1F4B] px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#1E5BE0] focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Subject <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={draft.subject}
                  onChange={set("subject")}
                  placeholder="Email subject line..."
                  className="w-full bg-[#F5F7FB] text-xs text-[#0B1F4B] px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#1E5BE0] focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={6}
                  required
                  value={draft.message}
                  onChange={set("message")}
                  placeholder="Write your email body here..."
                  className="w-full bg-[#F5F7FB] text-xs text-[#0B1F4B] p-3.5 rounded-xl border border-transparent focus:border-[#1E5BE0] focus:bg-white focus:outline-none transition-all font-sans leading-relaxed resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={sending}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold transition disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="bg-[#1E5BE0] hover:bg-[#1548b8] text-white px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {sending ? "Sending..." : "Send Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
