"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Building2,
  Briefcase,
  FileCheck,
  Calendar,
  Award,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet,
  Mail,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Activity,
  AlertCircle,
  Eye,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Company, StudentAdmin } from "@/types";
import { AuditLog, AdminReportData } from "@/services/admin.service";

interface AdminDashboardClientProps {
  reports: AdminReportData;
  auditLogs: AuditLog[];
  companies: Company[];
  students: StudentAdmin[];
}

// Donut data for Company KYC & Moderation status
const KYC_STATUS_DATA = [
  { name: "Approved", value: 38, color: "#22B573" },
  { name: "Pending Review", value: 6, color: "#FF6B00" },
  { name: "Suspended", value: 2, color: "#EF4444" },
];

export default function AdminDashboardClient({
  reports,
  auditLogs,
  companies,
  students,
}: AdminDashboardClientProps) {
  const [trendRange, setTrendRange] = useState("Year 2026");

  const pendingCompanies = companies.filter((c) => c.status === "Pending");
  const approvedCompanies = companies.filter((c) => c.status === "Approved");

  // Chart data from reports.monthlyPlacements
  const placementTrendData = reports.monthlyPlacements.map((item) => ({
    month: item.month,
    placements: item.count,
  }));

  return (
    <div className="flex-1 flex flex-col xl:flex-row min-w-0 p-4 sm:p-6 lg:p-7 gap-5">
      {/* ================= ZONE 2: CENTER CONTENT (flexible, matching Student Dashboard) ================= */}
      <div className="flex-1 min-w-0 space-y-5">
        {/* 1. Welcome Banner: Soft peach-to-blue gradient card */}
        <div className="relative overflow-hidden rounded-[14px] p-6 sm:p-7 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] bg-gradient-to-r from-[#FFF5EE] via-[#F4F8FF] to-[#E9F2FF] flex flex-col md:flex-row md:items-center justify-between gap-5 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0756A8] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#0756A8]" /> Super Admin Command Center
            </div>
            <h1 className="text-[22px] sm:text-[26px] font-bold text-[#0B1F4B] tracking-tight flex items-center gap-2">
              Welcome back, Super Admin! 🛡️
            </h1>
            <p className="text-[14px] text-[#6B7694] mt-1">
              Campus placement operations are running smoothly with 99.9% system uptime.
            </p>
          </div>

          {/* Quick Pending Alert / Banner Badge */}
          {pendingCompanies.length > 0 ? (
            <Link
              href="/admin/hr-management"
              className="bg-white rounded-[12px] p-3.5 sm:p-4 border border-amber-200/80 shadow-sm flex items-center gap-3 shrink-0 hover:bg-amber-50/50 transition"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#FF6B00] flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-[#FF6B00]" />
              </div>
              <div>
                <div className="text-[13px] font-bold text-[#0B1F4B]">
                  {pendingCompanies.length} Corporate Partners
                </div>
                <div className="text-[11px] text-[#6B7694]">Pending KYC Approval →</div>
              </div>
            </Link>
          ) : (
            <div className="bg-white rounded-[12px] p-3.5 sm:p-4 border border-[#EEF1F7] shadow-sm max-w-sm flex items-start gap-3 shrink-0">
              <span className="text-[#22B573] text-2xl font-black leading-none shrink-0">
                ✓
              </span>
              <p className="text-[12px] sm:text-[13px] text-[#0B1F4B] font-medium leading-snug">
                All employer verification requests are currently up to date.
              </p>
            </div>
          )}
        </div>

        {/* 2. Four Stat Cards in a row (Matching Student Dashboard aesthetic) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Total Students (Blue) */}
          <div className="bg-white rounded-[14px] p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex items-center gap-4 bg-gradient-to-br from-blue-50/40 to-white">
            <div className="w-[56px] h-[56px] rounded-2xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-[26px] font-bold text-[#0B1F4B] leading-none">
                {reports.totalStudents.toLocaleString()}
              </div>
              <div className="text-[14px] text-[#6B7694] mt-1">Total Students</div>
              <div className="text-[12px] font-semibold text-[#22B573] flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> +1,240 this month
              </div>
            </div>
          </div>

          {/* Card 2: Partner Companies (Orange) */}
          <div className="bg-white rounded-[14px] p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex items-center gap-4 bg-gradient-to-br from-orange-50/40 to-white">
            <div className="w-[56px] h-[56px] rounded-2xl bg-[#FFF0E6] text-[#FF6B00] flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-[26px] font-bold text-[#0B1F4B] leading-none">
                {reports.totalCompanies.toLocaleString()}
              </div>
              <div className="text-[14px] text-[#6B7694] mt-1">Partner Companies</div>
              <div className="text-[12px] font-semibold text-[#22B573] flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> +32 onboarded
              </div>
            </div>
          </div>

          {/* Card 3: Active Jobs (Emerald) */}
          <div className="bg-white rounded-[14px] p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex items-center gap-4 bg-gradient-to-br from-emerald-50/40 to-white">
            <div className="w-[56px] h-[56px] rounded-2xl bg-[#E8F8F1] text-[#22B573] flex items-center justify-center shrink-0">
              <Briefcase className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-[26px] font-bold text-[#0B1F4B] leading-none">
                {reports.totalJobs.toLocaleString()}
              </div>
              <div className="text-[14px] text-[#6B7694] mt-1">Live Openings</div>
              <div className="text-[12px] font-semibold text-[#22B573] flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> 98% verified
              </div>
            </div>
          </div>

          {/* Card 4: Placements Rolled (Purple) */}
          <div className="bg-white rounded-[14px] p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex items-center gap-4 bg-gradient-to-br from-purple-50/40 to-white">
            <div className="w-[56px] h-[56px] rounded-2xl bg-[#F3EEFF] text-[#8B5CF6] flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-[26px] font-bold text-[#0B1F4B] leading-none">
                {reports.totalPlacements.toLocaleString()}
              </div>
              <div className="text-[14px] text-[#6B7694] mt-1">Campus Placements</div>
              <div className="text-[12px] font-semibold text-[#22B573] flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> +18% YOY
              </div>
            </div>
          </div>
        </div>

        {/* 3. Two Charts Side by Side (Partner Verification Donut + Monthly Placement Growth Bar Chart) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Card 1: Partner Moderation Status (Donut Chart) */}
          <div className="bg-white rounded-[14px] p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between">
            <div>
              <h3 className="text-[16px] font-bold text-[#0B1F4B]">Employer Verification Status</h3>
              <p className="text-[12px] text-[#6B7694] mt-0.5">Corporate onboarding compliance</p>
            </div>

            <div className="my-4 flex flex-col sm:flex-row items-center justify-center gap-6">
              {/* Donut Container */}
              <div className="relative w-[170px] h-[170px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={KYC_STATUS_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {KYC_STATUS_DATA.map((entry, index) => (
                        <Cell key={`kyc-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-[24px] font-bold text-[#0B1F4B] leading-none">
                    {companies.length}
                  </span>
                  <span className="text-[10px] text-[#6B7694] font-medium leading-tight mt-1 max-w-[70px]">
                    Total Employers
                  </span>
                </div>
              </div>

              {/* Legend on the right */}
              <div className="space-y-3 w-full sm:w-auto">
                {KYC_STATUS_DATA.map((item) => (
                  <div key={item.name} className="flex items-center justify-between sm:justify-start gap-4 text-[13px]">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-[#6B7694]">{item.name}</span>
                    </div>
                    <span className="font-bold text-[#0B1F4B] ml-auto">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#EEF1F7] flex items-center justify-between text-[12px] text-[#6B7694]">
              <span>Active Partner ratio: 86.4%</span>
              <Link href="/admin/hr-management" className="text-[#1E5BE0] font-semibold hover:underline">
                Review Queue →
              </Link>
            </div>
          </div>

          {/* Card 2: Placement Growth Trend (Bar Chart) */}
          <div className="bg-white rounded-[14px] p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-bold text-[#0B1F4B]">Campus Placements Trend</h3>
                <p className="text-[12px] text-[#6B7694] mt-0.5">Monthly hiring offers accepted</p>
              </div>
              <select
                value={trendRange}
                onChange={(e) => setTrendRange(e.target.value)}
                className="text-[12px] font-medium text-[#0B1F4B] bg-[#F1F4F9] border-none rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="Year 2026">Year 2026</option>
                <option value="Last 6 Months">Last 6 Months</option>
              </select>
            </div>

            <div className="h-[210px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={placementTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="adminBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2F7BFF" />
                      <stop offset="100%" stopColor="#0756A8" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF1F7" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7694", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7694", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(7, 86, 168, 0.05)" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#0B1F4B] text-white text-[12px] py-1.5 px-3 rounded-lg shadow-lg">
                            <span className="font-bold">{payload[0].value}</span> placements
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="placements"
                    radius={[6, 6, 0, 0]}
                    fill="url(#adminBarGrad)"
                    animationDuration={1200}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-3 border-t border-[#EEF1F7] flex items-center justify-between text-[12px] text-[#6B7694]">
              <span>Peak Month: Mar (2,450 Placements)</span>
              <span className="font-semibold text-[#1E5BE0]">Trending +24%</span>
            </div>
          </div>
        </div>

        {/* 4. Partner Companies Queue Card with Table */}
        <div className="bg-white rounded-[14px] p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[16px] font-bold text-[#0B1F4B]">Employer Partner Verification Queue</h3>
              <p className="text-[12px] text-[#6B7694] mt-0.5">Real-time onboarding moderation</p>
            </div>
            <Link
              href="/admin/hr-management"
              className="text-[13px] font-semibold text-[#1E5BE0] hover:underline"
            >
              Manage All Employers →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F7FB] text-[12px] font-semibold text-[#6B7694] h-[44px]">
                  <th className="px-4 py-2 rounded-l-lg">Company Name</th>
                  <th className="px-4 py-2">Industry</th>
                  <th className="px-4 py-2">Location</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2 text-right rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF1F7] text-[13px]">
                {companies.slice(0, 5).map((comp) => {
                  const isPending = comp.status === "Pending";
                  const isApproved = comp.status === "Approved";

                  return (
                    <tr key={comp.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0756A8] font-bold text-xs flex items-center justify-center shrink-0 border border-blue-100">
                            {comp.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-[#0B1F4B] block leading-snug">
                              {comp.name}
                            </span>
                            <span className="text-[11px] text-[#6B7694]">{comp.website || "Corporate Recruiter"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-[#0B1F4B]">{comp.industry || "Technology"}</td>
                      <td className="px-4 py-3.5 text-[#6B7694]">{comp.location || "Bangalore, IN"}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${
                            isApproved
                              ? "bg-[#D8F3E5] text-[#22B573]"
                              : isPending
                              ? "bg-[#FFE9D6] text-[#E8650A]"
                              : "bg-[#FFE0E0] text-[#D93636]"
                          }`}
                        >
                          {comp.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <Link
                          href="/admin/hr-management"
                          className="border border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white px-3 py-1 rounded-md text-xs font-semibold transition"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= ZONE 3: RIGHT PANEL (~320px stacked cards, matching Student Dashboard) ================= */}
      <div className="w-full xl:w-[320px] shrink-0 space-y-5">
        {/* 1. System Health & Platform Status Card */}
        <div className="bg-white rounded-[14px] p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[16px] font-bold text-[#0B1F4B]">Campus Governance</h3>
            <span className="text-[14px] font-bold text-[#22B573]">99.9% Uptime</span>
          </div>
          <p className="text-[12px] text-[#6B7694] mb-3">
            Core infrastructure security metrics
          </p>

          {/* Progress bar */}
          <div className="w-full h-2 bg-[#F1F4F9] rounded-full overflow-hidden mb-5">
            <div className="h-full bg-[#22B573] rounded-full w-[99%]" />
          </div>

          {/* Checklist */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-[13px]">
              <div className="w-5 h-5 rounded-full bg-[#22B573] text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span className="font-medium text-[#0B1F4B]">PostgreSQL Cloud Active</span>
            </div>
            <div className="flex items-center gap-3 text-[13px]">
              <div className="w-5 h-5 rounded-full bg-[#22B573] text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span className="font-medium text-[#0B1F4B]">Email Dispatcher Operational</span>
            </div>
            <div className="flex items-center gap-3 text-[13px]">
              <div className="w-5 h-5 rounded-full bg-[#22B573] text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span className="font-medium text-[#0B1F4B]">JWT Multi-Role Guard Synced</span>
            </div>
          </div>

          <Link
            href="/admin/audit-logs"
            className="w-full h-[46px] bg-[#0756A8] hover:bg-[#06468a] text-white text-[13px] font-semibold rounded-[10px] flex items-center justify-center transition-colors shadow-sm"
          >
            Inspect Security Logs →
          </Link>
        </div>

        {/* 2. Recent Audit Logs Trail */}
        <div className="bg-white rounded-[14px] p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-bold text-[#0B1F4B]">Live Audit Stream</h3>
            <Link
              href="/admin/audit-logs"
              className="text-[13px] font-semibold text-[#1E5BE0] hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3.5">
            {auditLogs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-[12px] border border-[#EEF1F7] bg-[#FDFDFE] hover:border-[#1E5BE0]/30 transition-all flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0756A8] flex items-center justify-center shrink-0 mt-0.5">
                  <Activity className="w-4 h-4 text-[#0756A8]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[13px] text-[#0B1F4B] truncate">
                    {log.action}
                  </p>
                  <p className="text-[11px] text-[#6B7694] truncate">
                    {log.target} • {log.admin}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {log.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Quick Dispatcher Shortcut */}
        <div className="bg-gradient-to-br from-[#0756A8] to-[#0A1A2F] rounded-[14px] p-6 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-bold text-[16px] text-white">Campus Broadcaster</h4>
            <p className="text-[12px] text-slate-200/90 mt-1 leading-relaxed">
              Send emergency placement alerts or drive schedules to all registered students.
            </p>
            <Link
              href="/admin/email"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-white text-[#0756A8] text-xs font-bold rounded-lg hover:bg-slate-100 transition shadow"
            >
              <span>Compose Broadcast</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
