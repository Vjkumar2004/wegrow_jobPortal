"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Award,
  Target,
  Sparkles,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  Briefcase,
  Users,
  Eye,
  Zap,
  Info,
  ChevronRight,
  Share2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { StudentReportsData } from "@/types";

interface StudentReportsClientProps {
  initialData: StudentReportsData;
}

export default function StudentReportsClient({ initialData }: StudentReportsClientProps) {
  const [data] = useState<StudentReportsData>(initialData);
  const [selectedPeriod, setSelectedPeriod] = useState("Last 6 Months");
  const [activeChartTab, setActiveChartTab] = useState<"stacked" | "growth" | "conversion">("stacked");

  const { summary, monthlyTrends, statusFunnel, domainPerformance, interviewBreakdown, topSkillsDemand } = data;

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-7xl mx-auto w-full font-['Poppins',sans-serif]">
      {/* 1. Header with Export & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FF] text-[#1E5BE0] text-xs font-bold uppercase tracking-wider mb-2">
            <BarChart3 className="w-3.5 h-3.5" /> Performance Analytics & Reports
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F4B] tracking-tight">
            Campus Placement Analytics
          </h1>
          <p className="text-sm text-[#6B7694] mt-1">
            Real-time tracking of application conversion, monthly velocity, skill demand, and interview benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-white border border-[#E3E8F0] text-[#0B1F4B] text-xs font-semibold px-3 py-2 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 shadow-sm cursor-pointer pr-7"
            >
              <option value="Last 3 Months">Last 3 Months</option>
              <option value="Last 6 Months">Last 6 Months</option>
              <option value="Year 2026">Year 2026</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => alert("Downloading official student analytics report (PDF)...")}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#1E5BE0] text-white text-xs font-semibold rounded-[10px] hover:bg-[#1546B0] transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards (5 Columns) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Total Applied */}
        <div className="bg-white rounded-[14px] p-4 sm:p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] hover:shadow-md transition">
          <div className="flex items-center justify-between text-[#6B7694]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Applied</span>
            <div className="w-8 h-8 rounded-lg bg-[#EAF1FF] text-[#1E5BE0] flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4B] mt-2">
            {summary.totalApplications}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#22B573] font-semibold mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+4 this month</span>
          </div>
        </div>

        {/* Shortlisted */}
        <div className="bg-white rounded-[14px] p-4 sm:p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] hover:shadow-md transition">
          <div className="flex items-center justify-between text-[#6B7694]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Shortlisted</span>
            <div className="w-8 h-8 rounded-lg bg-[#FFF2E8] text-[#FF6B00] flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#FF6B00] mt-2">
            {summary.shortlisted}
          </div>
          <div className="text-[11px] text-[#6B7694] mt-1">
            37.5% conversion
          </div>
        </div>

        {/* Interviews */}
        <div className="bg-white rounded-[14px] p-4 sm:p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] hover:shadow-md transition">
          <div className="flex items-center justify-between text-[#6B7694]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Interviews</span>
            <div className="w-8 h-8 rounded-lg bg-[#EAF1FF] text-[#1E5BE0] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#1E5BE0] mt-2">
            {summary.interviews}
          </div>
          <div className="text-[11px] text-[#1E5BE0] font-semibold mt-1">
            2 live rounds booked
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-white rounded-[14px] p-4 sm:p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] hover:shadow-md transition">
          <div className="flex items-center justify-between text-[#6B7694]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Success Rate</span>
            <div className="w-8 h-8 rounded-lg bg-[#E8F8EF] text-[#22B573] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#22B573] mt-2">
            {summary.successRate}
          </div>
          <div className="text-[11px] text-[#22B573] font-semibold mt-1">
            Top 15% in Campus
          </div>
        </div>

        {/* Profile Views */}
        <div className="col-span-2 sm:col-span-1 bg-white rounded-[14px] p-4 sm:p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] hover:shadow-md transition">
          <div className="flex items-center justify-between text-[#6B7694]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Profile Views</span>
            <div className="w-8 h-8 rounded-lg bg-[#F3EEFF] text-[#8B5CF6] flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4B] mt-2">
            {summary.profileViews}
          </div>
          <div className="text-[11px] text-[#8B5CF6] font-semibold mt-1">
            Recruiter visits
          </div>
        </div>
      </div>

      {/* 3. Primary Charts Row: Monthly Application & Shortlist Trajectory (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Trajectory Bar / Area Chart (Span 2) */}
        <div className="lg:col-span-2 bg-white rounded-[14px] border border-[#EEF1F7] p-5 sm:p-6 shadow-[0_4px_14px_rgba(11,31,75,0.05)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EEF1F7] pb-4">
            <div>
              <h2 className="text-base font-bold text-[#0B1F4B]">Application & Shortlisting Velocity</h2>
              <p className="text-xs text-[#6B7694] mt-0.5">
                Comparison of jobs applied versus shortlisted interviews over time.
              </p>
            </div>

            {/* Toggle view tabs */}
            <div className="inline-flex p-1 bg-[#F1F4F9] rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveChartTab("stacked")}
                className={`px-3 py-1 rounded-md transition ${
                  activeChartTab === "stacked"
                    ? "bg-white text-[#1E5BE0] shadow-sm"
                    : "text-[#6B7694] hover:text-[#0B1F4B]"
                }`}
              >
                Bar View
              </button>
              <button
                type="button"
                onClick={() => setActiveChartTab("growth")}
                className={`px-3 py-1 rounded-md transition ${
                  activeChartTab === "growth"
                    ? "bg-white text-[#1E5BE0] shadow-sm"
                    : "text-[#6B7694] hover:text-[#0B1F4B]"
                }`}
              >
                Growth Trend
              </button>
            </div>
          </div>

          {/* Chart Display */}
          <div className="h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {activeChartTab === "stacked" ? (
                <BarChart data={monthlyTrends} barGap={6} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF1F7" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#6B7694", fontSize: 11, fontFamily: "Poppins" }}
                    axisLine={{ stroke: "#EEF1F7" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#6B7694", fontSize: 11, fontFamily: "Poppins" }}
                    axisLine={{ stroke: "#EEF1F7" }}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0B1F4B",
                      color: "#FFFFFF",
                      borderRadius: 10,
                      border: "none",
                      fontSize: 12,
                      fontFamily: "Poppins",
                      padding: "8px 12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                    }}
                    itemStyle={{ color: "#FFFFFF" }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: 12, fontSize: 12 }}
                  />
                  <Bar
                    dataKey="applied"
                    name="Applications Sent"
                    fill="#1E5BE0"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={32}
                  />
                  <Bar
                    dataKey="shortlisted"
                    name="Shortlisted"
                    fill="#FF6B00"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={32}
                  />
                  <Bar
                    dataKey="interviews"
                    name="Interviews Held"
                    fill="#22B573"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              ) : (
                <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorApplied" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E5BE0" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#1E5BE0" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorShortlisted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#FF6B00" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF1F7" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#6B7694", fontSize: 11, fontFamily: "Poppins" }}
                    axisLine={{ stroke: "#EEF1F7" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#6B7694", fontSize: 11, fontFamily: "Poppins" }}
                    axisLine={{ stroke: "#EEF1F7" }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0B1F4B",
                      color: "#FFFFFF",
                      borderRadius: 10,
                      border: "none",
                      fontSize: 12,
                      fontFamily: "Poppins",
                      padding: "8px 12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="applied"
                    name="Applications Sent"
                    stroke="#1E5BE0"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorApplied)"
                  />
                  <Area
                    type="monotone"
                    dataKey="shortlisted"
                    name="Shortlisted"
                    stroke="#FF6B00"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorShortlisted)"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Quick takeaway note */}
          <div className="bg-[#F7F9FD] rounded-xl p-3 border border-[#E9EDF5] flex items-center justify-between text-xs text-[#6B7694]">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#1E5BE0] shrink-0" />
              <span>
                <strong className="text-[#0B1F4B]">Peak Velocity:</strong> March 2026 recorded your highest shortlist rate at 50%.
              </span>
            </div>
            <span className="font-semibold text-[#1E5BE0] shrink-0 hidden sm:inline">
              Avg Response: {summary.avgResponseDays} Days
            </span>
          </div>
        </div>

        {/* Interview Breakdown Donut Chart (Span 1) */}
        <div className="bg-white rounded-[14px] border border-[#EEF1F7] p-5 sm:p-6 shadow-[0_4px_14px_rgba(11,31,75,0.05)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-[#EEF1F7] pb-3">
              <h2 className="text-base font-bold text-[#0B1F4B]">Interview Formats</h2>
              <span className="text-xs font-semibold text-[#1E5BE0] bg-[#E8F0FF] px-2 py-0.5 rounded-full">
                {summary.interviews} Rounds
              </span>
            </div>
            <p className="text-xs text-[#6B7694] mt-2">
              Distribution of technical, architectural, and HR rounds completed.
            </p>
          </div>

          <div className="h-[200px] w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={interviewBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {interviewBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0B1F4B",
                    color: "#FFFFFF",
                    borderRadius: 8,
                    fontSize: 11,
                    fontFamily: "Poppins",
                    border: "none",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-extrabold text-[#0B1F4B] leading-none">
                {interviewBreakdown.reduce((acc, curr) => acc + curr.count, 0)}
              </span>
              <span className="text-[10px] uppercase font-semibold text-[#6B7694] mt-0.5">
                Total
              </span>
            </div>
          </div>

          {/* Legend items */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#EEF1F7]">
            {interviewBreakdown.map((item) => (
              <div key={item.type} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <div className="text-[11px] truncate">
                  <span className="text-[#0B1F4B] font-medium block truncate">{item.type}</span>
                  <span className="text-[#6B7694]">{item.count} rounds</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Secondary Row: Funnel Conversion & Domain Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recruitment Funnel Progress */}
        <div className="bg-white rounded-[14px] border border-[#EEF1F7] p-5 sm:p-6 shadow-[0_4px_14px_rgba(11,31,75,0.05)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#EEF1F7] pb-3">
            <div>
              <h2 className="text-base font-bold text-[#0B1F4B]">Application Conversion Funnel</h2>
              <p className="text-xs text-[#6B7694] mt-0.5">
                Progression of your candidatures from initial submission to final job offer.
              </p>
            </div>
            <span className="text-xs font-bold text-[#22B573] bg-[#E8F8EF] px-2.5 py-1 rounded-md">
              {summary.offers} Offers Received
            </span>
          </div>

          <div className="space-y-3.5 pt-1">
            {statusFunnel.map((item) => (
              <div key={item.stage} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-semibold text-[#0B1F4B]">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.stage}</span>
                  </div>
                  <div className="text-[#6B7694]">
                    <strong className="text-[#0B1F4B]">{item.count}</strong> candidates ({item.percentage}%)
                  </div>
                </div>
                <div className="w-full bg-[#F1F4F9] rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#EEF1F7] flex items-center justify-between text-xs text-[#6B7694]">
            <span>Average turnaround: <strong>4.2 days per round</strong></span>
            <Link href="/student/applications" className="text-[#1E5BE0] font-semibold hover:underline flex items-center gap-1">
              View All Applications <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Domain Success Performance & Skills Demand */}
        <div className="bg-white rounded-[14px] border border-[#EEF1F7] p-5 sm:p-6 shadow-[0_4px_14px_rgba(11,31,75,0.05)] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#EEF1F7] pb-3">
              <div>
                <h2 className="text-base font-bold text-[#0B1F4B]">Role Category Conversion</h2>
                <p className="text-xs text-[#6B7694] mt-0.5">
                  Which job domains yield your highest shortlist conversion.
                </p>
              </div>
              <span className="text-xs font-semibold text-[#1E5BE0] bg-[#E8F0FF] px-2 py-0.5 rounded-full">
                4 Domains
              </span>
            </div>

            <div className="divide-y divide-[#EEF1F7] mt-1">
              {domainPerformance.map((domain) => (
                <div key={domain.domain} className="py-2.5 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#0B1F4B]">{domain.domain}</h4>
                    <span className="text-[11px] text-[#6B7694]">
                      {domain.applications} applied • {domain.shortlisted} shortlisted
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E8F0FF] text-[#1E5BE0]">
                      {domain.rate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top In-Demand Skills Pill Wrap */}
          <div className="pt-4 border-t border-[#EEF1F7] bg-[#F7F9FD] -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 rounded-b-[14px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#0B1F4B] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                Top Skills Matched with Job Postings
              </span>
              <Link href="/student/profile#skills" className="text-[11px] text-[#1E5BE0] font-semibold hover:underline">
                Update Skills
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {topSkillsDemand.map((item) => (
                <span
                  key={item.skill}
                  className="bg-white border border-[#E3E8F0] text-[#0B1F4B] text-xs font-medium px-2.5 py-1 rounded-full shadow-2xs flex items-center gap-1.5"
                >
                  <span>{item.skill}</span>
                  <span className="text-[10px] font-bold text-[#1E5BE0] bg-[#E8F0FF] px-1.5 py-0.2 rounded-full">
                    {item.percentage}%
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom Recommendation Banner */}
      <div className="bg-gradient-to-r from-[#1E5BE0] to-[#0B1F4B] text-white rounded-[14px] p-5 sm:p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-xs text-xs font-semibold px-2.5 py-0.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#FFB020]" />
            AI Profile Benchmark
          </div>
          <h3 className="text-lg font-bold">Boost your shortlist rate by adding Docker & CI/CD</h3>
          <p className="text-xs text-blue-100 max-w-xl">
            Students with Full Stack profiles that include Cloud & Containerization received 42% more interview invitations this hiring season.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/student/profile"
            className="px-4 py-2.5 bg-white text-[#1E5BE0] text-xs font-bold rounded-[8px] hover:bg-blue-50 transition shadow-sm"
          >
            Improve Profile →
          </Link>
          <Link
            href="/student/jobs"
            className="px-4 py-2.5 bg-white/10 border border-white/20 text-white text-xs font-semibold rounded-[8px] hover:bg-white/20 transition"
          >
            Explore Matching Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
