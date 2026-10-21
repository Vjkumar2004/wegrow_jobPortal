import React from "react";
import { Metadata } from "next";
import { jobsService } from "@/services/jobs.service";
import JobsClient from "./JobsClient";

export const metadata: Metadata = {
  title: "Browse Jobs & Internships",
  description:
    "Explore latest full-time, part-time, and internship vacancies in IT, software, engineering, and corporate sectors across India with WeGrow Jobz.",
  alternates: {
    canonical: "https://www.wegrowjobz.com/jobs",
  },
  openGraph: {
    title: "Browse Jobs & Internships | WeGrow Jobz",
    description:
      "Explore latest full-time, part-time, and internship vacancies in IT, software, engineering, and corporate sectors across India with WeGrow Jobz.",
    url: "https://www.wegrowjobz.com/jobs",
    siteName: "WeGrow Jobz",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Browse Jobs on WeGrow Jobz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Jobs & Internships | WeGrow Jobz",
    description: "Find verified corporate jobs and campus placement drives across India.",
    images: ["/og-image.png"],
  },
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
