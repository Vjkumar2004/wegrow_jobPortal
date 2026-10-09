"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  FileCheck,
  Calendar,
  Bookmark,
  User,
  FileText,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Search,
  Headphones,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  IndianRupee,
  Heart,
  MoreVertical,
  Check,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Building2,
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
import { authService } from "@/services/auth.service";
import { getCompanyLogoUrl, getCompanyLogoProxyUrl, getNameInitials, getAvatarUrl } from "@/lib/utils";

// Application status data for Donut Chart
const DONUT_DATA = [
  { name: "Under Review", value: 10, color: "#1E5BE0" },
  { name: "Shortlisted", value: 5, color: "#FF6B00" },
  { name: "Interview", value: 8, color: "#22B573" },
  { name: "Rejected", value: 1, color: "#8B5CF6" },
];

// Monthly trend data for Bar Chart
const TREND_DATA = [
  { month: "Apr", applications: 4 },
  { month: "May", applications: 8 },
  { month: "Jun", applications: 7 },
  { month: "Jul", applications: 10 },
  { month: "Aug", applications: 15 },
  { month: "Sep", applications: 19 },
];

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { StudentDashboardData, StudentProfile } from "@/types";
import { studentService } from "@/services/student.service";

interface StudentDashboardClientProps {
  initialData?: StudentDashboardData;
}

