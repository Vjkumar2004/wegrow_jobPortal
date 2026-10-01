import React from "react";
import { HRLayout } from "@/layouts/HRLayout";
import { hrService } from "@/services/hr.service";
import HRApplicantsClient from "./HRApplicantsClient";

export const metadata = {
  title: "Candidate Applicants | WeGrow Recruiter",
};

export default async function HRApplicantsPage() {
  const initialApplicants = await hrService.getApplicants();

  return (
    <HRLayout>
      <HRApplicantsClient initialApplicants={initialApplicants} />
    </HRLayout>
  );
}
