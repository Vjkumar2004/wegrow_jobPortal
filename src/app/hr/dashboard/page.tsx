import React from "react";
import { HRLayout } from "@/layouts/HRLayout";
import { hrService } from "@/services/hr.service";
import HRDashboardClient from "./HRDashboardClient";

export const metadata = {
  title: "Recruiter Dashboard | WeGrow Skill Campus",
  description: "Manage candidate talent pools, campus interview pipelines, and company job listings.",
};

export default async function HRDashboardPage() {
  const [jobs, applicants, interviews] = await Promise.all([
    hrService.getMyJobs(),
    hrService.getApplicants(),
    hrService.getInterviews(),
  ]);

  return (
    <HRLayout>
      <HRDashboardClient
        initialJobs={jobs}
        initialApplicants={applicants}
        initialInterviews={interviews}
      />
    </HRLayout>
  );
}
