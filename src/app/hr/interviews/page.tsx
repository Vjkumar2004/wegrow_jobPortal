import React from "react";
import HRInterviewsClient from "./HRInterviewsClient";

export const metadata = {
  title: "Scheduled Interviews | WeGrow Recruiter",
  description: "Monitor upcoming candidate video rounds, Google Meet rooms, and panel evaluation notes.",
};

export default function HRInterviewsPage() {
  return <HRInterviewsClient initialInterviews={[]} />;
}
