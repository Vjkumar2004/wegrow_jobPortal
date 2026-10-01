import React from "react";
import { HRLayout } from "@/layouts/HRLayout";
import { hrService } from "@/services/hr.service";
import HRInterviewsClient from "./HRInterviewsClient";

export const metadata = {
  title: "Scheduled Interviews | WeGrow Recruiter",
  description: "Monitor upcoming candidate video rounds, Google Meet rooms, and panel evaluation notes.",
};

export default async function HRInterviewsPage() {
  const interviews = await hrService.getInterviews();

  return (
    <HRLayout>
      <HRInterviewsClient initialInterviews={interviews} />
    </HRLayout>
  );
}
