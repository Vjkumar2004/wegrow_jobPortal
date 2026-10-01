import React from "react";
import { jobsService } from "@/services/jobs.service";
import StudentBrowseJobsClient from "./StudentBrowseJobsClient";

export const metadata = {
  title: "Browse Jobs | WeGrow Skill Campus",
  description: "Explore 512+ verified campus opportunities, tech roles, and internships with top recruiters.",
};

interface StudentJobsPageProps {
  searchParams: Promise<{
    search?: string;
    location?: string;
    jobType?: string;
    experience?: string;
    workMode?: string;
    company?: string;
    sortBy?: "newest" | "salaryHigh" | "salaryLow";
  }>;
}

export default async function StudentJobsPage(props: StudentJobsPageProps) {
  const resolvedSearchParams = await props.searchParams;

  // Backend fetch with graceful verified mock fallback
  const initialData = await jobsService.getBrowseJobsPageData(resolvedSearchParams);

  return <StudentBrowseJobsClient initialData={initialData} />;
}
