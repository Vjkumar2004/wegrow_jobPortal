import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { jobsService } from "@/services/jobs.service";
import HRJobDetailPageClient from "./HRJobDetailPageClient";

interface HRJobDetailsProps {
  params: Promise<{
    jobId: string;
  }>;
}

export async function generateMetadata({ params }: HRJobDetailsProps): Promise<Metadata> {
  const { jobId } = await params;
  const job = await jobsService.getJobById(jobId);

  if (!job) {
    return {
      title: "Job Details | WeGrow Recruiter",
    };
  }

  return {
    title: `${job.title} - Job Details | WeGrow Recruiter`,
    description: job.description?.slice(0, 160) || "Campus recruitment opening details.",
  };
}

export default async function HRJobDetailsPage({ params }: HRJobDetailsProps) {
  const { jobId } = await params;
  const job = await jobsService.getJobById(jobId);

  if (!job) {
    notFound();
  }

  return <HRJobDetailPageClient job={job} />;
}
