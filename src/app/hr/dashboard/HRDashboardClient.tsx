"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Users,
  CheckCircle2,
  Calendar,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Search,
  Filter,
  MoreVertical,
  Building2,
  Clock,
  Eye,
  ChevronRight,
  FileCheck,
  Award,
  Download,
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
import { useSearchParams } from "next/navigation";
import { Job, Application, Interview } from "@/types";
import PostJobModal from "@/components/hr/PostJobModal";
import CompanyProfileSubSection from "@/components/hr/CompanyProfileSubSection";

interface HRDashboardClientProps {
  initialJobs: Job[];
  initialApplicants: Application[];
  initialInterviews: Interview[];
}

// Donut data for applicant pipeline breakdown
const CANDIDATE_PIPELINE = [
  { name: "Under Review", value: 12, color: "#1E5BE0" },
  { name: "Shortlisted", value: 6, color: "#FF6B00" },
  { name: "Interview Round", value: 4, color: "#22B573" },
  { name: "Offered", value: 2, color: "#8B5CF6" },
];

// Monthly hiring applications trend
const MONTHLY_APPLICANT_TREND = [
  { month: "Nov", applications: 18, hires: 1 },
  { month: "Dec", applications: 25, hires: 2 },
  { month: "Jan", applications: 32, hires: 3 },
  { month: "Feb", applications: 28, hires: 2 },
  { month: "Mar", applications: 45, hires: 5 },
  { month: "Apr", applications: 22, hires: 2 },
];

