import React from "react";
import HRApplicantsClient from "./HRApplicantsClient";

export const metadata = {
  title: "Candidate Applicants | WeGrow Recruiter",
};

export default function HRApplicantsPage() {
  return <HRApplicantsClient initialApplicants={[]} />;
}
