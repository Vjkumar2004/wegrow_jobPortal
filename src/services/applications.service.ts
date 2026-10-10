import apiClient from "./api";
import { Application, ApplicationStatus } from "@/types";
import { BackendStudentApplication } from "@/types/api";
import { getCompanyLogoUrl } from "@/lib/utils";

function mapBackendStatusToFrontend(status: string): ApplicationStatus {
  switch (status) {
    case "APPLIED":
      return "Applied";
    case "SCREENING":
    case "UNDER_REVIEW":
      return "Under Review";
    case "SHORTLISTED":
      return "Shortlisted";
    case "INTERVIEW":
      return "Interview";
    case "OFFERED":
    case "SELECTED":
      return "Selected";
    case "REJECTED":
    case "WITHDRAWN":
      return "Rejected";
    default:
      return "Applied";
  }
}

export const applicationsService = {
  /**
   * GET /api/v1/students/me/applications
   */
  async getStudentApplications(): Promise<Application[]> {
    try {
      const response = await apiClient.get<any>("/students/me/applications");
      const rData = response?.data?.data;
      const items: BackendStudentApplication[] =
        (Array.isArray(rData?.items) ? rData.items : null) ??
        (Array.isArray(rData?.applications) ? rData.applications : null) ??
        (Array.isArray(rData) ? rData : []);
      if (items.length > 0) {
        return items.map((app) => ({
          id: app.id,
          jobId: app.jobId || app.job?.id || "",
          jobTitle: app.job?.title || "Role",
          companyName: app.job?.company?.name || "Company",
          companyLogo: getCompanyLogoUrl(app.job?.company, app.job?.company?.id) || undefined,
          applicantId: app.studentId,
          applicantName: "Student",
          applicantEmail: "",
          appliedDate: new Date(app.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          status: mapBackendStatusToFrontend(app.status),
          resumeUrl: app.resume?.fileUrl,
        }));
      }
      return [];
    } catch {
      return [];
    }
  },

  /**
   * POST /api/v1/jobs/:jobId/apply
   */
  async applyToJob(
    jobId: string,
    payload?: {
      resumeId?: string;
      coverLetter?: string;
      coverNote?: string;
      fullName?: string;
      email?: string;
      phone?: string;
    }
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      let activeResumeId = payload?.resumeId;

      // If no resumeId provided, look up the student's active resume
      if (!activeResumeId) {
        try {
          const resumesRes = await apiClient.get<{ success: boolean; data: { resumes?: Array<{ id: string }> } }>("/students/me/resumes");
          const userResumes = resumesRes.data?.data?.resumes;
          if (Array.isArray(userResumes) && userResumes.length > 0) {
            activeResumeId = userResumes[0].id;
          }
        } catch {
          // Continue
        }
      }

      if (!activeResumeId) {
        return {
          success: false,
          message: "Please upload your resume in your profile before applying for jobs.",
        };
      }

      const response = await apiClient.post(`/jobs/${jobId}/apply`, {
        resumeId: activeResumeId,
        coverLetter: payload?.coverLetter || payload?.coverNote || "Application submitted via WeGrow Student Campus Portal.",
      });
      return {
        success: true,
        message: response.data?.message || "Application submitted successfully!",
        data: response.data?.data,
      };
    } catch (err: unknown) {
      const msg = typeof err === "object" && err !== null && "response" in err
        ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to submit application.")
        : "Failed to submit application.";
      return { success: false, message: msg };
    }
  },

  /**
   * PATCH /api/v1/students/me/applications/:applicationId/withdraw
   */
  async withdrawApplication(applicationId: string): Promise<boolean> {
    try {
      await apiClient.patch(`/students/me/applications/${applicationId}/withdraw`);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * PATCH /api/v1/hr/applications/:applicationId/status
   */
  async updateApplicationStatus(applicationId: string, status: string, note?: string): Promise<boolean> {
    const statusUpper = status.toUpperCase().replace(" ", "_");
    await apiClient.patch(`/hr/applications/${applicationId}/status`, { status: statusUpper, note });
    return true;
  },

  /**
   * Student Application Tracker Page Data
   * Accepts an optional pre-fetched student profile to skip a duplicate GET /students/me.
   */
  async getStudentApplicationsPageData(cachedProfile?: import("@/types").StudentProfile): Promise<import("@/types").StudentApplicationsPageData> {
    const empty = {
      stats: { totalApplied: 0, underReview: 0, shortlisted: 0, interviews: 0, selected: 0, rejected: 0 },
      monthlyStats: [] as Array<{ month: string; value: number }>,
      applications: [] as import("@/types").StudentApplicationTrackerItem[],
      topCompaniesApplied: [] as Array<{ id: string; name: string; countText: string; companyLogo?: string; initials?: string; logoColor?: string }>,
      profileCompletion: { percentage: 0, checklist: [] as Array<{ label: string; done: boolean }> },
    };

    try {
      const [appsResult, profileResult] = await Promise.allSettled([
        apiClient.get<any>("/students/me/applications"),
        cachedProfile ? Promise.resolve(null) : apiClient.get<any>("/students/me"),
      ]);

      const res = appsResult.status === "fulfilled" ? appsResult.value : null;
      const resData = res?.data?.data;
      const rawItems: BackendStudentApplication[] =
        (Array.isArray(resData?.items) ? resData.items : null) ??
        (Array.isArray(resData?.applications) ? resData.applications : null) ??
        (Array.isArray(resData) ? resData : []);

      let profileCompletion: { percentage: number; checklist: Array<{ label: string; done: boolean }> } =
        { percentage: 0, checklist: [] };

      if (cachedProfile) {
        // Build completion from cached frontend profile
        const checklist = [
          { label: "Personal Information", done: Boolean(cachedProfile.name || cachedProfile.phone) },
          { label: "Education Details", done: Boolean(cachedProfile.education?.length) },
          { label: "Add Skills", done: Boolean(cachedProfile.skills?.length) },
          { label: "Upload Resume", done: Boolean(cachedProfile.resumeId) },
          { label: "Add Projects", done: Boolean(cachedProfile.projects?.length) },
        ];
        const doneCount = checklist.filter((c) => c.done).length;
        profileCompletion = { percentage: Math.round((doneCount / checklist.length) * 100), checklist };
      } else if (profileResult.status === "fulfilled" && profileResult.value) {
        const d = profileResult.value?.data?.data;
        const stu = d?.profile || d?.student || d;
        if (stu) {
          const rawEdus = stu.educations || stu.education || [];
          const rawSkills = stu.studentSkills || stu.skills || [];
          const rawProjs = stu.projects || [];
          const rawResumes = stu.resumes || (stu.resume ? [stu.resume] : []);
          const checklist = [
            { label: "Personal Information", done: Boolean(stu.fullName || stu.phone) },
            { label: "Education Details", done: Boolean(rawEdus.length > 0) },
            { label: "Add Skills", done: Boolean(rawSkills.length > 0) },
            { label: "Upload Resume", done: Boolean(rawResumes.length > 0) },
            { label: "Add Projects", done: Boolean(rawProjs.length > 0) },
          ];
          const doneCount = checklist.filter((c) => c.done).length;
          profileCompletion = { percentage: Math.round((doneCount / checklist.length) * 100), checklist };
        }
      }

      if (rawItems.length === 0) return { ...empty, profileCompletion };

      const mapStatus = (st: string): import("@/types").ApplicationStatus => mapBackendStatusToFrontend(st);
      const mapJobType = (t: string) =>
        t === "FULL_TIME" ? "Full Time" : t === "PART_TIME" ? "Part Time" : t === "INTERNSHIP" ? "Internship" : t === "CONTRACT" ? "Contract" : "Full Time";

      const trackerItems: import("@/types").StudentApplicationTrackerItem[] = rawItems.map((app) => {
        const status = mapStatus(app.status);
        const s = status;
        const comp = app.job?.company;
        const compId = comp?.id || (app.job as any)?.companyId;
        const logo = getCompanyLogoUrl(comp, compId) || undefined;

        return {
          id: app.id,
          jobId: app.jobId || app.job?.id || "",
          companyId: compId || "",
          title: app.job?.title || "Role",
          companyName: comp?.name || "Company",
          companyLogo: logo,
          companyInitials: (comp?.name || "Co").slice(0, 3).toUpperCase(),
          companyLogoBg: "bg-blue-50 text-[#1E5BE0]",
          appliedDateText: new Date(app.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          location: app.job?.location || "—",
          jobType: mapJobType(app.job?.employmentType || ""),
          experience: app.job?.minExperience === 0 ? "Fresher" : app.job?.minExperience != null ? `${app.job.minExperience}+ Years` : "Fresher",
          status,
          statusUpdateText: `Status: ${s}`,
          steps: [
            { name: "Applied", status: "done" as const },
            {
              name: "Under Review",
              status: (["Shortlisted", "Interview", "Selected", "Rejected"].includes(s) ? "done" : s === "Under Review" ? "current" : "upcoming") as "done" | "current" | "upcoming",
            },
            {
              name: "Shortlisted",
              status: (["Interview", "Selected"].includes(s) ? "done" : s === "Shortlisted" ? "current" : "upcoming") as "done" | "current" | "upcoming",
            },
            {
              name: "Interview",
              status: (s === "Selected" ? "done" : s === "Interview" ? "current" : "upcoming") as "done" | "current" | "upcoming",
            },
            {
              name: "Selected",
              status: (s === "Selected" ? "done" : "upcoming") as "done" | "current" | "upcoming",
            },
          ],
        };
      });

      const underReview = trackerItems.filter((a) => a.status === "Under Review").length;
      const shortlisted = trackerItems.filter((a) => a.status === "Shortlisted").length;
      const interviews = trackerItems.filter((a) => a.status === "Interview").length;
      const selected = trackerItems.filter((a) => a.status === "Selected").length;
      const rejected = trackerItems.filter((a) => a.status === "Rejected").length;

      // Group by company — preserve logo
      const companyCountMap = new Map<string, { count: number; initials: string; logo?: string }>();
      trackerItems.forEach((a) => {
        const existing = companyCountMap.get(a.companyName);
        if (existing) {
          existing.count += 1;
          if (!existing.logo && a.companyLogo) existing.logo = a.companyLogo;
        } else {
          companyCountMap.set(a.companyName, { count: 1, initials: (a.companyName || "Co").slice(0, 3).toUpperCase(), logo: a.companyLogo });
        }
      });

      const topCompaniesApplied = Array.from(companyCountMap.entries()).map(([name, data], idx) => ({
        id: `tc-${idx + 1}`,
        name,
        countText: `${data.count} Application${data.count > 1 ? "s" : ""}`,
        initials: data.initials,
        companyLogo: data.logo,
        logoColor: "bg-blue-50 text-[#1E5BE0]",
      }));

      // Monthly stats — last 6 calendar months
      const now = new Date();
      const monthlyStats = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        const label = d.toLocaleString("en-US", { month: "short" });
        const value = rawItems.filter((app) => {
          const ap = new Date(app.appliedAt);
          return ap.getFullYear() === d.getFullYear() && ap.getMonth() === d.getMonth();
        }).length;
        return { month: label, value };
      });

      return {
        stats: { totalApplied: rawItems.length, underReview, shortlisted, interviews, selected, rejected },
        monthlyStats,
        applications: trackerItems,
        topCompaniesApplied,
        profileCompletion,
      };
    } catch {
      return empty;
    }
  },
};

export default applicationsService;