export default function HRDashboardClient({
  initialJobs,
  initialApplicants,
  initialInterviews,
}: HRDashboardClientProps) {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [applicants] = useState<Application[]>(initialApplicants);
  const [interviews] = useState<Interview[]>(initialInterviews);
  const [pipelinePeriod, setPipelinePeriod] = useState("Last 6 Months");
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync modal when URL has action=post-job or when custom event is dispatched
  React.useEffect(() => {
    if (searchParams.get("action") === "post-job") {
      setIsPostJobModalOpen(true);
    }
  }, [searchParams]);

  React.useEffect(() => {
    const handleOpenModal = () => {
      setIsPostJobModalOpen(true);
    };

    window.addEventListener("open-post-job", handleOpenModal);
    return () => window.removeEventListener("open-post-job", handleOpenModal);
  }, []);

  const [activeDashboardTab, setActiveDashboardTab] = useState<"overview" | "company-profile">(
    searchParams.get("tab") === "company" ? "company-profile" : "overview"
  );

  React.useEffect(() => {
    if (searchParams.get("tab") === "company") {
      setActiveDashboardTab("company-profile");
    }
  }, [searchParams]);

  React.useEffect(() => {
    const handleOpenCompanyTab = () => {
      setActiveDashboardTab("company-profile");
    };

    window.addEventListener("open-company-profile", handleOpenCompanyTab);
    return () => window.removeEventListener("open-company-profile", handleOpenCompanyTab);
  }, []);

  const activeJobs = jobs.filter((j) => j.status === "Published");
  const shortlistedCount = applicants.filter((a) => a.status === "Shortlisted").length;

  const handleJobCreated = (newJob: Job) => {
    setJobs([newJob, ...jobs]);
    setToastMessage(`Job "${newJob.title}" posted successfully!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-7xl mx-auto w-full font-['Poppins',sans-serif]">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B1F4B] text-white px-5 py-3 rounded-xl shadow-xl border border-blue-400/20 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#22B573]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal directly opened inside dashboard */}
      <PostJobModal
        isOpen={isPostJobModalOpen}
        onClose={() => setIsPostJobModalOpen(false)}
        onJobCreated={handleJobCreated}
      />

      {/* ============================================================== */}
      {/* 1. WELCOME BANNER (Identical sleek structure to Student view)  */}
      {/* ============================================================== */}
      <div className="relative overflow-hidden rounded-[16px] bg-gradient-to-r from-[#0B1F4B] via-[#0E2963] to-[#1E5BE0] text-white p-6 sm:p-8 shadow-lg shadow-[#0B1F4B]/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#FFB020] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#FFB020]" />
              Campus Recruitment Drive 2025 - 2026
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, Sneha! 👋
            </h1>
            <p className="text-sm text-slate-200/90 leading-relaxed">
              You have <strong className="text-white font-semibold">18 new candidate submissions</strong> awaiting initial screening across your 4 active campus openings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsPostJobModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-[10px] transition-all shadow-md shadow-[#FF6B00]/25 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Job Opening</span>
            </button>
            <Link
              href="/hr/applicants"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-[10px] transition-colors cursor-pointer"
            >
              <span>Review Candidates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Decorative background glow circles */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-blue-400/10 pointer-events-none blur-2xl" />
        <div className="absolute right-1/3 -top-12 w-48 h-48 rounded-full bg-orange-400/10 pointer-events-none blur-xl" />
      </div>

      {/* ============================================================== */}
      {/* 2. DASHBOARD SUB-SECTION NAVIGATION TABS                       */}
      {/* ============================================================== */}
      <div className="bg-white rounded-[14px] border border-[#EEF1F7] p-1.5 shadow-[0_4px_14px_rgba(11,31,75,0.05)] flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveDashboardTab("overview")}
          className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-[10px] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeDashboardTab === "overview"
              ? "bg-[#1E5BE0] text-white shadow-sm"
              : "text-[#6B7694] hover:bg-[#F7F9FD] hover:text-[#0B1F4B]"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveDashboardTab("company-profile")}
          className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-[10px] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeDashboardTab === "company-profile"
              ? "bg-[#1E5BE0] text-white shadow-sm"
              : "text-[#6B7694] hover:bg-[#F7F9FD] hover:text-[#0B1F4B]"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Company Profile & Branding</span>
        </button>
      </div>

      {/* Conditionally render Company Profile Sub-Section or Dashboard Overview */}
      {activeDashboardTab === "company-profile" ? (
        <CompanyProfileSubSection />
      ) : (
        <>

      {/* ============================================================== */}
      {/* 2. STATS ROW (4 High Aesthetic Cards: Blue, Orange, Green, Purple) */}
      {/* ============================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Blue tint: Active Jobs */}
        <div className="bg-white rounded-[14px] p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex items-center gap-4 bg-gradient-to-br from-blue-50/40 to-white">
          <div className="w-[56px] h-[56px] rounded-2xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <div>
            <div className="text-[26px] font-bold text-[#0B1F4B] leading-none">{activeJobs.length}</div>
            <div className="text-[14px] text-[#6B7694] mt-1">Active Jobs</div>
            <div className="text-[12px] font-semibold text-[#22B573] flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> 2 closing soon
            </div>
          </div>
        </div>

        {/* Orange tint: Total Applicants */}
        <div className="bg-white rounded-[14px] p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex items-center gap-4 bg-gradient-to-br from-orange-50/40 to-white">
          <div className="w-[56px] h-[56px] rounded-2xl bg-[#FFF0E6] text-[#FF6B00] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <div>
            <div className="text-[26px] font-bold text-[#0B1F4B] leading-none">{applicants.length || 24}</div>
            <div className="text-[14px] text-[#6B7694] mt-1">Total Applicants</div>
            <div className="text-[12px] font-semibold text-[#FF6B00] flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +18 this week
            </div>
          </div>
        </div>

        {/* Green tint: Shortlisted */}
        <div className="bg-white rounded-[14px] p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex items-center gap-4 bg-gradient-to-br from-emerald-50/40 to-white">
          <div className="w-[56px] h-[56px] rounded-2xl bg-[#E8F8F1] text-[#22B573] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <div>
            <div className="text-[26px] font-bold text-[#0B1F4B] leading-none">{shortlistedCount || 6}</div>
            <div className="text-[14px] text-[#6B7694] mt-1">Shortlisted</div>
            <div className="text-[12px] font-semibold text-[#22B573] flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> 82% ATS matched
            </div>
          </div>
        </div>

        {/* Purple tint: Live Interviews */}
        <div className="bg-white rounded-[14px] p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex items-center gap-4 bg-gradient-to-br from-purple-50/40 to-white">
          <div className="w-[56px] h-[56px] rounded-2xl bg-[#F3EEFF] text-[#8B5CF6] flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <div>
            <div className="text-[26px] font-bold text-[#0B1F4B] leading-none">{interviews.length || 4}</div>
            <div className="text-[14px] text-[#6B7694] mt-1">Interviews</div>
            <div className="text-[12px] font-semibold text-[#8B5CF6] flex items-center gap-1 mt-1">
              <Clock className="w-3.5 h-3.5" /> 2 scheduled today
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. CHARTS ROW (Donut Funnel Pipeline + Monthly Applications Bar Chart) */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card 1: Pipeline Breakdown (Donut Chart) */}
        <div className="bg-white rounded-[14px] p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-bold text-[#0B1F4B]">Candidate Pipeline Status</h3>
              <p className="text-[12px] text-[#6B7694] mt-0.5">Real-time candidate funnel distribution</p>
            </div>
            <span className="text-xs font-semibold text-[#1E5BE0] bg-[#E8F0FF] px-2.5 py-1 rounded-md">
              24 Active
            </span>
          </div>

          <div className="my-4 flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="relative w-[170px] h-[170px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CANDIDATE_PIPELINE}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={76}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {CANDIDATE_PIPELINE.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0B1F4B",
                      color: "#FFFFFF",
                      borderRadius: 10,
                      border: "none",
                      fontSize: 12,
                      fontFamily: "Poppins",
                      padding: "6px 12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[24px] font-extrabold text-[#0B1F4B] leading-none">24</span>
                <span className="text-[11px] text-[#6B7694] font-medium mt-0.5">Candidates</span>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 w-full sm:w-auto">
              {CANDIDATE_PIPELINE.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <div>
                    <div className="text-[12px] font-medium text-[#0B1F4B]">{item.name}</div>
                    <div className="text-[13px] font-bold text-[#0B1F4B] leading-none">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#EEF1F7] flex items-center justify-between text-xs text-[#6B7694]">
            <span>Fastest clearing round: <strong>Technical Coding (2.1 days)</strong></span>
            <Link href="/hr/applicants" className="text-[#1E5BE0] font-semibold hover:underline">
              Manage Funnel →
            </Link>
          </div>
        </div>

        {/* Card 2: Candidate Sourcing & Applications Bar Chart */}
        <div className="bg-white rounded-[14px] p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-bold text-[#0B1F4B]">Application Inflow Trend</h3>
              <p className="text-[12px] text-[#6B7694] mt-0.5">Monthly candidate volume and offers</p>
            </div>
            <select
              value={pipelinePeriod}
              onChange={(e) => setPipelinePeriod(e.target.value)}
              className="text-xs bg-[#F1F4F9] text-[#0B1F4B] font-medium px-2.5 py-1.5 rounded-lg border-none focus:outline-none cursor-pointer"
            >
              <option value="Last 6 Months">Last 6 Months</option>
              <option value="Last 3 Months">Last 3 Months</option>
              <option value="Year 2026">Year 2026</option>
            </select>
          </div>

          <div className="my-3 h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_APPLICANT_TREND} barGap={4} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                    padding: "6px 12px",
                  }}
                  itemStyle={{ color: "#FFFFFF" }}
                />
                <Bar
                  dataKey="applications"
                  name="Applications"
                  fill="#1E5BE0"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={28}
                />
                <Bar
                  dataKey="hires"
                  name="Final Hires"
                  fill="#FF6B00"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-[#EEF1F7] flex items-center justify-between text-xs text-[#6B7694]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1E5BE0]" /> Applications
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]" /> Offers Released
              </span>
            </div>
            <Link href="/hr/reports" className="text-[#1E5BE0] font-semibold hover:underline">
              Detailed Insights →
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. RECENT APPLICANTS TABLE & ACTIVE JOBS SECTION              */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Candidate Applications Table */}
        <div className="lg:col-span-2 bg-white rounded-[14px] border border-[#EEF1F7] p-5 sm:p-6 shadow-[0_4px_14px_rgba(11,31,75,0.05)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#EEF1F7] pb-3">
            <div>
              <h3 className="text-base font-bold text-[#0B1F4B]">Recent Candidate Submissions</h3>
              <p className="text-xs text-[#6B7694] mt-0.5">Top-ranked campus applicants matching your job criteria</p>
            </div>
            <Link
              href="/hr/applicants"
              className="text-xs font-semibold text-[#1E5BE0] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F9FD] text-[#6B7694] font-semibold uppercase text-[11px] border-b border-[#EEF1F7]">
                <tr>
                  <th className="py-3 px-3.5">Candidate</th>
                  <th className="py-3 px-3.5">Applied Role</th>
                  <th className="py-3 px-3.5">College</th>
                  <th className="py-3 px-3.5">Status</th>
                  <th className="py-3 px-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF1F7]">
                {applicants.slice(0, 5).map((app) => (
                  <tr key={app.id} className="hover:bg-[#F7F9FD]/60 transition-colors">
                    <td className="py-3.5 px-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#E8F0FF] text-[#1E5BE0] font-bold text-xs flex items-center justify-center shrink-0">
                          {app.applicantName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-[#0B1F4B]">{app.applicantName}</p>
                          <p className="text-[11px] text-[#6B7694]">{app.applicantEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3.5 font-semibold text-[#0B1F4B]">
                      {app.jobTitle}
                    </td>
                    <td className="py-3.5 px-3.5 text-[#6B7694]">
                      {app.applicantCollege || "NIT Trichy"}
                    </td>
                    <td className="py-3.5 px-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          app.status === "Shortlisted"
                            ? "bg-[#E8F8EF] text-[#22B573]"
                            : app.status === "Interview"
                            ? "bg-[#FFF0E6] text-[#FF6B00]"
                            : "bg-[#E8F0FF] text-[#1E5BE0]"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3.5 text-right">
                      <Link
                        href="/hr/applicants"
                        className="inline-flex items-center px-3 py-1.5 border border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white rounded-[8px] text-[11px] font-semibold transition-colors"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Active Job Openings List */}
        <div className="bg-white rounded-[14px] border border-[#EEF1F7] p-5 sm:p-6 shadow-[0_4px_14px_rgba(11,31,75,0.05)] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#EEF1F7] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0B1F4B]">Active Job Postings</h3>
                <p className="text-xs text-[#6B7694] mt-0.5">Currently accepting student submissions</p>
              </div>
              <Link href="/hr/jobs" className="text-xs font-semibold text-[#1E5BE0] hover:underline">
                Manage
              </Link>
            </div>

            <div className="divide-y divide-[#EEF1F7] mt-1 space-y-1">
              {jobs.slice(0, 3).map((job) => (
                <div key={job.id} className="py-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-[#0B1F4B] hover:text-[#1E5BE0] transition cursor-pointer">
                        {job.title}
                      </h4>
                      <p className="text-[11px] text-[#6B7694]">
                        {job.location} • {job.jobType}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-[#22B573] bg-[#E8F8EF] px-2 py-0.5 rounded-full shrink-0">
                      {job.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#6B7694] pt-1">
                    <span className="font-semibold text-[#0B1F4B]">
                      {job.applicantsCount || 24} Applicants
                    </span>
                    <Link
                      href={`/hr/jobs`}
                      className="text-[#1E5BE0] font-semibold hover:underline flex items-center gap-0.5"
                    >
                      View Details <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Card at bottom */}
          <div className="bg-[#F1F6FF] rounded-xl p-3.5 border border-[#E3EEFF] mt-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0B1F4B] mb-1">
              <Building2 className="w-4 h-4 text-[#1E5BE0]" />
              <span>Campus Hiring Drive</span>
            </div>
            <p className="text-[11px] text-[#6B7694]">
              Conduct online coding rounds directly through WeGrow Skill Campus tests.
            </p>
            <button
              type="button"
              onClick={() => setIsPostJobModalOpen(true)}
              className="mt-2.5 inline-block text-xs font-bold text-[#1E5BE0] hover:underline cursor-pointer"
            >
              Schedule Drive Opening →
            </button>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