export default function StudentDashboardClient({ initialData }: StudentDashboardClientProps) {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const router = useRouter();

  const { data: dashboardData, isLoading: isLoadingData } = useQuery({
    queryKey: ["student-dashboard"],
    queryFn: () => {
      const cachedProfile = queryClient.getQueryData<StudentProfile>(["student-profile"]);
      return studentService.getDashboardData(cachedProfile ?? undefined);
    },
    initialData,
    staleTime: 0,
    refetchOnMount: "always",
  });

  // Dynamic state populated from dashboardData
  const student = dashboardData?.student || {
    id: "",
    name: "Student",
    email: "",
    course: "Candidate",
    college: "WeGrow Skill Campus",
  };

  const stats = dashboardData?.stats || {
    jobsApplied: 0,
    jobsAppliedTrend: "0 applied",
    interviews: 0,
    interviewsTrend: "0 rounds",
    shortlisted: 0,
    shortlistedTrend: "0 shortlisted",
    offers: 0,
    offersTrend: "0 offers",
  };

  const donutData = dashboardData?.applicationStatus || [];
  const trendData = dashboardData?.applicationTrends || [];
  const recommendedJobsList = dashboardData?.recommendedJobs || [];
  const recentApplicationsList = dashboardData?.recentApplications || [];
  const upcomingInterviewsList = dashboardData?.upcomingInterviews || [];
  const notificationsList = dashboardData?.notifications || [];
  const profileCompletion = dashboardData?.profileCompletion || {
    percentage: 0,
    checklist: [],
  };

  // State for interactive elements
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [trendRange, setTrendRange] = useState("Last 6 Months");
  const [savedJobs, setSavedJobs] = useState<{ [id: string]: boolean }>({});
  const [likedJobs, setLikedJobs] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    const handleAvatarUpdate = (e: Event) => {
      const detail = (e as CustomEvent<{ avatarUrl?: string; avatar?: string; photoUrl?: string }>).detail;
      const newUrl = detail?.avatarUrl || detail?.avatar || detail?.photoUrl;
      if (newUrl) {
        setAvatarError(false);
        queryClient.setQueryData<StudentDashboardData>(["student-dashboard"], (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            student: {
              ...prev.student,
              avatarUrl: newUrl,
            },
          };
        });
        queryClient.invalidateQueries({ queryKey: ["student-profile"] });
      }
    };
    window.addEventListener("avatarUpdated", handleAvatarUpdate);
    return () => window.removeEventListener("avatarUpdated", handleAvatarUpdate);
  }, [queryClient]);

  // Hydrate saved jobs from backend on mount
  useEffect(() => {
    studentService.getSavedJobs().then((savedList) => {
      if (Array.isArray(savedList)) {
        const map: { [id: string]: boolean } = {};
        savedList.forEach((j) => { map[j.id] = true; });
        setSavedJobs(map);
      }
    }).catch(() => {});
  }, []);

  const toggleSave = async (id: string) => {
    const isCurrentlySaved = !!savedJobs[id];
    setSavedJobs((prev) => ({ ...prev, [id]: !isCurrentlySaved }));
    try {
      if (isCurrentlySaved) {
        await studentService.removeSavedJob(id);
      } else {
        await studentService.saveJob(id);
      }
      queryClient.invalidateQueries({ queryKey: ["student-saved-jobs"] });
    } catch {
      setSavedJobs((prev) => ({ ...prev, [id]: isCurrentlySaved }));
    }
  };

  const toggleLike = (id: string) => {
    setLikedJobs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLogout = async () => {
    await authService.logout();
    router.replace("/student/login");
  };

  const sidebarLinks = [
    { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "Browse Jobs", href: "/student/jobs", icon: Briefcase },
    { label: "My Applications", href: "/student/applications", icon: FileCheck },
    { label: "Interviews", href: "/student/interviews", icon: Calendar },
    { label: "Saved Jobs", href: "/student/saved-jobs", icon: Bookmark },
    { label: "Profile", href: "/student/profile", icon: User },
    { label: "Resume", href: "/student/resume", icon: FileText },
    { label: "Reports", href: "/student/reports", icon: BarChart3 },
    { label: "Notifications", href: "/student/notifications", icon: Bell },
    { label: "Settings", href: "/student/settings", icon: Settings },
  ];

  return (
    <div className="flex-1 flex flex-col xl:flex-row min-w-0 p-4 sm:p-6 lg:p-7 gap-5 overflow-hidden">
      {/* ================= ZONE 2: CENTER CONTENT (flexible, gap 20px) ================= */}
          <main className="flex-1 min-w-0 space-y-5">
            {/* 1. Welcome Banner: Soft peach-to-blue gradient card */}
            <div className="relative overflow-hidden rounded-2xl p-4 sm:p-7 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] bg-gradient-to-r from-[#FFF5EE] via-[#F4F8FF] to-[#E9F2FF] flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-5 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center gap-3.5 sm:gap-4">
                <Link href="/student/profile" className="relative group shrink-0" title="View profile">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white shadow-md overflow-hidden bg-gradient-to-tr from-[#1E5BE0] to-[#3B82F6] flex items-center justify-center">
                    {student.avatarUrl && !avatarError ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={student.avatarUrl}
                        alt={student.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          const fallbackUrl = student.id
                            ? getAvatarUrl(student.id)
                            : "";
                          if (fallbackUrl && e.currentTarget.src !== fallbackUrl) {
                            e.currentTarget.src = fallbackUrl;
                            return;
                          }
                          setAvatarError(true);
                        }}
                      />
                    ) : (
                      <span className="text-white font-extrabold text-base sm:text-xl tracking-wider select-none">
                        {getNameInitials(student.name)}
                      </span>
                    )}
                  </div>
                </Link>
                <div className="min-w-0">
                  <h1 className="text-[18px] sm:text-[26px] font-bold text-[#0B1F4B] tracking-tight flex items-center gap-1.5 truncate">
                    Good Morning, {student.name.split(" ")[0]}! 👋
                  </h1>
                  <p className="text-[12px] sm:text-[14px] text-[#6B7694] mt-0.5 truncate">
                    {student.course} • {student.college}
                  </p>
                </div>
              </div>

              {/* White quote card with orange quote mark */}
              <div className="bg-white/90 backdrop-blur-xs rounded-xl p-3 sm:p-4 border border-[#EEF1F7] shadow-xs max-w-sm flex items-start gap-2.5 shrink-0">
                <span className="text-[#FF6B00] text-2xl sm:text-3xl font-serif font-black leading-none shrink-0">
                  “
                </span>
                <p className="text-[11px] sm:text-[13px] text-[#0B1F4B] font-medium leading-snug italic">
                  Small steps everyday lead to big opportunities.
                </p>
              </div>
            </div>

            {/* 1.5. NATIVE APK QUICK ACTION HUB (4 Fast Touch Action Tiles) */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              <Link
                href="/student/jobs"
                className="flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-2xl bg-white border border-[#EEF1F7] shadow-2xs hover:border-[#1E5BE0]/40 hover:shadow-xs active:scale-95 transition-all text-center group"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center mb-1 sm:mb-1.5 group-hover:scale-105 transition-transform shadow-2xs">
                  <Briefcase className="w-5 h-5" strokeWidth={2} />
                </div>
                <span className="text-[11px] sm:text-[12px] font-bold text-[#0B1F4B] leading-tight">
                  Browse Jobs
                </span>
              </Link>
              <Link
                href="/student/applications"
                className="flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-2xl bg-white border border-[#EEF1F7] shadow-2xs hover:border-[#22B573]/40 hover:shadow-xs active:scale-95 transition-all text-center group"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#E8F8F1] text-[#22B573] flex items-center justify-center mb-1 sm:mb-1.5 group-hover:scale-105 transition-transform shadow-2xs">
                  <FileCheck className="w-5 h-5" strokeWidth={2} />
                </div>
                <span className="text-[11px] sm:text-[12px] font-bold text-[#0B1F4B] leading-tight">
                  Applications
                </span>
              </Link>
              <Link
                href="/student/interviews"
                className="flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-2xl bg-white border border-[#EEF1F7] shadow-2xs hover:border-[#FF6B00]/40 hover:shadow-xs active:scale-95 transition-all text-center group"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FFF0E6] text-[#FF6B00] flex items-center justify-center mb-1 sm:mb-1.5 group-hover:scale-105 transition-transform shadow-2xs">
                  <Calendar className="w-5 h-5" strokeWidth={2} />
                </div>
                <span className="text-[11px] sm:text-[12px] font-bold text-[#0B1F4B] leading-tight">
                  Interviews
                </span>
              </Link>
              <Link
                href="/student/resume"
                className="flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-2xl bg-white border border-[#EEF1F7] shadow-2xs hover:border-[#8B5CF6]/40 hover:shadow-xs active:scale-95 transition-all text-center group"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#F3EEFF] text-[#8B5CF6] flex items-center justify-center mb-1 sm:mb-1.5 group-hover:scale-105 transition-transform shadow-2xs">
                  <FileText className="w-5 h-5" strokeWidth={2} />
                </div>
                <span className="text-[11px] sm:text-[12px] font-bold text-[#0B1F4B] leading-tight">
                  ATS Resume
                </span>
              </Link>
            </div>

            {/* 2. Four Stat Cards in a row (Mobile optimized 2x2 grid) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {/* Blue tint: Jobs Applied */}
              <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-[#EEF1F7] shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs flex items-center gap-3 sm:gap-4 bg-gradient-to-br from-blue-50/40 to-white">
                <div className="w-10 h-10 sm:w-[52px] sm:h-[52px] rounded-xl sm:rounded-2xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <div className="text-[20px] sm:text-[26px] font-bold text-[#0B1F4B] leading-none">{stats.jobsApplied}</div>
                  <div className="text-[11px] sm:text-[14px] text-[#6B7694] mt-1 font-medium truncate">Jobs Applied</div>
                  <div className="text-[10px] sm:text-[12px] font-semibold text-[#22B573] flex items-center gap-1 mt-0.5 truncate">
                    <TrendingUp className="w-3 h-3" /> {stats.jobsAppliedTrend}
                  </div>
                </div>
              </div>

              {/* Orange tint: Interviews */}
              <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-[#EEF1F7] shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs flex items-center gap-3 sm:gap-4 bg-gradient-to-br from-orange-50/40 to-white">
                <div className="w-10 h-10 sm:w-[52px] sm:h-[52px] rounded-xl sm:rounded-2xl bg-[#FFF0E6] text-[#FF6B00] flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <div className="text-[20px] sm:text-[26px] font-bold text-[#0B1F4B] leading-none">{stats.interviews}</div>
                  <div className="text-[11px] sm:text-[14px] text-[#6B7694] mt-1 font-medium truncate">Interviews</div>
                  <div className="text-[10px] sm:text-[12px] font-semibold text-[#22B573] flex items-center gap-1 mt-0.5 truncate">
                    <TrendingUp className="w-3 h-3" /> {stats.interviewsTrend}
                  </div>
                </div>
              </div>

              {/* Green tint: Shortlisted */}
              <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-[#EEF1F7] shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs flex items-center gap-3 sm:gap-4 bg-gradient-to-br from-emerald-50/40 to-white">
                <div className="w-10 h-10 sm:w-[52px] sm:h-[52px] rounded-xl sm:rounded-2xl bg-[#E8F8F1] text-[#22B573] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <div className="text-[20px] sm:text-[26px] font-bold text-[#0B1F4B] leading-none">{stats.shortlisted}</div>
                  <div className="text-[11px] sm:text-[14px] text-[#6B7694] mt-1 font-medium truncate">Shortlisted</div>
                  <div className="text-[10px] sm:text-[12px] font-semibold text-[#22B573] flex items-center gap-1 mt-0.5 truncate">
                    <TrendingUp className="w-3 h-3" /> {stats.shortlistedTrend}
                  </div>
                </div>
              </div>

              {/* Purple tint: Offers */}
              <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-[#EEF1F7] shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs flex items-center gap-3 sm:gap-4 bg-gradient-to-br from-purple-50/40 to-white">
                <div className="w-10 h-10 sm:w-[52px] sm:h-[52px] rounded-xl sm:rounded-2xl bg-[#F3EEFF] text-[#8B5CF6] flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <div className="text-[20px] sm:text-[26px] font-bold text-[#0B1F4B] leading-none">{stats.offers}</div>
                  <div className="text-[11px] sm:text-[14px] text-[#6B7694] mt-1 font-medium truncate">Offers</div>
                  <div className="text-[10px] sm:text-[12px] font-semibold text-[#22B573] flex items-center gap-1 mt-0.5 truncate">
                    <TrendingUp className="w-3 h-3" /> {stats.offersTrend}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Two Cards Side by Side (Application Status Donut + Application Trend Bar Chart) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Card 1: Application Status (Donut Chart) */}
              <div className="bg-white rounded-[14px] p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between">
                <div>
                  <h3 className="text-[16px] font-bold text-[#0B1F4B]">Application Status</h3>
                  <p className="text-[12px] text-[#6B7694] mt-0.5">Track your journey so far</p>
                </div>

                <div className="my-4 flex flex-col sm:flex-row items-center justify-center gap-6">
                  {/* Donut Chart Container */}
                  <div className="relative w-[170px] h-[170px] shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.jobsApplied === 0 ? [{ name: "No applications", value: 1, color: "#E2E8F0" }] : donutData}
                          cx="50%"
                          cy="50%"
                          innerRadius={52}
                          outerRadius={75}
                          paddingAngle={stats.jobsApplied === 0 ? 0 : 3}
                          dataKey="value"
                        >
                          {(stats.jobsApplied === 0 ? [{ name: "No applications", value: 1, color: "#E2E8F0" }] : donutData).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Donut Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                      <span className="text-[24px] font-bold text-[#0B1F4B] leading-none">
                        {stats.jobsApplied}
                      </span>
                      <span className="text-[10px] text-[#6B7694] font-medium leading-tight mt-1 max-w-[70px]">
                        {stats.jobsApplied === 0 ? "No Submissions" : "Total Applications"}
                      </span>
                    </div>
                  </div>

                  {/* Legend on the right */}
                  <div className="space-y-3 w-full sm:w-auto">
                    {donutData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between sm:justify-start gap-4 text-[13px]">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: stats.jobsApplied === 0 ? "#CBD5E1" : item.color }}
                          />
                          <span className="text-[#6B7694]">{item.name}</span>
                        </div>
                        <span className="font-bold text-[#0B1F4B] ml-auto">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EEF1F7] text-center text-[12px] text-[#6B7694]">
                  {stats.interviews > 0
                    ? `Activity: ${stats.interviews} interview rounds underway`
                    : "No active application reviews yet"}
                </div>
              </div>

              {/* Card 2: Application Trend (Vertical Bar Chart) */}
              <div className="bg-white rounded-[14px] p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[16px] font-bold text-[#0B1F4B]">Application Trend</h3>
                    <p className="text-[12px] text-[#6B7694] mt-0.5">Monthly submission growth</p>
                  </div>
                  {/* Dropdown: Last 6 Months */}
                  <select
                    value={trendRange}
                    onChange={(e) => setTrendRange(e.target.value)}
                    className="text-[12px] font-medium text-[#0B1F4B] bg-[#F1F4F9] border-none rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
                  >
                    <option value="Last 6 Months">Last 6 Months</option>
                    <option value="Last 3 Months">Last 3 Months</option>
                    <option value="Year 2026">Year 2026</option>
                  </select>
                </div>

                {/* Vertical Bar Chart or Gray Empty State */}
                <div className="h-[210px] w-full mt-4 flex items-center justify-center">
                  {trendData.length === 0 || stats.jobsApplied === 0 ? (
                    <div className="w-full h-full rounded-xl bg-[#F8FAFC] border border-dashed border-[#CBD5E1] flex flex-col items-center justify-center p-4 text-center">
                      <div className="w-10 h-10 rounded-full bg-[#EEF2F6] text-[#94A3B8] flex items-center justify-center mb-2">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <p className="text-[13px] font-semibold text-[#64748B]">No Submission Trends Yet</p>
                      <p className="text-[11px] text-[#94A3B8] max-w-xs mt-0.5">
                        Apply to job openings to view your monthly submission activity and progress trends.
                      </p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="barGradientLight" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#A9CCFF" />
                            <stop offset="100%" stopColor="#4D8FFF" />
                          </linearGradient>
                          <linearGradient id="barGradientBold" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2F7BFF" />
                            <stop offset="100%" stopColor="#1E5BE0" />
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
                          domain={[0, 20]}
                          ticks={[0, 5, 10, 15, 20]}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#6B7694", fontSize: 12 }}
                        />
                        <Tooltip
                          cursor={{ fill: "rgba(30, 91, 224, 0.05)" }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-[#0B1F4B] text-white text-[12px] py-1.5 px-3 rounded-lg shadow-lg">
                                  <span className="font-bold">{payload[0].value}</span> applications
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar
                          dataKey="applications"
                          radius={[6, 6, 0, 0]}
                          animationDuration={1200}
                        >
                          {trendData.map((entry, index) => (
                            <Cell
                              key={`bar-${index}`}
                              fill={index === trendData.length - 1 ? "url(#barGradientBold)" : "url(#barGradientLight)"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>

                <div className="pt-3 border-t border-[#EEF1F7] flex items-center justify-between text-[12px] text-[#6B7694]">
                  <span>
                    {stats.jobsApplied > 0
                      ? `Total submissions: ${stats.jobsApplied}`
                      : "No application activity recorded"}
                  </span>
                  <span className="font-semibold text-[#1E5BE0]">
                    {stats.jobsApplied > 0 ? "Tracking Active" : "Empty Record"}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. "Recommended Jobs for You" Card */}
            <div className="bg-white rounded-[14px] p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)]">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-[16px] font-bold text-[#0B1F4B]">Recommended Jobs for You</h3>
                  <p className="text-[12px] text-[#6B7694] mt-0.5">Based on your profile, skills and interests</p>
                </div>
                <Link
                  href="/student/jobs"
                  className="text-[13px] font-semibold text-[#1E5BE0] hover:underline flex items-center gap-1"
                >
                  View All Jobs →
                </Link>
              </div>

              {/* 3 Job Cards in a row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto pb-1">
                {recommendedJobsList.length === 0 ? (
                  <div className="col-span-full py-10 text-center text-[#6B7694] bg-[#F7F9FD] rounded-xl border border-[#EEF1F7]">
                    <Briefcase className="w-8 h-8 text-[#1E5BE0] mx-auto mb-2 opacity-60" />
                    <p className="font-semibold text-[#0B1F4B]">No recommended jobs available right now</p>
                    <p className="text-xs text-[#6B7694] mt-0.5">Explore our jobs board to discover new campus opportunities.</p>
                  </div>
                ) : (
                  recommendedJobsList.slice(0, 3).map((job) => (
                    <div
                      key={job.id}
                      className="rounded-[14px] border border-[#EEF1F7] p-5 hover:border-[#1E5BE0]/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between bg-white"
                    >
                      <div>
                        {/* Top company logo + job title + bookmark icon */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 border border-[#EEF1F7] shadow-2xs overflow-hidden font-bold text-xs text-[#1E5BE0]">
                              {getCompanyLogoUrl(job.company, job.company?.id) ? (
                                <img
                                  src={getCompanyLogoUrl(job.company, job.company?.id)}
                                  alt={job.company?.name || "Company"}
                                  className="w-full h-full object-contain p-0.5"
                                  onError={(e) => {
                                    const target = e.currentTarget as HTMLImageElement;
                                    const proxyUrl = job.company?.id ? getCompanyLogoProxyUrl(job.company.id) : "";
                                    if (proxyUrl && target.src !== proxyUrl) {
                                      target.src = proxyUrl;
                                      return;
                                    }
                                    target.style.display = "none";
                                    const parent = target.parentElement;
                                    if (parent && !parent.querySelector(".logo-fb")) {
                                      const fb = document.createElement("span");
                                      fb.textContent = (job.company?.name || "Co").slice(0, 2).toUpperCase();
                                      fb.className = "font-bold text-xs text-[#1E5BE0] logo-fb";
                                      parent.appendChild(fb);
                                    }
                                  }}
                                />
                              ) : (
                                <Building2 className="w-5 h-5 text-[#1E5BE0]" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-[14px] text-[#0B1F4B] leading-snug">
                                {job.title}
                              </h4>
                              <p className="text-[12px] text-[#6B7694]">{job.company?.name || "Company"}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleSave(job.id)}
                            className="p-1.5 text-[#6B7694] hover:text-[#1E5BE0] transition cursor-pointer"
                            title="Bookmark job"
                          >
                            <Bookmark
                              className={`w-4 h-4 ${
                                savedJobs[job.id] ? "fill-[#1E5BE0] text-[#1E5BE0]" : ""
                              }`}
                            />
                          </button>
                        </div>

                        {/* Two Meta Rows with Icons */}
                        <div className="mt-4 space-y-1.5 text-[12px] text-[#6B7694]">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#6B7694]" /> {job.location}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Briefcase className="w-3.5 h-3.5 text-[#6B7694]" /> {job.jobType}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#6B7694]" /> {job.experience}
                            </span>
                            <span className="flex items-center gap-1.5 font-semibold text-[#0B1F4B]">
                              <IndianRupee className="w-3.5 h-3.5 text-[#22B573]" /> Rs {job.salaryMin ? (job.salaryMin / 100000).toFixed(0) : "3"} - {job.salaryMax ? (job.salaryMax / 100000).toFixed(0) : "6"} LPA
                            </span>
                          </div>
                        </div>

                        {/* Skill Chips */}
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {job.skills?.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="bg-[#E8F0FF] text-[#1E5BE0] text-[11px] font-medium px-2.5 py-1 rounded-[6px]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-5 pt-4 border-t border-[#EEF1F7] flex items-center justify-between">
                        <span className="text-[12px] text-[#6B7694]">{job.postedDate}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleLike(job.id)}
                            className="p-1.5 rounded-lg text-[#6B7694] hover:bg-slate-50 transition cursor-pointer"
                            title="Save to favorites"
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                likedJobs[job.id] ? "fill-[#EF4444] text-[#EF4444]" : ""
                              }`}
                            />
                          </button>
                          <Link
                            href={`/student/jobs/${job.id}`}
                            className="bg-[#1E5BE0] hover:bg-[#1548b8] text-white text-[13px] font-semibold px-4 py-2 rounded-[8px] transition-colors shadow-sm inline-block"
                          >
                            Apply Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            {/* 5. "Recent Applications" Card with Mobile Card Feed & Desktop Table */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[15px] sm:text-[16px] font-bold text-[#0B1F4B]">Recent Applications</h3>
                  <p className="text-[11px] sm:text-[12px] text-[#6B7694] mt-0.5">Real-time status updates</p>
                </div>
                <Link
                  href="/student/applications"
                  className="text-[12px] sm:text-[13px] font-semibold text-[#1E5BE0] hover:underline flex items-center gap-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* A. MOBILE VIEW: Native APK Application Cards (Hidden on md+) */}
              <div className="md:hidden space-y-2.5">
                {recentApplicationsList.length === 0 ? (
                  <div className="py-8 text-center text-[#6B7694] text-xs">
                    No recent applications found. Start exploring and applying for jobs!
                  </div>
                ) : (
                  recentApplicationsList.map((app) => (
                    <div
                      key={app.id}
                      className="p-3.5 rounded-xl border border-[#EEF1F7] bg-[#F7F9FD]/60 hover:bg-white transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center border border-[#EEF1F7] shadow-2xs overflow-hidden font-bold text-xs text-[#1E5BE0] shrink-0">
                            {app.companyLogo ? (
                              <img
                                src={app.companyLogo}
                                alt={app.companyName || 'Company'}
                                className="w-full h-full object-contain p-0.5"
                                onError={(e) => {
                                  const target = e.currentTarget as HTMLImageElement;
                                  target.style.display = "none";
                                  const parent = target.parentElement;
                                  if (parent && !parent.querySelector(".logo-fb")) {
                                    const fb = document.createElement("span");
                                    fb.textContent = (app.companyName || "C").charAt(0).toUpperCase();
                                    fb.className = "font-bold text-xs text-[#1E5BE0] logo-fb";
                                    parent.appendChild(fb);
                                  }
                                }}
                              />
                            ) : (
                              (app.companyName || 'C').charAt(0).toUpperCase()
                            )}
                          </div>
                          <span className="font-semibold text-xs text-[#0B1F4B] truncate">
                            {app.companyName || 'Company'}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#6B7694] shrink-0">
                          {app.appliedDate || 'Recent'}
                        </span>
                      </div>

                      <div className="font-semibold text-[13px] text-[#0B1F4B] leading-snug">
                        {app.jobTitle || (app as any).title || 'Position'}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            app.status === 'Shortlisted'
                              ? 'bg-[#DDF5E8] text-[#1E9E63]'
                              : app.status === 'Interview'
                              ? 'bg-[#FFE9D6] text-[#E8650A]'
                              : app.status === 'Rejected'
                              ? 'bg-[#FFE0E0] text-[#D93636]'
                              : app.status === 'Selected'
                              ? 'bg-[#DDF5E8] text-[#1E9E63]'
                              : 'bg-[#DCEBFF] text-[#1E5BE0]'
                          }`}
                        >
                          {app.status || 'Under Review'}
                        </span>

                        <Link
                          href="/student/applications"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1E5BE0] bg-[#E8F0FF] hover:bg-[#1E5BE0] hover:text-white px-3 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          Track <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* B. DESKTOP VIEW: Detailed Data Table (Hidden on mobile) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F5F7FB] text-[12px] font-semibold text-[#6B7694] h-[44px]">
                      <th className="px-4 py-2 rounded-l-lg">Company</th>
                      <th className="px-4 py-2">Job Title</th>
                      <th className="px-4 py-2">Applied Date</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2 text-right rounded-r-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEF1F7] text-[13px]">
                    {recentApplicationsList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-[#6B7694]">
                          No recent applications found. Start exploring and applying for jobs!
                        </td>
                      </tr>
                    ) : (
                      recentApplicationsList.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center border border-[#EEF1F7] shadow-2xs overflow-hidden font-bold text-xs text-[#1E5BE0]">
                                {app.companyLogo ? (
                                  <img
                                    src={app.companyLogo}
                                    alt={app.companyName || 'Company'}
                                    className="w-full h-full object-contain p-0.5"
                                    onError={(e) => {
                                      const target = e.currentTarget as HTMLImageElement;
                                      target.style.display = "none";
                                      const parent = target.parentElement;
                                      if (parent && !parent.querySelector(".logo-fb")) {
                                        const fb = document.createElement("span");
                                        fb.textContent = (app.companyName || "C").charAt(0).toUpperCase();
                                        fb.className = "font-bold text-xs text-[#1E5BE0] logo-fb";
                                        parent.appendChild(fb);
                                      }
                                    }}
                                  />
                                ) : (
                                  (app.companyName || 'C').charAt(0).toUpperCase()
                                )}
                              </div>
                              <span className="font-semibold text-[#0B1F4B]">{app.companyName || 'Company'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 font-medium text-[#0B1F4B]">{app.jobTitle || (app as any).title || 'Position'}</td>
                          <td className="px-4 py-3.5 text-[#6B7694]">{app.appliedDate || 'Recent'}</td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${
                                app.status === 'Shortlisted'
                                  ? 'bg-[#DDF5E8] text-[#1E9E63]'
                                  : app.status === 'Interview'
                                  ? 'bg-[#FFE9D6] text-[#E8650A]'
                                  : app.status === 'Rejected'
                                  ? 'bg-[#FFE0E0] text-[#D93636]'
                                  : app.status === 'Selected'
                                  ? 'bg-[#DDF5E8] text-[#1E9E63]'
                                  : 'bg-[#DCEBFF] text-[#1E5BE0]'
                              }`}
                            >
                              {app.status || 'Under Review'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <div className="inline-flex items-center gap-2">
                              <Link
                                href="/student/applications"
                                className="border border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer"
                              >
                                View
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}</tbody>
                </table>
              </div>
            </div>
          </main>

          {/* ================= ZONE 3: RIGHT PANEL (~320px stacked cards, gap 20px) ================= */}
          <aside className="w-full xl:w-[320px] shrink-0 space-y-5">
            {/* 1. Profile Completion Card */}
            <div className="bg-white rounded-[14px] p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[16px] font-bold text-[#0B1F4B]">Profile Completion</h3>
                <span className="text-[16px] font-bold text-[#1E5BE0]">{profileCompletion.percentage}%</span>
              </div>
              <p className="text-[12px] text-[#6B7694] mb-3">
                Complete your details to boost candidate ranking
              </p>

              {/* Blue progress bar (8px, rounded, light track) */}
              <div className="w-full h-2 bg-[#F1F4F9] rounded-full overflow-hidden mb-5">
                <div
                  className="h-full bg-[#1E5BE0] rounded-full transition-all duration-700"
                  style={{ width: `${profileCompletion.percentage}%` }}
                />
              </div>

              {/* Checklist */}
              <div className="space-y-3 mb-6">
                {profileCompletion.checklist.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-[13px]">
                    {item.done ? (
                      <div className="w-5 h-5 rounded-full bg-[#22B573] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0" />
                    )}
                    <span
                      className={`font-medium ${
                        item.done ? "text-[#0B1F4B]" : "text-[#6B7694]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Full-width solid blue button (10px radius, 48px height) */}
              <Link
                href="/student/profile"
                className="w-full h-[48px] bg-[#1E5BE0] hover:bg-[#1548b8] text-white text-[14px] font-semibold rounded-[10px] flex items-center justify-center transition-colors shadow-sm"
              >
                Complete Your Profile →
              </Link>
            </div>

            {/* 2. Upcoming Interviews Card */}
            <div className="bg-white rounded-[14px] p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-bold text-[#0B1F4B]">Upcoming Interviews</h3>
                <Link
                  href="/student/interviews"
                  className="text-[13px] font-semibold text-[#1E5BE0] hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-3.5">
                {upcomingInterviewsList.length === 0 ? (
                  <div className="p-4 rounded-[12px] border border-dashed border-[#EEF1F7] text-center text-xs text-[#6B7694]">
                    No upcoming interviews scheduled
                  </div>
                ) : (
                  upcomingInterviewsList.map((interview) => (
                    <div
                      key={interview.id}
                      className="p-3.5 rounded-[12px] border border-[#EEF1F7] bg-[#FDFDFE] hover:border-[#1E5BE0]/30 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 border border-[#EEF1F7] shadow-2xs overflow-hidden font-bold text-xs text-[#1E5BE0]">
                          {interview.companyLogo ? (
                            <img
                              src={interview.companyLogo}
                              alt={interview.companyName || "Company"}
                              className="w-full h-full object-contain p-0.5"
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                const proxyUrl = interview.companyId ? getCompanyLogoProxyUrl(interview.companyId) : "";
                                if (proxyUrl && target.src !== proxyUrl) {
                                  target.src = proxyUrl;
                                  return;
                                }
                                target.style.display = "none";
                                const parent = target.parentElement;
                                if (parent && !parent.querySelector(".logo-fb")) {
                                  const fb = document.createElement("span");
                                  fb.textContent = (interview.companyName || "C").slice(0, 2).toUpperCase();
                                  fb.className = "font-bold text-xs text-[#1E5BE0] logo-fb";
                                  parent.appendChild(fb);
                                }
                              }}
                            />
                          ) : (
                            (interview.companyName || 'C').slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[13px] text-[#0B1F4B] truncate">
                              {interview.jobTitle}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#DCEBFF] text-[#1E5BE0]">
                              {interview.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-[#6B7694] mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-[#6B7694]" /> {interview.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#6B7694]" /> {interview.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#6B7694] group-hover:text-[#1E5BE0] shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  ))
                )}</div>
            </div>

            {/* 3. Latest Notifications Card */}
            <div className="bg-white rounded-[14px] p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-bold text-[#0B1F4B]">Latest Notifications</h3>
                <Link
                  href="/student/notifications"
                  className="text-[13px] font-semibold text-[#1E5BE0] hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-3.5">
                {notificationsList.length === 0 ? (
                  <div className="p-4 rounded-[12px] border border-dashed border-[#EEF1F7] text-center text-xs text-[#6B7694]">
                    No new notifications
                  </div>
                ) : (
                  notificationsList.map((notif: any) => (
                    <div key={notif.id} className="flex items-start justify-between gap-3 text-[13px]">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-white border border-[#EEF1F7] p-1 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden font-bold text-xs text-[#1E5BE0]">
                          {notif.companyLogo ? (
                            <img
                              src={notif.companyLogo}
                              alt={notif.companyName || "Company"}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                const proxyUrl = notif.companyId ? getCompanyLogoProxyUrl(notif.companyId) : "";
                                if (proxyUrl && target.src !== proxyUrl) {
                                  target.src = proxyUrl;
                                  return;
                                }
                                target.style.display = "none";
                                const parent = target.parentElement;
                                if (parent && !parent.querySelector(".logo-fb")) {
                                  const fb = document.createElement("span");
                                  fb.textContent = (notif.companyName || "Co").slice(0, 2).toUpperCase();
                                  fb.className = "font-bold text-xs text-[#1E5BE0] logo-fb";
                                  parent.appendChild(fb);
                                }
                              }}
                            />
                          ) : notif.companyName ? (
                            <span>{notif.companyName.slice(0, 2).toUpperCase()}</span>
                          ) : (
                            <Bell className="w-4 h-4 text-[#1E5BE0]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[#0B1F4B] text-[13px] leading-tight">
                            {notif.title}
                          </p>
                          {notif.subtitle && (
                            <p className="text-[11px] font-semibold text-[#1E5BE0] mt-0.5">
                              {notif.subtitle}
                            </p>
                          )}
                          <p className="text-[12px] text-[#6B7694] mt-0.5 truncate">
                            {notif.message}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] text-[#6B7694] shrink-0">{notif.timeAgo || 'Recently'}</span>
                    </div>
                  ))
                )}</div>
            </div>
          </aside>
        </div>
  );
}
