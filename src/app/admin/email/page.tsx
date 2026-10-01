"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Textarea } from "@/components/common/Textarea";
import { Mail, Send, CheckCircle2, History, FileText } from "lucide-react";
import { adminService } from "@/services/admin.service";

export default function AdminEmailPage() {
  const [to, setTo] = useState("all-students-2025@wegrowcampus.com");
  const [cc, setCc] = useState("placement-officers@colleges.edu");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("Mega Campus Placement Drive 2025 - Registration Open");
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
  ]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      await adminService.sendEmail({ to, cc, bcc, subject, message });
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 3000);
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl space-y-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Email Dispatcher</h1>
          <p className="text-xs text-slate-500 mt-1">
            Send bulk notices, campus recruitment announcements, and system alerts. (UI layer prepared for REST API backend).
          </p>
        </div>

        {sentSuccess && (
          <div className="p-3.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Email queued successfully for background dispatch!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Email Composer */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#0756A8]" /> Compose Notice
            </h2>

            <form onSubmit={handleSend} className="space-y-4">
              <Input
                label="To *"
                required
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="CC"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                />
                <Input
                  label="BCC"
                  value={bcc}
                  onChange={(e) => setBcc(e.target.value)}
                />
              </div>

              <Input
                label="Subject *"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />

              <Textarea
                label="Email Body *"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
              />

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Button type="button" variant="outline" size="sm">
                  Save Draft
                </Button>
                <Button type="submit" variant="secondary" size="md" isLoading={sending} className="font-bold px-6">
                  <Send className="w-3.5 h-3.5 mr-2" /> Dispatch Email
                </Button>
              </div>
            </form>
          </div>

          {/* Email History Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4 text-slate-400" /> Recent Dispatches
              </h3>

              <div className="space-y-3">
                {history.map((h) => (
                  <div key={h.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                    <p className="text-xs font-bold text-slate-900 line-clamp-1">{h.subject}</p>
                    <p className="text-[11px] text-slate-500">To: {h.to}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>{h.date}</span>
                      <span className="text-emerald-600 font-semibold">{h.status}</span>
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
