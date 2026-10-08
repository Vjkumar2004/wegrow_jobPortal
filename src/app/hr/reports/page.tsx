import React from "react";
import HRReportsClient from "./HRReportsClient";

export const metadata = {
  title: "Recruitment Reports & Analytics | WeGrow Recruiter",
  description: "Real-time pipeline metrics, applicant drop-off points, and candidate conversion stats.",
};

export default function HRReportsPage() {
  return <HRReportsClient initialReports={null} />;
}
