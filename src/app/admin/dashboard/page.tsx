import React from "react";
import Link from "next/link";
import { AdminLayout } from "@/layouts/AdminLayout";
import { adminService } from "@/services/admin.service";
import { StatsCard } from "@/components/common/StatsCard";
import {
  Users,
  Building2,
  Briefcase,
  FileCheck,
  Calendar,
  Award,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export const metadata = {
  title: "Admin Control Center | WeGrow Skill Campus",
};

export default async function AdminDashboardPage() {
  const [reports, auditLogs, companies, students] = await Promise.all([
    adminService.getReports(),
    adminService.getAuditLogs(),
    adminService.getCompanies(),
    adminService.getStudents(),
  ]);

  const pendingCompanies = companies.filter((c) => c.status === "Pending");

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0756A8] bg-blue-100 px-3 py-1 rounded-full">
              Platform Administration
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
              WeGrow Skill Campus Control Center
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live moderation, campus verification stats, company onboarding, and dispatch audit logs.
            </p>
          </div>
          {pendingCompanies.length > 0 && (
            <Link href="/admin/hr-management">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-bold rounded-xl hover:bg-amber-500/20 transition-all">
                ⚠️ {pendingCompanies.length} Partner Pending Approval
              </span>
            </Link>
          )}
        </div>

        {/* Global Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatsCard title="Total Students" value={reports.totalStudents.toLocaleString()} />
          <StatsCard title="Companies" value={reports.totalCompanies.toLocaleString()} />
          <StatsCard title="Total Jobs" value={reports.totalJobs.toLocaleString()} />
          <StatsCard title="Applications" value={reports.totalApplications.toLocaleString()} />
          <StatsCard title="Interviews" value={reports.totalInterviews.toLocaleString()} />
          <StatsCard title="Placements" value={reports.totalPlacements.toLocaleString()} trendUp={true} trend="+18%" />
        </div>

        {/* Audit Log and Approvals Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Audit Logs */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Recent Platform Audit Logs</h2>
                <p className="text-xs text-slate-500">Security and moderation trail</p>
              </div>
              <Link href="/admin/audit-logs" className="text-xs font-semibold text-[#0756A8] hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{log.action}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Target: {log.target} • By {log.admin}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Management Shortcuts */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Quick Moderation Hub</h2>
            <div className="space-y-3">
              <Link
                href="/admin/hr-management"
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 hover:border-[#0756A8] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#0756A8] flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">HR & Partner Companies</h4>
                    <p className="text-[11px] text-slate-400">{companies.length} active corporate partners</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/admin/students"
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 hover:border-[#0756A8] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-[#F79400] flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Candidate Profiles</h4>
                    <p className="text-[11px] text-slate-400">{students.length} verified sample profiles</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/admin/email"
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 hover:border-[#0756A8] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Email Broadcast Engine</h4>
                    <p className="text-[11px] text-slate-400">Direct notice dispatcher</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
