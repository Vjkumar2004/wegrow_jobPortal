import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { jobsService } from "@/services/jobs.service";
import { StudentLayout } from "@/layouts/StudentLayout";
import StudentJobDetailsClient from "./StudentJobDetailsClient";

interface StudentJobDetailsProps {
  params: Promise<{
    jobId: string;
  }>;
}

export async function generateMetadata({ params }: StudentJobDetailsProps): Promise<Metadata> {
  const { jobId } = await params;
  const job = await jobsService.getJobById(jobId);

  if (!job) {
    return {
      title: "Job Not Found | Student Portal",
    };
  }

  return {
    title: `${job.title} at ${job.company.name} | WeGrow Skill Campus`,
    description: job.description.slice(0, 160),
  };
}

export default async function StudentJobDetailsPage({ params }: StudentJobDetailsProps) {
  const { jobId } = await params;
  const [job, allJobs] = await Promise.all([
    jobsService.getJobById(jobId),
    jobsService.getJobs({ limit: 4 }),
  ]);

  if (!job) {
    notFound();
  }

  const similarJobs = allJobs.filter((j) => j.id !== jobId).slice(0, 3);

  return (
    <StudentLayout>
      <StudentJobDetailsClient job={job} similarJobs={similarJobs} />
    </StudentLayout>
  );
}
