export type PackageTier = "standard" | "professional" | "end-to-end" | "workforce-partner";

export interface RecruitmentPackage {
  id: PackageTier;
  name: string;
  tagline: string;
  price: string;
  unit: string;
  isPopular?: boolean;
  ctaText: string;
  description: string;
  features: string[];
  notIncluded?: string[];
  billingNote: string;
}

export interface ComparisonRow {
  service: string;
  category?: string;
  standard: boolean;
  professional: boolean;
  endToEnd: boolean;
  workforcePartner: boolean;
}

export interface WorkflowStep {
  step: number;
  title: string;
  description: string;
  detail: string;
}

export interface PackageEnquirySubmission {
  id?: string;
  packageId: PackageTier;
  packageName: string;
  packagePrice: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  jobRole: string;
  vacancies: number;
  jobLocation: string;
  requiredSkills: string;
  salaryRange: string;
  additionalRequirements?: string;
  enquiryType: "package_selection" | "sales_contact";
  status?: "Submitted" | "Under Review" | "Team Assigned" | "In Sourcing";
  createdAt?: string;
  termsAcceptedVersion?: string;
  termsAcceptedAt?: string;
}

export interface TermsAcceptanceRecord {
  id: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  companyName?: string;
  companyId?: string;
  termsVersion: string;
  acceptedAt: string;
  ip?: string;
  userAgent?: string;
}
