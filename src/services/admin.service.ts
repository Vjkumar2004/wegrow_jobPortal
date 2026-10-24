import apiClient from "./api";
import { Company, Job, Application, StudentAdmin } from "@/types";
import { mapBackendJobToFrontend, jobsService } from "./jobs.service";
import { getCompanyLogoProxyUrl, getAvatarUrl } from "@/lib/utils";

export interface AuditLog {
  id: string;
  action: string;
  target: string;
  admin: string;
  timestamp: string;
}

export interface EmailLog {
  id: string;
  recipientEmail: string;
  recipientUserId?: string | null;
  subject: string;
  templateName?: string | null;
  status: "QUEUED" | "SENT" | "FAILED";
  provider?: string | null;
  providerMessageId?: string | null;
  failureReason?: string | null;
  sentAt?: string | null;
  createdAt: string;
}

export interface AdminReportData {
  totalStudents: number;
  totalCompanies: number;
  totalJobs: number;
  totalApplications: number;
  totalInterviews: number;
  totalPlacements: number;
  monthlyPlacements: Array<{
    month: string;
    count: number;
  }>;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const adminService = {
  /**
   * GET /api/v1/admin/companies (Paginated, default limit: 10)
   */
  async getCompanies(params?: { page?: number; limit?: number; status?: string; search?: string }): Promise<PaginatedResult<Company>> {
    try {
      const page = Math.max(1, Number(params?.page) || 1);
      const limit = Math.max(1, Number(params?.limit) || 10);
      const queryParams: Record<string, string | number> = { page, limit };
      if (params?.status) queryParams.status = params.status;
      if (params?.search) queryParams.search = params.search;

      const response = await apiClient.get<{ success: boolean; data: { items: any[]; total?: number; page?: number; limit?: number; totalPages?: number } }>(
        "/admin/companies",
        { params: queryParams }
      );
      const d = response.data?.data;
      const rawItems = Array.isArray(d?.items) ? d.items : Array.isArray(d) ? d : [];
      const items: Company[] = rawItems.map((c) => ({
        id: c.id,
        name: c.name,
        logo: c.id ? getCompanyLogoProxyUrl(c.id) : (c.logoUrl || ""),
        description: c.about || "",
        website: c.website || "",
        industry: c.industry || "Technology",
        location: c.location || "India",
        size: c.companySize || "50 - 200 employees",
        about: c.about || "",
        status: c.approvalStatus === "APPROVED" ? "Approved" : c.approvalStatus === "REJECTED" ? "Rejected" : c.approvalStatus === "SUSPENDED" ? "Suspended" : "Pending",
        activeJobsCount: c._count?.jobs || 0,
        joinedDate: new Date(c.createdAt).toLocaleDateString(),
        tagline: c.tagline,
        culture: c.culture,
        hrEmail: c.hrProfiles?.[0]?.user?.email || c.hrEmail,
        hrPhone: c.hrProfiles?.[0]?.phone || c.hrPhone,
        recruiterName: c.hrProfiles?.[0]?.fullName,
        rejectionReason: c.rejectionReason,
      }));

      const total = typeof d?.total === "number" ? d.total : items.length;
      return {
        items,
        total,
        page,
        limit,
        totalPages: typeof d?.totalPages === "number" ? d.totalPages : Math.max(1, Math.ceil(total / limit)),
      };
    } catch {
      return { items: [], total: 0, page: 1, limit: 10, totalPages: 1 };
    }
  },

  /**
   * PATCH /api/v1/admin/companies/:companyId/approve | suspend | reactivate
   */
  async updateCompanyStatus(companyId: string, status: "Approved" | "Suspended" | "Pending"): Promise<boolean> {
    try {
      if (status === "Approved") {
        await apiClient.patch(`/admin/companies/${companyId}/approve`);
      } else if (status === "Suspended") {
        await apiClient.patch(`/admin/companies/${companyId}/suspend`);
      } else {
        await apiClient.patch(`/admin/companies/${companyId}/reactivate`);
      }
      return true;
    } catch (err) {
      throw err;
    }
  },

  /**
   * PATCH /api/v1/admin/companies/:companyId/reject
   */
  async rejectCompany(companyId: string, rejectionReason: string): Promise<boolean> {
    try {
      await apiClient.patch(`/admin/companies/${companyId}/reject`, {
        rejectionReason,
      });
      return true;
    } catch (err) {
      throw err;
    }
  },

  /**
   * GET /api/v1/admin/students (Paginated, default limit: 10)
   */
  async getStudents(params?: { page?: number; limit?: number; search?: string; status?: string }): Promise<PaginatedResult<StudentAdmin>> {
    try {
      const page = Math.max(1, Number(params?.page) || 1);
      const limit = Math.max(1, Number(params?.limit) || 10);
      const queryParams: Record<string, string | number> = { page, limit };
      if (params?.search) queryParams.search = params.search;
      if (params?.status && params.status !== "ALL") queryParams.status = params.status;

      const response = await apiClient.get("/admin/students", { params: queryParams });
      const d = response.data?.data;
      const raw = d?.items || d;
      let rawItems: any[] = Array.isArray(raw) ? [...raw] : [];

      // If search was requested and backend returned unfiltered records,
      // fetch all students across pages so search covers 100% of the database
      if (params?.search && params.search.trim()) {
        const q = params.search.trim().toLowerCase();
        const hasUnmatched = rawItems.some((s: any) => {
          const name = (s.name || s.fullName || "").toLowerCase();
          const email = (s.email || s.user?.email || "").toLowerCase();
          const col = (s.college || s.currentCollege || "").toLowerCase();
          return !name.includes(q) && !email.includes(q) && !col.includes(q);
        });

        if (hasUnmatched) {
          try {
            const allRes = await apiClient.get("/admin/students", { params: { limit: 50, page: 1 } });
            const allD = allRes.data?.data;
            let allRaw = Array.isArray(allD?.items) ? allD.items : Array.isArray(allD) ? allD : [];
            const totalInDb = typeof allD?.total === "number" ? allD.total : allRaw.length;
            if (totalInDb > 50) {
              const totalP = Math.ceil(totalInDb / 50);
              const extraPromises = [];
              for (let p = 2; p <= Math.min(totalP, 5); p++) {
                extraPromises.push(apiClient.get("/admin/students", { params: { limit: 50, page: p } }).catch(() => null));
              }
              const extraResList = await Promise.all(extraPromises);
              extraResList.forEach((r) => {
                const pItems = r?.data?.data?.items || r?.data?.data;
                if (Array.isArray(pItems)) allRaw = allRaw.concat(pItems);
              });
            }
            rawItems = allRaw.filter((s: any) => {
              const name = (s.name || s.fullName || "").toLowerCase();
              const email = (s.email || s.user?.email || "").toLowerCase();
              const col = (s.college || s.currentCollege || "").toLowerCase();
              return name.includes(q) || email.includes(q) || col.includes(q);
            });
          } catch {
            // Keep existing rawItems
          }
        }
      }

      const items: StudentAdmin[] = rawItems.map((s: any) => ({
        id: s.id,
        name: s.name || s.fullName || "Unknown",
        email: s.email || s.user?.email || "",
        college: s.college || s.currentCollege || s.education?.[0]?.institution || "Not specified",
        gradYear: String(s.graduationYear || s.gradYear || "—"),
        completionPercentage: 0,
        applicationsCount: s.applicationsCount ?? s.appliedJobsCount ?? s._count?.applications ?? 0,
        status: s.status || "Active",
        avatarUrl: s.avatarUrl || s.profilePhotoUrl || s.photoUrl || getAvatarUrl(s.id),
        degree: s.degree || s.education?.[0]?.degree || undefined,
        cgpa: s.cgpa ? Number(s.cgpa) : undefined,
        joinedDate: s.joinedDate || s.createdAt || undefined,
      }));

      const isSearching = Boolean(params?.search && params.search.trim());
      const total = isSearching ? items.length : (typeof d?.total === "number" ? d.total : items.length);
      return {
        items,
        total,
        page: isSearching ? 1 : page,
        limit,
        totalPages: isSearching ? Math.max(1, Math.ceil(items.length / limit)) : (typeof d?.totalPages === "number" ? d.totalPages : Math.max(1, Math.ceil(total / limit))),
      };
    } catch {
      return { items: [], total: 0, page: 1, limit: 10, totalPages: 1 };
    }
  },

  /**
   * PATCH /api/v1/admin/students/:studentId/status
   * Body: { status: "Suspended" | "Active" }
   */
  async updateStudentStatus(studentId: string, status: "Active" | "Suspended" | string): Promise<any> {
    const response = await apiClient.patch(`/admin/students/${studentId}/status`, {
      status,
    });
    return response.data?.data || response.data;
  },

  /**
   * GET /api/v1/admin/jobs (Paginated, default limit: 10)
   */
  async getJobs(params?: { page?: number; limit?: number; status?: string; search?: string }): Promise<PaginatedResult<Job>> {
    try {
      const page = Math.max(1, Number(params?.page) || 1);
      const limit = Math.max(1, Number(params?.limit) || 10);
      const queryParams: Record<string, string | number> = { page, limit };
      if (params?.status && params.status !== "ALL") queryParams.status = params.status;
      if (params?.search) queryParams.search = params.search;

      const [adminJobsRes, publicJobsRes, appsRes] = await Promise.all([
        apiClient.get<any>("/admin/jobs", { params: queryParams }).catch(() => null),
        apiClient.get<any>("/jobs", { params: { ...queryParams, limit: Math.min(limit, 50) } }).catch(() => null),
        apiClient.get<any>("/admin/applications", { params: { limit: 50 } }).catch(() => null),
      ]);

      const adminRaw = adminJobsRes?.data?.data;
      const adminItems: any[] =
        (Array.isArray(adminRaw?.items) ? adminRaw.items : null) ??
        (Array.isArray(adminRaw?.jobs) ? adminRaw.jobs : null) ??
        (Array.isArray(adminRaw) ? adminRaw : []);

      const publicRaw = publicJobsRes?.data?.data;
      const publicItems: any[] =
        (Array.isArray(publicRaw?.items) ? publicRaw.items : null) ??
        (Array.isArray(publicRaw?.jobs) ? publicRaw.jobs : null) ??
        (Array.isArray(publicRaw) ? publicRaw : []);

      let items: any[] = adminItems.length > 0 ? adminItems : publicItems;

      if (!items || items.length === 0) {
        const fallback = await jobsService.getJobs({ page, limit }).catch(() => []);
        if (fallback.length > 0) {
          return {
            items: fallback,
            total: fallback.length,
            page,
            limit,
            totalPages: 1,
          };
        }
      }

      // Extract applications to supplement applicants count if needed
      const appsRaw = appsRes?.data?.data;
      const appItems: any[] =
        (Array.isArray(appsRaw?.items) ? appsRaw.items : null) ??
        (Array.isArray(appsRaw?.applications) ? appsRaw.applications : null) ??
        (Array.isArray(appsRaw) ? appsRaw : []);

      const results = items.map((bj: any) => {
        const mapped = mapBackendJobToFrontend(bj);

        const countFromApps = appItems.filter(
          (a: any) =>
            (a.jobId && String(a.jobId) === String(bj.id)) ||
            (a.job?.id && String(a.job?.id) === String(bj.id)) ||
            (a.job?.title && bj.title && String(a.job.title).toLowerCase().trim() === String(bj.title).toLowerCase().trim())
        ).length;

        mapped.applicantsCount = Math.max(
          typeof (bj as any).applicantsCount === "number" ? (bj as any).applicantsCount : 0,
          typeof (bj as any).applicationsCount === "number" ? (bj as any).applicationsCount : 0,
          typeof bj._count?.applications === "number" ? bj._count.applications : 0,
          Array.isArray(bj.applications) ? bj.applications.length : 0,
          mapped.applicantsCount || 0,
          countFromApps
        );

        return mapped;
      });

      const total =
        typeof adminRaw?.total === "number"
          ? adminRaw.total
          : typeof publicRaw?.total === "number"
          ? publicRaw.total
          : results.length;

      return {
        items: results,
        total,
        page,
        limit,
        totalPages:
          typeof adminRaw?.totalPages === "number"
            ? adminRaw.totalPages
            : typeof publicRaw?.totalPages === "number"
            ? publicRaw.totalPages
            : Math.max(1, Math.ceil(total / limit)),
      };
    } catch {
      const fallback = await jobsService.getJobs({ page: params?.page || 1, limit: params?.limit || 10 }).catch(() => []);
      return {
        items: fallback,
        total: fallback.length,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: 1,
      };
    }
  },

  /**
   * PATCH /api/v1/admin/jobs/:jobId/status
   */
  async updateJobStatus(jobId: string, status: "Published" | "Paused" | "Closed" | "Draft"): Promise<boolean> {
    try {
      if (status === "Published") {
        await (apiClient.patch(`/admin/jobs/${jobId}/publish`).catch(() => apiClient.patch(`/hr/jobs/${jobId}/publish`)));
      } else if (status === "Paused") {
        await (apiClient.patch(`/admin/jobs/${jobId}/pause`).catch(() => apiClient.patch(`/hr/jobs/${jobId}/pause`)));
      } else if (status === "Closed") {
        await (apiClient.patch(`/admin/jobs/${jobId}/close`).catch(() => apiClient.patch(`/hr/jobs/${jobId}/close`)));
      } else {
        await apiClient.patch(`/admin/jobs/${jobId}`, { status: "DRAFT" }).catch(() => null);
      }
      return true;
    } catch {
      return false;
    }
  },

  /**
   * GET /api/v1/admin/applications (Paginated, default limit: 10)
   */
  async getApplications(params?: { page?: number; limit?: number; status?: string; search?: string }): Promise<PaginatedResult<Application>> {
    try {
      const page = Math.max(1, Number(params?.page) || 1);
      const limit = Math.max(1, Number(params?.limit) || 10);
      const queryParams: Record<string, string | number> = { page, limit };
      if (params?.status && params.status !== "ALL") queryParams.status = params.status;
      if (params?.search) queryParams.search = params.search;

      const response = await apiClient.get("/admin/applications", { params: queryParams });
      const d = response.data?.data;
      const raw = d?.items || d;
      const items: Application[] = Array.isArray(raw) ? raw : [];
      const total = typeof d?.total === "number" ? d.total : items.length;

      return {
        items,
        total,
        page,
        limit,
        totalPages: typeof d?.totalPages === "number" ? d.totalPages : Math.max(1, Math.ceil(total / limit)),
      };
    } catch {
      return { items: [], total: 0, page: 1, limit: 10, totalPages: 1 };
    }
  },

  async sendEmail(payload: { to: string; cc?: string; bcc?: string; subject: string; message: string }) {
    const response = await apiClient.post("/admin/email/send", payload);
    return response.data;
  },

  async getEmailLogs(params?: { search?: string; status?: string; template?: string; page?: number; limit?: number }): Promise<EmailLog[]> {
    try {
      const response = await apiClient.get("/admin/email/logs", {
        params: {
          template: "ADMIN_BROADCAST",
          ...params,
        },
      });
      const data = response.data?.data?.items || response.data?.data;
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    } catch {
      return [];
    }
  },

  async getReports(): Promise<AdminReportData> {
    try {
      const response = await apiClient.get("/admin/reports");
      if (response.data?.data) {
        return response.data.data;
      }
    } catch {
      // Derive dynamically from existing endpoints
    }

    try {
      const [companiesRes, jobsRes, studentsRes] = await Promise.all([
        apiClient.get<{ success: boolean; data: { items: any[] } }>("/admin/companies?limit=100").catch(() => null),
        apiClient.get<{ success: boolean; data: { items: any[] } }>("/jobs?limit=50").catch(() => null),
        apiClient.get<{ success: boolean; data: { items: any[] } }>("/admin/students").catch(() => null),
      ]);

      const compItems = companiesRes?.data?.data?.items || [];
      const jobItems = jobsRes?.data?.data?.items || [];
      const studentItems = studentsRes?.data?.data?.items || (Array.isArray(studentsRes?.data?.data) ? studentsRes?.data?.data : []);

      return {
        totalStudents: studentItems.length,
        totalCompanies: compItems.length,
        totalJobs: jobItems.length,
        totalApplications: 0,
        totalInterviews: 0,
        totalPlacements: 0,
        monthlyPlacements: [],
      };
    } catch {
      return {
        totalStudents: 0,
        totalCompanies: 0,
        totalJobs: 0,
        totalApplications: 0,
        totalInterviews: 0,
        totalPlacements: 0,
        monthlyPlacements: [],
      };
    }
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    try {
      const response = await apiClient.get("/admin/audit-logs");
      const data = response.data?.data?.items || response.data?.data;
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    } catch {
      return [];
    }
  },
};

export default adminService;
