import React from "react";
import HRJobsClient from "./HRJobsClient";

export const metadata = {
  title: "Job Openings Management | WeGrow Recruiter",
};

export default function HRJobsPage() {
  return <HRJobsClient initialJobs={[]} />;
}
