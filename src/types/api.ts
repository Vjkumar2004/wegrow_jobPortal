export type BackendUserRole = "STUDENT" | "HR" | "ADMIN";

export type BackendUserStatus =
  | "PENDING_VERIFICATION"
  | "ACTIVE"
  | "SUSPENDED";

export interface BackendUser {
  id: string;
  email: string;
  role: BackendUserRole;
  status: BackendUserStatus;
  isEmailVerified: boolean;
  name?: string;
  fullName?: string;
  createdAt?: string;
  studentProfile?: {
    id: string;
    fullName: string;
    phone?: string;
    college?: string;
    branch?: string;
    graduationYear?: number;
    cgpa?: number;
    completionPercentage?: number;
  } | null;
  hrProfile?: {
    id: string;
    fullName: string;
    designation?: string;
    phone?: string;
    isCompanyAdmin: boolean;
    companyId: string;
    company?: {
      id: string;
      name: string;
      logoUrl?: string;
      approvalStatus: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
    };
  } | null;
}

export interface BackendAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponseData {
  user: BackendUser;
  tokens: BackendAuthTokens;
}

export interface RegisterResponseData {
  user: BackendUser;
  requiresEmailVerification: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedData<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface BackendPublicJob {
  id: string;
  companyId: string;
  postedById: string;
  title: string;
  slug: string;
  description: string;
  responsibilities?: string | null;
  requirements?: string | null;
  eligibility?: string | null;
  employmentType: "FULL_TIME" | "PART_TIME" | "INTERNSHIP" | "CONTRACT" | "REMOTE";
  workMode: "ON_SITE" | "REMOTE" | "HYBRID";
  location: string;
  openings: number;
  minExperience: number;
  maxExperience?: number | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryPeriod: "HOURLY" | "MONTHLY" | "ANNUAL";
  salaryCurrency: string;
  isSalaryDisclosed: boolean;
  benefits: string[];
  deadline?: string | null;
  status: "DRAFT" | "PUBLISHED" | "PAUSED" | "CLOSED";
  viewsCount: number;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  company: {
    id: string;
    name: string;
    logoUrl?: string | null;
    location?: string | null;
    website?: string | null;
    about?: string | null;
    industry?: string | null;
    companySize?: string | null;
    approvalStatus: string;
  };
  jobSkills?: Array<{
    id: string;
    skill: {
      id: string;
      name: string;
    };
  }>;
  hasApplied?: boolean;
  applicationId?: string | null;
  applicantsCount?: number;
  _count?: {
    applications?: number;
    savedJobs?: number;
  };
}

export interface BackendStudentApplication {
  id: string;
  jobId: string;
  studentId: string;
  resumeId: string;
  coverLetter?: string | null;
  status: "APPLIED" | "SCREENING" | "SHORTLISTED" | "INTERVIEW" | "OFFERED" | "REJECTED" | "WITHDRAWN";
  appliedAt: string;
  updatedAt: string;
  job: {
    id: string;
    title: string;
    location: string;
    employmentType: string;
    workMode: string;
    minExperience: number;
    company: {
      id: string;
      name: string;
      logoUrl?: string | null;
    };
  };
  resume?: {
    id: string;
    name: string;
    fileUrl: string;
  };
}

export interface BackendInterview {
  id: string;
  applicationId: string;
  title: string;
  type: "TECHNICAL" | "HR_DISCUSSION" | "MANAGERIAL" | "SCREENING";
  scheduledStartAt: string;
  scheduledEndAt: string;
  meetingLink?: string | null;
  location?: string | null;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED" | "NO_SHOW";
  feedback?: string | null;
  createdAt: string;
  application?: {
    id: string;
    job?: {
      title: string;
      company?: {
        name: string;
        logoUrl?: string | null;
      };
    };
    student?: {
      id?: string;
      fullName: string;
      avatarUrl?: string | null;
      avatarStorageKey?: string | null;
      currentCollege?: string | null;
      user?: {
        email: string;
      };
    };
  };
}

export interface BackendEducation {
  id: string;
  studentId?: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  grade?: string;
  cgpa?: number | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendExperience {
  id: string;
  studentId?: string;
  company: string;
  title: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendProject {
  id: string;
  studentId?: string;
  title: string;
  description: string;
  projectUrl?: string;
  repoUrl?: string;
  startDate?: string;
  endDate?: string;
  technologies?: string[] | string;
  thumbnailUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendSkill {
  id: string;
  studentId?: string;
  name: string;
  proficiencyLevel?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  createdAt?: string;
}

export interface BackendResume {
  id: string;
  studentId?: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number | string;
  isPrimary?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
