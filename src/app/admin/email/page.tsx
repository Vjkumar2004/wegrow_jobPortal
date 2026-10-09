"use client";

import React, { useState, useEffect } from "react";
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
  Search,
  RefreshCw,
  Clock,
  Eye,
} from "lucide-react";
import { adminService, EmailLog } from "@/services/admin.service";

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

function formatDateTime(dateString?: string | null) {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

export default function AdminEmailPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draft, setDraft] = useState<EmailDraft>(EMPTY_DRAFT);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Email History State
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);

  const fetchEmailLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const logs = await adminService.getEmailLogs();
      setEmailLogs(logs);
    } catch {
      // Keep existing
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchEmailLogs();
  }, []);

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
      // Immediately refresh the real email history
      await fetchEmailLogs();
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

  // Filtered Email Logs
  const filteredLogs = emailLogs.filter((log) => {
    const matchesSearch =
      log.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.providerMessageId && log.providerMessageId.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === "ALL" || log.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalSent = emailLogs.filter((l) => l.status === "SENT").length;
  const totalFailed = emailLogs.filter((l) => l.status === "FAILED").length;

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

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Quick Metrics */}
            <div className="flex items-center gap-2 bg-white rounded-xl p-2 border border-[#EEF1F7] shadow-xs text-center shrink-0">
              <div className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#22B573]">
                <div className="text-sm font-bold leading-none">{totalSent}</div>
                <div className="text-[10px] font-semibold mt-0.5">Delivered</div>
              </div>
              {totalFailed > 0 && (
                <div className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600">
                  <div className="text-sm font-bold leading-none">{totalFailed}</div>
                  <div className="text-[10px] font-semibold mt-0.5">Failed</div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => openModal()}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#1E5BE0] hover:bg-[#1548b8] text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Compose Email</span>
            </button>
          </div>
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
                className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-100 text-left transition ${t.bg} group cursor-pointer`}
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

        {/* Email Communication History Section */}
        <div className="bg-white rounded-[14px] border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] overflow-hidden">
          {/* Header & Controls */}
          <div className="p-4 sm:p-6 border-b border-[#EEF1F7] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] font-bold text-[#0B1F4B]">Dispatched Email Communication History</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-[#1E5BE0]">
                  {emailLogs.length} Records
                </span>
              </div>
              <p className="text-[12px] text-[#6B7694] mt-0.5">
                Real-time delivery audit trail from cloud mailing provider
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="relative flex-1 sm:w-60">
                <Search className="w-4 h-4 text-[#6B7694] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search recipient, subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F5F7FB] text-xs text-[#0B1F4B] placeholder-[#6B7694] pl-9 pr-3 py-2 rounded-xl border border-transparent focus:border-[#1E5BE0] focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-[#F5F7FB] text-xs text-[#0B1F4B] px-3 py-2 rounded-xl border-none focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="SENT">Delivered (Sent)</option>
                <option value="QUEUED">Queued</option>
                <option value="FAILED">Failed</option>
              </select>

              <button
                type="button"
                onClick={fetchEmailLogs}
                disabled={isLoadingLogs}
                className="p-2 text-slate-500 hover:text-[#1E5BE0] hover:bg-blue-50 rounded-xl transition cursor-pointer shrink-0 flex items-center justify-center border border-slate-200"
                title="Refresh logs"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingLogs ? "animate-spin text-[#1E5BE0]" : ""}`} />
              </button>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F7FB] text-[12px] font-semibold text-[#6B7694] h-[48px]">
                  <th className="px-5 py-3 rounded-l-lg">Recipient Email</th>
                  <th className="px-5 py-3">Subject Line</th>
                  <th className="px-5 py-3">Template / Category</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3">Sent Timestamp</th>
                  <th className="px-5 py-3 text-right rounded-r-lg">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF1F7] text-[13px]">
                {isLoadingLogs ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#6B7694]">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#1E5BE0]" />
                      Loading email dispatch records...
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#6B7694]">
                      <Mail className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      No email history matching your query.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => {
                    const isSent = log.status === "SENT";
                    const isFailed = log.status === "FAILED";

                    return (
                      <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Recipient */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0756A8] flex items-center justify-center shrink-0">
                              <Mail className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-semibold text-[#0B1F4B] text-xs">
                              {log.recipientEmail}
                            </span>
                          </div>
                        </td>

                        {/* Subject */}
                        <td className="px-5 py-4 font-medium text-slate-800 max-w-[280px] truncate">
                          {log.subject}
                        </td>

                        {/* Template */}
                        <td className="px-5 py-4">
                          <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#F1F4F9] text-[#6B7694]">
                            {log.templateName ? log.templateName.replace(/_/g, " ") : "BROADCAST"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${
                              isSent
                                ? "bg-[#D8F3E5] text-[#22B573]"
                                : isFailed
                                ? "bg-[#FFE0E0] text-[#D93636]"
                                : "bg-[#FFE9D6] text-[#E8650A]"
                            }`}
                          >
                            {isSent ? "Delivered" : isFailed ? "Failed" : "Queued"}
                          </span>
                        </td>

                        {/* Timestamp */}
                        <td className="px-5 py-4 text-[#6B7694] text-xs">
                          {formatDateTime(log.sentAt || log.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedLog(log)}
                            className="p-1.5 text-slate-400 hover:text-[#1E5BE0] rounded-lg hover:bg-blue-50 transition cursor-pointer"
                            title="Inspect Email Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View (block md:hidden) */}
          <div className="block md:hidden divide-y divide-[#EEF1F7]">
            {isLoadingLogs ? (
              <div className="py-10 text-center text-[#6B7694] text-xs">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#1E5BE0]" />
                Loading email logs...
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="py-10 px-4 text-center text-[#6B7694] text-xs">
                <Mail className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                No emails found matching your filter.
              </div>
            ) : (
              filteredLogs.map((log) => {
                const isSent = log.status === "SENT";
                const isFailed = log.status === "FAILED";

                return (
                  <div key={log.id} className="p-4 space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0756A8] flex items-center justify-center shrink-0">
                          <Mail className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-xs text-[#0B1F4B] truncate">
                          {log.recipientEmail}
                        </span>
                      </div>

                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                          isSent
                            ? "bg-[#D8F3E5] text-[#22B573]"
                            : isFailed
                            ? "bg-[#FFE0E0] text-[#D93636]"
                            : "bg-[#FFE9D6] text-[#E8650A]"
                        }`}
                      >
                        {isSent ? "Delivered" : isFailed ? "Failed" : "Queued"}
                      </span>
                    </div>

                    <div className="text-xs font-medium text-slate-800 line-clamp-2">
                      {log.subject}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[10px]">
                      <span className="px-2 py-0.5 rounded-md bg-[#F1F4F9] text-[#6B7694] font-semibold">
                        {log.templateName ? log.templateName.replace(/_/g, " ") : "BROADCAST"}
                      </span>
                      {log.provider && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#1E5BE0] uppercase font-bold">
                          via {log.provider}
                        </span>
                      )}
                    </div>

                    <div className="pt-1.5 border-t border-[#EEF1F7] flex items-center justify-between text-[11px] text-[#6B7694]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#6B7694]" />
                        {formatDateTime(log.sentAt || log.createdAt)}
                      </span>

                      <button
                        type="button"
                        onClick={() => setSelectedLog(log)}
                        className="text-[#1E5BE0] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Inspect Log Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#EEF1F7] bg-[#F7F9FD]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1E5BE0] flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0B1F4B]">Email Dispatch Audit</h3>
                  <p className="text-[10px] font-mono text-[#6B7694]">ID: {selectedLog.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-[#6B7694] hover:text-[#0B1F4B] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-[#6B7694] uppercase tracking-wider block">Subject</span>
                <p className="font-semibold text-sm text-[#0B1F4B]">{selectedLog.subject}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] font-bold text-[#6B7694] uppercase tracking-wider block">Recipient</span>
                  <p className="font-semibold text-[#0B1F4B] truncate mt-0.5">{selectedLog.recipientEmail}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] font-bold text-[#6B7694] uppercase tracking-wider block">Status</span>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mt-1 ${
                      selectedLog.status === "SENT"
                        ? "bg-[#D8F3E5] text-[#22B573]"
                        : selectedLog.status === "FAILED"
                        ? "bg-[#FFE0E0] text-[#D93636]"
                        : "bg-[#FFE9D6] text-[#E8650A]"
                    }`}
                  >
                    {selectedLog.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] font-bold text-[#6B7694] uppercase tracking-wider block">Template</span>
                  <p className="font-semibold text-[#0B1F4B] mt-0.5">
                    {selectedLog.templateName ? selectedLog.templateName.replace(/_/g, " ") : "ADMIN_BROADCAST"}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] font-bold text-[#6B7694] uppercase tracking-wider block">Mailing Service</span>
                  <p className="font-semibold text-[#0B1F4B] uppercase mt-0.5">
                    {selectedLog.provider || "Resend"}
                  </p>
                </div>
              </div>

              {selectedLog.providerMessageId && (
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] font-bold text-[#6B7694] uppercase tracking-wider block">Provider Message ID</span>
                  <p className="font-mono text-[11px] text-slate-700 mt-0.5 break-all">
                    {selectedLog.providerMessageId}
                  </p>
                </div>
              )}

              {selectedLog.failureReason && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider block">Delivery Failure Reason</span>
                  <p className="text-[11px] mt-0.5">{selectedLog.failureReason}</p>
                </div>
              )}

              <div className="pt-2 border-t border-[#EEF1F7] text-[11px] text-[#6B7694] flex items-center justify-between">
                <span>Dispatched: {formatDateTime(selectedLog.sentAt || selectedLog.createdAt)}</span>
                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-[#6B7694] hover:text-[#0B1F4B] transition disabled:opacity-40 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Result banner inside modal */}
            {result && (
              <div
                className={`mx-5 sm:mx-6 mt-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
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
            <div className="px-5 sm:px-6 pt-4 pb-2 flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-[#6B7694] mr-1">Quick:</span>
              {AUDIENCE_TEMPLATES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setDraft((prev) => ({ ...prev, to: t.value }))}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F1F4F9] text-[#0B1F4B] hover:bg-[#E8F0FF] hover:text-[#1E5BE0] transition cursor-pointer"
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSend} className="px-5 sm:px-6 pb-6 pt-2 space-y-4">
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
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold transition disabled:opacity-40 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="bg-[#1E5BE0] hover:bg-[#1548b8] text-white px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
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
