import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { jobsService } from "@/services/jobs.service";
import JobDetailsClient from "./JobDetailsClient";

interface JobDetailsProps {
  params: Promise<{
    jobId: string;
  }>;
}

export async function generateMetadata({ params }: JobDetailsProps): Promise<Metadata> {
  const { jobId } = await params;
  const job = await jobsService.getJobById(jobId);

  if (!job) {
    return {
      title: "Job Not Found | WeGrow Skill Campus",
    };
  }

  return {
    title: `${job.title} at ${job.company.name} | WeGrow Job Portal`,
    description: job.description.slice(0, 160),
  };
}

export default async function JobDetailsPage({ params }: JobDetailsProps) {
  const { jobId } = await params;
  const job = await jobsService.getJobById(jobId);

  if (!job) {
    notFound();
  }

  return <JobDetailsClient job={job} />;
}
