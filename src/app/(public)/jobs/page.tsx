import React from "react";
import { jobsService } from "@/services/jobs.service";
import JobsClient from "./JobsClient";

export const metadata = {
  title: "Explore Jobs & Internships | WeGrow Skill Campus",
  description: "Browse verified software, design, marketing, and business jobs and internships with top companies across India.",
};

interface JobsPageProps {
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

export default async function JobsPage(props: JobsPageProps) {
  const resolvedSearchParams = await props.searchParams;
  const initialJobs = await jobsService.getJobs(resolvedSearchParams);

  return (
      <JobsClient initialJobs={initialJobs} initialParams={resolvedSearchParams} />
  );
}

