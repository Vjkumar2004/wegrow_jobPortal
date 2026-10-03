import React from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { adminService } from "@/services/admin.service";
import {
  BarChart3,
  TrendingUp,
  Users,
  Building2,
  Briefcase,
  Award,
  Calendar,
  FileCheck,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Platform Reports & Analytics | WeGrow Admin",
  description: "Comprehensive campus placement metrics and monthly conversion trends.",
};

export default async function AdminReportsPage() {
  const reports = await adminService.getReports();

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-7 space-y-6">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-[14px] p-6 sm:p-7 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] bg-gradient-to-r from-[#FFF5EE] via-[#F4F8FF] to-[#E9F2FF] flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0756A8] text-xs font-bold uppercase tracking-wider mb-2">
              <BarChart3 className="w-3.5 h-3.5" /> Campus Analytics Engine
            </div>
            <h1 className="text-[22px] sm:text-[26px] font-bold text-[#0B1F4B] tracking-tight">
              Platform Growth & Placement Reports
            </h1>
            <p className="text-[13px] text-[#6B7694] mt-1">
              Deep dive into campus placement velocity, corporate partner hiring volumes, and acceptance rates across universities.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-[#EEF1F7] shadow-sm shrink-0">
            <div className="text-center px-3">
              <div className="text-lg font-bold text-[#22B573] leading-none">
                +24%
              </div>
              <div className="text-[11px] text-[#6B7694] mt-1">Annual Growth</div>
            </div>
          </div>
        </div>

        {/* 4 Colored Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="bg-white rounded-[14px] p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] flex items-center gap-4 bg-gradient-to-br from-blue-50/40 to-white">
            <div className="w-[56px] h-[56px] rounded-2xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-[26px] font-bold text-[#0B1F4B] leading-none">
                {reports.totalStudents.toLocaleString()}
              </div>
              <div className="text-[13px] text-[#6B7694] mt-1">Enrolled Candidates</div>
              <div className="text-[12px] font-semibold text-[#22B573] flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> +12% this term
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[14px] p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] flex items-center gap-4 bg-gradient-to-br from-orange-50/40 to-white">
            <div className="w-[56px] h-[56px] rounded-2xl bg-[#FFF0E6] text-[#FF6B00] flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-[26px] font-bold text-[#0B1F4B] leading-none">
                {reports.totalCompanies.toLocaleString()}
              </div>
              <div className="text-[13px] text-[#6B7694] mt-1">Hiring Employers</div>
              <div className="text-[12px] font-semibold text-[#22B573] flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> 86% verified
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[14px] p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] flex items-center gap-4 bg-gradient-to-br from-emerald-50/40 to-white">
            <div className="w-[56px] h-[56px] rounded-2xl bg-[#E8F8F1] text-[#22B573] flex items-center justify-center shrink-0">
              <Briefcase className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-[26px] font-bold text-[#0B1F4B] leading-none">
                {reports.totalJobs.toLocaleString()}
              </div>
              <div className="text-[13px] text-[#6B7694] mt-1">Job Openings</div>
              <div className="text-[12px] font-semibold text-[#22B573] flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> +520 this week
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[14px] p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] flex items-center gap-4 bg-gradient-to-br from-purple-50/40 to-white">
            <div className="w-[56px] h-[56px] rounded-2xl bg-[#F3EEFF] text-[#8B5CF6] flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-[26px] font-bold text-[#0B1F4B] leading-none">
                {reports.totalPlacements.toLocaleString()}
              </div>
              <div className="text-[13px] text-[#6B7694] mt-1">Offers Secured</div>
              <div className="text-[12px] font-semibold text-[#22B573] flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> Highest record
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Placement Progress Visuals */}
        <div className="bg-white rounded-[14px] border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] p-6 sm:p-7 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[16px] font-bold text-[#0B1F4B]">Monthly Placement Conversion Milestones</h2>
              <p className="text-[12px] text-[#6B7694] mt-0.5">Distribution of accepted campus offer letters</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Consistently Trending Upwards
            </span>
          </div>

          <div className="space-y-4">
            {reports.monthlyPlacements.map((item: { month: string; count: number }) => {
              const maxPlacements = 3000;
              const percentage = Math.round((item.count / maxPlacements) * 100);
              return (
                <div key={item.month} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#0B1F4B]">
                    <span>{item.month} 2026</span>
                    <span className="font-bold text-[#1E5BE0]">{item.count.toLocaleString()} Students Placed</span>
                  </div>
                  <div className="w-full bg-[#F1F4F9] rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#1E5BE0] to-blue-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
