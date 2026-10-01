import React from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { adminService } from "@/services/admin.service";
import { StatsCard } from "@/components/common/StatsCard";
import { BarChart3, TrendingUp, Users, Building2, Briefcase, Award } from "lucide-react";

export const metadata = {
  title: "Platform Reports & Analytics | WeGrow Admin",
};

export default async function AdminReportsPage() {
  const reports = await adminService.getReports();

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Platform Growth & Placement Reports</h1>
          <p className="text-xs text-slate-500 mt-1">
            Comprehensive analytics on student enrollments, enterprise job volumes, and placement conversion rates.
          </p>
        </div>

        {/* Big metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatsCard title="Students" value={reports.totalStudents.toLocaleString()} />
          <StatsCard title="Companies" value={reports.totalCompanies.toLocaleString()} />
          <StatsCard title="Jobs Posted" value={reports.totalJobs.toLocaleString()} />
          <StatsCard title="Applications" value={reports.totalApplications.toLocaleString()} />
          <StatsCard title="Interviews" value={reports.totalInterviews.toLocaleString()} />
          <StatsCard title="Placements" value={reports.totalPlacements.toLocaleString()} trendUp={true} trend="+24%" />
        </div>

        {/* Growth trends */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Monthly Placement Conversions</h2>
              <p className="text-xs text-slate-500">Number of college students securing offers per month</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              Trending Upwards
            </span>
          </div>

          <div className="space-y-3">
            {reports.monthlyPlacements.map((item: { month: string; count: number }) => {
              const maxPlacements = 3000;
              const percentage = Math.round((item.count / maxPlacements) * 100);
              return (
                <div key={item.month} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>{item.month} 2024</span>
                    <span>{item.count} Offers</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-[#0756A8] h-full rounded-full transition-all duration-500"
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
