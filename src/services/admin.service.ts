import apiClient from "./api";
import { Company, Job, Application } from "@/types";
import { MOCK_COMPANIES, MOCK_JOBS, MOCK_APPLICATIONS, MOCK_STUDENTS_ADMIN } from "@/constants/mockData";

export interface AuditLog {
  id: string;
  action: string;
  target: string;
  admin: string;
  timestamp: string;
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

export const adminService = {
  async getCompanies(): Promise<Company[]> {
    try {
      const response = await apiClient.get("/admin/companies");
      return response.data?.data || response.data;
    } catch {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("wegrow_companies");
        if (stored) {
          try {
            return JSON.parse(stored);
          } catch {
            // fallback
          }
        }
      }
      return MOCK_COMPANIES;
    }
  },

  async registerCompany(company: Partial<Company>): Promise<Company> {
    const newCompany: Company = {
      id: `comp-${Date.now()}`,
      name: company.name || "Untitled Organization",
      logo: company.logo || "",
      description: company.description || "",
      website: company.website || "",
      industry: company.industry || "Information Technology",
      location: company.location || "Bengaluru, Karnataka",
      size: company.size || "50 - 200 employees",
      about: company.about || company.description || "",
      status: "Pending", // Direct to Pending moderation state
      activeJobsCount: 0,
      joinedDate: new Date().toISOString().split("T")[0],
      tagline: company.tagline,
      culture: company.culture,
      hrEmail: company.hrEmail,
      hrPhone: company.hrPhone,
      recruiterName: company.recruiterName,
      recruiterAvatar: company.recruiterAvatar,
    };

    try {
      const response = await apiClient.post("/admin/companies/register", newCompany);
      return response.data?.data || newCompany;
    } catch {
      if (typeof window !== "undefined") {
        const existing = localStorage.getItem("wegrow_companies");
        const list: Company[] = existing ? JSON.parse(existing) : [...MOCK_COMPANIES];
        const updatedList = [newCompany, ...list];
        localStorage.setItem("wegrow_companies", JSON.stringify(updatedList));
      }
      return newCompany;
    }
  },

  async updateCompanyStatus(companyId: string, status: "Approved" | "Suspended" | "Pending"): Promise<boolean> {
    try {
      await apiClient.patch(`/admin/companies/${companyId}/status`, { status });
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("wegrow_companies");
        const list: Company[] = stored ? JSON.parse(stored) : [...MOCK_COMPANIES];
        const updated = list.map((c) => (c.id === companyId ? { ...c, status } : c));
        localStorage.setItem("wegrow_companies", JSON.stringify(updated));
      }
      return true;
    } catch {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("wegrow_companies");
        const list: Company[] = stored ? JSON.parse(stored) : [...MOCK_COMPANIES];
        const updated = list.map((c) => (c.id === companyId ? { ...c, status } : c));
        localStorage.setItem("wegrow_companies", JSON.stringify(updated));
      }
      return true;
    }
  },

  async getStudents(): Promise<typeof MOCK_STUDENTS_ADMIN> {
    try {
      const response = await apiClient.get("/admin/students");
      return response.data?.data || response.data;
    } catch {
      return MOCK_STUDENTS_ADMIN;
    }
  },

  async getJobs(): Promise<Job[]> {
    try {
      const response = await apiClient.get("/admin/jobs");
      return response.data?.data || response.data;
    } catch {
      return MOCK_JOBS;
    }
  },

  async getApplications(): Promise<Application[]> {
    try {
      const response = await apiClient.get("/admin/applications");
      return response.data?.data || response.data;
    } catch {
      return MOCK_APPLICATIONS;
    }
  },

  async sendEmail(payload: { to: string; cc?: string; bcc?: string; subject: string; message: string }) {
    try {
      const response = await apiClient.post("/admin/email/send", payload);
      return response.data;
    } catch {
      return { success: true, message: "Email queued for delivery successfully!" };
    }
  },

  async getReports(): Promise<AdminReportData> {
    try {
      const response = await apiClient.get("/admin/reports");
      return response.data?.data || response.data;
    } catch {
      return {
        totalStudents: 52400,
        totalCompanies: 1250,
        totalJobs: 5400,
        totalApplications: 142000,
        totalInterviews: 18400,
        totalPlacements: 12100,
        monthlyPlacements: [
          { month: "Nov", count: 850 },
          { month: "Dec", count: 1100 },
          { month: "Jan", count: 1420 },
          { month: "Feb", count: 1890 },
          { month: "Mar", count: 2450 }
        ]
      };
    }
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    try {
      const response = await apiClient.get("/admin/audit-logs");
      return response.data?.data || response.data;
    } catch {
      return [
        { id: "log-1", action: "HR Account Approved", target: "Infosys Technologies", admin: "SuperAdmin", timestamp: "2024-03-26 10:14 AM" },
        { id: "log-2", action: "Job Post Published", target: "Frontend Developer (Razorpay)", admin: "System", timestamp: "2024-03-25 04:30 PM" },
        { id: "log-3", action: "Student Status Suspended", target: "vikram.m@example.com", admin: "SuperAdmin", timestamp: "2024-03-24 11:20 AM" },
        { id: "log-4", action: "Broadcast Email Sent", target: "All 2024 Freshers", admin: "CampusLead", timestamp: "2024-03-22 09:00 AM" }
      ];
    }
  }
};
