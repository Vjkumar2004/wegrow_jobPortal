"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Building2,
  Briefcase,
  Award,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Mail,
  CheckCircle2,
  Sparkles,
  Activity,
  AlertCircle,
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
import { AuditLog, AdminReportData, adminService } from "@/services/admin.service";
import { getCompanyLogoProxyUrl } from "@/lib/utils";
import { PageLoader } from "@/components/common/PageLoader";


export default function AdminDashboardClient() {
  const [trendRange, setTrendRange] = useState("Year 2026");
  const [reports, setReports] = useState<AdminReportData>({
    totalStudents: 0,
    totalCompanies: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalInterviews: 0,
    totalPlacements: 0,
    monthlyPlacements: [],
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [students, setStudents] = useState<StudentAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [r, a, c, s] = await Promise.all([
          adminService.getReports().catch(() => ({
            totalStudents: 0, totalCompanies: 0, totalJobs: 0,
            totalApplications: 0, totalInterviews: 0, totalPlacements: 0, monthlyPlacements: [],
          })),
          adminService.getAuditLogs().catch(() => []),
          adminService.getCompanies().catch(() => []),
          adminService.getStudents().catch(() => []),
        ]);
        setReports(r);
        setAuditLogs(a);
        setCompanies(c);
        setStudents(s);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const pendingCompanies = companies.filter((c) => c.status === "Pending");
  const approvedCompanies = companies.filter((c) => c.status === "Approved");
  const suspendedCompanies = companies.filter((c) => c.status === "Suspended" || c.status === "Rejected");

  const kycStatusData = [
    { name: "Approved", value: approvedCompanies.length, color: "#22B573" },
    { name: "Pending Review", value: pendingCompanies.length, color: "#FF6B00" },
    { name: "Suspended", value: suspendedCompanies.length, color: "#EF4444" },
  ];

  const totalKycEmployers = companies.length;
  const kycChartData =
    totalKycEmployers > 0
      ? kycStatusData.filter((item) => item.value > 0)
      : [{ name: "No Employers", value: 1, color: "#E2E8F0" }];

  const activePartnerRatio =
    totalKycEmployers > 0
      ? ((approvedCompanies.length / totalKycEmployers) * 100).toFixed(1)
      : "0.0";

  // Dynamic Chart data from reports.monthlyPlacements
  const placementTrendData = reports.monthlyPlacements.map((item) => ({
    month: item.month,
    placements: item.count,
  }));

  const maxPlacementRecord = placementTrendData.length > 0
    ? [...placementTrendData].sort((a, b) => b.placements - a.placements)[0]
    : null;

  if (loading) {
    return (
      <PageLoader
        label="Admin Control Center"
        subLabel="Loading metrics & system analytics..."
        fullScreen={false}
      />
    );
  }

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
              Campus placement operations and partner compliance monitoring.
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
                {(students.length || reports.totalStudents).toLocaleString()}
              </div>
              <div className="text-[14px] text-[#6B7694] mt-1">Total Students</div>
              <div className="text-[12px] font-semibold text-[#1E5BE0] flex items-center gap-1 mt-1">
                <span>Registered Learners</span>
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
                {(companies.length || reports.totalCompanies).toLocaleString()}
              </div>
              <div className="text-[14px] text-[#6B7694] mt-1">Partner Companies</div>
              <div className="text-[12px] font-semibold text-[#FF6B00] flex items-center gap-1 mt-1">
                <span>{approvedCompanies.length} Verified Active</span>
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
                <span>Active Listings</span>
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
              <div className="text-[12px] font-semibold text-[#8B5CF6] flex items-center gap-1 mt-1">
                <span>Offers Confirmed</span>
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
                      data={kycChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={75}
                      paddingAngle={totalKycEmployers > 0 ? 3 : 0}
                      dataKey="value"
                    >
                      {kycChartData.map((entry, index) => (
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
                {kycStatusData.map((item) => (
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
              <span>Active Partner ratio: {activePartnerRatio}%</span>
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
              <span>
                {maxPlacementRecord && maxPlacementRecord.placements > 0
                  ? `Peak Month: ${maxPlacementRecord.month} (${maxPlacementRecord.placements.toLocaleString()} Placements)`
                  : "Placement statistics updated in real time"}
              </span>
              <span className="font-semibold text-[#1E5BE0]">
                {reports.totalPlacements > 0 ? `${reports.totalPlacements} Total Placed` : "Live Data"}
              </span>
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
                {companies.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-[#6B7694] text-xs">
                      No corporate partners registered yet.
                    </td>
                  </tr>
                ) : (
                  companies.slice(0, 5).map((comp) => {
                    const isPending = comp.status === "Pending";
                    const isApproved = comp.status === "Approved";

                    return (
                      <tr key={comp.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0756A8] font-bold text-xs flex items-center justify-center shrink-0 border border-blue-100 overflow-hidden">
                              {comp.id || comp.logo ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={comp.id ? getCompanyLogoProxyUrl(comp.id) : comp.logo}
                                  alt={comp.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.currentTarget as HTMLImageElement;
                                    target.style.display = "none";
                                    if (target.parentElement) {
                                      target.parentElement.innerText = comp.name.substring(0, 2).toUpperCase();
                                    }
                                  }}
                                />
                              ) : (
                                comp.name.substring(0, 2).toUpperCase()
                              )}
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
                  })
                )}
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
            <span className="text-[14px] font-bold text-[#22B573]">Active</span>
          </div>
          <p className="text-[12px] text-[#6B7694] mb-3">
            Core infrastructure security metrics
          </p>

          {/* Progress bar */}
          <div className="w-full h-2 bg-[#F1F4F9] rounded-full overflow-hidden mb-5">
            <div className="h-full bg-[#22B573] rounded-full w-full" />
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
            {auditLogs.length === 0 ? (
              <div className="p-4 text-center text-[#6B7694] text-xs">
                No recent system activity logged yet.
              </div>
            ) : (
              auditLogs.slice(0, 4).map((log) => (
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
              ))
            )}
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
