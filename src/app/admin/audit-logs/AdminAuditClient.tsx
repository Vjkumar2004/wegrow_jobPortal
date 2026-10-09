"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import {
  FileSpreadsheet,
  ShieldCheck,
  Clock,
  Search,
  Filter,
  Activity,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { AuditLog } from "@/services/admin.service";

interface AdminAuditClientProps {
  initialLogs: AuditLog[];
}

export default function AdminAuditClient({ initialLogs }: AdminAuditClientProps) {
  const [logs] = useState<AuditLog[]>(initialLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActor, setFilterActor] = useState("ALL");

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActor = filterActor === "ALL" || log.admin === filterActor;
    return matchesSearch && matchesActor;
  });

  const actors = ["ALL", ...Array.from(new Set(logs.map((l) => l.admin)))];

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-[14px] p-4 sm:p-7 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] bg-gradient-to-r from-[#FFF5EE] via-[#F4F8FF] to-[#E9F2FF] flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0756A8] text-xs font-bold uppercase tracking-wider mb-2">
            <Lock className="w-3.5 h-3.5" /> Immutable Security Trails
          </div>
          <h1 className="text-[20px] sm:text-[26px] font-bold text-[#0B1F4B] tracking-tight">
            Security & Moderation Audit Logs
          </h1>
          <p className="text-[12px] sm:text-[13px] text-[#6B7694] mt-1">
            Immutable chronological records of administrative decisions, company verifications, broadcast dispatches, and account statuses.
          </p>
        </div>

        <div className="flex items-center justify-around sm:justify-start gap-3 bg-white rounded-xl p-3 border border-[#EEF1F7] shadow-sm w-full sm:w-auto shrink-0">
          <div className="text-center px-3">
            <div className="text-lg font-bold text-[#0B1F4B] leading-none">
              {logs.length}
            </div>
            <div className="text-[11px] text-[#6B7694] mt-1">Captured Logs</div>
          </div>
          <div className="h-8 w-[1px] bg-slate-200" />
          <div className="text-center px-3">
            <div className="text-lg font-bold text-[#22B573] leading-none">
              100%
            </div>
            <div className="text-[11px] text-[#6B7694] mt-1">Integrity Score</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-[14px] border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-[#6B7694] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search action, target entity, log id..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F5F7FB] text-xs text-[#0B1F4B] placeholder-[#6B7694] pl-9 pr-3 py-2 rounded-xl border border-transparent focus:border-[#1E5BE0] focus:bg-white focus:outline-none transition-all"
            />
          </div>

          <select
            value={filterActor}
            onChange={(e) => setFilterActor(e.target.value)}
            className="bg-[#F5F7FB] text-xs text-[#0B1F4B] px-3 py-2 rounded-xl border-none focus:outline-none cursor-pointer"
          >
            {actors.map((actor) => (
              <option key={actor} value={actor}>
                {actor === "ALL" ? "All Actors" : `Actor: ${actor}`}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-[#6B7694] font-medium">
          Showing <strong className="text-[#0B1F4B]">{filtered.length}</strong> recorded audit events
        </span>
      </div>

      {/* Formatted Table (Responsive: Desktop Table + Mobile Cards) */}
      <div className="bg-white rounded-[14px] border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F7FB] text-[12px] font-semibold text-[#6B7694] h-[48px]">
                <th className="px-5 py-3 rounded-l-lg">Log ID</th>
                <th className="px-5 py-3">Event Action</th>
                <th className="px-5 py-3">Target Subject / Entity</th>
                <th className="px-5 py-3">Executed By</th>
                <th className="px-5 py-3 text-right rounded-r-lg">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF1F7] text-[13px]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* ID */}
                  <td className="px-5 py-4 font-mono text-xs font-semibold text-[#1E5BE0]">
                    #{log.id}
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0756A8] flex items-center justify-center shrink-0">
                        <Activity className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-semibold text-[#0B1F4B]">{log.action}</span>
                    </div>
                  </td>

                  {/* Target */}
                  <td className="px-5 py-4 text-slate-700 font-medium">
                    {log.target}
                  </td>

                  {/* Actor */}
                  <td className="px-5 py-4">
                    <span className="inline-block bg-[#E8F0FF] text-[#1E5BE0] px-2.5 py-1 rounded-full font-semibold text-[11px]">
                      {log.admin}
                    </span>
                  </td>

                  {/* Timestamp */}
                  <td className="px-5 py-4 text-right text-[#6B7694] font-medium text-xs">
                    {log.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List View (block md:hidden) */}
        <div className="block md:hidden divide-y divide-[#EEF1F7]">
          {filtered.length === 0 ? (
            <div className="py-10 px-4 text-center text-[#6B7694] text-xs">
              No audit logs match your search.
            </div>
          ) : (
            filtered.map((log) => (
              <div key={log.id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0756A8] flex items-center justify-center shrink-0">
                      <Activity className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-[#0B1F4B] text-sm truncate">{log.action}</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#1E5BE0] font-semibold shrink-0">#{log.id}</span>
                </div>

                <div className="p-2.5 bg-[#F8FAFC] rounded-xl text-xs text-slate-700 border border-[#EEF1F7]">
                  <span className="text-[#6B7694] text-[10px] uppercase font-bold block mb-0.5">Target Entity</span>
                  <span className="font-medium text-[#0B1F4B]">{log.target}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#6B7694] pt-1">
                  <span className="inline-block bg-[#E8F0FF] text-[#1E5BE0] px-2 py-0.5 rounded-full font-semibold text-[10px]">
                    By {log.admin}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#6B7694]" />
                    {log.timestamp}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
