export function formatCompanySize(size?: string): string | undefined {
  if (!size) return undefined;
  const map: Record<string, string> = {
    SIZE_1_10: "1-10 Employees",
    SIZE_11_50: "11-50 Employees",
    SIZE_51_200: "51-200 Employees",
    SIZE_201_500: "201-500 Employees",
    SIZE_501_1000: "501-1,000 Employees",
    SIZE_1000_PLUS: "1,000+ Employees",
  };
  return map[size] || size.replace("SIZE_", "").replace("_", "-") + " Employees";
}

import apiClient from "./api";
import { Job, Company, JobType, WorkMode } from "@/types";
import { BackendPublicJob } from "@/types/api";
import { getCompanyLogoUrl } from "@/lib/utils";

export interface JobFilterParams {
  search?: string;
  location?: string;
  jobType?: string;
  experience?: string;
  workMode?: string;
  company?: string;
  sortBy?: "newest" | "salaryHigh" | "salaryLow" | "latest" | "deadline" | "salary";
  page?: number;
  limit?: number;
}

// Convert backend EmploymentType to frontend JobType
export function mapEmploymentTypeToJobType(type: string): JobType {
  switch (type) {
    case "FULL_TIME":
      return "Full Time";
    case "PART_TIME":
      return "Part Time";
    case "INTERNSHIP":
      return "Internship";
    case "CONTRACT":
      return "Contract";
    case "REMOTE":
      return "Remote";
    default:
      return "Full Time";
  }
}

// Convert backend WorkMode to frontend WorkMode
export function mapWorkModeToFrontend(mode: string): WorkMode {
  switch (mode) {
    case "ON_SITE":
      return "On-site";
    case "REMOTE":
      return "Remote";
    case "HYBRID":
      return "Hybrid";
    default:
      return "On-site";
  }
}

// Map backend job to frontend Job interface
export function mapBackendJobToFrontend(bj: BackendPublicJob): Job {
  const skills = bj.jobSkills && Array.isArray(bj.jobSkills)
    ? bj.jobSkills.map((js) => js.skill?.name).filter(Boolean)
    : [];

  return {
    id: bj.id,
    title: bj.title,
    company: {
      id: bj.company?.id || bj.companyId,
      name: bj.company?.name || "Company",
      logo: getCompanyLogoUrl(bj.company, bj.company?.id || bj.companyId) || undefined,
      location: bj.company?.location || bj.location || "India",
      website: bj.company?.website || undefined,
      size: formatCompanySize(bj.company?.companySize || undefined),
      industry: bj.company?.industry || undefined,
      about: bj.company?.about || undefined,
      description: bj.company?.about || undefined,
    },
    location: bj.location,
    salaryMin: bj.isSalaryDisclosed && bj.salaryMin != null ? Number(bj.salaryMin) : undefined,
    salaryMax: bj.isSalaryDisclosed && bj.salaryMax != null ? Number(bj.salaryMax) : undefined,
    salaryCurrency: bj.salaryCurrency || "INR",
    experience: bj.maxExperience
      ? `${bj.minExperience}-${bj.maxExperience} Years`
      : (bj.minExperience === 0 ? "Fresher (0 Years)" : `${bj.minExperience}+ Years`),
    jobType: mapEmploymentTypeToJobType(bj.employmentType),
    workMode: mapWorkModeToFrontend(bj.workMode),
    skills: skills,
    description: bj.description || "",
    responsibilities: bj.responsibilities
      ? bj.responsibilities.split("\n").map((s) => s.trim()).filter(Boolean)
      : [],
    requirements: bj.requirements
      ? bj.requirements.split("\n").map((s) => s.trim()).filter(Boolean)
      : [],
    benefits: bj.benefits || [],
    postedDate: bj.publishedAt || bj.createdAt,
    deadline: bj.deadline || undefined,
    openings: bj.openings || 1,
    status: (bj.status === "PUBLISHED" ? "Published" : "Draft") as "Published" | "Draft",
    applicantsCount: 0,
    hasApplied: Boolean((bj as any).hasApplied),
    applicationId: (bj as any).applicationId || undefined,
  };
}

