"use client";

import React, { useState } from "react";
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

import { StudentDashboardData } from "@/types";

interface StudentDashboardClientProps {
  initialData?: StudentDashboardData;
}

export default function StudentDashboardClient({ initialData }: StudentDashboardClientProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Dynamic state populated from initialData or fallback
  const student = initialData?.student || {
    id: "stu-1",
    name: "Vijayakumar M",
    email: "vijayakumar.m@example.com",
    course: "B.E Computer Science",
    college: "WeGrow Skill Campus",
  };

  const stats = initialData?.stats || {
    jobsApplied: 24,
    jobsAppliedTrend: "+4 this month",
    interviews: 8,
    interviewsTrend: "+2 this month",
    shortlisted: 5,
    shortlistedTrend: "+3 this month",
    offers: 1,
    offersTrend: "+1 this month",
  };

  const donutData = initialData?.applicationStatus || DONUT_DATA;
  const trendData = initialData?.applicationTrends || TREND_DATA;
  const recommendedJobsList = initialData?.recommendedJobs || [];
  const recentApplicationsList = initialData?.recentApplications || [];
  const upcomingInterviewsList = initialData?.upcomingInterviews || [];
  const notificationsList = initialData?.notifications || [];
  const profileCompletion = initialData?.profileCompletion || {
    percentage: 75,
    checklist: [
      { label: "Personal Information", done: true },
      { label: "Education Details", done: true },
      { label: "Add Skills", done: true },
      { label: "Upload Resume", done: true },
      { label: "Add Projects", done: false },
    ],
  };

  // State for interactive elements
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trendRange, setTrendRange] = useState("Last 6 Months");
  const [savedJobs, setSavedJobs] = useState<{ [id: string]: boolean }>({
    "rec-1": false,
    "rec-2": true,
    "rec-3": false,
  });
  const [likedJobs, setLikedJobs] = useState<{ [id: string]: boolean }>({
    "rec-1": false,
    "rec-2": false,
    "rec-3": true, // User spec: third one filled red
  });

  const toggleSave = (id: string) => {
    setSavedJobs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleLike = (id: string) => {
    setLikedJobs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLogout = () => {
    authService.logout();
    router.push("/student/login");
  };

  const sidebarLinks = [
    { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "Browse Jobs", href: "/student/jobs", icon: Briefcase },
    { label: "My Applications", href: "/student/applications", icon: FileCheck, badge: `${stats.shortlisted || 5}` },
    { label: "Interviews", href: "/student/interviews", icon: Calendar },
    { label: "Saved Jobs", href: "/student/saved-jobs", icon: Bookmark },
    { label: "Profile", href: "/student/profile", icon: User },
    { label: "Resume", href: "/student/resume", icon: FileText },
    { label: "Reports", href: "/student/reports", icon: BarChart3 },
    { label: "Notifications", href: "/student/notifications", icon: Bell, badge: "3" },
    { label: "Settings", href: "/student/settings", icon: Settings },
  ];

  return (
    <div className="flex-1 flex flex-col xl:flex-row min-w-0 p-4 sm:p-6 lg:p-7 gap-5 overflow-hidden">
      {/* ================= ZONE 2: CENTER CONTENT (flexible, gap 20px) ================= */}
          <main className="flex-1 min-w-0 space-y-5">
            {/* 1. Welcome Banner: Soft peach-to-blue gradient card */}
            <div className="relative overflow-hidden rounded-[14px] p-6 sm:p-7 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] bg-gradient-to-r from-[#FFF5EE] via-[#F4F8FF] to-[#E9F2FF] flex flex-col md:flex-row md:items-center justify-between gap-5 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div>
                <h1 className="text-[22px] sm:text-[26px] font-bold text-[#0B1F4B] tracking-tight flex items-center gap-2">
                  Good Morning, {student.name.split(" ")[0]}! 👋
                </h1>
                <p className="text-[14px] text-[#6B7694] mt-1.5">
                  Keep going! New opportunities are waiting for you.
                </p>
              </div>

              {/* White quote card with orange quote mark */}
              <div className="bg-white rounded-[12px] p-3.5 sm:p-4 border border-[#EEF1F7] shadow-sm max-w-sm flex items-start gap-3 shrink-0">
                <span className="text-[#FF6B00] text-3xl font-serif font-black leading-none shrink-0">
                  “
                </span>
                <p className="text-[12px] sm:text-[13px] text-[#0B1F4B] font-medium leading-snug italic">
                  Small steps everyday lead to big opportunities.
                </p>
              </div>
            </div>

            {/* 2. Four Stat Cards in a row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* Blue tint: Jobs Applied */}
              <div className="bg-white rounded-[14px] p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex items-center gap-4 bg-gradient-to-br from-blue-50/40 to-white">
                <div className="w-[56px] h-[56px] rounded-2xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="text-[26px] font-bold text-[#0B1F4B] leading-none">{stats.jobsApplied}</div>
                  <div className="text-[14px] text-[#6B7694] mt-1">Jobs Applied</div>
                  <div className="text-[12px] font-semibold text-[#22B573] flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3.5 h-3.5" /> {stats.jobsAppliedTrend}
                  </div>
                </div>
              </div>

              {/* Orange tint: Interviews */}
              <div className="bg-white rounded-[14px] p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex items-center gap-4 bg-gradient-to-br from-orange-50/40 to-white">
                <div className="w-[56px] h-[56px] rounded-2xl bg-[#FFF0E6] text-[#FF6B00] flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="text-[26px] font-bold text-[#0B1F4B] leading-none">{stats.interviews}</div>
                  <div className="text-[14px] text-[#6B7694] mt-1">Interviews</div>
                  <div className="text-[12px] font-semibold text-[#22B573] flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3.5 h-3.5" /> {stats.interviewsTrend}
                  </div>
                </div>
              </div>

              {/* Green tint: Shortlisted */}
              <div className="bg-white rounded-[14px] p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex items-center gap-4 bg-gradient-to-br from-emerald-50/40 to-white">
                <div className="w-[56px] h-[56px] rounded-2xl bg-[#E8F8F1] text-[#22B573] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="text-[26px] font-bold text-[#0B1F4B] leading-none">{stats.shortlisted}</div>
                  <div className="text-[14px] text-[#6B7694] mt-1">Shortlisted</div>
                  <div className="text-[12px] font-semibold text-[#22B573] flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3.5 h-3.5" /> {stats.shortlistedTrend}
                  </div>
                </div>
              </div>

              {/* Purple tint: Offers */}
              <div className="bg-white rounded-[14px] p-5 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex items-center gap-4 bg-gradient-to-br from-purple-50/40 to-white">
                <div className="w-[56px] h-[56px] rounded-2xl bg-[#F3EEFF] text-[#8B5CF6] flex items-center justify-center shrink-0">
                  <Briefcase className="w-6 h-6" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="text-[26px] font-bold text-[#0B1F4B] leading-none">{stats.offers}</div>
                  <div className="text-[14px] text-[#6B7694] mt-1">Offers</div>
                  <div className="text-[12px] font-semibold text-[#22B573] flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3.5 h-3.5" /> {stats.offersTrend}
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
                          data={donutData}
                          cx="50%"
                          cy="50%"
                          innerRadius={52}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {donutData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Donut Center Text: "24" bold and "Total Applications" small */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                      <span className="text-[24px] font-bold text-[#0B1F4B] leading-none">
                        {stats.jobsApplied}
                      </span>
                      <span className="text-[10px] text-[#6B7694] font-medium leading-tight mt-1 max-w-[70px]">
                        Total Applications
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
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-[#6B7694]">{item.name}</span>
                        </div>
                        <span className="font-bold text-[#0B1F4B] ml-auto">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EEF1F7] text-center text-[12px] text-[#6B7694]">
                  High activity: 8 interviews currently underway
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

                {/* Vertical Bar Chart with Light-to-strong blue gradient bars */}
                <div className="h-[210px] w-full mt-4">
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
                </div>

                <div className="pt-3 border-t border-[#EEF1F7] flex items-center justify-between text-[12px] text-[#6B7694]">
                  <span>Peak submission: Sep (19 applications)</span>
                  <span className="font-semibold text-[#1E5BE0]">Trending +26%</span>
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
                {/* Job 1: Zoho */}
                <div className="rounded-[14px] border border-[#EEF1F7] p-5 hover:border-[#1E5BE0]/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between bg-white">
                  <div>
                    {/* Top company logo + job title + bookmark icon */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 border border-[#EEF1F7] shadow-2xs overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/6/6d/Zoho_Corporation_logo.svg"
                            alt="Zoho"
                            className="w-full h-full object-contain p-0.5"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[14px] text-[#0B1F4B] leading-snug">
                            Frontend Developer
                          </h4>
                          <p className="text-[12px] text-[#6B7694]">Zoho Corporation</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleSave("rec-1")}
                        className="p-1.5 text-[#6B7694] hover:text-[#1E5BE0] transition cursor-pointer"
                        title="Bookmark job"
                      >
                        <Bookmark
                          className={`w-4 h-4 ${
                            savedJobs["rec-1"] ? "fill-[#1E5BE0] text-[#1E5BE0]" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Two Meta Rows with Icons */}
                    <div className="mt-4 space-y-1.5 text-[12px] text-[#6B7694]">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#6B7694]" /> Chennai
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-[#6B7694]" /> Full Time
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#6B7694]" /> 0-2 Years
                        </span>
                        <span className="flex items-center gap-1.5 font-semibold text-[#0B1F4B]">
                          <IndianRupee className="w-3.5 h-3.5 text-[#22B573]" /> Rs 4 - 7 LPA
                        </span>
                      </div>
                    </div>

                    {/* Skill Chips (bg #E8F0FF, text #1E5BE0, 6px radius, 11px) */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {["React", "JavaScript", "Frontend"].map((skill) => (
                        <span
                          key={skill}
                          className="bg-[#E8F0FF] text-[#1E5BE0] text-[11px] font-medium px-2.5 py-1 rounded-[6px]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer with 2 days ago, heart icon, solid blue Apply Now button */}
                  <div className="mt-5 pt-4 border-t border-[#EEF1F7] flex items-center justify-between">
                    <span className="text-[12px] text-[#6B7694]">2 days ago</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleLike("rec-1")}
                        className="p-1.5 rounded-lg text-[#6B7694] hover:bg-slate-50 transition cursor-pointer"
                        title="Save to favorites"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            likedJobs["rec-1"] ? "fill-[#EF4444] text-[#EF4444]" : ""
                          }`}
                        />
                      </button>
                      <button
                        type="button"
                        className="bg-[#1E5BE0] hover:bg-[#1548b8] text-white text-[13px] font-semibold px-4 py-2 rounded-[8px] transition-colors shadow-sm"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>

                {/* Job 2: TCS */}
                <div className="rounded-[14px] border border-[#EEF1F7] p-5 hover:border-[#1E5BE0]/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between bg-white">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 border border-[#EEF1F7] shadow-2xs overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg"
                            alt="TCS"
                            className="w-full h-full object-contain p-0.5"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[14px] text-[#0B1F4B] leading-snug">
                            Software Engineer
                          </h4>
                          <p className="text-[12px] text-[#6B7694]">Tata Consultancy Services</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleSave("rec-2")}
                        className="p-1.5 text-[#6B7694] hover:text-[#1E5BE0] transition cursor-pointer"
                        title="Bookmark job"
                      >
                        <Bookmark
                          className={`w-4 h-4 ${
                            savedJobs["rec-2"] ? "fill-[#1E5BE0] text-[#1E5BE0]" : ""
                          }`}
                        />
                      </button>
                    </div>

                    <div className="mt-4 space-y-1.5 text-[12px] text-[#6B7694]">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#6B7694]" /> Bangalore
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-[#6B7694]" /> Full Time
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#6B7694]" /> 0-2 Years
                        </span>
                        <span className="flex items-center gap-1.5 font-semibold text-[#0B1F4B]">
                          <IndianRupee className="w-3.5 h-3.5 text-[#22B573]" /> Rs 4 - 8 LPA
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {["Java", "Spring Boot", "MySQL"].map((skill) => (
                        <span
                          key={skill}
                          className="bg-[#E8F0FF] text-[#1E5BE0] text-[11px] font-medium px-2.5 py-1 rounded-[6px]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#EEF1F7] flex items-center justify-between">
                    <span className="text-[12px] text-[#6B7694]">2 days ago</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleLike("rec-2")}
                        className="p-1.5 rounded-lg text-[#6B7694] hover:bg-slate-50 transition cursor-pointer"
                        title="Save to favorites"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            likedJobs["rec-2"] ? "fill-[#EF4444] text-[#EF4444]" : ""
                          }`}
                        />
                      </button>
                      <button
                        type="button"
                        className="bg-[#1E5BE0] hover:bg-[#1548b8] text-white text-[13px] font-semibold px-4 py-2 rounded-[8px] transition-colors shadow-sm"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>

                {/* Job 3: Infosys */}
                <div className="rounded-[14px] border border-[#EEF1F7] p-5 hover:border-[#1E5BE0]/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between bg-white">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 border border-[#EEF1F7] shadow-2xs overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg"
                            alt="Infosys"
                            className="w-full h-full object-contain p-0.5"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[14px] text-[#0B1F4B] leading-snug">
                            UI/UX Designer
                          </h4>
                          <p className="text-[12px] text-[#6B7694]">Infosys Limited</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleSave("rec-3")}
                        className="p-1.5 text-[#6B7694] hover:text-[#1E5BE0] transition cursor-pointer"
                        title="Bookmark job"
                      >
                        <Bookmark
                          className={`w-4 h-4 ${
                            savedJobs["rec-3"] ? "fill-[#1E5BE0] text-[#1E5BE0]" : ""
                          }`}
                        />
                      </button>
                    </div>

                    <div className="mt-4 space-y-1.5 text-[12px] text-[#6B7694]">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#6B7694]" /> Remote
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-[#6B7694]" /> Full Time
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#6B7694]" /> 1-3 Years
                        </span>
                        <span className="flex items-center gap-1.5 font-semibold text-[#0B1F4B]">
                          <IndianRupee className="w-3.5 h-3.5 text-[#22B573]" /> Rs 5 - 9 LPA
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {["Figma", "UI/UX", "Design"].map((skill) => (
                        <span
                          key={skill}
                          className="bg-[#E8F0FF] text-[#1E5BE0] text-[11px] font-medium px-2.5 py-1 rounded-[6px]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#EEF1F7] flex items-center justify-between">
                    <span className="text-[12px] text-[#6B7694]">2 days ago</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleLike("rec-3")}
                        className="p-1.5 rounded-lg text-[#6B7694] hover:bg-slate-50 transition cursor-pointer"
                        title="Save to favorites"
                      >
                        {/* Third one filled red as requested in prompt */}
                        <Heart
                          className={`w-4 h-4 ${
                            likedJobs["rec-3"] ? "fill-[#EF4444] text-[#EF4444]" : ""
                          }`}
                        />
                      </button>
                      <button
                        type="button"
                        className="bg-[#1E5BE0] hover:bg-[#1548b8] text-white text-[13px] font-semibold px-4 py-2 rounded-[8px] transition-colors shadow-sm"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. "Recent Applications" Card with Table */}
            <div className="bg-white rounded-[14px] p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[16px] font-bold text-[#0B1F4B]">Recent Applications</h3>
                  <p className="text-[12px] text-[#6B7694] mt-0.5">Real-time status updates</p>
                </div>
                <Link
                  href="/student/applications"
                  className="text-[13px] font-semibold text-[#1E5BE0] hover:underline"
                >
                  View All
                </Link>
              </div>

              {/* Table with columns: Company, Job Title, Applied Date, Status, Actions */}
              <div className="overflow-x-auto">
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
                    {/* Row 1: Zoho / Frontend Developer / Sep 15, 2026 / Under Review */}
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center border border-[#EEF1F7] shadow-2xs overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/6/6d/Zoho_Corporation_logo.svg"
                              alt="Zoho"
                              className="w-full h-full object-contain p-0.5"
                            />
                          </div>
                          <span className="font-semibold text-[#0B1F4B]">Zoho</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-[#0B1F4B]">Frontend Developer</td>
                      <td className="px-4 py-3.5 text-[#6B7694]">Sep 15, 2026</td>
                      <td className="px-4 py-3.5">
                        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-[#DCEBFF] text-[#1E5BE0]">
                          Under Review
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            className="border border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer"
                          >
                            View
                          </button>
                          <button type="button" className="p-1 text-[#6B7694] hover:text-[#0B1F4B]">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Row 2: TCS / Software Engineer / Sep 12, 2026 / Shortlisted */}
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center border border-[#EEF1F7] shadow-2xs overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg"
                              alt="TCS"
                              className="w-full h-full object-contain p-0.5"
                            />
                          </div>
                          <span className="font-semibold text-[#0B1F4B]">TCS</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-[#0B1F4B]">Software Engineer</td>
                      <td className="px-4 py-3.5 text-[#6B7694]">Sep 12, 2026</td>
                      <td className="px-4 py-3.5">
                        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-[#DDF5E8] text-[#1E9E63]">
                          Shortlisted
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            className="border border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer"
                          >
                            View
                          </button>
                          <button type="button" className="p-1 text-[#6B7694] hover:text-[#0B1F4B]">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Row 3: Infosys / React Developer / Sep 10, 2026 / Interview */}
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center border border-[#EEF1F7] shadow-2xs overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg"
                              alt="Infosys"
                              className="w-full h-full object-contain p-0.5"
                            />
                          </div>
                          <span className="font-semibold text-[#0B1F4B]">Infosys</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-[#0B1F4B]">React Developer</td>
                      <td className="px-4 py-3.5 text-[#6B7694]">Sep 10, 2026</td>
                      <td className="px-4 py-3.5">
                        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-[#FFE9D6] text-[#E8650A]">
                          Interview
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            className="border border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer"
                          >
                            View
                          </button>
                          <button type="button" className="p-1 text-[#6B7694] hover:text-[#0B1F4B]">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Row 4: Amazon / Software Development Intern / Sep 05, 2026 / Rejected */}
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center border border-[#EEF1F7] shadow-2xs overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                              alt="Amazon"
                              className="w-full h-full object-contain p-0.5"
                            />
                          </div>
                          <span className="font-semibold text-[#0B1F4B]">Amazon</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-[#0B1F4B]">
                        Software Development Intern
                      </td>
                      <td className="px-4 py-3.5 text-[#6B7694]">Sep 05, 2026</td>
                      <td className="px-4 py-3.5">
                        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-[#FFE0E0] text-[#D93636]">
                          Rejected
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            className="border border-[#1E5BE0] text-[#1E5BE0] hover:bg-[#1E5BE0] hover:text-white px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer"
                          >
                            View
                          </button>
                          <button type="button" className="p-1 text-[#6B7694] hover:text-[#0B1F4B]">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
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
                {/* Interview 1: TCS */}
                <div className="p-3.5 rounded-[12px] border border-[#EEF1F7] bg-[#FDFDFE] hover:border-[#1E5BE0]/30 transition-all flex items-center justify-between gap-3 group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 border border-[#EEF1F7] shadow-2xs overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg"
                        alt="TCS"
                        className="w-full h-full object-contain p-0.5"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[13px] text-[#0B1F4B] truncate">
                          Software Engineer
                        </span>
                        {/* Mode pill: Online (light blue) */}
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#DCEBFF] text-[#1E5BE0]">
                          Online
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-[#6B7694] mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#6B7694]" /> Sep 25, 2026
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#6B7694]" /> 10:00 AM
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#6B7694] group-hover:text-[#1E5BE0] shrink-0 transition-transform group-hover:translate-x-0.5" />
                </div>

                {/* Interview 2: Zoho */}
                <div className="p-3.5 rounded-[12px] border border-[#EEF1F7] bg-[#FDFDFE] hover:border-[#1E5BE0]/30 transition-all flex items-center justify-between gap-3 group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 border border-[#EEF1F7] shadow-2xs overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/6/6d/Zoho_Corporation_logo.svg"
                        alt="Zoho"
                        className="w-full h-full object-contain p-0.5"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[13px] text-[#0B1F4B] truncate">
                          Frontend Developer
                        </span>
                        {/* Mode pill: Onsite (light orange) */}
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FFE9D6] text-[#E8650A]">
                          Onsite
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-[#6B7694] mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#6B7694]" /> Sep 28, 2026
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#6B7694]" /> 02:00 PM
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#6B7694] group-hover:text-[#1E5BE0] shrink-0 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
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
                {/* Notification 1: Green icon tile */}
                <div className="flex items-start justify-between gap-3 text-[13px]">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#E8F8F1] text-[#22B573] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[#0B1F4B] text-[13px] leading-tight">
                        Your application is shortlisted
                      </p>
                      <p className="text-[12px] text-[#6B7694] mt-0.5 truncate">
                        Zoho - Software Engineer
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#6B7694] shrink-0">2h ago</span>
                </div>

                {/* Notification 2: Blue icon tile */}
                <div className="flex items-start justify-between gap-3 text-[13px]">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center shrink-0 mt-0.5">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[#0B1F4B] text-[13px] leading-tight">
                        Interview scheduled
                      </p>
                      <p className="text-[12px] text-[#6B7694] mt-0.5 truncate">
                        TCS - Software Engineer
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#6B7694] shrink-0">1d ago</span>
                </div>

                {/* Notification 3: Orange icon tile */}
                <div className="flex items-start justify-between gap-3 text-[13px]">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#FFF0E6] text-[#FF6B00] flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[#0B1F4B] text-[13px] leading-tight">
                        New job matches available
                      </p>
                      <p className="text-[12px] text-[#6B7694] mt-0.5 truncate">
                        10 new jobs match your profile
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#6B7694] shrink-0">2d ago</span>
                </div>

                {/* Notification 4: Purple icon tile */}
                <div className="flex items-start justify-between gap-3 text-[13px]">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#F3EEFF] text-[#8B5CF6] flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[#0B1F4B] text-[13px] leading-tight">
                        Your application is under review
                      </p>
                      <p className="text-[12px] text-[#6B7694] mt-0.5 truncate">
                        Infosys - React Developer
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#6B7694] shrink-0">3d ago</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
  );
}
