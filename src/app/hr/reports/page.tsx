import React from "react";
import { HRLayout } from "@/layouts/HRLayout";
import { hrService } from "@/services/hr.service";
import HRReportsClient from "./HRReportsClient";

export const metadata = {
  title: "Recruitment Reports & Analytics | WeGrow Recruiter",
  description: "Real-time pipeline metrics, applicant drop-off points, and candidate conversion stats.",
};

export default async function HRReportsPage() {
  const reports = await hrService.getReports();

  return (
    <HRLayout>
      <HRReportsClient initialReports={reports} />
    </HRLayout>
  );
}
