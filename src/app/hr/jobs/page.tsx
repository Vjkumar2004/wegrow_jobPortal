import React from "react";
import Link from "next/link";
import { HRLayout } from "@/layouts/HRLayout";
import { hrService } from "@/services/hr.service";
import HRJobsClient from "./HRJobsClient";

export const metadata = {
  title: "Job Openings Management | WeGrow Recruiter",
};

export default async function HRJobsPage() {
  const initialJobs = await hrService.getMyJobs();

  return (
    <HRLayout>
      <HRJobsClient initialJobs={initialJobs} />
    </HRLayout>
  );
}