export const jobsService = {
  async getJobs(params?: JobFilterParams): Promise<Job[]> {
    try {
      const queryParams: Record<string, string | number> = {};
      if (params?.search) queryParams.search = params.search;
      if (params?.location && params.location !== "All") queryParams.location = params.location;
      if (params?.page) queryParams.page = params.page;
      if (params?.limit) queryParams.limit = params.limit;

      // Map workMode filter
      if (params?.workMode && params.workMode !== "All") {
        const wmUpper = params.workMode.toUpperCase().replace("-", "_").replace(" ", "_");
        if (["ON_SITE", "REMOTE", "HYBRID"].includes(wmUpper)) {
          queryParams.workMode = wmUpper;
        }
      }

      // Map employmentType filter
      if (params?.jobType && params.jobType !== "All") {
        const jtUpper = params.jobType.toUpperCase().replace(" ", "_");
        if (["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT", "REMOTE"].includes(jtUpper)) {
          queryParams.employmentType = jtUpper;
        }
      }

      // Map sortBy
      if (params?.sortBy === "salaryHigh") {
        queryParams.sortBy = "salary";
        queryParams.sortOrder = "desc";
      } else if (params?.sortBy === "salaryLow") {
        queryParams.sortBy = "salary";
        queryParams.sortOrder = "asc";
      } else {
        queryParams.sortBy = "latest";
      }

      const response = await apiClient.get<{ success: boolean; data: { items: BackendPublicJob[]; total: number } }>("/jobs", {
        params: queryParams,
      });

      const items = response.data?.data?.items;
      if (Array.isArray(items)) {
        return items.map(mapBackendJobToFrontend);
      }
      return [];
    } catch {
      return [];
    }
  },

  async getJobById(jobId: string): Promise<Job | null> {
    try {
      const response = await apiClient.get<{ success: boolean; data: BackendPublicJob }>(`/jobs/${jobId}`);
      if (response.data?.data) {
        return mapBackendJobToFrontend(response.data.data);
      }
      return null;
    } catch {
      return null;
    }
  },

  async getCompanies(): Promise<Company[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: { items: any[] } | any[] }>("/jobs?limit=50");
      const items = (response.data as any)?.data?.items || (response.data as any)?.data || [];
      const companyMap = new Map<string, Company>();

      if (Array.isArray(items)) {
        for (const item of items) {
          const comp = item.company;
          if (comp && comp.id && !companyMap.has(comp.id)) {
            companyMap.set(comp.id, {
              id: comp.id,
              name: comp.name || "Company",
              logo: getCompanyLogoUrl(comp, comp.id) || "",
              description: comp.about || comp.industry || "Hiring partner on WeGrow Skill Campus.",
              website: comp.website || "",
              industry: comp.industry || "Technology",
              location: comp.location || item.location || "India",
              size: comp.companySize || "50-200 employees",
              about: comp.about || "",
              status: "Approved",
              activeJobsCount: 1,
              joinedDate: item.createdAt || new Date().toISOString(),
            });
          } else if (comp && comp.id && companyMap.has(comp.id)) {
            const existing = companyMap.get(comp.id)!;
            existing.activeJobsCount += 1;
          }
        }
      }
      return Array.from(companyMap.values());
    } catch {
      return [];
    }
  },

  async getBrowseJobsPageData(params?: JobFilterParams): Promise<import("@/types").StudentBrowseJobsPageData> {
    try {
      const jobs = await this.getJobs(params);
      const studentBrowseItems = jobs.map((j) => ({
        id: j.id,
        title: j.title,
        company: {
          id: j.company.id,
          name: j.company.name,
          logo: j.company.logo,
          location: j.company.location,
          initials: j.company.name.slice(0, 3).toUpperCase(),
        },
        verified: true,
        location: j.location,
        jobType: j.jobType,
        workMode: j.workMode,
        experience: j.experience,
        salaryText: j.salaryMin && j.salaryMax
          ? `Rs ${Math.round(j.salaryMin / 100000)} - ${Math.round(j.salaryMax / 100000)} LPA`
          : "Not Disclosed",
        skills: j.skills,
        overflowSkillsCount: Math.max(0, j.skills.length - 3),
        postedAgo: "Recently",
        isBookmarked: false,
        hasApplied: j.hasApplied,
        applicationId: j.applicationId,
      }));

      // Derive top companies dynamically from real job listings
      const companyCountMap = new Map<string, { id: string; name: string; logo?: string; openings: number }>();
      for (const j of jobs) {
        if (!companyCountMap.has(j.company.id)) {
          companyCountMap.set(j.company.id, {
            id: j.company.id,
            name: j.company.name,
            logo: j.company.logo,
            openings: 1,
          });
        } else {
          companyCountMap.get(j.company.id)!.openings += 1;
        }
      }

      const topCompanies = Array.from(companyCountMap.values()).map((c) => ({
        id: c.id,
        name: c.name,
        openings: `${c.openings} Opening${c.openings > 1 ? "s" : ""}`,
        logo: getCompanyLogoUrl(c, c.id) || undefined,
        logoColor: "bg-blue-50 text-[#1E5BE0]",
        initials: c.name.slice(0, 3).toUpperCase(),
      }));

      const latestJobs = jobs.slice(0, 5).map((j) => ({
        id: j.id,
        title: j.title,
        companyCity: `${j.company.name} - ${j.location}`,
        timeAgo: "Recently",
        logo: getCompanyLogoUrl(j.company, j.company.id) || undefined,
        initials: j.company.name.slice(0, 3).toUpperCase(),
      }));

      return {
        totalJobsCount: studentBrowseItems.length,
        jobs: studentBrowseItems,
        topCompanies,
        latestJobs,
        profileCompletion: {
          percentage: 0,
          checklist: [],
        },
      };
    } catch {
      return {
        totalJobsCount: 0,
        jobs: [],
        topCompanies: [],
        latestJobs: [],
        profileCompletion: {
          percentage: 0,
          checklist: [],
        },
      };
    }
  },
};

export default jobsService;
