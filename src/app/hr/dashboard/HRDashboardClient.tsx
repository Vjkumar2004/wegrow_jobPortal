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
  Video,
  X,
  Loader2,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Job, Application, Interview, CompanyApprovalStatus } from "@/types";
import PostJobModal from "@/components/hr/PostJobModal";
import CompanyProfileSubSection from "@/components/hr/CompanyProfileSubSection";
import { authService } from "@/services/auth.service";
import { hrService } from "@/services/hr.service";
import { applicationsService } from "@/services/applications.service";
import { getNameInitials, getHRAvatarUrl } from "@/lib/utils";

interface HRDashboardClientProps {
  initialJobs: Job[];
  initialApplicants: Application[];
  initialInterviews: Interview[];
}

// Applicant pipeline breakdown & monthly trend calculated dynamically inside component

export default function HRDashboardClient({
  initialJobs,
  initialApplicants,
  initialInterviews,
}: HRDashboardClientProps) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const { data: jobsQuery = initialJobs } = useQuery({
    queryKey: ["hr-jobs"],
    queryFn: () => hrService.getMyJobs(),
    placeholderData: initialJobs,
    staleTime: 30_000,
  });

  const { data: applicantsQuery = initialApplicants } = useQuery({
    queryKey: ["hr-applications"],
    queryFn: () => hrService.getApplicants(),
    placeholderData: initialApplicants,
    staleTime: 20_000,
  });

  const { data: interviewsQuery = initialInterviews } = useQuery({
    queryKey: ["hr-interviews"],
    queryFn: () => hrService.getInterviews(),
    placeholderData: initialInterviews,
    staleTime: 20_000,
  });

  const [jobs, setJobs] = useState<Job[]>(jobsQuery);
  const [applicants, setApplicants] = useState<Application[]>(applicantsQuery);
  const [interviews, setInterviews] = useState<Interview[]>(interviewsQuery);
  const [pipelinePeriod, setPipelinePeriod] = useState("Last 6 Months");
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmittingSchedule, setIsSubmittingSchedule] = useState(false);

  React.useEffect(() => {
    if (jobsQuery) setJobs(jobsQuery);
  }, [jobsQuery]);

  React.useEffect(() => {
    if (applicantsQuery) setApplicants(applicantsQuery);
  }, [applicantsQuery]);

  React.useEffect(() => {
    if (interviewsQuery) setInterviews(interviewsQuery);
  }, [interviewsQuery]);

  const scheduledAppIds = React.useMemo(() => {
    return new Set(interviews.map((i) => i.applicationId).filter(Boolean));
  }, [interviews]);

  // Schedule Interview Modal state
  const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [interviewDate, setInterviewDate] = useState(() => new Date(Date.now() + 86400000).toISOString().split("T")[0]);
  const [interviewTime, setInterviewTime] = useState("11:30 AM");
  const [interviewType, setInterviewType] = useState<"Technical" | "HR Discussion" | "Managerial" | "Screening">("Technical");
  const [meetingLink, setMeetingLink] = useState("https://meet.google.com/wegrow-interview");
  const [interviewNotes, setInterviewNotes] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const updateStatus = async (appId: string, newStatus: any) => {
    // 1. Optimistic update
    const prevApplicants = applicants;
    setApplicants((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    );
    if (selectedApplicant && selectedApplicant.id === appId) {
      setSelectedApplicant((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(`Candidate status updated to "${newStatus}"!`);

    try {
      await applicationsService.updateApplicationStatus(appId, newStatus);
      queryClient.setQueryData<Application[]>(["hr-applications"], (prev) =>
        (prev ?? []).map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      );
    } catch {
      // Rollback on error
      setApplicants(prevApplicants);
      showToast(`Failed to update candidate status.`);
    }
  };

  const openScheduleModal = (app: Application) => {
    setSelectedApplicant(app);
    setInterviewDate(new Date(Date.now() + 86400000).toISOString().split("T")[0]);
    setMeetingLink("https://meet.google.com/wegrow-interview");
    setInterviewNotes("");
    setScheduleModalOpen(true);
  };

  const handleStatusChange = async (app: Application, newStatus: string) => {
    if (newStatus === "Interview") {
      if (scheduledAppIds.has(app.id)) {
        await updateStatus(app.id, "Interview");
        return;
      }
      openScheduleModal(app);
      return;
    }
    await updateStatus(app.id, newStatus);
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApplicant) return;

    try {
      setIsSubmittingSchedule(true);
      let startIso = new Date(Date.now() + 86400000).toISOString();
      let endIso = new Date(Date.now() + 86400000 + 3600000).toISOString();
      if (interviewDate) {
        let hours = 11, minutes = 30;
        const match = interviewTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
        if (match) {
          hours = parseInt(match[1], 10);
          minutes = parseInt(match[2], 10);
          const meridiem = match[3]?.toUpperCase();
          if (meridiem === "PM" && hours < 12) hours += 12;
          if (meridiem === "AM" && hours === 12) hours = 0;
        }
        const d = new Date(interviewDate);
        d.setHours(hours, minutes, 0, 0);
        startIso = d.toISOString();
        endIso = new Date(d.getTime() + 60 * 60 * 1000).toISOString();
      }

      const scheduled = await hrService.scheduleInterview({
        applicationId: selectedApplicant.id,
        candidateName: selectedApplicant.applicantName,
        candidateEmail: selectedApplicant.applicantEmail,
        jobTitle: selectedApplicant.jobTitle,
        date: interviewDate,
        time: interviewTime,
        type: interviewType,
        meetingLink,
        notes: interviewNotes,
        scheduledStartAt: startIso,
        scheduledEndAt: endIso,
      });

      setInterviews((prev) => [scheduled, ...prev]);
      await updateStatus(selectedApplicant.id, "Interview");
      queryClient.invalidateQueries({ queryKey: ["hr-interviews"] });
      queryClient.invalidateQueries({ queryKey: ["hr-applications"] });
      setScheduleModalOpen(false);
      showToast(`Interview invite scheduled & status updated to "Interview"!`);
    } catch (err: any) {
      showToast(err?.message || "Failed to schedule interview.");
    } finally {
      setIsSubmittingSchedule(false);
    }
  };

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

  const [companyApprovalStatus, setCompanyApprovalStatus] = useState<CompanyApprovalStatus | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [hrUserId, setHrUserId] = useState<string>("");
  const [hrUserName, setHrUserName] = useState<string>("");
  const [hrAvatarUrl, setHrAvatarUrl] = useState<string | null>(null);
  const [hrCompanyLogoUrl, setHrCompanyLogoUrl] = useState<string | null>(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  React.useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      if (user.id) setHrUserId(user.id);
      const name = user.name || user.fullName || (user as any).hrProfile?.fullName || "Recruiter";
      setHrUserName(name);
      const hr = (user as any).hrProfile;
      if (hr?.company) {
        setCompanyName(hr.company.name);
        if (hr.company.logoUrl) setHrCompanyLogoUrl(hr.company.logoUrl);
        const st = hr.company.approvalStatus;
        setCompanyApprovalStatus(
          st === "APPROVED" ? "Approved" : st === "REJECTED" ? "Rejected" : st === "SUSPENDED" ? "Suspended" : "Pending"
        );
      }
      const avatar =
        (user as any).avatarUrl ||
        (user as any).avatar ||
        (user as any).hrProfile?.avatarUrl ||
        (user as any).hrProfile?.avatar ||
        (typeof window !== "undefined"
          ? localStorage.getItem(`wegrow_hr_avatar_${user.id}`) || localStorage.getItem("wegrow_hr_avatar")
          : null);
      if (avatar) setHrAvatarUrl(avatar);
    }

    authService.getMe().then((res) => {
      const u = res?.data?.user;
      if (u) {
        if (u.id) setHrUserId(u.id);
        const name = u.name || u.fullName || (u as any).hrProfile?.fullName;
        if (name) setHrUserName(name);
        const hr = (u as any).hrProfile;
        if (hr?.company) {
          if (hr.company.name) setCompanyName(hr.company.name);
          if (hr.company.logoUrl) setHrCompanyLogoUrl(hr.company.logoUrl);
        }
        const avatar =
          (u as any).avatarUrl ||
          (u as any).avatar ||
          (u as any).hrProfile?.avatarUrl ||
          (u as any).hrProfile?.avatar;
        if (avatar) {
          setHrAvatarUrl(avatar);
        } else if (u.id) {
          setHrAvatarUrl(getHRAvatarUrl(u.id));
        }
      }
    }).catch(() => {});

    const onAvatarUpdate = (e: any) => {
      const newAvatar = e.detail?.avatarUrl ?? null;
      setHrAvatarUrl(newAvatar);
    };
    window.addEventListener("hr-avatar-updated", onAvatarUpdate);
    return () => window.removeEventListener("hr-avatar-updated", onAvatarUpdate);
  }, []);

  const activeJobs = jobs.filter((j) => j.status === "Published");
  const shortlistedCount = applicants.filter((a) => a.status === "Shortlisted").length;
  const underReviewCount = applicants.filter((a) => a.status === "Under Review" || a.status === "Applied").length;
  const offeredCount = applicants.filter((a) => a.status === "Selected").length;
  const rejectedCount = applicants.filter((a) => a.status === "Rejected").length;

  const candidatePipeline = [
    { name: "Under Review", value: underReviewCount, color: "#1E5BE0" },
    { name: "Shortlisted", value: shortlistedCount, color: "#FF6B00" },
    { name: "Interview Round", value: interviews.length, color: "#22B573" },
    { name: "Selected", value: offeredCount, color: "#8B5CF6" },
    ...(rejectedCount > 0 ? [{ name: "Rejected", value: rejectedCount, color: "#EF4444" }] : []),
  ];

  const totalPipelineValue = candidatePipeline.reduce((sum, item) => sum + item.value, 0);
  const pieChartData =
    totalPipelineValue > 0
      ? candidatePipeline.filter((i) => i.value > 0)
      : [{ name: "No Applicants Yet", value: 1, color: "#E2E8F0" }];

  const monthlyApplicantTrend = React.useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    type MonthBucket = {
      month: string;
      year: number;
      monthIndex: number;
      applications: number;
      hires: number;
    };

    const buckets: MonthBucket[] = [];

    if (pipelinePeriod === "Last 3 Months") {
      for (let i = 2; i >= 0; i--) {
        const d = new Date(currentYear, currentMonth - i, 1);
        buckets.push({
          month: monthNames[d.getMonth()],
          year: d.getFullYear(),
          monthIndex: d.getMonth(),
          applications: 0,
          hires: 0,
        });
      }
    } else if (pipelinePeriod.includes("Year")) {
      const targetYear = parseInt(pipelinePeriod.replace(/\D/g, ""), 10) || currentYear;
      for (let m = 0; m < 12; m++) {
        buckets.push({
          month: monthNames[m],
          year: targetYear,
          monthIndex: m,
          applications: 0,
          hires: 0,
        });
      }
    } else {
      // Default: Last 6 Months (e.g. May, Jun, Jul, Aug, Sep, Oct)
      for (let i = 5; i >= 0; i--) {
        const d = new Date(currentYear, currentMonth - i, 1);
        buckets.push({
          month: monthNames[d.getMonth()],
          year: d.getFullYear(),
          monthIndex: d.getMonth(),
          applications: 0,
          hires: 0,
        });
      }
    }

    // Populate counts from real applicants
    applicants.forEach((app) => {
      const rawDate = app.appliedAt || app.appliedDate;
      if (!rawDate) return;
      const appDate = new Date(rawDate);
      if (isNaN(appDate.getTime())) return;

      const appMonth = appDate.getMonth();
      const appYear = appDate.getFullYear();

      // Find bucket matching both month and year
      const match = buckets.find((b) => b.monthIndex === appMonth && b.year === appYear);
      if (match) {
        match.applications += 1;
        if (app.status === "Selected") {
          match.hires += 1;
        }
      }
    });

    return buckets.map(({ month, applications, hires }) => ({
      month,
      applications,
      hires,
    }));
  }, [applicants, pipelinePeriod]);

  const handleJobCreated = (newJob: Job) => {
    setJobs([newJob, ...jobs]);
    setToastMessage(`Job "${newJob.title}" posted successfully!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="p-3 sm:p-5 lg:p-7 space-y-4 sm:space-y-6 max-w-7xl mx-auto w-full font-['Poppins',sans-serif]">
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

      {/* Pending / Rejected Moderation Alert Banner */}
      {companyApprovalStatus === "Pending" && (
        <div className="p-3.5 sm:p-5 bg-amber-50 rounded-[16px] border border-amber-200/90 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Company Profile Awaiting Admin Approval
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 leading-relaxed">
                Your company {companyName ? <span className="font-semibold text-slate-900">&quot;{companyName}&quot;</span> : ""} is currently in the moderation review queue. Active job posting will be enabled once our administration team verifies your corporate profile.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-amber-100 text-amber-800 shrink-0 self-start sm:self-auto">
            Pending Moderation
          </span>
        </div>
      )}

      {companyApprovalStatus === "Rejected" && (
        <div className="p-3.5 sm:p-5 bg-rose-50 rounded-[16px] border border-rose-200 text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Company Registration Rejected
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 leading-relaxed">
                Your company registration was not approved. Please review your company profile or contact support for assistance.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-rose-100 text-rose-800 shrink-0 self-start sm:self-auto">
            Registration Rejected
          </span>
        </div>
      )}

      {/* ============================================================== */}
      {/* 1. PREMIUM RECRUITER HERO BANNER                               */}
      {/* ============================================================== */}
      <div className="relative overflow-hidden rounded-2xl border border-[#EEF1F7] shadow-[0_4px_20px_rgba(11,31,75,0.05)] bg-gradient-to-r from-[#FFF5EE] via-[#F8FAFD] to-[#EDF4FF] p-3.5 sm:p-5 lg:p-7 transition-all duration-200 hover:shadow-md">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
          {/* Left: Avatar + Recruiter Details + Status */}
          <div className="flex items-start sm:items-center gap-3 sm:gap-4.5 min-w-0">
            {/* Avatar / Brand Icon Frame (strictly sized 44px mobile, 64px desktop) */}
            <div className="relative w-11 h-11 sm:w-16 sm:h-16 shrink-0">
              <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-2xl border-2 border-white shadow-md overflow-hidden bg-gradient-to-tr from-[#FF6B00] via-[#FF8533] to-amber-400 flex items-center justify-center text-white font-extrabold text-sm sm:text-xl select-none ring-2 ring-orange-100">
                {hrAvatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={hrAvatarUrl}
                    alt={hrUserName || "Recruiter"}
                    className="w-full h-full object-cover"
                    onError={() => {
                      if (hrUserId && hrAvatarUrl !== getHRAvatarUrl(hrUserId)) {
                        setHrAvatarUrl(getHRAvatarUrl(hrUserId));
                      } else {
                        setHrAvatarUrl(null);
                      }
                    }}
                  />
                ) : hrCompanyLogoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={hrCompanyLogoUrl}
                    alt="Company Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{hrUserName ? hrUserName.slice(0, 2).toUpperCase() : "HR"}</span>
                )}
              </div>
              {/* Online pulse indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-2xs z-10" />
            </div>

            {/* Recruiter info & heading */}
            <div className="min-w-0 space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/90 border border-[#E2E8F0] text-[10px] sm:text-[11px] font-semibold text-[#0B1F4B] shadow-2xs">
                <Building2 className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span className="truncate max-w-[180px] sm:max-w-xs">{companyName || "WeGrow Partner"}</span>
                {companyApprovalStatus === "Approved" && (
                  <CheckCircle2 className="w-3 h-3 text-[#1E5BE0] shrink-0" />
                )}
              </div>

              <h1 className="text-[18px] sm:text-[24px] lg:text-[26px] font-extrabold text-[#0B1F4B] tracking-tight truncate">
                {getGreeting()}, {hrUserName ? hrUserName.split(" ")[0] : "Recruiter"}! 👋
              </h1>

              <p className="text-[11px] sm:text-[13px] text-[#6B7694] leading-relaxed">
                You have <span className="font-bold text-[#1E5BE0]">{applicants.length} candidate application{applicants.length === 1 ? "" : "s"}</span> across <span className="font-bold text-[#0B1F4B]">{activeJobs.length} active opening{activeJobs.length === 1 ? "" : "s"}</span>.
              </p>
            </div>
          </div>

          {/* Right: Quick Pulse Stats & Primary CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 lg:pl-4">
            {/* Quick Micro Stat Pills */}
            <div className="hidden md:flex items-center gap-2.5">
              <div className="bg-white/80 backdrop-blur-xs rounded-xl px-3.5 py-2 border border-[#EEF1F7] shadow-2xs flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FFF0E6] text-[#FF6B00] flex items-center justify-center">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-[#6B7694] uppercase font-bold tracking-wider leading-none">Jobs</div>
                  <div className="text-[14px] font-extrabold text-[#0B1F4B] leading-tight">{activeJobs.length} Live</div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xs rounded-xl px-3.5 py-2 border border-[#EEF1F7] shadow-2xs flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-[#6B7694] uppercase font-bold tracking-wider leading-none">Interviews</div>
                  <div className="text-[14px] font-extrabold text-[#0B1F4B] leading-tight">{interviews.length} Scheduled</div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsPostJobModalOpen(true)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-[13px] sm:text-[14px] px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post New Job</span>
              </button>

              <Link
                href="/hr/applicants"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#0B1F4B] border border-[#D8E2F0] font-semibold text-[13px] sm:text-[14px] px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
              >
                <span>Applicants</span>
                <ArrowRight className="w-4 h-4 text-[#6B7694]" />
              </Link>
            </div>
          </div>
        </div>

        {/* Ambient subtle background decorative blurs */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-[#1E5BE0]/6 pointer-events-none blur-2xl" />
        <div className="absolute right-1/2 -top-12 w-40 h-40 rounded-full bg-[#FF6B00]/6 pointer-events-none blur-xl" />
      </div>

      {/* 1.5. NATIVE RECRUITER APK QUICK ACTION HUB (4 Fast Touch Action Tiles) */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => setIsPostJobModalOpen(true)}
          className="flex flex-col items-center justify-center p-2 sm:p-3.5 rounded-2xl bg-white border border-[#EEF1F7] shadow-2xs hover:border-[#FF6B00]/40 hover:shadow-xs active:scale-95 transition-all text-center group cursor-pointer"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#FFF0E6] text-[#FF6B00] flex items-center justify-center mb-1 sm:mb-1.5 group-hover:scale-105 transition-transform shadow-2xs">
            <PlusCircle className="w-4.5 h-4.5 sm:w-5 sm:h-5" strokeWidth={2} />
          </div>
          <span className="text-[10px] sm:text-[12px] font-bold text-[#0B1F4B] leading-tight">
            + Post Job
          </span>
        </button>
        <Link
          href="/hr/applicants"
          className="flex flex-col items-center justify-center p-2 sm:p-3.5 rounded-2xl bg-white border border-[#EEF1F7] shadow-2xs hover:border-[#1E5BE0]/40 hover:shadow-xs active:scale-95 transition-all text-center group"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center mb-1 sm:mb-1.5 group-hover:scale-105 transition-transform shadow-2xs">
            <Users className="w-4.5 h-4.5 sm:w-5 sm:h-5" strokeWidth={2} />
          </div>
          <span className="text-[10px] sm:text-[12px] font-bold text-[#0B1F4B] leading-tight">
            Applicants
          </span>
        </Link>
        <Link
          href="/hr/interviews"
          className="flex flex-col items-center justify-center p-2 sm:p-3.5 rounded-2xl bg-white border border-[#EEF1F7] shadow-2xs hover:border-[#22B573]/40 hover:shadow-xs active:scale-95 transition-all text-center group"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#E8F8F1] text-[#22B573] flex items-center justify-center mb-1 sm:mb-1.5 group-hover:scale-105 transition-transform shadow-2xs">
            <Calendar className="w-4.5 h-4.5 sm:w-5 sm:h-5" strokeWidth={2} />
          </div>
          <span className="text-[10px] sm:text-[12px] font-bold text-[#0B1F4B] leading-tight">
            Interviews
          </span>
        </Link>
        <Link
          href="/hr/jobs"
          className="flex flex-col items-center justify-center p-2 sm:p-3.5 rounded-2xl bg-white border border-[#EEF1F7] shadow-2xs hover:border-[#8B5CF6]/40 hover:shadow-xs active:scale-95 transition-all text-center group"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#F3EEFF] text-[#8B5CF6] flex items-center justify-center mb-1 sm:mb-1.5 group-hover:scale-105 transition-transform shadow-2xs">
            <Briefcase className="w-4.5 h-4.5 sm:w-5 sm:h-5" strokeWidth={2} />
          </div>
          <span className="text-[10px] sm:text-[12px] font-bold text-[#0B1F4B] leading-tight">
            My Jobs
          </span>
        </Link>
      </div>

      {/* ============================================================== */}
      {/* 2. DASHBOARD SUB-SECTION NAVIGATION TABS                       */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl border border-[#EEF1F7] p-1.5 shadow-2xs flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveDashboardTab("overview")}
          className={`flex-1 sm:flex-initial px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer active:scale-98 ${
            activeDashboardTab === "overview"
              ? "bg-[#1E5BE0] text-white shadow-xs"
              : "text-[#6B7694] hover:bg-[#F7F9FD] hover:text-[#0B1F4B]"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveDashboardTab("company-profile")}
          className={`flex-1 sm:flex-initial px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer active:scale-98 ${
            activeDashboardTab === "company-profile"
              ? "bg-[#1E5BE0] text-white shadow-xs"
              : "text-[#6B7694] hover:bg-[#F7F9FD] hover:text-[#0B1F4B]"
          }`}
        >
          <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {/* Blue tint: Active Jobs */}
        <div className="bg-white rounded-2xl p-2.5 sm:p-4 lg:p-5 border border-[#EEF1F7] shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs flex items-center gap-2.5 sm:gap-4 bg-gradient-to-br from-blue-50/40 to-white">
          <div className="w-9 h-9 sm:w-[50px] sm:h-[50px] rounded-xl sm:rounded-2xl bg-[#E8F0FF] text-[#1E5BE0] flex items-center justify-center shrink-0">
            <Briefcase className="w-4.5 h-4.5 sm:w-6 sm:h-6" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <div className="text-[18px] sm:text-[24px] lg:text-[26px] font-bold text-[#0B1F4B] leading-none">{activeJobs.length}</div>
            <div className="text-[10px] sm:text-[13px] text-[#6B7694] mt-0.5 sm:mt-1 font-medium truncate">Active Jobs</div>
            <div className="text-[9px] sm:text-[11px] font-semibold text-[#22B573] flex items-center gap-1 mt-0.5 truncate">
              <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {activeJobs.length} live
            </div>
          </div>
        </div>

        {/* Orange tint: Total Applicants */}
        <div className="bg-white rounded-2xl p-2.5 sm:p-4 lg:p-5 border border-[#EEF1F7] shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs flex items-center gap-2.5 sm:gap-4 bg-gradient-to-br from-orange-50/40 to-white">
          <div className="w-9 h-9 sm:w-[50px] sm:h-[50px] rounded-xl sm:rounded-2xl bg-[#FFF0E6] text-[#FF6B00] flex items-center justify-center shrink-0">
            <Users className="w-4.5 h-4.5 sm:w-6 sm:h-6" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <div className="text-[18px] sm:text-[24px] lg:text-[26px] font-bold text-[#0B1F4B] leading-none">{applicants.length}</div>
            <div className="text-[10px] sm:text-[13px] text-[#6B7694] mt-0.5 sm:mt-1 font-medium truncate">Total Applicants</div>
            <div className="text-[9px] sm:text-[11px] font-semibold text-[#FF6B00] flex items-center gap-1 mt-0.5 truncate">
              <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {applicants.length} total
            </div>
          </div>
        </div>

        {/* Green tint: Shortlisted */}
        <div className="bg-white rounded-2xl p-2.5 sm:p-4 lg:p-5 border border-[#EEF1F7] shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs flex items-center gap-2.5 sm:gap-4 bg-gradient-to-br from-emerald-50/40 to-white">
          <div className="w-9 h-9 sm:w-[50px] sm:h-[50px] rounded-xl sm:rounded-2xl bg-[#E8F8F1] text-[#22B573] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4.5 h-4.5 sm:w-6 sm:h-6" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <div className="text-[18px] sm:text-[24px] lg:text-[26px] font-bold text-[#0B1F4B] leading-none">{shortlistedCount}</div>
            <div className="text-[10px] sm:text-[13px] text-[#6B7694] mt-0.5 sm:mt-1 font-medium truncate">Shortlisted</div>
            <div className="text-[9px] sm:text-[11px] font-semibold text-[#22B573] flex items-center gap-1 mt-0.5 truncate">
              <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {shortlistedCount} verified
            </div>
          </div>
        </div>

        {/* Purple tint: Live Interviews */}
        <div className="bg-white rounded-2xl p-2.5 sm:p-4 lg:p-5 border border-[#EEF1F7] shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs flex items-center gap-2.5 sm:gap-4 bg-gradient-to-br from-purple-50/40 to-white">
          <div className="w-9 h-9 sm:w-[50px] sm:h-[50px] rounded-xl sm:rounded-2xl bg-[#F3EEFF] text-[#8B5CF6] flex items-center justify-center shrink-0">
            <Calendar className="w-4.5 h-4.5 sm:w-6 sm:h-6" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <div className="text-[18px] sm:text-[24px] lg:text-[26px] font-bold text-[#0B1F4B] leading-none">{interviews.length}</div>
            <div className="text-[10px] sm:text-[13px] text-[#6B7694] mt-0.5 sm:mt-1 font-medium truncate">Interviews</div>
            <div className="text-[9px] sm:text-[11px] font-semibold text-[#8B5CF6] flex items-center gap-1 mt-0.5 truncate">
              <Clock className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" /> {interviews.length} rounds
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. CHARTS ROW (Donut Funnel Pipeline + Monthly Applications Bar Chart) */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-5">
        {/* Card 1: Pipeline Breakdown (Donut Chart) */}
        <div className="bg-white rounded-[14px] p-3.5 sm:p-5 lg:p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-bold text-[#0B1F4B]">Candidate Pipeline Status</h3>
              <p className="text-[12px] text-[#6B7694] mt-0.5">Real-time candidate funnel distribution</p>
            </div>
            <span className="text-xs font-semibold text-[#1E5BE0] bg-[#E8F0FF] px-2.5 py-1 rounded-md">
              {applicants.length} Active
            </span>
          </div>

          <div className="my-4 flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="relative w-[170px] h-[170px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={76}
                    paddingAngle={totalPipelineValue > 0 ? 3 : 0}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  {totalPipelineValue > 0 && (
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
                  )}
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[24px] font-extrabold text-[#0B1F4B] leading-none">{applicants.length}</span>
                <span className="text-[11px] text-[#6B7694] font-medium mt-0.5">Candidates</span>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 w-full sm:w-auto">
              {candidatePipeline.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs border border-white"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <div className="text-[12px] font-medium text-[#0B1F4B]">{item.name}</div>
                    <div className="text-[13px] font-bold text-[#0B1F4B] leading-none mt-0.5">{item.value}</div>
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
        <div className="bg-white rounded-[14px] p-3.5 sm:p-5 lg:p-6 border border-[#EEF1F7] shadow-[0_4px_14px_rgba(11,31,75,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between">
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
              <BarChart data={monthlyApplicantTrend} barGap={4} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left 2 Cols: Recent Candidate Applications Table */}
        <div className="lg:col-span-2 bg-white rounded-[14px] border border-[#EEF1F7] p-3.5 sm:p-5 lg:p-6 shadow-[0_4px_14px_rgba(11,31,75,0.05)] space-y-4">
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

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
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
                {applicants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#6B7694]">
                      No candidate submissions received yet.
                    </td>
                  </tr>
                ) : (
                  applicants.slice(0, 5).map((app) => (
                    <tr key={app.id} className="hover:bg-[#F7F9FD]/60 transition-colors">
                      <td className="py-3.5 px-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1E5BE0] to-blue-400 text-white font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                            {app.applicantAvatar ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={app.applicantAvatar}
                                alt={app.applicantName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const fallbackUrl = app.applicantId
                                    ? `${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "https://wegrow-jobportal-backend.vercel.app/api/v1"}/media/avatar/${app.applicantId}`
                                    : "";
                                  if (fallbackUrl && e.currentTarget.src !== fallbackUrl) {
                                    e.currentTarget.src = fallbackUrl;
                                    return;
                                  }
                                  const el = e.currentTarget;
                                  el.style.display = "none";
                                  const parent = el.parentElement;
                                  if (parent && !parent.querySelector(".fb-init")) {
                                    const span = document.createElement("span");
                                    span.className = "fb-init font-bold text-xs text-white";
                                    span.textContent = getNameInitials(app.applicantName);
                                    parent.appendChild(span);
                                  }
                                }}
                              />
                            ) : (
                              <span>{getNameInitials(app.applicantName)}</span>
                            )}
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
                        {app.applicantCollege || "College not specified"}
                      </td>
                      <td className="py-3.5 px-3.5">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app, e.target.value)}
                          className="bg-[#F1F4F9] hover:bg-[#E3EEFF] text-[#0B1F4B] text-[11px] font-semibold px-2 py-1 rounded-[6px] border border-[#E3E8F0] focus:outline-none focus:ring-1 focus:ring-[#1E5BE0]/30 cursor-pointer transition-colors"
                        >
                          <option value="Under Review">Under Review</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview">Interview</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {scheduledAppIds.has(app.id) ? (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-1 bg-[#E8F8EF] text-[#22B573] border border-[#C6F0D8] rounded-[6px] text-[11px] font-semibold select-none shadow-2xs"
                              title="Interview already scheduled"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span className="hidden sm:inline">Scheduled</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => openScheduleModal(app)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1E5BE0] text-white hover:bg-[#1546B0] rounded-[6px] text-[11px] font-semibold transition-colors cursor-pointer"
                              title="Schedule Assessment / Interview"
                            >
                              <Calendar className="w-3 h-3" />
                              <span className="hidden sm:inline">Schedule</span>
                            </button>
                          )}
                          <Link
                            href="/hr/applicants"
                            className="inline-flex items-center px-2 py-1 text-[#6B7694] hover:text-[#1E5BE0] hover:bg-[#F1F4F9] rounded-[6px] text-[11px] font-semibold transition-colors"
                          >
                            Review
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Native APK Candidate Cards View */}
          <div className="md:hidden space-y-3">
            {applicants.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#6B7694] bg-[#F7F9FD] rounded-xl border border-dashed border-[#EEF1F7]">
                No candidate submissions received yet.
              </div>
            ) : (
              applicants.slice(0, 5).map((app) => (
                <div
                  key={app.id}
                  className="bg-[#F8FAFC] border border-[#E9EFF6] rounded-2xl p-3.5 space-y-3 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1E5BE0] to-blue-400 text-white font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                        {app.applicantAvatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={app.applicantAvatar}
                            alt={app.applicantName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const fallbackUrl = app.applicantId
                                ? `${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "https://wegrow-jobportal-backend.vercel.app/api/v1"}/media/avatar/${app.applicantId}`
                                : "";
                              if (fallbackUrl && e.currentTarget.src !== fallbackUrl) {
                                e.currentTarget.src = fallbackUrl;
                                return;
                              }
                              const el = e.currentTarget;
                              el.style.display = "none";
                              const parent = el.parentElement;
                              if (parent && !parent.querySelector(".fb-init")) {
                                const span = document.createElement("span");
                                span.className = "fb-init font-bold text-xs text-white";
                                span.textContent = getNameInitials(app.applicantName);
                                parent.appendChild(span);
                              }
                            }}
                          />
                        ) : (
                          <span>{getNameInitials(app.applicantName)}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[#0B1F4B] text-sm truncate">{app.applicantName}</p>
                        <p className="text-[11px] text-[#6B7694] truncate">{app.applicantEmail}</p>
                      </div>
                    </div>

                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app, e.target.value)}
                      className="bg-white text-[#0B1F4B] text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-[#D8E2EE] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 shadow-2xs shrink-0"
                    >
                      <option value="Under Review">Under Review</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interview">Interview</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="bg-white rounded-xl p-2.5 border border-[#EEF1F7] text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[#6B7694] text-[11px]">Role:</span>
                      <span className="font-semibold text-[#0B1F4B] truncate text-right max-w-[200px]">{app.jobTitle}</span>
                    </div>
                    {app.applicantCollege && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#6B7694] text-[11px]">College:</span>
                        <span className="text-[#3E4A62] text-[11px] font-medium truncate max-w-[180px]">
                          {app.applicantCollege}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-0.5">
                    {scheduledAppIds.has(app.id) ? (
                      <span className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-[#E8F8EF] text-[#22B573] border border-[#C6F0D8] rounded-xl text-xs font-semibold select-none">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Scheduled</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openScheduleModal(app)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-[#1E5BE0] active:scale-[0.98] text-white rounded-xl text-xs font-semibold shadow-xs"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Schedule</span>
                      </button>
                    )}
                    <Link
                      href="/hr/applicants"
                      className="inline-flex items-center justify-center px-4 py-2 bg-white border border-[#D8E2EE] text-[#0B1F4B] active:bg-[#F1F4F9] rounded-xl text-xs font-semibold"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Active Job Openings List */}
        <div className="bg-white rounded-[14px] border border-[#EEF1F7] p-3.5 sm:p-5 lg:p-6 shadow-[0_4px_14px_rgba(11,31,75,0.05)] space-y-4 flex flex-col justify-between">
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
              {jobs.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#6B7694]">
                  No active job postings yet. Post an opening to start receiving candidates.
                </div>
              ) : (
                jobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="py-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link href={`/hr/jobs?jobId=${job.id}`}>
                          <h4 className="text-xs font-bold text-[#0B1F4B] hover:text-[#1E5BE0] transition cursor-pointer">
                            {job.title}
                          </h4>
                        </Link>
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
                        {job.applicantsCount || 0} Applicants
                      </span>
                      <Link
                        href={`/hr/jobs?jobId=${job.id}`}
                        className="text-[#1E5BE0] font-semibold hover:underline flex items-center gap-0.5"
                      >
                        View Details <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))
              )}</div>
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

      {/* SCHEDULE INTERVIEW MODAL */}
      {scheduleModalOpen && selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F4B]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[20px] max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#EEF1F7] space-y-5">
            <div className="flex items-center justify-between border-b border-[#EEF1F7] pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E5BE0] bg-[#E8F0FF] px-2.5 py-0.5 rounded-full mb-1">
                  <Video className="w-3.5 h-3.5" />
                  Live Interview Setup
                </div>
                <h3 className="text-lg font-bold text-[#0B1F4B]">
                  Schedule Interview Round
                </h3>
                <p className="text-xs text-[#6B7694]">
                  Candidate: <strong className="text-[#0B1F4B]">{selectedApplicant.applicantName}</strong> • {selectedApplicant.jobTitle}
                </p>
              </div>
              <button
                onClick={() => setScheduleModalOpen(false)}
                className="p-1.5 rounded-lg text-[#6B7694] hover:bg-[#F1F4F9] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#0B1F4B] mb-1.5">
                    Interview Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] px-3 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0B1F4B] mb-1.5">
                    Interview Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    placeholder="e.g. 11:30 AM"
                    className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] px-3 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#0B1F4B] mb-1.5">
                    Interview Type *
                  </label>
                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value as any)}
                    className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] px-3 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
                  >
                    <option value="Technical">Technical Round</option>
                    <option value="HR Discussion">HR Discussion</option>
                    <option value="Managerial">Managerial Round</option>
                    <option value="Screening">Screening Assessment</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#0B1F4B] mb-1.5">
                    Google Meet / Video Link *
                  </label>
                  <input
                    type="url"
                    required
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] px-3 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0B1F4B] mb-1.5">
                  Internal Notes & Evaluation Criteria
                </label>
                <textarea
                  rows={3}
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  placeholder="Focus on data structures, system design, and prior internship experience..."
                  className="w-full bg-[#F4F6FA] border border-[#E3E8F0] text-[#0B1F4B] px-3 py-2 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1E5BE0]/20 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-[#EEF1F7] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-[8px] font-semibold text-[#6B7694] hover:bg-[#F1F4F9] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSchedule}
                  className="px-5 py-2.5 rounded-[8px] font-bold bg-[#1E5BE0] hover:bg-[#1546B0] text-white shadow-sm transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-2"
                >
                  {isSubmittingSchedule && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isSubmittingSchedule ? "Scheduling..." : "Confirm & Move to Interview Round"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
     </div>
   );
 }
