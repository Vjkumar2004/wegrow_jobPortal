"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Award,
  Target,
  Sparkles,
  Calendar,
  Download,
  Users,
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Zap,
  Loader2,
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { hrService } from "@/services/hr.service";

interface HRReportsData {
  jobsPosted: number;
  totalApplicants: number;
  shortlisted: number;
  interviewsScheduled: number;
  selectedCandidates: number;
  offerAcceptanceRate: string;
  monthlyVelocity: Array<{
    month: string;
    applications: number;
    shortlisted: number;
    offers: number;
  }>;
  funnelStages: Array<{
    stage: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  collegeSourceDistribution: Array<{
    college: string;
    candidates: number;
    color: string;
  }>;
}

const EMPTY_HR_REPORTS_DATA: HRReportsData = {
  jobsPosted: 0,
  totalApplicants: 0,
  shortlisted: 0,
  interviewsScheduled: 0,
  selectedCandidates: 0,
  offerAcceptanceRate: "0%",
  monthlyVelocity: [
    { month: "Jan", applications: 0, shortlisted: 0, offers: 0 },
    { month: "Feb", applications: 0, shortlisted: 0, offers: 0 },
    { month: "Mar", applications: 0, shortlisted: 0, offers: 0 },
    { month: "Apr", applications: 0, shortlisted: 0, offers: 0 },
    { month: "May", applications: 0, shortlisted: 0, offers: 0 },
    { month: "Jun", applications: 0, shortlisted: 0, offers: 0 },
    { month: "Jul", applications: 0, shortlisted: 0, offers: 0 },
    { month: "Aug", applications: 0, shortlisted: 0, offers: 0 },
    { month: "Sep", applications: 0, shortlisted: 0, offers: 0 },
    { month: "Oct", applications: 0, shortlisted: 0, offers: 0 },
    { month: "Nov", applications: 0, shortlisted: 0, offers: 0 },
    { month: "Dec", applications: 0, shortlisted: 0, offers: 0 },
  ],
  funnelStages: [
    { stage: "Submitted Profiles", count: 0, percentage: 0, color: "#1E5BE0" },
    { stage: "Screening Passed", count: 0, percentage: 0, color: "#6366F1" },
    { stage: "Shortlisted for Interview", count: 0, percentage: 0, color: "#FF6B00" },
    { stage: "Technical Video Rounds", count: 0, percentage: 0, color: "#22B573" },
    { stage: "Final Offer Releases", count: 0, percentage: 0, color: "#8B5CF6" },
  ],
  collegeSourceDistribution: [],
};

export default function HRReportsClient({ initialReports }: { initialReports?: Partial<HRReportsData> | null }) {
  const [selectedPeriod, setSelectedPeriod] = useState<"Last 3 Months" | "Last 6 Months" | "Year 2026">("Last 6 Months");
  const [chartType, setChartType] = useState<"bar" | "trend">("bar");
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<HRReportsData>(() => {
    if (initialReports && typeof initialReports.totalApplicants === "number") {
      return {
        ...EMPTY_HR_REPORTS_DATA,
        ...initialReports,
      } as HRReportsData;
    }
    return EMPTY_HR_REPORTS_DATA;
  });

  useEffect(() => {
    setIsMounted(true);
    let isCancelled = false;

    async function loadRealAnalytics() {
      setLoading(true);
      try {
        const realData = await hrService.getReports();
        if (!isCancelled && realData) {
          setReportData(realData);
        }
      } catch (err) {
        console.error("Failed to load HR reports from API:", err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadRealAnalytics();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Filter velocity months based on selected dropdown
  const filteredVelocity = useMemo(() => {
    const list = reportData.monthlyVelocity || [];
    if (list.length === 0) return [];
    if (selectedPeriod === "Last 3 Months") {
      // Show Aug, Sep, Oct (or last 3 items)
      return list.length >= 10 ? list.slice(7, 10) : list.slice(-3);
    }
    if (selectedPeriod === "Last 6 Months") {
      // Show May through Oct (or last 6 items)
      return list.length >= 10 ? list.slice(4, 10) : list.slice(-6);
    }
    return list; // Year 2026: all months
  }, [reportData.monthlyVelocity, selectedPeriod]);

  // Conversion rate computation
  const shortlistRate = useMemo(() => {
    if (!reportData.totalApplicants) return 0;
    return Math.round((reportData.shortlisted / reportData.totalApplicants) * 100);
  }, [reportData.totalApplicants, reportData.shortlisted]);

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-7xl mx-auto w-full font-['Poppins',sans-serif]">
      {/* 1. Header with Period Picker & PDF Export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FF] text-[#1E5BE0] text-xs font-bold uppercase tracking-wider mb-2">
            <BarChart3 className="w-3.5 h-3.5" /> Corporate Hiring Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4B] tracking-tight">
            Recruitment Funnel & Sourcing Metrics
          </h1>
          <p className="text-sm text-[#6B7694] mt-1">
            Real-time campus applicant flow, interview conversion, and partner college hiring yields.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {loading && (
            <div className="inline-flex items-center gap-1.5 text-xs text-[#6B7694]">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1E5BE0]" />
              <span>Updating...</span>
            </div>
          )}

          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="bg-white border border-[#E3E8F0] text-[#0B1F4B] text-xs font-semibold px-3 py-2 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 shadow-xs cursor-pointer"
          >
            <option value="Last 3 Months">Last 3 Months</option>
            <option value="Last 6 Months">Last 6 Months</option>
            <option value="Year 2026">Year 2026</option>
          </select>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#1E5BE0] hover:bg-[#1546B0] text-white text-xs font-semibold rounded-[10px] transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Analytics</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards (5 Cards: Applied, Shortlisted, Interviews, Hires, Offer Acceptance) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Applicants */}
        <div className="bg-white rounded-[14px] p-4 sm:p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] hover:shadow-md transition">
          <div className="flex items-center justify-between text-[#6B7694]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Applicants</span>
            <div className="w-8 h-8 rounded-lg bg-[#EAF1FF] text-[#1E5BE0] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4B] mt-2">
            {reportData.totalApplicants}
          </div>
          <span className="text-[11px] text-[#22B573] font-semibold mt-1 block">
            {reportData.totalApplicants > 0 ? `+${reportData.totalApplicants} total received` : "No applicants yet"}
          </span>
        </div>

        {/* Shortlisted */}
        <div className="bg-white rounded-[14px] p-4 sm:p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] hover:shadow-md transition">
          <div className="flex items-center justify-between text-[#6B7694]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Shortlisted</span>
            <div className="w-8 h-8 rounded-lg bg-[#FFF0E6] text-[#FF6B00] flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#FF6B00] mt-2">
            {reportData.shortlisted}
          </div>
          <span className="text-[11px] text-[#6B7694] mt-1 block">
            {shortlistRate}% conversion
          </span>
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
            {reportData.interviewsScheduled}
          </div>
          <span className="text-[11px] text-[#1E5BE0] font-semibold mt-1 block">
            {reportData.interviewsScheduled === 1 ? "1 active round" : `${reportData.interviewsScheduled} active rounds`}
          </span>
        </div>

        {/* Offers Made */}
        <div className="bg-white rounded-[14px] p-4 sm:p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] hover:shadow-md transition">
          <div className="flex items-center justify-between text-[#6B7694]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Offers Made</span>
            <div className="w-8 h-8 rounded-lg bg-[#E8F8EF] text-[#22B573] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#22B573] mt-2">
            {reportData.selectedCandidates}
          </div>
          <span className="text-[11px] text-[#22B573] font-semibold mt-1 block">
            {reportData.selectedCandidates === 1 ? "1 campus hire" : `${reportData.selectedCandidates} campus hires`}
          </span>
        </div>

        {/* Acceptance */}
        <div className="col-span-2 sm:col-span-1 bg-white rounded-[14px] p-4 sm:p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] hover:shadow-md transition">
          <div className="flex items-center justify-between text-[#6B7694]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Acceptance</span>
            <div className="w-8 h-8 rounded-lg bg-[#F3EEFF] text-[#8B5CF6] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#8B5CF6] mt-2">
            {reportData.offerAcceptanceRate}
          </div>
          <span className="text-[11px] text-[#8B5CF6] font-semibold mt-1 block">Offer to join rate</span>
        </div>
      </div>

      {/* 3. Primary Charts: Monthly Hiring Velocity & Campus Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Velocity Bar Chart (Span 2) */}
        <div className="lg:col-span-2 bg-white rounded-[14px] border border-[#EEF1F7] p-5 sm:p-6 shadow-[0_4px_14px_rgba(11,31,75,0.05)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EEF1F7] pb-4">
            <div>
              <h2 className="text-base font-bold text-[#0B1F4B]">Monthly Candidate Pipeline Velocity</h2>
              <p className="text-xs text-[#6B7694] mt-0.5">
                Real timeline of applications received, shortlisted candidates, and offers extended.
              </p>
            </div>

            <div className="inline-flex p-1 bg-[#F1F4F9] rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setChartType("bar")}
                className={`px-3 py-1 rounded-md transition ${
                  chartType === "bar" ? "bg-white text-[#1E5BE0] shadow-sm" : "text-[#6B7694]"
                }`}
              >
                Bar Chart
              </button>
              <button
                type="button"
                onClick={() => setChartType("trend")}
                className={`px-3 py-1 rounded-md transition ${
                  chartType === "trend" ? "bg-white text-[#1E5BE0] shadow-sm" : "text-[#6B7694]"
                }`}
              >
                Area Trend
              </button>
            </div>
          </div>

          <div className="h-[280px] w-full pt-2">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "bar" ? (
                  <BarChart data={filteredVelocity} barGap={6} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF1F7" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "#6B7694", fontSize: 11, fontFamily: "Poppins" }}
                      axisLine={{ stroke: "#EEF1F7" }}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
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
                    <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 12, fontSize: 12 }} />
                    <Bar dataKey="applications" name="Applications" fill="#1E5BE0" radius={[6, 6, 0, 0]} maxBarSize={30} />
                    <Bar dataKey="shortlisted" name="Shortlisted" fill="#FF6B00" radius={[6, 6, 0, 0]} maxBarSize={30} />
                    <Bar dataKey="offers" name="Offers" fill="#22B573" radius={[6, 6, 0, 0]} maxBarSize={30} />
                  </BarChart>
                ) : (
                  <AreaChart data={filteredVelocity} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF1F7" />
                    <XAxis dataKey="month" tick={{ fill: "#6B7694", fontSize: 11, fontFamily: "Poppins" }} />
                    <YAxis allowDecimals={false} tick={{ fill: "#6B7694", fontSize: 11, fontFamily: "Poppins" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0B1F4B",
                        color: "#FFFFFF",
                        borderRadius: 10,
                        fontSize: 12,
                      }}
                    />
                    <Area type="monotone" dataKey="applications" stroke="#1E5BE0" fill="#1E5BE0" fillOpacity={0.25} />
                    <Area type="monotone" dataKey="shortlisted" stroke="#FF6B00" fill="#FF6B00" fillOpacity={0.25} />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-50/50 rounded-lg">
                <Loader2 className="w-5 h-5 text-[#1E5BE0] animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* College Sourcing Donut Chart (Span 1) */}
        <div className="bg-white rounded-[14px] border border-[#EEF1F7] p-5 sm:p-6 shadow-[0_4px_14px_rgba(11,31,75,0.05)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-[#EEF1F7] pb-3">
              <h2 className="text-base font-bold text-[#0B1F4B]">College Sourcing Yield</h2>
              <span className="text-xs font-semibold text-[#1E5BE0] bg-[#E8F0FF] px-2 py-0.5 rounded-full">
                {reportData.collegeSourceDistribution.length}{" "}
                {reportData.collegeSourceDistribution.length === 1 ? "Campus" : "Campuses"}
              </span>
            </div>
            <p className="text-xs text-[#6B7694] mt-2">
              Distribution of applied students by partner colleges.
            </p>
          </div>

          <div className="h-[200px] w-full relative flex items-center justify-center">
            {reportData.collegeSourceDistribution.length > 0 && isMounted ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportData.collegeSourceDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="candidates"
                    >
                      {reportData.collegeSourceDistribution.map((entry, index) => (
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
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-extrabold text-[#0B1F4B] leading-none">
                    {reportData.totalApplicants}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-[#6B7694] mt-0.5">
                    {reportData.totalApplicants === 1 ? "Student" : "Students"}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-4">
                <Users className="w-8 h-8 text-[#6B7694]/40 mb-2" />
                <p className="text-xs text-[#6B7694]">No campus applicant data yet</p>
              </div>
            )}
          </div>

          {reportData.collegeSourceDistribution.length > 0 ? (
            <div className="grid grid-cols-1 gap-2 pt-2 border-t border-[#EEF1F7] max-h-36 overflow-y-auto">
              {reportData.collegeSourceDistribution.map((item) => (
                <div key={item.college} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[11px] text-[#0B1F4B] font-medium truncate" title={item.college}>
                      {item.college}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#6B7694] shrink-0 font-semibold">
                    {item.candidates} {item.candidates === 1 ? "applied" : "applied"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="pt-2 border-t border-[#EEF1F7] text-center">
              <span className="text-[11px] text-[#6B7694]">College names appear as students apply</span>
            </div>
          )}
        </div>
      </div>

      {/* 4. Recruitment Funnel Conversion Progress */}
      <div className="bg-white rounded-[14px] border border-[#EEF1F7] p-5 sm:p-6 shadow-[0_4px_14px_rgba(11,31,75,0.05)] space-y-4">
        <div className="flex items-center justify-between border-b border-[#EEF1F7] pb-3">
          <div>
            <h2 className="text-base font-bold text-[#0B1F4B]">Applicant Conversion Funnel</h2>
            <p className="text-xs text-[#6B7694] mt-0.5">
              Candidate drop-off and progression through company recruitment stages.
            </p>
          </div>
          <span className="text-xs font-bold text-[#22B573] bg-[#E8F8EF] px-2.5 py-1 rounded-md">
            {reportData.selectedCandidates}{" "}
            {reportData.selectedCandidates === 1 ? "Hire Confirmed" : "Hires Confirmed"}
          </span>
        </div>

        <div className="space-y-3.5 pt-1 max-w-4xl">
          {reportData.funnelStages.map((item) => (
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
              <div className="w-full bg-[#F1F4F9] rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
