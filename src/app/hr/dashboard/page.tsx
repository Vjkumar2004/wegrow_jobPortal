import React, { Suspense } from "react";
import HRDashboardClient from "./HRDashboardClient";

export const metadata = {
  title: "Recruiter Dashboard | WeGrow Skill Campus",
  description: "Manage candidate talent pools, campus interview pipelines, and company job listings.",
};

export default function HRDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading recruiter dashboard...</div>}>
      <HRDashboardClient
        initialJobs={[]}
        initialApplicants={[]}
        initialInterviews={[]}
      />
    </Suspense>
  );
}
