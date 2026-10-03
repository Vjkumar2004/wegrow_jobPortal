export type Role = 'STUDENT' | 'HR' | 'ADMIN';

export type JobType = 'Full Time' | 'Part Time' | 'Internship' | 'Contract' | 'Remote';
export type WorkMode = 'On-site' | 'Remote' | 'Hybrid';
export type ApplicationStatus = 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';
export type InterviewType = 'Technical' | 'HR Discussion' | 'Managerial' | 'Screening';
export type CompanyApprovalStatus = 'Pending' | 'Approved' | 'Suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
}

export interface Job {
  id: string;
  title: string;
  company: {
    id: string;
    name: string;
    logo?: string;
    location: string;
    website?: string;
    size?: string;
    industry?: string;
    about?: string;
    description?: string;
  };
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  experience: string;
  jobType: JobType;
  workMode: WorkMode;
  skills: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  qualifications?: string[];
  benefits?: string[];
  postedDate: string;
  deadline?: string;
  openings?: number;
  status: 'Published' | 'Draft' | 'Paused' | 'Closed';
  applicantsCount?: number;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  applicantCollege?: string;
  applicantGradYear?: string;
  applicantExperience?: string;
  appliedDate: string;
  status: ApplicationStatus;
  resumeUrl?: string;
  notes?: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  jobTitle: string;
  companyName: string;
  candidateName: string;
  candidateEmail: string;
  date: string;
  time: string;
  type: InterviewType;
  meetingLink?: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  notes?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  headline: string;
  bio: string;
  location: string;
  dateOfBirth?: string;
  gender?: string;
  degreeName?: string;
  experienceLevel?: string;
  photoUrl?: string;
  completionPercentage: number;
  checklist?: Array<{ label: string; done: boolean; countText?: string }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    startYear: string;
    endYear: string;
    grade?: string;
    cgpa?: string;
  }>;
  skills: string[];
  projects: Array<{
    id: string;
    title: string;
    subtitle?: string;
    description: string;
    link?: string;
    dateText?: string;
    thumbnailUrl?: string;
    technologies: string[];
  }>;
  internships: Array<{
    id: string;
    role: string;
    company: string;
    companyLogo?: string;
    duration: string;
    bullets?: string[];
    description?: string;
  }>;
  certifications?: Array<{
    id: string;
    title: string;
    issuer: string;
    issueDate: string;
    credentialUrl?: string;
  }>;
  resumeName?: string;
  resumeUrl?: string;
  resumeUploadDate?: string;
  resumeFileSize?: string;
  isAtsOptimized?: boolean;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  careerPreferences?: {
    preferredRoles: string;
    preferredLocations: string;
    employmentType: string;
    expectedSalary: string;
    joiningTimeline: string;
  };
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
  industry: string;
  location: string;
  size: string;
  about: string;
  status: CompanyApprovalStatus;
  activeJobsCount: number;
  joinedDate: string;
  tagline?: string;
  culture?: string;
  hrEmail?: string;
  hrPhone?: string;
  recruiterName?: string;
  recruiterAvatar?: string;
}

export interface StudentDashboardStats {
  jobsApplied: number;
  jobsAppliedTrend: string;
  interviews: number;
  interviewsTrend: string;
  shortlisted: number;
  shortlistedTrend: string;
  offers: number;
  offersTrend: string;
}

export interface ApplicationStatusBreakdown {
  name: string;
  value: number;
  color: string;
}

export interface ApplicationMonthlyTrend {
  month: string;
  applications: number;
}

export interface StudentReportsData {
  summary: {
    totalApplications: number;
    shortlisted: number;
    interviews: number;
    offers: number;
    successRate: string;
    profileViews: number;
    avgResponseDays: number;
  };
  monthlyTrends: Array<{
    month: string;
    applied: number;
    shortlisted: number;
    interviews: number;
  }>;
  statusFunnel: Array<{
    stage: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  domainPerformance: Array<{
    domain: string;
    applications: number;
    shortlisted: number;
    rate: string;
  }>;
  interviewBreakdown: Array<{
    type: string;
    count: number;
    color: string;
  }>;
  topSkillsDemand: Array<{
    skill: string;
    matchCount: number;
    percentage: number;
  }>;
}

export interface StudentNotificationItem {
  id: string;
  title: string;
  subtitle: string;
  timeAgo: string;
  type: 'green' | 'blue' | 'orange' | 'purple';
}

export interface StudentDashboardData {
  student: {
    id: string;
    name: string;
    email: string;
    course: string;
    college: string;
    avatarUrl?: string;
  };
  stats: StudentDashboardStats;
  profileCompletion: {
    percentage: number;
    checklist: Array<{ label: string; done: boolean }>;
  };
  applicationStatus: ApplicationStatusBreakdown[];
  applicationTrends: ApplicationMonthlyTrend[];
  recommendedJobs: Job[];
  recentApplications: Application[];
  upcomingInterviews: Interview[];
  notifications: StudentNotificationItem[];
}

export interface StudentBrowseJobItem {
  id: string;
  title: string;
  company: {
    id: string;
    name: string;
    logo?: string;
    location?: string;
    initials?: string;
  };
  verified: boolean;
  location: string;
  jobType: string;
  workMode: string;
  experience: string;
  salaryText: string;
  skills: string[];
  overflowSkillsCount?: number;
  postedAgo: string;
  isBookmarked?: boolean;
}

export interface TopCompanyHiring {
  id: string;
  name: string;
  openings: string;
  logo?: string;
  logoColor?: string;
  initials?: string;
}

export interface LatestJobSidebarItem {
  id: string;
  title: string;
  companyCity: string;
  timeAgo: string;
  logo?: string;
  initials?: string;
}

export interface StudentBrowseJobsPageData {
  jobs: StudentBrowseJobItem[];
  totalJobsCount: number;
  topCompanies: TopCompanyHiring[];
  latestJobs: LatestJobSidebarItem[];
  profileCompletion: {
    percentage: number;
    checklist: Array<{ label: string; done: boolean }>;
  };
}

export interface StudentApplicationProgressStep {
  name: string;
  date?: string;
  status: 'done' | 'current' | 'upcoming';
  stepNumber?: number;
}

export interface StudentApplicationTrackerItem {
  id: string;
  jobId: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  companyInitials?: string;
  companyLogoBg?: string;
  appliedDateText: string;
  location: string;
  jobType: string;
  experience: string;
  status: 'Interview' | 'Under Review' | 'Shortlisted' | 'Applied' | 'Selected' | 'Rejected';
  statusUpdateText: string;
  interviewDateText?: string;
  steps: StudentApplicationProgressStep[];
}

export interface StudentApplicationsPageData {
  stats: {
    totalApplied: number;
    underReview: number;
    shortlisted: number;
    interviews: number;
    selected: number;
    rejected: number;
  };
  monthlyStats: Array<{
    month: string;
    value: number;
  }>;
  applications: StudentApplicationTrackerItem[];
  topCompaniesApplied: Array<{
    id: string;
    name: string;
    countText: string;
    companyLogo?: string;
    initials?: string;
    logoColor?: string;
  }>;
  profileCompletion: {
    percentage: number;
    checklist: Array<{ label: string; done: boolean }>;
  };
}

export interface StudentAdmin {
  id: string;
  name: string;
  email: string;
  college: string;
  gradYear: string;
  completionPercentage: number;
  applicationsCount: number;
  status: string;
}
