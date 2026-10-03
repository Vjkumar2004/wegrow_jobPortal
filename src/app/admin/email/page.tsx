"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import {
  Mail,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  Building2,
  GraduationCap,
  Paperclip,
} from "lucide-react";
import { adminService } from "@/services/admin.service";

export default function AdminEmailPage() {
  const [to, setTo] = useState("all-students-2026@wegrowcampus.com");
  const [cc, setCc] = useState("placement-officers@colleges.edu");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("Mega Campus Placement Drive 2026 - Registration Open");
  const [message, setMessage] = useState(
    "Dear Students,\n\nWe are pleased to announce the upcoming WeGrow Mega Campus Hiring Drive with 10+ Tier-1 tech enterprises offering Graduate Engineer roles. Please make sure your WeGrow profile and resume are 100% complete before Friday.\n\nBest regards,\nWeGrow Skill Campus Placement Team"
  );
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const [history] = useState([
    {
      id: "h-1",
      to: "All Registered Employers",
      subject: "Annual Campus Drive Schedule & Candidate Roster",
      date: "Yesterday, 04:30 PM",
      status: "Delivered",
    },
    {
      id: "h-2",
      to: "selected-candidates-infosys@wegrow.com",
      subject: "Offer Letter Briefing & Verification Guidelines",
      date: "March 24, 11:15 AM",
      status: "Delivered",
    },
    {
      id: "h-3",
      to: "tcs-hiring-round-2@wegrow.com",
      subject: "Interview Room Link & Virtual Meeting ID",
      date: "March 20, 02:00 PM",
      status: "Delivered",
    },
  ]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      await adminService.sendEmail({ to, cc, bcc, subject, message });
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 3500);
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-7 space-y-6">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-[14px] p-6 sm:p-7 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] bg-gradient-to-r from-[#FFF5EE] via-[#F4F8FF] to-[#E9F2FF] flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0756A8] text-xs font-bold uppercase tracking-wider mb-2">
              <Mail className="w-3.5 h-3.5" /> Campus Communication Dispatcher
            </div>
            <h1 className="text-[22px] sm:text-[26px] font-bold text-[#0B1F4B] tracking-tight">
              Email Dispatcher & Mass Broadcast
            </h1>
            <p className="text-[13px] text-[#6B7694] mt-1">
              Dispatch bulk placement announcements, emergency schedule alerts, and corporate updates across all campus cohorts.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-[#EEF1F7] shadow-sm shrink-0">
            <div className="text-center px-3">
              <div className="text-lg font-bold text-[#22B573] leading-none">
                100%
              </div>
              <div className="text-[11px] text-[#6B7694] mt-1">SMTP Active</div>
            </div>
          </div>
        </div>

        {sentSuccess && (
          <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-[12px] border border-emerald-200 flex items-center gap-2.5 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-[#22B573]" />
            <span>Broadcast email queued and dispatched successfully to all recipients!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Email Composer (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-[14px] border border-[#EEF1F7] p-6 sm:p-7 shadow-[0_4px_14px_rgba(11,31,75,0.05)] space-y-5">
            <div className="flex items-center justify-between border-b border-[#EEF1F7] pb-4">
              <h2 className="text-[16px] font-bold text-[#0B1F4B] flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#1E5BE0]" /> Compose Broadcast Notice
              </h2>
              <span className="text-xs text-[#6B7694]">High priority queue</span>
            </div>

            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Recipient Audience (To) *
                </label>
                <input
                  type="text"
                  required
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full bg-[#F5F7FB] text-xs text-[#0B1F4B] px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#1E5BE0] focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    CC (Carbon Copy)
                  </label>
                  <input
                    type="text"
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    className="w-full bg-[#F5F7FB] text-xs text-[#0B1F4B] px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#1E5BE0] focus:bg-white focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    BCC (Blind Copy)
                  </label>
                  <input
                    type="text"
                    value={bcc}
                    onChange={(e) => setBcc(e.target.value)}
                    placeholder="audit@wegrowcampus.com"
                    className="w-full bg-[#F5F7FB] text-xs text-[#0B1F4B] px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#1E5BE0] focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Subject Line *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#F5F7FB] text-xs text-[#0B1F4B] px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#1E5BE0] focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Message Content Body *
                </label>
                <textarea
                  rows={7}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#F5F7FB] text-xs text-[#0B1F4B] p-3.5 rounded-xl border border-transparent focus:border-[#1E5BE0] focus:bg-white focus:outline-none transition-all font-sans leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-xs text-[#6B7694] hover:text-[#0B1F4B] transition"
                >
                  <Paperclip className="w-3.5 h-3.5" /> Attach Schedule PDF
                </button>

                <button
                  type="submit"
                  disabled={sending}
                  className="bg-[#0756A8] hover:bg-[#06468a] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sending ? "Queuing Dispatch..." : "Send Broadcast Now"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Audience & History (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Quick Groups */}
            <div className="bg-white rounded-[14px] border border-[#EEF1F7] p-5 shadow-[0_4px_14px_rgba(11,31,75,0.05)] space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7694]">
                Target Audience Templates
              </h3>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setTo("all-students-2026@wegrowcampus.com")}
                  className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 text-left transition flex items-center justify-between"
                >
                  <span className="text-xs font-semibold text-[#0B1F4B]">All 2026 Students</span>
                  <GraduationCap className="w-3.5 h-3.5 text-[#1E5BE0]" />
                </button>
                <button
                  type="button"
                  onClick={() => setTo("all-employers@wegrowcampus.com")}
                  className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-100 hover:border-amber-200 text-left transition flex items-center justify-between"
                >
                  <span className="text-xs font-semibold text-[#0B1F4B]">All Corporate Partners</span>
                  <Building2 className="w-3.5 h-3.5 text-[#FF6B00]" />
                </button>
              </div>
            </div>

            {/* Broadcast History */}
            <div className="bg-white rounded-[14px] border border-[#EEF1F7] p-5 shadow-[0_4px_14px_rgba(11,31,75,0.05)] space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7694]">
                Recent Broadcast Dispatches
              </h3>
              <div className="space-y-3">
                {history.map((h) => (
                  <div key={h.id} className="p-3 rounded-xl bg-[#FDFDFE] border border-[#EEF1F7] text-xs">
                    <p className="font-bold text-[#0B1F4B] truncate">{h.subject}</p>
                    <p className="text-[11px] text-[#6B7694] mt-0.5 truncate">To: {h.to}</p>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">{h.date}</span>
                      <span className="bg-[#D8F3E5] text-[#22B573] font-semibold px-2 py-0.5 rounded-full">
                        {h.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
