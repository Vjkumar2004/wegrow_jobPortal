import apiClient from "./api";
import { Job, Application, Interview } from "@/types";
import { mapBackendJobToFrontend } from "./jobs.service";
import { BackendPublicJob, BackendInterview } from "@/types/api";
import { getAvatarUrl, resolveMediaUrl } from "@/lib/utils";

export const hrService = {
  /**
   * GET /api/v1/hr/jobs
   */
  async getMyJobs(): Promise<Job[]> {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        apiClient.get<any>("/hr/jobs").catch(() => null),
        apiClient.get<any>("/hr/applications").catch(() => null),
      ]);

      const rData = jobsRes?.data?.data;
      const items =
        (Array.isArray(rData?.items) ? rData.items : null) ??
        (Array.isArray(rData?.jobs) ? rData.jobs : null) ??
        (Array.isArray(rData) ? rData : []);

      const appsRaw = appsRes?.data?.data;
      const appItems: any[] =
        (Array.isArray(appsRaw?.items) ? appsRaw.items : null) ??
        (Array.isArray(appsRaw?.applications) ? appsRaw.applications : null) ??
        (Array.isArray(appsRaw) ? appsRaw : []);

      if (Array.isArray(items)) {
        return items.map((bj: any) => {
          const mapped = mapBackendJobToFrontend(bj);
          const countFromApps = appItems.filter(
            (a: any) => a.jobId === bj.id || a.job?.id === bj.id || a.job?.title === bj.title
          ).length;
          mapped.applicantsCount = Math.max(mapped.applicantsCount || 0, countFromApps);
          return mapped;
        });
      }
      return [];
    } catch {
      return [];
    }
  },

  /**
   * POST /api/v1/hr/jobs
   */
  async createJob(jobData: Partial<Job> & { publish?: boolean }): Promise<Job> {
    try {
      const formattedSkills = Array.isArray((jobData as any).skills)
        ? (jobData as any).skills
            .map((s: any) => typeof s === "string" ? { name: s.trim(), isRequired: true } : s)
            .filter((s: any) => Boolean(s?.name))
        : undefined;

      const payload = {
        title: jobData.title || "Software Engineer",
        description: jobData.description || "Exciting opportunity to join our expanding tech team.",
        responsibilities: Array.isArray(jobData.responsibilities) ? jobData.responsibilities.join("\n") : undefined,
        requirements: Array.isArray(jobData.requirements) ? jobData.requirements.join("\n") : undefined,
        employmentType: jobData.jobType === "Part Time" ? "PART_TIME" : jobData.jobType === "Internship" ? "INTERNSHIP" : "FULL_TIME",
        workMode: jobData.workMode === "Remote" ? "REMOTE" : jobData.workMode === "Hybrid" ? "HYBRID" : "ON_SITE",
        location: jobData.location || "Bengaluru",
        openings: jobData.openings || 1,
        minExperience: 0,
        salaryMin: jobData.salaryMin,
        salaryMax: jobData.salaryMax,
        salaryPeriod: "ANNUAL",
        salaryCurrency: "INR",
        isSalaryDisclosed: true,
        benefits: jobData.benefits || [],
        skills: formattedSkills,
        publish: (jobData as any).publish ?? true,
      };

      const response = await apiClient.post<{ success: boolean; data: { job: BackendPublicJob } }>("/hr/jobs", payload);
      if (response.data?.data?.job) {
        return mapBackendJobToFrontend(response.data.data.job);
      }
      throw new Error("Failed to create job posting");
    } catch (error) {
      throw error;
    }
  },

  /**
   * PATCH /api/v1/hr/jobs/:jobId/publish
   */
  async publishJob(jobId: string): Promise<boolean> {
    try {
      await apiClient.patch(`/hr/jobs/${jobId}/publish`);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * PATCH /api/v1/hr/jobs/:jobId/pause
   */
  async pauseJob(jobId: string): Promise<boolean> {
    try {
      await apiClient.patch(`/hr/jobs/${jobId}/pause`);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * PATCH /api/v1/hr/jobs/:jobId/close
   */
  async closeJob(jobId: string): Promise<boolean> {
    try {
      await apiClient.patch(`/hr/jobs/${jobId}/close`);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * GET /api/v1/hr/applications
   */
  async getApplicants(): Promise<Application[]> {
    try {
      const response = await apiClient.get<any>("/hr/applications");
      const rData = response?.data?.data;
      const items: any[] =
        (Array.isArray(rData?.items) ? rData.items : null) ??
        (Array.isArray(rData?.applications) ? rData.applications : null) ??
        (Array.isArray(rData) ? rData : []);
      if (items.length === 0) return [];

      const mapHRStatus = (s: string): Application["status"] => {
        switch (s) {
          case "SHORTLISTED": return "Shortlisted";
          case "INTERVIEW": return "Interview";
          case "OFFERED":
          case "SELECTED": return "Selected";
          case "REJECTED":
          case "WITHDRAWN": return "Rejected";
          default: return "Under Review";
        }
      };

      return items.map((app) => ({
        id: app.id,
        jobId: app.jobId || app.job?.id || "",
        jobTitle: app.job?.title || "Role",
        companyName: app.job?.company?.name || "Company",
        applicantId: app.studentId || app.student?.id || "",
        applicantName: app.student?.fullName || app.student?.name || "Candidate",
        applicantEmail: app.student?.user?.email || app.student?.email || "",
        applicantAvatar:
          app.student?.avatarUrl ||
          app.student?.avatar ||
          app.student?.photoUrl ||
          (app.student?.id ? `${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "https://wegrow-jobportal-backend.vercel.app/api/v1"}/media/avatar/${app.student.id}` : undefined),
        applicantPhone: app.student?.phone || app.student?.user?.phone || undefined,
        applicantCollege:
          app.student?.currentCollege ||
          app.student?.educations?.[0]?.institution ||
          app.student?.educations?.[0]?.institutionName ||
          app.student?.education?.[0]?.institution ||
          app.student?.collegeName ||
          "",
        applicantGradYear:
          app.student?.graduationYear
            ? String(app.student.graduationYear)
            : app.student?.educations?.[0]?.endDate
            ? String(new Date(app.student.educations[0].endDate).getFullYear())
            : undefined,
        applicantExperience:
          app.student?.degree ||
          app.student?.educations?.[0]?.degree ||
          app.student?.headline ||
          undefined,
        appliedDate: new Date(app.appliedAt).toLocaleDateString(),
        appliedAt: app.appliedAt,
        status: mapHRStatus(app.status),
        resumeId: app.resumeId || app.resume?.id || undefined,
        resumeUrl: app.resume?.fileUrl || undefined,
      }));
    } catch {
      return [];
    }
  },

  /**
   * GET /api/v1/hr/interviews
   */
  async getInterviews(): Promise<Interview[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: { items: BackendInterview[] } }>("/hr/interviews");
      const items = response.data?.data?.items;
      if (Array.isArray(items)) {
        return items.map((i) => {
          const d = new Date(i.scheduledStartAt);
          const student = i.application?.student;
          const studentId = student?.id || (i.application as any)?.studentId;
          const rawAvatar =
            (i as any)?.candidateAvatar ||
            (student as any)?.avatarUrl ||
            (student as any)?.avatar ||
            (student as any)?.photoUrl;

          const avatar = rawAvatar
            ? resolveMediaUrl(rawAvatar)
            : studentId
            ? getAvatarUrl(studentId)
            : undefined;

          return {
            id: i.id,
            applicationId: i.applicationId,
            jobTitle: i.application?.job?.title || i.title,
            companyName: i.application?.job?.company?.name || "Hiring Partner",
            companyLogo: i.application?.job?.company?.logoUrl || undefined,
            candidateName: student?.fullName || (student as any)?.name || "Candidate",
            candidateEmail: (student as any)?.user?.email || (student as any)?.email || "",
            candidateCollege: (student as any)?.currentCollege || (student as any)?.educations?.[0]?.institution || "",
            candidateAvatar: avatar,
            date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            scheduledStartAt: i.scheduledStartAt,
            scheduledEndAt: i.scheduledEndAt,
            type: (i.type === "HR_DISCUSSION" ? "HR Discussion" : i.type === "MANAGERIAL" ? "Managerial" : i.type === "SCREENING" ? "Screening" : "Technical") as any,
            meetingLink: i.meetingLink || undefined,
            status: (i.status === "SCHEDULED" ? "Upcoming" : i.status === "COMPLETED" ? "Completed" : "Cancelled") as any,
            notes: i.feedback || undefined,
          };
        });
      }
      return [];
    } catch {
      return [];
    }
  },

  /**
   * PATCH /api/v1/hr/interviews/:interviewId/complete
   */
  async completeInterview(interviewId: string, feedback?: string): Promise<boolean> {
    try {
      await apiClient.patch(`/hr/interviews/${interviewId}/complete`, feedback ? { feedback } : {});
      return true;
    } catch {
      return false;
    }
  },

  /**
   * PATCH /api/v1/hr/interviews/:interviewId/cancel
   */
  async cancelInterview(interviewId: string, feedback?: string): Promise<boolean> {
    try {
      await apiClient.patch(`/hr/interviews/${interviewId}/cancel`, feedback ? { feedback } : {});
      return true;
    } catch {
      return false;
    }
  },

  /**
   * POST /api/v1/hr/applications/:applicationId/interviews
   */
  async scheduleInterview(interviewData: Partial<Interview> & { scheduledStartAt?: string; scheduledEndAt?: string }): Promise<Interview> {
    if (!interviewData.applicationId) {
      throw new Error("applicationId is required to schedule an interview.");
    }

    const backendType =
      interviewData.type === "HR Discussion" ? "HR_DISCUSSION"
      : interviewData.type === "Managerial" ? "MANAGERIAL"
      : interviewData.type === "Screening" ? "SCREENING"
      : "TECHNICAL";

    const payload = {
      title: interviewData.jobTitle || "Interview Round",
      type: backendType,
      scheduledStartAt: interviewData.scheduledStartAt || new Date(Date.now() + 86400000).toISOString(),
      scheduledEndAt: interviewData.scheduledEndAt || new Date(Date.now() + 86400000 + 3600000).toISOString(),
      meetingLink: interviewData.meetingLink,
    };

    const response = await apiClient.post(`/hr/applications/${interviewData.applicationId}/interviews`, payload);

    const inv = response.data?.data?.interview;
    if (!inv) {
      throw new Error("Failed to schedule interview — no data returned from server.");
    }

    return {
      id: inv.id,
      applicationId: inv.applicationId,
      jobTitle: inv.title,
      companyName: interviewData.companyName || "Company",
      candidateName: interviewData.candidateName || "Candidate",
      candidateEmail: interviewData.candidateEmail || "",
      candidateCollege: interviewData.candidateCollege || "",
      candidateAvatar: interviewData.candidateAvatar,
      date: new Date(inv.scheduledStartAt).toLocaleDateString(),
      time: new Date(inv.scheduledStartAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: (interviewData.type || "Technical") as any,
      status: "Upcoming",
      meetingLink: inv.meetingLink,
    };
  },

  /**
   * GET /api/v1/hr/company
   */
  async getCompanyProfile() {
    try {
      const response = await apiClient.get("/hr/company");
      if (response.data?.data?.company) {
        return response.data.data.company;
      }
    } catch {
      // Fallback
    }
    return null;
  },

  /**
   * POST /api/v1/hr/company/onboarding
   */
  async onboardCompany(payload: {
    companyName: string;
    slug?: string;
    logoUrl?: string;
    website?: string;
    industry?: string;
    companySize?: any;
    location?: string;
    about?: string;
    fullName?: string;
    designation?: string;
    phone?: string;
  }) {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: { company: any; hrProfile: any };
    }>("/hr/company/onboarding", payload);
    return response.data;
  },

  /**
   * PATCH /api/v1/hr/company
   */
  async updateCompanyProfile(payload: Record<string, any>) {
    try {
      // Map company size to enum
      const sizeStr = payload.companySize || payload.size;
      const sizeEnum = sizeStr
        ? (['SIZE_1_10', 'SIZE_11_50', 'SIZE_51_200', 'SIZE_201_500', 'SIZE_500_PLUS'].includes(sizeStr)
            ? sizeStr
            : String(sizeStr).includes('1-10') ? 'SIZE_1_10'
            : String(sizeStr).includes('10 - 20') || String(sizeStr).includes('10-20') || String(sizeStr).includes('20 - 50') || String(sizeStr).includes('11-50') ? 'SIZE_11_50'
            : String(sizeStr).includes('50 - 200') || String(sizeStr).includes('51-200') ? 'SIZE_51_200'
            : String(sizeStr).includes('200 -') || String(sizeStr).includes('201-500') ? 'SIZE_201_500'
            : 'SIZE_500_PLUS')
        : undefined;

      const sanitized: Record<string, any> = {};
      if (payload.name) sanitized.name = String(payload.name).trim();
      if (payload.slug) sanitized.slug = String(payload.slug).trim();
      if (payload.website) sanitized.website = String(payload.website).trim();
      if (payload.industry) sanitized.industry = String(payload.industry).trim();
      if (sizeEnum) sanitized.companySize = sizeEnum;
      if (payload.location) sanitized.location = String(payload.location).trim();
      if (payload.tagline !== undefined) sanitized.tagline = payload.tagline ? String(payload.tagline).trim() : null;
      if (payload.culture !== undefined) sanitized.culture = payload.culture ? String(payload.culture).trim() : null;
      if (payload.about || payload.description) sanitized.about = String(payload.about || payload.description).trim();

      // Update company
      const response = await apiClient.patch("/hr/company", sanitized);

      // If recruiter phone or designation provided, update HR profile too
      if (payload.hrPhone || payload.phone || payload.recruiterName || payload.designation) {
        try {
          const hrUpdate: Record<string, any> = {};
          if (payload.hrPhone || payload.phone) {
            hrUpdate.phone = String(payload.hrPhone || payload.phone).trim();
          }
          if (payload.designation && String(payload.designation).trim()) {
            hrUpdate.designation = String(payload.designation).trim();
          }
          if (payload.recruiterName && String(payload.recruiterName).trim().length >= 2) {
            hrUpdate.fullName = String(payload.recruiterName).trim();
          }
          if (Object.keys(hrUpdate).length > 0) {
            await apiClient.patch("/hr/me", hrUpdate);
          }
        } catch {
          // Soft fail
        }
      }

      return response.data?.data?.company;
    } catch (err) {
      throw err;
    }
  },

  async getReports() {
    try {
      const response = await apiClient.get<any>("/hr/reports");
      if (response.data?.data) {
        return response.data.data;
      }
    } catch {
      // Derive dynamically from real HR APIs
    }

    try {
      const [jobsRes, appsRes, interviewsRes] = await Promise.all([
        apiClient.get<any>("/hr/jobs").catch(() => null),
        apiClient.get<any>("/hr/applications").catch(() => null),
        apiClient.get<any>("/hr/interviews").catch(() => null),
      ]);

      const jobsData = jobsRes?.data?.data;
      const jobItems: any[] =
        (Array.isArray(jobsData?.items) ? jobsData.items : null) ??
        (Array.isArray(jobsData?.jobs) ? jobsData.jobs : null) ??
        (Array.isArray(jobsData) ? jobsData : []);

      const appsData = appsRes?.data?.data;
      const appItems: any[] =
        (Array.isArray(appsData?.items) ? appsData.items : null) ??
        (Array.isArray(appsData?.applications) ? appsData.applications : null) ??
        (Array.isArray(appsData) ? appsData : []);

      const intData = interviewsRes?.data?.data;
      const interviewItems: any[] =
        (Array.isArray(intData?.items) ? intData.items : null) ??
        (Array.isArray(intData) ? intData : []);

      const totalApplicants = appItems.length;
      const shortlisted = appItems.filter((a: any) =>
        ["SHORTLISTED", "INTERVIEW", "SELECTED", "OFFERED"].includes(a.status)
      ).length;
      const interviewsScheduled = interviewItems.length || appItems.filter((a: any) =>
        ["INTERVIEW", "SELECTED", "OFFERED"].includes(a.status)
      ).length;
      const selectedCandidates = appItems.filter((a: any) =>
        ["SELECTED", "OFFERED"].includes(a.status)
      ).length;
      const offerAcceptanceRate =
        selectedCandidates > 0 && totalApplicants > 0
          ? `${Math.round((selectedCandidates / totalApplicants) * 100)}%`
          : "0%";

      // Monthly velocity from REAL dates across 2026
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlyMap = new Map<string, { applications: number; shortlisted: number; offers: number }>();
      monthNames.forEach((m) => monthlyMap.set(m, { applications: 0, shortlisted: 0, offers: 0 }));

      appItems.forEach((a: any) => {
        if (!a.appliedAt) return;
        const d = new Date(a.appliedAt);
        const m = d.toLocaleDateString("en-US", { month: "short" });
        if (monthlyMap.has(m)) {
          const entry = monthlyMap.get(m)!;
          entry.applications++;
          if (["SHORTLISTED", "INTERVIEW", "SELECTED", "OFFERED"].includes(a.status)) {
            entry.shortlisted++;
          }
          if (["SELECTED", "OFFERED"].includes(a.status)) {
            entry.offers++;
          }
        }
      });

      const monthlyVelocity = monthNames.map((month) => ({
        month,
        ...monthlyMap.get(month)!,
      }));

      // Funnel stages with calculated percentages
      const calcPct = (cnt: number) => (totalApplicants > 0 ? Math.round((cnt / totalApplicants) * 100) : 0);
      const screeningPassed = appItems.filter((a: any) =>
        ["SCREENING", "UNDER_REVIEW", "SHORTLISTED", "INTERVIEW", "SELECTED", "OFFERED"].includes(a.status)
      ).length;

      const funnelStages = [
        { stage: "Submitted Profiles", count: totalApplicants, percentage: totalApplicants > 0 ? 100 : 0, color: "#1E5BE0" },
        { stage: "Screening Passed", count: screeningPassed, percentage: calcPct(screeningPassed), color: "#6366F1" },
        { stage: "Shortlisted for Interview", count: shortlisted, percentage: calcPct(shortlisted), color: "#FF6B00" },
        { stage: "Technical Video Rounds", count: interviewsScheduled, percentage: calcPct(interviewsScheduled), color: "#22B573" },
        { stage: "Final Offer Releases", count: selectedCandidates, percentage: calcPct(selectedCandidates), color: "#8B5CF6" },
      ];

      // College Sourcing Distribution from candidate real college
      const collegeMap = new Map<string, number>();
      const colors = ["#1E5BE0", "#FF6B00", "#22B573", "#8B5CF6", "#EC4899", "#F59E0B"];
      appItems.forEach((a: any) => {
        const clg =
          a.student?.currentCollege ||
          a.student?.educations?.[0]?.institution ||
          a.student?.educations?.[0]?.institutionName ||
          "Other College";
        collegeMap.set(clg, (collegeMap.get(clg) || 0) + 1);
      });

      const collegeSourceDistribution = Array.from(collegeMap.entries()).map(([college, candidates], idx) => ({
        college,
        candidates,
        color: colors[idx % colors.length],
      }));

      return {
        jobsPosted: jobItems.length,
        totalApplicants,
        shortlisted,
        interviewsScheduled,
        selectedCandidates,
        offerAcceptanceRate,
        monthlyVelocity,
        funnelStages,
        collegeSourceDistribution,
      };
    } catch {
      return {
        jobsPosted: 0,
        totalApplicants: 0,
        shortlisted: 0,
        interviewsScheduled: 0,
        selectedCandidates: 0,
        offerAcceptanceRate: "0%",
        monthlyVelocity: [
          { month: "May", applications: 0, shortlisted: 0, offers: 0 },
          { month: "Jun", applications: 0, shortlisted: 0, offers: 0 },
          { month: "Jul", applications: 0, shortlisted: 0, offers: 0 },
          { month: "Aug", applications: 0, shortlisted: 0, offers: 0 },
          { month: "Sep", applications: 0, shortlisted: 0, offers: 0 },
          { month: "Oct", applications: 0, shortlisted: 0, offers: 0 },
        ],
        funnelStages: [],
        collegeSourceDistribution: [],
      };
    }
  },

  // ===================== COMPANY LOGO (Cloudflare R2) =====================
  /**
   * POST /api/v1/hr/company/logo
   * Body: FormData with key 'file' (JPEG, PNG, WebP, SVG | Max: 2MB)
   */
  async uploadCompanyLogo(file: File): Promise<{ logoUrl: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: { logoUrl: string };
    }>("/hr/company/logo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  /**
   * GET /api/v1/hr/company/logo
   */
  async getCompanyLogoUrl(): Promise<{ downloadUrl: string; expiresIn: number }> {
    const response = await apiClient.get<{
      success: boolean;
      data: { downloadUrl: string; expiresIn: number };
    }>("/hr/company/logo");
    return response.data.data;
  },

  /**
   * DELETE /api/v1/hr/company/logo
   */
  async deleteCompanyLogo(): Promise<boolean> {
    await apiClient.delete("/hr/company/logo");
    return true;
  },

  // ===================== HR PERSONAL AVATAR (Cloudflare R2) =====================
  /**
   * POST /api/v1/hr/avatar
   * Body: FormData with key 'file' (JPEG, PNG, WebP | Max: 5MB)
   */
  async uploadAvatar(file: File): Promise<{ avatarUrl: string; avatar?: string; fileName?: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: { avatarUrl: string; avatar?: string; fileName?: string };
    }>("/hr/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const resData = response.data?.data;
    const finalUrl = resData?.avatarUrl || resData?.avatar;

    if (typeof window !== "undefined" && finalUrl) {
      try {
        const userStr = localStorage.getItem("auth_user") || localStorage.getItem("wegrow_auth_user");
        if (userStr) {
          const userObj = JSON.parse(userStr);
          if (userObj) {
            userObj.avatarUrl = finalUrl;
            userObj.avatar = finalUrl;
            userObj.photoUrl = finalUrl;
            if (userObj.hrProfile) {
              userObj.hrProfile.avatarUrl = finalUrl;
              userObj.hrProfile.avatar = finalUrl;
              userObj.hrProfile.photoUrl = finalUrl;
            }
            localStorage.setItem("auth_user", JSON.stringify(userObj));
            localStorage.setItem("wegrow_auth_user", JSON.stringify(userObj));
          }
        }
        localStorage.setItem("wegrow_hr_avatar", finalUrl);
      } catch (err) {
        console.warn("[uploadHRAvatar] Failed to update localStorage user:", err);
      }
    }

    return resData;
  },

  /**
   * DELETE /api/v1/hr/avatar
   */
  async deleteAvatar(): Promise<boolean> {
    await apiClient.delete("/hr/avatar");
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("wegrow_hr_avatar");
      } catch {}
    }
    return true;
  },

  // ===================== CANDIDATE RESUME DOWNLOAD (Cloudflare R2) =====================
  /**
   * GET /api/v1/hr/resumes/:resumeId/download
   */
  async getCandidateResumeDownloadUrl(resumeId: string): Promise<{
    downloadUrl: string;
    expiresIn: number;
    fileName: string;
  }> {
    const response = await apiClient.get<{
      success: boolean;
      data: {
        downloadUrl: string;
        expiresIn: number;
        fileName: string;
      };
    }>(`/hr/resumes/${resumeId}/download`);
    return response.data.data;
  },
};

export default hrService;
